import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { ALL_MODULES } from '../Dashboard';

export interface FAQItem {
  question: string;
  answer: string;
}

interface GlobalFAQProps {
  faqs: FAQItem[];
  moduleId?: string; 
}

export function GlobalFAQ({ faqs, moduleId }: GlobalFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);

  const moduleDef = ALL_MODULES.find(m => m.id === moduleId);

  const formatToolTitle = (t: string) => t.replace(/^(Calculate|Find) /, '');

  const genericFaqs = moduleDef ? [
    {
      question: `Is the ${formatToolTitle(moduleDef.title)} free to use?`,
      answer: `Yes, all core calculation features for the ${moduleDef.title.toLowerCase()} are completely free for all users.`
    },
    {
      question: `How accurate are the results from the ${formatToolTitle(moduleDef.title)}?`,
      answer: `Estimations follow standard civil engineering formulas and practices. Always verify critical computations.`
    },
    {
      question: `Can I use this ${moduleDef.category.toLowerCase()} tool on my mobile phone?`,
      answer: `Absolutely. The ${formatToolTitle(moduleDef.title)} is fully responsive and optimized for seamless use on smartphones and tablets.`
    },
    {
      question: `What engineering formulas does this tool use?`,
      answer: `It strictly uses internationally recognized civil engineering formulas relevant to the ${moduleDef.category.toLowerCase()} field.`
    },
    {
      question: `How do I save my ${formatToolTitle(moduleDef.title)} calculations?`,
      answer: `Use the Quick Actions menu to export a detailed PDF report or copy the data to your clipboard. Premium users can save directly to their dashboard.`
    }
  ] : [];

  // Filter out any duplicates based on question exact match (or we can just append)
  const combinedFaqsMap = new Map();
  [...faqs, ...genericFaqs].forEach(f => {
    if(!combinedFaqsMap.has(f.question)) {
      combinedFaqsMap.set(f.question, f);
    }
  });
  const combinedFaqs = Array.from(combinedFaqsMap.values());
  const displayedFaqs = showAll ? combinedFaqs : combinedFaqs.slice(0, 2);

  return (
    <section className="w-full max-w-4xl mx-auto my-12" aria-label="Frequently Asked Questions">
      <h2 className="text-2xl md:text-3xl font-bold text-slate-800 text-center mb-8">
        Frequently Asked Questions
      </h2>
      <div className="space-y-4">
        {displayedFaqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div 
              key={index}
              className="border border-slate-200 rounded-[24px] bg-white/80 backdrop-blur-xl overflow-hidden shadow-sm hover:shadow transition-shadow"
            >
              <button
                className="w-full text-left px-6 py-4 md:py-5 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${index}`}
              >
                <span className="font-semibold text-slate-800 text-lg pr-8">
                  {faq.question}
                </span>
                <ChevronDown 
                  className={`w-5 h-5 text-slate-400 transform transition-transform duration-300 ${isOpen ? 'rotate-180 text-indigo-500' : ''}`}
                />
              </button>
              
              <div 
                id={`faq-answer-${index}`}
                className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100 pb-5' : 'max-h-0 opacity-0 overflow-hidden'}`}
                aria-hidden={!isOpen}
              >
                <div className="px-6 text-slate-600 leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {combinedFaqs.length > 2 && (
        <div className="text-center mt-8">
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-[24px] transition-colors shadow-sm"
          >
            {showAll ? 'Show Less' : `Show all ${combinedFaqs.length} questions`}
          </button>
        </div>
      )}
    </section>
  );
}
