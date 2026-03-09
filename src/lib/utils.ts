import { customAlphabet } from "nanoid";

// URL-safe 10-char ID  e.g. "aB3xK9mNpQ"
const nanoid = customAlphabet(
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
  10
);

export function generateId(): string {
  return nanoid();
}

export function getPortfolioUrl(id: string): string {
  const base =
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return `${base}/p/${id}`;
}
