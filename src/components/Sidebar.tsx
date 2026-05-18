import { useState } from "react";
import { cn } from "../lib/utils";
import { useAuth } from "../contexts/AuthContext";
import { Search, Settings, X, ChevronDown, User, LogOut } from "lucide-react";

export type ModuleId =
  | "home"
  | "takeoff"
  | "calculators"
  | "ai"
  | "earthworks"
  | "chainage"
  | "road-pavement"
  | "house"
  | "rates"
  | "formwork"
  | "area-calculator"
  | "volume-estimator"
  | "unit-converter"
  | "metal-weight"
  | "slab-estimator"
  | "beam-calculator"
  | "eight-bar-column"
  | "ten-bar-column"
  | "beam-calculator"
  | "staircase-calculator"
  | "column-estimator"
  | "master-rcc"
  | "master-quantity"
  | "gradient-calculator"
  | "mep-calculator"
  | "interiors-finishes"
  | "geotechnical"
  | "bbs-generator"
  | "about"
  | "careers"
  | "contact"
  | "blog"
  | "my-estimates"
  | "pricing"
  | "privacy"
  | "terms"
  | "cookies";

interface SidebarProps {
  activeModule: ModuleId;
  onSelectModule: (id: ModuleId) => void;
  isOpen?: boolean;
  onClose?: () => void;
  onOpenAuth?: () => void;
  onOpenProfile?: () => void;
}

