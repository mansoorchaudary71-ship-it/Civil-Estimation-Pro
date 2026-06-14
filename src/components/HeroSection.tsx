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
    <div className="relative w-full bg-[#F8F9FB] min-h-0 md:min-h-[90vh] flex flex-col justify-start md:justify-center overflow-hidden pt-20 md:pt-28 pb-24 hero-section">
      {/* Background Layers */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Soft gradient glow */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 60% 50% at 50% 30%, rgba(168,85,247,0.06), transparent 70%)'
          }}
        />
        {/* Subtle grid texture */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
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
          <div className="flex items-center gap-3 bg-white/80 backdrop-blur-md px-6 py-3 rounded-full border border-purple-100 shadow-[0_4px_20px_rgba(168,85,247,0.1)]">
            <div className="flex -space-x-2 mr-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center overflow-hidden shadow-sm">
                  <User className="w-4 h-4 text-purple-500" />
                </div>
              ))}
            </div>
            
            {/* Live pulse dot */}
            <span className="relative flex h-3 w-3 mr-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span>
            </span>

            <p className="text-sm font-bold text-gray-800">
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
            <span className="text-gray-900 drop-shadow-sm">Build Smarter.</span>
            <span 
              className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500"
            >
              Estimate Faster.
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-600 font-medium max-w-2xl px-4 leading-relaxed"
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
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <button
              onClick={onStart}
              className="relative w-full sm:w-auto px-10 py-4 rounded-full font-bold text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-300 flex items-center justify-center gap-3 shadow-[0_8px_25px_rgba(168,85,247,0.3)] hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(168,85,247,0.4)] active:scale-95"
            >
              Start Estimating Free
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
          
          <button
            className="w-full sm:w-auto px-10 py-4 rounded-full font-bold text-gray-800 bg-white hover:bg-gray-50 border border-gray-200 transition-all duration-300 flex items-center justify-center gap-3 active:scale-95 shadow-[0_4px_15px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_25px_rgba(0,0,0,0.06)] hover:-translate-y-1"
          >
            <Play className="w-4 h-4 fill-current text-purple-500" />
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
              className="relative overflow-hidden flex flex-col items-center justify-center p-8 bg-white border border-gray-100 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] transform hover:-translate-y-1 hover:shadow-[0_15px_40px_rgb(0,0,0,0.08)] transition-all duration-300 group rounded-3xl"
            >
              {/* Subtle top glow inside card */}
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-purple-50/50 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-purple-100 transition-all duration-300">
                <stat.icon className="w-7 h-7" />
              </div>
              
              <h3 className="text-3xl font-[800] text-gray-900 mb-1 leading-none relative z-10 group-hover:text-purple-600 transition-colors duration-300">{stat.val}</h3>
              <p className="text-[0.8rem] font-bold text-gray-600 tracking-wide uppercase mb-2 relative z-10">{stat.lab}</p>
              <p className="text-[0.75rem] text-gray-500 relative z-10">{stat.sub}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
