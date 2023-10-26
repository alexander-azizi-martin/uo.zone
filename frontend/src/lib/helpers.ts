const SEASON_ORDER = ['Winter', 'Summer', 'Fall', 'Hiver', 'Été', 'Automne'];

export function termValue(term: string) {
  const [season, year] = term.split(' ');

  return [parseInt(year), SEASON_ORDER.indexOf(season)];
}

export function trackEvent(event: string, data?: object) {
  if (typeof window === 'undefined') return;
  if ((window as any).umami) {
    (window as any).umami.track(event, data);
  }
}
