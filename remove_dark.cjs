const fs = require('fs');

function removeDark(file) {
    let c = fs.readFileSync(file, 'utf8');
    c = c.replace(/dark:[a-zA-Z0-9_/-]+/g, '');
    c = c.replace(/  +/g, ' ');
    fs.writeFileSync(file, c, 'utf8');
}

removeDark('src/components/modules/MetalWeightCalculator.tsx');
