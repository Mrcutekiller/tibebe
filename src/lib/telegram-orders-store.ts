'use client';

import { supabase } from './supabase';

export interface TelegramOrder {
  id: string;
  userId: string;
  userName?: string;
  userPhone?: string;
  userEmail?: string;
  planId: string;
  planLabel: string;
  months: number;
  price: number;
  telegramUsername: string;
  paymentMethod: string;
  paymentStatus: 'Pending' | 'Paid' | 'Failed' | 'Refunded';
  deliveryStatus: 'Pending' | 'Processing' | 'Delivered';
  isTest?: boolean;
  createdAt: string;
  deliveredAt?: string;
}

const STORAGE_KEY = 'tibeb_telegram_orders';

export function getStoredTelegramOrders(): TelegramOrder[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveStoredTelegramOrders(orders: TelegramOrder[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    window.dispatchEvent(new CustomEvent('tibeb_telegram_orders_updated', { detail: orders }));
  } catch {}
}

export async function createTelegramOrder(params: {
  userId: string;
  userName?: string;
  userPhone?: string;
  userEmail?: string;
  planId: string;
  planLabel: string;
  months: number;
  price: number;
  telegramUsername: string;
  paymentMethod: string;
  isTest?: boolean;
}): Promise<TelegramOrder> {
  const newOrder: TelegramOrder = {
    id: `tg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    userId: params.userId,
    userName: params.userName || 'Student',
    userPhone: params.userPhone || '',
    userEmail: params.userEmail || '',
    planId: params.planId,
    planLabel: params.planLabel,
    months: params.months,
    price: params.price,
    telegramUsername: params.telegramUsername.startsWith('@') ? params.telegramUsername : `@${params.telegramUsername}`,
    paymentMethod: params.paymentMethod,
    paymentStatus: 'Pending',
    deliveryStatus: 'Pending',
    isTest: params.isTest ?? false,
    createdAt: new Date().toISOString(),
  };

  const current = getStoredTelegramOrders();
  saveStoredTelegramOrders([newOrder, ...current]);

  try {
    await supabase.from('telegram_orders').insert({
      id: newOrder.id,
      user_id: newOrder.userId,
      plan_id: newOrder.planId,
      plan_label: newOrder.planLabel,
      months: newOrder.months,
      price: newOrder.price,
      telegram_username: newOrder.telegramUsername,
      payment_method: newOrder.paymentMethod,
      payment_status: newOrder.paymentStatus,
      delivery_status: newOrder.deliveryStatus,
      is_test: newOrder.isTest,
      created_at: newOrder.createdAt,
    });
  } catch (err) {
    console.error('Error inserting telegram order to Supabase:', err);
  }

  return newOrder;
}

export async function updateTelegramOrderStatus(
  orderId: string,
  updates: {
    paymentStatus?: 'Pending' | 'Paid' | 'Failed' | 'Refunded';
    deliveryStatus?: 'Pending' | 'Processing' | 'Delivered';
  }
) {
  const current = getStoredTelegramOrders();
  const updated = current.map((order) => {
    if (order.id === orderId) {
      return {
        ...order,
        ...updates,
        deliveredAt: updates.deliveryStatus === 'Delivered' ? new Date().toISOString() : order.deliveredAt,
      };
    }
    return order;
  });
  saveStoredTelegramOrders(updated);

  try {
    await supabase.from('telegram_orders').update({
      payment_status: updates.paymentStatus,
      delivery_status: updates.deliveryStatus,
      delivered_at: updates.deliveryStatus === 'Delivered' ? new Date().toISOString() : undefined,
      updated_at: new Date().toISOString(),
    }).eq('id', orderId);
  } catch (err) {
    console.error('Error updating telegram order in Supabase:', err);
  }
}

