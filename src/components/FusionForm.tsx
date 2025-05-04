'use client';

import Image from 'next/image';
import { useState } from 'react';

function getImagePath(name: string) {
  // Convert character name like "Cappuccino Assassino" → "cappuccino_assassino"
  const filename = name.toLowerCase().replace(/\s+/g, '_');
  return `/images/${filename}.jpeg`;
}


const characters = ['Matteo', 'Capuccino Assassino', 'Ballerina Capuccina', 'Bombardino Crocodilo', 'Tung Tung Tung Sahur', 'Lirili larila', 'Shimpanzini bananini'];

export default function FusionForm() {
  const [charA, setCharA] = useState('');
  const [charB, setCharB] = useState('');
  const [fusedName, setFusedName] = useState('');
  const [fusedImageUrl, setFusedImageUrl] = useState('');



  const handleFuse = async () => {

    const baseUrl = window.location.origin;

    const imageUrlA = `${baseUrl}${getImagePath(charA)}`;
    const imageUrlB = `${baseUrl}${getImagePath(charB)}`;


    const res = await fetch('/api/fuse', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
         charA, 
         charB,
         imageUrlA,
         imageUrlB, 
        }),
    });

    const data = await res.json();
    console.log('Response:', data);

    setFusedName(data.fusedName);
    setFusedImageUrl(data.imageUrl);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-4">

        <select value={charA} onChange={(e) => setCharA(e.target.value)} className="p-2 border rounded">
          <option value="">Select Character A</option>
          {characters.map((name) => (
            <option className='text-blue-950' key={name} value={name} disabled={name === charB}>{name}</option>
          ))}
        </select>

        <select value={charB} onChange={(e) => setCharB(e.target.value)} className="p-2 border rounded">
          <option value="">Select Character B</option>
          {characters.map((name) => (
            <option className='text-blue-950' key={name} value={name} disabled={name === charA}>{name}</option>
          ))}
        </select>
      </div>

      {charA && charB && (
        <div className="flex gap-4 items-center mt-4">
          <img src={getImagePath(charA)} alt={charA} className="w-32 h-32 object-cover rounded" />
          <img src={getImagePath(charB)} alt={charB} className="w-32 h-32 object-cover rounded" />
        </div>
      )}

      <button
        onClick={handleFuse}
        disabled={!charA || !charB}
        className="bg-blue-600 hover:bg-blue-400 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        Fuse
      </button>

      {fusedImageUrl && fusedName && (
        <div className="mt-6 flex flex-col items-center gap-2">
          <h2 className="text-2xl font-bold text-center">
            <span role="img" aria-label="DNA emoji">🧬</span> {fusedName}
          </h2>
          <Image
            src={fusedImageUrl}
            alt={fusedName}
            width={256}
            height={256}
            className="rounded shadow-lg object-cover"
          />
        </div>
      )}

      
    </div>
    );
  }
