import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQ {
  question: string;
  answer: string;
}

interface SEOFAQProps {
  faqs: FAQ[];
}

export function SEOFAQ({ faqs }: SEOFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [showAll, setShowAll] = useState(false);
  const displayedFaqs = showAll ? faqs : faqs.slice(0, 2);

  return (
    <section className="w-full max-w-4xl mx-auto my-12" aria-label="Frequently Asked Questions">
      <h2 className="text-2xl md:text-3xl font-bold text-text-primary text-center mb-8">
        Frequently Asked Questions
      </h2>
      <div className="space-y-4">
        {displayedFaqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div 
              key={index}
              className="border border-border-color rounded-2xl bg-bg-card overflow-hidden shadow-sm hover:shadow transition-shadow"
            >
              <button
                className="w-full text-left px-6 py-4 md:py-5 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${index}`}
              >
                <span className="font-semibold text-text-primary text-lg pr-8">
                  {faq.question}
                </span>
                <ChevronDown 
                  className={`w-5 h-5 text-slate-400 transform transition-transform duration-300 ${isOpen ? 'rotate-180 text-indigo-500' : ''}`}
                />
              </button>
              
              {/* Important: CSS-based hide/show for SEO. Content always remains in DOM. */}
              <div 
                id={`faq-answer-${index}`}
                className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100 pb-5' : 'max-h-0 opacity-0 overflow-hidden'}`}
                aria-hidden={!isOpen}
              >
                <div className="px-6 text-slate-600 dark:text-slate-300 leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {faqs.length > 2 && (
        <div className="text-center mt-8">
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors"
          >
            {showAll ? 'Show Less' : `Show all ${faqs.length} questions`}
          </button>
        </div>
      )}
    </section>
  );
}
