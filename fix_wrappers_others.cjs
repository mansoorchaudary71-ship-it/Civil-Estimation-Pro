const fs = require('fs');
const path = require('path');

function processDir(dirPath) {
    const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.tsx'));
    let changedCount = 0;

    files.forEach(fileName => {
        const file = path.join(dirPath, fileName);
        let content = fs.readFileSync(file, 'utf8');
        let original = content;

        content = content.replace(/className=["']([^"']*)["']/g, (match, classes) => {
            if (classes.includes('max-w-') && classes.includes('mx-auto') && !classes.includes('md:max-w-') && !classes.includes('lg:max-w-')) {
                if (classes.includes('max-w-none') || classes.includes('max-w-full')) return match;

                let newClasses = classes;
                newClasses = newClasses.replace(/(^|\s)max-w-([a-zA-Z0-9\[\]\-]+)(\s|$)/g, '$1md:max-w-$2$3');
                newClasses = newClasses.replace(/(^|\s)mx-auto(\s|$)/g, '$1md:mx-auto$2');
                
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
    console.log(`Updated ${dirPath}: ` + changedCount);
}

processDir('./src/components');
processDir('./src/components/pages');
processDir('./src/components/ui');
processDir('./src/components/layout');
