import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionUser } from '../../../../lib/session';
import { z } from 'zod';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const list = await prisma.watchlist.findUnique({ where: { id: params.id } });
  if (!list || list.ownerId !== user.id)
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(list);
}

const patchSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  visibility: z.enum(['private', 'friends', 'public']).optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const list = await prisma.watchlist.findUnique({ where: { id: params.id } });
  if (!list || list.ownerId !== user.id)
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const data = patchSchema.safeParse(await req.json());
  if (!data.success)
    return NextResponse.json({ error: data.error.flatten() }, { status: 400 });
  const updated = await prisma.watchlist.update({
    where: { id: params.id },
    data: data.data,
  });
  return NextResponse.json(updated);
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const list = await prisma.watchlist.findUnique({ where: { id: params.id } });
  if (!list || list.ownerId !== user.id)
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  await prisma.watchlist.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
