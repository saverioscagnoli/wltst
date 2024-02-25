import { Console } from "console";
import { Transform } from "stream";

function table<T>(input: T[]) {
  let ts = new Transform({
    transform(chunk, enc, cb) {
      cb(null, chunk);
    }
  });

  let logger = new Console({ stdout: ts });

  logger.table(input);

  let table = (ts.read() || "").toString();
  let result = "";

  for (let row of table.split(/[\r\n]+/)) {
    let r = row.replace(/[^┬]*┬/, "┌");
    r = r.replace(/^├─*┼/, "├");
    r = r.replace(/│[^│]*/, "");
    r = r.replace(/^└─*┴/, "└");
    r = r.replace(/'/g, " ");
    result += `${r}\n`;
  }

  console.log(result);
}

function isYoutubeUrl(url: string) {
  return /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/.test(url);
}

function isYoutubePlaylistUrl(url: string) {
  return /^https?:\/\/(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]list=))([^\/\n\s]{34})/.test(
    url
  );
}

function formSearchRequestUrl(query: string) {
  return `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${query}&key=${process.env.YT_API_KEY}`;
}

function formPlaylistRequestUrl(id: string) {
  return `https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&maxResults=50&playlistId=${id}&key=${process.env.YT_API_KEY}`;
}

export {
  table,
  isYoutubeUrl,
  isYoutubePlaylistUrl,
  formPlaylistRequestUrl,
  formSearchRequestUrl
};
