import ytdl from "ytdl-core";

const YTDL_DEFAULT_OPTIONS: ytdl.downloadOptions = {
  filter: "audioonly",
  quality: "highestaudio",
  highWaterMark: 4e6
};

const DEFAULT_EMBED_COLOR = 0x008080;
const YT_BASE_URL = "https://www.youtube.com/watch?v=";

export { YTDL_DEFAULT_OPTIONS, DEFAULT_EMBED_COLOR, YT_BASE_URL };
