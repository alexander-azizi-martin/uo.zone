const SEASON_ORDER = ['Winter', 'Summer', 'Fall', 'Hiver', 'Été', 'Automne'];

export function termValue(term: string) {
  const [season, year] = term.split(' ');

  return [parseInt(year), SEASON_ORDER.indexOf(season)];
}
