'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">Assignment Submission Portal</h1>
        <p className="text-center mb-4">Welcome! Please sign in or register to continue.</p>
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
      </div>
    </div>
  );
}