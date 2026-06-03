const fs = require('fs');

let c = fs.readFileSync("src/components/modules/SlabEstimator.tsx", "utf8");
c = c.replace(/<NumberInput value={} onChange={\(v\) => \(v\.toString\(\)\)} \/>/g, function(match, offset, str) {
  // Wait, I lost the variable names. ly, lx, thickness, clearCover, concreteDensity, riggingRadius, mainSpacing, distSpacing.
  return '<NumberInput value={X} onChange={(v) => setX(v.toString())} />';
});

fs.writeFileSync("src/components/modules/SlabEstimator.tsx", c);
