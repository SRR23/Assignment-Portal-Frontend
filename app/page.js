'use client';

import { useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';
import Head from 'next/head';

export default function Home() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <Head>
        <title>Assignment Submission Portal</title>
        <meta name="description" content="Assignment Submission Portal for Programming Hero" />
      </Head>
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">Assignment Submission Portal</h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {session ? (
          <div className="text-center">
            <p className="text-lg mb-4">Welcome, {session.user.email} ({session.user.role})!</p>
            <button
              onClick={() => signOut()}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center">
              <Link href="/login">
                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition w-full">
                  Sign In
                </button>
              </Link>
            </div>
            <div className="text-center">
              <Link href="/register">
                <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition w-full">
                  Sign Up
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}