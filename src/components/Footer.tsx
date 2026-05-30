import React from 'react';
import { Twitter, Github, Linkedin, Mail, ArrowRight, Globe, ChevronDown } from 'lucide-react';
import { ModuleId } from '../App';
import { DarkModeToggle } from './ui/DarkModeToggle';

export default function Footer({ onNavigate }: { activeModule?: ModuleId, onNavigate?: (id: ModuleId) => void }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative w-full overflow-hidden shrink-0 z-20 bg-[#F5F5F7] border-t border-slate-200/50 pt-24 pb-12 mt-auto">
      {/* Ambient glowing gradients */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none mix-blend-multiply"></div>
      <div className="absolute top-0 right-1/4 w-[500px] h-[300px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none mix-blend-multiply"></div>

      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col items-center">
      
        {/* Supporting Links arranged above or below */}
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 text-xs md:text-sm font-bold text-slate-500 tracking-widest uppercase mb-12 md:mb-16">
          <button onClick={() => onNavigate?.('about')} className="hover:text-[#F59E0B] transition-colors">About Us</button>
          <button onClick={() => onNavigate?.('pricing')} className="hover:text-[#F59E0B] transition-colors">Pricing</button>
          <button onClick={() => onNavigate?.('contact')} className="hover:text-[#F59E0B] transition-colors">Contact</button>
          <button onClick={() => onNavigate?.('blog')} className="hover:text-[#F59E0B] transition-colors">Blog</button>
          <button onClick={() => onNavigate?.('privacy')} className="hover:text-[#F59E0B] transition-colors">Privacy</button>
          <button onClick={() => onNavigate?.('terms')} className="hover:text-[#F59E0B] transition-colors">Terms</button>
        </div>

        {/* Centerpiece Huge Wordmark */}
        <div className="w-full flex items-center justify-center pointer-events-none select-none mb-16 overflow-hidden">
          <span 
  className="text-[16vw] md:text-[10rem] lg:text-[12rem] font-black tracking-tighter text-slate-900 uppercase leading-[0.85] flex flex-col items-center justify-center text-center"
  style={{ fontWeight: 900 }}
>
  <span className="tracking-tighter">CIVIL</span>
  <span className="tracking-tighter">ESTIMATION</span>
  <span className="tracking-tighter text-[#F59E0B]">PRO</span>
</span>
        </div>

        {/* Bottom Utility Bar */}
        <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-slate-200/60">
          
          <div className="flexItems-center text-center md:text-left order-3 md:order-1">
             <p className="text-sm text-slate-500 font-medium">
                © {currentYear} Civil Estimation Pro. All rights reserved.
             </p>
          </div>

          <div className="flex items-center gap-4 order-2">
             <div className="relative group/lang">
               <button className="flex items-center gap-2 px-3 py-2 rounded-[24px] bg-white hover:bg-slate-50 border border-slate-200 transition-all font-medium text-sm text-slate-700 shadow-sm">
                 <Globe className="w-4 h-4 text-slate-500" />
                 English (US)
                 <ChevronDown className="w-4 h-4 text-slate-400" />
               </button>
             </div>
             <DarkModeToggle />
          </div>

          <div className="flex items-center gap-3 order-1 md:order-3">
             <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-500 hover:text-[#F59E0B] hover:border-amber-200 shadow-sm transition-all duration-300 hover:-translate-y-0.5">
                <Twitter className="w-4 h-4" />
             </a>
             <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-500 hover:text-[#F59E0B] hover:border-amber-200 shadow-sm transition-all duration-300 hover:-translate-y-0.5">
                <Github className="w-4 h-4" />
             </a>
             <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-500 hover:text-[#F59E0B] hover:border-amber-200 shadow-sm transition-all duration-300 hover:-translate-y-0.5">
                <Linkedin className="w-4 h-4" />
             </a>
             <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-500 hover:text-[#F59E0B] hover:border-amber-200 shadow-sm transition-all duration-300 hover:-translate-y-0.5">
                <Mail className="w-4 h-4" />
             </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
