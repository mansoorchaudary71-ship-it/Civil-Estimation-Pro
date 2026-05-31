import React from "react";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import { Star, Users, Calculator, Globe2, Award, Play, CheckCircle2, MapPin } from "lucide-react";
import { motion } from "motion/react";

const TESTIMONIALS = [
  { name: "Rajesh Kumar", title: "Senior Quantity Surveyor", company: "L&T Construction", flag: "IN", quote: "Civil Estimation Pro has completely transformed how I handle BOQ preparations. What used to take hours of manual Excel entries now takes minutes, with zero calculation errors.", rating: 5.0, metrics: "Saved 8 hours/week", avatar: "https://i.pravatar.cc/150?img=11" },
  { name: "Sarah Jenkins", title: "Structural Engineer", company: "AECOM", flag: "UK", quote: "The concrete mix design and structural steel estimators are incredibly accurate. It perfectly handles complex slab and footing calculations while adhering to standard codes.", rating: 4.8, metrics: "Reduced BOQ errors by 94%", avatar: "https://i.pravatar.cc/150?img=43" },
  { name: "Ahmed Ali", title: "Site Engineer", company: "NESPAK", flag: "PK", quote: "As a site engineer, I need fast material calculations on my phone. This tool is a lifesaver for ordering immediate cement, sand, and brick deliveries on the spot.", rating: 4.9, metrics: "100% on-site accuracy", avatar: "https://i.pravatar.cc/150?img=8" },
  { name: "David Chen", title: "Project Manager", company: "Gammon India", flag: "SG", quote: "We deployed this across our entire site team. The ability to instantly generate bar bending schedules has streamlined our steel procurement massively.", rating: 5.0, metrics: "Cut steel waste by 12%", avatar: "https://i.pravatar.cc/150?img=15" },
  { name: "Priya Desai", title: "Cost Estimator", company: "Shapoorji Pallonji", flag: "IN", quote: "I've tried many QS software, but this is by far the most intuitive. The precast wall and cage estimators save me from doing tedious manual math.", rating: 4.8, metrics: "$40k saved in software", avatar: "https://i.pravatar.cc/150?img=20" },
  { name: "Michael Torres", title: "Independent Contractor", company: "Torres Build", flag: "US", quote: "For small to medium residential projects, the quick rough estimation tool gives me an accurate baseline for client quotes in under 5 minutes.", rating: 4.9, metrics: "Won 3x more bids", avatar: "https://i.pravatar.cc/150?img=33" },
  { name: "Elena Rostova", title: "Geotechnical Engineer", company: "GeoTech Pro", flag: "AU", quote: "The soil tests calculators like CBR and Direct Shear are perfectly aligned with lab standards. A great digital companion for field data entry.", rating: 5.0, metrics: "Zero calculation errors", avatar: "https://i.pravatar.cc/150?img=40" },
  { name: "Karan Singh", title: "Civil Contractor", company: "Singh Builders", flag: "IN", quote: "From anti-termite chemical calculations to simple brickwork estimators, it's my go-to app every morning before starting site operations.", rating: 4.8, metrics: "30% faster planning", avatar: "https://i.pravatar.cc/150?img=50" },
  { name: "Fatima Zahra", title: "Architectural Drafter", company: "Design Studio", flag: "AE", quote: "The interiors and finishes section helps me quickly validate material quantities with my contractors. I trust the numbers completely.", rating: 4.9, metrics: "Streamlined communication", avatar: "https://i.pravatar.cc/150?img=5" }
];

const AnimatedStat = ({ stat, inView }: { stat: any, inView: boolean }) => {
  const [isFinished, setIsFinished] = React.useState(false);

  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }} transition={{ duration: 0.5, delay: stat.id * 0.1 }} className="flex flex-col items-center justify-center p-6 md:p-8 bg-white/70 backdrop-blur-xl rounded-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.04)] border border-slate-100 text-center hover:-translate-y-1 transition-all">
      <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-4 border border-indigo-100/50">
        <stat.icon className="w-6 h-6" strokeWidth={2.5} />
      </div>
      <motion.div 
        animate={isFinished ? { scale: [1, 1.1, 1] } : { scale: 1 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="text-4xl md:text-5xl lg:text-[3.5rem] font-black tracking-tighter text-slate-900 flex items-baseline font-heading">
        {inView ? <CountUp start={0} end={stat.value} duration={2} decimals={stat.decimals || 0} prefix={stat.prefix || ""} separator="," onEnd={() => setIsFinished(true)} /> : "0"}
        {stat.suffix && <span className="text-xl md:text-2xl ml-1 text-slate-500">{stat.suffix}</span>}
      </motion.div>
      <div className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-3">{stat.label}</div>
    </motion.div>
  );
};

const STATS = [
  { id: 1, label: "Engineers", value: 24847, suffix: "+", icon: Users },
  { id: 2, label: "Calculations", value: 2.1, prefix: "", suffix: "M", decimals: 1, icon: Calculator },
  { id: 3, label: "Countries", value: 15, suffix: "+", icon: Globe2 },
  { id: 4, label: "Rating", value: 4.9, suffix: "*", decimals: 1, icon: Award }
];

const LOGOS = ["L&T Construction", "AECOM", "NESPAK", "Gammon India", "Shapoorji Pallonji"];

export default function SocialProofSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <div className="w-full py-16 md:py-24 mb-16 bg-slate-50 rounded-[3rem] border border-slate-200 overflow-hidden relative">
      <div className="max-w-7rxl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase mb-6">Wall of Love</div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-slate-900 mb-6 font-heading">Trusted by the Top 1% of Engineers</h2>
          <p className="text-slate-600 font-medium text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">Join 24,847+ professionals across 15 countries relying on Civil Estimation Pro for precision and speed.</p>
        </div>

        <div ref={ref} className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-8 mb-24">
          {STATS.map((stat) => (
            <AnimatedStat key={stat.id} stat={stat} inView={inView} />
          ))}
        </div>

                <div className="relative w-full overflow-hidden -mx-4 sm:-mx-6 px-4 sm:px-6 space-y-6 pb-4">
          <div className="track gap-6">
            {[...TESTIMONIALS.slice(0, 5), ...TESTIMONIALS.slice(0, 5)].map((t, idx) => (
              <div key={`row1-${idx}`} className="w-[350px] md:w-[400px] shrink-0 bg-white/80 backdrop-blur-xl rounded-[24px] p-8 md:p-10 shadow-[0_8px_32px_rgba(0,0,0,0.03)] border border-slate-100 hover:-translate-y-1.5 transition-all">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => ( <Star key={s} className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" /> ))}
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
              </div>
            ))}
          </div>
          
          <div className="track track-reverse gap-6">
            {[...TESTIMONIALS.slice(5), ...TESTIMONIALS.slice(5)].map((t, idx) => (
              <div key={`row2-${idx}`} className="w-[350px] md:w-[400px] shrink-0 bg-white/80 backdrop-blur-xl rounded-[24px] p-8 md:p-10 shadow-[0_8px_32px_rgba(0,0,0,0.03)] border border-slate-100 hover:-translate-y-1.5 transition-all">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => ( <Star key={s} className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" /> ))}
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
              </div>
            ))}
          </div>

          <div className="absolute inset-y-0 left-0 w-8 md:w-24 bg-gradient-to-r from-[#f8fafc] to-transparent pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-8 md:w-24 bg-gradient-to-l from-[#f8fafc] to-transparent pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
