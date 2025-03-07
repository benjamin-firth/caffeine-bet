import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// ✅ Set this manually or integrate a caffeine intake scraper
const actualCaffeineTotal = 900; // Example: Replace with real data

export async function GET() {
  try {
    // Fetch all bets from Supabase
    const { data: bets, error } = await supabase
      .from("bets")
      .select("*")
      .order("created_at", { ascending: true }); // Sort to pick the first closest guess

    if (error) {
      console.error("❌ Supabase Fetch Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!bets || bets.length === 0) {
      return NextResponse.json({ user: "No winner yet", bet: 0 });
    }

    // ✅ Find the closest bet
    let winner = bets.reduce((prev, curr) =>
      Math.abs(curr.bet - actualCaffeineTotal) < Math.abs(prev.bet - actualCaffeineTotal) ? curr : prev
    );

    console.log("🏆 Winner selected:", winner);

    return NextResponse.json(winner);
  } catch (error) {
    console.error("❌ Server Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
