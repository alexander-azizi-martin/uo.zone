export function trackEvent(event: string, data?: object) {
  if (typeof window === 'undefined') return;
  if ((window as any).umami) {
    (window as any).umami.track(event, data);
  }
}
