const SEASON_ORDER = ['Winter', 'Summer', 'Fall', 'Hiver', 'Été', 'Automne'];

export function compareTerms(term1: string, term2: string) {
  const [season1, year1] = term1.split(' ');
  const [season2, year2] = term2.split(' ');

  const year1Parsed = parseInt(year1);
  const year2Parsed = parseInt(year2);
  const season1Index = SEASON_ORDER.indexOf(season1);
  const season2Index = SEASON_ORDER.indexOf(season2);

  if (year1Parsed < year2Parsed) {
    return -1;
  } else if (year1Parsed > year2Parsed) {
    return 1;
  } else if (season1Index < season2Index) {
    return -1;
  } else if (season1Index > season2Index) {
    return 1;
  } else {
    return 0;
  }
}

export function trackEvent(event: string, data?: object) {
  if (typeof window === 'undefined') return;
  if ((window as any).umami) {
    (window as any).umami.track(event, data);
  }
}
