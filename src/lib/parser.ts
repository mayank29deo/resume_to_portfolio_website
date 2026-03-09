// Extracts plain text from PDF or DOCX buffers

export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const pdfParse = require("pdf-parse");
  const result = await pdfParse(buffer);
  return result.text as string;
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
