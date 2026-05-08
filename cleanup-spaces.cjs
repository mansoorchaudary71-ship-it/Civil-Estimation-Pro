const fs = require('fs');
const path = require('path');

const dirs = ['./src/components/modules', './src/components/ui'];

dirs.forEach(dir => {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx') || f.endsWith('.ts'));

    for (const file of files) {
        const filePath = path.join(dir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        let original = content;

        content = content.replace(/\bsm: gap-4\b/g, 'sm:gap-4');
        content = content.replace(/\bsm: \b/g, ' ');
        content = content.replace(/\bmd: \b/g, ' ');
        content = content.replace(/\blg: \b/g, ' ');

        if (content !== original) {
            fs.writeFileSync(filePath, content, 'utf8');
        }
    }
});
