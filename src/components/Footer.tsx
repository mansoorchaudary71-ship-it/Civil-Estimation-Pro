import React, { useState } from 'react';
import { MessageSquare, Code, Briefcase, MailPlus, ShieldCheck } from 'lucide-react';
import { ModuleId } from './Dashboard';
import { motion } from 'motion/react';

export default function Footer({ activeModule, onNavigate }: { activeModule?: ModuleId, onNavigate?: (id: ModuleId) => void }) {
  const [email, setEmail] = useState("");

  const handleSubscribe = () => {
    if (email) {
      alert(`Subscribed with ${email}`);
      setEmail("");
    }
  };

  return (
    <motion.footer 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full overflow-hidden shrink-0 z-20 bg-slate-50 text-slate-600 py-12 px-6 border-t border-slate-200" 
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col gap-12">
        
        {/* Top Section: Brand & Newsletter */}
        <div className="flex flex-col lg:flex-row justify-between gap-12 lg:gap-8 items-start">
          
          {/* Brand & Market */}
          <div className="flex flex-col gap-6 max-w-sm">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl tracking-tight text-slate-900 font-bold">
                Civil Estimation <span className="text-[#FF5F15]">Pro</span>
              </h2>
            </div>
            <p className="text-[15px] font-normal leading-relaxed text-slate-500">
              Generate highly accurate engineering estimates in seconds. The complete toolkit for civil engineers driving standard workflows.
            </p>
            
            {/* Markets Row */}
            <div className="flex flex-wrap items-center gap-3">
              {[
                { name: 'Pakistan', flag: '🇵🇰' },
                { name: 'India', flag: '🇮🇳' },
                { name: 'UAE', flag: '🇦🇪' },
                { name: 'Global', flag: '🌍' }
              ].map(market => (
                <span key={market.name} className="px-4 py-2 rounded-full bg-slate-50/80 backdrop-blur-md shadow-sm text-slate-700 font-medium flex items-center gap-2 hover:-translate-y-0.5 hover:bg-white transition-all duration-300 text-sm cursor-default">
                  <span>{market.flag}</span>
                  {market.name}
                </span>
              ))}
            </div>

            {/* Compliance Badges */}
            <div className="flex flex-wrap gap-3 mt-1">
              {["IS Codes", "MORTH/IRC", "NBC", "RERA"].map(badge => (
                <span key={badge} className="px-4 py-2 rounded-2xl bg-slate-50/80 backdrop-blur-md shadow-sm text-slate-700 font-medium flex items-center gap-2 hover:-translate-y-0.5 hover:bg-white transition-all duration-300 text-[13px] cursor-default uppercase tracking-wide">
                  <ShieldCheck className="w-4 h-4 text-[#FF5F15]" />
                  {badge}
                </span>
              ))}
            </div>
          </div>

          {/* Newsletter Embedded Section */}
          <div className="flex flex-col gap-4 w-full lg:w-auto lg:min-w-[400px]">
            <h3 className="flex items-center gap-2 text-base font-bold text-slate-900">
              <MailPlus className="w-5 h-5 text-[#FF5F15]" /> Stay Updated
            </h3>
            <p className="text-[14px] text-slate-500">Join our newsletter for new estimation tools and market updates.</p>
            <div className="flex flex-col sm:flex-row w-full gap-3 mt-1">
              <input 
                type="email" 
                placeholder="Enter your professional email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full sm:flex-1 bg-slate-50 border-transparent rounded-2xl py-3.5 px-5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all duration-300"
              />
              <button 
                onClick={handleSubscribe} 
                className="px-8 py-3.5 bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 text-white rounded-2xl transition-all duration-300 shadow-lg shadow-slate-900/20 text-[14px] font-semibold tracking-wide shrink-0 hover:-translate-y-0.5"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Links Grid Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 pt-8 border-t border-slate-200">
          
          <div className="flex flex-col gap-4">
            <h3 className="text-[13px] uppercase tracking-widest font-bold text-slate-900">Tools</h3>
            <div className="flex flex-col space-y-3">
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
                  className="text-left text-[14px] font-medium text-slate-500 hover:text-[#FF5F15] transition-colors w-fit"
                >
                  {link.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-[13px] uppercase tracking-widest font-bold text-slate-900">Company</h3>
            <div className="flex flex-col space-y-3">
              {['About Us', 'Careers', 'Contact', 'Blog'].map((link) => (
                <button key={link} className="text-left text-[14px] font-medium text-slate-500 hover:text-[#FF5F15] transition-colors w-fit">
                  {link}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-[13px] uppercase tracking-widest font-bold text-slate-900">Legal</h3>
            <div className="flex flex-col space-y-3">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((link) => (
                <button key={link} className="text-left text-[14px] font-medium text-slate-500 hover:text-[#FF5F15] transition-colors w-fit">
                  {link}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-[13px] uppercase tracking-widest font-bold text-slate-900">Resources</h3>
            <div className="flex flex-col space-y-3">
              {['Embed Calculator', 'Link Exchange', 'APIs'].map((link) => (
                <button key={link} className="text-left text-[14px] font-medium text-slate-500 hover:text-[#FF5F15] transition-colors w-fit">
                  {link}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
             <p className="text-[14px] font-medium text-slate-500">
                © {new Date().getFullYear()} Civil Estimation Pro. Pakistan, India & UAE. All rights reserved.
             </p>
          </div>
          
          <div className="flex items-center gap-4">
            <a href="#" className="flex items-center justify-center w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-[#FF5F15] hover:border-slate-300 transition-all shadow-sm">
              <MessageSquare className="w-4 h-4" />
            </a>
            <a href="#" className="flex items-center justify-center w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-[#FF5F15] hover:border-slate-300 transition-all shadow-sm">
              <Code className="w-4 h-4" />
            </a>
            <a href="#" className="flex items-center justify-center w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-[#FF5F15] hover:border-slate-300 transition-all shadow-sm">
              <Briefcase className="w-4 h-4" />
            </a>
          </div>
        </div>

      </div>
    </motion.footer>
  );
}
