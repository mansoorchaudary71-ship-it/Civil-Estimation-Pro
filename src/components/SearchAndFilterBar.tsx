import React from "react";
import { Search, Sparkles } from "lucide-react";

interface SearchAndFilterBarProps {
  categories: { name: string; count: number }[];
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  totalFilteredCount: number;
}

export default function SearchAndFilterBar({
  categories,
  activeCategory,
  setActiveCategory,
  searchTerm,
  setSearchTerm,
  totalFilteredCount,
}: SearchAndFilterBarProps) {
  const popularSearches = ["Concrete Volume", "Steel Weight", "Cost Estimate"];

  return (
    <div id="tools" className="sticky top-[64px] z-40 bg-[#0A0F1E]/95 backdrop-blur-md border-b border-slate-800/60 py-4 w-full">
      <div className="max-w-7xl mx-auto px-4 w-full flex flex-col gap-4">
        
        {/* Search Bar */}
        <div className="w-full max-w-2xl">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-slate-400 group-focus-within:text-[#F59E0B] transition-colors" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search tools, materials, or calculations..."
              className="w-full bg-[#0B1120] border border-slate-700/50 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all shadow-inner"
            />
          </div>
          
          {/* Popular Chips (hidden mobile, visible md+) */}
          <div className="hidden md:flex items-center gap-2 mt-3 pl-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#F59E0B]" /> Popular:
            </span>
            {popularSearches.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => setSearchTerm(chip)}
                className="text-xs font-medium text-slate-300 bg-slate-800/50 hover:bg-slate-700 hover:text-white px-2.5 py-1 rounded-md transition-colors border border-slate-700"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Category Tabs */}
        <div className="relative w-full overflow-hidden mt-1 md:mt-2">
          {/* Right fade gradient overlay for mobile scroll indicator */}
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#0A0F1E] to-transparent pointer-events-none z-10 md:hidden" />
          
          <div className="flex gap-3 overflow-x-auto scrollbar-hide relative items-center pb-2 px-1">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.name;
              return (
                <button
                  key={cat.name}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`
                    relative flex items-center justify-center flex-shrink-0 gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all duration-300 border
                    ${isActive 
                      ? "bg-amber-500 text-black font-bold border-transparent shadow-[0_0_12px_rgba(245,158,11,0.4)]" 
                      : "bg-slate-800/60 text-slate-400 border-slate-700/50 hover:bg-slate-700 hover:text-white"}
                  `}
                >
                  <span>{cat.name}</span>
                  <span 
                    className={`
                      flex items-center justify-center px-1.5 py-0.5 text-[0.65rem] font-bold rounded-full
                      ${isActive ? "bg-black/20 text-black" : "bg-slate-900/50 text-slate-500"}
                    `}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Count Line */}
        <div className="text-sm font-medium text-slate-400 pl-1 mt-1">
          Showing <span className="text-white">{totalFilteredCount}</span> tools in <span className="text-[#F59E0B]">{activeCategory}</span>
        </div>

      </div>
    </div>
  );
}
