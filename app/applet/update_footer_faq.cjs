const fs = require('fs');

// 1. Update PricingPage.tsx FAQs
let pricing = fs.readFileSync('src/components/pages/PricingPage.tsx', 'utf8');

const faqSearchPattern = `{FAQS.map((faq, idx) => (
              <div 
                key={idx} 
                className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl overflow-hidden transition-all duration-300 shadow-sm"
              >
                <button 
                  onClick={() => handleToggleFaq(idx)}
                  className="w-full flex items-center justify-between p-6 text-left outline-none"
                >
                  <span className="font-bold text-lg text-slate-900 dark:text-white pr-4">{faq.question}</span>
                  <ChevronDown className={cn(
                    "w-5 h-5 text-slate-400 transition-transform duration-300 shrink-0",
                    openFaq === idx ? "rotate-180" : ""
                  )} />
                </button>
                <AnimatePresence>
                  {openFaq === idx && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 pt-0 text-slate-600 dark:text-slate-400 font-medium leading-relaxed border-t border-slate-50 dark:border-slate-800/50">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}`;

const faqReplacement = `{FAQS.map((faq, idx) => (
              <div 
                key={idx} 
                className="border-b border-slate-200/60 dark:border-slate-800"
              >
                <button 
                  onClick={() => handleToggleFaq(idx)}
                  className="w-full flex items-center justify-between py-8 text-left outline-none group"
                >
                  <span className={cn(
                    "text-xl md:text-3xl font-black tracking-tight transition-colors duration-300 pr-4 drop-shadow-sm",
                    openFaq === idx ? "text-cyan-500" : "text-slate-900 dark:text-white group-hover:text-slate-600 dark:group-hover:text-slate-300"
                  )}>
                    {faq.question}
                  </span>
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 shrink-0",
                    openFaq === idx ? "rotate-180 bg-cyan-50 dark:bg-cyan-900/20 text-cyan-500" : "bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:bg-slate-100 dark:group-hover:bg-slate-700"
                  )}>
                    <ChevronDown className="w-6 h-6 border-none" />
                  </div>
                </button>
                <AnimatePresence>
                  {openFaq === idx && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 200, damping: 20 }}
                      className="overflow-hidden"
                    >
                      <div className="pb-8 pt-2 text-slate-500 dark:text-slate-400 md:text-lg font-medium leading-relaxed max-w-3xl border-t border-transparent">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}`;

if (pricing.includes("border border-slate-200 dark:border-slate-800 bg-white")) {
  pricing = pricing.replace(faqSearchPattern, faqReplacement);
  // Also make the "Frequently Asked Questions" heading large and bold
  pricing = pricing.replace(
    '<h3 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-12">Frequently Asked Questions</h3>',
    '<h3 className="text-4xl md:text-6xl font-black tracking-tighter text-center text-slate-900 dark:text-white mb-16 uppercase">Frequently Asked Questions</h3>'
  );
  fs.writeFileSync('src/components/pages/PricingPage.tsx', pricing);
  console.log('PricingPage FAQs updated successfully.');
} else {
  console.log('FAQ Pattern not found!');
}

