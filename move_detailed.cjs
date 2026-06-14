const fs = require('fs');
let file = fs.readFileSync('src/components/modules/HouseEstimator.tsx', 'utf8');

const visualSummaryToken = '{/* Visual Summary */}';
const visualSummaryIdx = file.indexOf(visualSummaryToken);

// We want to find the </section> of lg:col-span-8 (now 5).
// Instead of looking for SEOFAQ, just find the last </section> before `<SEOFAQ` 
const seoFaqIdx = file.indexOf('<SEOFAQ', visualSummaryIdx);
let sectionEndIdx = file.lastIndexOf('</section>', seoFaqIdx);

if (visualSummaryIdx !== -1 && seoFaqIdx !== -1 && sectionEndIdx !== -1) {
    const detailedResults = file.slice(visualSummaryIdx, sectionEndIdx);

    // Remove detailedResults from file
    file = file.slice(0, visualSummaryIdx) + file.slice(sectionEndIdx);

    const resultAreaToken = '{/* Results Area */}';
    const resultAreaIdx = file.indexOf(resultAreaToken);
    const leftSectionEndIdx = file.lastIndexOf('</section>', resultAreaIdx);

    if (leftSectionEndIdx !== -1) {
        const toInsert = `
            {showResults && (
              <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pt-8 border-t border-[var(--border-color)]">
                ${detailedResults}
              </div>
            )}
`;
        file = file.slice(0, leftSectionEndIdx) + toInsert + file.slice(leftSectionEndIdx);
        fs.writeFileSync('src/components/modules/HouseEstimator.tsx', file, 'utf8');
        console.log("Success string manipulation!");
    } else {
        console.log("leftSectionEndIdx not found");
    }
} else {
    console.log("Indices not found", visualSummaryIdx, seoFaqIdx, sectionEndIdx);
}
