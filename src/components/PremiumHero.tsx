import React, { useEffect, useRef, useState } from "react";
import { ArrowRight, LayoutGrid, CheckCircle, Calculator, ClipboardList, Activity, ArrowUpRight } from "lucide-react";

const useIntersectionObserver = (options: IntersectionObserverInit = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [options]);

  return [ref, isIntersecting] as const;
};

const AnimatedCounter = ({ end, duration = 2000, prefix = "", suffix = "", delay = 0, trigger }: { end: number, duration?: number, prefix?: string, suffix?: string, delay?: number, trigger: boolean }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!trigger) return;

    let startTimestamp: number | null = null;
    let timeoutId = setTimeout(() => {
      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic
        setCount(Math.floor(easeProgress * end));
        
        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          setCount(end);
        }
      };
      window.requestAnimationFrame(step);
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [end, duration, trigger, delay]);

  return <span>{prefix}{count.toLocaleString()}{suffix}</span>;
};

export default function PremiumHero() {
  const [heroRef, heroInView] = useIntersectionObserver({ threshold: 0.1 });
  const [workflowRef, workflowInView] = useIntersectionObserver({ threshold: 0.2 });
  const [statsRef, statsInView] = useIntersectionObserver({ threshold: 0.5 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="w-full bg-[#080B14] text-[#F0F4FF] overflow-hidden font-sans relative selection:bg-[#F5A623] selection:text-[#080B14]" style={{ cursor: 'crosshair' }}>
      
      {/* --- CSS Variables & Keyframes --- */}
      <style>{`
        :root {
          --obsidian: #080B14;
          --surface: #0D1220;
          --amber: #F5A623;
          --cyan: #00D4FF;
          --violet: #7B4FFF;
          --text-muted: #6B7A9F;
        }

        .gradient-text-amber-cyan {
          background: linear-gradient(90deg, var(--amber), var(--cyan));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        @keyframes mesh-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes float-gentle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }

        @keyframes orb-drift-1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-30px, 40px) scale(1.1); }
        }

        @keyframes orb-drift-2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(40px, -20px) scale(0.9); }
        }

        @keyframes shimmer-sweep {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }

        @keyframes word-slide-up {
          0% { opacity: 0; transform: translateY(30px); filter: blur(8px); }
          100% { opacity: 1; transform: translateY(0); filter: blur(0); }
        }

        @keyframes line-draw {
          0% { stroke-dashoffset: 1000; }
          100% { stroke-dashoffset: 0; }
        }

        @keyframes chart-bar-grow {
          0% { height: 0%; opacity: 0; }
          100% { opacity: 1; }
        }

        @keyframes underline-draw {
          0% { width: 0%; }
          100% { width: 100%; }
        }

        .mesh-bg {
          background: radial-gradient(circle at top right, rgba(123, 79, 255, 0.15), transparent 40%),
                      radial-gradient(circle at bottom left, rgba(0, 212, 255, 0.1), transparent 40%),
                      radial-gradient(circle at center, rgba(245, 166, 35, 0.1), transparent 50%);
          background-size: 200% 200%;
          animation: mesh-shift 8s ease-in-out infinite;
        }

        .dot-pattern {
          background-image: radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px);
          background-size: 24px 24px;
        }

        .glass-card {
          background: var(--surface);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.04);
        }

        .workflow-card:hover {
          transform: translateY(-8px);
          border-color: rgba(255, 255, 255, 0.2);
        }
        .workflow-card:hover .workflow-icon {
          transform: rotate(360deg);
        }

        .btn-shimmer::after {
          content: '';
          position: absolute;
          top: 0; left: 0; width: 50%; height: 100%;
          background: linear-gradient(to right, transparent, rgba(255,255,255,0.4), transparent);
          transform: skewX(-20deg) translateX(-150%);
          transition: none;
        }
        .btn-shimmer:hover::after {
          animation: shimmer-sweep 0.8s ease-in-out forwards;
        }

        .stagger-1 { animation: word-slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both; }
        .stagger-2 { animation: word-slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both; }
        .stagger-3 { animation: word-slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both; }
        .fade-in-up { animation: word-slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.5s both; }
      `}</style>

      {/* --- Background Elements --- */}
      <div className="absolute inset-0 mesh-bg z-0" />
      <div className="absolute inset-0 dot-pattern opacity-[0.03] z-0" />
      
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-[#F5A623] opacity-[0.04] blur-[100px] z-0" style={{ animation: 'orb-drift-1 12s infinite alternate ease-in-out' }} />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#00D4FF] opacity-[0.04] blur-[120px] z-0" style={{ animation: 'orb-drift-2 15s infinite alternate ease-in-out' }} />

      {/* --- HERO SECTION --- */}
      <div ref={heroRef} className="relative z-10 w-full max-w-[1400px] mx-auto min-h-[90vh] flex flex-col lg:flex-row items-center pt-24 pb-16 px-6 lg:px-12">
        
        {/* Left Column (60%) */}
        <div className="w-full lg:w-[60%] flex flex-col justify-center space-y-8 pr-0 lg:pr-12">
          
          <div className="fade-in-up inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card w-fit border border-[#00D4FF]/20 bg-[#0D1220]/80">
            <span className="w-2 h-2 rounded-full bg-[#00D4FF] animate-pulse shadow-[0_0_8px_#00D4FF]" />
            <span className="text-xs font-semibold uppercase tracking-widest text-[#00D4FF]">AI-Powered · Trusted by 10,000+ Engineers</span>
          </div>

          <h1 className="text-[64px] md:text-[88px] lg:text-[96px] leading-[0.95] font-clash font-bold tracking-tight">
            <span className="block stagger-1">Calculate.</span>
            <span className="block stagger-2">Estimate.</span>
            <span className="block stagger-3 gradient-text-amber-cyan">Dominate.</span>
          </h1>

          <p className="fade-in-up text-lg md:text-xl font-dm text-var(--text-muted) text-[#6B7A9F] max-w-xl leading-relaxed">
            The precision of a lead engineer, the speed of modern AI. Generate pixel-perfect BOQs, takeoff sheets, and material estimates in seconds.
          </p>

          <div className="fade-in-up flex flex-col sm:flex-row items-center gap-4 pt-4">
            <button className="btn-shimmer relative overflow-hidden flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#F5A623] to-[#E58A00] hover:to-[#F5A623] text-[#080B14] font-bold font-dm rounded-full shadow-[0_0_24px_rgba(245,166,35,0.3)] transition-all">
              Start Estimating Free
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 bg-transparent border border-[#00D4FF]/30 hover:border-[#00D4FF] hover:shadow-[0_0_16px_rgba(0,212,255,0.15)] text-[#F0F4FF] font-bold font-dm rounded-full transition-all">
              View All 40+ Tools
              <ArrowUpRight className="w-5 h-5 opacity-70" />
            </button>
          </div>

          <div className="fade-in-up flex items-center gap-4 pt-8">
            <div className="flex -space-x-3">
              {[1,2,3,4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-[#080B14] bg-[#0D1220] flex items-center justify-center overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-800" />
                </div>
              ))}
            </div>
            <p className="text-sm font-dm text-[#6B7A9F]">Join <strong className="text-[#F0F4FF]">10,000+</strong> engineers across <strong className="text-[#F0F4FF]">15+</strong> countries</p>
          </div>

        </div>

        {/* Right Column (40%) */}
        <div className="w-full lg:w-[40%] mt-16 lg:mt-0 perspective-[1000px] fade-in-up" style={{ animationDelay: '0.6s' }}>
          <div className="relative glass-card rounded-2xl p-6 border-[#F5A623]/20 shadow-[0_0_40px_rgba(245,166,35,0.1)] w-full aspect-[4/5] max-h-[600px] flex flex-col transform-gpu rotate-y-[-5deg] rotate-x-[5deg]" style={{ animation: 'float-gentle 4s ease-in-out infinite' }}>
            
            {/* Blueprint Grid Overlay */}
            <div className="absolute inset-0 blueprint-grid opacity-[0.05] pointer-events-none rounded-2xl overflow-hidden" style={{ backgroundImage: 'linear-gradient(#00D4FF 1px, transparent 1px), linear-gradient(90deg, #00D4FF 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

            {/* Mockup Header */}
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/5 relative z-10">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
              </div>
              <span className="text-[10px] font-mono text-[#6B7A9F] bg-white/5 px-2 py-1 rounded">EST-2026-X9</span>
            </div>

            <h3 className="font-dm font-bold text-lg mb-6 relative z-10">Live Cost Analysis</h3>

            {/* Mockup Body Elements */}
            <div className="space-y-4 mb-6 relative z-10">
              {[
                { label: "Concrete Grade M25", val: "Rs 4,50,000", w: "80%" },
                { label: "TMT Steel 500D", val: "Rs 8,20,000", w: "95%" },
                { label: "Formwork Area", val: "Rs 1,15,000", w: "45%" }
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs font-dm text-[#6B7A9F] mb-1.5">
                    <span>{item.label}</span>
                    <span className="text-[#F0F4FF] font-mono">{item.val}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#7B4FFF] to-[#00D4FF]" style={{ width: item.w, animation: `chart-bar-grow 1s ease-out ${1.5 + (i * 0.2)}s backwards` }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Mockup Bottom Stats */}
            <div className="mt-auto grid grid-cols-2 gap-4 relative z-10">
              <div className="glass-card p-3 rounded-xl border border-white/5 text-center">
                <p className="text-[10px] text-[#6B7A9F] uppercase tracking-wide mb-1 font-dm">Accuracy</p>
                <p className="font-bebas text-3xl text-[#F5A623]">
                  <AnimatedCounter end={99} suffix=".2%" trigger={heroInView} delay={1500} />
                </p>
              </div>
              <div className="glass-card p-3 rounded-xl border border-white/5 text-center">
                <p className="text-[10px] text-[#6B7A9F] uppercase tracking-wide mb-1 font-dm">BOQs Gen</p>
                <p className="font-bebas text-3xl text-[#00D4FF]">
                  <AnimatedCounter end={142} suffix="k+" trigger={heroInView} delay={1700} />
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* --- DASHBOARD / WORKFLOW SECTION --- */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto py-24 px-6 lg:px-12 border-t border-white/5">
        
        <div className="text-center mb-16 relative w-fit mx-auto" ref={workflowRef}>
          <h2 className="text-[40px] md:text-[56px] font-clash font-bold">
            Complete Estimation Workflow
          </h2>
          {workflowInView && (
            <div className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-[#F5A623] to-[#00D4FF]" style={{ animation: 'underline-draw 1s ease-out forwards' }} />
          )}
        </div>

        <div className="relative">
          {/* Connecting Line (Desktop only) */}
          <div className="hidden lg:block absolute top-[60px] left-[10%] right-[10%] h-[2px] bg-white/5 z-0" />
          <svg className="hidden lg:block absolute top-[60px] left-[10%] w-[80%] h-[2px] z-0 overflow-visible" preserveAspectRatio="none">
            {workflowInView && (
              <line x1="0" y1="0" x2="100%" y2="0" stroke="url(#lineGrad)" strokeWidth="2" strokeDasharray="8 8" strokeDashoffset="1000" style={{ animation: 'line-draw 2s linear forwards' }} />
            )}
            <defs>
              <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#7B4FFF" />
                <stop offset="50%" stopColor="#00D4FF" />
                <stop offset="100%" stopColor="#F5A623" />
              </linearGradient>
            </defs>
          </svg>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {[
              { id: "01", title: "Enter Measurements", desc: "Input physical dimensions, upload drawings, or use precise parameters.", color: "from-[#4338CA] to-[#7B4FFF]", icon: LayoutGrid },
              { id: "02", title: "Auto-Generate BOQ", desc: "Engine processes parameters through live standards to output precise BOQs.", color: "from-[#E58A00] to-[#F5A623]", icon: ClipboardList },
              { id: "03", title: "Calculate Material", desc: "Compute exact quantities for steel, concrete, bricks down to the millimeter.", color: "from-[#0891B2] to-[#00D4FF]", icon: Calculator },
              { id: "04", title: "Export Cost Summary", desc: "Generate enterprise-ready PDFs and dynamic Excel cost models instantly.", color: "from-[#059669] to-[#10B981]", icon: ArrowRight }
            ].map((step, i) => (
              <div 
                key={step.id} 
                className="workflow-card flex flex-col glass-card rounded-2xl p-6 transition-all duration-300 transform"
                style={{ 
                  opacity: workflowInView ? 1 : 0, 
                  transform: workflowInView ? 'translateY(0)' : 'translateY(40px)',
                  transitionDelay: `${i * 150}ms`
                }}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center p-[2px] shadow-lg`}>
                    <div className="w-full h-full bg-[#0D1220] rounded-full flex items-center justify-center">
                      <step.icon className="w-6 h-6 text-white workflow-icon transition-transform duration-500 ease-in-out" />
                    </div>
                  </div>
                  <div className="text-4xl font-bebas text-[#6B7A9F]/30">{step.id}</div>
                </div>
                <h3 className="font-dm font-bold text-xl mb-2">{step.title}</h3>
                <p className="font-sans text-sm text-[#6B7A9F] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* --- STATS BAR --- */}
        <div ref={statsRef} className="mt-20 w-full glass-card border-t border-b border-white/5 py-12 px-6 flex flex-wrap justify-between gap-8 md:gap-4 relative overflow-hidden group">
          
          <div className="absolute inset-0 bg-gradient-to-r from-[#F5A623]/5 via-[#00D4FF]/5 to-[#7B4FFF]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          {[
            { val: 40, suf: "+", lab: "Professional Tools", pre: "" },
            { val: 100, suf: "%", lab: "Free to Use", pre: "" },
            { val: 15, suf: "+", lab: "Countries", pre: "" },
            { val: 24, suf: "/7", lab: "AI Powered", pre: "" }
          ].map((stat, i) => (
            <div key={i} className="flex-1 min-w-[150px] text-center relative z-10">
              <div className="text-5xl md:text-7xl font-bebas tracking-wider text-[#F0F4FF] mb-2">
                <AnimatedCounter end={stat.val} prefix={stat.pre} suffix={stat.suf} trigger={statsInView} delay={100 * i} />
              </div>
              <div className="text-xs tracking-widest uppercase font-dm text-[#6B7A9F] font-bold">
                {stat.lab}
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
}
