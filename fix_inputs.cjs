const fs = require('fs');
let file = fs.readFileSync('src/components/modules/HouseEstimator.tsx', 'utf8');

if (!file.includes('MaskedInput')) {
  file = file.replace(
    'import UnitToggleGroup from "../ui/UnitToggleGroup";',
    'import UnitToggleGroup from "../ui/UnitToggleGroup";\nimport { MaskedInput } from "../ui/MaskedInput";'
  );
}

// Replace the specific plot size input
const inputStart = file.indexOf('<input\n                    type="number"\n                    value={geoState.plotSizeValue}');
if (inputStart !== -1) {
  const inputEnd = file.indexOf('/>', inputStart);
  
  const originalInput = file.substring(inputStart, inputEnd + 2);
  
  const replacement = `<MaskedInput
                    value={geoState.plotSizeValue}
                    onValueChange={(val) =>
                      dispatch({
                        type: "SET_PLOT_SIZE_VALUE",
                        payload: val,
                      })
                    }
                    className="bg-white border border-slate-200 text-slate-800 rounded-[24px] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all font-medium shadow-sm w-full"
                    placeholder="0"
                  />`;

  file = file.replace(originalInput, replacement);
  fs.writeFileSync('src/components/modules/HouseEstimator.tsx', file, 'utf8');
  console.log('done');
}
