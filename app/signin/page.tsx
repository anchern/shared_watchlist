'use client';
import { signIn } from 'next-auth/react';
import { FormEvent, useState } from 'react';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });
    if (res?.error) setError(res.error);
    else window.location.href = '/';
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-2">
      <h1 className="text-xl font-bold">Sign in</h1>
      {error && <p className="text-red-500">{error}</p>}
      <input
        className="border p-2 w-full"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        className="border p-2 w-full"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Sign in
      </button>
      <p className="mt-4 text-sm">
        Don’t have an account?{' '}
        <a className="underline" href="/signup">
          Sign up
        </a>
      </p>
    </form>
  );
}
