import {
  AudioPlayer,
  AudioPlayerStatus,
  VoiceConnection,
  createAudioPlayer
} from "@discordjs/voice";
import { queues } from "@main";
import { Track } from "./track";
import { TrackType, isYoutubeUrl } from "@lib";

interface QueueOptions {
  connection: VoiceConnection;
}

class Queue {
  private connection: VoiceConnection;
  private player: AudioPlayer;
  private tracks: Track[];
  
  public nowPlaying: Track | null;

  public constructor({ connection }: QueueOptions) {
    this.connection = connection;
    this.player = createAudioPlayer();
    this.tracks = [];
    this.nowPlaying = null;
  }

  public getLength() {
    return this.tracks.length;
  }

  public async addTrack(trackQuery: string) {
    let type: TrackType;

    if (isYoutubeUrl(trackQuery)) {
      type = TrackType.YoutubeUrl;
    } else {
      type = TrackType.Query;
    }

    let track = await Track.build(trackQuery, type);
    this.tracks.push(track);
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
