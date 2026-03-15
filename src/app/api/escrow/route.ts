import { NextResponse } from "next/server";
import { getEscrows, createEscrow, fulfillEscrow } from "@/lib/arkhai";

export async function GET() {
  return NextResponse.json({ escrows: getEscrows() });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action } = body;

    if (action === "create") {
      const escrow = createEscrow({
        depositor: body.depositor || "Treasury Agent",
        amount: body.amount || "100 USDC",
        condition: body.condition || "Deliver market analysis report",
      });
      return NextResponse.json({ escrow });
    }

    if (action === "fulfill") {
      const escrow = fulfillEscrow(body.escrowId, body.fulfillment);
      if (!escrow) return NextResponse.json({ error: "Escrow not found or not active" }, { status: 404 });
      return NextResponse.json({ escrow });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error) {
    console.error("Escrow error:", error);
    return NextResponse.json({ error: "Escrow operation failed" }, { status: 500 });
  }
}
