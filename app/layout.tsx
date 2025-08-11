import './globals.css';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { ReactNode } from 'react';

export const metadata = {
  title: 'Shared Watchlist',
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <header className="border-b">
          <div className="mx-auto flex max-w-5xl items-center justify-between p-4">
            <Link href="/" className="font-semibold">
              Shared Watchlist
            </Link>
            <nav className="space-x-3">
              {session ? (
                <>
                  <Link href="/profile" className="underline">
                    Profile
                  </Link>
                  <form
                    action="/api/auth/signout"
                    method="post"
                    className="inline"
                  >
                    <button className="rounded border px-3 py-1">
                      Sign out
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <Link href="/signin" className="rounded border px-3 py-1">
                    Sign in
                  </Link>
                  <Link
                    href="/signup"
                    className="rounded bg-black px-3 py-1 text-white"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-5xl p-4">{children}</main>
      </body>
    </html>
  );
}
