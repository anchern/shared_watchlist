import { hash } from 'bcryptjs';
import prisma from '@/lib/prisma';
import { getTitle } from '../lib/providers/imdb';

async function main() {
  await prisma.user.createMany({
    data: [
      { id: 'alice', email: 'alice@example.com', passwordHash: await hash('password', 10), name: 'Alice' },
      { id: 'bob', email: 'bob@example.com', passwordHash: await hash('password', 10), name: 'Bob' },
      { id: 'charlie', email: 'charlie@example.com', passwordHash: await hash('password', 10), name: 'Charlie' },
    ],
    skipDuplicates: true,
  });

  await prisma.friendship.createMany({
    data: [
      { userId: 'alice', friendId: 'bob', status: 'accepted' },
      { userId: 'bob', friendId: 'alice', status: 'accepted' },
    ],
    skipDuplicates: true,
  });

  const starWars = await getTitle('tt0076759');
  const spirited = await getTitle('tt0245429');
  await prisma.mediaItem.createMany({
    data: [starWars, spirited],
    skipDuplicates: true,
  });

  const list = await prisma.watchlist.upsert({
    where: { id: 'public-list' },
    update: {},
    create: {
      id: 'public-list',
      name: 'Favorites',
      visibility: 'public',
      ownerId: 'alice',
    },
  });
  await prisma.watchlistItem.createMany({
    data: [
      { watchlistId: list.id, imdbId: starWars.imdbId, addedBy: 'alice', position: 0 },
      { watchlistId: list.id, imdbId: spirited.imdbId, addedBy: 'alice', position: 1 },
    ],
    skipDuplicates: true,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
