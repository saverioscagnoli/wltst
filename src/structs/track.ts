import { AudioResource, createAudioResource } from "@discordjs/voice";
import { TrackType, YTDL_DEFAULT_OPTIONS, isYoutubeUrl } from "@lib";
import yts from "yt-search";
import ytdl from "ytdl-core";

class Track {
  private source: AudioResource<null>;

  public static async build(query: string, type: TrackType) {
    return new Track(await Track.createResource(query, type));
  }

  private constructor(resource: AudioResource<null>) {
    this.source = resource;
  }

  private static async createResource(query: string, type: TrackType) {
    let resource: AudioResource<null>;

    switch (type) {
      case TrackType.YoutubeUrl:
        {
          resource = createAudioResource(ytdl(query, YTDL_DEFAULT_OPTIONS));
        }
        break;
      case TrackType.Query:
        {
          let r = await yts(query);
          let video = r.videos[0];
          resource = createAudioResource(ytdl(video.url, YTDL_DEFAULT_OPTIONS));
        }
        break;

      default:
        throw new Error("Invalid track type");
    }

    return resource;
  }

  public getSource() {
    return this.source;
  }
}

export { Track };
