import React from 'react';
import { Twitter, Github, Linkedin, Mail } from 'lucide-react';
import { ModuleId } from '../App';

export default function Footer({ onNavigate }: { activeModule?: ModuleId, onNavigate?: (id: ModuleId) => void }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full relative shrink-0 z-10 px-6 md:px-12 mt-12 bg-transparent">
      <div className="w-full max-w-[1400px] mx-auto py-8 md:py-12 border-t border-[#111111]/10 dark:border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left: Logo */}
        <div 
          className="flex items-center justify-start cursor-pointer shrink-0"
          onClick={() => onNavigate?.("home")}
        >
          <span className="font-heading font-black text-xl tracking-tighter text-[#111111] dark:text-white">
            Civil Pro.
          </span>
        </div>

        {/* Center: Legal/Copyright */}
        <div className="flex-1 flex justify-center text-center">
          <p className="text-[13px] text-[#111111]/40 dark:text-white/40 font-medium">
            © {currentYear} Civil Pro. All rights reserved.
          </p>
        </div>

        {/* Right: Social Icons */}
        <div className="flex items-center justify-end gap-5 shrink-0">
          <a href="#" className="text-[#111111]/40 hover:text-[#111111] dark:text-white/40 dark:hover:text-white transition-colors">
            <Twitter className="w-5 h-5" />
          </a>
          <a href="#" className="text-[#111111]/40 hover:text-[#111111] dark:text-white/40 dark:hover:text-white transition-colors">
            <Github className="w-5 h-5" />
          </a>
          <a href="#" className="text-[#111111]/40 hover:text-[#111111] dark:text-white/40 dark:hover:text-white transition-colors">
            <Linkedin className="w-5 h-5" />
          </a>
          <a href="#" className="text-[#111111]/40 hover:text-[#111111] dark:text-white/40 dark:hover:text-white transition-colors">
            <Mail className="w-5 h-5" />
          </a>
        </div>

      </div>
    </footer>
  );
}
