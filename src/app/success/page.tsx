'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabaseClient';

export default function SuccessPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const applyCredits = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // ✅ Update credits in Supabase for logged-in user
        await supabase
          .from('profiles')
          .update({ credits: 10 }) // or increment if needed
          .eq('id', user.id);
      } else {
        // ✅ Handle anonymous user
        const current = parseInt(localStorage.getItem('imageCredits') || '0');
        localStorage.setItem('imageCredits', (current + 10).toString());
      }

      setTimeout(() => {
        router.push('/character-generator');
      }, 3000);
    };

    applyCredits();
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-3xl font-bold text-green-600">✅ Payment Successful!</h1>
      <p className="mt-2">You’ve been credited with 10 image generations.</p>
      <p className="text-sm text-gray-500 mt-1">Redirecting you...</p>
    </div>
  );
}
