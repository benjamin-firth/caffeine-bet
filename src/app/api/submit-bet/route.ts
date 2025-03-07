import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  const { user, bet } = await req.json();

  if (!user || !bet) {
    return NextResponse.json({ error: "Missing user or bet" }, { status: 400 });
  }

  const { error } = await supabase.from("bets").insert([{ user, bet }]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
