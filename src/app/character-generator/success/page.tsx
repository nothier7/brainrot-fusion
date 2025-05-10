'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabaseClient';

export default function SuccessPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const updateCredits = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('credits')
        .eq('id', user.id)
        .single();

      if (!error && data) {
        const newCredits = (data.credits || 0) + 10;
        await supabase
          .from('profiles')
          .update({ credits: newCredits })
          .eq('id', user.id);
      }

      setLoading(false);
      setTimeout(() => {
        router.push('/character-generator');
      }, 3000);
    };

    updateCredits();
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-3xl font-bold text-green-600">✅ Payment Successful!</h1>
      <p className="mt-2">You’ve been credited with 10 image generations.</p>
      <p className="text-sm text-gray-500 mt-1">
        {loading ? 'Updating your account...' : 'Redirecting you...'}
      </p>
    </div>
  );
}
