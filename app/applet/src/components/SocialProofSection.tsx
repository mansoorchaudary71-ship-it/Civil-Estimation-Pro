import React from "react";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import {
  Star,
  Users,
  Calculator,
  Globe2,
  Award,
  FileSpreadsheet,
  FileText,
  FileSearch,
  PenTool,
  Trello,
  Codesandbox,
  Wrench
} from "lucide-react";
import { motion } from "motion/react";

const TESTIMONIALS = [
  {
    name: "Rajesh Kumar",
    title: "Senior Quantity Surveyor",
    company: "L&T Construction",
    flag: "IN",
    quote:
      "Civil Estimation Pro has completely transformed how I handle BOQ preparations. What used to take hours of manual Excel entries now takes minutes, with zero calculation errors.",
    rating: 5.0,
    metrics: "Saved 8 hours/week",
    avatar: "https://i.pravatar.cc/150?img=11",
  },
  {
    name: "Sarah Jenkins",
    title: "Structural Engineer",
    company: "AECOM",
    flag: "UK",
    quote:
      "The concrete mix design and structural steel estimators are incredibly accurate. It perfectly handles complex slab and footing calculations while adhering to standard codes.",
    rating: 4.8,
    metrics: "Reduced BOQ errors by 94%",
    avatar: "https://i.pravatar.cc/150?img=43",
  },
  {
    name: "Ahmed Ali",
    title: "Site Engineer",
    company: "NESPAK",
    flag: "PK",
    quote:
      "As a site engineer, I need fast material calculations on my phone. This tool is a lifesaver for ordering immediate cement, sand, and brick deliveries on the spot.",
    rating: 4.9,
    metrics: "100% on-site accuracy",
    avatar: "https://i.pravatar.cc/150?img=8",
  },
  {
    name: "David Chen",
    title: "Project Manager",
    company: "Gammon India",
    flag: "SG",
    quote:
      "We deployed this across our entire site team. The ability to instantly generate bar bending schedules has streamlined our steel procurement massively.",
    rating: 5.0,
    metrics: "Cut steel waste by 12%",
    avatar: "https://i.pravatar.cc/150?img=15",
  },
  {
    name: "Priya Desai",
    title: "Cost Estimator",
    company: "Shapoorji Pallonji",
    flag: "IN",
    quote:
      "I've tried many QS software, but this is by far the most intuitive. The precast wall and cage estimators save me from doing tedious manual math.",
    rating: 4.8,
    metrics: "$40k saved in software",
    avatar: "https://i.pravatar.cc/150?img=20",
  },
  {
    name: "Michael Torres",
    title: "Independent Contractor",
    company: "Torres Build",
    flag: "US",
    quote:
      "For small to medium residential projects, the quick rough estimation tool gives me an accurate baseline for client quotes in under 5 minutes.",
    rating: 4.9,
    metrics: "Won 3x more bids",
    avatar: "https://i.pravatar.cc/150?img=33",
  },
  {
    name: "Elena Rostova",
    title: "Geotechnical Engineer",
    company: "GeoTech Pro",
    flag: "AU",
    quote:
      "The soil tests calculators like CBR and Direct Shear are perfectly aligned with lab standards. A great digital companion for field data entry.",
    rating: 5.0,
    metrics: "Zero calculation errors",
    avatar: "https://i.pravatar.cc/150?img=40",
  },
  {
    name: "Karan Singh",
    title: "Civil Contractor",
    company: "Singh Builders",
    flag: "IN",
    quote:
      "From anti-termite chemical calculations to simple brickwork estimators, it's my go-to app every morning before starting site operations.",
    rating: 4.8,
    metrics: "30% faster planning",
    avatar: "https://i.pravatar.cc/150?img=50",
  },
  {
    name: "Fatima Zahra",
    title: "Architectural Drafter",
    company: "Design Studio",
    flag: "AE",
    quote:
      "The interiors and finishes section helps me quickly validate material quantities with my contractors. I trust the numbers completely.",
    rating: 4.9,
    metrics: "Streamlined communication",
    avatar: "https://i.pravatar.cc/150?img=5",
  },
];

const STATS = [
  { id: 1, label: "Engineers", value: 24847, suffix: "+", icon: Users },
  { id: 2, label: "Calculations", value: 2.1, prefix: "", suffix: "M+", decimals: 1, icon: Calculator },
  { id: 3, label: "Countries", value: 15, suffix: "+", icon: Globe2 },
  { id: 4, label: "Rating", value: 4.9, suffix: "/5", decimals: 1, icon: Award },
];

const INTEGRATIONS = [
  { name: "Microsoft Excel", icon: FileSpreadsheet, color: "text-green-600" },
  { name: "PDF Export", icon: FileText, color: "text-red-500" },
  { name: "AutoCAD Sync", icon: PenTool, color: "text-blue-500" },
  { name: "BIM 360", icon: Codesandbox, color: "text-indigo-600" },
  { name: "Revit Add-on", icon: Wrench, color: "text-slate-600" },
  { name: "Primavera P6", icon: Trello, color: "text-emerald-500" },
  { name: "SAP2000 Data", icon: FileSearch, color: "text-purple-500" }
];

