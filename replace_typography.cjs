const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const walkSync = function(dir, filelist) {
  let files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {
    if (fs.statSync(path.join(dir, file)).isDirectory()) {
      filelist = walkSync(path.join(dir, file), filelist);
    }
    else {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        filelist.push(path.join(dir, file));
      }
    }
  });
  return filelist;
};

let files = walkSync(srcDir);

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Refine Headings and Data Numbers
  content = content.replace(/font-black/g, 'font-bold tabular-nums tracking-tight');
  
  // Specific large texts that might need a bit more subtle treatment
  content = content.replace(/text-6xl font-bold/g, 'text-5xl md:text-6xl font-semibold');
  content = content.replace(/text-5xl font-bold/g, 'text-4xl md:text-5xl font-semibold');
  content = content.replace(/text-4xl lg:text-5xl font-bold/g, 'text-3xl lg:text-4xl font-semibold');
  content = content.replace(/text-4xl font-bold/g, 'text-3xl md:text-4xl font-semibold');
  
  // Some standard heading replacements to reduce heaviness
  content = content.replace(/font-extrabold/g, 'font-bold tracking-tight');

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated typography in ${file}`);
  }
}
