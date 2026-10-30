import { Order, OrderItem, PaymentStatus } from './payments/types';

// In-memory server-side storage (persists while server process runs)
// In production with Supabase, these query the Supabase DB
declare global {
  // eslint-disable-next-line no-var
  var __tibeb_orders__: Map<string, Order> | undefined;
  // eslint-disable-next-line no-var
  var __tibeb_user_library__: Map<string, Set<string>> | undefined;
}

if (!global.__tibeb_orders__) {
  global.__tibeb_orders__ = new Map<string, Order>();
}

if (!global.__tibeb_user_library__) {
  global.__tibeb_user_library__ = new Map<string, Set<string>>();
}

const ordersMap = global.__tibeb_orders__;
const libraryMap = global.__tibeb_user_library__;

export function saveOrder(order: Order): Order {
  ordersMap.set(order.id, { ...order, updatedAt: new Date().toISOString() });
  return order;
}

export function getOrderById(orderId: string): Order | undefined {
  return ordersMap.get(orderId);
}

export function getOrderByTransactionRef(txRef: string): Order | undefined {
  for (const order of ordersMap.values()) {
    if (order.transactionRef === txRef) return order;
  }
  return undefined;
}

export function getOrdersByUserId(userId: string): Order[] {
  const result: Order[] = [];
  for (const order of ordersMap.values()) {
    if (order.userId === userId) {
      result.push(order);
    }
  }
  // Sort descending by creation date
  return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function updateOrderStatus(orderId: string, status: PaymentStatus, transactionRef?: string): Order | undefined {
  const order = ordersMap.get(orderId);
  if (!order) return undefined;

  order.paymentStatus = status;
  order.updatedAt = new Date().toISOString();
  if (transactionRef) {
    order.transactionRef = transactionRef;
  }
  if (status === 'completed') {
    order.paymentDate = new Date().toISOString();
    // Unlock items in student's library
    unlockOrderItems(order.userId, order.items.map(i => i.id));
  }

  ordersMap.set(orderId, order);
  return order;
}

export function unlockOrderItems(userId: string, itemIds: string[]): void {
  if (!libraryMap.has(userId)) {
    libraryMap.set(userId, new Set<string>());
  }
  const userSet = libraryMap.get(userId)!;
  itemIds.forEach(id => userSet.add(id));
}

export function getUserLibraryItems(userId: string): string[] {
  const userSet = libraryMap.get(userId);
  return userSet ? Array.from(userSet) : [];
}

export function isItemUnlockedForUser(userId: string, itemId: string): boolean {
  const userSet = libraryMap.get(userId);
  return userSet ? userSet.has(itemId) : false;
}
