import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const WEB_ROOT = path.resolve(SCRIPT_DIR, "..");
const PRICES_FILE = path.join(WEB_ROOT, "src", "data", "stock-prices.json");
const TABLE = "stock_prices";
const BATCH_SIZE = 500;

// One-time backfill of web/src/data/stock-prices.json into Supabase. Run
// this once after applying supabase/migrations/0001_create_stock_prices.sql
// and before deleting the JSON file. Safe to re-run: upsert on (ticker, date)
// just overwrites rows with the same values.
async function main() {
  const supabaseUrl = process.env.SUPABASE_URL?.trim();
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.");
  }
  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: { persistSession: false },
  });

  const stored = JSON.parse(await readFile(PRICES_FILE, "utf8"));
  for (const [ticker, bars] of Object.entries(stored)) {
    const rows = bars.map((bar) => ({ ticker, ...bar }));
    for (let offset = 0; offset < rows.length; offset += BATCH_SIZE) {
      const chunk = rows.slice(offset, offset + BATCH_SIZE);
      const { error } = await supabase.from(TABLE).upsert(chunk, { onConflict: "ticker,date" });
      if (error) throw error;
    }
    console.log(`${ticker}: ${rows.length} bars migrated`);
  }
}

await main();
