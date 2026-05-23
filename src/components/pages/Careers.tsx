import React from 'react';
import { Briefcase, Mail, Sparkles } from 'lucide-react';
import { SEO } from '../SEO';

export default function Careers() {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-12 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <SEO 
        title="Careers | Civil Estimation Pro" 
        description="Join our team and help build the future of construction software." 
      />

      <div className="text-center space-y-6">
        <div className="inline-flex items-center justify-center p-4 bg-purple-50 dark:bg-purple-900/30 rounded-[12px] mb-2 shadow-[0_8px_16px_-6px_rgba(168,85,247,0.2)]">
          <Briefcase className="w-8 h-8 text-purple-600 dark:text-purple-400" strokeWidth={1.5} />
        </div>
        <h1 className="text-[28px] md:text-5xl font-extrabold text-text-primary tracking-tight">
          Join Our Team
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          Help us build the software that's literally building the world. We are always looking for passionate engineers, designers, and innovators.
        </p>
      </div>

      {/* Empty State */}
      <div className="bg-bg-card rounded-[12px] p-[20px] md:p-16 border border-border-color shadow-[0_2px_12px_rgba(0,0,0,0.08)] text-center relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl opacity-50 mix-blend-screen pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl opacity-50 mix-blend-screen pointer-events-none" />
        
        <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center">
          <div className="w-20 h-20 bg-bg-primary rounded-full flex items-center justify-center mb-6 border border-border-color">
            <Sparkles className="w-8 h-8 text-slate-400 dark:text-[#4B5563]" strokeWidth={1.5} />
          </div>
          <h2 className="text-[18px] font-bold text-text-primary mb-4">
            We aren't actively hiring right now.
          </h2>
          <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed mb-10">
            While we don't have any open positions at the moment, we're always excited to connect with talented individuals who share our vision. 
          </p>

          <div className="w-full bg-bg-primary/50 rounded-[12px] p-8 border border-border-color/50 flex flex-col items-center text-center shadow-inner">
            <div className="w-12 h-12 bg-bg-card rounded-[12px] flex items-center justify-center shadow-[0_2px_12px_rgba(0,0,0,0.08)] border border-border-color mb-5">
              <Mail className="w-6 h-6 text-slate-600 dark:text-slate-400" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-bold text-text-primary mb-2">
              Send us your resume anyway!
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm max-w-sm mx-auto">
              Drop us a line with your portfolio or CV, and we'll keep you in mind for future opportunities.
            </p>
            <a 
              href="mailto:careers@civilpro.com" 
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-slate-900 border border-slate-800 dark:bg-white dark:border-white text-white dark:text-slate-900 font-bold rounded-[12px] hover:bg-[#6B46C1] dark:hover:bg-slate-100 transition-all shadow-[0_2px_12px_rgba(0,0,0,0.08)] transition-transform hover:-translate-y-[2px] hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)]-[0_2px_12px_rgba(0,0,0,0.08)] w-full md:w-auto justify-center"
            >
              careers@civilpro.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
