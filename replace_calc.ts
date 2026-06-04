import * as fs from 'fs';
let content = fs.readFileSync('src/components/modules/MasterQuantityEstimator.tsx', 'utf-8');
content = content.replace(/import \{ calculatorsList, CalcItem \} from "\.\.\/\.\.\/lib\/masterCalculators";[\s\S]*?(?=export default function MasterQuantityEstimator)/, 'import { calculatorsList, CalcItem } from "../../lib/masterCalculators";\n\n');
fs.writeFileSync('src/components/modules/MasterQuantityEstimator.tsx', content);
