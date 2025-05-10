import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const { prompt } = await req.json();

  if (!prompt) {
    return NextResponse.json({ error: 'Missing prompt' }, { status: 400 });
  }

  try {
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: `Draw a 3D character based on this description: ${prompt}.
      Add a realistic landscape background putting the character in a an indoor or outdoor setting. Do not just make a plain background. 
      Do not add any text or logo to the image.`,
      n: 1,
      size: '1024x1024',
    });

    if (!response.data || response.data.length === 0) {
      throw new Error('No image data returned from OpenAI');
    }
    const imageUrl = response.data[0].url;
    return NextResponse.json({ imageUrl });
  } catch (err) {
    console.error('Image generation error:', err);
    return NextResponse.json({ error: 'Image generation failed' }, { status: 500 });
  }
}
