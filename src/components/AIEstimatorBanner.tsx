import { Sparkles } from "lucide-react";

interface AIEstimatorBannerProps {
  onOpenChat: () => void;
}

export default function AIEstimatorBanner({ onOpenChat }: AIEstimatorBannerProps) {
  return (
    <div className="mt-8 mb-4 w-full relative group rounded-[32px] border border-white/10 bg-black/40 shadow-2xl overflow-hidden backdrop-blur-lg">
      {/* Mesh Gradient Animation Styles */}
      <style>{`
        @keyframes mesh-rotate {
          0% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(180deg) scale(1.2); }
          100% { transform: rotate(360deg) scale(1); }
        }
        @keyframes mesh-pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        .animate-mesh-1 { animation: mesh-rotate 20s linear infinite; }
        .animate-mesh-2 { animation: mesh-rotate 25s linear infinite reverse; }
        .animate-mesh-3 { animation: mesh-pulse 10s ease-in-out infinite; }
      `}</style>

      {/* Ambient Mesh Glows */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-[32px]">
        {/* Animated Orbs */}
        <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[120%] rounded-full bg-indigo-600/30 blur-[100px] animate-mesh-1 mix-blend-screen"></div>
        <div className="absolute top-[10%] -right-[10%] w-[60%] h-[100%] rounded-full bg-cyan-600/20 blur-[100px] animate-mesh-2 mix-blend-screen"></div>
        <div className="absolute -bottom-[20%] left-[20%] w-[60%] h-[80%] rounded-full bg-purple-600/20 blur-[120px] animate-mesh-3 mix-blend-screen"></div>
        
        {/* Noise overlay for texture */}
        <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
      </div>

      <div className="relative z-10 p-8 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 h-full">
        <div className="flex items-start md:items-center gap-6 flex-col md:flex-row w-full md:w-auto">
          {/* Logo / Icon */}
          <div className="relative shrink-0">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-cyan-400 blur-lg opacity-40 rounded-2xl animate-mesh-3 overflow-hidden"></div>
            <div className="w-full relative w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] border border-white/20 backdrop-blur-xl transition-transform duration-500 hover:scale-105 overflow-hidden">
              <Sparkles className="w-7 h-7 text-white drop-shadow-md" />
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white via-slate-200 to-slate-400 mb-2.5 tracking-tight">
              Meet Your AI Estimator
            </h3>
            <p className="text-slate-300 max-w-lg mb-6 text-[15px] leading-relaxed font-medium">
              Describe your project naturally. We will automatically build your entire BOQ.
            </p>
            
            {/* Capability Chips */}
            <div className="flex flex-wrap gap-2.5">
              {["BOQ Generation", "Cost Estimation", "Material Takeoff", "Code Lookup"].map((chip) => (
                <span key={chip} className="w-full text-[11px] uppercase tracking-wider font-semibold px-3.5 py-1.5 bg-white/5 text-slate-300 rounded-full border border-white/10 backdrop-blur-md hover:bg-white/10 hover:border-white/20 hover:text-white transition-all duration-300 cursor-default hover:shadow-[0_0_15px_rgba(255,255,255,0.15)] hover:-translate-y-0.5 overflow-hidden">
                  {chip}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start md:items-center justify-center shrink-0 w-full md:w-auto mt-2 md:mt-0">
          <button onClick={onOpenChat} 
            className="group relative w-full md:w-auto px-8 py-4 bg-white text-slate-950 font-bold rounded-full transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_35px_rgba(255,255,255,0.3)] border border-white overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white via-slate-100 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative z-10 flex items-center justify-center gap-2 text-[15px]">
              Start Chat
              <Sparkles className="w-4 h-4 text-slate-900 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110" />
            </span>
          </button>
          <p className="mt-5 tracking-widest text-[10.5px] text-slate-400 uppercase font-bold md:mx-auto">
            Free to use · No sign-up required
          </p>
        </div>
      </div>
    </div>
  );
}
