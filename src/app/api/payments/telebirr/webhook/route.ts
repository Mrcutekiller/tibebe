import { NextResponse } from 'next/server';
import { verifyTelebirrNotification } from '@/lib/payments/telebirr';
import { getOrderById, updateOrderStatus } from '@/lib/orders-store';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const isValid = verifyTelebirrNotification(body);
    if (!isValid) {
      return NextResponse.json({ code: 400, message: 'Invalid Telebirr payload' }, { status: 400 });
    }

    const orderId = body.outTradeNo;
    const tradeNo = body.tradeNo || body.transactionNo;

    if (orderId) {
      const order = getOrderById(orderId);
      if (order) {
        updateOrderStatus(order.id, 'completed', tradeNo);
        console.log(`Telebirr Webhook: Order ${order.id} marked as completed.`);
      }
    }

    // Telebirr requires standard code 0 response
    return NextResponse.json({ code: 0, message: 'success' });
  } catch (err: any) {
    console.error('Telebirr webhook error:', err);
    return NextResponse.json({ code: 500, message: err.message }, { status: 500 });
  }
}
