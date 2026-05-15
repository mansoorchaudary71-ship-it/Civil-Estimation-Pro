import React from 'react';
import { Layers, Twitter, Github, Linkedin, Mail } from 'lucide-react';
import Logo from './Logo';
import { ModuleId } from '../App';

export default function Footer({ activeModule, onNavigate }: { activeModule?: ModuleId, onNavigate?: (id: ModuleId) => void }) {
  const currentYear = new Date().getFullYear();

  const getLinkClasses = (moduleId: ModuleId) => {
    return `text-left text-sm transition-colors ${
      activeModule === moduleId 
        ? "text-blue-700 dark:text-blue-400 font-bold" 
        : "text-slate-700 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-400 font-medium"
    }`;
  };

  return (
    <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 mb-8 mt-12">
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/40 dark:border-slate-800/40 rounded-[2.5rem] p-8 md:p-12 shadow-sm">
        
        {/* Top Section: Branding and Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-8 mb-12">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 flex flex-col items-start">
            <div 
              className="flex items-center gap-2 cursor-pointer group shrink-0 mb-4"
              onClick={() => onNavigate?.("home")}
            >
              <div className="w-9 h-9 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <Logo className="w-9 h-9" />
              </div>
              <span className="font-bold text-[1.2rem] tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300">
                Civil Estimation Pro
              </span>
            </div>
            <p className="text-slate-700 dark:text-slate-300 text-sm font-medium leading-relaxed max-w-xs">
              Comprehensive engineering tools and precise estimation modules built for modern construction professionals.
            </p>
          </div>

          {/* Links Columns */}
          <div className="flex flex-col gap-3">
            <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-2">Product Modules</h4>
            <a href="#" className="text-sm text-slate-700 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-400 font-medium transition-colors">2D Takeoff</a>
            <a href="#" className="text-sm text-slate-700 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-400 font-medium transition-colors">House Estimator</a>
            <a href="#" className="text-sm text-slate-700 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-400 font-medium transition-colors">Earthworks</a>
            <a href="#" className="text-sm text-slate-700 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-400 font-medium transition-colors">Calculators</a>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-2">Resources</h4>
            <a href="#" className="text-sm text-slate-700 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-400 font-medium transition-colors">Documentation</a>
            <a href="#" className="text-sm text-slate-700 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-400 font-medium transition-colors">API Reference</a>
            <a href="#" className="text-sm text-slate-700 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-400 font-medium transition-colors">Help Center</a>
            <a href="#" className="text-sm text-slate-700 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-400 font-medium transition-colors">Community</a>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-2">Company</h4>
            <button onClick={() => onNavigate?.("about")} className={getLinkClasses("about")}>About Us</button>
            <button onClick={() => onNavigate?.("careers")} className={getLinkClasses("careers")}>Careers</button>
            <button onClick={() => onNavigate?.("contact")} className={getLinkClasses("contact")}>Contact</button>
            <button onClick={() => onNavigate?.("blog")} className={getLinkClasses("blog")}>Blog</button>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-2">Legal</h4>
            <button onClick={() => onNavigate?.("privacy")} className={getLinkClasses("privacy")}>Privacy Policy</button>
            <button onClick={() => onNavigate?.("terms")} className={getLinkClasses("terms")}>Terms of Service</button>
            <button onClick={() => onNavigate?.("cookies")} className={getLinkClasses("cookies")}>Cookie Policy</button>
          </div>

        </div>

        {/* Divider */}
        <div className="h-px w-full bg-slate-200/60 dark:bg-slate-700/50 mb-8" />

        {/* Bottom Section: Copyright & Socials */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-700 dark:text-slate-300 font-medium text-center sm:text-left">
            © {currentYear} Civil Estimation Pro. All rights reserved.
          </p>
          
          <div className="flex items-center gap-4">
            <a href="#" className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-500/10 dark:hover:text-blue-400 transition-colors">
              <Twitter className="w-4.5 h-4.5" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-200 hover:text-slate-900 dark:hover:bg-slate-700 dark:hover:text-white transition-colors">
              <Github className="w-4.5 h-4.5" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-500/10 dark:hover:text-blue-400 transition-colors">
              <Linkedin className="w-4.5 h-4.5" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-indigo-50 hover:text-indigo-700 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-400 transition-colors">
              <Mail className="w-4.5 h-4.5" />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
