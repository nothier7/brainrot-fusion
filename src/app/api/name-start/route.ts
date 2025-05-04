import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET() {
  try {
    const chat = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      temperature: 1,
      messages: [
        {
          role: 'user',
          content: `
            Give me ONE chaotic Italian-style word that starts a character name, and that either:
                    - references a real animal, object, vehicle, fruit or food (like "Crocodilo", "Bananini", "Bombardiro")
                    - or sounds like it could describe a visual trait (like "Assassino", "Capuccina", "Sneakerello")
                    
                    It should pair with names like:
                    - Tralalero Crocodilo
                    - Shimpanzini Bananini
                    - Bombardino Capuccina
                    - Lirili Sahur

                    Privilege animal references over objects, vehicles, fruits or food.
                    
                    Return ONLY the suffix word, without quotes.
`
        },
      ],
    });

    const nameStart = chat.choices[0].message.content?.trim();
    return NextResponse.json({ nameStart });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to generate name start' }, { status: 500 });
  }
}
