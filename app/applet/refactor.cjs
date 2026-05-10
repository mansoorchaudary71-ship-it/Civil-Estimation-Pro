const fs = require('fs');
const path = require('path');

const dir = 'src/components/modules';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Match the save to profile button block
  content = content.replace(/\{user\s*&&\s*\(\s*<button[\s\S]*?Save to Profile[\s\S]*?<\/button>\s*\)\s*\}/g, '');
  
  // also remove the saveMessage display if any
  content = content.replace(/\{saveMessage\s*&&\s*<span[^>]*>\{saveMessage\}<\/span>\}/g, '');

  content = content.replace(/const \[isSaving,\s*setIsSaving\]\s*=\s*useState<boolean>\(false\);/g, '');
  content = content.replace(/const \[saveMessage,\s*setSaveMessage\]\s*=\s*useState<string>\(""\);/g, '');
  content = content.replace(/const \[isSaving,\s*setIsSaving\]\s*=\s*useState\(false\);/g, '');
  content = content.replace(/const \[saveMessage,\s*setSaveMessage\]\s*=\s*useState\(""\);/g, '');

  fs.writeFileSync(filePath, content);
}

console.log("Cleanup script completed.");
