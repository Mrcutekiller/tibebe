// src/lib/notification-store.ts
// Real-time persistent notification system for students and admin

export interface TibebNotification {
  id: string;
  userId?: string; // Target specific student, or undefined for broadcast
  title: string;
  message: string;
  type: 'withdrawal' | 'deposit' | 'exam' | 'leaderboard' | 'support' | 'system';
  link?: string;
  imageUrl?: string; // Payout transfer screenshot or exam thumbnail
  read: boolean;
  createdAt: string;
}

const STORAGE_KEY = 'tibeb_system_notifications';

export function getStoredNotifications(userId?: string): TibebNotification[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const all: TibebNotification[] = JSON.parse(raw);
    if (!Array.isArray(all)) return [];
    
    // Return notifications for this user or broadcasts (userId undefined)
    return all.filter(n => !n.userId || !userId || n.userId === userId);
  } catch {
    return [];
  }
}

export function saveNotifications(notifications: TibebNotification[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    window.dispatchEvent(new Event('tibeb_notifications_updated'));
    window.dispatchEvent(new Event('storage'));
  } catch (err) {
    console.error('Failed to save notifications:', err);
  }
}

export function addNotification(data: {
  userId?: string;
  title: string;
  message: string;
  type: 'withdrawal' | 'deposit' | 'exam' | 'leaderboard' | 'support' | 'system';
  link?: string;
  imageUrl?: string;
}): TibebNotification {
  const all = getStoredNotifications();
  const newNotif: TibebNotification = {
    id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    userId: data.userId,
    title: data.title,
    message: data.message,
    type: data.type,
    link: data.link,
    imageUrl: data.imageUrl,
    read: false,
    createdAt: new Date().toISOString(),
  };

  all.unshift(newNotif);
  saveNotifications(all);
  return newNotif;
}

export function markNotificationAsRead(id: string): void {
  const all = getStoredNotifications();
  const updated = all.map(n => n.id === id ? { ...n, read: true } : n);
  saveNotifications(updated);
}

export function markAllNotificationsAsRead(userId?: string): void {
  const all = getStoredNotifications();
  const updated = all.map(n => (!n.userId || !userId || n.userId === userId) ? { ...n, read: true } : n);
  saveNotifications(updated);
}

export function clearUserNotifications(userId?: string): void {
  const all = getStoredNotifications();
  const filtered = userId ? all.filter(n => n.userId && n.userId !== userId) : [];
  saveNotifications(filtered);
}

