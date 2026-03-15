import { Connection, Keypair, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";

const SOLANA_RPC = process.env.SOLANA_RPC_URL || "https://api.devnet.solana.com";

let connectionInstance: Connection | null = null;

export function getConnection(): Connection {
  if (!connectionInstance) {
    connectionInstance = new Connection(SOLANA_RPC, "confirmed");
  }
  return connectionInstance;
}

export function generateKeypair(): Keypair {
  return Keypair.generate();
}

export async function getBalance(address: string): Promise<number> {
  const conn = getConnection();
  const pubkey = new PublicKey(address);
  const balance = await conn.getBalance(pubkey);
  return balance / LAMPORTS_PER_SOL;
}

export async function requestAirdrop(address: string, amount: number = 1): Promise<string> {
  const conn = getConnection();
  const pubkey = new PublicKey(address);
  const sig = await conn.requestAirdrop(pubkey, amount * LAMPORTS_PER_SOL);
  await conn.confirmTransaction(sig);
  return sig;
}

export async function getRecentTransactions(address: string, limit = 10) {
  const conn = getConnection();
  const pubkey = new PublicKey(address);
  const sigs = await conn.getSignaturesForAddress(pubkey, { limit });
  return sigs.map((s) => ({
    signature: s.signature,
    slot: s.slot,
    blockTime: s.blockTime ? new Date(s.blockTime * 1000).toISOString() : null,
    err: s.err,
  }));
}
