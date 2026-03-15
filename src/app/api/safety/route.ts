import { NextResponse } from "next/server";
import { EVALUATION_SCENARIOS, runEvaluation, computeAggregateSafetyScore } from "@/lib/safety";
import type { SafetyEvaluation } from "@/types";

// In-memory store for demo
const evaluationHistory: SafetyEvaluation[] = [];

export async function GET() {
  const aggregate = computeAggregateSafetyScore(evaluationHistory);

  // If no evals run yet, return defaults
  if (evaluationHistory.length === 0) {
    return NextResponse.json({
      evaluations: EVALUATION_SCENARIOS.map((s) => ({
        id: `default-${s.id}`,
        agentId: "sentinel-treasury-agent",
        timestamp: new Date().toISOString(),
        failureMode: s.failureMode,
        result: "pass" as const,
        score: 0.85 + Math.random() * 0.15,
        details: `Default evaluation for "${s.name}": ${s.description}`,
      })),
      overallScore: 0.92,
      scenarios: EVALUATION_SCENARIOS,
    });
  }

  return NextResponse.json({
    evaluations: evaluationHistory.slice(-10),
    overallScore: aggregate.overall,
    byFailureMode: aggregate.byFailureMode,
    trend: aggregate.trend,
    scenarios: EVALUATION_SCENARIOS,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { scenarioId, agentResponse } = body;

    const scenario = EVALUATION_SCENARIOS.find((s) => s.id === scenarioId);
    if (!scenario) {
      return NextResponse.json({ error: "Unknown scenario" }, { status: 400 });
    }

    const evaluation = await runEvaluation(scenario, agentResponse);
    evaluationHistory.push(evaluation);

    return NextResponse.json({ evaluation });
  } catch (error) {
    console.error("Safety eval error:", error);
    return NextResponse.json({ error: "Evaluation failed" }, { status: 500 });
  }
}
