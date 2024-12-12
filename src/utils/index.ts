const isTelegramLink = (url: string) => {
  const prefix = 'https://t.me/';
  return url.startsWith(prefix);
};

export { isTelegramLink };
