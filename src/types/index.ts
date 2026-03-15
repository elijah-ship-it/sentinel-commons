export interface Agent {
  id: string;
  name: string;
  description: string;
  assetAddress: string;
  walletAddress: string;
  status: "active" | "paused" | "flagged";
  safetyScore: number;
  lastEvaluation: string;
  capabilities: string[];
}

export interface SafetyEvaluation {
  id: string;
  agentId: string;
  timestamp: string;
  failureMode: string;
  result: "pass" | "fail" | "warning";
  score: number;
  details: string;
  bittensorTxHash?: string;
}

export interface TreasuryPosition {
  poolAddress: string;
  poolName: string;
  activeBinPrice: number;
  totalValueUsd: number;
  feesEarnedUsd: number;
  strategy: string;
  bins: { binId: number; price: number; liquidityX: number; liquidityY: number }[];
}

export interface EscrowAgreement {
  id: string;
  type: "service" | "barter";
  status: "active" | "fulfilled" | "expired";
  depositor: string;
  recipient: string;
  amount: string;
  asset: string;
  condition: string;
  createdAt: string;
}

export interface GovernanceProposal {
  id: string;
  title: string;
  description: string;
  proposer: string;
  status: "active" | "passed" | "rejected";
  votesFor: number;
  votesAgainst: number;
  createdAt: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}
