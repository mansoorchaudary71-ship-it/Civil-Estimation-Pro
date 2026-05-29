import React, { useEffect, useState } from "react";
import {
  Play,
  Star,
  CheckCircle,
  Calculator,
  Box,
  Compass,
  Truck,
} from "lucide-react";
import { motion } from "motion/react";

export default function HeroSection({ onStart }: { onStart: () => void }) {
  const [engineersCount, setEngineersCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number;
    const duration = 2000;
    const target = 24000;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setEngineersCount(Math.floor(easeProgress * target));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, []);

  return (
    <div className="w-full relative overflow-hidden bg-[#0A0F1E] rounded-[2.5rem] mb-16 pt-16 pb-20 px-6 lg:px-12 mt-8 shadow-2xl border border-slate-800">
      <div className="absolute inset-0 z-0 overflow-hidden rounded-[2.5rem]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A0F1E] via-[#0A0F1E] to-[#141b2d] z-0"></div>
        {/* Ambient Glows */}
        <div className="absolute -top-[30%] -right-[10%] w-[70%] h-[70%] rounded-full bg-indigo-500/10 blur-[120px] mix-blend-screen pointer-events-none"></div>
        <div className="absolute -bottom-[30%] -left-[10%] w-[60%] h-[60%] rounded-full bg-amber-500/10 blur-[120px] mix-blend-screen pointer-events-none"></div>

        {/* Animated blueprint grid */}
        <div
          className="absolute inset-0 opacity-[0.06] flex"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236366f1' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: "60px 60px",
          }}
        >
          <motion.div
            style={{
              width: "200%",
              height: "200%",
              backgroundImage: "inherit",
              backgroundSize: "inherit",
            }}
            animate={{ x: [0, -60], y: [0, -60] }}
            transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
          ></motion.div>
        </div>
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8 max-w-7xl mx-auto">
        {/* Left Content Column */}
        <div className="flex-1 flex flex-col items-start text-left shrink-0 max-w-2xl w-full">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-bold tracking-widest uppercase mb-6"
            style={{ fontFamily: "Satoshi, sans-serif" }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            Civil Estimation Pro
          </div>

          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] mb-6"
            style={{ fontFamily: '"Clash Display", sans-serif' }}
          >
            Build Anything.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F59E0B] to-[#fbbf24]">
              Estimate Everything.
            </span>
          </h1>

          <p
            className="text-slate-400 text-lg md:text-xl max-w-[600px] mb-8 font-medium leading-relaxed"
            style={{ fontFamily: "Satoshi, sans-serif" }}
          >
            The only platform civil engineers, contractors & architects trust
            for instant, accurate quantity calculations.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-10">
            <button
              onClick={onStart}
              className="btn-micro w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-slate-900 bg-[#F59E0B] hover:bg-[#fbbf24] shadow-[0_0_20px_rgba(245,158,11,0.3)] text-base flex items-center justify-center gap-2 group"
              style={{ fontFamily: "Satoshi, sans-serif" }}
            >
              Start Estimating Free{" "}
              <span className="text-lg leading-none transition-transform group-hover:translate-x-1">
                &rarr;
              </span>
            </button>
            <button
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all text-base flex items-center justify-center gap-2 backdrop-blur-md"
              style={{ fontFamily: "Satoshi, sans-serif" }}
            >
              <Play className="w-4 h-4 fill-white text-white" />
              Watch Demo
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <div className="flex -space-x-3">
              <img
                className="w-10 h-10 rounded-full border-2 border-[#0A0F1E]"
                src="https://i.pravatar.cc/100?img=11"
                alt="User 1"
              />
              <img
                className="w-10 h-10 rounded-full border-2 border-[#0A0F1E]"
                src="https://i.pravatar.cc/100?img=33"
                alt="User 2"
              />
              <img
                className="w-10 h-10 rounded-full border-2 border-[#0A0F1E]"
                src="https://i.pravatar.cc/100?img=12"
                alt="User 3"
              />
              <div className="w-10 h-10 rounded-full border-2 border-[#0A0F1E] bg-slate-800 flex items-center justify-center text-xs font-bold text-white shadow-sm">
                +
              </div>
            </div>
            <div className="flex flex-col items-center sm:items-start">
              <div className="flex gap-1 mb-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]"
                  />
                ))}
              </div>
              <p
                className="text-xs text-slate-400 font-medium"
                style={{ fontFamily: "Satoshi, sans-serif" }}
              >
                Trusted by {engineersCount.toLocaleString()}+ engineers{" "}
                <br className="hidden sm:block" />
                across 15 countries | 2.1M calculations
              </p>
            </div>
          </div>
        </div>

        {/* Right Animated Visual Column */}
        <div className="flex-1 relative w-full h-[350px] lg:h-[450px] flex items-center justify-center perspective-[1000px] mt-10 lg:mt-0">
          {/* Isometric Base */}
          <motion.div
            initial={{ rotateX: 65, rotateZ: -45, y: 50, opacity: 0 }}
            animate={{ rotateX: 65, rotateZ: -45, y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="w-56 h-56 lg:w-72 lg:h-72 bg-slate-800/60 border border-slate-700/50 absolute bottom-12 lg:bottom-10 rounded-xl shadow-[0_0_60px_rgba(245,158,11,0.15)] backdrop-blur-sm"
          >
            {/* Grid on base */}
            <div
              className="absolute inset-0 opacity-20 rounded-xl overflow-hidden"
              style={{
                backgroundImage:
                  "linear-gradient(#F59E0B 1px, transparent 1px), linear-gradient(90deg, #F59E0B 1px, transparent 1px)",
                backgroundSize: "10% 10%",
              }}
            ></div>
          </motion.div>

          {/* Building Tiers */}
          <motion.div
            initial={{ rotateX: 65, rotateZ: -45, z: 0, opacity: 0, y: 0 }}
            animate={{ rotateX: 65, rotateZ: -45, z: 40, opacity: 1, y: -40 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="w-40 h-40 lg:w-48 lg:h-48 bg-slate-700/90 border border-slate-600 absolute bottom-12 lg:bottom-10 rounded-lg shadow-2xl backdrop-blur-md"
          >
            <div
              className="absolute inset-0 opacity-10 rounded-lg overflow-hidden"
              style={{
                backgroundImage:
                  "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
                backgroundSize: "25% 25%",
              }}
            ></div>
          </motion.div>
          <motion.div
            initial={{ rotateX: 65, rotateZ: -45, z: 0, opacity: 0, y: 0 }}
            animate={{ rotateX: 65, rotateZ: -45, z: 80, opacity: 1, y: -80 }}
            transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
            className="w-24 h-24 lg:w-32 lg:h-32 bg-slate-600/95 border border-slate-500 absolute bottom-12 lg:bottom-10 rounded-lg shadow-2xl flex items-center justify-center backdrop-blur-md overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-[#F59E0B]/20 to-transparent" />
            <div
              className="absolute inset-0 opacity-10 rounded-lg overflow-hidden"
              style={{
                backgroundImage:
                  "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
                backgroundSize: "33% 33%",
              }}
            ></div>
          </motion.div>
          <motion.div
            initial={{ rotateX: 65, rotateZ: -45, z: 0, opacity: 0, y: 0 }}
            animate={{ rotateX: 65, rotateZ: -45, z: 120, opacity: 1, y: -120 }}
            transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
            className="w-12 h-12 lg:w-16 lg:h-16 bg-[#F59E0B] border border-amber-400 absolute bottom-12 lg:bottom-10 rounded-lg flex items-center justify-center shadow-[0_0_40px_rgba(245,158,11,0.6)]"
          >
            <Box className="w-6 h-6 lg:w-8 lg:h-8 text-slate-900" />
          </motion.div>

          {/* Floating Calculation Panels */}
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="absolute top-0 right-10 lg:-left-4 text-left bg-[#141b2d]/80 border border-slate-700/80 p-3 rounded-2xl shadow-xl flex items-center gap-3 backdrop-blur-md z-20"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div className="pr-2">
              <div
                className="text-[10px] text-slate-400 font-bold uppercase tracking-wider"
                style={{ fontFamily: "Satoshi, sans-serif" }}
              >
                RCC Slab Vol.
              </div>
              <div
                className="text-sm font-bold text-white leading-tight"
                style={{ fontFamily: "Satoshi, sans-serif" }}
              >
                45.2 m³
              </div>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 20, 0] }}
            transition={{
              repeat: Infinity,
              duration: 5,
              ease: "easeInOut",
              delay: 1,
            }}
            className="absolute top-24 -right-2 lg:-right-6 text-left bg-[#141b2d]/80 border border-slate-700/80 p-3 rounded-2xl shadow-xl flex items-center gap-3 backdrop-blur-md z-20"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-500">
              <Truck className="w-5 h-5" />
            </div>
            <div className="pr-2">
              <div
                className="text-[10px] text-slate-400 font-bold uppercase tracking-wider"
                style={{ fontFamily: "Satoshi, sans-serif" }}
              >
                Cement Bags
              </div>
              <div
                className="text-sm font-bold text-white leading-tight"
                style={{ fontFamily: "Satoshi, sans-serif" }}
              >
                1,240 Units
              </div>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{
              repeat: Infinity,
              duration: 3.5,
              ease: "easeInOut",
              delay: 0.5,
            }}
            className="absolute bottom-6 left-0 lg:left-8 text-left bg-[#141b2d]/80 border border-slate-700/80 p-3 rounded-2xl shadow-xl flex items-center gap-3 backdrop-blur-md z-20"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
              <Calculator className="w-5 h-5" />
            </div>
            <div className="pr-2">
              <div
                className="text-[10px] text-slate-400 font-bold uppercase tracking-wider"
                style={{ fontFamily: "Satoshi, sans-serif" }}
              >
                Steel Wt.
              </div>
              <div
                className="text-sm font-bold text-white leading-tight"
                style={{ fontFamily: "Satoshi, sans-serif" }}
              >
                8,450 kg
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
