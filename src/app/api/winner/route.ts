import { NextResponse } from "next/server";
import { bets } from "../betsData";

export async function GET() {
  if (bets.length === 0) {
    return NextResponse.json({ user: "No winner yet", bet: 0 });
  }

  // Pick a random winner (just for now)
  const winner = bets[Math.floor(Math.random() * bets.length)];

  return NextResponse.json(winner);
}