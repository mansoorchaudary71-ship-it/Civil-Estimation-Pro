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

  // Replace block results with light version
  content = content.replace(
      /bg-slate-900 rounded-2xl px-4 py-3 text-white flex flex-col justify-center/g, 
      'bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 px-4 py-3 flex flex-col justify-center shadow-sm'
  );
  
  content = content.replace(
      /bg-slate-900 rounded-3xl px-4 py-3 text-white flex flex-col justify-center/g, 
      'bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800 px-4 py-3 flex flex-col justify-center shadow-sm'
  );

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated blocks in ${file}`);
  }
}