// 2. Rewrite Footer.tsx
const footerContent = `import React, { useEffect, useRef, useState } from 'react';
import { Twitter, Github, Linkedin, Mail, ArrowRight, Globe, ChevronDown, Rocket } from 'lucide-react';
import { ModuleId } from '../App';
import { DarkModeToggle } from './ui/DarkModeToggle';

export default function Footer({ onNavigate }: { activeModule?: ModuleId, onNavigate?: (id: ModuleId) => void }) {
  const currentYear = new Date().getFullYear();
  const [footerHeight, setFooterHeight] = useState(0);
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!footerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      if (entries[0]) {
        setFooterHeight(entries[0].target.getBoundingClientRect().height);
      }
    });
    observer.observe(footerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div 
        style={{ height: footerHeight > 0 ? footerHeight : 'auto' }} 
        className="w-full shrink-0 pointer-events-none" 
      />
      
      <footer 
        ref={footerRef}
        className="fixed bottom-0 left-0 w-full bg-[#050505] text-white overflow-hidden shadow-2xl z-[-1]"
      >
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-0 w-full h-[300px] bg-gradient-to-b from-[#111] to-transparent"></div>
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/20 blur-[150px]"></div>
          <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[50%] rounded-full bg-cyan-600/20 blur-[150px]"></div>
        </div>

        <div className="w-full relative z-10 flex flex-col justify-end min-h-[500px] pt-32 pb-8">
          
          {/* Main Giant Typography */}
          <div className="px-4 md:px-8 w-full select-none mb-12 flex justify-center overflow-hidden">
             <div 
               className="text-[12vw] md:text-[min(12vw,14rem)] font-black tracking-tighter leading-[0.8] text-center uppercase drop-shadow-2xl"
               style={{
                 backgroundImage: 'linear-gradient(90deg, #4ade80, #3b82f6, #8b5cf6, #ec4899, #3b82f6, #4ade80)',
                 backgroundSize: '200% auto',
                 color: 'transparent',
                 WebkitBackgroundClip: 'text',
                 animation: 'gradientMove 12s linear infinite',
               }}
             >
               CIVIL ESTIMATION PRO
             </div>
          </div>

          <style dangerouslySetInnerHTML={{__html: \`
            @keyframes gradientMove {
              0% { background-position: 0% center; }
              100% { background-position: 200% center; }
            }
          \`}} />

          {/* Multi-column Glassmorphic Panel */}
          <div className="mx-4 md:mx-12 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 md:p-12 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-12">
              <div className="col-span-1 md:col-span-2">
                <h4 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center shadow-lg">
                    <span className="text-white font-black text-xs drop-shadow-sm">CE</span>
                  </div>
                  Civil Estimation Pro
                </h4>
                <p className="text-slate-400 font-medium leading-[1.8] max-w-sm mb-8 text-sm">
                  The ultimate web platform for modern engineers and quantity surveyors. Bring precision, speed, and real-time collaboration to every site.
                </p>
                <div className="flex items-center gap-3">
                   <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors border border-white/5">
                      <Twitter className="w-4 h-4 text-white" />
                   </a>
                   <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors border border-white/5">
                      <Linkedin className="w-4 h-4 text-white" />
                   </a>
                   <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors border border-white/5">
                      <Github className="w-4 h-4 text-white" />
                   </a>
                </div>
              </div>

              <div>
                <h5 className="text-white font-bold mb-5 tracking-wide text-sm uppercase text-slate-300">Platform</h5>
                <ul className="space-y-4">
                  <li><button onClick={() => onNavigate?.('pricing')} className="text-slate-400 hover:text-cyan-400 font-medium text-sm transition-colors">Pricing & Plans</button></li>
                  <li><button onClick={() => onNavigate?.('about')} className="text-slate-400 hover:text-cyan-400 font-medium text-sm transition-colors">About Us</button></li>
                  <li><button onClick={() => onNavigate?.('careers')} className="text-slate-400 hover:text-cyan-400 font-medium text-sm transition-colors">Careers</button></li>
                  <li><button onClick={() => onNavigate?.('blog')} className="text-slate-400 hover:text-cyan-400 font-medium text-sm transition-colors">Engineering Blog</button></li>
                </ul>
              </div>

              <div>
                <h5 className="text-white font-bold mb-5 tracking-wide text-sm uppercase text-slate-300">Legal & Support</h5>
                <ul className="space-y-4">
                  <li><button onClick={() => onNavigate?.('contact')} className="text-slate-400 hover:text-cyan-400 font-medium text-sm transition-colors">Contact Support</button></li>
                  <li><button onClick={() => onNavigate?.('privacy')} className="text-slate-400 hover:text-cyan-400 font-medium text-sm transition-colors">Privacy Policy</button></li>
                  <li><button onClick={() => onNavigate?.('terms')} className="text-slate-400 hover:text-cyan-400 font-medium text-sm transition-colors">Terms of Service</button></li>
                  <li><button onClick={() => onNavigate?.('cookies')} className="text-slate-400 hover:text-cyan-400 font-medium text-sm transition-colors">Cookie Settings</button></li>
                </ul>
              </div>
            </div>
            
            <div className="w-full h-px bg-white/10 mb-8" />
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
               <p className="text-sm text-slate-500 font-medium">© {currentYear} Civil Estimation Pro. All rights reserved.</p>
               
               <div className="flex items-center gap-4">
                 <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all font-medium text-sm text-white shadow-sm">
                   <Globe className="w-4 h-4 text-slate-300" />
                   English
                   <ChevronDown className="w-4 h-4 text-slate-500" />
                 </button>
               </div>
            </div>
          </div>
          
        </div>
      </footer>
    </>
  );
}`;

fs.writeFileSync('src/components/Footer.tsx', footerContent);
console.log('Footer updated successfully.');

// 3. Make App.tsx wrapper cover the fixed footer
let app = fs.readFileSync('src/App.tsx', 'utf8');

if (app.includes('className="flex-1 flex flex-col min-h-0 relative w-full overflow-x-hidden overflow-y-auto"')) {
   app = app.replace(
     '<div className="flex flex-col min-h-full relative w-full">',
     '<div className="flex flex-col min-h-[100.1%] relative w-full bg-[#f8fafc] dark:bg-slate-900 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-0 rounded-b-[40px] md:rounded-b-[60px] overflow-hidden">'
   );
   fs.writeFileSync('src/App.tsx', app);
   console.log('App.tsx updated to support curtain reveal over fixed footer.');
} else {
   console.log('App.tsx flex container not found!');
}
