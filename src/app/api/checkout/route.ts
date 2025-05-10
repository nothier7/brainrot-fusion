import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil',
});

const PRICE_MAP: Record<string, string> = {
  starter: process.env.STRIPE_PRICE_ID_STARTER!,
  popular: process.env.STRIPE_PRICE_ID_POPULAR!,
  pro: process.env.STRIPE_PRICE_ID_PRO!,
};

export async function POST(req: Request) {
  try {
    const { tier } = await req.json();

    const priceId = PRICE_MAP[tier];
    if (!priceId) {
      return NextResponse.json({ error: 'Invalid tier selected' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?tier=${tier}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/character-generator`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('Stripe checkout error:', err);
    return NextResponse.json({ error: 'Failed to create Stripe session' }, { status: 500 });
  }
}
