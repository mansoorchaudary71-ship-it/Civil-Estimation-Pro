const fs = require('fs');

function refactor() {
  let file = fs.readFileSync('src/components/modules/HouseEstimator.tsx', 'utf8');

  // Change left column grid size
  file = file.replace('className="lg:col-span-4 space-y-6"', 'className="lg:col-span-7 space-y-6 flex flex-col"');

  // We need to move everything from {/* Visual Summary */} (inclusive) to the END of the lg:col-span-8 section.
  const visualSummaryStart = file.indexOf('{/* Visual Summary */}');
  
  if (visualSummaryStart !== -1) {
    // Find the end: we know it ends with `</section>` (the closing of lg:col-span-8).
    // Let's locate the opening of lg:col-span-8
    const rightColStart = file.indexOf('className="lg:col-span-8');
    
    // The section ends with `</section>`. Let's just do a string split logic to find the matching `</section>`.
    const afterStart = file.slice(rightColStart);
    let openCount = 0;
    let endOffset = -1;
    let idx = 0;
    // VERY simple parser since we know the structure
    while (idx < afterStart.length) {
      if (afterStart.startsWith('<section', idx)) openCount++;
      if (afterStart.startsWith('</section>', idx)) {
        openCount--;
        if (openCount === 0) {
          endOffset = idx;
          break;
        }
      }
      idx++;
    }

    if (endOffset !== -1) {
      const sectionEndActual = rightColStart + endOffset; 
      // The content to extract is from visualSummaryStart to sectionEndActual
      const detailedResults = file.slice(visualSummaryStart, sectionEndActual);

      // We remove the detailed results from their current spot
      file = file.slice(0, visualSummaryStart) + file.slice(sectionEndActual);
      
      // Now where to insert?
      // We want to insert it at the end of the lg:col-span-7 section.
      // The end of `lg:col-span-7` section was originally `</section>` at line 1403.
      // Let's find it. It's the `</section>` exactly before `          {/* Results Area */}`
      const resultsAreaIdx = file.indexOf('{/* Results Area */}');
      const leftColEnd = file.lastIndexOf('</section>', resultsAreaIdx);
      
      if (leftColEnd !== -1) {
        
        const wrapper = `
            {showResults && (
              <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pt-8 border-t border-border-color">
${detailedResults}
              </div>
            )}
`;
        
        file = file.slice(0, leftColEnd) + wrapper + file.slice(leftColEnd);
      }
    }
  }

  // Now change lg:col-span-8 to lg:col-span-5
  file = file.replace(
    'className="lg:col-span-8 flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500"', 
    'className="lg:col-span-5 relative hidden lg:block"' // We keep it hidden on mobile if it's identical? Wait, no, we show it on mobile, just above or below!
  );
  // Actually, on mobile it stacks!
  file = file.replace(
    'className="lg:col-span-8 flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500"', 
    'className="lg:col-span-5 relative w-full"'
  );

  // Update Live BOQ card styles for glassmorphism
  // Using the new theme variables
  file = file.replace(
    'className="sticky top-6 z-10 bg-indigo-600 rounded-[2rem] p-6 shadow-xl shadow-indigo-500/20 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2"',
    'className="sticky top-6 z-10 bg-[var(--bg-card)]/50 backdrop-blur-2xl border border-[var(--border-color)] rounded-[2.5rem] p-6 lg:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.08)] flex flex-col items-start gap-8"'
  );
  
  // Make the inner text match light/dark mode glassmorphism
  file = file.replace(
    'className="text-3xl sm:text-3xl md:text-[clamp(1.75rem,5vw,2.5rem)] break-all font-semibold tabular-nums tracking-tight tabular-nums text-slate-900 drop-shadow-sm"',
    'className="text-4xl sm:text-5xl break-all font-bold tabular-nums tracking-tighter text-text-primary drop-shadow-sm"'
  );
  file = file.replace(
    'className="text-indigo-200 text-xs font-bold uppercase tracking-widest mb-0.5"',
    'className="text-slate-500 font-bold uppercase tracking-widest mb-1.5 text-xs"'
  );
  file = file.replace(
    'className="text-indigo-200 text-[10px] mt-1 font-medium"',
    'className="text-slate-400 text-[10px] mt-2 font-medium max-w-[200px]"'
  );
  
  file = file.replace(
    'className="text-indigo-200 text-[10px] font-bold uppercase tracking-wider mb-0.5" w',
    'className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1"'
  );
  // Global replace the remaining text-indigo-200 in the Live BOQ section
  // we can use regex
  file = file.replace(/text-indigo-200 text-\[10px\] font-bold uppercase tracking-wider/g, 'text-slate-500 text-[10px] font-bold uppercase tracking-wider text-xs');
  
  file = file.replace(/text-slate-900 drop-shadow-sm/g, 'text-text-primary drop-shadow-sm');
  file = file.replace(/text-slate-900/g, 'text-text-primary');

  // Fix the wrapper layout inside the Live BOQ
  file = file.replace(
    'className="flex flex-col sm:flex-row items-start sm:items-center justify-between"',
    'className="flex flex-col gap-6 w-full"'
  );
  
  file = file.replace(
    'className="flex items-center gap-4"',
    'className="flex flex-col gap-4"'
  );

  file = file.replace(
    'className="flex gap-6 mt-4 sm:mt-0 w-full sm:w-auto p-4 sm:p-0 bg-white/5 sm:bg-transparent rounded-[24px] sm:rounded-[24px]"',
    'className="flex flex-col gap-4 mt-6 w-full pt-6 border-t border-[var(--border-color)]"'
  );
  
  file = file.replace(
    'className="w-px h-8 bg-indigo-400/30 self-center hidden sm:block"',
    'className="w-px h-8 bg-border-color self-center hidden sm:block"'
  );

  // We need to write the file back
  fs.writeFileSync('src/components/modules/HouseEstimator.tsx', file, 'utf8');
}

refactor();
