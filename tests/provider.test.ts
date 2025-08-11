import { describe, it, expect } from 'vitest';
import { searchTitles } from '../lib/providers/imdb';

describe('IMDb provider', () => {
  it('searchTitles returns array', async () => {
    if (!process.env.OMDB_API_KEY) {
      expect(true).toBe(true); // skip if no key
      return;
    }
    const res = await searchTitles('Star Wars');
    expect(Array.isArray(res)).toBe(true);
  });
});
