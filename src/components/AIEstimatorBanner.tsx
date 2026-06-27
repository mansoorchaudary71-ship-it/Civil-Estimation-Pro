import { Sparkles } from "lucide-react";

interface AIEstimatorBannerProps {
  onOpenChat: () => void;
}

export default function AIEstimatorBanner({ onOpenChat }: AIEstimatorBannerProps) {
  return (
    <div className="mt-8 mb-4 w-full relative group overflow-hidden rounded-[32px] border border-slate-200 bg-gradient-to-r from-[#166534] to-[#FFFFFF]">
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

      {/* Floating Dots */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-1.5 h-1.5 bg-green-400 rounded-full animate-float-1 blur-[1px]"></div>
        <div className="absolute top-3/4 left-1/3 w-2 h-2 bg-green-400 rounded-full animate-float-2 blur-[1px] opacity-0"></div>
        <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-blue-400 rounded-full animate-float-3 blur-[1px] opacity-0"></div>
        <div className="absolute bottom-1/4 right-1/3 w-2 h-2 bg-blue-400 rounded-full animate-float-4 blur-[1px] opacity-0"></div>
      </div>

      {/* Radial Glow Overlay */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 w-32 h-32 bg-green-500/20 rounded-full blur-[40px] pointer-events-none z-0"></div>

      <div className="relative z-10 p-8 flex flex-col md:flex-row items-center justify-between gap-8 h-full">
        <div className="flex items-start md:items-center gap-6 flex-col md:flex-row w-full md:w-auto">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#166534] to-[#15803d] flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(22,101,52,0.5)] border border-green-500/30">
            <Sparkles className="w-8 h-8 text-gray-900" />
          </div>
          <div>
            <h3 className="md: mb-2 flex items-center gap-3 text-lg font-medium text-gray-800 mb-4">
              Meet Your AI Estimator
            </h3>
            <p className="text-green-100/70 max-w-lg mb-4 md: text-base font-normal text-gray-600 leading-relaxed">
              Describe your project naturally. We will automatically build your entire BOQ.
            </p>
            
            {/* Capability Chips */}
            <div className="flex flex-wrap gap-2">
              {["BOQ Generation", "Cost Estimation", "Material Takeoff", "Code Lookup"].map((chip) => (
                <span key={chip} className="text-xs uppercase font-bold tracking-wider px-3 py-1 bg-[#FFFFFF]/50 text-gray-700 border border-slate-600 rounded-full">
                  {chip}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center shrink-0 w-full md:w-auto mt-4 md:mt-0">
          <button 
            onClick={onOpenChat} 
            className="w-full md:w-auto px-8 py-4 bg-[#FF5F15] hover:bg-[#ea580c] text-gray-900 rounded-xl shadow-[0_0_20px_rgba(255,95,21,0.3)] transition-all active:scale-95 border border-[#FF5F15] text-base font-semibold"
          >
            Start Chat
          </button>
          <p className="mt-3 uppercase tracking-wider text-center text-base font-normal text-gray-600 leading-relaxed">
            Free to use · No sign-up required
          </p>
        </div>
      </div>
    </div>
  );
}
