import { Sparkles } from "lucide-react";

interface AIEstimatorBannerProps {
  onOpenChat: () => void;
}

export default function AIEstimatorBanner({ onOpenChat }: AIEstimatorBannerProps) {
  return (
    <div className="mt-8 mb-4 w-full relative group overflow-hidden rounded-[32px] border border-white/10 bg-slate-900 backdrop-blur-md">
      {/* Floating Particles Animation */}
      <style>{`
        @keyframes float-particle {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0; }
          25% { opacity: 0.5; }
          50% { transform: translateY(-20px) translateX(10px); opacity: 0; }
        }
        .animate-float-1 { animation: float-particle 4s infinite ease-in-out; }
        .animate-float-2 { animation: float-particle 5s infinite ease-in-out 1s; }
        .animate-float-3 { animation: float-particle 4.5s infinite ease-in-out 2s; }
        .animate-float-4 { animation: float-particle 5.5s infinite ease-in-out 0.5s; }
      `}</style>

      {/* Ambient Glow */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Subtle radial gradients for dark mode glow */}
        <div className="absolute -top-1/2 -left-1/4 w-[150%] h-[150%] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none mix-blend-screen"></div>
        <div className="absolute top-1/2 -right-1/4 w-96 h-96 bg-purple-500/10 blur-[100px] rounded-full pointer-events-none mix-blend-screen"></div>
      </div>

      <div className="relative z-10 p-8 flex flex-col md:flex-row items-center justify-between gap-8 h-full">
        <div className="flex items-start md:items-center gap-6 flex-col md:flex-row w-full md:w-auto">
          {/* Logo / Icon */}
          <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 shadow-inner border border-white/10 backdrop-blur-md">
            <Sparkles className="w-7 h-7 text-white/80" />
          </div>
          <div>
            <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 mb-2">
              Meet Your AI Estimator
            </h3>
            <p className="text-slate-400 max-w-lg mb-5 text-[15px] leading-relaxed">
              Describe your project naturally. We will automatically build your entire BOQ.
            </p>
            
            {/* Capability Chips */}
            <div className="flex flex-wrap gap-2">
              {["BOQ Generation", "Cost Estimation", "Material Takeoff", "Code Lookup"].map((chip) => (
                <span key={chip} className="text-[11px] uppercase tracking-wider font-semibold px-3 py-1.5 bg-white/5 text-slate-300 rounded-full backdrop-blur-sm">
                  {chip}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center shrink-0 w-full md:w-auto mt-4 md:mt-0">
          <button 
            onClick={onOpenChat} 
            className="w-full md:w-auto px-8 py-3.5 bg-white text-black font-semibold shadow-lg shadow-white/10 hover:bg-slate-100 transition-all rounded-xl border border-white/20 hover:scale-[1.02] active:scale-95"
          >
            Start Chat
          </button>
          <p className="mt-4 tracking-widest text-xs text-slate-500 uppercase font-medium">
            Free to use · No sign-up required
          </p>
        </div>
      </div>
    </div>
  );
}
