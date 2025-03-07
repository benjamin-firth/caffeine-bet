import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const formattedDate = yesterday.toISOString().split("T")[0];

    const { data: winners, error } = await supabase
      .from("winners")
      .select("*")
      .gte("created_at", formattedDate + "T00:00:00Z")
      .lt("created_at", formattedDate + "T23:59:59Z")
      .order("created_at", { ascending: false })
      .limit(1);

    if (error) {
      console.error("❌ Supabase Fetch Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!winners || winners.length === 0) {
      return NextResponse.json({ user: "No winner yet", bet: 0 });
    }

    const winner = winners[0];

    console.log("🏆 Fetched Yesterday’s Winner:", winner);

    return NextResponse.json({ 
      user: winner.user, 
      bet: winner.bet, 
      caffeineTotal: winner.caffeineTotal 
    });

  } catch (error) {
    console.error("❌ Server Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
