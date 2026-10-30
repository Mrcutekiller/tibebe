import crypto from 'crypto';
import { InitializePaymentParams, InitializePaymentResponse } from './types';

const CHAPA_API_URL = 'https://api.chapa.co/v1';

export function isChapaLiveConfigured(): boolean {
  const key = process.env.CHAPA_SECRET_KEY;
  return Boolean(key && !key.toLowerCase().includes('placeholder') && key.startsWith('CHASECK'));
}

/**
 * Initialize a Chapa payment transaction
 */
export async function initializeChapaTransaction(
  params: InitializePaymentParams
): Promise<InitializePaymentResponse> {
  const secretKey = process.env.CHAPA_SECRET_KEY;
  const isLive = isChapaLiveConfigured();
  const txRef = `TX-CHP-${params.orderId}-${Date.now().toString().slice(-4)}`;

  if (!isLive) {
    // Graceful sandbox fallback for dev/demo when API keys are placeholders
    const mockCheckoutUrl = `/payment/success?order=${params.orderId}&tx_ref=${txRef}&gateway=chapa&status=success`;
    return {
      success: true,
      orderId: params.orderId,
      transactionRef: txRef,
      checkoutUrl: mockCheckoutUrl,
      isMockSandbox: true,
      message: 'Chapa transaction initialized in sandbox/dev mode',
    };
  }

  // Name splitting for Chapa format
  const [firstName, ...rest] = (params.fullName || 'Tibeb Student').trim().split(' ');
  const lastName = rest.join(' ') || 'Student';

  try {
    const payload = {
      amount: params.amount.toString(),
      currency: params.currency || 'ETB',
      email: params.email || `${params.phone.replace(/[^0-9]/g, '')}@student.tibeb.et`,
      first_name: firstName,
      last_name: lastName,
      phone_number: params.phone,
      tx_ref: txRef,
      callback_url: params.callbackUrl,
      return_url: `${params.returnUrl}?order=${params.orderId}&tx_ref=${txRef}&gateway=chapa`,
      'customization[title]': 'Tibeb Education',
      'customization[description]': `Payment for Order ${params.orderId}`,
    };

    const res = await fetch(`${CHAPA_API_URL}/transaction/initialize`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${secretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (data.status === 'success' && data.data?.checkout_url) {
      return {
        success: true,
        orderId: params.orderId,
        transactionRef: txRef,
        checkoutUrl: data.data.checkout_url,
        isMockSandbox: false,
      };
    } else {
      console.error('Chapa init error response:', data);
      return {
        success: false,
        orderId: params.orderId,
        message: data.message || 'Failed to initialize payment with Chapa',
      };
    }
  } catch (err: any) {
    console.error('Chapa request error:', err);
    return {
      success: false,
      orderId: params.orderId,
      message: err.message || 'Network error reaching Chapa API',
    };
  }
}

/**
 * Verify a transaction directly with Chapa API
 */
export async function verifyChapaTransaction(txRef: string): Promise<{ success: boolean; data?: any }> {
  const secretKey = process.env.CHAPA_SECRET_KEY;
  if (!isChapaLiveConfigured()) {
    // Mock sandbox verification
    return {
      success: true,
      data: {
        status: 'success',
        tx_ref: txRef,
        currency: 'ETB',
        mode: 'sandbox',
      },
    };
  }

  try {
    const res = await fetch(`${CHAPA_API_URL}/transaction/verify/${txRef}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${secretKey}`,
      },
    });
    const data = await res.json();
    return {
      success: data.status === 'success',
      data: data.data,
    };
  } catch (err) {
    console.error('Chapa verify error:', err);
    return { success: false };
  }
}

/**
 * Validate Chapa Webhook HMAC signature
 */
export function verifyChapaWebhookSignature(rawBody: string, signature: string | null): boolean {
  const webhookSecret = process.env.CHAPA_WEBHOOK_SECRET;
  if (!webhookSecret || webhookSecret.includes('placeholder')) {
    // In dev sandbox, accept test webhook calls
    return true;
  }
  if (!signature) return false;

  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(rawBody)
    .digest('hex');

  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
}
