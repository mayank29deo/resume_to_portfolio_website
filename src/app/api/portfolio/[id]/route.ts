import { NextRequest, NextResponse } from "next/server";
import { getPortfolio, updatePortfolio } from "@/lib/db";
import type { PortfolioData } from "@/lib/types";

// GET /api/portfolio/[id]
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const row = await getPortfolio(params.id);
  if (!row) {
    return NextResponse.json({ error: "Portfolio not found." }, { status: 404 });
  }
  return NextResponse.json(row.data);
}

// PUT /api/portfolio/[id]
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const row = await getPortfolio(params.id);
    if (!row) {
      return NextResponse.json({ error: "Portfolio not found." }, { status: 404 });
    }

    const body = (await req.json()) as PortfolioData;

    // Basic validation
    if (!body?.personal?.name) {
      return NextResponse.json({ error: "Invalid portfolio data." }, { status: 400 });
    }

    await updatePortfolio(params.id, body);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[PUT /api/portfolio]", err);
    return NextResponse.json({ error: "Failed to save changes." }, { status: 500 });
  }
}
