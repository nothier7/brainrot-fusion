// src/app/character-generator/metadata.ts

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Brainrot Character Generator – Create Viral Tiktok AI Italian Meme Characters',
  description:
    'Generate hilarious Italian brainrot-style characters using AI. Combine names, get vivid character images, and download your creation instantly.',
  openGraph: {
    title: 'Brainrot Character Generator',
    description:

      'Generate viral brainrot-style AI characters with names, quotes, and images. Try it for free!',
    url: 'https://brainrotcharacter.com',
    siteName: 'Brainrot Generator',
    images: [
      {
        url: 'https://www.brainrotcharacter.com/images/logo.png',
        width: 1200,
        height: 630,
        alt: 'Italian Brainrot Character',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Brainrot Character Generator',
    description:
      'Create AI-generated Italian brainrot characters with unique names and quotes. Try for free!',
    images: ['https://www.brainrotcharacter.com/images/logo.png'],
  },
};
