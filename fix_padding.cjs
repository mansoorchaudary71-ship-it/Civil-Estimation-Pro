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
        
        // Find p-6, p-8, p-10 etc that don't have sm:p- prefix and replace them with p-4 sm:p-...
        // but only if it's a container (e.g. has rounded- or border or bg-)
        if ((classes.includes('bg-') || classes.includes('border') || classes.includes('rounded-'))) {
             if (/\bp-6\b/.test(newClasses) && !/sm:p-\d/.test(newClasses) && !/md:p-\d/.test(newClasses)) {
                 newClasses = newClasses.replace(/\bp-6\b/g, 'p-4 sm:p-6');
             }
             if (/\bp-8\b/.test(newClasses) && !/sm:p-\d/.test(newClasses) && !/md:p-\d/.test(newClasses)) {
                 newClasses = newClasses.replace(/\bp-8\b/g, 'p-4 sm:p-8 md:p-8');
             }
             if (/\bp-10\b/.test(newClasses) && !/sm:p-\d/.test(newClasses) && !/md:p-\d/.test(newClasses)) {
                 newClasses = newClasses.replace(/\bp-10\b/g, 'p-5 sm:p-8 md:p-10');
             }
             if (/\bp-12\b/.test(newClasses) && !/sm:p-\d/.test(newClasses) && !/md:p-\d/.test(newClasses)) {
                 newClasses = newClasses.replace(/\bp-12\b/g, 'p-5 sm:p-8 md:p-12');
             }
        }
        
        // Add overflow-hidden to all rounded-2xl or rounded-3xl containers if not already present
        // and if it's a card (bg- and shadow)
        if (newClasses.includes('bg-') && (newClasses.includes('rounded-2xl') || newClasses.includes('rounded-3xl') || newClasses.includes('rounded-[24px]') || newClasses.includes('rounded-[32px]'))) {
             if (!newClasses.includes('overflow-hidden') && !newClasses.includes('overflow-visible') && !newClasses.includes('overflow-y-auto') && !newClasses.includes('overflow-x-auto') && !newClasses.includes('relative')) {
                 // Add overflow-hidden
                 newClasses += ' overflow-hidden';
             }
        }
        
        return `className="${newClasses.trim()}"`;
    });

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        changedCount++;
    }
});
console.log('Updated padding/overflow: ' + changedCount);
