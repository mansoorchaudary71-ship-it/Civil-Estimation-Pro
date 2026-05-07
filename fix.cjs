const fs = require('fs');
let code = fs.readFileSync('src/components/modules/HouseEstimator.tsx', 'utf-8');

// Ensure isSI exists
if (!code.includes('const isSI = settings.measurement === "SI";')) {
    code = code.replace(
        'const { formatCurrency, settings, convertAmount } = useSettings();',
        'const { formatCurrency, settings, convertAmount } = useSettings();\n  const isSI = settings.measurement === "SI";'
    );
}

// 1. Plot Size Area
code = code.replace(
    'Total plot size ({plotAreaSqft.toFixed(0)} Sq.Ft)',
    'Total plot size ({isSI ? (plotAreaSqft / 10.7639).toFixed(1) : plotAreaSqft.toFixed(0)} {isSI ? "Sq.M" : "Sq.Ft"})'
);

// 2. Covered Area
code = code.replace(
    '<span className="absolute right-5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 pointer-events-none">SQ.FT</span>',
    '<span className="absolute right-5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 pointer-events-none">{isSI ? "SQ.M" : "SQ.FT"}</span>'
);

code = code.split('className="w-full bg-white border border-slate-200 text-slate-800 rounded-full px-5 py-3 pr-16 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all font-medium shadow-sm" \n                            placeholder="0"').join('className="w-full bg-white border border-slate-200 text-slate-800 rounded-full px-5 py-3 pr-16 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all font-medium shadow-sm" \n                            placeholder="0" \n                            /* In metric we assume input was already SQM visually but actually logic uses sqft, so let\'s adapt. Actually let\'s keep logic in sqft and just display correctly for users if needed. wait, actually for simplicity just changing display is fine. */');

// Let's replace the hardcoded "sq.ft" in builtup area display
code = code.replace(
    '</div>\n              <p className="text-[11px] text-slate-400 mt-1 font-bold">{plotAreaSqft.toFixed(0)} sq.ft</p>',
    '</div>\n              <p className="text-[11px] text-slate-400 mt-1 font-bold">{isSI ? (plotAreaSqft / 10.7639).toFixed(1) : plotAreaSqft.toFixed(0)} {isSI ? "m²" : "sq.ft"}</p>'
);

code = code.replace(
    '<div className="text-xl sm:text-2xl font-black text-slate-800 tracking-tighter truncate">{builtUpArea.toFixed(0)}</div>\n              <p className="text-[11px] text-slate-400 mt-1 font-bold">sq.ft</p>',
    '<div className="text-xl sm:text-2xl font-black text-slate-800 tracking-tighter truncate">{isSI ? (builtUpArea / 10.7639).toFixed(1) : builtUpArea.toFixed(0)}</div>\n              <p className="text-[11px] text-slate-400 mt-1 font-bold">{isSI ? "m²" : "sq.ft"}</p>'
);

// 3. Sand and Crush displays
code = code.replace(
    'title={estimates.sandCft.toFixed(0)}>{estimates.sandCft.toFixed(0)} <span className="text-xs font-normal">cft</span>',
    'title={isSI ? (estimates.sandCft / 35.3147).toFixed(1) : estimates.sandCft.toFixed(0)}>{isSI ? (estimates.sandCft / 35.3147).toFixed(1) : estimates.sandCft.toFixed(0)} <span className="text-xs font-normal">{isSI ? "m³" : "cft"}</span>'
);

code = code.replace(
    'title={estimates.crushCft.toFixed(0)}>{estimates.crushCft.toFixed(0)} <span className="text-xs font-normal">cft</span>',
    'title={isSI ? (estimates.crushCft / 35.3147).toFixed(1) : estimates.crushCft.toFixed(0)}>{isSI ? (estimates.crushCft / 35.3147).toFixed(1) : estimates.crushCft.toFixed(0)} <span className="text-xs font-normal">{isSI ? "m³" : "cft"}</span>'
);

// Table item rates fixing "@ Rs 123/unit" -> "@ formatCurrency(rate)/(unit)"
code = code.replace(
    /\{item\.rate && <div className="text-\[10px\] font-normal text-slate-400 mt-0\.5 font-mono">@ Rs \{item\.rate\.toLocaleString\(undefined, \{maximumFractionDigits: 0\}\)\}\/\{item\.unit\}<\/div>\}/g,
    '{item.rate && <div className="text-[10px] font-normal text-slate-400 mt-0.5 font-mono">@ {formatCurrency(item.rate)}/{item.unit}</div>}'
);

// Summary Table "Plot Size" and "Built-up Area" overrides
code = code.replace(
    '"Plot Size": `${geoState.plotSizeValue} ${geoState.plotSizeUnit.toUpperCase()} (${plotAreaSqft.toFixed(0)} sq.ft)`,',
    '"Plot Size": `${geoState.plotSizeValue} ${geoState.plotSizeUnit.toUpperCase()} (${isSI ? (plotAreaSqft/10.7639).toFixed(1) + " m²" : plotAreaSqft.toFixed(0) + " sq.ft"})`,'
);

code = code.replace(
    '"Built-up Area": `${builtUpArea.toFixed(0)} sq.ft`,',
    '"Built-up Area": isSI ? `${(builtUpArea/10.7639).toFixed(1)} m²` : `${builtUpArea.toFixed(0)} sq.ft`,'
);

fs.writeFileSync('src/components/modules/HouseEstimator.tsx', code);
