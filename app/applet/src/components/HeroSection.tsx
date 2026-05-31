import React, { useRef } from 'react';
import { Play, ArrowRight, Calculator, Box, Layers, BarChart, Settings, Home } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';

export default function HeroSection({ onStart }: { onStart: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const mockupY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <div 
      ref={containerRef}
      className="w-full relative overflow-hidden bg-[#060B14] rounded-b-[2.5rem] mb-16 pt-32 pb-48 px-4 lg:px-12 mt-0 z-10"
      style={{ perspective: '1200px' }}
    >
      {/* High-resolution subtle animated background / Deep gradient mesh Parallax */}
      <motion.div 
        className="absolute inset-0 z-0 overflow-hidden rounded-b-[2.5rem]"
        style={{ y: backgroundY }}
      >
        <div className="absolute inset-0 bg-[#060B14]"></div>
        
        {/* Deep architectural slate/navy with electric cyan/blue accents */}
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[#00E5FF]/20 blur-[140px] pointer-events-none mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#0077FF]/20 blur-[140px] pointer-events-none mix-blend-screen animate-pulse" style={{ animationDuration: '10s', animationDirection: 'reverse' }}></div>
        
        {/* Subtle grid pattern */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        ></div>
      </motion.div>

      <div className="relative z-10 max-w-6xl mx-auto flex flex-col items-center justify-center pt-8">
        {/* Main Headline */}
        <div className="text-center w-full max-w-4xl mx-auto flex flex-col items-center mb-16">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8 px-4 py-1.5 rounded-full bg-[rgba(0,229,255,0.1)] border border-[rgba(0,229,255,0.2)] text-[#00E5FF] text-[11px] font-bold tracking-[0.2em] uppercase flex items-center gap-2 backdrop-blur-md shadow-[0_0_15px_rgba(0,229,255,0.2)]"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00E5FF] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00E5FF]"></span>
            </span>
            Civil Estimation Pro 8.0
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-[6rem] font-extrabold tracking-tighter text-white leading-[1.05] mb-8"
          >
            Estimation. <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#0077FF]">Evolved.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-[rgba(255,255,255,0.6)] font-medium mb-12 max-w-2xl px-4 leading-relaxed"
          >
            The premium all-in-one platform for modern civil engineers. High-precision calculations, automated BOQs, and beautifully crafted architectural insights.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-5 w-full sm:w-auto px-4 relative z-20"
          >
            <button
              onClick={onStart}
              className="w-full sm:w-auto px-10 py-4 rounded-full font-bold text-black bg-gradient-to-r from-[#00E5FF] to-[#0077FF] hover:from-[#40eefc] hover:to-[#1a85fe] shadow-[0_4px_24px_rgba(0,229,255,0.4)] transition-all transform hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,229,255,0.6)] flex items-center justify-center gap-2"
            >
              Start Designing
              <ArrowRight className="w-5 h-5 text-black/90" />
            </button>
            <button
              className="w-full sm:w-auto px-10 py-4 rounded-full font-bold text-white bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] backdrop-blur-md border border-[rgba(255,255,255,0.1)] transition-all shadow-sm hover:shadow text-base flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-white text-white" />
              Watch Demo
            </button>
          </motion.div>
        </div>

        {/* Floating 3D Mockup */}
        <motion.div 
          className="relative w-full max-w-[1000px] mt-8 pointer-events-none"
          style={{ y: mockupY }}
        >
          {/* Continuous Levitation Animation */}
          <motion.div
            animate={{ y: [-15, 15, -15] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            className="relative w-full"
            style={{
              transformStyle: 'preserve-3d',
              transform: 'perspective(1200px) rotateX(12deg) rotateY(0deg) rotateZ(0deg)',
            }}
          >
            {/* The Mockup Interface */}
            <div className="w-full aspect-[16/9] rounded-[24px] bg-[rgba(10,15,30,0.8)] backdrop-blur-2xl border border-[rgba(255,255,255,0.1)] shadow-[0_30px_60px_-12px_rgba(0,229,255,0.15)] overflow-hidden flex flex-col">
              {/* Header */}
              <div className="h-14 border-b border-[rgba(255,255,255,0.08)] flex items-center px-6 gap-4">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                </div>
                <div className="flex-1"></div>
                <div className="w-64 h-8 rounded-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)] hidden md:block"></div>
              </div>
              
              {/* Body */}
              <div className="flex-1 flex p-6 gap-6 relative">
                {/* Sidebar */}
                <div className="w-48 hidden md:flex flex-col gap-4">
                  <div className="h-8 w-24 bg-[rgba(255,255,255,0.05)] rounded mb-4"></div>
                  {[Home, Calculator, Box, Layers, BarChart, Settings].map((Icon, i) => (
                    <div key={i} className="flex items-center gap-3 opacity-50">
                      <Icon className="w-5 h-5 text-white" />
                      <div className="h-4 w-20 bg-[rgba(255,255,255,0.05)] rounded"></div>
                    </div>
                  ))}
                </div>

                {/* Dashboard Main */}
                <div className="flex-1 flex flex-col gap-6">
                  {/* Top Stats */}
                  <div className="flex gap-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-28 flex-1 rounded-[16px] bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.06)] p-4 flex flex-col justify-between backdrop-blur-lg">
                         <div className="h-6 w-8 bg-[rgba(0,229,255,0.2)] rounded-md"></div>
                         <div className="h-8 w-24 bg-[rgba(255,255,255,0.1)] rounded-md"></div>
                      </div>
                    ))}
                  </div>

                  {/* Graph Area */}
                  <div className="flex-1 rounded-[16px] bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.06)] p-5 relative overflow-hidden backdrop-blur-lg">
                     <div className="absolute bottom-0 left-0 w-full h-[60%] bg-gradient-to-t from-[rgba(0,229,255,0.1)] to-transparent pointer-events-none"></div>
                     <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                        <path d="M0,80 Q20,60 40,70 T80,30 T100,50 L100,100 L0,100 Z" fill="rgba(0,229,255,0.1)" stroke="rgba(0,229,255,0.6)" strokeWidth="1.5" />
                     </svg>
                  </div>
                </div>

                {/* Floating Modal Overlay inside the Screen */}
                <div className="absolute bottom-8 right-8 w-64 bg-[rgba(6,11,20,0.85)] backdrop-blur-xl border border-[rgba(0,229,255,0.3)] shadow-[0_10px_30px_rgba(0,229,255,0.15)] rounded-xl p-4 flex flex-col gap-3">
                   <div className="text-white text-xs font-bold uppercase tracking-wider text-[#00E5FF]">Live Calculation</div>
                   <div className="flex justify-between items-center">
                     <span className="text-[rgba(255,255,255,0.6)] text-xs">Total Concrete</span>
                     <span className="text-white font-black">2,410 m³</span>
                   </div>
                   <div className="w-full h-1.5 bg-[rgba(255,255,255,0.1)] rounded-full overflow-hidden mt-1">
                      <div className="h-full bg-[#00E5FF] w-[75%]"></div>
                   </div>
                </div>

              </div>
            </div>

            {/* Dynamic Shadow underneath the levitating mockup */}
            <motion.div 
              animate={{ 
                scale: [0.85, 1, 0.85],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-[#00E5FF] blur-[80px] rounded-full z-[-1] opacity-30 mix-blend-screen"
            ></motion.div>
          </motion.div>
        </motion.div>

      </div>
    </div>
  );
}
