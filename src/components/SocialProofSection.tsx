import React from "react";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import {
  Star,
  Users,
  Calculator,
  Globe2,
  Award,
  Play,
  CheckCircle2,
  MapPin,
} from "lucide-react";
import { motion } from "motion/react";

const TESTIMONIALS = [
  {
    name: "Rajesh Kumar",
    title: "Senior Quantity Surveyor",
    company: "L&T Construction",
    flag: "🇮🇳",
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
    flag: "🇬🇧",
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
    flag: "🇵🇰",
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
    flag: "🇸🇬",
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
    flag: "🇮🇳",
    quote:
      "I’ve tried many QS software, but this is by far the most intuitive. The precast wall and cage estimators save me from doing tedious manual math.",
    rating: 4.8,
    metrics: "$40k saved in software",
    avatar: "https://i.pravatar.cc/150?img=20",
  },
  {
    name: "Michael Torres",
    title: "Independent Contractor",
    company: "Torres Build",
    flag: "🇺🇸",
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
    flag: "🇦🇺",
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
    flag: "🇮🇳",
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
    flag: "🇦🇪",
    quote:
      "The interiors and finishes section helps me quickly validate material quantities with my contractors. I trust the numbers completely.",
    rating: 4.9,
    metrics: "Streamlined communication",
    avatar: "https://i.pravatar.cc/150?img=5",
  },
];

const LOGOS = [
  "L&T Construction",
  "AECOM",
  "NESPAK",
  "Gammon India",
  "Shapoorji Pallonji",
];

const STATS = [
  { id: 1, label: "Engineers", value: 24847, suffix: "+", icon: Users },
  {
    id: 2,
    label: "Calculations",
    value: 2.1,
    prefix: "",
    suffix: "M",
    decimals: 1,
    icon: Calculator,
  },
  { id: 3, label: "Countries", value: 15, suffix: "+", icon: Globe2 },
  { id: 4, label: "Rating", value: 4.9, suffix: "★", decimals: 1, icon: Award },
];

