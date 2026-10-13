import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST() {
  return NextResponse.json(
    { error: "Staff sign-in is not configured for this project yet." },
    { status: 503, headers: { "Cache-Control": "no-store" } },
  );
}
