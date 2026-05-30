import React from 'react';
import { Play, ArrowRight, CheckCircle, Calculator, Box, Truck, TrendingUp, Layers } from 'lucide-react';
import { motion } from 'motion/react';
import CountUp from 'react-countup';

export default function HeroSection({ onStart }: { onStart: () => void }) {
  return (
    <div className="w-full relative overflow-hidden bg-slate-50 rounded-b-[2.5rem] mb-16 pt-24 pb-32 px-4 lg:px-12 mt-0 z-10">
      
      {/* Background patterns and glowing orbs to match UI */}
      <div className="absolute inset-0 z-0 overflow-hidden rounded-b-[2.5rem]">
        <div className="absolute -top-[30%] -right-[10%] w-[70%] h-[70%] rounded-full bg-indigo-500/10 blur-[120px] mix-blend-multiply pointer-events-none"></div>
        <div className="absolute -bottom-[30%] -left-[10%] w-[60%] h-[60%] rounded-full bg-amber-500/10 blur-[120px] mix-blend-multiply pointer-events-none"></div>
        
        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.4] mix-blend-multiply" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto flex justify-center items-center py-10 lg:py-16">
        
        {/* Centered Content */}
        <div className="flex flex-col items-center justify-center text-center w-full max-w-3xl mx-auto relative z-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-100 bg-indigo-50/80 backdrop-blur-sm text-sm font-bold text-indigo-600 tracking-wide uppercase mb-10 shadow-sm"
          >
            <span className="relative flex h-2.5 w-2.5 mr-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500"></span>
            </span>
            Next-Gen Estimation AI
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-extrabold tracking-tighter text-slate-900 leading-[1.05] mb-8"
          >
            Estimate <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">Smarter.</span><br/>
            Build <span className="text-[#F59E0B]">Faster.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-600 font-medium mb-12 max-w-2xl px-4 leading-relaxed"
          >
            The all-in-one calculation platform for modern civil engineers, architects, and quantity surveyors. Accurate structural and building estimates in seconds.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-5 w-full sm:w-auto px-4"
          >
            <button
              onClick={onStart}
              className="w-full sm:w-auto px-10 py-4 rounded-full font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-[0_8px_30px_rgba(79,70,229,0.3)] transition-all transform hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(79,70,229,0.4)] flex items-center justify-center gap-2"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5 text-white/90" />
            </button>
            <button
              className="w-full sm:w-auto px-10 py-4 rounded-full font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition-all shadow-sm hover:shadow text-base flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-slate-700 text-slate-700" />
              Watch Demo
            </button>
          </motion.div>
        </div>

        {/* Floating Background Cards */}
        {/* Card 1 - Top Left */}
        <motion.div 
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
          className="hidden xl:flex absolute top-[5%] left-[2%] 2xl:left-[8%] w-64 bg-white/90 backdrop-blur-xl rounded-[24px] shadow-[0_20px_40px_rgba(0,0,0,0.06)] border border-slate-100 p-5 flex-col gap-3 z-0 pointer-events-none"
          style={{ transform: 'rotate(-6deg) translateZ(0)' }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Concrete Slab</div>
              <div className="text-base font-black text-slate-800">45.2 m³</div>
            </div>
          </div>
          <div className="w-full h-8 bg-slate-50 rounded-xl border border-slate-100 overflow-hidden relative">
            <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-indigo-500 w-[70%]"></div>
          </div>
        </motion.div>

        {/* Card 2 - Bottom Left */}
        <motion.div 
          animate={{ y: [0, 15, 0] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 1 }}
          className="hidden lg:flex absolute bottom-[10%] left-[0%] lg:left-[5%] xl:left-[12%] w-72 bg-white/95 backdrop-blur-xl rounded-[28px] shadow-[0_30px_60px_rgba(0,0,0,0.08)] border border-slate-100 p-6 flex-col gap-4 z-30 pointer-events-none"
          style={{ transform: 'rotate(8deg) translateZ(0)' }}
        >
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-[20px] bg-amber-50 flex items-center justify-center text-amber-500 shadow-sm border border-amber-100/50">
                <Truck className="w-7 h-7" />
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-tight">Logistics</div>
                <div className="text-lg font-black text-slate-800 leading-tight mt-0.5">1,240 Bags</div>
              </div>
            </div>
            <div className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100/50 text-[11px] font-bold flex items-center gap-1 shadow-sm">
              <TrendingUp className="w-3 h-3" />
              +5%
            </div>
          </div>
          <div className="flex gap-2 w-full mt-2">
            <div className="flex-1 h-2.5 rounded-full bg-amber-400"></div>
            <div className="flex-1 h-2.5 rounded-full bg-amber-200"></div>
            <div className="flex-1 h-2.5 rounded-full bg-slate-100"></div>
          </div>
        </motion.div>

        {/* Card 3 - Top Right */}
        <motion.div 
          animate={{ y: [0, -12, 0] }}
          transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 0.5 }}
          className="hidden lg:flex absolute top-[8%] right-[2%] xl:right-[6%] w-[260px] bg-white/90 backdrop-blur-xl rounded-[24px] shadow-[0_20px_40px_rgba(0,0,0,0.06)] border border-slate-100 p-6 flex-col z-0 pointer-events-none"
          style={{ transform: 'rotate(5deg) translateZ(0)' }}
        >
          <div className="flex justify-between items-center mb-5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500 border border-indigo-100/50">
              <Calculator className="w-5 h-5" />
            </div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Steel Wt.</div>
          </div>
          <div className="text-4xl font-black text-slate-900 tracking-tighter leading-none">
            <CountUp start={0} end={8450} duration={2.5} separator="," />
          </div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">Kilograms</div>
        </motion.div>

        {/* Card 4 - Bottom Right */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 5.5, ease: "easeInOut", delay: 1.5 }}
          className="hidden md:flex absolute bottom-[12%] right-[0%] lg:right-[8%] w-[280px] bg-white/95 backdrop-blur-xl rounded-[28px] shadow-[0_25px_50px_rgba(0,0,0,0.08)] border border-slate-100 p-6 z-30 pointer-events-none"
          style={{ transform: 'rotate(-5deg) translateZ(0)' }}
        >
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-purple-50 text-purple-600 border border-purple-100/50">
                <Box className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="h-2.5 w-1/2 bg-slate-200 rounded-full mb-3"></div>
                <div className="h-2.5 w-3/4 bg-slate-100 rounded-full"></div>
              </div>
            </div>
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Cost Est.</span>
              <span className="text-base font-black text-slate-800">
                $<CountUp start={0} end={14500} duration={2.5} separator="," />
              </span>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
