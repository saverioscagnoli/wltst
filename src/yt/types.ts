type SearchResponse = {
  items: { id: { videoId: string } }[];
};

type PlaylistResponse = {
  items: { contentDetails: { videoId: string } }[];
};

export type { SearchResponse, PlaylistResponse };
