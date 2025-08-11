import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

async function getList(id: string) {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/watchlists/${id}`, {
    cache: 'no-store',
  });
  if (!res.ok) return null;
  return res.json();
}

async function getItems(id: string) {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/watchlists/${id}/items`, {
    cache: 'no-store',
  });
  if (!res.ok) return [];
  return res.json();
}

export default async function ListPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return <p className="p-4">Sign in required</p>;
  const list = await getList(params.id);
  const items = await getItems(params.id);
  if (!list) return <p className="p-4">List not found</p>;
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{list.name}</h1>
      <ul className="space-y-2">
        {items.map((item: any) => (
          <li key={item.imdbId} className="border p-2 rounded">
            {item.imdbId}
          </li>
        ))}
      </ul>
    </div>
  );
}
