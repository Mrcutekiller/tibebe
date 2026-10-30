// src/lib/support-chat.ts
// Real-time persistent support chat engine connecting Students to Admin
// Offline-safe: All conversations and replies persist in localStorage & sync across tabs

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: 'student' | 'admin';
  text: string;
  timestamp: string;
  read: boolean;
}

export interface ChatConversation {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail?: string;
  studentPhone?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadByAdmin: number;
  unreadByStudent: number;
  createdAt: string;
  messages: ChatMessage[];
}

const STORAGE_KEY = 'tibeb_support_conversations';
export const CHAT_UPDATE_EVENT = 'tibeb_support_chat_update';

// Retrieve all messages for a specific conversation
export function getSupportMessages(conversationId: string): ChatMessage[] {
  const all = getSupportConversations();
  const conv = all.find((c) => c.id === conversationId);
  return conv ? conv.messages : [];
}

// Retrieve all conversations from persistent storage
export function getSupportConversations(): ChatConversation[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

// Save all conversations to persistent storage and notify listeners
export function saveSupportConversations(conversations: ChatConversation[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
    window.dispatchEvent(new CustomEvent(CHAT_UPDATE_EVENT));
  } catch (e) {
    console.error('Failed to save support conversations:', e);
  }
}

// Get or initialize a conversation for a specific student
export function getOrCreateStudentConversation(
  studentId: string,
  studentName: string,
  studentEmail?: string,
  studentPhone?: string
): ChatConversation {
  const all = getSupportConversations();
  const existing = all.find((c) => c.studentId === studentId);

  if (existing) {
    // Update student details if available
    let updated = false;
    if (studentName && existing.studentName !== studentName) {
      existing.studentName = studentName;
      updated = true;
    }
    if (studentEmail && existing.studentEmail !== studentEmail) {
      existing.studentEmail = studentEmail;
      updated = true;
    }
    if (studentPhone && existing.studentPhone !== studentPhone) {
      existing.studentPhone = studentPhone;
      updated = true;
    }
    if (updated) saveSupportConversations(all);
    return existing;
  }

  // Create clean initial conversation
  const newConv: ChatConversation = {
    id: `conv-${studentId}`,
    studentId,
    studentName: studentName || 'Tibeb Student',
    studentEmail: studentEmail || '',
    studentPhone: studentPhone || '',
    lastMessage: 'Conversation opened',
    lastMessageTime: new Date().toISOString(),
    unreadByAdmin: 0,
    unreadByStudent: 0,
    createdAt: new Date().toISOString(),
    messages: [
      {
        id: `msg-welcome-${Date.now()}`,
        conversationId: `conv-${studentId}`,
        senderId: 'admin-system',
        senderName: 'Tibeb Support Helpdesk',
        senderRole: 'admin',
        text: `Hello ${studentName || 'there'}! Welcome to Tibeb Official Support. How can we help you with your exams, wallet deposit, or Telegram Premium today?`,
        timestamp: new Date().toISOString(),
        read: true,
      },
    ],
  };

  all.unshift(newConv);
  saveSupportConversations(all);
  return newConv;
}

// Student sends a message to Admin
export function sendStudentMessage(
  studentId: string,
  studentName: string,
  text: string,
  studentEmail?: string,
  studentPhone?: string
): ChatMessage {
  const all = getSupportConversations();
  let conv = all.find((c) => c.studentId === studentId);

  const newMsg: ChatMessage = {
    id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    conversationId: conv ? conv.id : `conv-${studentId}`,
    senderId: studentId,
    senderName: studentName || 'Student',
    senderRole: 'student',
    text: text.trim(),
    timestamp: new Date().toISOString(),
    read: false,
  };

  if (!conv) {
    conv = {
      id: `conv-${studentId}`,
      studentId,
      studentName: studentName || 'Tibeb Student',
      studentEmail: studentEmail || '',
      studentPhone: studentPhone || '',
      lastMessage: text.trim(),
      lastMessageTime: newMsg.timestamp,
      unreadByAdmin: 1,
      unreadByStudent: 0,
      createdAt: new Date().toISOString(),
      messages: [newMsg],
    };
    all.unshift(conv);
  } else {
    conv.messages.push(newMsg);
    conv.lastMessage = text.trim();
    conv.lastMessageTime = newMsg.timestamp;
    conv.unreadByAdmin += 1;
  }

  saveSupportConversations(all);
  return newMsg;
}

// Admin replies to a Student conversation
export function sendAdminReply(
  conversationId: string,
  adminName: string,
  text: string
): ChatMessage | null {
  const all = getSupportConversations();
  const conv = all.find((c) => c.id === conversationId);
  if (!conv) return null;

  const newMsg: ChatMessage = {
    id: `msg-admin-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    conversationId,
    senderId: 'admin-agent',
    senderName: adminName || 'Tibeb Administrator',
    senderRole: 'admin',
    text: text.trim(),
    timestamp: new Date().toISOString(),
    read: false,
  };

  conv.messages.push(newMsg);
  conv.lastMessage = text.trim();
  conv.lastMessageTime = newMsg.timestamp;
  conv.unreadByStudent += 1;

  saveSupportConversations(all);
  return newMsg;
}

// Mark messages as read
export function markConversationRead(conversationId: string, readerRole: 'student' | 'admin'): void {
  const all = getSupportConversations();
  const conv = all.find((c) => c.id === conversationId);
  if (!conv) return;

  if (readerRole === 'admin') {
    conv.unreadByAdmin = 0;
  } else {
    conv.unreadByStudent = 0;
  }

  conv.messages.forEach((m) => {
    if (m.senderRole !== readerRole) {
      m.read = true;
    }
  });

  saveSupportConversations(all);
}

// Subscribe to real-time chat updates (across tabs and window events)
export function subscribeToSupportChat(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const handleCustomEvent = () => callback();
  const handleStorageEvent = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) callback();
  };

  window.addEventListener(CHAT_UPDATE_EVENT, handleCustomEvent);
  window.addEventListener('storage', handleStorageEvent);

  return () => {
    window.removeEventListener(CHAT_UPDATE_EVENT, handleCustomEvent);
    window.removeEventListener('storage', handleStorageEvent);
  };
}
