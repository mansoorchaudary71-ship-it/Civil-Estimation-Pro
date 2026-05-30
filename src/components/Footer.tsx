import React from 'react';
import { Twitter, Github, Linkedin, Mail, ArrowRight, Globe, ChevronDown } from 'lucide-react';
import { ModuleId } from '../App';
import { DarkModeToggle } from './ui/DarkModeToggle';

export default function Footer({ onNavigate }: { activeModule?: ModuleId, onNavigate?: (id: ModuleId) => void }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative w-full overflow-hidden shrink-0 z-20 bg-slate-50/80 [#0a0a0a]/80 backdrop-blur-3xl border-t border-slate-200/50 pt-16 md:pt-24 pb-12 mt-auto">
      {/* Ambient glowing gradients */}
      <div className="absolute bottom-[-20%] left-1/4 w-[600px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen"></div>
      <div className="absolute bottom-[-10%] right-1/4 w-[500px] h-[300px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen"></div>

      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-12">
        
        {/* Premium CTA & Newsletter Box */}
        <div className="flex flex-col xl:flex-row items-center justify-between gap-10 bg-white/60 [0.03] backdrop-blur-2xl border border-white/80 rounded-[2.5rem] p-8 md:p-12 mb-20 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.05)] [0_8px_32px_-8px_rgba(0,0,0,0.3)]">
          
          <div className="flex-1 flex flex-col items-start gap-5 text-left max-w-2xl">
             <h3 className="font-heading font-semibold tabular-nums tracking-tight text-3xl md:text-5xl text-slate-900 tracking-tight leading-[1.1]">
               Build better,<br/>
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
                 estimate faster.
               </span>
             </h3>
             <p className="text-slate-600 font-medium text-lg leading-relaxed">
               Join thousands of engineers relying on Civil Estimation Pro for highly accurate, instant engineering calculations. Upgrade your workflow today.
             </p>
             <button 
               onClick={() => onNavigate?.("home")} 
               className="mt-3 group relative inline-flex items-center justify-center px-8 py-4 rounded-full font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-[0_4px_20px_rgba(79,70,229,0.3)] hover:shadow-[0_8px_40px_rgba(79,70,229,0.4)] transition-all duration-300 hover:-translate-y-1 overflow-hidden"
             >
               <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
               <span className="relative flex items-center gap-2 tracking-wide">
                 Start Estimating for Free 
                 <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" />
               </span>
             </button>
          </div>
          
          <div className="w-full xl:w-[480px] shrink-0 bg-white/50 backdrop-blur-md p-8 md:p-10 rounded-[2rem] border border-white/60 shadow-inner">
             <div className="flex items-center gap-4 mb-6">
               <div className="w-12 h-12 rounded-[24px] bg-indigo-100/80 flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-200/50">
                  <Mail className="w-6 h-6"/>
               </div>
               <div>
                  <h4 className="font-bold text-xl text-slate-900 leading-tight">Engineering Insights</h4>
                  <p className="text-sm text-slate-500 font-medium tracking-wide mt-0.5">Weekly tools, templates & updates</p>
               </div>
             </div>
             <form className="relative flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-0" onSubmit={(e) => e.preventDefault()}>
               <div className="absolute left-4 top-[18px] sm:top-1/2 sm:-translate-y-1/2 z-10 text-slate-400">
                 <Mail className="w-5 h-5" />
               </div>
               <input 
                 type="email" 
                 placeholder="Enter your work email" 
                 className="w-full h-[56px] pl-12 pr-4 sm:pr-[140px] rounded-[24px] sm:rounded-full bg-white/80 border border-slate-200/80 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 backdrop-blur-md transition-shadow font-medium shadow-sm hover:bg-white" 
               />
               <button className="sm:absolute sm:right-2 sm:top-2 sm:bottom-2 h-[56px] sm:h-10 bg-white text-white font-bold px-6 rounded-[24px] sm:rounded-full hover:bg-indigo-600 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md">
                 Subscribe
               </button>
             </form>
          </div>
        </div>

        {/* Links Grid Section */}
        <div className="flex flex-col lg:flex-row justify-between gap-16 lg:gap-12 pb-16 border-b border-slate-200/60">
          
          {/* Brand Info */}
          <div className="flex flex-col items-start gap-6 lg:max-w-sm">
            <div 
              className="flex items-center justify-start cursor-pointer shrink-0 group"
              onClick={() => onNavigate?.("home")}
            >
              <div className="w-10 h-10 rounded-[24px] bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center mr-3 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
                <span className="text-white font-semibold tabular-nums tracking-tight text-xl italic tracking-tighter">C</span>
              </div>
              <span className="font-heading font-semibold tabular-nums tracking-tight text-2xl tracking-tighter text-slate-900 whitespace-nowrap">
                Civil Estimation Pro
              </span>
            </div>
            <p className="text-[15px] text-slate-600 font-medium leading-relaxed">
              Generate highly accurate engineering estimates in seconds. The complete toolkit for civil engineers, contractors, and architects worldwide.
            </p>
          </div>

          {/* Nav Links */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-12 sm:gap-24 lg:gap-16 xl:gap-24">
            {/* Company */}
            <div className="flex flex-col gap-6">
              <h4 className="font-bold text-sm text-slate-900 tracking-widest uppercase opacity-70">Company</h4>
              <div className="flex flex-col gap-4">
                <button onClick={() => onNavigate?.('about')} className="text-left text-slate-600 hover:text-indigo-600 transition-colors font-medium">About Us</button>
                <button onClick={() => onNavigate?.('careers')} className="text-left text-slate-600 hover:text-indigo-600 transition-colors font-medium">Careers</button>
                <button onClick={() => onNavigate?.('contact')} className="text-left text-slate-600 hover:text-indigo-600 transition-colors font-medium">Contact</button>
                <button onClick={() => onNavigate?.('blog')} className="text-left text-slate-600 hover:text-indigo-600 transition-colors font-medium relative group">
                  Blog <span className="absolute ml-2 inset-y-0.5 px-2 bg-indigo-100 text-indigo-700 text-[10px] uppercase font-bold tracking-wider rounded-full flex items-center opacity-0 group-hover:opacity-100 transition-opacity">New</span>
                </button>
              </div>
            </div>

            {/* Legal */}
            <div className="flex flex-col gap-6">
              <h4 className="font-bold text-sm text-slate-900 tracking-widest uppercase opacity-70">Legal</h4>
              <div className="flex flex-col gap-4">
                <button onClick={() => onNavigate?.('privacy')} className="text-left text-slate-600 hover:text-indigo-600 transition-colors font-medium">Privacy Policy</button>
                <button onClick={() => onNavigate?.('terms')} className="text-left text-slate-600 hover:text-indigo-600 transition-colors font-medium">Terms of Service</button>
                <button onClick={() => onNavigate?.('cookies')} className="text-left text-slate-600 hover:text-indigo-600 transition-colors font-medium">Cookie Policy</button>
              </div>
            </div>

            {/* Resources */}
            <div className="flex flex-col gap-6 col-span-2 md:col-span-1">
              <h4 className="font-bold text-sm text-slate-900 tracking-widest uppercase opacity-70">Resources</h4>
              <div className="flex flex-col gap-4">
                <button onClick={() => window.alert('<iframe src="https://civilestimationpro.com" width="100%" height="800"></iframe>')} className="text-left text-slate-600 hover:text-indigo-600 transition-colors font-medium">Embed Calculator</button>
                <a href="#" className="text-left text-slate-600 hover:text-indigo-600 transition-colors font-medium">Link Exchange</a>
                <a href="#" className="text-left text-slate-600 hover:text-indigo-600 transition-colors font-medium">Directory Submissions</a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Utility Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Copyright */}
          <div className="flexItems-center text-center md:text-left order-3 md:order-1">
            <p className="text-sm text-slate-500 font-medium">
              © {currentYear} Civil Estimation Pro. All rights reserved.
            </p>
          </div>

          {/* Region / Utilities */}
          <div className="flex items-center gap-4 order-2">
            <div className="relative group/lang">
              <button className="flex items-center gap-2 px-3 py-2 rounded-[24px] bg-white/50 hover:bg-white border border-slate-200/60 transition-all font-medium text-sm text-slate-700">
                <Globe className="w-4 h-4 text-slate-500" />
                English (US)
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>
            </div>
            <div className="h-6 w-px bg-slate-300"></div>
            <DarkModeToggle />
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-3 order-1 md:order-3">
            <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-white/50 border border-slate-200/60 text-slate-500 hover:text-indigo-600 hover:bg-white hover:border-indigo-200 hover:shadow-sm transition-all duration-300 hover:-translate-y-0.5">
               <Twitter className="w-4 h-4" />
            </a>
            <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-white/50 border border-slate-200/60 text-slate-500 hover:text-indigo-600 hover:bg-white hover:border-indigo-200 hover:shadow-sm transition-all duration-300 hover:-translate-y-0.5">
               <Github className="w-4 h-4" />
            </a>
            <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-white/50 border border-slate-200/60 text-slate-500 hover:text-indigo-600 hover:bg-white hover:border-indigo-200 hover:shadow-sm transition-all duration-300 hover:-translate-y-0.5">
               <Linkedin className="w-4 h-4" />
            </a>
            <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-white/50 border border-slate-200/60 text-slate-500 hover:text-indigo-600 hover:bg-white hover:border-indigo-200 hover:shadow-sm transition-all duration-300 hover:-translate-y-0.5">
               <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
