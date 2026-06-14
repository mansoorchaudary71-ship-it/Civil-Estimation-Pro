import React from "react";
import { useInView } from "react-intersection-observer";
import { Star } from "lucide-react";
import { motion } from "motion/react";

const TESTIMONIALS = [
  {
    name: "Michael R.",
    title: "Civil Engineer",
    quote:
      "Civil Estimation Pro has completely transformed how I handle BOQ preparations. What used to take hours of manual Excel entries now takes minutes, with zero calculation errors.",
    rating: 5.0,
    initials: "MR"
  },
  {
    name: "Sarah K.",
    title: "Quantity Surveyor",
    quote:
      "The concrete mix design and structural estimators are incredibly accurate. It perfectly handles complex slab and footing calculations while adhering to standard codes.",
    rating: 5.0,
    initials: "SK"
  },
  {
    name: "David T.",
    title: "Contractor",
    quote:
      "For residential projects, the quick rough estimation tool gives me an accurate baseline for client quotes in under 5 minutes. I've won more bids since using this.",
    rating: 5.0,
    initials: "DT"
  }
];

const ShimmerStar = () => (
  <div className="relative">
    <Star className="w-5 h-5 fill-purple-500 text-purple-500" />
    <motion.div
      className="absolute inset-0 bg-white/50 rounded-full blur-[2px]"
      animate={{ opacity: [0, 0.8, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: "linear", repeatDelay: Math.random() * 2 }}
    />
  </div>
);

export default function SocialProofSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <div className="w-full py-16 md:py-24 relative overflow-hidden bg-transparent mb-12" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Subtle purple radial glow at center */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-100/50 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">
            Trusted by <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">10,000+</span> Engineers
          </h2>
        </div>

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {TESTIMONIALS.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.6, delay: idx * 0.15, ease: "easeOut" }}
              className="group bg-white rounded-3xl p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 hover:shadow-[0_15px_40px_rgb(0,0,0,0.08)] transition-all duration-300 flex flex-col"
            >
              <div className="flex items-center gap-1.5 mb-6">
                {[...Array(5)].map((_, i) => (
                  <ShimmerStar key={i} />
                ))}
              </div>
              
              <p className="text-gray-600 text-lg leading-relaxed mb-8 flex-1">
                "{t.quote}"
              </p>
              
              <div className="flex items-center gap-4 mt-auto">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                  {t.initials}
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-base">{t.name}</div>
                  <div className="text-sm text-purple-600 font-medium tracking-wide">{t.title}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}