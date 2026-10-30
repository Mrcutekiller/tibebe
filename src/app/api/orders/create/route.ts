import { NextResponse } from 'next/server';
import { EXAMS, COURSES } from '@/lib/seed-data';
import { STUDY_BUNDLES } from '@/app/bundles/page';
import { Order, OrderItem, PaymentGateway } from '@/lib/payments/types';
import { saveOrder } from '@/lib/orders-store';
import { initializeChapaTransaction } from '@/lib/payments/chapa';
import { initializeTelebirrTransaction } from '@/lib/payments/telebirr';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      userId,
      userPhone,
      userName,
      items: rawItems,
      couponCode,
      paymentMethod,
    } = body;

    if (!userId || !userPhone) {
      return NextResponse.json(
        { success: false, message: 'Authentication required. Missing user details.' },
        { status: 401 }
      );
    }

    if (!Array.isArray(rawItems) || rawItems.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Cart is empty. Please select at least one item.' },
        { status: 400 }
      );
    }

    const gateway: PaymentGateway = paymentMethod === 'telebirr' ? 'telebirr' : 'chapa';

    // 1. Server-side price validation against catalog seed data to prevent client-side manipulation
    const validatedItems: OrderItem[] = [];

    for (const raw of rawItems) {
      if (raw.type === 'exam') {
        const exam = EXAMS.find(e => e.id === raw.id);
        if (exam) {
          validatedItems.push({
            id: exam.id,
            title: exam.title,
            price: exam.price, // Always 20 ETB
            type: 'exam',
            university: exam.university,
          });
        }
      } else if (raw.type === 'course') {
        const course = COURSES.find(c => c.id === raw.id);
        if (course) {
          validatedItems.push({
            id: course.id,
            title: course.title,
            price: course.price,
            type: 'course',
            university: course.university,
          });
        } else {
          // Check if it's a study bundle
          const bundle = STUDY_BUNDLES.find(b => b.id === raw.id);
          if (bundle) {
            validatedItems.push({
              id: bundle.id,
              title: bundle.title,
              price: bundle.price,
              type: 'bundle',
              university: bundle.university,
            });
          }
        }
      }
    }

    if (validatedItems.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No valid catalog items found in order.' },
        { status: 400 }
      );
    }

    const subtotal = validatedItems.reduce((sum, item) => sum + item.price, 0);

    // 2. Server-side Coupon calculation
    let discount = 0;
    if (couponCode) {
      const codeUpper = String(couponCode).trim().toUpperCase();
      if (codeUpper === 'TIBEB20') {
        discount = Math.round(subtotal * 0.2);
      } else if (codeUpper === 'WELCOME') {
        discount = Math.min(30, subtotal);
      }
    }

    const total = Math.max(0, subtotal - discount);

    // 3. Generate unique order ID
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const orderId = `TIB-${new Date().getFullYear()}-${randomSuffix}`;

    const order: Order = {
      id: orderId,
      userId,
      userPhone,
      userName: userName || 'Student',
      items: validatedItems,
      subtotal,
      discount,
      total,
      couponCode: couponCode || undefined,
      paymentGateway: gateway,
      paymentStatus: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveOrder(order);

    // 4. Initialize Payment with Gateway
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const callbackUrl = `${appUrl}/api/payments/${gateway}/webhook`;
    const returnUrl = `${appUrl}/payment/success`;

    const paymentParams = {
      orderId,
      amount: total,
      currency: 'ETB',
      phone: userPhone,
      fullName: userName || 'Student',
      paymentGateway: gateway,
      returnUrl,
      callbackUrl,
    };

    let paymentInit;
    if (gateway === 'telebirr') {
      paymentInit = await initializeTelebirrTransaction(paymentParams);
    } else {
      paymentInit = await initializeChapaTransaction(paymentParams);
    }

    if (!paymentInit.success) {
      return NextResponse.json(
        { success: false, message: paymentInit.message || 'Payment initialization failed' },
        { status: 502 }
      );
    }

    // Update order with transaction reference
    order.transactionRef = paymentInit.transactionRef;
    saveOrder(order);

    return NextResponse.json({
      success: true,
      orderId,
      transactionRef: paymentInit.transactionRef,
      checkoutUrl: paymentInit.checkoutUrl,
      paymentMethod: gateway,
      total,
      subtotal,
      discount,
      status: 'pending',
      isMockSandbox: paymentInit.isMockSandbox,
    });
  } catch (error: any) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error processing order' },
      { status: 500 }
    );
  }
}
