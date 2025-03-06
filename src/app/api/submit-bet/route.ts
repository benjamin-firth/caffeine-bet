import { NextResponse } from "next/server";
import { bets } from "../betsData";

export async function POST(req: Request) {
  const { user, bet } = await req.json();

  if (!user || !bet) {
    return NextResponse.json({ error: "Missing user or bet" }, { status: 400 });
  }

  bets.push({ user, bet });

  return NextResponse.json({ success: true });
}
