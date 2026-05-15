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
  
  app.use(express.json());

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
