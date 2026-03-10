import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import type { PortfolioData, PortfolioRow } from "./types";

// ── Use Supabase in production; fall back to local JSON file in dev ───────────
const USE_SUPABASE = !!(
  process.env.SUPABASE_URL && process.env.SUPABASE_SECRET_KEY
);

// Supabase client uses HTTPS — no SSL certificate issues
const supabase = USE_SUPABASE
  ? createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SECRET_KEY!,
      { auth: { persistSession: false } }
    )
  : null;

// ── Local JSON file storage ───────────────────────────────────────────────────
const LOCAL_DB_PATH = path.join(process.cwd(), ".local-db.json");

type LocalDB = { portfolios: Record<string, PortfolioRow> };

function readLocalDB(): LocalDB {
  try {
    if (fs.existsSync(LOCAL_DB_PATH)) {
      return JSON.parse(fs.readFileSync(LOCAL_DB_PATH, "utf-8")) as LocalDB;
    }
  } catch {
    /* ignore parse errors — start fresh */
  }
  return { portfolios: {} };
}

function writeLocalDB(db: LocalDB): void {
  fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(db, null, 2), "utf-8");
}

// ── Exported DB functions ─────────────────────────────────────────────────────

// Table is created once via Supabase SQL Editor — see setup instructions
export async function ensureTable(): Promise<void> {
  return; // no-op: table managed via Supabase dashboard
}

export async function createPortfolio(
  id: string,
  data: PortfolioData
): Promise<void> {
  if (!supabase) {
    const db = readLocalDB();
    const now = new Date().toISOString();
    db.portfolios[id] = { id, data, created_at: now, updated_at: now };
    writeLocalDB(db);
    return;
  }
  const { error } = await supabase.from("portfolios").insert({ id, data });
  if (error) throw new Error(error.message);
}

export async function getPortfolio(id: string): Promise<PortfolioRow | null> {
  if (!supabase) {
    const db = readLocalDB();
    return db.portfolios[id] ?? null;
  }
  const { data, error } = await supabase
    .from("portfolios")
    .select("*")
    .eq("id", id)
    .single();
  if (error || !data) return null;
  return data as PortfolioRow;
}

export async function updatePortfolio(
  id: string,
  data: PortfolioData
): Promise<void> {
  if (!supabase) {
    const db = readLocalDB();
    if (db.portfolios[id]) {
      db.portfolios[id].data = data;
      db.portfolios[id].updated_at = new Date().toISOString();
      writeLocalDB(db);
    }
    return;
  }
  const { error } = await supabase
    .from("portfolios")
    .update({ data, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error(error.message);
}
