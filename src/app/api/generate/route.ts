import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const { fullName } = await req.json();

  if (!fullName) {
    return NextResponse.json({ error: 'Missing fullName' }, { status: 400 });
  }

  const prompt = `
Based on the name "${fullName}", describe a utopic character as if it's a creature from a imaginary and fabricated world.

Describe only its **physical appearance** and expression. 
Do NOT describe backstory, personality, or powers.
The character description should ONLY be based on the name "${fullName}".

Make it absurd. Think "a ninja capuccino cup with swords" if the name was "Capuccino assassino" or "a half banana hald chimpanzi creature" if the name was "Chimpanzin bananini". Keep it fun and visual.

Return valid JSON with:
- description: [one-sentence visual description]
- quote: ["what this character might say"]`;

  try {
    const chat = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      temperature: 1,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const raw = chat.choices[0].message.content;
    const parsed = JSON.parse(raw || '{}');

    return NextResponse.json({
      name: fullName,
      description: parsed.description,
      quote: parsed.quote,
    });
  } catch  {
    console.error('❌ Character generation failed:', err);
    return NextResponse.json({ error: 'Character generation failed' }, { status: 500 });
  }
}
