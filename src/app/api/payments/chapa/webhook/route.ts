import { NextResponse } from 'next/server';
import { verifyChapaWebhookSignature } from '@/lib/payments/chapa';
import { getOrderByTransactionRef, updateOrderStatus } from '@/lib/orders-store';

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-chapa-signature');

    // 1. Verify signature authenticity
    const isValid = verifyChapaWebhookSignature(rawBody, signature);
    if (!isValid) {
      console.warn('Invalid Chapa webhook signature rejected');
      return NextResponse.json({ success: false, message: 'Invalid signature' }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const { tx_ref, status, event } = payload;

    // Check for charge success event or status
    if (status === 'success' || event === 'charge.success') {
      const order = getOrderByTransactionRef(tx_ref);
      if (order) {
        updateOrderStatus(order.id, 'completed', tx_ref);
        console.log(`Chapa Webhook: Order ${order.id} verified & unlocked for user ${order.userId}`);
      }
    }

    return NextResponse.json({ success: true, received: true });
  } catch (error: any) {
    console.error('Chapa webhook error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
