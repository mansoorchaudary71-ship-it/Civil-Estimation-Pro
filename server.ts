import express from "express";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";
import cron from "node-cron";
import Database from "better-sqlite3";
import path from "path";

async function startServer() {
  const app = express();
  const PORT = 3000;
  
  app.use(express.json());

  // Database setup
  const dbPath = process.env.NODE_ENV === "production" ? path.join("/tmp", "market_rates.sqlite") : path.join(process.cwd(), 'market_rates.sqlite');
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

  db.exec(`
    CREATE TABLE IF NOT EXISTS search_analytics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      query TEXT,
      clicked_tool TEXT,
      created_at DATETIME
    )
  `);

  app.post("/api/analytics/search", (req, res) => {
    try {
      const { query, clickedTool } = req.body;
      db.prepare("INSERT INTO search_analytics (query, clicked_tool, created_at) VALUES (?, ?, ?)").run(query, clickedTool || null, new Date().toISOString());
      res.json({ success: true });
    } catch(e) {
      res.status(500).json({ error: "Analytics failed" });
    }
  });

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

  app.get("/api/newsletter/count", async (req, res) => {
    try {
      // Initialize Firebase Admin lazily to avoid startup crashes if credentials differ
      const admin = await import("firebase-admin");
      if (!admin.apps.length) {
        const fs = await import("fs");
        const path = await import("path");
        const configPath = path.join(process.cwd(), "firebase-applet-config.json");
        let projectId = "gen-lang-client-0592260180";
        if (fs.existsSync(configPath)) {
          const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
          if (config.projectId) {
            projectId = config.projectId;
          }
        }
        admin.initializeApp({
          projectId: projectId,
        });
      }

      const firestore = admin.firestore();
      const snapshot = await firestore.collection("newsletter_subscriptions").count().get();
      res.json({ success: true, count: snapshot.data().count });
    } catch (error: any) {
      console.error("Newsletter count error:", error);
      res.status(500).json({ error: "Failed to fetch count" });
    }
  });

  app.post("/api/newsletter/subscribe", async (req, res) => {
    try {
      const { email } = req.body;
      if (!email || !/^\\S+@\\S+\\.\\S+$/.test(email)) {
        return res.status(400).json({ error: "Invalid email address" });
      }

      // Initialize Firebase Admin lazily to avoid startup crashes if credentials differ
      const admin = await import("firebase-admin");
      if (!admin.apps.length) {
        const fs = await import("fs");
        const path = await import("path");
        const configPath = path.join(process.cwd(), "firebase-applet-config.json");
        let projectId = "gen-lang-client-0592260180";
        if (fs.existsSync(configPath)) {
          const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
          if (config.projectId) {
            projectId = config.projectId;
          }
        }
        admin.initializeApp({
          projectId: projectId,
        });
      }

      const firestore = admin.firestore();
      await firestore.collection("newsletter_subscriptions").add({
        email,
        subscribedAt: admin.firestore.FieldValue.serverTimestamp(),
        source: "footer"
      });

      res.json({ success: true });
    } catch (error: any) {
      console.error("Newsletter subscription error:", error);
      res.status(500).json({ error: "Failed to subscribe" });
    }
  });

  app.post("/api/workspace/gmail/send", async (req, res) => {
    const { google } = await import("googleapis");
    const { OAuth2Client } = await import("google-auth-library");
    
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }
    
    try {
      const client = new OAuth2Client();
      client.setCredentials({ access_token: token });
      const gmail = google.gmail({ version: "v1", auth: client });
      
      const { to, subject, body } = req.body;
      
      const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
      const messageParts = [
        `To: ${to}`,
        `Subject: ${utf8Subject}`,
        "Content-Type: text/html; charset=utf-8",
        "MIME-Version: 1.0",
        "",
        body
      ];
      const message = messageParts.join('\\n');
      
      const encodedMessage = Buffer.from(message)
        .toString("base64")
        .replace(/\\+/g, "-")
        .replace(/\\//g, "_")
        .replace(/=+$/, "");
        
      await gmail.users.messages.send({
        userId: "me",
        requestBody: {
          raw: encodedMessage,
        },
      });
      
      res.json({ success: true });
    } catch (error: any) {
      console.error("Gmail error:", error);
      res.status(500).json({ error: "Failed to send email", details: error.message });
    }
  });

  app.get("/api/sieve-specs", (req, res) => {
    try {
      const specifications = {
        "categories": [
                {
                        "name": "Granular Sub-base (GSB)",
                        "gradings": [
                                {
                                        "name": "Grading for Granular Sub-base Materials (GSB) (Grading - I)",
                                        "sieves": [
                                                {
                                                        "size": 75,
                                                        "minPassing": 100,
                                                        "maxPassing": 100
                                                },
                                                {
                                                        "size": 53,
                                                        "minPassing": 80,
                                                        "maxPassing": 100
                                                },
                                                {
                                                        "size": 26.5,
                                                        "minPassing": 55,
                                                        "maxPassing": 90
                                                },
                                                {
                                                        "size": 9.5,
                                                        "minPassing": 35,
                                                        "maxPassing": 65
                                                },
                                                {
                                                        "size": 4.75,
                                                        "minPassing": 25,
                                                        "maxPassing": 55
                                                },
                                                {
                                                        "size": 2.36,
                                                        "minPassing": 20,
                                                        "maxPassing": 40
                                                },
                                                {
                                                        "size": 0.425,
                                                        "minPassing": 10,
                                                        "maxPassing": 25
                                                },
                                                {
                                                        "size": 0.075,
                                                        "minPassing": 3,
                                                        "maxPassing": 10
                                                }
                                        ]
                                },
                                {
                                        "name": "Grading for Granular Sub-base Materials (GSB) (Grading - II)",
                                        "sieves": [
                                                {
                                                        "size": 53,
                                                        "minPassing": 100,
                                                        "maxPassing": 100
                                                },
                                                {
                                                        "size": 26.5,
                                                        "minPassing": 70,
                                                        "maxPassing": 100
                                                },
                                                {
                                                        "size": 9.5,
                                                        "minPassing": 40,
                                                        "maxPassing": 65
                                                },
                                                {
                                                        "size": 4.75,
                                                        "minPassing": 30,
                                                        "maxPassing": 50
                                                },
                                                {
                                                        "size": 2.36,
                                                        "minPassing": 20,
                                                        "maxPassing": 40
                                                },
                                                {
                                                        "size": 0.425,
                                                        "minPassing": 10,
                                                        "maxPassing": 25
                                                },
                                                {
                                                        "size": 0.075,
                                                        "minPassing": 3,
                                                        "maxPassing": 10
                                                }
                                        ]
                                },
                                {
                                        "name": "Grading for Granular Sub-base Materials (GSB) (Grading - III)",
                                        "sieves": [
                                                {
                                                        "size": 26.5,
                                                        "minPassing": 100,
                                                        "maxPassing": 100
                                                },
                                                {
                                                        "size": 9.5,
                                                        "minPassing": 65,
                                                        "maxPassing": 95
                                                },
                                                {
                                                        "size": 4.75,
                                                        "minPassing": 50,
                                                        "maxPassing": 80
                                                },
                                                {
                                                        "size": 2.36,
                                                        "minPassing": 40,
                                                        "maxPassing": 65
                                                },
                                                {
                                                        "size": 0.425,
                                                        "minPassing": 15,
                                                        "maxPassing": 30
                                                },
                                                {
                                                        "size": 0.075,
                                                        "minPassing": 3,
                                                        "maxPassing": 10
                                                }
                                        ]
                                },
                                {
                                        "name": "Grading for Granular Sub-base Materials (GSB) (Grading - IV)",
                                        "sieves": [
                                                {
                                                        "size": 26.5,
                                                        "minPassing": 100,
                                                        "maxPassing": 100
                                                },
                                                {
                                                        "size": 9.5,
                                                        "minPassing": 50,
                                                        "maxPassing": 80
                                                },
                                                {
                                                        "size": 4.75,
                                                        "minPassing": 35,
                                                        "maxPassing": 65
                                                },
                                                {
                                                        "size": 2.36,
                                                        "minPassing": 25,
                                                        "maxPassing": 50
                                                },
                                                {
                                                        "size": 0.425,
                                                        "minPassing": 10,
                                                        "maxPassing": 20
                                                },
                                                {
                                                        "size": 0.075,
                                                        "minPassing": 3,
                                                        "maxPassing": 10
                                                }
                                        ]
                                },
                                {
                                        "name": "Grading for Granular Sub-base Materials (GSB) (Grading - V)",
                                        "sieves": [
                                                {
                                                        "size": 9.5,
                                                        "minPassing": 100,
                                                        "maxPassing": 100
                                                },
                                                {
                                                        "size": 4.75,
                                                        "minPassing": 80,
                                                        "maxPassing": 100
                                                },
                                                {
                                                        "size": 2.36,
                                                        "minPassing": 55,
                                                        "maxPassing": 90
                                                },
                                                {
                                                        "size": 0.425,
                                                        "minPassing": 25,
                                                        "maxPassing": 50
                                                },
                                                {
                                                        "size": 0.075,
                                                        "minPassing": 3,
                                                        "maxPassing": 10
                                                }
                                        ]
                                },
                                {
                                        "name": "Grading for Granular Sub-base Materials (GSB) (Grading - VI)",
                                        "sieves": [
                                                {
                                                        "size": 9.5,
                                                        "minPassing": 100,
                                                        "maxPassing": 100
                                                },
                                                {
                                                        "size": 4.75,
                                                        "minPassing": 65,
                                                        "maxPassing": 100
                                                },
                                                {
                                                        "size": 2.36,
                                                        "minPassing": 50,
                                                        "maxPassing": 80
                                                },
                                                {
                                                        "size": 0.425,
                                                        "minPassing": 15,
                                                        "maxPassing": 30
                                                },
                                                {
                                                        "size": 0.075,
                                                        "minPassing": 3,
                                                        "maxPassing": 10
                                                }
                                        ]
                                }
                        ]
                },
                {
                        "name": "Water Bound Macadam (WBM) & Wet Mix Macadam (WMM)",
                        "gradings": [
                                {
                                        "name": "Water Bound Macadam Sub-Base / Base (WBM) (Coarse Aggregates (63 mm to 42 mm))",
                                        "sieves": [
                                                {
                                                        "size": 90,
                                                        "minPassing": 100,
                                                        "maxPassing": 100
                                                },
                                                {
                                                        "size": 63,
                                                        "minPassing": 90,
                                                        "maxPassing": 100
                                                },
                                                {
                                                        "size": 53,
                                                        "minPassing": 25,
                                                        "maxPassing": 75
                                                },
                                                {
                                                        "size": 45,
                                                        "minPassing": 0,
                                                        "maxPassing": 15
                                                },
                                                {
                                                        "size": 22.4,
                                                        "minPassing": 0,
                                                        "maxPassing": 5
                                                }
                                        ]
                                },
                                {
                                        "name": "Water Bound Macadam Sub-Base / Base (WBM) (Coarse Aggregates (53 mm to 22.4 mm))",
                                        "sieves": [
                                                {
                                                        "size": 63,
                                                        "minPassing": 100,
                                                        "maxPassing": 100
                                                },
                                                {
                                                        "size": 53,
                                                        "minPassing": 95,
                                                        "maxPassing": 100
                                                },
                                                {
                                                        "size": 45,
                                                        "minPassing": 65,
                                                        "maxPassing": 90
                                                },
                                                {
                                                        "size": 22.4,
                                                        "minPassing": 0,
                                                        "maxPassing": 10
                                                },
                                                {
                                                        "size": 11.2,
                                                        "minPassing": 0,
                                                        "maxPassing": 5
                                                }
                                        ]
                                },
                                {
                                        "name": "Water Bound Macadam Sub-Base / Base (WBM) (Grading For Screenings - Grade A (13.2 mm))",
                                        "sieves": [
                                                {
                                                        "size": 13.2,
                                                        "minPassing": 100,
                                                        "maxPassing": 100
                                                },
                                                {
                                                        "size": 11.2,
                                                        "minPassing": 95,
                                                        "maxPassing": 100
                                                },
                                                {
                                                        "size": 5.6,
                                                        "minPassing": 15,
                                                        "maxPassing": 35
                                                },
                                                {
                                                        "size": 0.09,
                                                        "minPassing": 0,
                                                        "maxPassing": 10
                                                }
                                        ]
                                },
                                {
                                        "name": "Water Bound Macadam Sub-Base / Base (WBM) (Grading For Screenings - Grade B (11.2 mm))",
                                        "sieves": [
                                                {
                                                        "size": 11.2,
                                                        "minPassing": 100,
                                                        "maxPassing": 100
                                                },
                                                {
                                                        "size": 9.5,
                                                        "minPassing": 80,
                                                        "maxPassing": 100
                                                },
                                                {
                                                        "size": 5.6,
                                                        "minPassing": 10,
                                                        "maxPassing": 30
                                                },
                                                {
                                                        "size": 0.09,
                                                        "minPassing": 0,
                                                        "maxPassing": 10
                                                }
                                        ]
                                },
                                {
                                        "name": "Wet Mix Macadam (WMM)",
                                        "sieves": [
                                                {
                                                        "size": 53,
                                                        "minPassing": 100,
                                                        "maxPassing": 100
                                                },
                                                {
                                                        "size": 45,
                                                        "minPassing": 95,
                                                        "maxPassing": 100
                                                },
                                                {
                                                        "size": 22.4,
                                                        "minPassing": 60,
                                                        "maxPassing": 80
                                                },
                                                {
                                                        "size": 11.2,
                                                        "minPassing": 40,
                                                        "maxPassing": 60
                                                },
                                                {
                                                        "size": 4.75,
                                                        "minPassing": 25,
                                                        "maxPassing": 40
                                                },
                                                {
                                                        "size": 2.36,
                                                        "minPassing": 15,
                                                        "maxPassing": 30
                                                },
                                                {
                                                        "size": 0.6,
                                                        "minPassing": 8,
                                                        "maxPassing": 22
                                                },
                                                {
                                                        "size": 0.075,
                                                        "minPassing": 0,
                                                        "maxPassing": 8
                                                }
                                        ]
                                }
                        ]
                },
                {
                        "name": "Bituminous Base Courses",
                        "gradings": [
                                {
                                        "name": "Bituminous Macadam (Grading - I (Nominal maximum aggregate size (40 mm)))",
                                        "sieves": [
                                                {
                                                        "size": 45,
                                                        "minPassing": 100,
                                                        "maxPassing": 100
                                                },
                                                {
                                                        "size": 37.5,
                                                        "minPassing": 90,
                                                        "maxPassing": 100
                                                },
                                                {
                                                        "size": 26.5,
                                                        "minPassing": 75,
                                                        "maxPassing": 100
                                                },
                                                {
                                                        "size": 19,
                                                        "minPassing": 71,
                                                        "maxPassing": 95
                                                },
                                                {
                                                        "size": 13.2,
                                                        "minPassing": 35,
                                                        "maxPassing": 61
                                                },
                                                {
                                                        "size": 4.75,
                                                        "minPassing": 10,
                                                        "maxPassing": 22
                                                },
                                                {
                                                        "size": 2.36,
                                                        "minPassing": 4,
                                                        "maxPassing": 14
                                                },
                                                {
                                                        "size": 0.3,
                                                        "minPassing": 0,
                                                        "maxPassing": 5
                                                },
                                                {
                                                        "size": 0.075,
                                                        "minPassing": 0,
                                                        "maxPassing": 2
                                                }
                                        ]
                                },
                                {
                                        "name": "Bituminous Macadam (Grading-II (Nominal maximum aggregate size (19 mm)))",
                                        "sieves": [
                                                {
                                                        "size": 26.5,
                                                        "minPassing": 100,
                                                        "maxPassing": 100
                                                },
                                                {
                                                        "size": 19,
                                                        "minPassing": 90,
                                                        "maxPassing": 100
                                                },
                                                {
                                                        "size": 13.2,
                                                        "minPassing": 56,
                                                        "maxPassing": 88
                                                },
                                                {
                                                        "size": 4.75,
                                                        "minPassing": 16,
                                                        "maxPassing": 36
                                                },
                                                {
                                                        "size": 2.36,
                                                        "minPassing": 4,
                                                        "maxPassing": 19
                                                },
                                                {
                                                        "size": 0.3,
                                                        "minPassing": 0,
                                                        "maxPassing": 8
                                                },
                                                {
                                                        "size": 0.075,
                                                        "minPassing": 0,
                                                        "maxPassing": 2
                                                }
                                        ]
                                },
                                {
                                        "name": "Dense Bituminous Macadam (DBM) (Grading - I (Nominal maximum aggregate size (37.5 mm)))",
                                        "sieves": [
                                                {
                                                        "size": 45,
                                                        "minPassing": 100,
                                                        "maxPassing": 100
                                                },
                                                {
                                                        "size": 37.5,
                                                        "minPassing": 95,
                                                        "maxPassing": 100
                                                },
                                                {
                                                        "size": 26.5,
                                                        "minPassing": 63,
                                                        "maxPassing": 93
                                                },
                                                {
                                                        "size": 19,
                                                        "minPassing": 71,
                                                        "maxPassing": 95
                                                },
                                                {
                                                        "size": 13.2,
                                                        "minPassing": 56,
                                                        "maxPassing": 80
                                                },
                                                {
                                                        "size": 4.75,
                                                        "minPassing": 38,
                                                        "maxPassing": 54
                                                },
                                                {
                                                        "size": 2.36,
                                                        "minPassing": 28,
                                                        "maxPassing": 42
                                                },
                                                {
                                                        "size": 1.18,
                                                        "minPassing": 20,
                                                        "maxPassing": 32
                                                },
                                                {
                                                        "size": 0.6,
                                                        "minPassing": 15,
                                                        "maxPassing": 26
                                                },
                                                {
                                                        "size": 0.3,
                                                        "minPassing": 10,
                                                        "maxPassing": 21
                                                },
                                                {
                                                        "size": 0.15,
                                                        "minPassing": 5,
                                                        "maxPassing": 14
                                                },
                                                {
                                                        "size": 0.075,
                                                        "minPassing": 2,
                                                        "maxPassing": 8
                                                }
                                        ]
                                },
                                {
                                        "name": "Dense Bituminous Macadam (DBM) (Grading - II (Nominal maximum aggregate size (26.5 mm)))",
                                        "sieves": [
                                                {
                                                        "size": 37.5,
                                                        "minPassing": 100,
                                                        "maxPassing": 100
                                                },
                                                {
                                                        "size": 26.5,
                                                        "minPassing": 90,
                                                        "maxPassing": 100
                                                },
                                                {
                                                        "size": 19,
                                                        "minPassing": 71,
                                                        "maxPassing": 95
                                                },
                                                {
                                                        "size": 13.2,
                                                        "minPassing": 56,
                                                        "maxPassing": 80
                                                },
                                                {
                                                        "size": 4.75,
                                                        "minPassing": 38,
                                                        "maxPassing": 54
                                                },
                                                {
                                                        "size": 2.36,
                                                        "minPassing": 28,
                                                        "maxPassing": 42
                                                },
                                                {
                                                        "size": 1.18,
                                                        "minPassing": 20,
                                                        "maxPassing": 32
                                                },
                                                {
                                                        "size": 0.6,
                                                        "minPassing": 15,
                                                        "maxPassing": 26
                                                },
                                                {
                                                        "size": 0.3,
                                                        "minPassing": 10,
                                                        "maxPassing": 21
                                                },
                                                {
                                                        "size": 0.15,
                                                        "minPassing": 5,
                                                        "maxPassing": 14
                                                },
                                                {
                                                        "size": 0.075,
                                                        "minPassing": 2,
                                                        "maxPassing": 8
                                                }
                                        ]
                                },
                                {
                                        "name": "Sand Asphalt Base Course",
                                        "sieves": [
                                                {
                                                        "size": 9.5,
                                                        "minPassing": 100,
                                                        "maxPassing": 100
                                                },
                                                {
                                                        "size": 4.75,
                                                        "minPassing": 85,
                                                        "maxPassing": 100
                                                },
                                                {
                                                        "size": 2.36,
                                                        "minPassing": 80,
                                                        "maxPassing": 100
                                                },
                                                {
                                                        "size": 0.6,
                                                        "minPassing": 20,
                                                        "maxPassing": 65
                                                },
                                                {
                                                        "size": 0.075,
                                                        "minPassing": 2,
                                                        "maxPassing": 8
                                                }
                                        ]
                                }
                        ]
                },
                {
                        "name": "Bituminous Surfacing Courses",
                        "gradings": [
                                {
                                        "name": "Bituminous Concrete (Grading - I (Nominal maximum aggregate size (19 mm)))",
                                        "sieves": [
                                                {
                                                        "size": 26.5,
                                                        "minPassing": 100,
                                                        "maxPassing": 100
                                                },
                                                {
                                                        "size": 19,
                                                        "minPassing": 90,
                                                        "maxPassing": 100
                                                },
                                                {
                                                        "size": 13.2,
                                                        "minPassing": 59,
                                                        "maxPassing": 79
                                                },
                                                {
                                                        "size": 9.5,
                                                        "minPassing": 52,
                                                        "maxPassing": 72
                                                },
                                                {
                                                        "size": 4.75,
                                                        "minPassing": 35,
                                                        "maxPassing": 55
                                                },
                                                {
                                                        "size": 2.36,
                                                        "minPassing": 28,
                                                        "maxPassing": 44
                                                },
                                                {
                                                        "size": 1.18,
                                                        "minPassing": 21,
                                                        "maxPassing": 34
                                                },
                                                {
                                                        "size": 0.6,
                                                        "minPassing": 15,
                                                        "maxPassing": 27
                                                },
                                                {
                                                        "size": 0.3,
                                                        "minPassing": 11,
                                                        "maxPassing": 21
                                                },
                                                {
                                                        "size": 0.15,
                                                        "minPassing": 7,
                                                        "maxPassing": 15
                                                },
                                                {
                                                        "size": 0.075,
                                                        "minPassing": 2,
                                                        "maxPassing": 8
                                                }
                                        ]
                                },
                                {
                                        "name": "Bituminous Concrete (Grading - II (Nominal maximum aggregate size (13.2 mm)))",
                                        "sieves": [
                                                {
                                                        "size": 19,
                                                        "minPassing": 100,
                                                        "maxPassing": 100
                                                },
                                                {
                                                        "size": 13.2,
                                                        "minPassing": 90,
                                                        "maxPassing": 100
                                                },
                                                {
                                                        "size": 9.5,
                                                        "minPassing": 70,
                                                        "maxPassing": 88
                                                },
                                                {
                                                        "size": 4.75,
                                                        "minPassing": 53,
                                                        "maxPassing": 71
                                                },
                                                {
                                                        "size": 2.36,
                                                        "minPassing": 42,
                                                        "maxPassing": 58
                                                },
                                                {
                                                        "size": 1.18,
                                                        "minPassing": 34,
                                                        "maxPassing": 48
                                                },
                                                {
                                                        "size": 0.6,
                                                        "minPassing": 26,
                                                        "maxPassing": 38
                                                },
                                                {
                                                        "size": 0.3,
                                                        "minPassing": 18,
                                                        "maxPassing": 28
                                                },
                                                {
                                                        "size": 0.15,
                                                        "minPassing": 12,
                                                        "maxPassing": 20
                                                },
                                                {
                                                        "size": 0.075,
                                                        "minPassing": 4,
                                                        "maxPassing": 10
                                                }
                                        ]
                                },
                                {
                                        "name": "Close-Graded Premix Surfacing / Mixed Seal Surfacing (MSS) (Type A)",
                                        "sieves": [
                                                {
                                                        "size": 11.2,
                                                        "minPassing": 100,
                                                        "maxPassing": 100
                                                },
                                                {
                                                        "size": 9.5,
                                                        "minPassing": 95,
                                                        "maxPassing": 100
                                                },
                                                {
                                                        "size": 2.36,
                                                        "minPassing": 30,
                                                        "maxPassing": 60
                                                },
                                                {
                                                        "size": 0.6,
                                                        "minPassing": 20,
                                                        "maxPassing": 45
                                                },
                                                {
                                                        "size": 0.075,
                                                        "minPassing": 2,
                                                        "maxPassing": 9
                                                }
                                        ]
                                },
                                {
                                        "name": "Close-Graded Premix Surfacing / Mixed Seal Surfacing (MSS) (Type B)",
                                        "sieves": [
                                                {
                                                        "size": 13.2,
                                                        "minPassing": 100,
                                                        "maxPassing": 100
                                                },
                                                {
                                                        "size": 11.2,
                                                        "minPassing": 95,
                                                        "maxPassing": 100
                                                },
                                                {
                                                        "size": 4.75,
                                                        "minPassing": 30,
                                                        "maxPassing": 60
                                                },
                                                {
                                                        "size": 2.36,
                                                        "minPassing": 20,
                                                        "maxPassing": 45
                                                },
                                                {
                                                        "size": 0.6,
                                                        "minPassing": 15,
                                                        "maxPassing": 35
                                                },
                                                {
                                                        "size": 0.075,
                                                        "minPassing": 2,
                                                        "maxPassing": 9
                                                }
                                        ]
                                },
                                {
                                        "name": "Surfacing Dressing (Nominal size - 19 mm)",
                                        "sieves": [
                                                {
                                                        "size": 26.5,
                                                        "minPassing": 100,
                                                        "maxPassing": 100
                                                },
                                                {
                                                        "size": 19,
                                                        "minPassing": 85,
                                                        "maxPassing": 100
                                                },
                                                {
                                                        "size": 13.2,
                                                        "minPassing": 0,
                                                        "maxPassing": 25
                                                },
                                                {
                                                        "size": 9.5,
                                                        "minPassing": 0,
                                                        "maxPassing": 7
                                                },
                                                {
                                                        "size": 4.75,
                                                        "minPassing": 0,
                                                        "maxPassing": 2
                                                }
                                        ]
                                },
                                {
                                        "name": "Surfacing Dressing (Nominal size - 13 mm)",
                                        "sieves": [
                                                {
                                                        "size": 19,
                                                        "minPassing": 100,
                                                        "maxPassing": 100
                                                },
                                                {
                                                        "size": 13.2,
                                                        "minPassing": 85,
                                                        "maxPassing": 100
                                                },
                                                {
                                                        "size": 9.5,
                                                        "minPassing": 0,
                                                        "maxPassing": 30
                                                },
                                                {
                                                        "size": 4.75,
                                                        "minPassing": 0,
                                                        "maxPassing": 10
                                                },
                                                {
                                                        "size": 2.36,
                                                        "minPassing": 0,
                                                        "maxPassing": 2
                                                }
                                        ]
                                },
                                {
                                        "name": "Surfacing Dressing (Nominal size - 10 mm)",
                                        "sieves": [
                                                {
                                                        "size": 13.2,
                                                        "minPassing": 100,
                                                        "maxPassing": 100
                                                },
                                                {
                                                        "size": 9.5,
                                                        "minPassing": 85,
                                                        "maxPassing": 100
                                                },
                                                {
                                                        "size": 6.3,
                                                        "minPassing": 0,
                                                        "maxPassing": 35
                                                },
                                                {
                                                        "size": 4.75,
                                                        "minPassing": 0,
                                                        "maxPassing": 10
                                                },
                                                {
                                                        "size": 2.36,
                                                        "minPassing": 0,
                                                        "maxPassing": 2
                                                }
                                        ]
                                },
                                {
                                        "name": "Surfacing Dressing (Nominal size - 6 mm)",
                                        "sieves": [
                                                {
                                                        "size": 9.5,
                                                        "minPassing": 100,
                                                        "maxPassing": 100
                                                },
                                                {
                                                        "size": 6.3,
                                                        "minPassing": 85,
                                                        "maxPassing": 100
                                                },
                                                {
                                                        "size": 4.75,
                                                        "minPassing": 0,
                                                        "maxPassing": 30
                                                },
                                                {
                                                        "size": 3.35,
                                                        "minPassing": 0,
                                                        "maxPassing": 10
                                                },
                                                {
                                                        "size": 0.075,
                                                        "minPassing": 0,
                                                        "maxPassing": 2
                                                }
                                        ]
                                },
                                {
                                        "name": "Slury Seal (Type - I (Minimum Layer Thickness - 2-3 mm))",
                                        "sieves": [
                                                {
                                                        "size": 9.5,
                                                        "minPassing": 100,
                                                        "maxPassing": 100
                                                },
                                                {
                                                        "size": 4.75,
                                                        "minPassing": 100,
                                                        "maxPassing": 100
                                                },
                                                {
                                                        "size": 2.36,
                                                        "minPassing": 90,
                                                        "maxPassing": 100
                                                },
                                                {
                                                        "size": 1.18,
                                                        "minPassing": 65,
                                                        "maxPassing": 90
                                                },
                                                {
                                                        "size": 0.6,
                                                        "minPassing": 40,
                                                        "maxPassing": 65
                                                },
                                                {
                                                        "size": 0.3,
                                                        "minPassing": 25,
                                                        "maxPassing": 42
                                                },
                                                {
                                                        "size": 0.15,
                                                        "minPassing": 15,
                                                        "maxPassing": 30
                                                },
                                                {
                                                        "size": 0.075,
                                                        "minPassing": 10,
                                                        "maxPassing": 20
                                                }
                                        ]
                                },
                                {
                                        "name": "Slury Seal (Type II (Minimum Layer Thickness - 4-6 mm))",
                                        "sieves": [
                                                {
                                                        "size": 9.5,
                                                        "minPassing": 100,
                                                        "maxPassing": 100
                                                },
                                                {
                                                        "size": 4.75,
                                                        "minPassing": 90,
                                                        "maxPassing": 100
                                                },
                                                {
                                                        "size": 2.36,
                                                        "minPassing": 65,
                                                        "maxPassing": 90
                                                },
                                                {
                                                        "size": 1.18,
                                                        "minPassing": 45,
                                                        "maxPassing": 70
                                                },
                                                {
                                                        "size": 0.6,
                                                        "minPassing": 30,
                                                        "maxPassing": 50
                                                },
                                                {
                                                        "size": 0.3,
                                                        "minPassing": 18,
                                                        "maxPassing": 30
                                                },
                                                {
                                                        "size": 0.15,
                                                        "minPassing": 10,
                                                        "maxPassing": 21
                                                },
                                                {
                                                        "size": 0.075,
                                                        "minPassing": 5,
                                                        "maxPassing": 15
                                                }
                                        ]
                                },
                                {
                                        "name": "Slury Seal (Type III (Minimum Layer Thickness - 6-8 mm))",
                                        "sieves": [
                                                {
                                                        "size": 9.5,
                                                        "minPassing": 100,
                                                        "maxPassing": 100
                                                },
                                                {
                                                        "size": 4.75,
                                                        "minPassing": 70,
                                                        "maxPassing": 90
                                                },
                                                {
                                                        "size": 2.36,
                                                        "minPassing": 45,
                                                        "maxPassing": 70
                                                },
                                                {
                                                        "size": 1.18,
                                                        "minPassing": 28,
                                                        "maxPassing": 50
                                                },
                                                {
                                                        "size": 0.6,
                                                        "minPassing": 19,
                                                        "maxPassing": 34
                                                },
                                                {
                                                        "size": 0.3,
                                                        "minPassing": 12,
                                                        "maxPassing": 25
                                                },
                                                {
                                                        "size": 0.15,
                                                        "minPassing": 7,
                                                        "maxPassing": 18
                                                },
                                                {
                                                        "size": 0.075,
                                                        "minPassing": 5,
                                                        "maxPassing": 15
                                                }
                                        ]
                                },
                                {
                                        "name": "Stone Matrix Asphalt (SMA) (13-mm SMA (Wearing course))",
                                        "sieves": [
                                                {
                                                        "size": 19,
                                                        "minPassing": 100,
                                                        "maxPassing": 100
                                                },
                                                {
                                                        "size": 13.2,
                                                        "minPassing": 90,
                                                        "maxPassing": 100
                                                },
                                                {
                                                        "size": 9.5,
                                                        "minPassing": 50,
                                                        "maxPassing": 75
                                                },
                                                {
                                                        "size": 4.75,
                                                        "minPassing": 20,
                                                        "maxPassing": 28
                                                },
                                                {
                                                        "size": 2.36,
                                                        "minPassing": 16,
                                                        "maxPassing": 24
                                                },
                                                {
                                                        "size": 1.18,
                                                        "minPassing": 13,
                                                        "maxPassing": 21
                                                },
                                                {
                                                        "size": 0.6,
                                                        "minPassing": 10,
                                                        "maxPassing": 18
                                                },
                                                {
                                                        "size": 0.3,
                                                        "minPassing": 10,
                                                        "maxPassing": 20
                                                },
                                                {
                                                        "size": 0.15,
                                                        "minPassing": 8,
                                                        "maxPassing": 13
                                                },
                                                {
                                                        "size": 0.075,
                                                        "minPassing": 8,
                                                        "maxPassing": 12
                                                }
                                        ]
                                },
                                {
                                        "name": "Stone Matrix Asphalt (SMA) (19-mm SMA (Binder (intermediate) course))",
                                        "sieves": [
                                                {
                                                        "size": 26.5,
                                                        "minPassing": 100,
                                                        "maxPassing": 100
                                                },
                                                {
                                                        "size": 19,
                                                        "minPassing": 90,
                                                        "maxPassing": 100
                                                },
                                                {
                                                        "size": 13.2,
                                                        "minPassing": 45,
                                                        "maxPassing": 70
                                                },
                                                {
                                                        "size": 9.5,
                                                        "minPassing": 28,
                                                        "maxPassing": 60
                                                },
                                                {
                                                        "size": 4.75,
                                                        "minPassing": 22,
                                                        "maxPassing": 30
                                                },
                                                {
                                                        "size": 2.36,
                                                        "minPassing": 18,
                                                        "maxPassing": 25
                                                },
                                                {
                                                        "size": 1.18,
                                                        "minPassing": 15,
                                                        "maxPassing": 22
                                                },
                                                {
                                                        "size": 0.6,
                                                        "minPassing": 12,
                                                        "maxPassing": 20
                                                },
                                                {
                                                        "size": 0.3,
                                                        "minPassing": 10,
                                                        "maxPassing": 18
                                                },
                                                {
                                                        "size": 0.15,
                                                        "minPassing": 9,
                                                        "maxPassing": 13
                                                },
                                                {
                                                        "size": 0.075,
                                                        "minPassing": 8,
                                                        "maxPassing": 12
                                                }
                                        ]
                                },
                                {
                                        "name": "Mastic Asphalt (Coarse Aggregate)",
                                        "sieves": [
                                                {
                                                        "size": 19,
                                                        "minPassing": 100,
                                                        "maxPassing": 100
                                                },
                                                {
                                                        "size": 13.2,
                                                        "minPassing": 88,
                                                        "maxPassing": 100
                                                },
                                                {
                                                        "size": 2.36,
                                                        "minPassing": 0,
                                                        "maxPassing": 5
                                                },
                                                {
                                                        "size": 0.075,
                                                        "minPassing": 0,
                                                        "maxPassing": 2
                                                }
                                        ]
                                },
                                {
                                        "name": "Mastic Asphalt (Fine Aggregate)",
                                        "sieves": [
                                                {
                                                        "size": 2.36,
                                                        "minPassing": 100,
                                                        "maxPassing": 100
                                                },
                                                {
                                                        "size": 0.6,
                                                        "minPassing": 30,
                                                        "maxPassing": 100
                                                },
                                                {
                                                        "size": 0.212,
                                                        "minPassing": 10,
                                                        "maxPassing": 40
                                                },
                                                {
                                                        "size": 0.075,
                                                        "minPassing": 0,
                                                        "maxPassing": 25
                                                }
                                        ]
                                }
                        ]
                }
        ]
};
      res.json(specifications);
    } catch (e) {
      res.status(500).json({ status: "error", message: "Failed to fetch specs" });
    }
  });

  // Contact API route
  app.post("/api/contact", async (req, res) => {
    try {
      const { name, email, subject, message } = req.body;
      
      if (!name || !email || !subject || !message) {
        return res.status(400).json({ error: "All fields are required." });
      }

      if (!process.env.RESEND_API_KEY) {
        console.error("RESEND_API_KEY is not defined in environment variables.");
        return res.status(500).json({ error: "Email service is not configured." });
      }

      // Dynamic import to avoid module issues
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);

      // Sending email logic
      const data = await resend.emails.send({
        from: 'Contact Form <onboarding@resend.dev>', // Using Resend's default test sender
        to: process.env.CONTACT_EMAIL || 'delivered@resend.dev', // Fallback to resend dev
        subject: `New Contact Form Submission: ${subject}`,
        html: `
          <h2>New Message from Civil Estimation Pro</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <h3>Message:</h3>
          <p>${message.replace(/\n/g, '<br/>')}</p>
        `
      });

      res.status(200).json({ success: true, data });
    } catch (error) {
      console.error("Failed to send email:", error);
      res.status(500).json({ error: "Failed to send message." });
    }
  });

  // Blog API routes
  app.get("/api/blog/posts", async (req, res) => {
    try {
      const fs = await import("fs");
      const path = await import("path");
      const matter = (await import("gray-matter")).default;
      
      const blogDir = path.join(process.cwd(), "content", "blog");
      if (!fs.existsSync(blogDir)) {
        return res.json({ posts: [] });
      }
      
      const files = fs.readdirSync(blogDir).filter(file => file.endsWith(".md") || file.endsWith(".mdx"));
      const posts = files.map(file => {
        const fileContent = fs.readFileSync(path.join(blogDir, file), "utf-8");
        const { data } = matter(fileContent);
        return {
          slug: file.replace(/\.mdx?$/, ""),
          title: data.title || "Untitled",
          date: data.date || "",
          excerpt: data.excerpt || "",
          author: data.author || "Admin",
          category: data.category || "General",
          image: data.image || "https://images.unsplash.com/photo-1541888086425-d81bb19240f5?auto=format&fit=crop&q=80&w=800"
        };
      });

      // Sort by date descending
      posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      res.json({ posts });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Failed to load posts" });
    }
  });

  app.get("/api/blog/posts/:slug", async (req, res) => {
    try {
      const fs = await import("fs");
      const path = await import("path");
      const matter = (await import("gray-matter")).default;

      const slug = req.params.slug;
      const mdPath = path.join(process.cwd(), "content", "blog", `${slug}.md`);
      const mdxPath = path.join(process.cwd(), "content", "blog", `${slug}.mdx`);
      
      let filePath = mdPath;
      if (!fs.existsSync(filePath)) {
        if (fs.existsSync(mdxPath)) {
          filePath = mdxPath;
        } else {
          return res.status(404).json({ error: "Post not found" });
        }
      }

      const fileContent = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(fileContent);
      
      res.json({
        post: {
          slug,
          title: data.title || "Untitled",
          date: data.date || "",
          excerpt: data.excerpt || "",
          author: data.author || "Admin",
          category: data.category || "General",
          image: data.image || "https://images.unsplash.com/photo-1541888086425-d81bb19240f5?auto=format&fit=crop&q=80&w=800",
          content
        }
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Failed to process post" });
    }
  });

  const ALL_MODULES_DATA = [
    { id: "qs-workflow", title: "Guided QS Workflow", category: "Quantity Estimator" },
    { id: "quick-estimation", title: "Quick Rough Estimation", category: "Quantity Estimator" },
    { id: "master-quantity", title: "Master Quantity & Estimation", category: "Quantity Estimator" },
    { id: "house", title: "House Estimator", category: "Quantity Estimator" },
    { id: "material-takeoff", title: "Material Takeoff Sheet", category: "Quantity Estimator" },
    { id: "cost-summary", title: "Cost Summary Sheet", category: "Quantity Estimator" },
    { id: "measurement-sheet", title: "Measurement Sheet Calculator", category: "Quantity Estimator" },
    { id: "boq", title: "Professional BOQ Generator", category: "Quantity Estimator" },
    { id: "takeoff", title: "Plan Measure", category: "Quantity Estimator" },
    { id: "rates", title: "Live DB Rates", category: "Quantity Estimator" },
    { id: "interiors-finishes", title: "Interiors & Finishes", category: "Quantity Estimator" },
    { id: "area-space-calculator", title: "Area & Space Calculator", category: "Quantity Estimator" },
    { id: "volume-estimator", title: "Volume & Tank Capacity", category: "Quantity Estimator" },
    { id: "metal-weight", title: "Metal Weight", category: "Quantity Estimator" },
    { id: "unit-converter", title: "Unit Converter", category: "Quantity Estimator" },
    { id: "ai", title: "AI Assistant", category: "Quantity Estimator" },
    { id: "master-rcc", title: "Master RCC Estimator", category: "Concrete Tech" },
    { id: "calculators", title: "Construction Material", category: "Concrete Tech" },
    { id: "mix-design", title: "Concrete Mix Design", category: "Concrete Tech" },
    { id: "bbs-generator", title: "BBS Generator", category: "Concrete Tech" },
    { id: "reinforcement", title: "Reinforcement Detailing Visualizer", category: "Concrete Tech" },
    { id: "isolated-footing", title: "Isolated Footing Calculator", category: "Concrete Tech" },
    { id: "retaining-wall", title: "Retaining Wall Estimator", category: "Concrete Tech" },
    { id: "staircase-calculator", title: "Staircase Calculator", category: "Concrete Tech" },
    { id: "aggregate-tests", title: "Aggregate Tests", category: "Concrete Tech" },
    { id: "formwork", title: "Formwork & Scaffold", category: "Concrete Tech" },
    { id: "road-pavement", title: "Road & Pavement Estimator", category: "Road Construction" },
    { id: "earthworks", title: "Earthworks & Excavation", category: "Road Construction" },
    { id: "chainage", title: "Chainage Volume", category: "Road Construction" },
    { id: "gradient-calculator", title: "Gradient & Slope", category: "Road Construction" },
    { id: "anti-termite", title: "Anti-Termite Calculator", category: "Road Construction" },
    { id: "geotechnical", title: "Geotechnical & Soil Tests", category: "Soil Tests" },
    { id: "cbr-test", title: "CBR Test Calculator", category: "Soil Tests" },
    { id: "master-sieve", title: "Master Sieve Analysis", category: "Soil Tests" },
    { id: "aggregate-blending", title: "Aggregate Blending", category: "Soil Tests" },
    { id: "direct-shear", title: "Direct Shear Test", category: "Soil Tests" },
    { id: "permeability-test", title: "Permeability Calculator", category: "Soil Tests" },
    { id: "mep-calculator", title: "Energy & MEP Calculators", category: "MEP" },
    { id: "solar-roof", title: "Solar Roof Calculator", category: "MEP" },
    { id: "rainwater-harvesting", title: "Rainwater Harvesting", category: "MEP" },
    { id: "projects", title: "Project Manager", category: "Analysis & Tools" },
    { id: "tracker", title: "Site Progress Tracker", category: "Analysis & Tools" },
    { id: "labour-calculator", title: "Labour & Workforce", category: "Analysis & Tools" },
    { id: "beam-design", title: "Beam Design Tool", category: "Structural Design" },
    { id: "column-design", title: "Column Design Tool", category: "Structural Design" },
    { id: "raft-foundation", title: "Raft Foundation Designer", category: "Structural Design" },
    { id: "water-tank-design", title: "Water Tank Design", category: "Structural Design" },
    { id: "pile-foundation", title: "Pile Foundation Calculator", category: "Structural Design" },
    { id: "prestressed-concrete", title: "Pre-stressed Concrete Estimator", category: "Structural Design" },
    { id: "room-area-calculator", title: "Room Area Calculator", category: "Architectural References & Space Planning" },
    { id: "building-setback-calculator", title: "Building Setback Calculator", category: "Architectural References & Space Planning" },
    { id: "far-fsi-calculator", title: "FAR/FSI Calculator", category: "Architectural References & Space Planning" },
    { id: "staircase-design-reference", title: "Staircase Design Reference", category: "Architectural References & Space Planning" },
    { id: "door-window-schedule", title: "Door & Window Schedule", category: "Architectural References & Space Planning" },
    { id: "ventilation-checker", title: "Ventilation & Lighting Checker", category: "Architectural References & Space Planning" }
  ];

  app.post("/api/search", async (req, res) => {
    try {
      const { query } = req.body;
      if (!query) {
        return res.status(400).json({ error: "Query is required" });
      }

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `You are a search engine for a Civil Engineering Estimation Platform. You know all 51 tools on the platform. When a user types any query in any language or broken English or technical jargon you must return the top 3 most relevant tools in JSON format with fields toolId, toolName, category, matchReason, confidenceScore. Understand construction intent deeply. A query like concrete ratio M25 means Concrete Mix Design. Cut fill volume means Earthworks and Excavation. Always return valid JSON only with no explanation text.

      Here is the list of tools:
      ${JSON.stringify(ALL_MODULES_DATA)}

      User Query: "${query}"`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });
      
      let text = response.text || "[]";
      // Remove any markdown formatting
      text = text.replace(/```json/g, '').replace(/```/g, '').trim();
      let parsed: any = [];
      try {
        parsed = JSON.parse(text);
        if (!Array.isArray(parsed)) {
          parsed = parsed.results || parsed.tools || parsed.data || [];
        }
      } catch (e) {
        console.error("Failed to parse Gemini JSON output", text);
        return res.json({ results: [] });
      }
      
      res.json({ results: parsed });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Search failed" });
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
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
