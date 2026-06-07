const fs = require('fs');
const path = require('path');

function walkDir(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        if (file === 'node_modules' || file === '.git') return;
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            results = results.concat(walkDir(filePath));
        } else {
            if (filePath.endsWith('.tsx') || filePath.endsWith('.ts') || filePath.endsWith('.css') || filePath.endsWith('.jsx')) {
                results.push(filePath);
            }
        }
    });
    return results;
}

const files = walkDir('src');
let changedFiles = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    content = content.replace(/text-black/g, 'text-slate-900');
    content = content.replace(/bg-black/g, 'bg-slate-900');
    content = content.replace(/border-black/g, 'border-slate-300');
    content = content.replace(/shadow-black/g, 'shadow-slate-900');
    content = content.replace(/shadow-\[0_(.*?)_rgba\(0,0,0,/g, 'shadow-[0_$1_rgba(15,23,42,');
    content = content.replace(/rgba\(0,0,0,/g, 'rgba(15,23,42,');
    
    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        changedFiles++;
    }
});

console.log(`Updated ${changedFiles} files to remove pure black.`);