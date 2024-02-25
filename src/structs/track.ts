import { createAudioResource } from "@discordjs/voice";
import { YTDL_DEFAULT_OPTIONS } from "@lib";
import { EmbedBuilder } from "discord.js";
import ytdl from "ytdl-core";

class Track {
  public title: string;
  private author: ytdl.Author;
  private thumbnail: string;
  private url: string;

  public constructor(
    title: string,
    author: ytdl.Author,
    thumbnail: string,
    url: string
  ) {
    this.title = title;
    this.author = author;
    this.thumbnail = thumbnail;
    this.url = url;
  }

  public static async fromInfo(url: string) {
    let { videoDetails: info } = await ytdl.getBasicInfo(url);

    return new Track(
      info.title,
      info.author,
      info.thumbnails[0].url,
      info.video_url
    );
  }

  public getSource() {
    return createAudioResource(ytdl(this.url, YTDL_DEFAULT_OPTIONS));
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
