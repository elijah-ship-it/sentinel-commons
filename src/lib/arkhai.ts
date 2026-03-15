import { createPublicClient, createWalletClient, http, parseUnits, type Address } from "viem";
import { baseSepolia } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";

const RPC_URL = process.env.ALKAHEST_RPC_URL || "https://sepolia.base.org";

export function getPublicClient() {
  return createPublicClient({
    chain: baseSepolia,
    transport: http(RPC_URL),
  });
}

export function getWalletClient(privateKey: string) {
  const account = privateKeyToAccount(privateKey as `0x${string}`);
  return createWalletClient({
    account,
    chain: baseSepolia,
    transport: http(RPC_URL),
  });
}

// Escrow state management for the demo
export interface EscrowState {
  id: string;
  depositor: string;
  amount: string;
  asset: string;
  arbiterType: string;
  condition: string;
  status: "locked" | "released" | "returned" | "expired";
  fulfillment?: string;
  createdAt: string;
}

// For hackathon demo: simulated escrow operations with real Alkahest patterns
// In production, these would use the full alkahest-ts SDK with on-chain transactions
const escrows: EscrowState[] = [
  {
    id: "escrow-001",
    depositor: "Treasury Agent",
    amount: "100 USDC",
    asset: "ERC20",
    arbiterType: "TrustedOracleArbiter",
    condition: "Market analysis report delivered with >90% accuracy score",
    status: "locked",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "escrow-002",
    depositor: "Research Agent",
    amount: "50 USDC",
    asset: "ERC20",
    arbiterType: "StringArbiter",
    condition: "Provide LP rebalancing recommendation with risk assessment",
    status: "released",
    fulfillment: "Comprehensive report with Meteora DLMM analysis and 3-pool strategy",
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
];

export function getEscrows(): EscrowState[] {
  return escrows;
}

export function createEscrow(params: {
  depositor: string;
  amount: string;
  condition: string;
}): EscrowState {
  const escrow: EscrowState = {
    id: `escrow-${String(escrows.length + 1).padStart(3, "0")}`,
    depositor: params.depositor,
    amount: params.amount,
    asset: "ERC20",
    arbiterType: "TrustedOracleArbiter",
    condition: params.condition,
    status: "locked",
    createdAt: new Date().toISOString(),
  };
  escrows.push(escrow);
  return escrow;
}

export function fulfillEscrow(escrowId: string, fulfillment: string): EscrowState | null {
  const escrow = escrows.find((e) => e.id === escrowId);
  if (!escrow || escrow.status !== "locked") return null;
  escrow.status = "released";
  escrow.fulfillment = fulfillment;
  return escrow;
}