export default function Sidebar({
  activeModule,
  onSelectModule,
  isOpen,
  onClose,
  onOpenAuth,
  onOpenProfile,
}: SidebarProps) {
  const { user, logOut } = useAuth();
  const isAuthenticated = !!user;
  
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    structural: false,
    earthworks: false,
    calculators: false
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleSelect = (id: ModuleId) => {
    onSelectModule(id);
    onClose?.();
  };

  const mainCategories: { id: ModuleId; label: string }[] = [
    { id: "home", label: "Dashboard" },
    { id: "takeoff", label: "2D Takeoff" },
    { id: "house", label: "House Estimator" },
    { id: "road-pavement", label: "Road & Pavement" },
    { id: "rates", label: "Market Rates" },
  ];

  const highlights: { id: ModuleId; label: string }[] = [
    { id: "ai", label: "AI Civil Assistant" },
    { id: "master-quantity", label: "Master Quantity Estimator" },
  ];

  const structuralTools: { id: ModuleId; label: string }[] = [
    { id: "master-rcc", label: "Master RCC Estimator" },
    { id: "formwork", label: "Formwork & Scaffold" },
    { id: "interiors-finishes", label: "Interiors & Finishes" },
  ];

  const earthworksTools: { id: ModuleId; label: string }[] = [
    { id: "earthworks", label: "Earthworks Estimator" },
    { id: "chainage", label: "Road Earthworks" },
    { id: "geotechnical", label: "Geotechnical & Soil Tests" },
  ];

  const quickCalculators: { id: ModuleId; label: string }[] = [
    { id: "mep-calculator", label: "Energy & MEP" },
    { id: "area-calculator", label: "Area & Perimeter" },
    { id: "volume-estimator", label: "Volume Estimator" },
    { id: "unit-converter", label: "Unit Converter" },
    { id: "metal-weight", label: "Metal Weight" },
    { id: "gradient-calculator", label: "Gradient & Slope" },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Main Drawer */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-[110] transform transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col w-[75vw] max-w-[300px] bg-white h-[100dvh] shadow-2xl",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header Row */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
          <div className="text-[18px] font-black tracking-tighter text-slate-900 uppercase">
            Esti<span className="text-[#1A1A1A]">Pro</span>
          </div>
          <div className="flex items-center space-x-6 text-slate-900">
            <button aria-label="Search" className="hover:text-slate-500 transition-colors">
              <Search className="w-5 h-5 stroke-[2.5]" />
            </button>
            <button onClick={onClose} aria-label="Close menu" className="hover:text-slate-500 transition-colors bg-slate-100 p-1.5 rounded-full">
              <X className="w-5 h-5 stroke-[2]" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <nav className="flex-1 overflow-y-auto w-full px-5 py-5 scrollbar-hide bg-white">
          
          {/* Main Categories */}
          <div className="flex flex-col space-y-4 mb-6">
            {mainCategories.map((item) => (
              <button 
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`flex justify-between items-center w-full group text-left ${activeModule === item.id ? 'text-[#1A1A1A]' : 'text-slate-900'}`}
              >
                <span className="text-[16px] font-bold tracking-tight group-hover:text-slate-600 transition-colors">
                  {item.label}
                </span>
              </button>
            ))}
          </div>

          {/* Special Highlights */}
          <div className="flex flex-col space-y-3 mb-6">
            {highlights.map((item) => (
              <button 
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`text-left text-[14px] font-bold transition-colors ${activeModule === item.id ? 'text-rose-600' : 'text-rose-500 hover:text-rose-600'}`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-slate-100 mb-4" />

          {/* Structural Tools */}
          <div className="mb-3">
            <button 
              onClick={() => toggleSection('structural')}
              className="flex items-center justify-between w-full py-1.5 group"
            >
              <h3 className="text-[12px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-slate-600 transition-colors">
                Structural & Finishings
              </h3>
              <ChevronDown className={cn("w-4 h-4 text-slate-300 transition-transform", expandedSections.structural && "rotate-180")} />
            </button>
            
            {expandedSections.structural && (
              <div className="flex flex-col space-y-3 mt-3 mb-2 animate-in slide-in-from-top-2 fade-in duration-200">
                {structuralTools.map((item) => (
                  <button 
                    key={item.id}
                    onClick={() => handleSelect(item.id)}
                    className={`text-left text-[14px] transition-colors font-medium ${activeModule === item.id ? 'text-[#1A1A1A] font-bold' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="w-full h-px bg-slate-50 mb-3" />

          {/* Earthworks Tools */}
          <div className="mb-3">
            <button 
              onClick={() => toggleSection('earthworks')}
              className="flex items-center justify-between w-full py-1.5 group"
            >
              <h3 className="text-[12px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-slate-600 transition-colors">
                Earthworks & Roads
              </h3>
              <ChevronDown className={cn("w-4 h-4 text-slate-300 transition-transform", expandedSections.earthworks && "rotate-180")} />
            </button>
            
            {expandedSections.earthworks && (
              <div className="flex flex-col space-y-3 mt-3 mb-2 animate-in slide-in-from-top-2 fade-in duration-200">
                {earthworksTools.map((item) => (
                  <button 
                    key={item.id}
                    onClick={() => handleSelect(item.id)}
                    className={`text-left text-[14px] transition-colors font-medium ${activeModule === item.id ? 'text-[#1A1A1A] font-bold' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="w-full h-px bg-slate-50 mb-3" />

          {/* Quick Calculators */}
          <div className="mb-4">
            <button 
              onClick={() => toggleSection('calculators')}
              className="flex items-center justify-between w-full py-1.5 group"
            >
              <h3 className="text-[12px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-slate-600 transition-colors">
                Quick Calculators
              </h3>
              <ChevronDown className={cn("w-4 h-4 text-slate-300 transition-transform", expandedSections.calculators && "rotate-180")} />
            </button>
            
            {expandedSections.calculators && (
              <div className="flex flex-col space-y-3 mt-3 mb-2 animate-in slide-in-from-top-2 fade-in duration-200">
                {quickCalculators.map((item) => (
                  <button 
                    key={item.id}
                    onClick={() => handleSelect(item.id)}
                    className={`text-left text-[14px] transition-colors font-medium ${activeModule === item.id ? 'text-[#1A1A1A] font-bold' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>

        </nav>

        {/* Footer actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 shrink-0">
          {isAuthenticated ? (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 mb-2 px-2">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-[#1A1A1A] font-bold overflow-hidden border border-blue-200">
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span>{user?.displayName?.[0]?.toUpperCase() || <User className="w-5 h-5" />}</span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-bold text-slate-800 truncate">{user?.displayName || "User"}</p>
                  <p className="text-[12px] text-slate-500 truncate">{user?.email}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => { onClose?.(); onOpenProfile?.(); }}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-[13px] font-bold text-slate-700 bg-white border border-slate-200 shadow-sm hover:bg-slate-50 transition-colors"
                >
                  <Settings className="w-4 h-4" /> Account
                </button>
                <button
                  onClick={async () => { await logOut(); onClose?.(); }}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-[13px] font-bold text-red-600 bg-white border border-slate-200 shadow-sm hover:bg-red-50 hover:border-red-100 transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <button
                onClick={() => { onClose?.(); onOpenAuth?.(); }}
                className="w-full py-3 rounded-full text-[14px] font-bold text-[#888888] bg-transparent border border-black/5 shadow-none hover:text-[#1A1A1A] transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => { onClose?.(); onOpenAuth?.(); }}
                className="w-full py-3 rounded-full text-[14px] font-bold text-[#EDED78] bg-[#1A1A1A] shadow-sm hover:bg-black transition-colors"
              >
                Get Started
              </button>
            </div>
          )}
        </div>

      </aside>
    </>
  );
}
