import axios from 'axios';

const API_URL = 'https://www.omdbapi.com/';
const API_KEY = process.env.OMDB_API_KEY;

export interface TitleResult {
  imdbId: string;
  title: string;
  type: string;
  year?: string;
  posterUrl?: string;
  imdbRating?: string;
}

export async function searchTitles(query: string): Promise<TitleResult[]> {
  const res = await axios.get(API_URL, {
    params: { s: query, apikey: API_KEY },
  });
  const data = res.data.Search || [];
  return data.map((d: any) => ({
    imdbId: d.imdbID,
    title: d.Title,
    type: d.Type,
    year: d.Year,
    posterUrl: d.Poster,
  }));
}

export async function getTitle(imdbId: string) {
  const res = await axios.get(API_URL, {
    params: { i: imdbId, plot: 'full', apikey: API_KEY },
  });
  const d = res.data;
  return {
    imdbId: d.imdbID,
    title: d.Title,
    type: d.Type,
    year: d.Year,
    posterUrl: d.Poster,
    plot: d.Plot,
    imdbRating: parseFloat(d.imdbRating),
    directors: d.Director?.split(',').map((s: string) => s.trim()) ?? [],
    actors: d.Actors?.split(',').map((s: string) => s.trim()) ?? [],
  };
}
