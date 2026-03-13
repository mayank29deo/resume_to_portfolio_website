import { NextRequest, NextResponse } from "next/server";
import { extractText } from "@/lib/parser";
import { extractPortfolioData, mergeLinkedInUpdates } from "@/lib/claude";
import { fetchLinkedInData } from "@/lib/linkedin";
import { createPortfolio, ensureTable } from "@/lib/db";
import { generateId } from "@/lib/utils";

export const runtime = "nodejs";
export const maxDuration = 60;

/** Extract LinkedIn profile URL from raw resume text (if present). */
function extractLinkedInFromResume(text: string): string | null {
  const match = text.match(
    /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/([a-zA-Z0-9\-_%]+)\/?/i
  );
  if (!match) return null;
  const username = match[1].replace(/\/$/, "");
  return `https://www.linkedin.com/in/${username}`;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("resume") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }

    const maxSize = 10 * 1024 * 1024; // 10 MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File too large. Max size is 10MB." },
        { status: 400 }
      );
    }

    // Convert File → Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Extract raw text from PDF or DOCX
    const resumeText = await extractText(buffer, file.type, file.name);

    if (!resumeText || resumeText.trim().length < 50) {
      return NextResponse.json(
        {
          error:
            "Could not extract text from this file. Make sure it's not a scanned image PDF.",
        },
        { status: 422 }
      );
    }

    // Step 1: Parse resume with Claude
    let portfolioData = await extractPortfolioData(resumeText);

    // Step 2: Auto-extract LinkedIn URL from resume text and merge any new entries
    const linkedinUrl = extractLinkedInFromResume(resumeText);
    let linkedInResult: {
      status: string;
      added: { experience: number; projects: number };
    } | null = null;

    if (linkedinUrl) {
      console.log("[/api/parse] Found LinkedIn URL in resume:", linkedinUrl);
      const linkedInData = await fetchLinkedInData(linkedinUrl);
      console.log(
        "[/api/parse] LinkedIn fetch status:",
        linkedInData.fetchStatus,
        linkedInData.message
      );

      if (linkedInData.fetchStatus === "success") {
        const merged = await mergeLinkedInUpdates(portfolioData, linkedInData);
        portfolioData = merged.data;
        linkedInResult = {
          status: linkedInData.message,
          added: merged.added,
        };
        console.log("[/api/parse] LinkedIn merge complete. Added:", merged.added);
      } else {
        linkedInResult = {
          status: linkedInData.message,
          added: { experience: 0, projects: 0 },
        };
      }
    }

    // Step 3: Save to DB
    const id = generateId();
    await ensureTable();
    await createPortfolio(id, portfolioData);

    return NextResponse.json(
      {
        id,
        linkedIn: linkedInResult,
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    console.error("[/api/parse]", err);
    const message =
      err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
