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
        if (classes.includes('max-w-') && classes.includes('mx-auto') && !classes.includes('md:max-w-') && !classes.includes('lg:max-w-')) {
            if (classes.includes('max-w-none') || classes.includes('max-w-full')) return match;

            let newClasses = classes;
            newClasses = newClasses.replace(/\bmax-w-([a-zA-Z0-9\[\]]+)\b/g, 'md:max-w-$1');
            newClasses = newClasses.replace(/\bmx-auto\b/g, 'md:mx-auto');
            
            if (!newClasses.includes('w-full')) newClasses = 'w-full ' + newClasses;
            
            if (!/\bpx-\d+\b/.test(newClasses) && !/\bp-\d+\b/.test(newClasses)) {
                 newClasses = newClasses + ' px-4 md:px-0';
            }

            return `className="${newClasses.trim()}"`;
        }
        return match;
    });

    content = content.replace(/className=["']([^"']*)["']/g, (match, classes) => {
        if (classes.includes('bg-white') && classes.includes('shadow') && (classes.includes('rounded-') || classes.includes('p-') || classes.includes('px-'))) {
            let newClasses = classes;
            if (/\bp-\d+\b/.test(newClasses)) {
                newClasses = newClasses.replace(/\bp-6\b/g, 'p-4 sm:p-6');
                newClasses = newClasses.replace(/\bp-8\b/g, 'p-4 sm:p-8');
                newClasses = newClasses.replace(/\bp-10\b/g, 'p-4 sm:p-10');
                newClasses = newClasses.replace(/\bp-12\b/g, 'p-5 sm:p-12');
            }
            if (!newClasses.includes('overflow-hidden') && !newClasses.includes('overflow-visible')) {
                newClasses += ' overflow-hidden';
            }
            if (!newClasses.includes('w-full') && !newClasses.includes('w-fit') && !newClasses.includes('w-max') && !newClasses.includes('w-auto')) {
                newClasses = 'w-full ' + newClasses;
            }
            return `className="${newClasses.trim()}"`;
        }
        return match;
    });

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        changedCount++;
    }
});
console.log('Updated ' + changedCount + ' files.');
