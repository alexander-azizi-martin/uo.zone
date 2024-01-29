export function trackEvent(event: string, data?: object) {
  if (typeof window === 'undefined') return;
  if ((window as any).umami) {
    (window as any).umami.track(event, data);
  }
}

export function getRandomServerUrl(): string {
  const serverUrls = [];

  for (const [key, value] of Object.entries(process.env)) {
    if (key.startsWith('SERVER_URL') && value) {
      serverUrls.push(value);
    }
  }

  return serverUrls[Math.floor(Math.random() * serverUrls.length)];
}
