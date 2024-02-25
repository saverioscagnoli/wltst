import ytdl from "ytdl-core";

const YTDL_DEFAULT_OPTIONS: ytdl.downloadOptions = {
  filter: "audioonly",
  quality: "highestaudio",
  highWaterMark: 4e6
};

export { YTDL_DEFAULT_OPTIONS };
