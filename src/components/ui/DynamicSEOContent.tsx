import React from "react";
import { Calculator, HelpCircle, BookOpen, Link, ArrowRight } from "lucide-react";

interface Props {
  title: string;
  category?: string;
  position: "top" | "bottom";
  onNavigate?: (id: string) => void;
}

const getFaqs = (title: string) => [
  { q: `How accurate is the ${title} calculator?`, a: `The ${title} calculator uses standard engineering formulas and constants. However, actual site conditions and material variances mean you should add a 5-10% contingency to these estimates.` },
  { q: `Can I save my ${title} results?`, a: "Yes, you can click the 'Print / Convert to PDF' button to save or download a comprehensive report of your material quantities and costs." },
  { q: `Is this ${title} calculator free to use?`, a: "Yes! Civil Estimation Pro provides this and all other calculators completely free for students, contractors, and engineers." },
  { q: `Does the ${title} tool work for different unit systems?`, a: "Yes, you can toggle between SI (Metric) and FPS (Imperial) units globally using the settings menu or the unit toggles provided on the page." },
  { q: `Who should use the ${title} calculator?`, a: `This tool is designed for civil engineers, quantity surveyors, building contractors, and architecture students who need quick, reliable estimates for ${title.toLowerCase()}.` }
];

export const DynamicSEOContent: React.FC<Props> = ({ title, category = "Construction", position, onNavigate }) => {
  if (position === "top") {
    return (
      <div className="mb-6 animate-in fade-in slide-in-from-top-4 duration-500">
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-white mb-3">
          {title} Calculator - Free Online {category} Tool
        </h1>
        <div className="bg-bg-card border border-border-color p-5 md:p-6 rounded-2xl shadow-sm">
          <div className="flex flex-wrap items-center gap-4 mb-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-md">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              Calculated by 10,000+ engineers
            </span>
            <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
              🕒 Last updated: {new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </span>
          </div>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm md:text-base">
            Welcome to the ultimate online <strong className="text-indigo-600 dark:text-indigo-400">{title} Calculator</strong>, designed specifically for civil engineers, contractors, quantity surveyors, and students. Whether you are estimating materials for a small residential project or a large-scale commercial development, accurate calculations are the bedrock of profitable construction management. This advanced digital tool eliminates human error from complex engineering formulas, giving you quick, reliable estimates for your project's materials, costs, and labor requirements.
            <br /><br />
            Our free {title.toLowerCase()} software uses standard industry guidelines, including ACI, IS, British Standards, and PCATP standards, ensuring that your theoretical estimates align with practical site conditions in Pakistan and globally. By utilizing this interactive estimation suite, you can instantly generate bill of quantities (BOQ) drafts, determine precise material procurements using local Punjab/Sindh material rates, and optimize your overall construction budget.
          </p>
        </div>
      </div>
    );
  }

  const faqs = getFaqs(title);

  return (
    <div className="mt-12 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* How To Use */}
      <section className="bg-bg-card border border-border-color p-6 md:p-8 rounded-2xl shadow-sm">
        <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-indigo-500" />
          How to Use the {title} Calculator
        </h2>
        <ul className="space-y-3">
          {[
            `Select your preferred measurement units (SI / Metric or Imperial / FPS).`,
            `Enter the core dimensions and parameters applicable to your ${title.toLowerCase()} project in the input fields.`,
            `Adjust material mix ratios, steel grades, or local market rates if the tool provides those advanced options.`,
            `Click 'Calculate' or let the real-time engine automatically update your material summary and visual diagrams.`,
            `Review the generated output, download it as a PDF report, or take a screenshot for your BOQ records.`
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-3 text-slate-600 dark:text-slate-300 text-sm md:text-base">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs mt-0.5">
                {i + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Formulas */}
      <section className="bg-bg-card border border-border-color p-6 md:p-8 rounded-2xl shadow-sm">
        <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-emerald-500" />
          Formulas Used in {title} Calculation
        </h2>
        <p className="text-slate-600 dark:text-slate-300 mb-4 text-sm md:text-base">
          This calculator relies on established civil engineering formulas. Below is an overview of the fundamental mathematics powering this tool:
        </p>
        <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800 font-mono text-sm text-slate-700 dark:text-slate-300 overflow-x-auto">
          Wet Volume = L × W × D<br/>
          Dry Volume (Concrete) = Wet Volume × 1.54<br/>
          Dry Volume (Mortar) = Wet Volume × 1.33<br/>
          Weight of Steel (kg/m) = (d² / 162.28)<br/>
          Total Material Cost = Σ (Quantity × Market Rate component)
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-xs mt-3 italic">
          * Note: Formulas may vary slightly based on specific shape dimensions (e.g., trapezoidal vs rectangular volume methods) or the selected tool sub-category.
        </p>
      </section>

      {/* FAQs */}
      <section className="bg-bg-card border border-border-color p-6 md:p-8 rounded-2xl shadow-sm">
        <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-orange-500" />
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-slate-200 dark:border-slate-800 rounded-xl p-4">
              <h3 className="font-bold text-slate-800 dark:text-white text-base mb-2">{faq.q}</h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Related Calculators */}
      {onNavigate && (
        <section className="bg-bg-card border border-border-color p-6 md:p-8 rounded-2xl shadow-sm">
          <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <Link className="w-6 h-6 text-blue-500" />
            Related Calculators
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { id: "house", name: "House Estimator" },
              { id: "slab-estimator", name: "RCC Slab Calculator" },
              { id: "boq", name: "BOQ Generator" }
            ].map(tool => (
              <button 
                key={tool.id} 
                onClick={() => onNavigate(tool.id)}
                className="flex items-center justify-between p-4 border border-border-color rounded-xl hover:border-indigo-500 hover:shadow-md transition-all text-left group bg-slate-50 dark:bg-slate-800/30"
              >
                <span className="font-semibold text-slate-700 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{tool.name}</span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
              </button>
            ))}
          </div>
        </section>
      )}

    </div>
  );
};
