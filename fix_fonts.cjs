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

  // target various combinations of style={{ fontFamily: "..." }}
  content = content.replace(/style=\{\{\s*fontFamily:\s*['"][^'"]+['"]\s*\}\}/g, '');
  content = content.replace(/style=\{\{\s*fontFamily:\s*['"][^'"]+['"]\s*,\s*/g, 'style={{ ');

  if (content !== original) {
    // some might have empty style className e.g. `<h2  className="text-2xl">` or `<div style={{}}>`
    content = content.replace(/style=\{\{\s*\}\}/g, '');
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated fonts in ${file}`);
  }
}
