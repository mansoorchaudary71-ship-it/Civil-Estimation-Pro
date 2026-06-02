import React from 'react';
import { ArrowRight, Play, User, Building, ShieldCheck, Globe, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export default function HeroSection({ onStart }: { onStart: () => void }) {
  const stats = [
    { val: '30+', lab: 'Professional Tools', icon: Building },
    { val: '100%', lab: 'Free Forever', icon: ShieldCheck },
    { val: '15+', lab: 'Countries Trusted', icon: Globe },
    { val: 'AI', lab: 'Powered Estimates', icon: Sparkles }
  ];

  return (
    <div className="relative w-full bg-[#0B1120] min-h-[90vh] flex flex-col justify-center overflow-hidden pt-32 pb-24">
      {/* Background with floating particle dots */}
      <div 
        className="absolute inset-0 z-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at center, #F59E0B 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />

      {/* Animated Mesh Gradient Blob (Amber/Violet) */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
          rotate: [0, 90, 180, 270, 360]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#F59E0B] to-violet-600 rounded-full blur-[120px] opacity-40 z-0 pointer-events-none"
      />

      {/* Main Container */}
      <div className="max-w-[1200px] mx-auto px-6 w-full relative z-10 flex flex-col items-center justify-center text-center">
        
        {/* Subheadline & Social Proof (Avatar Stack) */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center gap-3 mb-8"
        >
          <div className="flex items-center gap-3 bg-[rgba(255,255,255,0.05)] backdrop-blur-md px-5 py-2.5 rounded-full border border-[rgba(245,158,11,0.3)] shadow-[0_0_15px_rgba(245,158,11,0.1)]">
            <div className="flex -space-x-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-[#F59E0B] bg-slate-800 flex items-center justify-center overflow-hidden shadow-sm">
                  <User className="w-4 h-4 text-[#F59E0B]" />
                </div>
              ))}
            </div>
            <p className="text-sm font-semibold text-white">
              10,000+ Engineers Trust Us
            </p>
          </div>
        </motion.div>

        {/* Heading */}
        <div className="flex flex-col items-center justify-center w-full mb-10">
          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="text-6xl sm:text-7xl md:text-[6rem] lg:text-[7.5rem] tracking-tight leading-[1] mb-6 drop-shadow-2xl flex flex-col"
            style={{ fontFamily: "'Bebas Neue', display, sans-serif" }}
          >
            <span className="text-white">Build Smarter.</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F59E0B] to-orange-500">Estimate Faster.</span>
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
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto px-4 mb-20"
        >
          <div className="relative group w-full sm:w-auto">
            {/* Pulsing glow ring */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[#F59E0B] to-orange-500 rounded-full blur opacity-40 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
            <button
              onClick={onStart}
              className="relative w-full sm:w-auto px-10 py-4 rounded-full font-bold text-white bg-gradient-to-r from-[#F59E0B] to-orange-600 hover:from-orange-500 hover:to-[#F59E0B] transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95"
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
              className="relative overflow-hidden flex flex-col items-center justify-center p-5 rounded-xl bg-[rgba(255,255,255,0.08)] backdrop-blur-xl border border-[rgba(255,255,255,0.15)] text-center shadow-[0_0_20px_rgba(245,158,11,0.15)]"
              style={{ borderRadius: '12px' }}
            >
              <stat.icon className="w-8 h-8 text-[#F59E0B] mb-3" />
              <h3 className="text-[2.5rem] font-[800] text-[#F59E0B] mb-1 leading-none">{stat.val}</h3>
              <p className="text-[0.75rem] text-[rgba(255,255,255,0.7)] tracking-[0.1em] uppercase">{stat.lab}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
