const fs = require('fs');
let code = fs.readFileSync('src/components/modules/HouseEstimator.tsx', 'utf-8');

// The PieChart data
code = code.replace(
    'data={summaryTableData}',
    'data={summaryTableData.map(d => ({...d, value: convertAmount(d.value)}))}'
);

// The greyCostData BarChart data
code = code.replace(
    'data={greyCostData} margin={{ top: 20, right: 10, left: 0, bottom: 5 }}',
    'data={greyCostData.map(d => ({...d, value: convertAmount(d.value)}))} margin={{ top: 20, right: 10, left: 0, bottom: 5 }}'
);

// The finishingCostData BarChart data
code = code.replace(
    'data={finishingCostData} margin={{ top: 20, right: 10, left: 0, bottom: 5 }}',
    'data={finishingCostData.map(d => ({...d, value: convertAmount(d.value)}))} margin={{ top: 20, right: 10, left: 0, bottom: 5 }}'
);

// Also we need to fix the tooltip formatting in BarCharts so it doesn't apply exchange rate twice
code = code.replace(
    /formatter={\(value: number\) => formatCurrency\(value\)}/g,
    'formatter={(value: number) => formatCurrency(value, false)}'
);

fs.writeFileSync('src/components/modules/HouseEstimator.tsx', code);
