import React, { useState, useEffect } from 'react';
import { ChevronRight, Home as HomeIcon, Star, Share2, Save, Printer, HelpCircle, Activity, ChevronDown, Check, ArrowRight } from 'lucide-react';
import { SEO } from '../../components/SEO';

interface CalculatorLayoutProps {
  title: string;
  category: string;
  rating?: number;
  reviewCount?: number;
  lastUpdated?: string;
  LeftPanel: React.ReactNode;
  RightPanel: React.ReactNode;
  formulasUsed?: string;
  howToSteps?: Array<{ title: string; desc: string }>;
  faqs?: Array<{ q: string; a: string }>;
}

export function CalculatorLayout({
  title,
  category,
  rating = 4.9,
  reviewCount = 500,
  lastUpdated = 'May 2026',
  LeftPanel,
  RightPanel,
  formulasUsed,
  howToSteps = [],
  faqs = []
}: CalculatorLayoutProps) {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  return (
    <div className="w-full min-h-screen bg-[#0B0F19] text-white flex flex-col font-sans pb-24">
      <SEO 
        title={title} 
        description={`Professional ${title.toLowerCase()} for civil engineers. Accurate estimations and automated calculations.`} 
        keywords={`${title.toLowerCase()}, civil engineering, estimator, construction`}
        faqs={faqs}
        category={category}
        canonicalUrl={`https://y71-ship-it.github.io/${title.toLowerCase().replace(/\\s+/g, '-')}`}
      />
      
      {/* PAGE HEADER */}
      <div className="w-full bg-[#111827] border-b border-white/10 pt-8 pb-10">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm text-slate-400 mb-6 font-medium tracking-wide w-full overflow-x-auto whitespace-nowrap">
            <span className="flex items-center gap-1 hover:text-white cursor-pointer transition-colors"><HomeIcon className="w-4 h-4" /> Home</span>
            <ChevronRight className="w-4 h-4 text-slate-600" />
            <span className="cursor-pointer hover:text-white transition-colors">{category}</span>
            <ChevronRight className="w-4 h-4 text-slate-600" />
            <span className="text-white font-semibold">{title}</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500 drop-shadow-md">
            {title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm md:text-base text-slate-300">
            <div className="flex items-center gap-2 font-bold px-3 py-1 bg-white/5 rounded-full border border-white/10 shadow-sm">
              <Activity className="w-4 h-4 text-emerald-400" /> Calculated by 10,000+ engineers
            </div>
            <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-slate-600"></div>
            <div className="flex items-center gap-1.5 text-yellow-400 font-bold">
               {rating} <Star className="w-4 h-4 fill-yellow-400" /> <span className="text-slate-400 font-normal ml-1">({reviewCount}+ reviews)</span>
            </div>
            <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-slate-600"></div>
            <div className="text-slate-400 font-medium">Last updated: {lastUpdated}</div>
          </div>
        </div>
      </div>

      {/* CALCULATOR INTERFACE LAYOUT (split-panel) */}
      <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 mt-8 md:mt-12 flex flex-col lg:flex-row gap-6 md:gap-8 relative z-10">
        
        {/* LEFT PANEL (inputs) */}
        <div className="w-full lg:w-[45%] flex flex-col gap-6 md:sticky md:top-24 h-max self-start bg-[#111827]/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl relative z-20">
           {LeftPanel}
        </div>

        {/* RIGHT PANEL (results) */}
        <div className="w-full lg:w-[55%] flex flex-col gap-6 relative z-10 bg-[#111827]/80 backdrop-blur-3xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl overflow-hidden">
           {/* Animated Background Gradient inside Results */}
           <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl rounded-tl-[100px] pointer-events-none"></div>
           <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl rounded-tr-[100px] pointer-events-none"></div>
           
           <div className="relative z-10">
             {RightPanel}
           </div>
        </div>
      </div>

      {/* BELOW CALCULATOR */}
      <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 mt-16 md:mt-24 mb-16 space-y-16">
        
        {/* How to Use */}
        {howToSteps && howToSteps.length > 0 && (
          <div className="w-full bg-[#111827] border border-white/5 shadow-lg rounded-3xl p-8">
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-3 text-white">
              <HelpCircle className="w-6 h-6 text-purple-400" /> How to use this calculator
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {howToSteps.map((step, idx) => (
                <div key={idx} className="bg-white/5 border border-white/5 p-6 rounded-2xl relative group hover:bg-white/10 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-lg mb-4 absolute -top-5 -left-2 shadow-lg group-hover:scale-110 transition-transform">
                    {idx + 1}
                  </div>
                  <h4 className="font-bold text-lg mb-2 text-white">{step.title}</h4>
                  <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Formulas Used */}
        {formulasUsed && (
          <div className="w-full">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-white">
               Formulas & Math
            </h3>
            <div className="bg-[#1e1e1e] border border-white/10 rounded-2xl p-6 font-mono text-sm text-green-400 overflow-x-auto shadow-2xl relative">
              <div className="absolute top-0 left-0 w-full h-8 bg-black/40 border-b border-white/10 flex items-center px-4 gap-2">
                 <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                 <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                 <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              </div>
              <pre className="pt-8">
                <code>{formulasUsed}</code>
              </pre>
            </div>
          </div>
        )}

        {/* FAQs */}
        {faqs && faqs.length > 0 && (
          <div className="w-full">
            <h3 className="text-2xl font-bold mb-6 text-white">Frequently Asked Questions</h3>
            <div className="flex flex-col gap-3">
              {faqs.map((faq, idx) => (
                <div key={idx} className="bg-[#111827] border border-white/10 rounded-xl overflow-hidden transition-all duration-300">
                  <button 
                    className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none hover:bg-white/5 transition-colors"
                    onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  >
                    <span className="font-bold text-lg text-slate-200">{faq.q}</span>
                    <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${activeFaq === idx ? 'rotate-180' : ''}`} />
                  </button>
                  <div className={`px-6 transition-all duration-300 ease-in-out ${activeFaq === idx ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <p className="text-slate-400 leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ACTION FOOTER BAR */}
      <div className="fixed bottom-0 left-0 w-full bg-[#111827]/90 backdrop-blur-2xl border-t border-white/10 p-4 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
         <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 overflow-x-auto">
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-full font-bold text-sm bg-white/5 hover:bg-white/10 text-white transition-all"><HomeIcon className="w-4 h-4" /> Home</button>
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-full font-bold text-sm bg-white/5 hover:bg-white/10 text-white transition-all"><Activity className="w-4 h-4" /> History</button>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm bg-white text-indigo-900 border border-white hover:bg-transparent hover:text-white transition-all shadow-lg hover:shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                <Share2 className="w-4 h-4" /> Share
              </button>
              <button className="flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-[0_0_20px_rgba(249,115,22,0.4)] hover:shadow-[0_0_30px_rgba(249,115,22,0.6)] transition-all hover:-translate-y-0.5">
                <Save className="w-4 h-4" /> Save
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-full font-bold text-sm bg-white/5 hover:bg-white/10 text-white transition-all border border-white/10 md:mr-0 mr-4">
                <Printer className="w-4 h-4" /> Print PDF
              </button>
            </div>
         </div>
      </div>
    </div>
  );
}
