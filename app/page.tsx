import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

async function fetchLists() {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/watchlists`, {
    cache: 'no-store',
  });
  if (!res.ok) return [];
  return res.json();
}

export default async function Home() {
  const session = await getServerSession(authOptions);
  const lists = session ? await fetchLists() : [];

  return (
    <main className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">My Lists</h1>
      {!session && (
        <p>
          <Link href="/signin" className="underline">
            Sign in
          </Link>{' '}
          to manage your watchlists.
        </p>
      )}
      <ul className="space-y-2">
        {lists.map((list: any) => (
          <li key={list.id} className="border p-2 rounded">
            <Link href={`/lists/${list.id}`}>{list.name}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
