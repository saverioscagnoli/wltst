import {
  YT_BASE_URL,
  formPlaylistRequestUrl,
  formSearchRequestUrl
} from "@lib";
import { fetch } from "undici";
import { PlaylistResponse, SearchResponse } from "./types";

async function youtubeSearch(query: string) {
  let url = formSearchRequestUrl(query);
  let res = await fetch(url);

  let json = (await res.json()) as SearchResponse;

  return YT_BASE_URL + json.items[0].id.videoId;
}

async function getVideoUrlsFromPlaylist(id: string) {
  let urls: string[] = [];

  let url = formPlaylistRequestUrl(id);
  let res = await fetch(url);
  let json = (await res.json()) as PlaylistResponse;

  for (let item of json.items) {
    urls.push(YT_BASE_URL + item.contentDetails.videoId);
  }

  return urls;
}

export { youtubeSearch, getVideoUrlsFromPlaylist };
