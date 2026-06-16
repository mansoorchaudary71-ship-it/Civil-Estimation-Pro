import fs from "node:fs/promises";
import path from "node:path";

async function walk(dir) {
  let results = [];
  const list = await fs.readdir(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = await fs.stat(filePath);
    if (stat && stat.isDirectory()) {
      if (!filePath.includes('node_modules') && !filePath.includes('.git')) {
        results = results.concat(await walk(filePath));
      }
    } else {
      if (filePath.endsWith(".tsx") || filePath.endsWith(".ts") || filePath.endsWith(".tsx")) {
        results.push(filePath);
      }
    }
  }
  return results;
}

async function removeDarkColors() {
  const files = await walk("./src");
  let changed = 0;
  for (const file of files) {
    let content = await fs.readFile(file, "utf8");
    let original = content;

    // Remove text-white if it's accompanied by some dark background (heuristic mostly replace explicit dark bg colors)
    // Actually, user said: "Turn it into light mode. Apply changes across all over website"
    // Let's replace the specific dark colors used everywhere:
    // "#0A0F1E" -> "#F8FAFC" (slate-50)
    // "#0D1525" -> "#FFFFFF"
    // "#1E293B" -> "#F1F5F9" (slate-100)
    // "text-white" -> "text-slate-900"
    // "text-slate-300" -> "text-slate-600"
    // "text-slate-400" -> "text-slate-500"
    // "border-slate-800", "border-slate-800/60", "border-slate-700", "border-slate-700/50" -> "border-slate-200"
    // "bg-slate-800", "bg-slate-900", "bg-slate-950" -> "bg-slate-50" or "bg-white"
    
    // Using Regexes for Tailwind dark classes:
    content = content.replace(/dark:[^\s"']+/g, "");
    
    // Replace hex colors explicitly
    content = content.replace(/#0[A-Z0-9]{5}/gi, "#FFFFFF"); // #0A0F1E, #0D1525 etc
    // specifically for those we saw:
    content = content.replace(/bg-\[#0D1525\]/gi, "bg-white");
    content = content.replace(/bg-\[#0A0F1E\]/gi, "bg-slate-50");
    
    // Replace hardcoded slate darks
    content = content.replace(/bg-slate-900/g, "bg-slate-50");
    content = content.replace(/bg-slate-800/g, "bg-white");
    content = content.replace(/bg-slate-950/g, "bg-slate-100");
    content = content.replace(/border-slate-800(\/\d+)?/g, "border-slate-200");
    content = content.replace(/border-slate-700(\/\d+)?/g, "border-slate-200");
    
    // Text colors
    content = content.replace(/text-white/g, "text-slate-900");
    content = content.replace(/text-slate-300/g, "text-slate-700");
    content = content.replace(/text-slate-400/g, "text-slate-600");
    
    // Some specific cases like bg-amber-900/30
    content = content.replace(/border-amber-900(\/\d+)?/g, "border-amber-200");

    if (content !== original) {
      await fs.writeFile(file, content, "utf8");
      changed++;
    }
  }
  console.log(`Updated ${changed} files.`);
}

removeDarkColors().catch(console.error);
