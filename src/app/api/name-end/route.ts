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
          content:  `
          Give me ONE chaotic Italian-style word that ends a character name, and that either:
                    - references a real animal, object, vehicle, fruit or food (like "Crocodilo", "Bananini", "Bombardiro")
                    - or sounds like it could describe a visual trait (like "Assassino", "Capuccina", "Sneakerello")
                    
                    It should pair with names like:
                    - Tralalero Crocodilo
                    - Shimpanzini Bananini
                    - Bombardino Capuccina
                    - Lirili Sahur

                    Privilege objects, vehicles, fruits, visual trait and vegetable references.
                    Avvoid pizza or pasta references, as they are too common.
                    
                    Return ONLY the suffix word, without quotes.
          `,
        },
      ],
    });

    const nameEnd = chat.choices[0].message.content?.trim();
    return NextResponse.json({ nameEnd });
  } catch  {
    return NextResponse.json({ error: 'Failed to generate name end' }, { status: 500 });
  }
}
