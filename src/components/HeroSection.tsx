import React from 'react';
import { ArrowRight, Play, Star, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function HeroSection({ onStart }: { onStart: () => void }) {
  return (
    <div className="relative w-full bg-white overflow-hidden pt-24 md:pt-32 pb-16 flex flex-col items-center font-sans">
      {/* Background Mesh Gradient */}
      <div className="absolute top-0 left-0 right-0 h-[75%] z-0 pointer-events-none hero-mesh-gradient">
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 w-full relative z-10 flex flex-col items-center justify-center text-center">
        
        {/* Top Typography Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200 shadow-sm mb-8">
            <span className="px-2 py-0.5 rounded-full bg-[#FF5F15]/10 text-[#FF5F15] text-base font-medium uppercase tracking-wider">
              New
            </span>
            <span className="text-sm font-medium text-slate-700 pr-2">
              AI-Powered Estimations
            </span>
          </div>

          {/* Headline */}
          <h1 className="sm: md:text-7xl leading-[1.1] mb-6 text-xl font-semibold text-slate-800 tracking-tight">
            Build Smarter. <br className="hidden sm:block" />
            <span className="text-[#FF5F15]">Estimate Faster.</span>
          </h1>

          {/* Subheadline */}
          <p className="md: max-w-2xl px-4 mb-10 text-base font-normal text-slate-600 leading-relaxed">
            The all-in-one calculation platform for modern civil engineers, architects, and quantity surveyors. Accurate structural and building estimates in seconds.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto px-4 mb-16">
            <button
              onClick={onStart}
              className="w-full sm:w-auto px-8 py-4 rounded-full text-white bg-[#FF5F15] hover:bg-[#ea580c] transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(255,95,21,0.3)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(255,95,21,0.4)] active:scale-95 text-base font-semibold"
            >
              Start Estimating Free
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              className="w-full sm:w-auto px-8 py-4 rounded-full text-slate-700 bg-white/90 backdrop-blur-sm hover:bg-gray-50 border border-gray-200 transition-all duration-300 flex items-center justify-center gap-2 shadow-sm hover:-translate-y-0.5 hover:shadow active:scale-95 text-base font-semibold"
            >
              <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                <Play className="w-3 h-3 fill-current text-slate-700" />
              </div>
              Watch Demo
            </button>
          </div>
        </motion.div>

        {/* Central Visual & Floating Cards */}
        <div className="relative w-full max-w-5xl mx-auto mt-4 mb-20 flex flex-col lg:block items-center">
          
          {/* Main Visual: CSS Tablet/Laptop Mockup */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative z-10 w-full max-w-3xl mx-auto scale-[0.85] sm:scale-100 origin-top mb-[-10%] sm:mb-0"
          >
            {/* Tablet Frame */}
            <div className="relative bg-gray-900 rounded-[2rem] sm:rounded-[3rem] p-3 sm:p-4 shadow-2xl shadow-gray-200/50 border border-gray-800 ring-1 ring-white/10 mx-2 sm:mx-0">
              {/* Screen Content */}
              <div className="relative rounded-[1.5rem] sm:rounded-[2.25rem] overflow-hidden bg-gray-50 aspect-[16/10] border border-gray-700/50 flex flex-col">
                {/* Mock UI Header */}
                <div className="h-10 sm:h-14 border-b border-gray-200 bg-white flex items-center px-4 sm:px-6 gap-4">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-gray-200"></div>
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-gray-200"></div>
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-gray-200"></div>
                  </div>
                  <div className="h-4 w-32 bg-gray-100 rounded-full mx-auto"></div>
                </div>
                {/* Mock UI Body */}
                <div className="flex-1 p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 bg-gray-50/50">
                  {/* Sidebar */}
                  <div className="hidden sm:flex w-48 flex-col gap-3">
                    <div className="h-6 w-full bg-white rounded-md border border-gray-200"></div>
                    <div className="h-6 w-3/4 bg-gray-200/50 rounded-md"></div>
                    <div className="h-6 w-5/6 bg-gray-200/50 rounded-md"></div>
                    <div className="h-6 w-full bg-gray-200/50 rounded-md"></div>
                  </div>
                  {/* Main Content Area */}
                  <div className="flex-1 flex flex-col gap-4">
                    {/* Chart Area */}
                    <div className="flex gap-4 h-32 sm:h-40">
                      <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex flex-col gap-3">
                        <div className="h-4 w-24 bg-gray-100 rounded-full"></div>
                        <div className="flex-1 flex items-end gap-2 px-2">
                          {[40, 70, 45, 90, 60, 85].map((h, i) => (
                            <div key={i} className="flex-1 bg-indigo-100 rounded-t-sm" style={{ height: `${h}%` }}>
                              <div className="w-full bg-indigo-500 rounded-t-sm" style={{ height: `${h * 0.6}%` }}></div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="hidden sm:flex w-32 bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex-col gap-3 justify-center items-center">
                         <div className="w-16 h-16 rounded-full border-4 border-orange-100 border-t-orange-500"></div>
                         <div className="h-3 w-16 bg-gray-100 rounded-full"></div>
                      </div>
                    </div>
                    {/* Data Table */}
                    <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex flex-col gap-3">
                      <div className="h-4 w-32 bg-gray-100 rounded-full mb-2"></div>
                      {[1, 2, 3].map(i => (
                        <div key={i} className="flex justify-between items-center border-b border-gray-50 pb-2">
                          <div className="h-3 w-1/3 bg-gray-100 rounded-full"></div>
                          <div className="h-3 w-16 bg-gray-100 rounded-full"></div>
                          <div className="h-3 w-12 bg-emerald-100 rounded-full"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Soft Shadow under tablet */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-12 bg-gray-900/10 blur-xl rounded-[100%]"></div>
          </motion.div>

          {/* Left Floating Card: 30+ Tools */}
          <motion.div 
            initial={{ opacity: 0, x: -30, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="lg:absolute left-0 top-[20%] z-20 mt-6 lg:mt-0 lg:-ml-12 w-full max-w-[300px] lg:max-w-[280px] bg-white/90 backdrop-blur-xl border border-gray-100 shadow-2xl shadow-gray-200/50 hover:shadow-[0_12px_40px_rgba(59,130,246,0.15)] hover:-translate-y-1 hover:scale-105 transition-all duration-300 cursor-default rounded-3xl lg:rounded-[2rem] p-4 sm:p-5 flex flex-col text-left"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="leading-tight text-lg font-medium text-slate-800 mb-4">30+ Professional Tools</h4>
                <p className=" text-base font-normal text-slate-600 leading-relaxed">Verified to global standards</p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="flex -space-x-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-7 h-7 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <span className="text-base font-medium">10k+ Trust Us</span>
            </div>
          </motion.div>

          {/* Right Floating Card: 5-Star Review */}
          <motion.div 
            initial={{ opacity: 0, x: 30, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="lg:absolute right-0 top-[40%] z-20 mt-4 lg:mt-0 lg:-mr-12 w-full max-w-[300px] bg-white/90 backdrop-blur-xl border border-gray-100 shadow-2xl shadow-gray-200/50 hover:shadow-[0_12px_40px_rgba(255,95,21,0.15)] hover:-translate-y-1 hover:scale-105 transition-all duration-300 cursor-default rounded-3xl lg:rounded-[2rem] p-4 sm:p-5 flex flex-col text-left"
          >
            <div className="flex gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-[#FF5F15] text-[#FF5F15]" />
              ))}
            </div>
            <p className="mb-4 text-base font-normal text-slate-600 leading-relaxed">
              "Zero calculation errors and saves hours of manual Excel entries."
            </p>
            <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
              <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                <img src="https://i.pravatar.cc/100?img=33" alt="Michael R." className="w-full h-full object-cover" />
              </div>
              <div>
                <p className=" text-base font-normal text-slate-600 leading-relaxed">Michael R.</p>
                <p className=" text-base font-normal text-slate-600 leading-relaxed">Civil Engineer</p>
              </div>
            </div>
          </motion.div>

        </div>

        {/* Bottom Footer (Logo Cloud) */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="w-full max-w-4xl mx-auto mt-12 pt-8 border-t border-gray-200/60"
        >
          <p className="mb-6 text-base font-normal text-slate-600 leading-relaxed">Trusted by global practitioners and firms</p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Placeholder Logos */}
            <div className="text-xl font-bold tracking-tighter text-slate-800 flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-gray-800"></div> BuildCorp
            </div>
            <div className="text-xl font-black tracking-widest text-slate-800 flex items-center gap-1">
              <div className="w-4 h-6 bg-gray-800 -skew-x-12"></div>
              <div className="w-4 h-6 bg-gray-800 -skew-x-12"></div>
              NEXUS
            </div>
            <div className="text-xl font-bold font-serif italic text-slate-800 flex items-center gap-2">
              <div className="w-6 h-6 rounded-full border-4 border-gray-800"></div> Architechs
            </div>
            <div className="text-xl font-extrabold uppercase text-slate-800 flex items-center gap-1">
              <div className="w-3 h-6 bg-gray-800"></div>
              <div className="w-3 h-6 bg-gray-800"></div>
              <div className="w-3 h-6 bg-gray-800"></div>
              STRUCT
            </div>
          </div>
        </motion.div>
        
      </div>
    </div>
  );
}

