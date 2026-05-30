import React from "react";
import { motion } from "motion/react";
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
    <div className="w-full py-12 md:py-16" ref={ref}>
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-bold tracking-widest uppercase mb-4 border border-indigo-100">
          How It Works
        </div>
        <h2
          className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-4 tracking-tight"
          
        >
          From Drawing to BOQ in 3 Steps
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative max-w-5xl mx-auto px-4">
        {/* Connecting Line (Desktop) */}
        <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-[2px] bg-slate-100 -z-10"></div>

        {steps.map((step, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.5, delay: idx * 0.2 }}
            className="flex flex-col items-center text-center relative"
          >
            <div className="w-24 h-24 rounded-full bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center justify-center mb-6 relative">
              <step.icon
                className="w-10 h-10 text-indigo-600"
                strokeWidth={1.5}
              />
              <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center shadow-md">
                {idx + 1}
              </div>
            </div>
            <h3
              className="text-xl font-semibold text-slate-900 mb-3"
              
            >
              {step.title}
            </h3>
            <p className="text-slate-500 font-medium leading-relaxed max-w-xs">
              {step.description}
            </p>
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
      tooltip:
        "Use tools directly from the construction site on any smartphone.",
      app: true,
      excel: false,
      qs: false,
    },
    {
      name: "1-Click BOQ Export",
      tooltip:
        "Generate professional PDF and Excel Bill of Quantities instantly.",
      app: true,
      excel: false,
      qs: false,
    },
    {
      name: "AI Assistance",
      tooltip:
        "Built-in AI to answer specific structural and material questions.",
      app: true,
      excel: false,
      qs: false,
    },
    {
      name: "Price per month",
      tooltip: "Total monthly cost for unlimited usage.",
      app: "$29/mo",
      excel: "~$0 (10hrs/week labor)",
      qs: "$200+/hr",
    },
  ];

  return (
    <div
      className="w-full py-12 md:py-16 bg-slate-50 border-y border-slate-100 relative overflow-hidden"
      ref={ref}
    >
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px] opacity-40"></div>

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-[10px] font-bold tracking-widest uppercase mb-4 border border-amber-100">
            Compare
          </div>
          <h2
            className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 mb-6 tracking-tight"
            
          >
            The Smarter Way to Estimate
          </h2>
          <p
            className="text-slate-500 font-medium text-lg max-w-2xl mx-auto"
            
          >
            See why thousands of engineers are abandoning spreadsheets for a
            dedicated estimation platform.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-[24px] border border-slate-200 overflow-visible shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative"
        >
          <div className="overflow-x-auto w-full pb-4 md:pb-0">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr>
                  <th className="p-4 md:p-8 bg-slate-50 text-slate-500 font-bold text-sm tracking-wider uppercase border-b border-slate-200 w-1/3 rounded-tl-[2rem]">
                    Features
                  </th>
                  <th className="p-0 border-b border-amber-500/30 w-1/4 relative bg-amber-50/10">
                    <div className="absolute -top-[1.25rem] left-0 right-0 flex justify-center z-20">
                      <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-bold uppercase tracking-widest py-1.5 px-4 rounded-full shadow-lg border border-amber-400">
                        Most Popular Choice
                      </div>
                    </div>
                    {/* Glowing highlight borders for the column */}
                    <div className="absolute inset-0 border-x border-t-2 border-amber-400 bg-amber-500/5 mix-blend-multiply rounded-t-2xl shadow-[inset_0_4px_20px_rgba(245,158,11,0.1)] pointer-events-none z-0"></div>
                    <div className="relative p-4 md:p-8 z-10 text-center">
                      <div
                        className="font-bold tracking-tight text-amber-600 text-lg md:text-2xl relative inline-block"
                        
                      >
                        Civil Estimation Pro
                      </div>
                    </div>
                  </th>
                  <th className="p-4 md:p-8 border-b border-slate-200 text-slate-400 font-bold text-center w-1/5">
                    Excel Spreadsheets
                  </th>
                  <th className="p-4 md:p-8 border-b border-slate-200 text-slate-400 font-bold text-center w-1/5 rounded-tr-[2rem]">
                    Hiring a QS
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {features.map((feature, idx) => {
                  const isLast = idx === features.length - 1;
                  return (
                    <tr
                      key={idx}
                      className="hover:bg-slate-50/50 transition-colors group relative"
                    >
                      <td
                        className={`p-4 md:p-6 pl-8 font-semibold text-slate-700 relative ${isLast ? "rounded-bl-[2rem]" : ""}`}
                      >
                        <div className="flex items-center gap-2">
                          {feature.name}
                          <div className="group/tooltip relative flex items-center justify-center cursor-help">
                            <Info className="w-4 h-4 text-slate-300 hover:text-slate-500 transition-colors" />
                            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover/tooltip:block w-48 bg-white text-slate-900 text-xs p-2 rounded-[16px] text-center shadow-xl z-50 pointer-events-none border border-slate-200 shadow-sm">
                              {feature.tooltip}
                              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rotate-45 border border-slate-200 shadow-sm"></div>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className={`p-4 md:p-6 text-center relative`}>
                        {/* Highlight Column Background */}
                        <div
                          className={`absolute inset-0 border-x border-amber-400 bg-amber-500/5 ${isLast ? "border-b-2 rounded-b-2xl" : ""} pointer-events-none z-0`}
                        ></div>
                        <div className="relative z-10 flex justify-center">
                          {typeof feature.app === "boolean" ? (
                            <motion.div
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={
                                inView
                                  ? { scale: 1, opacity: 1 }
                                  : { scale: 0.8, opacity: 0 }
                              }
                              transition={{
                                duration: 0.4,
                                delay: 0.2 + idx * 0.1,
                              }}
                            >
                              <CheckCircle2 className="w-6 h-6 text-amber-500 font-bold" />
                            </motion.div>
                          ) : (
                            <span className="font-bold text-amber-600 text-lg">
                              {feature.app}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="p-4 md:p-6 text-center">
                        <div className="flex justify-center">
                          {typeof feature.excel === "boolean" ? (
                            feature.excel ? (
                              <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={
                                  inView
                                    ? { scale: 1, opacity: 1 }
                                    : { scale: 0.8, opacity: 0 }
                                }
                                transition={{
                                  duration: 0.4,
                                  delay: 0.3 + idx * 0.1,
                                }}
                              >
                                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                              </motion.div>
                            ) : (
                              <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={
                                  inView
                                    ? { scale: 1, opacity: 1 }
                                    : { scale: 0.8, opacity: 0 }
                                }
                                transition={{
                                  duration: 0.4,
                                  delay: 0.3 + idx * 0.1,
                                }}
                              >
                                <XCircle className="w-5 h-5 text-slate-300" />
                              </motion.div>
                            )
                          ) : (
                            <span className="text-slate-500 font-medium">
                              {feature.excel}
                            </span>
                          )}
                        </div>
                      </td>

                      <td
                        className={`p-4 md:p-6 text-center ${isLast ? "rounded-br-[2rem]" : ""}`}
                      >
                        <div className="flex justify-center">
                          {typeof feature.qs === "boolean" ? (
                            feature.qs ? (
                              <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={
                                  inView
                                    ? { scale: 1, opacity: 1 }
                                    : { scale: 0.8, opacity: 0 }
                                }
                                transition={{
                                  duration: 0.4,
                                  delay: 0.4 + idx * 0.1,
                                }}
                              >
                                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                              </motion.div>
                            ) : (
                              <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={
                                  inView
                                    ? { scale: 1, opacity: 1 }
                                    : { scale: 0.8, opacity: 0 }
                                }
                                transition={{
                                  duration: 0.4,
                                  delay: 0.4 + idx * 0.1,
                                }}
                              >
                                <XCircle className="w-5 h-5 text-slate-300" />
                              </motion.div>
                            )
                          ) : (
                            <span className="text-slate-500 font-medium whitespace-nowrap">
                              {feature.qs}
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 text-center"
        >
          <button
            onClick={() => {
              if (onNavigate) onNavigate("dashboard");
              window.scrollTo(0, 0);
            }}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white hover:bg-indigo-600 text-white font-bold rounded-[24px] shadow-[0_8px_20px_rgba(15,23,42,0.15)] hover:shadow-[0_12px_25px_rgba(15,23,42,0.25)] transition-all transform hover:-translate-y-1"
          >
            Join 24,847 engineers who already switched
            <ArrowRight className="w-5 h-5 ml-1" />
          </button>
        </motion.div>
      </div>
    </div>
  );
}

export function ProjectTypesSection({
  onSelect,
}: {
  onSelect: (id: string) => void;
}) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  const projectTypes = [
    {
      title: "Residential",
      icon: Home,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      tools: [
        "House Construction Cost",
        "Brick Wall Estimation",
        "Slab Concrete",
        "Plaster Calculation",
      ],
    },
    {
      title: "Commercial",
      icon: Building,
      color: "text-indigo-500",
      bgColor: "bg-indigo-50",
      tools: [
        "Column & Beam Steel",
        "BBS Generator",
        "Floor Tile Estimation",
        "Paint & Finishing",
      ],
    },
    {
      title: "Infrastructure",
      icon: HardHat,
      color: "text-amber-500",
      bgColor: "bg-amber-50",
      tools: [
        "Highway Cut & Fill",
        "Asphalt Road",
        "Box Culvert",
        "Retaining Wall",
      ],
    },
    {
      title: "Industrial",
      icon: Factory,
      color: "text-emerald-500",
      bgColor: "bg-emerald-50",
      tools: [
        "Machine Foundation",
        "Steel Structure",
        "Concrete Mix Design",
        "Water Tank",
      ],
    },
  ];

  return (
    <div className="w-full py-12 md:py-16" ref={ref}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-bold tracking-widest uppercase mb-4 border border-indigo-100">
            Versatile Solutions
          </div>
          <h2
            className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-4 tracking-tight"
            
          >
            Built for Every Project Type
          </h2>
          <p className="text-slate-500 font-medium text-lg max-w-2xl mx-auto">
            Whether you are building a small home or a major highway, our tools
            scale to your needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {projectTypes.map((pt, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="bg-white rounded-[24px] border border-slate-200 p-6 flex flex-col hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.1)] transition-all group"
            >
              <div
                className={`w-14 h-14 rounded-[24px] ${pt.bgColor} flex items-center justify-center mb-6`}
              >
                <pt.icon className={`w-7 h-7 ${pt.color}`} />
              </div>

              <h3
                className="text-xl font-semibold text-slate-900 mb-4"
                
              >
                {pt.title}
              </h3>

              <ul className="space-y-3 mb-8 flex-1">
                {pt.tools.map((tool, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 text-sm text-slate-600 font-medium"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                    {tool}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => onSelect("smart-search")}
                className="w-full py-3 px-4 rounded-[24px] text-sm font-bold bg-slate-50 text-slate-700 group-hover:bg-indigo-600 group-hover:text-white transition-colors flex items-center justify-center gap-2"
              >
                Explore Tools <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
