import express from "express";
import { createServer as createViteServer } from "vite";
import cron from "node-cron";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Database setup
  const dbPath = path.join(process.cwd(), 'market_rates.sqlite');
  const db = new Database(dbPath);

  db.pragma('journal_mode = WAL');
  db.exec(`
    CREATE TABLE IF NOT EXISTS market_rates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cement INTEGER,
      steel INTEGER,
      bricks INTEGER,
      sand INTEGER,
      crush INTEGER,
      laborGrey INTEGER,
      laborFinish INTEGER,
      last_updated DATETIME
    )
  `);

  // Initial Seed if empty
  const row = db.prepare('SELECT * FROM market_rates ORDER BY id DESC LIMIT 1').get();
  if (!row) {
    db.prepare(`
      INSERT INTO market_rates (cement, steel, bricks, sand, crush, laborGrey, laborFinish, last_updated)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(1450, 280, 18000, 90, 250, 500, 600, new Date().toISOString());
  }

  // Cron Job to simulate API fetch/scraping every 3 hours
  // In reality this would parse a property portal or finance dept API
  cron.schedule('0 */3 * * *', async () => {
    try {
      console.log('Automated Rate Fetch Started...');
      // Simulated fetch validation logic within constraints:
      // Cement: 1420-1595, Steel: 278-285, Bricks: 16000-21500, Sand: 85-95, Crush: 190-330
      const fetchedRates = {
        cement: Math.floor(Math.random() * (1595 - 1420 + 1) + 1420),
        steel: Math.floor(Math.random() * (285 - 278 + 1) + 278),
        bricks: Math.floor(Math.random() * (21500 - 16000 + 1) + 16000),
        sand: Math.floor(Math.random() * (95 - 85 + 1) + 85),
        crush: Math.floor(Math.random() * (330 - 190 + 1) + 190),
        laborGrey: 520, // baseline
        laborFinish: 610 // baseline
      };

      db.prepare(`
        INSERT INTO market_rates (cement, steel, bricks, sand, crush, laborGrey, laborFinish, last_updated)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(fetchedRates.cement, fetchedRates.steel, fetchedRates.bricks, fetchedRates.sand, fetchedRates.crush, fetchedRates.laborGrey, fetchedRates.laborFinish, new Date().toISOString());
      console.log('Automated Rate Fetch Completed Successfully.', fetchedRates);
    } catch (e) {
      console.error('Automated Rate Fetch Failed. Falling back to local/cached copy...', e);
    }
  });

  app.get("/api/rates", (req, res) => {
    try {
      const currentRates = db.prepare('SELECT * FROM market_rates ORDER BY id DESC LIMIT 1').get();
      res.json({ status: "ok", data: currentRates });
    } catch (e) {
      res.status(500).json({ status: "error", message: "Failed to fetch rates" });
    }
  });

  // Vite development middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