// Double the integrations array for infinite loop effect
const MARQUEE_ITEMS = [...INTEGRATIONS, ...INTEGRATIONS];

export default function SocialProofSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <div className="w-full py-16 md:py-24 mb-16 rounded-[3rem] border border-slate-200 overflow-hidden relative">
      {/* Background Mesh Gradient Elements */}
      <div className="absolute inset-0 bg-[#f8fafc] pointer-events-none" />
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-[100%] bg-sky-200/60 blur-[120px] pointer-events-none opacity-80" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[60%] rounded-[100%] bg-fuchsia-200/50 blur-[130px] pointer-events-none opacity-80" />
      <div className="absolute top-[20%] left-[20%] w-[50%] h-[50%] rounded-[100%] bg-indigo-100/60 blur-[100px] pointer-events-none opacity-70" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase mb-6">Wall of Love</div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-slate-900 mb-6 font-heading">Trusted by the Top 1% of Engineers</h2>
          <p className="text-slate-600 font-medium text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">Join 24,847+ professionals across 15 countries relying on Civil Estimation Pro for precision and speed.</p>
        </div>

        {/* Unified Glass-Frosted Container for Statistics */}
        <div ref={ref} className="relative w-full max-w-5xl mx-auto mb-20 bg-white/40 backdrop-blur-2xl rounded-[2rem] border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.06)] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-white/10 pointer-events-none"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.8),transparent_50%)] pointer-events-none"></div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-slate-200/50 relative z-10">
            {STATS.map((stat, idx) => (
              <div key={stat.id} className={`${idx < 2 ? 'border-b md:border-b-0' : ''} flex flex-col items-center justify-center p-8 md:p-10`}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                  animate={inView ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.8, y: 10 }}
                  transition={{ duration: 0.6, delay: stat.id * 0.1, type: "spring", stiffness: 120 }}
                  className="flex flex-col items-center"
                >
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 mb-4 shadow-sm border border-slate-100">
                    <stat.icon className="w-6 h-6" strokeWidth={2.5} />
                  </div>
                  <div className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 flex items-baseline font-heading">
                    {inView ? <CountUp start={0} end={stat.value} duration={2.5} decimals={stat.decimals || 0} prefix={stat.prefix || ""} useEasing={true} separator="," /> : "0"}
                    {stat.suffix && <span className="text-xl md:text-2xl ml-0.5 text-slate-500 font-bold">{stat.suffix}</span>}
                  </div>
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-3">{stat.label}</div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>

        {/* Infinite Marquee for Integrations */}
        <div className="w-full max-w-6xl mx-auto mb-24 overflow-hidden relative">
          <div className="text-center mb-8">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Seamless Integrations with Industry Standards</span>
          </div>
          
          <div className="relative w-full flex py-4 overflow-hidden">
            {/* Fade Edges */}
            <div className="absolute left-0 top-0 bottom-0 w-24 md:w-32 bg-gradient-to-r from-[#f8fafc] to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-24 md:w-32 bg-gradient-to-l from-[#f8fafc] to-transparent z-10 pointer-events-none"></div>
            
            {/* Scrolling Track */}
            <motion.div 
               animate={{ x: ["0%", "-50%"] }}
               transition={{ ease: "linear", duration: 15, repeat: Infinity }}
               className="flex gap-8 md:gap-16 items-center w-max"
            >
              {MARQUEE_ITEMS.map((item, idx) => (
                <div key={`${item.name}-${idx}`} className="flex items-center gap-3 shrink-0 px-6 py-3 bg-white/50 backdrop-blur-md rounded-2xl border border-slate-200/50 shadow-sm">
                   <item.icon className={`w-6 h-6 ${item.color}`} />
                   <span className="font-bold text-slate-700 whitespace-nowrap">{item.name}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {TESTIMONIALS.map((t, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }} transition={{ duration: 0.5, delay: 0.05 * idx }} className="break-inside-avoid bg-white/80 backdrop-blur-xl rounded-[24px] p-8 md:p-10 shadow-[0_8px_24px_rgba(0,0,0,0.03)] border border-slate-100 hover:-translate-y-1.5 transition-all">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />
                  ))}
                  <span className="text-amber-600 font-bold ml-1.5 text-sm">{t.rating.toFixed(1)}</span>
                </div>
              </div>
              <p className="text-slate-800 mb-8 leading-[1.65] font-medium text-[15px]">"{t.quote}"</p>
              <div className="flex items-center gap-4 pt-6 border-t border-slate-100">
                <div className="relative shrink-0">
                  <img src={t.avatar} alt={t.name} loading="lazy" className="w-12 h-12 rounded-full object-cover" />
                  <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] shadow-sm">{t.flag}</div>
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-base leading-tight">{t.name}</div>
                  <div className="text-xs font-medium text-slate-500 mt-1">{t.title}, <span className="text-indigo-600">{t.company}</span></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
