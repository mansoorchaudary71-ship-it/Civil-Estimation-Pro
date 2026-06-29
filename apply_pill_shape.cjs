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
    
    // Replace class rounded-* with rounded-full on inputs (except checkbox/radio)
    // We'll just do a regex replace if we can safely identify it's an input or button.
    
    // For inputs: 
    // Match <input ... className="... rounded-..." ... />
    let newContent = content.replace(/<input\s+([^>]*?)className=["']([^"']*)["']([^>]*?)>/g, (match, before, classNames, after) => {
        if (match.includes('type="checkbox"') || match.includes('type="radio"')) return match;
        
        let newClasses = classNames.replace(/rounded-(sm|md|lg|xl|2xl|3xl|\[\d+px\]|none)/g, 'rounded-full');
        // if no rounded class exists, add it? Let's just replace if it has one, or add it if we are sure it needs it.
        if (!newClasses.includes('rounded-full') && !newClasses.includes('rounded-')) {
             newClasses += ' rounded-full';
        }
        return `<input ${before}className="${newClasses}"${after}>`;
    });

    // For buttons:
    newContent = newContent.replace(/<button\s+([^>]*?)className=["']([^"']*)["']([^>]*?)>/g, (match, before, classNames, after) => {
        let newClasses = classNames.replace(/rounded-(sm|md|lg|xl|2xl|3xl|\[\d+px\]|none)/g, 'rounded-full');
        
        // Ensure rounded-full
        if (!newClasses.includes('rounded-full') && !newClasses.includes('rounded-')) {
             newClasses += ' rounded-full';
        }

        // Add some effects to buttons if it doesn't already have some
        // "add some effects in button as ita too plain"
        // Let's add hover:shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all
        if (!newClasses.includes('transition-all') && !newClasses.includes('transition-colors')) {
            newClasses += ' transition-all duration-300';
        }
        if (!newClasses.includes('active:scale-95')) {
            newClasses += ' active:scale-95';
        }
        if (!newClasses.includes('hover:-translate-y-')) {
            newClasses += ' hover:-translate-y-0.5';
        }
        if (!newClasses.includes('shadow-') && !newClasses.includes('hover:shadow-')) {
            newClasses += ' hover:shadow-lg shadow-sm';
        }

        return `<button ${before}className="${newClasses}"${after}>`;
    });
    
    if (newContent !== content) {
        fs.writeFileSync(file, newContent, 'utf8');
        changedCount++;
    }
});

console.log(`Updated ${changedCount} files.`);
