import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Initialize Supabase with the Master Key (Service Role)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // This puts the data into your Supabase 'trades' table
    const { error } = await supabase.from('trades').insert([{
      symbol: data.ticker || 'UNKNOWN',
      side: (data.action || 'BUY').toUpperCase(),
      entry_price: parseFloat(data.price || '0'),
      contracts: parseInt(data.contracts || "1"),
      strategy: "TV_AUTOMATED",
      created_at: new Date().toISOString(),
    }]);

    if (error) {
      console.error('Supabase Error:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Success: Trade Logged" }, { status: 200 });
  } catch (err) {
    console.error('Webhook Runtime Error:', err);
    return NextResponse.json({ error: "Invalid JSON format" }, { status: 400 });
  }
}

// This prevents errors if someone tries to "Visit" the link in a browser
export async function GET() {
  return NextResponse.json({ message: "Webhook is active. Send a POST request from TradingView." });
}