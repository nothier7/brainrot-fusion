'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { User } from '@supabase/supabase-js';

export default function CharacterGeneratorPage() {
  const [nameStart, setNameStart] = useState('');
  const [nameEnd, setNameEnd] = useState('');
  const [description, setDescription] = useState('');
  const [quote, setQuote] = useState('');
  const [generated, setGenerated] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [loadingImage, setLoadingImage] = useState(false);
  const [credits, setCredits] = useState<number | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUser(user);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const updateCredits = async () => {
      if (!user) return;
    
      const { data, error } = await supabase
        .from('profiles')
        .select('credits')
        .eq('id', user.id)
        .single();
    
      if (error || !data) {
        // If profile doesn't exist, insert it
        await supabase.from('profiles').insert({
          id: user.id,
          email: user.email,
          credits: 3,
        });
        setCredits(3);
      } else {
        setCredits(data.credits);
      }
    };    
    updateCredits();
  }, [user]);

  const generateNameStart = async () => {
    const res = await fetch('/api/name-start');
    const data = await res.json();
    setNameStart(data.nameStart || '');
  };

  const generateNameEnd = async () => {
    const res = await fetch('/api/name-end');
    const data = await res.json();
    setNameEnd(data.nameEnd || '');
  };

  const generateCharacter = async () => {
    if (!nameStart || !nameEnd) return;
    const fullName = `${nameStart} ${nameEnd}`;
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName }),
    });
    const data = await res.json();
    setDescription(data.description || '');
    setQuote(data.quote || '');
    setGenerated(true);
  };

  const getAnonymousUsage = () => {
    if (typeof window === 'undefined') return 0;
    return parseInt(localStorage.getItem('anonImageUses') || '0', 10);
  };

  const incrementAnonymousUsage = () => {
    const used = getAnonymousUsage() + 1;
    localStorage.setItem('anonImageUses', used.toString());
    return used;
  };

  const handleBuyCredits = async () => {
    if (!user) {
      window.location.href = '/login?redirect=/character-generator';
      return;
    }
    const res = await fetch('/api/checkout', { method: 'POST' });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 flex flex-col gap-4 items-center text-center">
      <h1 className="text-3xl font-bold">🧠 Brainrot Character Generator 🧠</h1>

      <div className="w-full">
        {user ? (
          <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded flex justify-between items-center text-sm">
            <div>
              <strong>{user.email}</strong> — 🪙 {credits ?? '...'} credits
            </div>
            <button onClick={handleLogout} className="text-blue-600 hover:underline text-xs ml-2">
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={() => (window.location.href = '/login?redirect=/character-generator')}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Login to track credits
          </button>
        )}
      </div>

      <div className="flex gap-2">
        <button
          onClick={generateNameStart}
          className="bg-orange-500 hover:bg-orange-300 text-white px-4 py-2 rounded"
        >
          Generate First Part
        </button>
        <button
          onClick={generateNameEnd}
          className="bg-green-600 hover:bg-green-400 text-white px-4 py-2 rounded"
        >
          Generate Second Part
        </button>
      </div>

      <div className="text-xl font-semibold">
        {nameStart && <p>{nameStart}</p>}
        {nameEnd && <p>{nameEnd}</p>}
      </div>

      <button
        onClick={generateCharacter}
        disabled={!nameStart || !nameEnd}
        className="bg-blue-600 hover:bg-blue-400 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        Generate Character
      </button>

      {generated && (
        <div className="mt-6 bg-gray-100 text-black p-4 rounded shadow w-full">
          <h2 className="text-xl font-bold mb-2">{nameStart} {nameEnd}</h2>
          <p><strong>Appearance:</strong> {description}</p>
          <p className="italic mt-2">“{quote}”</p>
        </div>
      )}

      {generated && description && (
        <button
          onClick={async () => {
            const { data: { user: currentUser } } = await supabase.auth.getUser();

            if (!description && !quote) {
              alert("❌ Missing character info.");
              return;
            }

            if (!currentUser) {
              const used = getAnonymousUsage();
              if (used >= 1) {
                alert("🛑 You’ve used your free image. Log in to get more credits.");
                window.location.href = '/login?redirect=/character-generator';
                return;
              } else {
                incrementAnonymousUsage();
              }
            }

            if (currentUser && credits !== null && credits <= 0) {
              alert("❌ You're out of image credits.");
              return;
            }

            setLoadingImage(true);
            const res = await fetch('/api/image', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ prompt: description }),
            });
            const data = await res.json();
            setImageUrl(data.imageUrl);
            setLoadingImage(false);

            if (currentUser && credits !== null) {
              await supabase.from('profiles').update({ credits: credits - 1 }).eq('id', currentUser.id);
              setCredits(credits - 1);
            }
          }}
          className="mt-2 bg-purple-600 text-white px-4 py-2 rounded"
        >
          {loadingImage ? 'Generating Image...' : '🖼 Generate Character Image'}
        </button>
      )}

      {imageUrl && (
        <img src={imageUrl} alt="Generated character" className="mt-4 w-full max-w-md rounded shadow-lg" />
      )}

      <button
        onClick={handleBuyCredits}
        className="mt-4 bg-yellow-600 hover:bg-yellow-400 text-white px-4 py-2 rounded"
      >
        💳 Buy More Image Credits
      </button>

      {generated && (
        <button
          onClick={() => {
            setNameStart('');
            setNameEnd('');
            setDescription('');
            setQuote('');
            setGenerated(false);
            setImageUrl('');
          }}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
        >
          🔁 Generate Another Character
        </button>
      )}
    </div>
  );
}
