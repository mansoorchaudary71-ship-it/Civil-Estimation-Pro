import React from "react";
import { ArrowRight, CheckCircle2, User, Sparkles, Building, Globe, ShieldCheck } from "lucide-react";

export default function PremiumHero() {
  return (
    <div className="w-full bg-slate-50 pt-16 pb-12 px-6 lg:px-12 flex flex-col items-center">
      {/* --- HERO SECTION --- */}
      <div className="w-full max-w-[1200px] mx-auto text-center flex flex-col items-center justify-center">
        
        {/* Headline */}
        <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight text-slate-900 tracking-tight leading-[1.1] mb-6">
          Free Civil Engineering <br className="hidden md:block" />
          <span className="text-purple-600">Estimation</span> Platform
        </h1>

        {/* Subheadline & Social Proof */}
        <div className="flex flex-col items-center justify-center gap-4 mb-10">
          <p className="text-lg md:text-xl text-slate-600 font-medium max-w-2xl text-center">
            The ultimate suite of construction calculators. Generate pixel-perfect BOQs, takeoff sheets, and material estimates instantly.
          </p>
          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm mt-2">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center overflow-hidden">
                  <User className="w-4 h-4 text-slate-400" />
                </div>
              ))}
            </div>
            <p className="text-sm font-semibold text-slate-700">
              10,000+ Engineers Trust Us
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <button className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-full shadow-md transition-all active:scale-95">
            Start Estimating for Free
            <ArrowRight className="w-4 h-4" />
          </button>
          <button className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 bg-transparent border border-transparent hover:bg-slate-100 text-slate-700 font-bold rounded-full transition-all active:scale-95">
            View All Tools &gt;
          </button>
        </div>
      </div>

      {/* --- TRUST BADGES & STATS (4-COLUMN GRID) --- */}
      <div className="w-full max-w-[1200px] mx-auto mt-20 grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { val: "40+", lab: "Professional Tools", icon: Building },
          { val: "100%", lab: "Free Forever", icon: ShieldCheck },
          { val: "15+", lab: "Countries Trusted", icon: Globe },
          { val: "AI", lab: "Powered Estimates", icon: Sparkles }
        ].map((stat, i) => (
          <div key={i} className="flex flex-col items-center p-6 bg-white rounded-2xl border border-slate-200 shadow-sm text-center">
            <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center mb-4 text-purple-600">
              <stat.icon className="w-6 h-6" />
            </div>
            <h3 className="text-3xl font-semibold tabular-nums tracking-tight text-slate-900 mb-1">{stat.val}</h3>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">{stat.lab}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
