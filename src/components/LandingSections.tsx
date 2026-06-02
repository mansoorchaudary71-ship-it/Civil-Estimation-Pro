import React from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { useInView } from "react-intersection-observer";
import {
  MousePointerClick,
  Calculator,
  FileText,
  Check,
  X,
  Building,
  Home,
  Factory,
  HardHat,
  ArrowRight,
  Info,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export function HowItWorksSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const containerRef = useRef<HTMLDivElement>(null);

  const steps = [
    {
      icon: MousePointerClick,
      title: "Choose Your Tool",
      description:
        "Select from 50+ specialized calculators for concrete, steel, masonry, or earthwork.",
    },
    {
      icon: Calculator,
      title: "Enter Measurements",
      description:
        "Input dimensions from your drawings. Switch easily between metric and imperial units.",
    },
    {
      icon: FileText,
      title: "Get Instant Results & BOQ",
      description:
        "Instantly see precise material quantities, generate reports, and export BOQs to Excel.",
    },
  ];

  return (
    <div className="w-full py-20 bg-gradient-to-b from-[#0D1117] to-[#1A2035] relative overflow-hidden" ref={(node) => { ref(node); if(containerRef) containerRef.current = node; }}>
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="text-center mb-24 relative z-10 px-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-500/10 text-amber-400 rounded-full text-xs font-bold tracking-widest uppercase mb-6 border border-amber-500/20 backdrop-blur-sm">
          How It Works
        </div>
        <h2
          className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6"
        >
          From Drawing to BOQ in 3 Steps
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg">
          Our platform simplifies complex civil engineering calculations into an intuitive, seamless workflow.
        </p>
      </div>

      <div className="flex flex-col md:flex-row items-stretch justify-center gap-12 md:gap-8 relative max-w-6xl mx-auto px-6 z-10 pt-8">
        {/* Connecting Dotted Line (Mobile Vertical) */}
        <div className="md:hidden absolute top-0 bottom-0 left-[48px] w-0 md:w-full border-l-2 border-dashed border-white/20 -z-10" />

        {/* Connecting Dashed Line (Desktop Horizontal) */}
        <div className="hidden md:block absolute top-[100px] left-[15%] right-[15%] h-0 border-t-2 border-dashed border-white/20 -z-10" />

        {steps.map((step, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.6, delay: idx * 0.2 }}
            className="flex-1"
          >
            <div className="bg-white/[0.03] backdrop-blur-xl rounded-[16px] border border-white/10 shadow-2xl p-8 relative h-full flex flex-col group hover:bg-white/[0.05] transition-colors duration-300 ml-6 md:ml-0 md:mt-6">
              
              {/* Large numbered badge */}
              <div className="absolute -top-8 -left-8 md:-top-10 md:-left-6 w-[60px] h-[60px] rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white text-2xl font-bold shadow-[0_0_20px_rgba(245,158,11,0.4)] border-4 border-[#121722] z-20 group-hover:scale-110 transition-transform duration-300">
                {idx + 1}
              </div>

              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-6 text-amber-400 group-hover:bg-amber-500/20 transition-colors duration-300 mt-2">
                <step.icon
                  className="w-10 h-10"
                  strokeWidth={1.5}
                />
              </div>
              
              <h3 className="text-xl md:text-2xl font-bold text-white mb-4">
                {step.title}
              </h3>
              
              <p className="text-slate-400 font-medium leading-relaxed">
                {step.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function FeatureComparisonSection({
  onNavigate,
}: {
  onNavigate?: (id: string) => void;
}) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  const features = [
    {
      name: "Speed of Calculation",
      tooltip: "Time taken to complete a full BOQ or material estimate.",
      app: "Instant",
      excel: "Slow",
      qs: "Days/Weeks",
    },
    {
      name: "Accuracy & Code Compliance",
      tooltip: "Adherence to local and international civil engineering codes.",
      app: true,
      excel: false,
      qs: true,
    },
    {
      name: "Mobile Accessibility",
      tooltip: "Use tools directly from the construction site on any smartphone.",
      app: true,
      excel: false,
      qs: false,
    },
    {
      name: "1-Click BOQ Export",
      tooltip: "Generate professional PDF and Excel Bill of Quantities instantly.",
      app: true,
      excel: false,
      qs: false,
    },
    {
      name: "AI Assistance",
      tooltip: "Built-in AI to answer specific structural and material questions.",
      app: true,
      excel: false,
      qs: false,
    },
  ];

  return (
    <div
      className="w-full py-16 md:py-24 bg-slate-50 dark:bg-[#121212] border-y border-slate-100 dark:border-[#333] relative overflow-hidden"
      ref={ref}
    >
      {/* Background Grid Accent */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(#333_1px,transparent_1px)] [background-size:20px_20px] opacity-40 mix-blend-color-burn"></div>

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full text-[11px] font-bold tracking-widest uppercase mb-4 border border-amber-200 dark:border-amber-500/20 shadow-sm">
            Compare
          </div>
          <h2
            className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-6"
          >
            The Smarter Way to Estimate
          </h2>
          <p
            className="text-slate-500 dark:text-slate-400 font-medium text-lg max-w-2xl mx-auto px-4"
          >
            See why thousands of engineers are abandoning spreadsheets for a dedicated estimation platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Spreadsheets Card */}
          <motion.div
            initial={{ opacity: 0, x: -20, y: 20 }}
            animate={inView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x: -20, y: 20 }}
            transition={{ duration: 0.6 }}
            className="bg-white/60 dark:bg-[#1a1b1e]/60 backdrop-blur-sm rounded-[24px] border border-slate-200 dark:border-[#333] p-8 md:p-10 flex flex-col pt-12 mt-6 md:mt-0 order-2 md:order-1"
          >
            <div className="text-xl font-bold text-slate-500 dark:text-slate-400 mb-8 border-b border-slate-200 dark:border-[#333] pb-6">
              Excel Spreadsheets
            </div>

            <div className="flex flex-col gap-6 flex-1">
              {features.map((feature, idx) => (
                <div key={idx} className="flex items-center justify-between group">
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-medium text-sm md:text-base">
                    {feature.name}
                    <div className="group/tooltip relative flex items-center justify-center cursor-help">
                      <div className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-slate-400 transition-colors flex items-center justify-center">
                         <Info className="w-3.5 h-3.5" />
                      </div>
                      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover/tooltip:block w-48 bg-slate-800 text-white text-xs p-2.5 rounded-[12px] text-center shadow-xl z-50 pointer-events-none">
                        {feature.tooltip}
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-800 rotate-45"></div>
                      </div>
                    </div>
                  </div>
                  <div>
                    {typeof feature.excel === "boolean" ? (
                      feature.excel ? (
                        <CheckCircle2 className="w-5 h-5 text-slate-400" />
                      ) : (
                        <XCircle className="w-5 h-5 text-slate-300 dark:text-slate-600" />
                      )
                    ) : (
                      <span className="text-slate-500 font-semibold text-sm md:text-base">{feature.excel}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* CE Pro Card */}
          <motion.div
            initial={{ opacity: 0, x: 20, y: 20 }}
            animate={inView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x: 20, y: 20 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white dark:bg-[#1a1b1e] rounded-[24px] border-2 border-amber-500 shadow-[0_20px_60px_rgba(245,158,11,0.15)] dark:shadow-[0_20px_60px_rgba(245,158,11,0.1)] p-8 md:p-10 flex flex-col relative transform md:-translate-y-4 order-1 md:order-2"
          >
            <div className="absolute -top-4 left-0 right-0 flex justify-center">
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold uppercase tracking-widest py-1.5 px-6 rounded-full shadow-lg border border-amber-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                Recommended
              </div>
            </div>

            <div className="text-xl md:text-2xl font-bold text-slate-900 dark:text-amber-500 mb-8 border-b border-amber-500/20 pb-6 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 text-white flex items-center justify-center font-bold text-xs tracking-tighter shadow-md shrink-0">CE</div>
              Civil Estimation Pro
            </div>

            <div className="flex flex-col gap-6 flex-1">
              {features.map((feature, idx) => (
                <div key={idx} className="flex items-center justify-between group">
                  <div className="flex items-center gap-2 text-slate-800 dark:text-white font-semibold text-sm md:text-base">
                    {feature.name}
                    <div className="group/tooltip relative flex items-center justify-center cursor-help">
                      <div className="w-4 h-4 text-slate-300 dark:text-slate-500 group-hover:text-amber-500 transition-colors flex items-center justify-center">
                         <Info className="w-3.5 h-3.5" />
                      </div>
                      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover/tooltip:block w-48 bg-slate-900 border border-slate-700 text-white text-xs p-2.5 rounded-[12px] text-center shadow-xl z-50 pointer-events-none">
                        {feature.tooltip}
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 border-b border-r border-slate-700 rotate-45"></div>
                      </div>
                    </div>
                  </div>
                  <div>
                    {typeof feature.app === "boolean" ? (
                      feature.app ? (
                        <div className="w-7 h-7 rounded-full bg-amber-500/10 flex items-center justify-center">
                          <CheckCircle2 className="w-5 h-5 text-amber-500" />
                        </div>
                      ) : (
                        <XCircle className="w-5 h-5 text-slate-300" />
                      )
                    ) : (
                      <span className="text-amber-600 font-bold bg-amber-500/10 px-3 py-1 rounded-full text-xs md:text-sm whitespace-nowrap">{feature.app}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 relative z-10 text-center"
        >
          <button
            onClick={() => {
              if (onNavigate) onNavigate("dashboard");
              window.scrollTo(0, 0);
            }}
            className="inline-flex flex-col sm:flex-row items-center justify-center gap-3 px-8 sm:px-10 py-4 lg:py-5 bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-100 dark:to-white hover:from-slate-800 hover:to-slate-700 text-white dark:text-slate-900 font-bold text-[15px] sm:text-[17px] rounded-[32px] sm:rounded-full group shadow-xl hover:shadow-2xl hover:shadow-slate-500/20 dark:hover:shadow-white/20 transition-all cursor-pointer whitespace-nowrap lg:whitespace-normal ring-4 ring-slate-900/5 dark:ring-white/5 mx-auto active:scale-[0.98]"
          >
            <span>Level up your estimations</span>
            <div className="flex items-center gap-2">
              <span className="opacity-90 font-medium">— Start Free</span>
              <div className="w-8 h-8 rounded-full bg-white/20 dark:bg-black/10 flex items-center justify-center group-hover:translate-x-1 transition-transform ml-2">
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </div>
            </div>
          </button>
        </motion.div>
      </div>
    </div>
  );
}
