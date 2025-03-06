import { NextResponse } from "next/server";
import { bets } from "../betsData";

export async function GET() {
  return NextResponse.json(bets);
}
