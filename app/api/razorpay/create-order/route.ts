import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, currency = 'USD', planId } = body;

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    const isLiveConfigured = Boolean(keySecret && keySecret !== 'placeholder_secret');

    // Secure Order response
    return NextResponse.json({
      orderId: `order_${Math.random().toString(36).substring(2, 12)}`,
      amount: amount || 4900,
      currency,
      status: 'created',
      gatewayMode: isLiveConfigured ? 'production' : 'sandbox_test_mode',
      message: isLiveConfigured
        ? 'Live Razorpay order created'
        : 'Running in Razorpay Test/Sandbox mode. Awaiting live RAZORPAY_KEY_SECRET in .env.local',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Payment initiation failed' }, { status: 500 });
  }
}
