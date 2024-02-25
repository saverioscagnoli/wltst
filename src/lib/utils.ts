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
  isYoutubeUrl,
  isYoutubePlaylistUrl,
  formPlaylistRequestUrl,
  formSearchRequestUrl
};
