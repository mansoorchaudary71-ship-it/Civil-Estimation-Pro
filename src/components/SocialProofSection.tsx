import React from "react";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import { Star, Users, Calculator, Globe2, Award } from "lucide-react";
import { motion } from "motion/react";

const TESTIMONIALS = [
  {
    name: "Rajesh Kumar",
    title: "Senior Quantity Surveyor",
    company: "L&T Construction",
    flag: "🇮🇳",
    quote:
      "Civil Estimation Pro has completely transformed how I handle BOQ preparations. What used to take hours of manual Excel entries now takes minutes, with zero calculation errors.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?img=11",
  },
  {
    name: "Sarah Jenkins",
    title: "Structural Engineer",
    company: "AECOM",
    flag: "🇬🇧",
    quote:
      "The concrete mix design and structural steel estimators are incredibly accurate. It perfectly handles complex slab and footing calculations while adhering to standard codes.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?img=43",
  },
  {
    name: "Ahmed Ali",
    title: "Site Engineer",
    company: "NESPAK",
    flag: "🇵🇰",
    quote:
      "As a site engineer, I need fast material calculations on my phone. This tool is a lifesaver for ordering immediate cement, sand, and brick deliveries on the spot.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?img=8",
  },
];

const LOGOS = ["IIT Delhi", "L&T Construction", "NESPAK", "PWD", "AECOM"];

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
    <div className="w-full py-16 mb-16 bg-gradient-to-b from-transparent to-slate-50/50 rounded-[3rem] border border-slate-100 overflow-hidden relative">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-bold tracking-widest uppercase mb-4 border border-indigo-100">
            Social Proof
          </div>
          <h2
            className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight"
            style={{ fontFamily: '"Clash Display", sans-serif' }}
          >
            Trusted by Engineers Who Build the World
          </h2>
          <p
            className="text-slate-500 font-medium text-lg max-w-2xl mx-auto"
            style={{ fontFamily: "Satoshi, sans-serif" }}
          >
            Join thousands of professionals relying on Civil Estimation Pro for
            precision and speed.
          </p>
        </div>

        {/* Stats Ticker */}
        <div
          ref={ref}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-16"
        >
          {STATS.map((stat) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: stat.id * 0.1 }}
              className="flex flex-col items-center justify-center p-6 bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-center hover:-translate-y-1 transition-transform"
            >
              <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-4">
                <stat.icon className="w-6 h-6" strokeWidth={2} />
              </div>
              <div
                className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight"
                style={{ fontFamily: '"Clash Display", sans-serif' }}
              >
                {inView ? (
                  <CountUp
                    start={0}
                    end={stat.value}
                    duration={2.5}
                    decimals={stat.decimals || 0}
                    prefix={stat.prefix || ""}
                    suffix={stat.suffix || ""}
                  />
                ) : (
                  "0" // Fallback rendering for SSR/before view
                )}
              </div>
              <div
                className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1"
                style={{ fontFamily: "Satoshi, sans-serif" }}
              >
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Testimonials (Horizontal scroll on mobile) */}
        <div className="flex overflow-x-auto gap-6 pb-8 md:grid md:grid-cols-3 -mx-4 px-4 md:mx-0 md:px-0 snap-x no-scrollbar">
          {TESTIMONIALS.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={
                inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }
              }
              transition={{ duration: 0.4, delay: 0.3 + idx * 0.1 }}
              className="min-w-[85vw] sm:min-w-[300px] md:min-w-0 bg-white rounded-[24px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col snap-center hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.1)] transition-all"
            >
              <div className="flex items-center gap-1 mb-6">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className="w-4 h-4 md:w-5 md:h-5 fill-[#F59E0B] text-[#F59E0B]"
                  />
                ))}
              </div>
              <p
                className="text-slate-700 italic flex-1 mb-8 leading-relaxed font-medium"
                style={{ fontFamily: "Satoshi, sans-serif" }}
              >
                "{t.quote}"
              </p>

              <div className="flex items-center gap-4 mt-auto pt-6 border-t border-slate-50">
                <img
                  src={t.avatar}
                  alt={t.name}
                  loading="lazy"
                  className="w-12 h-12 rounded-full border-2 border-indigo-50 shadow-sm"
                />
                <div>
                  <div
                    className="font-bold text-slate-900 flex items-center gap-2 text-[15px]"
                    style={{ fontFamily: '"Clash Display", sans-serif' }}
                  >
                    {t.name}{" "}
                    <span className="text-lg leading-none" title={t.flag}>
                      {t.flag}
                    </span>
                  </div>
                  <div
                    className="text-xs font-medium text-slate-500 mt-0.5"
                    style={{ fontFamily: "Satoshi, sans-serif" }}
                  >
                    {t.title},{" "}
                    <span className="font-bold text-indigo-600">
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
          className="mt-16 text-center"
        >
          <div
            className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-8"
            style={{ fontFamily: "Satoshi, sans-serif" }}
          >
            Trusted by teams at
          </div>
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
            {LOGOS.map((logo, i) => (
              <span
                key={i}
                className="text-xl md:text-2xl font-extrabold text-slate-600 tracking-tight"
                style={{ fontFamily: '"Clash Display", sans-serif' }}
              >
                {logo}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
