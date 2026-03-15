const UNBROWSE_URL = process.env.UNBROWSE_URL || "http://localhost:6969";

export async function resolveIntent(intent: string, url?: string) {
  const res = await fetch(`${UNBROWSE_URL}/v1/intent/resolve`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      intent,
      params: url ? { url } : {},
      context: url ? { url } : {},
    }),
  });
  return res.json();
}

export async function searchSkills(query: string, limit = 5) {
  const res = await fetch(`${UNBROWSE_URL}/v1/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, limit }),
  });
  return res.json();
}

export async function executeSkill(abilityId: string, params: Record<string, unknown>) {
  const res = await fetch(`${UNBROWSE_URL}/v1/skills/${abilityId}/execute`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  return res.json();
}

// Gather market intelligence for treasury decisions
export async function gatherMarketIntel(): Promise<{
  source: string;
  data: unknown;
  timestamp: string;
}[]> {
  const intents = [
    { intent: "get current SOL price and 24h change", url: "https://www.coingecko.com" },
    { intent: "get top DeFi yields on Solana", url: "https://defillama.com" },
    { intent: "get latest Solana ecosystem news", url: "https://solana.com/news" },
  ];

  const results = await Promise.allSettled(
    intents.map(async ({ intent, url }) => {
      try {
        const data = await resolveIntent(intent, url);
        return { source: url, data, timestamp: new Date().toISOString() };
      } catch {
        return { source: url, data: { error: "Unbrowse unavailable" }, timestamp: new Date().toISOString() };
      }
    })
  );

  return results
    .filter((r): r is PromiseFulfilledResult<{ source: string; data: unknown; timestamp: string }> => r.status === "fulfilled")
    .map((r) => r.value);
}