export default function SocialProofSection() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div className="w-full py-16 md:py-24 mb-16 bg-[#0A0F1E] rounded-[3rem] border border-slate-800 overflow-hidden relative">
      {/* Background Dots/Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px] opacity-20"></div>

      {/* Glows */}
      <div className="absolute -top-[30%] -left-[10%] w-[60%] h-[60%] rounded-full bg-indigo-500/10 blur-[120px] mix-blend-screen pointer-events-none"></div>
      <div className="absolute top-[40%] text-center right-[10%] w-[50%] h-[50%] rounded-full bg-amber-500/10 blur-[120px] mix-blend-screen pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-full text-[10px] font-bold tracking-widest uppercase mb-4 border border-indigo-500/20">
            Wall of Love
          </div>
          <h2
            className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6 tracking-tight"
            style={{ fontFamily: '"Clash Display", sans-serif' }}
          >
            Trusted by the Top 1% of Engineers
          </h2>
          <p
            className="text-slate-400 font-medium text-lg md:text-xl max-w-2xl mx-auto"
            style={{ fontFamily: "Satoshi, sans-serif" }}
          >
            Join 24,847+ professionals across 15 countries relying on Civil
            Estimation Pro for precision and speed.
          </p>
        </div>

        {/* Stats Ticker */}
        <div
          ref={ref}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-24"
        >
          {STATS.map((stat) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: stat.id * 0.1 }}
              className="flex flex-col items-center justify-center p-6 bg-slate-900/50 backdrop-blur-sm rounded-3xl border border-slate-800 text-center hover:-translate-y-1 transition-transform"
            >
              <div className="w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-400 mb-4 border border-indigo-500/30">
                <stat.icon className="w-6 h-6" strokeWidth={2} />
              </div>
              <div
                className="text-3xl md:text-4xl font-bold tracking-tight text-white tracking-tight flex items-baseline"
                style={{ fontFamily: '"Clash Display", sans-serif' }}
              >
                {inView ? (
                  <CountUp
                    start={0}
                    end={stat.value}
                    duration={2.5}
                    decimals={stat.decimals || 0}
                    prefix={stat.prefix || ""}
                    separator=","
                  />
                ) : (
                  "0"
                )}
                {stat.suffix && (
                  <span className="text-xl ml-1 text-slate-400">
                    {stat.suffix}
                  </span>
                )}
              </div>
              <div
                className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-1"
                style={{ fontFamily: "Satoshi, sans-serif" }}
              >
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Map & Video Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-24">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.6 }}
            className="rounded-[2rem] bg-slate-800/40 p-8 border border-slate-700/50 relative overflow-hidden flex flex-col items-center justify-center min-h-[300px]"
          >
            <div className="absolute inset-0 z-0 opacity-30 select-none flex items-center justify-center mix-blend-screen pointer-events-none">
              <svg
                viewBox="0 0 1000 500"
                className="w-[120%] h-auto fill-slate-600"
              >
                <path d="M117.8,252.1c-1.3,0-2.6-0.3-3.8-0.9c-8.9-4-20.9-10.4-23.9-11.4c-9.1-3.2-16.7-5.9-20.4-1.2c-5.5,7-3.9,12.7,4.3,28.6  c1.3,2.6,2.3,4.9,3,7.2c3.4,11.2,1,16.5-6.7,21.5c-4.4,2.9-9.5,4.3-15.1,4.3c-0.2,0-0.4,0-0.6,0c-11.5-0.3-21.7-4.1-28.5-8.1  c-3.2-1.9-6-3.8-8.5-5.6C5.5,278,2.7,276.1,2.5,276c-0.3,0.3-2,1.8-4.2,4.4c-9.5,11.2-15.5,18.3-25.1,19.3c-2,0.2-4.1-0.2-5.7-1  c-6.1-3-12.7-8-19.1-13.6c-4.6-4.1-8.9-8.4-12.7-12.8v-0.1c-13.7-15.7-31.5-57.9-16.1-99c5-13.3,13.5-24,24.4-30.8  c1.4-0.8,2.8-1.5,4.3-2.1l0,0c9.1-4.2,16.8-5,21.2-2.1c2.4,1.6,4.1,4.5,4.8,8.2c1,5.2-1.7,14-8.1,26c-3.1,5.8-6,11.2-8.3,16h0  c-3.8,7.9-12.5,26.5-12,41.9c0.2,5.2,1.7,9.7,4.2,13.6c5,7.9,13.5,12.7,24,13.6h0.3c7.5,0,16.6-4.9,25.8-9.4c0.5-0.3,1-0.5,1.5-0.8  c2.3-1.1,4.5-2.2,6.9-3.2c5-2.2,10.6-3,16.2-2.3c8.9,1.1,16.8,5.1,22.2,11.2c2,2.3,3.7,4.8,5,7.6c3.4,7,4,13,1.7,16.6  c-0.9,1.4-2.8,2.3-5.6,2.6h-1c-2,0.1-4-0.1-5.8-0.6c-3-0.8-7.7-3.9-12-6.5c-3.3-2-6.2-3.8-8.3-4.5c4.6-2,15-7.8,22.8-11.2  c6.2-2.7,11.6-5.1,15.6-7c13.7-6.2,26.4-11,28.8-15.5c2.4-4.5,0.7-12.7-5-24h0c-1.8-3.6-5.6-7.8-10.9-12  c-6.1-4.8-14.7-11.6-23.5-18.4c-9.1-7.1-18.7-14.5-25.7-22c-7.6-8.2-12-16.7-12.7-24.8c-1.3-15.1,9.7-32.9,23.3-46.7l0.1-0.1h0  c9.2-9.2,20.8-18.4,26.5-20.7c8.3-3.3,16.7-5.5,24.4-6.3c15-1.6,27.1,5.2,34.4,19.2c1.4,2.7,8.2,16.2,12.9,26.9c2,4.5,4.7,6,7.5,6  h0.5c5.3-0.5,15.3-8,27.4-17.1c9.4-7,22.9-17,32-17c3.9,0,7,2,9,5.7c3,5.6,4.3,16.8-5.3,37.2c-5,10.7-12.2,20.9-20.9,29.9  h-0.1l-0.1,0.1c-14.1,14.6-32.5,31.7-41.9,43.3c-1.1,1.4-3.5,4.4-5.4,6.7H117.8z" />
                <path d="M722.5,133.1c-6.8-23.7-22.1-46.8-49.3-74.6c-13.8-14.1-31.4-30-49.8-43.5c-20.5-15.1-40.4-26.6-49.7-30  c-3.1-1.1-6.1-1.4-8.8-0.9c-4.4,0.8-7.7,3.5-9.2,7.5c-0.2,0.5-7.5,23.2-12.7,46.9c-4,18-7.4,36.5-6.5,46.3c0.4,4.2,2.3,7,5.5,8  c-0.5,1.7-2.9,13.7-6.2,28.7c-4.8,21.8-10.4,47.4-8,64c1.1,7.9,5,15,11,19.9l0.1,0.1c11.5,9.5,31.2,13.1,54.8,10  c20.1-2.6,45.8-13.8,70.5-27c15-8,29-16.7,38.6-26.5l0.1-0.1C721.2,152.9,726.8,144.1,722.5,133.1z M654.5,74.5  c16,16,25.8,30.3,30.3,44.9l0,0c-11.5,12.5-30.8,23.3-51.5,32.4c-20.9,9.2-41.4,15.6-54.8,17l-0.2,0  c-3.2-31.9,1.7-64.8,7.9-93.5C607.7,61.8,632,67.7,654.5,74.5z" />
              </svg>
            </div>

            <div className="z-10 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-amber-500/20 rounded-2xl flex items-center justify-center text-amber-500 mb-6 border border-amber-500/30">
                <Globe2 className="w-8 h-8" strokeWidth={1.5} />
              </div>
              <h3
                className="text-2xl font-semibold text-white mb-2"
                style={{ fontFamily: '"Clash Display", sans-serif' }}
              >
                Used in 15+ Countries
              </h3>
              <p className="text-slate-400 max-w-sm mb-6">
                Engineers from the USA, UK, India, UAE, and beyond trust our
                standard-compliant calculators.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3">
                {["🇺🇸", "🇬🇧", "🇦🇺", "🇮🇳", "🇦🇪", "🇸🇬", "🇵🇰", "🇨🇦"].map(
                  (flag, idx) => (
                    <div
                      key={idx}
                      className="w-10 h-10 rounded-full bg-slate-900/50 border border-slate-700/50 flex items-center justify-center text-xl shadow-lg hover:scale-110 transition-transform"
                    >
                      {flag}
                    </div>
                  ),
                )}
                <div className="w-10 h-10 rounded-full bg-slate-900/50 border border-slate-700/50 flex items-center justify-center text-xs font-bold text-slate-400 shadow-lg">
                  +7
                </div>
              </div>
            </div>

            {/* Pulsing map markers */}
            <div className="absolute top-[30%] left-[25%] w-3 h-3 bg-indigo-500 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.8)] animate-pulse">
              <span className="absolute inset-0 rounded-full bg-indigo-500 animate-ping"></span>
            </div>
            <div
              className="absolute top-[45%] right-[30%] w-2 h-2 bg-amber-500 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.8)] animate-pulse"
              style={{ animationDelay: "0.5s" }}
            >
              <span className="absolute inset-0 rounded-full bg-amber-500 animate-ping"></span>
            </div>
            <div
              className="absolute bottom-[40%] left-[60%] w-2 h-2 bg-teal-500 rounded-full shadow-[0_0_15px_rgba(20,184,166,0.8)] animate-pulse"
              style={{ animationDelay: "1s" }}
            >
              <span className="absolute inset-0 rounded-full bg-teal-500 animate-ping"></span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-[2rem] relative overflow-hidden group cursor-pointer shadow-2xl border border-slate-800"
          >
            {/* Video Thumbnail Placeholder */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541888086225-ee53158dc979?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center transition-transform duration-700 group-hover:scale-105"></div>
            <div className="absolute inset-0 bg-slate-900/60 group-hover:bg-slate-900/40 transition-colors"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 bg-indigo-600/90 text-white rounded-full flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform shadow-[0_0_40px_rgba(79,70,229,0.5)]">
                <Play className="w-8 h-8 ml-1" fill="currentColor" />
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="flex items-center gap-4 mb-4">
                <img
                  src="https://i.pravatar.cc/150?img=60"
                  alt="Video User"
                  className="w-12 h-12 rounded-full border-2 border-white/20"
                />
                <div>
                  <h4 className="font-bold text-white text-lg">
                    Mark Sullivan
                  </h4>
                  <p className="text-slate-300 text-sm">
                    Director of Estimations at BuildCorp
                  </p>
                </div>
              </div>
              <p className="text-white/90 text-lg font-medium leading-relaxed italic">
                "It replaced a dozen complex spreadsheets and reduced our
                turnaround time by 60%. A total game-changer for our bidding
                process."
              </p>
            </div>
          </motion.div>
        </div>

        {/* Masonry Testimonials */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {TESTIMONIALS.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: 0.1 * idx }}
              className="break-inside-avoid bg-slate-800/40 rounded-[24px] p-8 shadow-xl border border-slate-700/50 hover:bg-slate-800/60 hover:border-slate-600 transition-all group"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => {
                    // Quick math to show full/partial stars based on decimal rating (4.8, 4.9, 5.0)
                    const isFilled = s <= Math.floor(t.rating);
                    const isPartial = !isFilled && s === Math.ceil(t.rating);
                    return (
                      <Star
                        key={s}
                        className={`w-4 h-4 ${isFilled || isPartial ? "fill-[#F59E0B] text-[#F59E0B]" : "fill-slate-600 text-slate-600"}`}
                      />
                    );
                  })}
                  <span className="text-amber-500 font-bold ml-1 text-sm">
                    {t.rating.toFixed(1)}
                  </span>
                </div>
              </div>

              <p
                className="text-slate-300 flex-1 mb-6 leading-relaxed font-medium"
                style={{ fontFamily: "Satoshi, sans-serif" }}
              >
                "{t.quote}"
              </p>

              <div className="mb-6 flex items-center gap-2">
                <div className="px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold flex items-center gap-1.5 border border-emerald-500/20">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {t.metrics}
                </div>
              </div>

              <div className="flex items-center gap-4 pt-6 border-t border-slate-700/50">
                <img
                  src={t.avatar}
                  alt={t.name}
                  loading="lazy"
                  className="w-12 h-12 rounded-full border-2 border-indigo-500/30"
                />
                <div>
                  <div
                    className="font-bold text-white flex items-center gap-2 text-[15px]"
                    style={{ fontFamily: '"Clash Display", sans-serif' }}
                  >
                    {t.name}{" "}
                    <span className="text-lg leading-none" title={t.flag}>
                      {t.flag}
                    </span>
                  </div>
                  <div
                    className="text-xs font-medium text-slate-400 mt-0.5"
                    style={{ fontFamily: "Satoshi, sans-serif" }}
                  >
                    {t.title},{" "}
                    <span className="text-indigo-400 font-semibold group-hover:text-indigo-300 transition-colors">
                      {t.company}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Logos Row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-24 text-center px-4"
        >
          <div
            className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-10"
            style={{ fontFamily: "Satoshi, sans-serif" }}
          >
            Trusted by teams at
          </div>
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-10 opacity-60 hover:opacity-100 transition-opacity duration-500">
            {LOGOS.map((logo, i) => (
              <div
                key={i}
                className="flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300"
              >
                <span
                  className="text-xl md:text-2xl font-semibold tracking-tight text-slate-300 hover:text-white tracking-tight leading-none"
                  style={{ fontFamily: '"Clash Display", sans-serif' }}
                >
                  {logo}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
