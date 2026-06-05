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
    <div className="relative w-full bg-[#0A0F1E] min-h-[90vh] flex flex-col justify-center overflow-hidden pt-16 md:pt-24 pb-24">
      {/* Background Layers */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Radial amber glow */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 80% 50% at 50% 40%, rgba(245,158,11,0.08), transparent 70%)'
          }}
        />
        {/* Grid texture */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
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
          className="flex flex-col items-center gap-3 mb-6"
        >
          <div className="flex items-center gap-3 bg-[rgba(255,255,255,0.05)] backdrop-blur-md px-5 py-2.5 rounded-full border border-[rgba(245,158,11,0.4)] shadow-[0_4px_20px_rgba(245,158,11,0.15)]">
            <div className="flex -space-x-2 mr-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-[#0A0F1E] bg-slate-800 flex items-center justify-center overflow-hidden shadow-sm">
                  <User className="w-4 h-4 text-[#F59E0B]" />
                </div>
              ))}
            </div>
            
            {/* Live pulse dot */}
            <span className="relative flex h-3 w-3 mr-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F59E0B] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#F59E0B]"></span>
            </span>

            <p className="text-sm font-bold text-white">
              10,000+ Engineers Trust Us
            </p>
          </div>
        </motion.div>

        {/* Heading */}
        <div className="flex flex-col items-center justify-center w-full mb-8">
          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="text-6xl sm:text-7xl md:text-[6rem] lg:text-[7.5rem] tracking-tight leading-[0.9] mb-6 flex flex-col"
            style={{ fontFamily: "'Bebas Neue', display, sans-serif" }}
          >
            <span className="text-white drop-shadow-2xl">Build Smarter.</span>
            <span 
              className="text-[#F59E0B]"
              style={{ textShadow: '0 0 40px rgba(245,158,11,0.5)' }}
            >
              Estimate Faster.
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-300 font-medium max-w-2xl px-4 leading-relaxed"
          >
            The all-in-one calculation platform for modern civil engineers, architects, and quantity surveyors. Accurate structural and building estimates in seconds.
          </motion.p>
        </div>

        {/* CTA Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto px-4 mb-16"
        >
          <div className="relative group w-full sm:w-auto">
            {/* Pulsing glow ring */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[#F59E0B] to-amber-500 rounded-full blur opacity-40 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
            <button
              onClick={onStart}
              className="relative w-full sm:w-auto px-10 py-4 rounded-full font-bold text-[#0A0F1E] bg-gradient-to-r from-[#F59E0B] to-amber-400 hover:from-amber-400 hover:to-[#F59E0B] transition-all flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(245,158,11,0.3)] active:scale-95"
            >
              Start Estimating Free
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
          
          <button
            className="w-full sm:w-auto px-10 py-4 rounded-full font-bold text-white bg-transparent hover:bg-white/10 border border-white/20 transition-all flex items-center justify-center gap-3 active:scale-95 shadow-sm"
          >
            <Play className="w-4 h-4 fill-current text-white" />
            Watch Demo
          </button>
        </motion.div>

        {/* 4 Stat Counters (Glassmorphism Cards) */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + (idx * 0.1) }}
              className="relative overflow-hidden flex flex-col items-center justify-center p-6 rounded-xl bg-[#0A0F1E]/80 backdrop-blur-xl border border-[rgba(255,255,255,0.1)] border-t-[#F59E0B]/50 hover:border-t-[#F59E0B] text-center shadow-[0_8px_32px_rgba(0,0,0,0.5)] transform hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(245,158,11,0.15)] transition-all duration-300 group"
              style={{ borderRadius: '12px' }}
            >
              {/* Subtle top glow inside card */}
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-[rgba(245,158,11,0.05)] to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <stat.icon className="w-8 h-8 text-[#F59E0B] mb-3 relative z-10 group-hover:scale-110 transition-transform duration-300" />
              <h3 className="text-[2.5rem] font-[800] text-white mb-1 leading-none relative z-10 group-hover:text-[#F59E0B] transition-colors duration-300">{stat.val}</h3>
              <p className="text-[0.8rem] font-medium text-slate-300 tracking-wide uppercase mb-2 relative z-10">{stat.lab}</p>
              <p className="text-[0.7rem] text-slate-500 relative z-10">{stat.sub}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
