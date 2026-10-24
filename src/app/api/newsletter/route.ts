import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    const normalizedEmail = String(email || '').trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return NextResponse.json({ success: false, message: 'Please enter a valid email address.' }, { status: 400 });
    }

    // Insert into Supabase
    const { error } = await supabase
      .from('Newsletter')
      .insert([{ email: normalizedEmail }]);

    // 23505 = unique violation, email already subscribed
    if (error && error.code !== '23505') {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ success: false, message: 'Failed to subscribe.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Subscribed successfully.' }, { status: 200 });
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json({ success: false, message: 'Failed to process request.' }, { status: 500 });
  }
}
