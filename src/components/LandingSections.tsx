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
    <div className="w-full py-16 md:py-24" ref={ref}>
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-bold tracking-widest uppercase mb-4 border border-indigo-100">
          How It Works
        </div>
        <h2
          className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight"
          style={{ fontFamily: '"Clash Display", sans-serif' }}
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
              className="text-xl font-bold text-slate-900 mb-3"
              style={{ fontFamily: '"Clash Display", sans-serif' }}
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

export function FeatureComparisonSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  const features = [
    {
      name: "Speed of Calculation",
      app: "Instant",
      excel: "Slow",
      qs: "Days/Weeks",
    },
    { name: "Accuracy & Code Compliance", app: true, excel: false, qs: true },
    {
      name: "Cost",
      app: "Low Monthly",
      excel: "Variable",
      qs: "High ($200+/hr)",
    },
    { name: "Mobile Accessibility", app: true, excel: false, qs: false },
    { name: "1-Click BOQ Export", app: true, excel: false, qs: false },
    { name: "AI Assistance", app: true, excel: false, qs: false },
  ];

  return (
    <div
      className="w-full py-16 md:py-24 bg-slate-50 border-y border-slate-100"
      ref={ref}
    >
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-bold tracking-widest uppercase mb-4 border border-indigo-100">
            Why Choose Us
          </div>
          <h2
            className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight"
            style={{ fontFamily: '"Clash Display", sans-serif' }}
          >
            The Smarter Way to Estimate
          </h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-[24px] border border-slate-200 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr>
                  <th className="p-4 md:p-6 bg-slate-50/50 text-slate-500 font-bold text-sm tracking-wider uppercase border-b border-slate-200 w-1/3">
                    Features
                  </th>
                  <th className="p-4 md:p-6 bg-indigo-50 border-b border-indigo-100 w-1/4">
                    <div
                      className="font-extrabold text-indigo-600 text-lg md:text-xl relative inline-block"
                      style={{ fontFamily: '"Clash Display", sans-serif' }}
                    >
                      Civil Estimation Pro
                      <div className="absolute -top-3 -right-6 hidden sm:block">
                        <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse inline-block"></span>
                      </div>
                    </div>
                  </th>
                  <th className="p-4 md:p-6 border-b border-slate-200 text-slate-900 font-bold w-1/5">
                    Excel Spreadsheets
                  </th>
                  <th className="p-4 md:p-6 border-b border-slate-200 text-slate-900 font-bold w-1/5">
                    Hiring a QS
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {features.map((feature, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="p-4 md:p-6 font-medium text-slate-700">
                      {feature.name}
                    </td>

                    <td className="p-4 md:p-6 bg-indigo-50/30">
                      {typeof feature.app === "boolean" ? (
                        <Check className="w-6 h-6 text-indigo-500 font-bold" />
                      ) : (
                        <span className="font-bold text-indigo-600">
                          {feature.app}
                        </span>
                      )}
                    </td>

                    <td className="p-4 md:p-6">
                      {typeof feature.excel === "boolean" ? (
                        feature.excel ? (
                          <Check className="w-5 h-5 text-emerald-500" />
                        ) : (
                          <X className="w-5 h-5 text-slate-300" />
                        )
                      ) : (
                        <span className="text-slate-500 font-medium">
                          {feature.excel}
                        </span>
                      )}
                    </td>

                    <td className="p-4 md:p-6">
                      {typeof feature.qs === "boolean" ? (
                        feature.qs ? (
                          <Check className="w-5 h-5 text-emerald-500" />
                        ) : (
                          <X className="w-5 h-5 text-slate-300" />
                        )
                      ) : (
                        <span className="text-slate-500 font-medium">
                          {feature.qs}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
    <div className="w-full py-16 md:py-24" ref={ref}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-bold tracking-widest uppercase mb-4 border border-indigo-100">
            Versatile Solutions
          </div>
          <h2
            className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight"
            style={{ fontFamily: '"Clash Display", sans-serif' }}
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
                className={`w-14 h-14 rounded-2xl ${pt.bgColor} flex items-center justify-center mb-6`}
              >
                <pt.icon className={`w-7 h-7 ${pt.color}`} />
              </div>

              <h3
                className="text-xl font-bold text-slate-900 mb-4"
                style={{ fontFamily: '"Clash Display", sans-serif' }}
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
                className="w-full py-3 px-4 rounded-xl text-sm font-bold bg-slate-50 text-slate-700 group-hover:bg-indigo-600 group-hover:text-white transition-colors flex items-center justify-center gap-2"
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
