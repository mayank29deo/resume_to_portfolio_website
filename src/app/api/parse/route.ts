import { NextRequest, NextResponse } from "next/server";
import { extractText } from "@/lib/parser";
import { extractPortfolioData } from "@/lib/claude";
import { createPortfolio, ensureTable } from "@/lib/db";
import { generateId } from "@/lib/utils";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    // Parse multipart form
    const formData = await req.formData();
    const file = formData.get("resume") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }

    const maxSize = 10 * 1024 * 1024; // 10 MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: "File too large. Max size is 10MB." }, { status: 400 });
    }

    // Convert File → Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Extract raw text from PDF or DOCX
    const resumeText = await extractText(buffer, file.type, file.name);

    if (!resumeText || resumeText.trim().length < 50) {
      return NextResponse.json(
        { error: "Could not extract text from this file. Make sure it's not a scanned image PDF." },
        { status: 422 }
      );
    }

    // Ask Claude to structure the resume data
    const portfolioData = await extractPortfolioData(resumeText);

    // Save to DB and return unique ID
    const id = generateId();
    await ensureTable();
    await createPortfolio(id, portfolioData);

    return NextResponse.json({ id }, { status: 201 });
  } catch (err: unknown) {
    console.error("[/api/parse]", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
