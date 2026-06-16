const fs = require('fs');
const glob = require('glob');
const files = glob.sync('src/components/modules/**/*.tsx');
let fixedCount = 0;
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  const count = (content.match(/w-full h-full overflow-y-auto/g) || []).length;
  if (count > 0) {
    content = content.replace(/w-full h-full overflow-y-auto/g, 'w-full h-full');
    fs.writeFileSync(file, content);
    fixedCount++;
  }
}
console.log('Fixed files:', fixedCount);
