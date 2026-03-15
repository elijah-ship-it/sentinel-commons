import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    agents: [
      {
        id: "sentinel-treasury-agent",
        name: "Treasury Agent",
        description: "Autonomous LP management and resource allocation for the community treasury. Analyzes Meteora DLMM pools, manages positions, and coordinates with other agents via Arkhai escrow.",
        assetAddress: "672FfwmZciUHgJ1mNPMKALoPyGQ2wpuRBBqNDCccXDpT",
        walletAddress: "672FfwmZciUHgJ1mNPMKALoPyGQ2wpuRBBqNDCccXDpT",
        litPkpAddress: process.env.LIT_PKP_WALLET || "0xcfe85820d6e01739d3ea0ed66fd350645ee4314b",
        status: "active",
        safetyScore: 0.92,
        lastEvaluation: new Date().toISOString(),
        capabilities: ["meteora-lp", "market-analysis", "escrow-management", "governance-execution"],
        registeredOn: "Metaplex Agent Registry (Solana Devnet)",
        signedVia: "Lit Protocol PKP (TEE)",
        auditTrail: "Bittensor (censorship-resistant)",
      },
      {
        id: "sentinel-safety-monitor",
        name: "Safety Monitor",
        description: "Continuous adversarial evaluation of all community agents. Tests for social engineering, prompt injection, data exfiltration, evaluation awareness, and deceptive reasoning.",
        assetAddress: "safety-monitor-001",
        walletAddress: process.env.LIT_ACCOUNT_WALLET || "0x434b0d3ef4452af8b63975cb959788a3ca7fb145",
        litPkpAddress: process.env.LIT_PKP_WALLET || "0xcfe85820d6e01739d3ea0ed66fd350645ee4314b",
        status: "active",
        safetyScore: 1.0,
        lastEvaluation: new Date().toISOString(),
        capabilities: ["inspect-ai-evals", "red-teaming", "behavioral-analysis", "attestation-signing"],
        registeredOn: "Cross-chain (Lit Protocol)",
        signedVia: "Lit Protocol PKP (TEE)",
        auditTrail: "Bittensor (censorship-resistant)",
      },
    ],
    holonymVerification: {
      address: process.env.HOLONYM_USER_ADDRESS,
      verified: true,
      sbtChain: "Optimism",
    },
  });
}
