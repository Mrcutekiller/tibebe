'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import {
  MessageSquare, X, Send, Shield, Sparkles, CheckCheck,
  Headphones, ChevronDown, Minimize2, ExternalLink
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import {
  ChatConversation,
  ChatMessage,
  getOrCreateStudentConversation,
  sendStudentMessage,
  markConversationRead,
  subscribeToSupportChat,
} from '@/lib/support-chat';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

const QUICK_PROMPTS = [
  'How do I deposit via Telebirr or CBE?',
  'When will my Telegram Premium be delivered?',
  'I need an exam paper for my department',
  'How do competition points work?',
];

export default function MiniSupportChat() {
  const { user } = useAuth();
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [conversation, setConversation] = useState<ChatConversation | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Do not show student floating widget inside the Admin portal
  const isAdminPage = pathname.startsWith('/admin');

  const studentId = user?.id || (typeof window !== 'undefined' ? localStorage.getItem('tibeb_guest_id') || '' : '');
  const studentName = user?.name || 'Tibeb Student';

  // Ensure persistent guest ID if not logged in
  useEffect(() => {
    if (typeof window !== 'undefined' && !user?.id && !localStorage.getItem('tibeb_guest_id')) {
      const guestId = `guest-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
      localStorage.setItem('tibeb_guest_id', guestId);
    }
  }, [user]);

  // Load and subscribe to conversation updates
  useEffect(() => {
    if (isAdminPage) return;
    const effectiveId = user?.id || (typeof window !== 'undefined' ? localStorage.getItem('tibeb_guest_id') || 'guest-user' : 'guest-user');

    const refreshConv = () => {
      const conv = getOrCreateStudentConversation(effectiveId, studentName, user?.email, user?.phone);
      setConversation({ ...conv });
    };

    refreshConv();
    const unsubscribe = subscribeToSupportChat(refreshConv);
    return () => unsubscribe();
  }, [user, studentName, isAdminPage]);

  // Scroll to bottom when conversation updates or window opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        inputRef.current?.focus();
      }, 100);
      if (conversation?.id) {
        markConversationRead(conversation.id, 'student');
      }
    }
  }, [isOpen, conversation?.messages.length, conversation?.id]);

  if (isAdminPage) return null;

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const effectiveId = user?.id || (typeof window !== 'undefined' ? localStorage.getItem('tibeb_guest_id') || 'guest-user' : 'guest-user');
    sendStudentMessage(effectiveId, studentName, text, user?.email, user?.phone);
    setInputText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const unreadCount = conversation?.unreadByStudent || 0;

  return (
    <div className="fixed bottom-4 right-4 z-50 font-sans">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-[#0B5D3B] to-[#12754b] text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 border-2 border-white/20 group cursor-pointer"
          aria-label="Open support chat"
        >
          <div className="relative">
            <MessageSquare size={20} className="text-white group-hover:rotate-6 transition-transform" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#0B5D3B] animate-pulse" />
          </div>
          <span className="font-extrabold text-xs tracking-wide hidden sm:inline">
            Support Chat
          </span>

          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-1.5 px-2 py-0.5 rounded-full bg-red-500 text-white font-black text-[10px] shadow-md animate-bounce">
              {unreadCount}
            </span>
          )}
        </button>
      )}

      {/* Chat Window Panel */}
      {isOpen && (
        <div
          className={cn(
            'flex flex-col bg-white shadow-2xl border border-gray-200 overflow-hidden transition-all duration-200',
            // On mobile: fixed fullscreen or bottom-sheet
            'fixed inset-x-2 bottom-2 top-16 sm:static sm:w-[380px] sm:h-[530px] sm:rounded-3xl rounded-2xl'
          )}
        >
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-[#083D28] via-[#0B5D3B] to-[#12754b] text-white flex items-center justify-between shadow-sm flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-gold shadow-xs">
                <Headphones size={20} />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-black text-sm text-white">Tibeb Support Desk</h3>
                  <span className="text-[9px] uppercase font-black px-1.5 py-0.5 rounded bg-gold text-ink">
                    Admin
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[11px] text-emerald-200 font-medium">Online • Instant Help</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
                title="Minimize chat"
              >
                <Minimize2 size={18} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
                title="Close chat"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Subheader info: Offline Persistence Indicator */}
          <div className="px-4 py-2 bg-emerald-50/90 border-b border-emerald-100 flex items-center justify-between text-[11px] text-emerald-900">
            <span className="flex items-center gap-1.5 font-semibold">
              <Shield size={12} className="text-emerald-700" />
              Direct line to Tibeb Admin
            </span>
            <span className="text-[10px] text-emerald-700 font-bold bg-white px-2 py-0.5 rounded-full border border-emerald-200">
              Offline Saved ✓
            </span>
          </div>

          {/* Messages Scroll View */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F8FAFC]">
            {conversation?.messages.map((msg) => {
              const isStudent = msg.senderRole === 'student';
              return (
                <div
                  key={msg.id}
                  className={cn(
                    'flex flex-col max-w-[82%] animate-in fade-in slide-in-from-bottom-2 duration-150',
                    isStudent ? 'ml-auto items-end' : 'mr-auto items-start'
                  )}
                >
                  <div className="flex items-center gap-1.5 mb-1 px-1">
                    <span className="text-[10px] font-bold text-gray-500">
                      {isStudent ? 'You' : msg.senderName || 'Admin'}
                    </span>
                    <span className="text-[9px] text-gray-400">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div
                    className={cn(
                      'p-3.5 rounded-2xl text-xs leading-relaxed shadow-xs',
                      isStudent
                        ? 'bg-[#0B5D3B] text-white rounded-tr-none'
                        : 'bg-white text-ink border border-gray-200 rounded-tl-none font-medium'
                    )}
                  >
                    {msg.text}
                  </div>

                  {isStudent && (
                    <span className="text-[9px] text-gray-400 mt-0.5 flex items-center gap-0.5 pr-1">
                      <CheckCheck size={11} className={msg.read ? 'text-emerald-600' : 'text-gray-400'} />
                      {msg.read ? 'Read by admin' : 'Sent'}
                    </span>
                  )}
                </div>
              );
            })}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Selector */}
          <div className="px-3 py-2 bg-white border-t border-gray-100 overflow-x-auto flex gap-1.5 scrollbar-none flex-shrink-0">
            {QUICK_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSendMessage(prompt)}
                className="whitespace-nowrap px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-[10px] font-bold text-gray-600 transition-colors border border-gray-200 cursor-pointer flex-shrink-0"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-white border-t border-gray-200 flex items-center gap-2 flex-shrink-0">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message to Admin..."
              className="flex-1 px-4 py-2.5 bg-slate-50 border border-gray-300 focus:border-[#0B5D3B] focus:ring-2 focus:ring-[#0B5D3B]/10 rounded-xl text-xs text-ink placeholder:text-gray-400 outline-none transition-all"
            />

            <button
              type="button"
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim()}
              className="p-2.5 rounded-xl bg-[#0B5D3B] hover:bg-emerald-800 disabled:opacity-40 text-white transition-all shadow-md active:scale-95 cursor-pointer disabled:cursor-not-allowed flex-shrink-0"
              aria-label="Send message"
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

