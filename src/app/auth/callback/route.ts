import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const origin = requestUrl.origin;

  if (code) {
    try {
      await supabase.auth.exchangeCodeForSession(code);
    } catch (e) {
      console.error('Error exchanging code for session:', e);
    }
  }

  // Redirect to dashboard after completing sign in
  return NextResponse.redirect(`${origin}/dashboard`);
}

