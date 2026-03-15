const METEORA_API = process.env.METEORA_API_URL || "https://dlmm.datapi.meteora.ag";

export interface PoolInfo {
  address: string;
  name: string;
  mint_x: string;
  mint_y: string;
  bin_step: number;
  base_fee_percentage: string;
  current_price: number;
  liquidity: string;
  trade_volume_24h: number;
  fees_24h: number;
  today_fees: number;
  apr: number;
  cumulative_trade_volume: string;
  cumulative_fee_volume: string;
}

export async function getAllPools(): Promise<PoolInfo[]> {
  const res = await fetch(`${METEORA_API}/pair/all`);
  const data = await res.json();
  return data.slice(0, 20); // Top 20 pools
}

export async function getPool(address: string): Promise<PoolInfo> {
  const res = await fetch(`${METEORA_API}/pair/${address}`);
  return res.json();
}

export async function getPoolVolume(address: string) {
  const res = await fetch(`${METEORA_API}/pair/${address}/historical-volume`);
  return res.json();
}

export async function getProtocolOverview() {
  const res = await fetch(`${METEORA_API}/stats/protocol-overview`);
  return res.json();
}

// Agent LP strategy analysis
export function analyzePoolForLP(pool: PoolInfo): {
  recommendation: string;
  strategy: string;
  reasoning: string;
  riskLevel: "low" | "medium" | "high";
} {
  const apr = pool.apr || 0;
  const volume24h = pool.trade_volume_24h || 0;
  const fees24h = pool.fees_24h || 0;

  if (apr > 100 && volume24h > 1000000) {
    return {
      recommendation: "STRONG BUY",
      strategy: "Spot",
      reasoning: `High APR (${apr.toFixed(1)}%) with strong volume ($${(volume24h / 1e6).toFixed(1)}M/24h). Uniform distribution around active bin recommended for consistent fee capture.`,
      riskLevel: "medium",
    };
  }

  if (apr > 50) {
    return {
      recommendation: "BUY",
      strategy: "Curve",
      reasoning: `Good APR (${apr.toFixed(1)}%) suggests healthy trading activity. Bell-curve distribution concentrates liquidity near active price for maximum fee efficiency.`,
      riskLevel: "medium",
    };
  }

  if (fees24h > 10000) {
    return {
      recommendation: "HOLD",
      strategy: "BidAsk",
      reasoning: `Moderate APR but significant fee generation ($${fees24h.toFixed(0)}/24h). BidAsk strategy captures fees from larger price movements.`,
      riskLevel: "low",
    };
  }

  return {
    recommendation: "MONITOR",
    strategy: "Spot",
    reasoning: `Low activity pool. Monitor for volume increase before deploying significant capital.`,
    riskLevel: "low",
  };
}

// Simulated position management (for demo - real management requires on-chain TX)
export interface SimulatedPosition {
  poolAddress: string;
  poolName: string;
  strategy: string;
  activeBinPrice: number;
  rangeMin: number;
  rangeMax: number;
  totalValueUsd: number;
  feesEarnedUsd: number;
  unrealizedPnl: number;
  needsRebalance: boolean;
}

export function simulatePosition(pool: PoolInfo): SimulatedPosition {
  const price = pool.current_price || 1;
  const rangeWidth = price * 0.1; // 10% range
  return {
    poolAddress: pool.address,
    poolName: pool.name,
    strategy: analyzePoolForLP(pool).strategy,
    activeBinPrice: price,
    rangeMin: price - rangeWidth,
    rangeMax: price + rangeWidth,
    totalValueUsd: 10000 + Math.random() * 5000,
    feesEarnedUsd: pool.fees_24h ? pool.fees_24h * 0.01 : Math.random() * 100,
    unrealizedPnl: (Math.random() - 0.3) * 500,
    needsRebalance: Math.random() > 0.7,
  };
}
