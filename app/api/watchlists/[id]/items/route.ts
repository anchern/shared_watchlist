import { NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';
import { getSessionUser } from '../../../../../lib/session';
import { z } from 'zod';
import { getTitle } from '../../../../../lib/providers/imdb';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const items = await prisma.watchlistItem.findMany({ where: { watchlistId: params.id } });
  return NextResponse.json(items);
}

const postSchema = z.object({ imdbId: z.string() });

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const list = await prisma.watchlist.findUnique({ where: { id: params.id } });
  if (!list || list.ownerId !== user.id)
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const data = postSchema.safeParse(await req.json());
  if (!data.success)
    return NextResponse.json({ error: data.error.flatten() }, { status: 400 });
  await prisma.mediaItem.upsert({
    where: { imdbId: data.data.imdbId },
    update: {},
    create: await getTitle(data.data.imdbId),
  });
  const item = await prisma.watchlistItem.create({
    data: {
      watchlistId: params.id,
      imdbId: data.data.imdbId,
      addedBy: user.id,
      position: await prisma.watchlistItem.count({ where: { watchlistId: params.id } }),
    },
  });
  return NextResponse.json(item, { status: 201 });
}
