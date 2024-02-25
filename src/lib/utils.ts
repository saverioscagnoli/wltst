function isYoutubeUrl(url: string) {
  return /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/.test(url);
}

export { isYoutubeUrl };
