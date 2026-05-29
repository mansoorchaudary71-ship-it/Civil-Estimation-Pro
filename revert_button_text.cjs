const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src/components/modules');

const walkSync = function(dir, filelist) {
  let files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {
    if (fs.statSync(path.join(dir, file)).isDirectory()) {
      filelist = walkSync(path.join(dir, file), filelist);
    }
    else {
      if (file.endsWith('.tsx')) {
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

  // Let's globally revert "text-slate-900 dark:text-white" to "text-slate-800 dark:text-white" just for cleanliness if it's text.
  // Actually, wait. I can just do:
  // If the line has 'bg-indigo-', 'bg-blue-', 'bg-emerald-' and 'text-slate-900 dark:text-white' or 'text-slate-800 dark:text-white'
  
  // Actually, any class string containing `bg-indigo-X` (where X is 500, 600, 700) and `text-slate-900 dark:text-white`
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (/(bg-indigo-\d+|bg-blue-\d+|bg-emerald-\d+|bg-slate-900.*rounded-3xl p-6|bg-purple-\d+|bg-cyan-\d+|bg-orange-\d+)/.test(lines[i])) {
      lines[i] = lines[i].replace(/text-slate-900 dark:text-white/g, 'text-white');
      lines[i] = lines[i].replace(/text-slate-800 dark:text-white/g, 'text-white');
    }
  }
  content = lines.join('\n');

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Reverted text color in ${file}`);
  }
}
