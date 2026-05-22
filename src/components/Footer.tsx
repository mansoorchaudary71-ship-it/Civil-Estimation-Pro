import React from 'react';
import { Twitter, Github, Linkedin, Mail } from 'lucide-react';
import { ModuleId } from '../App';

export default function Footer({ onNavigate }: { activeModule?: ModuleId, onNavigate?: (id: ModuleId) => void }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full relative shrink-0 z-20 px-6 md:px-12 mt-auto bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border-t border-[#111111]/10 dark:border-white/10 pb-[120px] md:pb-8">
      <div className="w-full max-w-[1400px] mx-auto pt-10 pb-8 flex flex-col md:flex-row justify-between gap-12 border-b border-[#111111]/10 dark:border-white/10">
        
        {/* Left: Brand Logo */}
        <div className="flex flex-col items-start gap-4">
          <div 
            className="flex items-center justify-start cursor-pointer shrink-0"
            onClick={() => onNavigate?.("home")}
          >
            <span className="font-heading font-black text-2xl tracking-tighter text-[#111111] dark:text-white whitespace-nowrap">
              Civil Estimation Pro
            </span>
          </div>
          <p className="text-[14px] text-[#111111]/60 dark:text-white/60 max-w-xs font-medium">
            Generate highly accurate engineering estimates in seconds. The complete toolkit for civil engineers.
          </p>
        </div>

        {/* Links container */}
        <div className="flex flex-col md:flex-row gap-12 md:gap-24">
          {/* Company Links */}
          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-[16px] text-[#111111] dark:text-white tracking-wide">Company</h4>
            <div className="flex flex-col gap-3">
              <button onClick={() => onNavigate?.('about')} className="text-left text-[#111111]/70 dark:text-white/70 hover:text-[var(--accent-vibrant)] dark:hover:text-[var(--accent-vibrant)] transition-colors font-medium">About Us</button>
              <button onClick={() => onNavigate?.('careers')} className="text-left text-[#111111]/70 dark:text-white/70 hover:text-[var(--accent-vibrant)] dark:hover:text-[var(--accent-vibrant)] transition-colors font-medium">Careers</button>
              <button onClick={() => onNavigate?.('contact')} className="text-left text-[#111111]/70 dark:text-white/70 hover:text-[var(--accent-vibrant)] dark:hover:text-[var(--accent-vibrant)] transition-colors font-medium">Contact</button>
              <button onClick={() => onNavigate?.('blog')} className="text-left text-[#111111]/70 dark:text-white/70 hover:text-[var(--accent-vibrant)] dark:hover:text-[var(--accent-vibrant)] transition-colors font-medium">Blog</button>
            </div>
          </div>

          {/* Legal Links */}
          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-[16px] text-[#111111] dark:text-white tracking-wide">Legal</h4>
            <div className="flex flex-col gap-3">
              <button onClick={() => onNavigate?.('privacy')} className="text-left text-[#111111]/70 dark:text-white/70 hover:text-[var(--accent-vibrant)] dark:hover:text-[var(--accent-vibrant)] transition-colors font-medium">Privacy Policy</button>
              <button onClick={() => onNavigate?.('terms')} className="text-left text-[#111111]/70 dark:text-white/70 hover:text-[var(--accent-vibrant)] dark:hover:text-[var(--accent-vibrant)] transition-colors font-medium">Terms of Service</button>
              <button onClick={() => onNavigate?.('cookies')} className="text-left text-[#111111]/70 dark:text-white/70 hover:text-[var(--accent-vibrant)] dark:hover:text-[var(--accent-vibrant)] transition-colors font-medium">Cookie Policy</button>
            </div>
          </div>
        </div>

      </div>

      <div className="w-full max-w-[1400px] mx-auto pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Center: Legal/Copyright */}
        <div className="flex-1 flex justify-center text-center">
          <p className="text-[14px] text-[#111111]/60 dark:text-white/60 font-medium">
            © {currentYear} Civil Estimation Pro. All rights reserved.
          </p>
        </div>

        {/* Right: Social Icons */}
        <div className="flex items-center justify-end gap-5 shrink-0">
          <a href="#" className="p-2 rounded-full bg-[#111111]/5 dark:bg-white/5 text-[#111111]/60 hover:text-[var(--accent-vibrant)] hover:bg-[var(--accent-vibrant)]/10 dark:text-white/60 dark:hover:text-[var(--accent-vibrant)] transition-all">
            <Twitter className="w-5 h-5" />
          </a>
          <a href="#" className="p-2 rounded-full bg-[#111111]/5 dark:bg-white/5 text-[#111111]/60 hover:text-[var(--accent-vibrant)] hover:bg-[var(--accent-vibrant)]/10 dark:text-white/60 dark:hover:text-[var(--accent-vibrant)] transition-all">
            <Github className="w-5 h-5" />
          </a>
          <a href="#" className="p-2 rounded-full bg-[#111111]/5 dark:bg-white/5 text-[#111111]/60 hover:text-[var(--accent-vibrant)] hover:bg-[var(--accent-vibrant)]/10 dark:text-white/60 dark:hover:text-[var(--accent-vibrant)] transition-all">
            <Linkedin className="w-5 h-5" />
          </a>
          <a href="#" className="p-2 rounded-full bg-[#111111]/5 dark:bg-white/5 text-[#111111]/60 hover:text-[var(--accent-vibrant)] hover:bg-[var(--accent-vibrant)]/10 dark:text-white/60 dark:hover:text-[var(--accent-vibrant)] transition-all">
            <Mail className="w-5 h-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
