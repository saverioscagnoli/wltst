import { createAudioResource } from "@discordjs/voice";
import {
  DEFAULT_EMBED_COLOR,
  Paths,
  TrackType,
  YTDL_DEFAULT_OPTIONS,
  isYoutubeUrl
} from "@lib";
import { AttachmentBuilder, EmbedBuilder, TextBasedChannel } from "discord.js";
import ytdl from "ytdl-core";
import { Readable } from "stream";
import path from "path";
import { Interaction } from "./slash-command";

class Track {
  public title: string;
  public author: ytdl.Author | null;
  public thumbnail: string;
  public url: string;

  private type: TrackType;

  public constructor(
    title: string,
    author: ytdl.Author | null,
    thumbnail: string,
    url: string,
    type: TrackType
  ) {
    this.title = title;
    this.author = author;
    this.thumbnail = thumbnail;
    this.url = url;
    this.type = type;
  }

  public static async fromUrl(url: string) {
    let info:
      | ytdl.MoreVideoDetails
      | { title: string; url: string; thumbnail: string };
    let type: TrackType;

    if (isYoutubeUrl(url)) {
      let req = await ytdl.getBasicInfo(url);

      info = req.videoDetails;
      type = TrackType.YoutubeUrl;

      return new Track(
        info.title,
        info.author,
        info.thumbnails[0].url,
        url,
        type
      );
    } else {
      let title = url.split("/").pop() || "Unknown";

      info = {
        title,
        url,
        thumbnail: path.join(Paths.Assets, "vinyl-spin.gif")
      };
      type = TrackType.DirectUrl;

      return new Track(info.title, null, info.thumbnail, url, type);
    }
  }

  public getSource() {
    let arg: string | Readable;

    switch (this.type) {
      case TrackType.YoutubeUrl: {
        arg = ytdl(this.url, YTDL_DEFAULT_OPTIONS);
        break;
      }
      case TrackType.DirectUrl: {
        arg = this.url;
        break;
      }

      default: {
        throw new Error("Invalid track type");
      }
    }

    return createAudioResource(arg);
  }

  public toEmbed() {
    let embed = new EmbedBuilder()
      .setTitle(this.title)
      .setURL(this.url)
      .setColor(DEFAULT_EMBED_COLOR);

    if (this.author) {
      embed.setFooter({
        text: this.author.name,
        iconURL: this.author.thumbnails![0].url
      });
    }

    if (this.type === TrackType.DirectUrl) {
      let attachment = new AttachmentBuilder(
        path.join(Paths.Assets, "vinyl-spin.gif"),
        { name: "vinyl-spin.gif" }
      );

      embed.setImage("attachment://vinyl-spin.gif");

      return [embed, attachment] as const;
    } else {
      embed.setImage(this.thumbnail);
    }

    return [embed, null] as const;
  }

  public static async sendEmbed(
    track: Track,
    intOrChannel: Interaction | TextBasedChannel
  ) {
    let [embed, attachment] = track.toEmbed();

    if ("editReply" in intOrChannel) {
      await intOrChannel.editReply({
        embeds: [embed],
        files: attachment ? [attachment] : undefined
      });
    } else {
      await intOrChannel.send({
        embeds: [embed],
        files: attachment ? [attachment] : undefined
      });
    }
  }
}

export { Track };
