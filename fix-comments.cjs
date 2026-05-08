const fs = require('fs');
const path = require('path');

const dirs = ['./src/components/modules', './src/components/ui'];

const CODE_KEYWORDS = ['const ', 'let ', 'var ', 'if ', 'return ', 'for ', 'switch ', 'case ', 'break;', 'default:', 'try ', 'calc', 'input', 'return(', 'return (', 'return<', 'set', 'export ', 'import ', '<div ', '<span ', '<button ', '<input ', 'className=', 'import(', '} else', '}else', '} const', '} let', '} return', 'console.log', 'Math.', 'Object.', 'Array.'];

dirs.forEach(dir => {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx') || f.endsWith('.ts'));

    for (const file of files) {
        const filePath = path.join(dir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        
        let newContent = "";
        let i = 0;
        let modified = false;

        while (i < content.length) {
            let nextSlashSlash = content.indexOf('//', i);
            let nextUrl = content.indexOf('http://', i);
            let nextHttps = content.indexOf('https://', i);
            
            // Skip http:// or https:// 
            if (nextSlashSlash !== -1 && (nextSlashSlash === nextUrl + 5 || nextSlashSlash === nextHttps + 6)) {
                newContent += content.slice(i, nextSlashSlash + 2);
                i = nextSlashSlash + 2;
                continue;
            }

            if (nextSlashSlash === -1) {
                newContent += content.slice(i);
                break;
            }

            // We found a real // comment
            newContent += content.slice(i, nextSlashSlash);
            modified = true;
            
            // Search forward for the first code keyword
            let searchStart = nextSlashSlash + 2;
            let foundKeywordIdx = -1;
            let foundKeyword = "";

            // We want to find the first code keyword that is likely to be after the comment
            // We search up to 150 characters
            let chunk = content.slice(searchStart, searchStart + 150);
            let earliestPos = chunk.length;

            for (const kw of CODE_KEYWORDS) {
                const pos = chunk.indexOf(' ' + kw);
                if (pos !== -1 && pos < earliestPos) {
                    earliestPos = pos;
                    foundKeywordIdx = pos;
                    foundKeyword = kw;
                }
                const pos2 = chunk.indexOf(kw); // directly starts with kw
                if (pos2 !== -1 && pos2 < earliestPos) {
                    // Make sure it's not part of a bigger word
                    // like "config" for "if "
                    const charBefore = pos2 > 0 ? chunk[pos2 - 1] : ' ';
                    if (!charBefore.match(/[a-zA-Z0-9_]/)) {
                        earliestPos = pos2;
                        foundKeywordIdx = pos2;
                        foundKeyword = kw;
                    }
                }
            }

            if (foundKeywordIdx !== -1) {
                // The comment is from searchStart to searchStart + foundKeywordIdx
                let commentText = chunk.slice(0, foundKeywordIdx).trim();
                newContent += `/* ${commentText} */ `;
                i = searchStart + foundKeywordIdx;
            } else {
                // Just comment the next 30 chars?
                let spacePos = chunk.indexOf(' ', 30);
                if (spacePos === -1) spacePos = 30;
                newContent += `/* ${chunk.slice(0, spacePos)} */ `;
                i = searchStart + spacePos;
            }
        }

        if (modified) {
            fs.writeFileSync(filePath, newContent, 'utf8');
            console.log(`Fixed comments in ${file}`);
        }
    }
});
