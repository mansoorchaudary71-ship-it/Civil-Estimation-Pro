const fs = require('fs');
const { execSync } = require('child_process');
const files = fs.readdirSync('src/components/modules').filter(f => f.endsWith('.tsx'));
for (const file of files) {
  try {
    execSync(`npx esbuild src/components/modules/${file}`);
  } catch (e) {
    console.log(`\n\n--- FAILED: ${file} ---`);
    console.log(e.stderr ? e.stderr.toString() : e.message);
  }
}
