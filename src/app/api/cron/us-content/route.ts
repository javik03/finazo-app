import { NextRequest, NextResponse } from "next/server";
import { config } from "@/lib/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300; // 5-minute timeout for article generation

export async function POST(request: NextRequest): Promise<NextResponse> {
  // Validate cron secret to prevent unauthorized triggers
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${config.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { runUsContentStrategist } = await import(
      "@/agents/writer/us-content-strategist"
    );
    await runUsContentStrategist();
    return NextResponse.json({ ok: true, message: "US content strategist run complete" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
