// Extracts plain text from PDF or DOCX buffers

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
