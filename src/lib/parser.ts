// Extracts plain text and hyperlinks from PDF or DOCX buffers

const LINKEDIN_URL_RE = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/([a-zA-Z0-9\-_%]+)\/?/i;

function normaliseLinkedIn(raw: string): string | null {
  const m = raw.match(LINKEDIN_URL_RE);
  if (!m) return null;
  return `https://www.linkedin.com/in/${m[1]}`;
}

/**
 * Scan raw PDF bytes for URI annotation entries.
 * PDFs store clickable links as annotation objects:
 *   /URI (https://linkedin.com/in/username/)
 * No extra deps needed — we read the buffer directly.
 */
function extractLinkedInFromPDFLinks(buffer: Buffer): string | null {
  // Latin-1 keeps every byte as its own character, so ASCII patterns are intact
  const raw = buffer.toString("latin1");
  // Match both /URI (url) and the rare /URI<url> forms
  const re = /\/URI\s*[\(<]([^)>]*linkedin\.com\/in\/[^)>]+)[\)>]/gi;
  let match: RegExpExecArray | null;
  while ((match = re.exec(raw)) !== null) {
    const found = normaliseLinkedIn(match[1].trim());
    if (found) return found;
  }
  return null;
}

/**
 * Use mammoth's HTML output (which preserves <a href="...">) to find
 * a LinkedIn hyperlink embedded in a DOCX file.
 */
async function extractLinkedInFromDOCXLinks(buffer: Buffer): Promise<string | null> {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const mammoth = require("mammoth");
  const { value: html } = await mammoth.convertToHtml({ buffer });
  const re = /href="([^"]*linkedin\.com\/in\/[^"]+)"/gi;
  const htmlStr = html as string;
  let match: RegExpExecArray | null;
  while ((match = re.exec(htmlStr)) !== null) {
    const found = normaliseLinkedIn(match[1]);
    if (found) return found;
  }
  return null;
}

/**
 * Try to extract a LinkedIn profile URL from the file's embedded hyperlinks.
 * Returns null if none found (caller should fall back to text regex).
 */
export async function extractLinkedInFromLinks(
  buffer: Buffer,
  mimeType: string,
  fileName: string
): Promise<string | null> {
  const name = fileName.toLowerCase();
  const isPDF = mimeType === "application/pdf" || name.endsWith(".pdf");
  const isDOCX =
    mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    name.endsWith(".docx");

  if (isPDF) return extractLinkedInFromPDFLinks(buffer);
  if (isDOCX) return extractLinkedInFromDOCXLinks(buffer);
  return null;
}

export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const pdfParse = require("pdf-parse");
  try {
    const result = await pdfParse(buffer);
    return result.text as string;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    // pdf-parse throws raw pdf.js errors for corrupted/non-standard PDFs
    if (
      msg.includes("XRef") ||
      msg.includes("xref") ||
      msg.includes("Invalid PDF") ||
      msg.includes("Bad") ||
      msg.includes("bad")
    ) {
      throw new Error(
        "Your PDF could not be parsed — it may be corrupted or use an unsupported format. " +
        "Please try one of these fixes: (1) Open the PDF in Adobe Acrobat or Preview and re-save it, " +
        "(2) Re-export it as PDF from Word/Google Docs, or " +
        "(3) Convert it at ilovepdf.com before uploading."
      );
    }
    throw err;
  }
}

export async function extractTextFromDOCX(buffer: Buffer): Promise<string> {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const mammoth = require("mammoth");
  const result = await mammoth.extractRawText({ buffer });
  return result.value as string;
}

export async function extractText(
  buffer: Buffer,
  mimeType: string,
  fileName: string
): Promise<string> {
  const isPDF =
    mimeType === "application/pdf" || fileName.toLowerCase().endsWith(".pdf");
  const isDOCX =
    mimeType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    fileName.toLowerCase().endsWith(".docx");

  if (isPDF) return extractTextFromPDF(buffer);
  if (isDOCX) return extractTextFromDOCX(buffer);
  throw new Error("Unsupported file type. Please upload a PDF or DOCX file.");
}
