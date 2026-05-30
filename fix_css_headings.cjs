const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf8');

css = css.replace(/h1 \{ font-weight: 600;/g, 'h1 { font-weight: 800;');
css = css.replace(/h2 \{ font-weight: 600;/g, 'h2 { font-weight: 800;');
css = css.replace(/h3 \{ font-weight: 500;/g, 'h3 { font-weight: 700;');

css = css.replace(/line-height: 1.65;/g, 'line-height: 1.7;');

fs.writeFileSync('src/index.css', css);
