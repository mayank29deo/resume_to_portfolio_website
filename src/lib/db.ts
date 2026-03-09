import { sql } from "@vercel/postgres";
import type { PortfolioData, PortfolioRow } from "./types";

// Run once on first deploy (or via /api/init)
export async function ensureTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS portfolios (
      id          VARCHAR(12)  PRIMARY KEY,
      data        JSONB        NOT NULL,
      created_at  TIMESTAMPTZ  DEFAULT NOW(),
      updated_at  TIMESTAMPTZ  DEFAULT NOW()
    );
  `;
}

export async function createPortfolio(
  id: string,
  data: PortfolioData
): Promise<void> {
  await sql`
    INSERT INTO portfolios (id, data)
    VALUES (${id}, ${JSON.stringify(data)})
  `;
}

export async function getPortfolio(id: string): Promise<PortfolioRow | null> {
  const { rows } = await sql<PortfolioRow>`
    SELECT * FROM portfolios WHERE id = ${id} LIMIT 1
  `;
  return rows[0] ?? null;
}

export async function updatePortfolio(
  id: string,
  data: PortfolioData
): Promise<void> {
  await sql`
    UPDATE portfolios
    SET data = ${JSON.stringify(data)}, updated_at = NOW()
    WHERE id = ${id}
  `;
}
