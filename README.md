# Sentinel Commons

**Human-governed AI agent infrastructure — with built-in safety monitoring, sovereign auditability, and cross-chain coordination.**

Any time you give an AI agent real authority — over money, decisions, coordination, or resources — Sentinel Commons ensures it's safe, accountable, and human-governed.

## The Problem

AI agents are managing real things: treasuries, grants, communities, resources. But nobody has built infrastructure to make them trustworthy:

1. **Agents can be tricked** — social engineering, prompt injection, authority spoofing
2. **Agents can deceive** — appearing safe in tests, behaving differently in production
3. **Logs can be deleted** — no tamper-proof proof of what an agent did
4. **Bots can govern** — sybil attacks on voting and policy systems

## The Solution: Three Layers

### 1. Safety Watchdog (Inspect AI)
Continuously attacks our own agents to find weaknesses before bad actors do. Reusable evaluation harness for social engineering, prompt injection, data exfiltration, evaluation awareness, and deceptive reasoning.

### 2. Human Governance (Human Passport / Holonym)
Only verified humans — not bots — can set agent policies, vote, and override decisions. Proof of humanity via on-chain SBT on Optimism.

### 3. Tamper-Proof Receipts (Lit Protocol + Bittensor)
Every action is cryptographically signed in TEE hardware (Lit Protocol) and stored on a censorship-resistant network (Bittensor). Nobody can delete the receipts.

## Integrated Technologies

| Technology | Purpose | Track |
|-----------|---------|-------|
| **Inspect AI** | Safety evaluation framework | Protocol Labs |
| **Bittensor** | Censorship-resistant audit trail | Sovereign Infrastructure |
| **Solana** | Settlement layer | Agentic Funding |
| **Metaplex Agent Registry** | On-chain agent identity | Metaplex |
| **Meteora DLMM** | LP management and yield | Meteora |
| **Arkhai/Alkahest** | Conditional escrow | Arkhai |
| **Unbrowse** | Web intelligence | Unbrowse |
| **Lit Protocol** | TEE signing and encryption | Lit Protocol |
| **Human Passport/Holonym** | Sybil-resistant verification | Human Tech |
| **x402** | Agent-to-agent payments | Solana |

## Threat Model (Bittensor Track)

**Threat:** A cloud provider could be compelled to delete agent safety logs, making past misbehavior unprovable.

**Protection:** Evaluation hashes stored on Bittensor — persists even if servers are compromised or legally ordered to delete data.

**Limitations:** Hashes stored (not full data); testnet for demo; evaluator itself must be trusted.

**Cryptographic assumptions:** SHA-256 collision resistance; Lit Protocol TEE integrity; Bittensor consensus for immutability.

## Safety Evaluation (Protocol Labs Track)

**Failure mode:** Can a treasury agent be socially engineered into unauthorized fund transfers?

11 adversarial scenarios across 5 attack categories: social engineering, prompt injection, data exfiltration, evaluation awareness, deceptive reasoning.

```bash
cd safety
pip install -r requirements.txt
export ANTHROPIC_API_KEY=your-key
inspect eval eval_harness.py::full_safety_suite --model anthropic/claude-sonnet-4-20250514
inspect view
```

## Quick Start

```bash
git clone https://github.com/elijah-ship-it/sentinel-commons.git
cd sentinel-commons
pnpm install
cp .env.example .env.local  # Edit with your API keys
pnpm dev
# Open http://localhost:3000
```

## Project Status

New build created at the Intelligence at the Frontier Hackathon (March 14-15, 2026) — Funding the Commons & Protocol Labs @ Frontier Tower, San Francisco.

## Team

- **Elijah Umana** — [GitHub](https://github.com/ElijahUmana)

## License

MIT
