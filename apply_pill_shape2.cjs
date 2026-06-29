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
        } else if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.jsx') || file.endsWith('.js')) {
            results.push(file);
        }
    });
    return results;
}

const files = walk('./src');
let changedCount = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // For inputs: 
    let newContent = content.replace(/<input([\s\S]*?)className=["']([^"']*)["']([\s\S]*?)>/g, (match, before, classNames, after) => {
        if (match.includes('type="checkbox"') || match.includes('type="radio"')) return match;
        
        let newClasses = classNames.replace(/rounded-(none|sm|md|lg|xl|2xl|3xl|\[\d+px\]|\[\d+rem\])/g, 'rounded-full');
        if (!newClasses.includes('rounded-full') && !newClasses.includes('rounded-')) {
             newClasses += ' rounded-full';
        }
        return `<input${before}className="${newClasses}"${after}>`;
    });

    // For buttons:
    newContent = newContent.replace(/<button([\s\S]*?)className=["']([^"']*)["']([\s\S]*?)>/g, (match, before, classNames, after) => {
        // Exclude text-only buttons (like bare links) that we don't want to make pill shaped or have box shadows
        // Let's assume if it has 'bg-' it's a solid/outline button, or if it has 'border'
        let newClasses = classNames.replace(/rounded-(none|sm|md|lg|xl|2xl|3xl|\[\d+px\]|\[\d+rem\])/g, 'rounded-full');
        
        if (!newClasses.includes('rounded-full') && !newClasses.includes('rounded-')) {
             newClasses += ' rounded-full';
        }

        // Add some effects to buttons if it doesn't already have some
        // Let's only add shadow/effects if it's not a text-only link or icon-only button (w-8 h-8 etc)
        const isIconOnly = /\bw-\d+\s+h-\d+/.test(newClasses) && newClasses.includes('flex');
        const isTextLink = newClasses.includes('hover:text-') && !newClasses.includes('bg-') && !newClasses.includes('border');
        
        if (!isTextLink) {
            if (!newClasses.includes('transition-all') && !newClasses.includes('transition-colors')) {
                newClasses += ' transition-all duration-300';
            }
            if (!newClasses.includes('active:scale-95') && !newClasses.includes('active:scale-')) {
                newClasses += ' active:scale-95';
            }
            if (!newClasses.includes('hover:-translate-y-')) {
                newClasses += ' hover:-translate-y-0.5';
            }
            if (!newClasses.includes('shadow-') && !newClasses.includes('hover:shadow-') && !isIconOnly) {
                newClasses += ' hover:shadow-lg shadow-sm';
            }
        }

        return `<button${before}className="${newClasses}"${after}>`;
    });
    
    if (newContent !== content) {
        fs.writeFileSync(file, newContent, 'utf8');
        changedCount++;
    }
});

console.log(`Updated ${changedCount} files.`);
