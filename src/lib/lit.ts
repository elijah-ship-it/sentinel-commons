const LIT_API_BASE = process.env.LIT_API_BASE || "https://api.dev.litprotocol.com/core/v1";
const LIT_API_KEY = process.env.LIT_API_KEY || "";

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
  return res.json();
}

export async function createPKPWallet(): Promise<{ wallet_address: string }> {
  return litFetch("/create_wallet");
}

export async function listWallets() {
  return litFetch("/list_wallets?page_number=0&page_size=50");
}

export async function signMessage(pkpId: string, message: string) {
  const code = `
    const wallet = new ethers.Wallet(await Lit.Actions.getPrivateKey({ pkpId }));
    const signature = await wallet.signMessage(message);
    Lit.Actions.setResponse({ response: JSON.stringify({ signature, address: wallet.address }) });
  `;
  return litFetch("/lit_action", {
    method: "POST",
    body: JSON.stringify({ code, js_params: { pkpId, message } }),
  });
}

export async function encryptData(pkpId: string, data: string) {
  const code = `
    const ciphertext = await Lit.Actions.Encrypt({ pkpId, message: data });
    Lit.Actions.setResponse({ response: JSON.stringify({ ciphertext }) });
  `;
  return litFetch("/lit_action", {
    method: "POST",
    body: JSON.stringify({ code, js_params: { pkpId, data } }),
  });
}

export async function pinLitAction(jsCode: string): Promise<string> {
  const res = await litFetch("/get_lit_action_ipfs_id", {
    method: "POST",
    body: JSON.stringify(jsCode),
  });
  return res as string;
}

export async function executeLitAction(code: string, jsParams: Record<string, unknown> = {}) {
  return litFetch("/lit_action", {
    method: "POST",
    body: JSON.stringify({ code, js_params: jsParams }),
  });
}

// Verifiable safety attestation - signs evaluation results in TEE
export async function signSafetyAttestation(pkpId: string, evaluationData: {
  agentId: string;
  score: number;
  failureMode: string;
  result: string;
  timestamp: string;
}) {
  const code = `
    const wallet = new ethers.Wallet(await Lit.Actions.getPrivateKey({ pkpId }));
    const payload = JSON.stringify(evaluationData);
    const signature = await wallet.signMessage(payload);
    Lit.Actions.setResponse({ response: JSON.stringify({
      attestation: { data: evaluationData, signature, signer: wallet.address }
    })});
  `;
  return litFetch("/lit_action", {
    method: "POST",
    body: JSON.stringify({ code, js_params: { pkpId, evaluationData } }),
  });
}
