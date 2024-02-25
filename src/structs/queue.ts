import {
  AudioPlayer,
  AudioPlayerStatus,
  VoiceConnection,
  createAudioPlayer
} from "@discordjs/voice";
import { queues } from "@main";
import { Track } from "./track";
import { TrackType, isYoutubePlaylistUrl, isYoutubeUrl } from "@lib";
import { getVideoUrlsFromPlaylist } from "@yt";
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
    let type: TrackType;

    if (isYoutubePlaylistUrl(trackQuery)) {
      let trackUrls = await getVideoUrlsFromPlaylist(
        trackQuery.split("&list=")[1]
      );

      let tracks: Track[] = [];

      for (let url of trackUrls) {
        let track = await Track.build(url, TrackType.YoutubeUrl);
        this.tracks.push(track);
        tracks.push(track);
      }

      return tracks[0];
    } else if (isYoutubeUrl(trackQuery)) {
      type = TrackType.YoutubeUrl;
    } else {
      type = TrackType.Query;
    }

    let track = await Track.build(trackQuery, type);
    this.tracks.push(track);

    return track;
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
