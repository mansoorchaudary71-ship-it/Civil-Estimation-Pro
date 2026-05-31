import React, { useEffect, useRef, useState } from 'react';
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
        style={{ zIndex: -10 }}
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

          <style dangerouslySetInnerHTML={{__html: `
            @keyframes gradientMove {
              0% { background-position: 0% center; }
              100% { background-position: 200% center; }
            }
          `}} />

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
}
