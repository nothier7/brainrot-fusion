import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const { charA, charB, imageUrlA, imageUrlB } = await req.json();

  if (!charA || !charB || !imageUrlA || !imageUrlB) {
    return NextResponse.json({ error: 'Missing characters' }, { status: 400 });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `
          You are an expert at blending funny and dramatic Italian-style character names.

          Given two names, you must return a single fused name that:
          - Takes part of the first name and part of the second
          - Blends them creatively like a nickname or meme
          - Keeps only the essence (max 3-4 syllables if possible)
          - Returns ONLY the fused name, no explanation
          
          Examples:
          - Giulia + Antonio → Giulonio
          - Matteo + Cappuccino Assassino → Mattuccino Assassino
          - Francesca + Luca → Fraluca
          - Chiara + Gianni → Chiani
          - Giuseppe + Carbonara Killer → Giusbonara Killer

          `,
        },
        {
          role: 'user',
          content: `Fuse the names "${charA}" and "${charB}". Only return the fused name.`,
        },
      ],
      temperature: 0.9,
    });

    const fusedName = completion.choices[0].message.content?.trim();

    const imagePrompt = `
    I want you to generate me A 3D-rendered anthropomorphic wooden club character with a smooth cylindrical body, carved wood texture, big glossy cartoon eyes, a wide smile, and long wooden limbs.
    It stands barefoot on a dimly lit street in a Southeast Asian village at night, holding a wooden baseball bat. Warm yellow light from streetlamps casts cinematic shadows. 
    The background includes a wooden bench and a building with a “PENTUNGAN POS RONDO” sign, creating a slightly eerie, meme-like tone in hyper-realistic CGI style..
    `;

    const imageResponse = await openai.images.generate({
        model: 'dall-e-3',
        prompt: imagePrompt,
        size: '1024x1024',
        quality: 'standard',
        n: 1,
      });

    const imageUrl = imageResponse.data?.[0]?.url;

    if (!imageUrl) {
      throw new Error('Image generation failed: No URL returned');
    }

    return NextResponse.json({ fusedName, imageUrl });
  } catch (error) {
    console.error('OpenAI Error:', error);
    return NextResponse.json({ error: 'Image or name generation failed' }, { status: 500 });
  }
}
