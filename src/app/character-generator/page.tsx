'use client';

import { useState } from 'react';
import { useEffect } from 'react';
import { supabase } from '@/utils/supabaseClient';


export default function CharacterGeneratorPage() {
  const [nameStart, setNameStart] = useState('');
  const [nameEnd, setNameEnd] = useState('');
  const [description, setDescription] = useState('');
  const [quote, setQuote] = useState('');
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [loadingImage, setLoadingImage] = useState(false);
  const [credits, setCredits] = useState<number | null>(null);
  const [user, setUser] = useState<any>(null);




  useEffect(() => {
    const fetchOrCreateProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log("⚠️ No user found");
        return;
      }
      setUser(user);
  
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
  
      if (!data && !error) {
        await supabase.from('profiles').insert({
          id: user.id,
          email: user.email,
          credits: 3,
        });
        setCredits(3);
      } else if (data) {
        setCredits(data.credits);
      }
    };
  
    fetchOrCreateProfile();
  }, []);
  
  
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


  const handleBuyCredits = async () => {
    const { data: { user } } = await supabase.auth.getUser();
  
    if (!user) {
      window.location.href = '/login?redirect=/character-generator';
      return;
    }
  
    const res = await fetch('/api/checkout', { method: 'POST' });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      alert("Failed to start checkout session.");
    }
  };
  
  
  const generateCharacter = async () => {

    const fullName = `${nameStart} ${nameEnd}`;
    setLoading(true);

    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName }),
    });

    const data = await res.json();
    setDescription(data.description || '');
    setQuote(data.quote || '');
    setLoading(false);
    setGenerated(true);
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 flex flex-col gap-4 items-center text-center">
      <h1 className="text-3xl font-bold">🧠 Brainrot Character Generator 🧠</h1>

      {credits !== null && (
        <p className="text-sm text-gray-400">
          🪙 Image Credits: {credits}
        </p>
      )}

      <pre className="text-xs text-gray-500">
        {JSON.stringify({ user, credits }, null, 2)}
      </pre>


      <div className="flex gap-2">
        <button 
        onClick={generateNameStart}
        disabled={loading || generated}
        className="bg-orange-500 hover:bg-orange-300 text-white px-4 py-2 rounded disabled:opacity-50">
        {loading && !nameStart ? 'Generating...' : 'Generate First Part'}
        </button>

        <button 
        onClick={generateNameEnd} 
        disabled={loading || generated}
        className="bg-green-600 hover:bg-green-400 text-white px-4 py-2 rounded disabled:opacity-50">
        {loading && !nameStart ? 'Generating...' : 'Generate Second Part'}
        </button>
      </div>

      <div className="text-xl font-semibold">
        {nameStart && <p>{nameStart}</p>}
        {nameEnd && <p>{nameEnd}</p>}
      </div>

      <button
        onClick={generateCharacter}
        disabled={!nameStart || !nameEnd || loading || generated}
        className="bg-blue-600 hover:bg-blue-400 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? 'Generating...' : 'Generate Character'}
      </button>

      {description && quote && (
        <div className="mt-6 bg-gray-100  text-black p-4 rounded shadow w-full">
            <h2 className="text-xl text-black font-bold mb-2">{nameStart} {nameEnd}</h2>
            <p className='text-black'><strong>Appearance:</strong> {description}</p>
            <p className=" text-black italic mt-2">“{quote}”</p>
        </div>
        )}

        {generated && !imageUrl && (
        <button
            onClick={async () => {
              const { data: { user } } = await supabase.auth.getUser();
              if (!user || credits === null) return;

              if (credits <= 0) {
                alert("❌ You're out of image credits.");
                return;
              }

              setLoadingImage(true);

              const res = await fetch('/api/image', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: description || quote }),
              });

              const data = await res.json();
              setImageUrl(data.imageUrl);
              setLoadingImage(false);

              // 🧮 Deduct 1 credit from Supabase
              await supabase
                .from('profiles')
                .update({ credits: credits - 1 })
                .eq('id', user.id);
              setCredits(credits - 1);
            }}

            className="mt-2 bg-purple-600 text-white px-4 py-2 rounded"
        >
            {loadingImage ? 'Generating Image...' : '🖼 Generate Character Image'}
        </button>
        )}

        {imageUrl && (
        <img
            src={imageUrl}
            alt="Generated character"
            className="mt-4 w-full max-w-md rounded shadow-lg"
        />
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
