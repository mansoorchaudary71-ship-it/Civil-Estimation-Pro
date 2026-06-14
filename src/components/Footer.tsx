import React, { useState } from 'react';
import { Twitter, Github, Linkedin, Mail, ShieldCheck, MailPlus } from 'lucide-react';
import { ModuleId } from '../App';

export default function Footer({ activeModule, onNavigate }: { activeModule?: ModuleId, onNavigate?: (id: ModuleId) => void }) {
  const [email, setEmail] = useState("");

  const handleSubscribe = () => {
    if (email) {
      alert(`Subscribed with ${email}`);
      setEmail("");
    }
  };

  return (
    <footer className="relative w-full overflow-hidden shrink-0 z-20 bg-[#0A192F] pt-16 pb-8 mt-auto shadow-sm text-slate-300" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div 
        className="absolute top-0 left-0 w-full h-1.5" 
        style={{
          background: 'repeating-linear-gradient(45deg, #FF5F15, #FF5F15 20px, #FFC000 20px, #FFC000 40px)'
        }}
      />
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 md:gap-8 mb-16">
          
          {/* Brand & Market Col - span 2 */}
          <div className="col-span-1 md:col-span-2 flex flex-col gap-5">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black text-white tracking-tight">
                Civil Estimation <span className="text-[#FF5F15]">Pro</span>
              </h2>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Generate highly accurate engineering estimates in seconds. The complete toolkit for civil engineers driving standard workflows.
            </p>
            
            {/* Markets Row */}
            <div className="flex items-center gap-2 text-sm text-slate-400 font-medium whitespace-nowrap overflow-x-auto scrollbar-hide py-1">
              <span>🇵🇰 Pakistan</span>
              <span className="text-slate-600">•</span>
              <span>🇮🇳 India</span>
              <span className="text-slate-600">•</span>
              <span>🇦🇪 UAE</span>
              <span className="text-slate-600">•</span>
              <span>🌍 Global</span>
            </div>

            {/* Compliance Badges */}
            <div className="flex flex-wrap gap-2 mt-2">
              {["IS Codes", "MORTH/IRC", "NBC", "RERA"].map(badge => (
                <span key={badge} className="px-2 py-1 bg-slate-800 border border-slate-700/60 rounded flex items-center justify-center gap-1.5 text-[10px] uppercase font-bold text-slate-300">
                  <ShieldCheck className="w-3 h-3 text-[#FF5F15]" />
                  {badge}
                </span>
              ))}
            </div>
          </div>

          {/* Links Cols */}
          <div className="grid grid-cols-2 sm:grid-cols-4 col-span-1 md:col-span-3 gap-8 md:gap-6">
            
            {/* Tools Column (New) */}
            <div className="flex flex-col gap-4">
              <h3 className="text-[11px] font-bold text-[#FF5F15] uppercase tracking-widest mb-2">Tools</h3>
              <div className="flex flex-col gap-3">
                {[
                  { name: 'BOQ Generator', id: 'house' },
                  { name: 'Concrete Mix Design', id: 'concrete-advanced' },
                  { name: 'Steel Estimator', id: 'steel-estimator' },
                  { name: 'Market Rates', id: 'rates' },
                  { name: 'Earthwork', id: 'earthwork-advanced' }
                ].map((link) => (
                  <button 
                    key={link.id} 
                    onClick={() => onNavigate?.(link.id as ModuleId)}
                    className="group relative text-left text-sm text-slate-400 hover:text-[#FF5F15] transition-colors w-fit"
                  >
                    <span className="relative z-10">{link.name}</span>
                    <span className="absolute left-0 bottom-[-2px] w-0 h-[1px] bg-[#FF5F15] transition-all duration-300 group-hover:w-full"></span>
                  </button>
                ))}
              </div>
            </div>

            {/* Company Column */}
            <div className="flex flex-col gap-4">
              <h3 className="text-[11px] font-bold text-[#FF5F15] uppercase tracking-widest mb-2">Company</h3>
              <div className="flex flex-col gap-3">
                {['About Us', 'Careers', 'Contact', 'Blog'].map((link) => (
                  <button key={link} className="group relative text-left text-sm text-slate-400 hover:text-[#FF5F15] transition-colors w-fit">
                    <span className="relative z-10">{link}</span>
                    <span className="absolute left-0 bottom-[-2px] w-0 h-[1px] bg-[#FF5F15] transition-all duration-300 group-hover:w-full"></span>
                  </button>
                ))}
              </div>
            </div>

            {/* Legal Column */}
            <div className="flex flex-col gap-4">
              <h3 className="text-[11px] font-bold text-[#FF5F15] uppercase tracking-widest mb-2">Legal</h3>
              <div className="flex flex-col gap-3">
                {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((link) => (
                  <button key={link} className="group relative text-left text-sm text-slate-400 hover:text-[#FF5F15] transition-colors w-fit">
                    <span className="relative z-10">{link}</span>
                    <span className="absolute left-0 bottom-[-2px] w-0 h-[1px] bg-[#FF5F15] transition-all duration-300 group-hover:w-full"></span>
                  </button>
                ))}
              </div>
            </div>

            {/* Resources Column */}
            <div className="flex flex-col gap-4">
              <h3 className="text-[11px] font-bold text-[#FF5F15] uppercase tracking-widest mb-2">Resources</h3>
              <div className="flex flex-col gap-3">
                {['Embed Calculator', 'Link Exchange', 'APIs'].map((link) => (
                  <button key={link} className="group relative text-left text-sm text-slate-400 hover:text-[#FF5F15] transition-colors w-fit">
                    <span className="relative z-10">{link}</span>
                    <span className="absolute left-0 bottom-[-2px] w-0 h-[1px] bg-[#FF5F15] transition-all duration-300 group-hover:w-full"></span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Email Capture Bar */}
        <div className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 md:p-8 mb-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-inner">
          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-1">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <MailPlus className="w-5 h-5 text-[#FF5F15]" /> Stay Updated
            </h3>
            <p className="text-slate-400 text-sm">Join our newsletter for new estimation tools and market updates.</p>
          </div>
          <div className="flex w-full md:w-auto relative max-w-md">
            <input 
              type="email" 
              placeholder="Enter your professional email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full md:w-80 bg-slate-900 border border-slate-700/50 rounded-xl py-3 pl-4 pr-32 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            />
            <button 
              onClick={handleSubscribe} 
              className="absolute right-1 top-1 bottom-1 px-5 bg-[#FF5F15] hover:bg-[#ea580c] text-white font-bold text-sm rounded-lg transition-colors"
            >
              Subscribe
            </button>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
             <p className="text-sm text-slate-500">
                © 2025 Civil Estimation Pro. Pakistan, India & UAE. All rights reserved.
             </p>
          </div>
          
          <div className="flex items-center gap-4">
            <a href="#" className="flex items-center gap-2 text-slate-500 hover:text-[#FF5F15] transition-colors group">
              <span className="w-9 h-9 rounded-full bg-slate-800/50 group-hover:bg-[#FF5F15]/10 flex items-center justify-center transition-colors">
                <Twitter className="w-4 h-4" />
              </span>
              <span className="text-sm font-medium hidden md:inline">Twitter</span>
            </a>
            <a href="#" className="flex items-center gap-2 text-slate-500 hover:text-[#FF5F15] transition-colors group">
              <span className="w-9 h-9 rounded-full bg-slate-800/50 group-hover:bg-[#FF5F15]/10 flex items-center justify-center transition-colors">
                <Github className="w-4 h-4" />
              </span>
              <span className="text-sm font-medium hidden md:inline">GitHub</span>
            </a>
            <a href="#" className="flex items-center gap-2 text-slate-500 hover:text-[#FF5F15] transition-colors group">
              <span className="w-9 h-9 rounded-full bg-slate-800/50 group-hover:bg-[#FF5F15]/10 flex items-center justify-center transition-colors">
                <Linkedin className="w-4 h-4" />
              </span>
              <span className="text-sm font-medium hidden md:inline">LinkedIn</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
