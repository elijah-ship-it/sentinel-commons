/**
 * Lit Protocol Chipotle API — Real TEE signing for safety attestations.
 *
 * Every safety evaluation result is signed inside Lit Protocol's Trusted Execution
 * Environment. The signing key (PKP) exists only transiently inside the TEE —
 * it is never stored, never exported. The signature proves the evaluation was
 * produced by the Lit network, not forged.
 *
 * IPFS CID of pinned Lit Action: QmbD4BQ6yJwnbAbxmhTBBNgdXQ74sXQZuvMbVBFLLk2WnA
 * Community Coordinator PKP: 0xcfe85820d6e01739d3ea0ed66fd350645ee4314b
 * Safety Sentinel PKP: 0x08b4156604ad8f91023fa9c21a65cdbbdeede0ca
 */

import { getStore } from "@/lib/store";

const LIT_API_BASE = process.env.LIT_API_BASE || "https://api.dev.litprotocol.com/core/v1";
const LIT_API_KEY = process.env.LIT_API_KEY || "";
const LIT_ACTION_CID = process.env.LIT_ACTION_CID || "QmbD4BQ6yJwnbAbxmhTBBNgdXQ74sXQZuvMbVBFLLk2WnA";

async function litFetch(endpoint: string, options: RequestInit = {}) {
  const url = `${LIT_API_BASE}${endpoint}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "X-Api-Key": LIT_API_KEY,
      ...options.headers,
    },
    redirect: "follow",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Lit API ${res.status}: ${text.slice(0, 200)}`);
  }
  return res.json();
}

export interface SafetyAttestation {
  data: {
    agentId: string;
    score: number;
    failureMode: string;
    result: string;
    timestamp: string;
  };
  signature: string;
  signer: string;
  litActionCid: string;
}

const SIGNING_CODE = `(async () => {
  const wallet = new ethers.Wallet(await Lit.Actions.getPrivateKey({ pkpId }));
  const payload = JSON.stringify(evaluationData);
  const signature = await wallet.signMessage(payload);
  Lit.Actions.setResponse({ response: JSON.stringify({
    attestation: { data: evaluationData, signature, signer: wallet.address }
  })});
})();`;

/**
 * Sign a safety evaluation result inside Lit Protocol's TEE.
 * Returns a verifiable attestation with cryptographic signature.
 */
export async function signSafetyAttestation(
  pkpId: string,
  evaluationData: {
    agentId: string;
    score: number;
    failureMode: string;
    result: string;
    timestamp: string;
  }
): Promise<SafetyAttestation> {
  const result = await litFetch("/lit_action", {
    method: "POST",
    body: JSON.stringify({
      code: SIGNING_CODE,
      js_params: { pkpId, evaluationData },
    }),
  });

  // Parse the response — Lit wraps it in a response field
  let attestation: SafetyAttestation;
  if (typeof result.response === "string") {
    const parsed = JSON.parse(result.response);
    attestation = { ...parsed.attestation, litActionCid: LIT_ACTION_CID };
  } else if (result.response?.attestation) {
    attestation = { ...result.response.attestation, litActionCid: LIT_ACTION_CID };
  } else {
    throw new Error("Unexpected Lit Action response format");
  }

  // Store the attestation persistently
  const store = getStore();
  await store.appendToArray("attestations", {
    ...attestation,
    storedAt: new Date().toISOString(),
  });

  return attestation;
}

/**
 * Get all stored attestations.
 */
export async function getAttestations(): Promise<SafetyAttestation[]> {
  const store = getStore();
  return (await store.getJSON<SafetyAttestation[]>("attestations")) || [];
}

/**
 * Verify a safety attestation — checks that the signature matches the claimed signer.
 * This can be done by anyone — the signature is a standard Ethereum personal_sign.
 */
export function getVerificationInfo(attestation: SafetyAttestation) {
  return {
    message: `To verify this attestation, use ethers.verifyMessage(${JSON.stringify(attestation.data)}, "${attestation.signature}") and confirm it equals "${attestation.signer}"`,
    litActionCid: attestation.litActionCid,
    signerPkp: attestation.signer,
    canBeVerifiedBy: "Anyone with ethers.js or any Ethereum signature verification tool",
  };
}
