import { NextResponse } from "next/server";

const METEORA_API = process.env.METEORA_API_URL || "https://dlmm.datapi.meteora.ag";

export async function GET() {
  try {
    const res = await fetch(`${METEORA_API}/pair/all`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) throw new Error(`Meteora API returned ${res.status}`);

    const data = await res.json();

    // Get top pools by volume
    const pools = data
      .filter((p: Record<string, unknown>) => p.trade_volume_24h && Number(p.trade_volume_24h) > 100000)
      .sort((a: Record<string, unknown>, b: Record<string, unknown>) =>
        Number(b.trade_volume_24h) - Number(a.trade_volume_24h)
      )
      .slice(0, 10)
      .map((p: Record<string, unknown>) => ({
        address: p.address,
        name: p.name,
        current_price: Number(p.current_price),
        trade_volume_24h: Number(p.trade_volume_24h),
        fees_24h: Number(p.fees_24h || p.today_fees || 0),
        apr: Number(p.apr || 0),
        liquidity: p.liquidity,
        bin_step: p.bin_step,
      }));

    return NextResponse.json({ pools, source: "meteora-dlmm-api", timestamp: new Date().toISOString() });
  } catch (error) {
    console.error("Treasury API error:", error);
    return NextResponse.json({ pools: [], error: "Failed to fetch Meteora data" }, { status: 500 });
  }
}
