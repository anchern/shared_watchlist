import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';
import { getSessionUser } from '../../../lib/session';
import { z } from 'zod';

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json([], { status: 401 });
  const lists = await prisma.watchlist.findMany({ where: { ownerId: user.id } });
  return NextResponse.json(lists);
}

const createSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  visibility: z.enum(['private', 'friends', 'public']).default('private'),
});

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const data = createSchema.safeParse(await req.json());
  if (!data.success)
    return NextResponse.json({ error: data.error.flatten() }, { status: 400 });
  const list = await prisma.watchlist.create({
    data: {
      name: data.data.name,
      description: data.data.description,
      visibility: data.data.visibility,
      ownerId: user.id,
    },
  });
  return NextResponse.json(list, { status: 201 });
}
