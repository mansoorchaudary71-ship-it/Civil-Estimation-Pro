const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.tsx') || file.endsWith('.jsx')) {
            results.push(file);
        }
    });
    return results;
}

const files = walk('./src/components');
let changedCount = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    content = content.replace(/className=["']([^"']*)["']/g, (match, classes) => {
        let newClasses = classes;
        
        // Remove duplicate p-4, sm:p-4, sm:p-6, etc.
        newClasses = newClasses.replace(/(sm:p-\d+\s*)+/g, (m) => {
            // grab the last one
            const matches = m.match(/sm:p-\d+/g);
            return matches[matches.length - 1] + ' ';
        });
        
        newClasses = newClasses.replace(/(md:p-\d+\s*)+/g, (m) => {
            const matches = m.match(/md:p-\d+/g);
            return matches[matches.length - 1] + ' ';
        });
        
        // also clean up multiple p-4 p-4
        newClasses = newClasses.replace(/\bp-4\s+p-4\b/g, 'p-4');
        newClasses = newClasses.replace(/\bp-5\s+p-5\b/g, 'p-5');
        
        // Let's add flex-wrap to flex gap containers if they don't have it
        if (newClasses.includes('flex ') && (newClasses.includes('gap-4') || newClasses.includes('gap-6') || newClasses.includes('gap-8')) && !newClasses.includes('flex-wrap') && !newClasses.includes('flex-nowrap') && !newClasses.includes('flex-col')) {
            // We want to add flex-wrap. But wait, what if it's an icon + text? Usually that's gap-1, gap-2, gap-3.
            // gap-4 and above are typically larger layouts.
            // Let's just add `flex-wrap`
            newClasses += ' flex-wrap';
        }

        return `className="${newClasses.replace(/\s+/g, ' ').trim()}"`;
    });

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        changedCount++;
    }
});
console.log('Cleaned up padding and added flex-wrap: ' + changedCount);
