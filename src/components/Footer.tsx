import React from 'react';
import { Twitter, Github, Linkedin, Mail } from 'lucide-react';
import { ModuleId } from '../App';

export default function Footer({ onNavigate }: { activeModule?: ModuleId, onNavigate?: (id: ModuleId) => void }) {
  return (
    <footer className="relative w-full overflow-hidden shrink-0 z-20 bg-[#080E1A] border-t border-amber-500/20 pt-20 pb-8 mt-auto shadow-[inset_0_1px_20px_rgba(245,158,11,0.05)]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">
          
          {/* Brand & Tagline Col */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Civil Estimation <span className="text-amber-500">Pro</span>
              </h2>
            </div>
            <p className="text-white/50 text-sm leading-relaxed max-w-xs">
              Generate highly accurate engineering estimates in seconds. The complete toolkit for civil engineers.
            </p>
          </div>

          {/* Links Cols */}
          <div className="grid grid-cols-2 sm:grid-cols-3 col-span-1 md:col-span-3 gap-8 md:gap-12">
            {/* Company Column */}
            <div className="flex flex-col gap-4">
              <h3 className="text-[11px] font-bold text-amber-500/80 uppercase tracking-widest mb-2">Company</h3>
              <div className="flex flex-col gap-3">
                {['About Us', 'Careers', 'Contact', 'Blog'].map((link) => (
                  <button key={link} className="group relative text-left text-sm text-white/60 hover:text-amber-500 transition-colors w-fit">
                    <span className="relative z-10">{link}</span>
                    <span className="absolute left-0 bottom-[-2px] w-0 h-[1px] bg-amber-500 transition-all duration-300 group-hover:w-full"></span>
                  </button>
                ))}
              </div>
            </div>

            {/* Legal Column */}
            <div className="flex flex-col gap-4">
              <h3 className="text-[11px] font-bold text-amber-500/80 uppercase tracking-widest mb-2">Legal</h3>
              <div className="flex flex-col gap-3">
                {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((link) => (
                  <button key={link} className="group relative text-left text-sm text-white/60 hover:text-amber-500 transition-colors w-fit">
                    <span className="relative z-10">{link}</span>
                    <span className="absolute left-0 bottom-[-2px] w-0 h-[1px] bg-amber-500 transition-all duration-300 group-hover:w-full"></span>
                  </button>
                ))}
              </div>
            </div>

            {/* Resources Column */}
            <div className="flex flex-col gap-4">
              <h3 className="text-[11px] font-bold text-amber-500/80 uppercase tracking-widest mb-2">Resources</h3>
              <div className="flex flex-col gap-3">
                {['Embed Calculator', 'Link Exchange', 'Directory Submissions'].map((link) => (
                  <button key={link} className="group relative text-left text-sm text-white/60 hover:text-amber-500 transition-colors w-fit">
                    <span className="relative z-10">{link}</span>
                    <span className="absolute left-0 bottom-[-2px] w-0 h-[1px] bg-amber-500 transition-all duration-300 group-hover:w-full"></span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-white/10 flex flex-col items-center justify-center gap-6">
          <div className="flex items-center gap-4">
            <a href="#" className="w-[36px] h-[36px] rounded-full flex items-center justify-center text-white/50 bg-transparent hover:bg-amber-500 hover:text-[#080E1A] transition-colors">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="#" className="w-[36px] h-[36px] rounded-full flex items-center justify-center text-white/50 bg-transparent hover:bg-amber-500 hover:text-[#080E1A] transition-colors">
              <Github className="w-4 h-4" />
            </a>
            <a href="#" className="w-[36px] h-[36px] rounded-full flex items-center justify-center text-white/50 bg-transparent hover:bg-amber-500 hover:text-[#080E1A] transition-colors">
              <Linkedin className="w-4 h-4" />
            </a>
            <a href="#" className="w-[36px] h-[36px] rounded-full flex items-center justify-center text-white/50 bg-transparent hover:bg-amber-500 hover:text-[#080E1A] transition-colors">
              <Mail className="w-4 h-4" />
            </a>
          </div>

          <div className="text-center w-full">
             <p className="text-sm text-white/30">
                © 2026 Civil Estimation Pro. All rights reserved.
             </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
