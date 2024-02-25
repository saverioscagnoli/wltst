import {
  AudioPlayer,
  AudioPlayerStatus,
  VoiceConnection,
  createAudioPlayer
} from "@discordjs/voice";
import { queues } from "@main";
import { Track } from "./track";
import { isYoutubePlaylistUrl, isYoutubeUrl } from "@lib";
import { getVideoUrlsFromPlaylist, youtubeSearch } from "@yt";
import { TextBasedChannel } from "discord.js";

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
        let track = await Track.fromInfo(url);
        this.tracks.push(track);
        tracks.push(track);
      }

      return tracks[0];
    } else {
      let url = trackQuery;

      if (!isYoutubeUrl(trackQuery)) {
        url = await youtubeSearch(trackQuery);
      }

      let track = await Track.fromInfo(url);
      this.tracks.push(track);

      return track;
    }
  }

  public play() {
    this.connection.subscribe(this.player);

    this.playTrack();

    this.player.on(AudioPlayerStatus.Idle, async () => {
      if (this.getLength() === 0) {
        this.connection.destroy();
        queues.delete(this.connection.joinConfig.guildId);
        return;
      }

      this.playTrack();
      await this.channel.send({ embeds: [this.nowPlaying!.toEmbed()] });
    });
  }

  private playTrack() {
    let track = this.tracks.shift()!;
    let resource = track.getSource();

    this.player.play(resource);
    this.nowPlaying = track;
  }
}

export { Queue };
