const fs = require('fs');

function replaceClass(filePath, oldStr, newStr) {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(oldStr, newStr);
  fs.writeFileSync(filePath, content);
}

// 1. FeedbackWidget
let fw = fs.readFileSync('src/components/ui/FeedbackWidget.tsx', 'utf8');
fw = fw.replace(/className="no-print mt-8 mb-6 p-6 rounded-\[2rem\] bg-white border border-slate-200"/, 'className="no-print w-full bg-white rounded-[32px] p-6 md:p-8 border border-slate-100 shadow-sm"');
fw = fw.replace(/className="text-lg font-semibold text-slate-800 mb-2"/, 'className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight mb-2"');
fw = fw.replace(/className="text-sm text-slate-500 mb-6"/, 'className="text-base text-slate-600 leading-relaxed mb-6"');
fs.writeFileSync('src/components/ui/FeedbackWidget.tsx', fw);

// 2. GlobalFAQ
let gf = fs.readFileSync('src/components/ui/GlobalFAQ.tsx', 'utf8');
gf = gf.replace(/<section className="w-full max-w-4xl mx-auto my-12" aria-label="Frequently Asked Questions">/, '<section className="w-full bg-white rounded-[32px] p-6 md:p-8 border border-slate-100 shadow-sm" aria-label="Frequently Asked Questions">');
gf = gf.replace(/className="text-2xl md:text-3xl font-bold text-slate-800 text-center mb-8"/, 'className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight mb-6"');
fs.writeFileSync('src/components/ui/GlobalFAQ.tsx', gf);

// 3. RelatedCalculators
let rc = fs.readFileSync('src/components/calculators/RelatedCalculators.tsx', 'utf8');
rc = rc.replace(/<div className="mt-12 bg-white rounded-3xl p-6 md:p-8 border border-slate-200">/, '<div className="w-full bg-white rounded-[32px] p-6 md:p-8 border border-slate-100 shadow-sm">');
rc = rc.replace(/<h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-6">/, '<h2 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight mb-6">');
fs.writeFileSync('src/components/calculators/RelatedCalculators.tsx', rc);

// 4. DiscussionWidget
let dw = fs.readFileSync('src/components/DiscussionWidget.tsx', 'utf8');
dw = dw.replace(/<div className="mt-12 bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm">/, '<div className="w-full bg-white rounded-[32px] p-6 md:p-8 border border-slate-100 shadow-sm">');
dw = dw.replace(/<h2 className=" text-xl font-semibold text-gray-900 tracking-tight mb-4">/, '<h2 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight mb-6">');
fs.writeFileSync('src/components/DiscussionWidget.tsx', dw);

// 5. ToolArticleWidget
let taw = fs.readFileSync('src/components/ui/ToolArticleWidget.tsx', 'utf8');
taw = taw.replace(/<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 bg-white rounded-\[24px\] p-8 border border-slate-200">/, '<div className="w-full bg-white rounded-[32px] p-6 md:p-8 border border-slate-100 shadow-sm">\n      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">');
taw = taw.replace(/<\/div>\n    <\/div>/, '</div>\n    </div>\n    </div>'); // close the new wrapper div
taw = taw.replace(/<h2 className="text-xl font-semibold text-gray-900 tracking-tight mb-4">/g, '<h2 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight mb-6">');
taw = taw.replace(/<ol className="list-decimal list-inside space-y-2 text-base font-normal text-gray-600 leading-relaxed">/, '<ol className="list-decimal list-inside space-y-3 text-base text-slate-600 leading-relaxed">');
taw = taw.replace(/<p className="text-base font-normal text-gray-600 leading-relaxed mb-4">/, '<p className="text-base text-slate-600 leading-relaxed mb-4">');
fs.writeFileSync('src/components/ui/ToolArticleWidget.tsx', taw);

// 6. ProTipsWidget
let ptw = fs.readFileSync('src/components/ui/ProTipsWidget.tsx', 'utf8');
ptw = ptw.replace(/<div className="mt-6 mb-6 overflow-hidden rounded-\[1.5rem\] bg-white border border-slate-200">/, '<div className="w-full overflow-hidden bg-white rounded-[32px] border border-slate-100 shadow-sm">');
fs.writeFileSync('src/components/ui/ProTipsWidget.tsx', ptw);

// 7. CodeReferences
let cr = fs.readFileSync('src/components/ui/CodeReferences.tsx', 'utf8');
cr = cr.replace(/<div className="mt-6 mb-6 overflow-hidden rounded-\[1.5rem\] bg-white border border-slate-200">/, '<div className="w-full overflow-hidden bg-white rounded-[32px] border border-slate-100 shadow-sm">');
fs.writeFileSync('src/components/ui/CodeReferences.tsx', cr);

// 8. ToolPageFooter
let tpf = fs.readFileSync('src/components/ToolPageFooter.tsx', 'utf8');
tpf = tpf.replace(/<div className="mt-8 space-y-3 border-t border-slate-200 pt-8">/, '<div className="w-full bg-white rounded-[32px] p-6 md:p-8 border border-slate-100 shadow-sm space-y-3">');
fs.writeFileSync('src/components/ToolPageFooter.tsx', tpf);

console.log("One UI styling applied successfully!");
