const fs = require('fs');
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');
code = code.replace(/category: "Quantity Estimator"/g, 'category: "Quantity Estimation"');
code = code.replace(/category: "Concrete Tech"/g, 'category: "Concrete"');
code = code.replace(/category: "Road Construction"/g, 'category: "Road Pavement"');
code = code.replace(/category: "Soil Tests"/g, 'category: "Geotechnical"');
code = code.replace(/category: "Architectural References & Space Planning"/g, 'category: "Architectural"');
code = code.replace(/category: "Analysis & Tools"/g, 'category: "Quantity Estimation"');
fs.writeFileSync('src/components/Dashboard.tsx', code);
