'use client';
export const dynamic = 'force-dynamic';


import { useState } from 'react';
import { supabase } from '@/utils/supabaseClient';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const redirectTo = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('redirect') : null;


  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (!error) {
      setSubmitted(true);
      const redirectTo = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('redirect') || '/character-generator' : '/character-generator';
                         localStorage.setItem('postLoginRedirect', redirectTo);

      localStorage.setItem('postLoginRedirect', redirectTo);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 gap-4 text-center">
      <h1 className="text-2xl font-bold">Get started</h1>

      {submitted ? (
        <p className="text-green-600">
          📬 Check your email for a login link!
        </p>
      ) : (
        <>
          <input
            type="email"
            placeholder="Enter your email"
            className="border p-2 rounded w-full max-w-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            onClick={handleLogin}
            className="bg-blue-600 text-white px-4 py-2 rounded w-full max-w-sm"
          >
            Continue
          </button>
        </>
      )}
    </div>
  );
}
