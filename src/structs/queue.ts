import {
  AudioPlayer,
  AudioPlayerStatus,
  VoiceConnection,
  VoiceConnectionStatus,
  createAudioPlayer
} from "@discordjs/voice";
import { queues } from "@main";
import { Track } from "./track";
import {
  DEFAULT_EMBED_COLOR,
  isDirectAudioUrl,
  isYoutubePlaylistUrl,
  isYoutubeUrl
} from "@lib";
import { getVideoUrlsFromPlaylist, youtubeSearch } from "@yt";
import { EmbedBuilder, TextBasedChannel } from "discord.js";

interface QueueOptions {
  connection: VoiceConnection;
  channel: TextBasedChannel;
}

class Queue {
  private connection: VoiceConnection;
  private channel: TextBasedChannel;
  private player: AudioPlayer;
  private tracks: Track[];

  public nowPlaying: Track | null;

  public constructor({ connection, channel }: QueueOptions) {
    this.connection = connection;
    this.channel = channel;
    this.player = createAudioPlayer();
    this.tracks = [];

    this.nowPlaying = null;
  }

  public getLength() {
    return this.tracks.length;
  }

  public async addTrack(trackQuery: string) {
    if (isYoutubePlaylistUrl(trackQuery)) {
      let id = trackQuery.split("&list=")[1];
      let trackUrls = await getVideoUrlsFromPlaylist(id);

      let tracks: Track[] = [];

      for (let url of trackUrls) {
        let track = await Track.fromUrl(url);
        this.tracks.push(track);
        tracks.push(track);
      }

      return tracks;
    } else {
      let url = trackQuery;

      if (!isYoutubeUrl(trackQuery) && !isDirectAudioUrl(trackQuery)) {
        url = await youtubeSearch(trackQuery);
      }

      let track = await Track.fromUrl(url);
      this.tracks.push(track);

      return [track];
    }
  }

  public play() {
    this.connection.subscribe(this.player);

    this.playTrack();

    this.player.on(AudioPlayerStatus.Idle, async () => {
      if (this.getLength() === 0) {
        await this.end("Queue has ended. See ya suckers! 👋");
        return;
      }

      this.playTrack();

      await Track.sendEmbed(this.nowPlaying!, this.channel);
    });

    this.connection.on(VoiceConnectionStatus.Disconnected, async () => {
      await this.end("I have been kicked! :(");
    });
  }

  public skip(n: number) {
    for (let i = 0; i < n - 1; i++) {
      this.tracks.shift();
    }

    this.player.stop();
  }

  public pause() {
    this.player.pause();
  }

  public resume() {
    this.player.unpause();
  }

  public isPaused() {
    return this.player.state.status === AudioPlayerStatus.Paused;
  }

  public async end(msg?: string) {
    this.connection.destroy();
    queues.delete(this.connection.joinConfig.guildId);

    if (msg) {
      await this.channel.send(msg);
    }
  }

  private playTrack() {
    let track = this.tracks.shift()!;
    let resource = track.getSource();

    this.player.play(resource);
    this.nowPlaying = track;
  }

  public toEmbed(guildName: string, guildIcon?: string) {
    return new EmbedBuilder()
      .setAuthor({
        name: `Queue for ${guildName}`,
        iconURL: guildIcon
      })
      .setDescription(
        `Now Playing: **[${this.nowPlaying?.title}](${this.nowPlaying?.url})**\n\n` +
          this.tracks
            .map(
              (track, i) =>
                `**\`${i + 1}.\`** - **[${track.title}](${track.url})**`
            )
            .join("\n")
      )
      .setThumbnail(this.nowPlaying?.thumbnail!)
      .setColor(DEFAULT_EMBED_COLOR);
  }
}

export { Queue };
