/**
 * Tag-to-Category Auto Mapper
 * Maps user-selected article tags to official webzine categories (politics, literature, sports)
 */

export const POPULAR_TAG_SUGGESTIONS = [
  'Kerala',
  'Politics',
  'Elections',
  'Society',
  'Literature',
  'Culture',
  'Ecology',
  'Environment',
  'Gender',
  'Sports',
  'Football',
];

export function determineCategoryFromTags(tags: string[]): string {
  if (!tags || tags.length === 0) return 'politics';

  const normalizedTags = tags.map((t) => t.toLowerCase().trim());

  const sportsKeywords = ['sports', 'football', 'cricket', 'games', 'athlete', 'messi', 'match'];
  const literatureKeywords = ['literature', 'culture', 'ecology', 'environment', 'books', 'gender', 'arts', 'poetry', 'history', 'dam', 'river'];
  const politicsKeywords = ['politics', 'kerala', 'elections', 'society', 'government', 'policy', 'state', 'rights'];

  // Count keyword hits
  let sportsHits = 0;
  let literatureHits = 0;
  let politicsHits = 0;

  for (const tag of normalizedTags) {
    if (sportsKeywords.some((k) => tag.includes(k))) sportsHits++;
    if (literatureKeywords.some((k) => tag.includes(k))) literatureHits++;
    if (politicsKeywords.some((k) => tag.includes(k))) politicsHits++;
  }

  if (sportsHits > literatureHits && sportsHits > politicsHits) {
    return 'sports';
  }
  if (literatureHits > sportsHits && literatureHits > politicsHits) {
    return 'literature';
  }

  return 'politics';
}
