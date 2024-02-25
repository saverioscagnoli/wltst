import { AudioResource, createAudioResource } from "@discordjs/voice";
import { TrackType, YTDL_DEFAULT_OPTIONS } from "@lib";
import { EmbedBuilder } from "discord.js";
import { search } from "@yt";
import ytdl from "ytdl-core";

class Track {
  public title: string;
  private author: ytdl.Author;
  private thumbnail: string;
  private url: string;
  private source: AudioResource<null>;

  public static async build(query: string, type: TrackType) {
    let [resource, info] = await Track.createResource(query, type);

    return new Track(
      info.title,
      info.author,
      info.thumbnail,
      info.url,
      resource
    );
  }

  private constructor(
    title: string,
    author: ytdl.Author,
    thumbnail: string,
    url: string,
    resource: AudioResource<null>
  ) {
    this.title = title;
    this.author = author;
    this.thumbnail = thumbnail;
    this.url = url;
    this.source = resource;
  }

  private static async createResource(query: string, type: TrackType) {
    let resource: AudioResource<null>;

    let title: string;
    let author: ytdl.Author;
    let thumbnail: string;
    let url: string;

    switch (type) {
      case TrackType.YoutubeUrl:
        {
          let info = await ytdl.getInfo(query);
          let video = info.videoDetails;
          title = video.title;
          author = video.author;
          thumbnail = video.thumbnails[0].url;
          url = video.video_url;

          resource = createAudioResource(ytdl(query, YTDL_DEFAULT_OPTIONS));
        }
        break;
      case TrackType.Query:
        {
          let firstUrl = await search(query);

          let info = await ytdl.getInfo(firstUrl);
          let video = info.videoDetails;

          title = video.title;
          author = video.author;
          thumbnail = video.thumbnails[0].url;
          url = video.video_url;

          resource = createAudioResource(
            ytdl(video.video_url, YTDL_DEFAULT_OPTIONS)
          );
        }
        break;

      default:
        throw new Error("Invalid track type");
    }

    return [resource, { title, author, thumbnail, url }] as const;
  }

  public getSource() {
    return this.source;
  }

  public toEmbed() {
    return new EmbedBuilder()
      .setTitle(this.title)
      .setURL(this.url)
      .setImage(this.thumbnail)
      .setColor(0x00b3b3)
      .setFooter({
        text: this.author.name,
        iconURL: this.author.thumbnails?.[0].url
      });
  }
}

export { Track };
