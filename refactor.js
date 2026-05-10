const fs = require('fs');
const path = require('path');

const dir = 'src/components/modules';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Match the save to profile button block
  // This is tricky because it'sJSX and could span multiple lines.
  // Actually, I can use a simpler regex or logic.
  
  // It usually looks like: {user && ( <button onClick={async () => { setIsSaving(true); ... Save to Profile </> )} </button> )}
  // Or: {user && <button ... Save to Profile ... </button>}
  
  content = content.replace(/\{user\s*&&\s*\(\s*<button[\s\S]*?Save to Profile[\s\S]*?<\/button>\s*\)\s*\}/g, '');
  
  // also remove the saveMessage display if any
  content = content.replace(/\{saveMessage\s*&&\s*<span[^>]*>\{saveMessage\}<\/span>\}/g, '');

  // clean up the leftover wrappers
  // e.g. <div className="mt-6 flex flex-wrap gap-4 items-center"> <ShareButtonWithPopup ... /> </div>
  // Let's just leave the ShareButtonWithPopup where it is, just format it slightly better.
  
  fs.writeFileSync(filePath, content);
}

console.log("Cleanup script completed.");
