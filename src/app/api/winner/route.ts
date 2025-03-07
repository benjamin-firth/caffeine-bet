import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getCaffeineTotal } from "@/lib/scraper";

export async function GET() {
  try {
    const actualCaffeineTotal = await getCaffeineTotal();
    
    if (actualCaffeineTotal === null) {
      console.error("❌ Failed to fetch caffeine total");
      return NextResponse.json({ error: "Failed to fetch caffeine total" }, { status: 500 });
    }

    console.log("✅ Scraped caffeine total:", actualCaffeineTotal);

    const { data: bets, error } = await supabase
      .from("bets")
      .select("*")
      .order("created_at", { ascending: true }); 

    if (error) {
      console.error("❌ Supabase Fetch Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!bets || bets.length === 0) {
      return NextResponse.json({ user: "No winner yet", bet: 0, caffeineTotal: actualCaffeineTotal });
    }

    let winner = bets.reduce((prev, curr) =>
      Math.abs(curr.bet - actualCaffeineTotal) < Math.abs(prev.bet - actualCaffeineTotal) ? curr : prev
    );

    console.log("🏆 Winner selected:", winner);

    return NextResponse.json({ 
      user: winner.user, 
      bet: winner.bet, 
      caffeineTotal: actualCaffeineTotal 
    });

  } catch (error) {
    console.error("❌ Server Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
