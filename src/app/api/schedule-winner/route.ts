import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getCaffeineTotal } from "@/lib/scraper";

export async function GET() {
  try {
    const actualCaffeineTotal = await getCaffeineTotal();

    if (actualCaffeineTotal === null || actualCaffeineTotal === 0) {
      return NextResponse.json({ error: "Caffeine total not recorded yet" }, { status: 500 });
    }

    const { data: bets, error } = await supabase.from("bets").select("*");

    if (error) {
      console.error("❌ Supabase Fetch Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!bets || bets.length === 0) {
      return NextResponse.json({ error: "No bets placed today" }, { status: 500 });
    }

    let winner = bets.reduce((prev, curr) =>
      Math.abs(curr.bet - actualCaffeineTotal) < Math.abs(prev.bet - actualCaffeineTotal) ? curr : prev
    );

    console.log("🏆 Winner selected:", winner);

    const { error: insertError } = await supabase.from("winners").insert([
      { user: winner.user, bet: winner.bet, caffeineTotal: actualCaffeineTotal, date: new Date().toISOString() }
    ]);

    if (insertError) {
      console.error("❌ Supabase Insert Error:", insertError);
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, winner });

  } catch (error) {
    console.error("❌ Server Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
