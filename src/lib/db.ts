import fs from "fs";
import path from "path";
import { Pool } from "pg";
import type { PortfolioData, PortfolioRow } from "./types";

// ── Use Postgres in production; fall back to a local JSON file in dev ─────────
const USE_POSTGRES = !!process.env.POSTGRES_URL;

// ── Postgres pool (module-level singleton, static import) ─────────────────────
const pool = USE_POSTGRES
  ? new Pool({
      connectionString: process.env.POSTGRES_URL,
      ssl: { rejectUnauthorized: false },
      max: 5,
    })
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

export async function ensureTable(): Promise<void> {
  if (!pool) return;
  await pool.query(`
    CREATE TABLE IF NOT EXISTS portfolios (
      id          VARCHAR(12)  PRIMARY KEY,
      data        JSONB        NOT NULL,
      created_at  TIMESTAMPTZ  DEFAULT NOW(),
      updated_at  TIMESTAMPTZ  DEFAULT NOW()
    )
  `);
}

export async function createPortfolio(
  id: string,
  data: PortfolioData
): Promise<void> {
  if (!pool) {
    const db = readLocalDB();
    const now = new Date().toISOString();
    db.portfolios[id] = { id, data, created_at: now, updated_at: now };
    writeLocalDB(db);
    return;
  }
  await pool.query(
    "INSERT INTO portfolios (id, data) VALUES ($1, $2)",
    [id, JSON.stringify(data)]
  );
}

export async function getPortfolio(id: string): Promise<PortfolioRow | null> {
  if (!pool) {
    const db = readLocalDB();
    return db.portfolios[id] ?? null;
  }
  const { rows } = await pool.query<PortfolioRow>(
    "SELECT * FROM portfolios WHERE id = $1 LIMIT 1",
    [id]
  );
  return rows[0] ?? null;
}

export async function updatePortfolio(
  id: string,
  data: PortfolioData
): Promise<void> {
  if (!pool) {
    const db = readLocalDB();
    if (db.portfolios[id]) {
      db.portfolios[id].data = data;
      db.portfolios[id].updated_at = new Date().toISOString();
      writeLocalDB(db);
    }
    return;
  }
  await pool.query(
    "UPDATE portfolios SET data = $1, updated_at = NOW() WHERE id = $2",
    [JSON.stringify(data), id]
  );
}
