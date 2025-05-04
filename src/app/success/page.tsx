'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SuccessPage() {
  const router = useRouter();

  useEffect(() => {
    const current = parseInt(localStorage.getItem('imageCredits') || '0');
    localStorage.setItem('imageCredits', (current + 10).toString());

    const timer = setTimeout(() => {
      router.push('/character-generator');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-3xl font-bold text-green-600">✅ Payment Successful!</h1>
      <p className="mt-2">You’ve been credited with 10 image generations.</p>
      <p className="text-sm text-gray-500 mt-1">Redirecting you...</p>
    </div>
  );
}
