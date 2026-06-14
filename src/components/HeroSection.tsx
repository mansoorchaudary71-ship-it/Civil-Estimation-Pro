import React from 'react';
import { ArrowRight, Play, User, Building, ShieldCheck, Globe, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export default function HeroSection({ onStart }: { onStart: () => void }) {
  const stats = [
    { val: '30+', lab: 'Professional Tools', icon: Building, sub: 'Verified to global standards' },
    { val: '100%', lab: 'Free Forever', icon: ShieldCheck, sub: 'No hidden paywalls or ads' },
    { val: '15+', lab: 'Countries Trusted', icon: Globe, sub: 'Used by global practitioners' },
    { val: 'AI', lab: 'Powered Estimates', icon: Sparkles, sub: 'Next-gen data automation' }
  ];

  return (
    <div className="relative w-full bg-gradient-to-b from-[#ffffff] via-slate-50/80 to-[#e2e8f0]/30 flex flex-col justify-start overflow-hidden pt-24 md:pt-32 pb-12 md:pb-16 hero-section">
      {/* Background Layers */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Soft premium gradient glow */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at top left, transparent 40%, rgba(10,25,47,0.04) 100%), radial-gradient(circle at bottom right, rgba(255,95,21,0.03) 0%, transparent 60%)'
          }}
        />
        {/* Subtle grid texture */}
        <div 
          className="absolute inset-0 opacity-100"
          style={{
            backgroundImage: 'linear-gradient(rgba(10,25,47,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(10,25,47,0.03) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      {/* Main Container */}
      <div className="max-w-[1200px] mx-auto px-6 w-full relative z-10 flex flex-col items-center justify-center text-center">
        
        {/* Subheadline & Social Proof (Trust Badge) */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center gap-3 mb-8"
        >
          <div className="flex items-center gap-3 bg-white/80 backdrop-blur-md px-6 py-3 rounded-full border border-slate-200 shadow-sm">
            <div className="flex -space-x-2 mr-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center overflow-hidden shadow-sm">
                  <User className="w-4 h-4 text-slate-500" />
                </div>
              ))}
            </div>
            
            {/* Live pulse dot */}
            <span className="relative flex h-3 w-3 mr-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF5F15] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#FF5F15]"></span>
            </span>

            <p className="text-sm font-bold text-[#0A192F]">
              10,000+ Engineers Trust Us
            </p>
          </div>
        </motion.div>

        {/* Heading */}
        <div className="flex flex-col items-center justify-center w-full mb-6">
          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-5 flex flex-col"
          >
            <span className="text-[#0A192F]">Build Smarter.</span>
            <span 
              className="text-[#FF5F15]"
            >
              Estimate Faster.
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base md:text-lg text-slate-600 font-medium max-w-2xl px-4 leading-relaxed"
          >
            The all-in-one calculation platform for modern civil engineers, architects, and quantity surveyors. Accurate structural and building estimates in seconds.
          </motion.p>
        </div>

        {/* CTA Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto px-4 mb-12"
        >
          <div className="relative group w-full sm:w-auto">
            {/* Pulsing glow ring */}
            <div className="absolute -inset-1 bg-[#FF5F15] rounded-full blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
            <button
              onClick={onStart}
              className="relative w-full sm:w-auto px-8 py-3.5 rounded-full font-bold text-[15px] text-white bg-[#FF5F15] hover:bg-[#ea580c] transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(255,95,21,0.4)] hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(255,95,21,0.5)] active:scale-95"
            >
              Start Estimating Free
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          <button
            className="w-full sm:w-auto px-8 py-3.5 rounded-full font-bold text-[15px] text-[#0A192F] bg-white hover:bg-slate-50 border border-slate-200 transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 shadow-sm hover:-translate-y-0.5 hover:shadow-md"
          >
            <Play className="w-4 h-4 fill-current text-[#0A192F]" />
            Watch Demo
          </button>
        </motion.div>

        {/* 4 Stat Counters (Glassmorphism Cards) */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + (idx * 0.1) }}
              className="relative overflow-hidden flex flex-col items-center justify-center p-6 bg-white/60 backdrop-blur-xl border border-slate-200/80 text-center shadow-sm transform hover:-translate-y-1 hover:border-slate-300 hover:shadow-md transition-all duration-300 group rounded-3xl"
            >
              {/* Subtle top glow inside card */}
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="w-12 h-12 rounded-2xl bg-[#0A192F]/5 text-[#0A192F] flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-[#FF5F15]/10 group-hover:text-[#FF5F15] transition-all duration-300">
                <stat.icon className="w-6 h-6" />
              </div>
              
              <h3 className="text-2xl font-[800] text-[#0A192F] mb-1 leading-none relative z-10 group-hover:text-[#FF5F15] transition-colors duration-300">{stat.val}</h3>
              <p className="text-[11px] font-bold text-slate-500 tracking-wide uppercase mb-1.5 relative z-10">{stat.lab}</p>
              <p className="text-[11px] text-slate-400 relative z-10 hidden sm:block">{stat.sub}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
