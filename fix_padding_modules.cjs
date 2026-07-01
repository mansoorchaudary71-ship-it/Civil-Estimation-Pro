const fs = require('fs');
const path = require('path');

const files = fs.readdirSync('./src/components/modules').filter(f => f.endsWith('.tsx'));
let changedCount = 0;

files.forEach(fileName => {
    const file = path.join('./src/components/modules', fileName);
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    content = content.replace(/className=["']([^"']*)["']/g, (match, classes) => {
        let newClasses = classes;
        
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
        
        if (newClasses.includes('bg-') && (newClasses.includes('rounded-2xl') || newClasses.includes('rounded-3xl') || newClasses.includes('rounded-[24px]') || newClasses.includes('rounded-[32px]'))) {
             if (!newClasses.includes('overflow-hidden') && !newClasses.includes('overflow-visible') && !newClasses.includes('overflow-y-auto') && !newClasses.includes('overflow-x-auto') && !newClasses.includes('relative')) {
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
console.log('Updated padding/overflow modules: ' + changedCount);
