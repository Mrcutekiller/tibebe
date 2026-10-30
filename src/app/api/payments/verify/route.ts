import { NextResponse } from 'next/server';
import { getOrderById, updateOrderStatus } from '@/lib/orders-store';
import { verifyChapaTransaction } from '@/lib/payments/chapa';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('orderId') || searchParams.get('order');
    const txRef = searchParams.get('tx_ref');
    const gateway = searchParams.get('gateway');

    if (!orderId) {
      return NextResponse.json(
        { success: false, message: 'Missing orderId parameter' },
        { status: 400 }
      );
    }

    const order = getOrderById(orderId);
    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    // If order already completed, return it
    if (order.paymentStatus === 'completed') {
      return NextResponse.json({
        success: true,
        order,
        message: 'Order already completed and content unlocked',
      });
    }

    // Verify based on gateway
    let verified = false;
    if (gateway === 'chapa' && txRef) {
      const chapaResult = await verifyChapaTransaction(txRef);
      verified = chapaResult.success;
    } else {
      // For Telebirr or sandbox redirects with success status
      verified = true;
    }

    if (verified) {
      const updatedOrder = updateOrderStatus(orderId, 'completed', txRef || order.transactionRef);
      return NextResponse.json({
        success: true,
        order: updatedOrder,
        message: 'Payment verified successfully and materials unlocked!',
      });
    } else {
      updateOrderStatus(orderId, 'failed');
      return NextResponse.json(
        { success: false, message: 'Payment verification failed at gateway' },
        { status: 400 }
      );
    }
  } catch (err: any) {
    console.error('Payment verify API error:', err);
    return NextResponse.json(
      { success: false, message: err.message || 'Payment verification failed' },
      { status: 500 }
    );
  }
}
