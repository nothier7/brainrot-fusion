'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/utils/supabaseClient';

export default function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);

  // Define how many credits each tier gives
  const TIER_CREDITS: Record<string, number> = {
    starter: 15,
    popular: 35,
    pro: 80,
  };

  useEffect(() => {
    const updateCredits = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const tier = searchParams.get('tier') || 'starter';
      const creditsToAdd = TIER_CREDITS[tier] || 15;

      const { data, error } = await supabase
        .from('profiles')
        .select('credits')
        .eq('id', user.id)
        .single();

      if (!error && data) {
        const newCredits = (data.credits || 0) + creditsToAdd;
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
  }, [router, searchParams]);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-3xl font-bold text-green-600">✅ Payment Successful!</h1>
      <p className="mt-2">Your account is being credited with extra image generations...</p>
      <p className="text-sm text-gray-500 mt-1">
        {loading ? 'Updating your account...' : 'Redirecting you...'}
      </p>
    </div>
  );
}
