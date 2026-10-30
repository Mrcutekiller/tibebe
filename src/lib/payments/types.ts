export type PaymentGateway = 'chapa' | 'telebirr';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';
export type ItemType = 'exam' | 'course' | 'bundle' | 'product';

export interface OrderItem {
  id: string;
  title: string;
  price: number;
  type: ItemType;
  university?: string;
  size?: string;
  variant?: string;
  quantity?: number;
}

export interface Order {
  id: string; // e.g. TIB-2026-92812
  userId: string;
  userPhone: string;
  userName?: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  couponCode?: string;
  paymentGateway: PaymentGateway;
  paymentStatus: PaymentStatus;
  transactionRef?: string;
  telebirrOrderId?: string;
  createdAt: string;
  updatedAt: string;
  paymentDate?: string;
}

export interface InitializePaymentParams {
  orderId: string;
  amount: number;
  currency?: string; // Default 'ETB'
  email?: string;
  phone: string;
  fullName: string;
  paymentGateway: PaymentGateway;
  returnUrl: string;
  callbackUrl: string;
}

export interface InitializePaymentResponse {
  success: boolean;
  orderId: string;
  checkoutUrl?: string;
  transactionRef?: string;
  message?: string;
  isMockSandbox?: boolean;
}

export interface ChapaInitPayload {
  amount: string;
  currency: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  tx_ref: string;
  callback_url: string;
  return_url: string;
  'customization[title]': string;
  'customization[description]': string;
}

export interface TelebirrInitPayload {
  appId: string;
  outTradeNo: string;
  totalAmount: string;
  subject: string;
  notifyUrl: string;
  returnUrl: string;
  shortCode: string;
  timeoutExpress: string;
  nonceStr: string;
  timestamp: string;
}
