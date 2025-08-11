import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { searchTitles } from '../../../../lib/providers/imdb';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q');
  if (!q) return NextResponse.json([]);
  const results = await searchTitles(q);
  // cache titles
  await Promise.all(
    results.map((r) =>
      prisma.mediaItem.upsert({
        where: { imdbId: r.imdbId },
        update: {},
        create: {
          imdbId: r.imdbId,
          title: r.title,
          type: r.type,
          year: r.year,
          posterUrl: r.posterUrl,
        },
      })
    )
  );
  return NextResponse.json(results);
}
