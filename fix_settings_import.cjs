const fs = require('fs');
let code = fs.readFileSync('src/components/modules/HouseEstimator.tsx', 'utf-8');
code = code.replace(
    'const { formatCurrency, settings } = useSettings();',
    'const { formatCurrency, settings, convertAmount } = useSettings();'
);
fs.writeFileSync('src/components/modules/HouseEstimator.tsx', code);
