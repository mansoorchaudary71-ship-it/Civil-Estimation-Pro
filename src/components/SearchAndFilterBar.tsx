import React, { useEffect, useRef, useState } from "react";
import { Search, Sparkles } from "lucide-react";

export interface SearchAndFilterBarProps {
  categories: { name: string; count: number }[];
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  totalFilteredCount: number;
  allTools?: { id: string; name: string; category: string }[];
  onSelectModule?: (id: string, inputs?: any) => void;
}

export default function SearchAndFilterBar({
  categories,
  activeCategory,
  setActiveCategory,
  searchTerm,
  setSearchTerm,
  totalFilteredCount,
  allTools = [],
  onSelectModule,
}: SearchAndFilterBarProps) {
  const popularSearches = ["Concrete Volume", "Steel Weight", "Cost Estimate"];
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [showSuggestions, setShowSuggestions] = useState(false);

  const getSuggestions = () => {
    if (!searchTerm.trim() || !allTools.length) return [];
    const term = searchTerm.toLowerCase();
    return allTools
      .filter(
        (tool) =>
          tool.name.toLowerCase().includes(term) ||
          tool.category.toLowerCase().includes(term)
      )
      .slice(0, 6);
  };

  const suggestions = getSuggestions();

  useEffect(() => {
    const activeTab = tabRefs.current[activeCategory];
    if (activeTab) {
      activeTab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [activeCategory]);

  return (
    <div id="tools" className="sticky top-[64px] z-40 bg-[#eef2f6]/95 backdrop-blur-md border-b border-white/50 py-4 w-full shadow-sm">
      <div className="max-w-7xl mx-auto px-4 w-full flex flex-col gap-4">
        
        {/* Search Bar */}
        <div className="w-full max-w-2xl">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
              <Search className="w-5 h-5 text-slate-600 group-focus-within:text-indigo-500 transition-colors" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder="Search tools, materials, or calculations..."
              className="relative w-full bg-[#f8fafc] border border-slate-200 rounded-full py-4 pl-12 pr-4 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all shadow-[inset_2px_2px_6px_rgba(163,177,198,0.3),inset_-2px_-2px_6px_rgba(255,255,255,0.8)] text-base"
            />

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                {suggestions.map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => {
                      if (onSelectModule) {
                        setSearchTerm("");
                        setShowSuggestions(false);
                        onSelectModule(tool.id);
                      } else {
                        setSearchTerm(tool.name);
                        setShowSuggestions(false);
                      }
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-slate-50 border-b border-slate-50 last:border-0 flex items-center justify-between transition-colors group/item rounded-full active:scale-95 hover:-translate-y-0.5 hover:shadow-lg shadow-sm"
                  >
                    <span className="text-base font-medium group-hover/item:text-indigo-600 transition-colors">{tool.name}</span>
                    <span className="text-base font-medium tracking-wider uppercase text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">{tool.category}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Popular Chips (hidden mobile, visible md+) */}
          <div className="hidden md:flex items-center gap-2 mt-3 pl-1">
            <span className="text-base font-medium uppercase tracking-wider text-slate-600 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-indigo-400" /> Popular:
            </span>
            {popularSearches.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => setSearchTerm(chip)}
                className="text-sm font-medium text-slate-500 bg-white hover:bg-indigo-50 hover:text-indigo-600 px-3 py-1.5 rounded-full transition-colors border border-slate-200 shadow-sm active:scale-95 hover:-translate-y-0.5"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Category Tabs */}
        <div className="relative w-full overflow-hidden mt-2 md:mt-4">
          {/* Right fade gradient overlay for mobile scroll indicator */}
          <div className="absolute right-0 top-0 bottom-0 w-[40px] bg-gradient-to-l from-[#eef2f6] to-transparent pointer-events-none z-10 md:hidden" />
          
          <div className="flex gap-3 overflow-x-auto scrollbar-hide relative items-center pb-2 px-1 filter-tab-row snap-x snap-mandatory">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.name;
              return (
                 <button
                  key={cat.name}
                  ref={(el) => { tabRefs.current[cat.name] = el; }}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`
                    relative flex items-center justify-center flex-shrink-0 gap-2 px-5 py-2.5 rounded-full whitespace-nowrap transition-all duration-300 snap-start
                    ${isActive 
                      ? "bg-indigo-600 text-white font-bold shadow-[0_4px_12px_rgba(79,70,229,0.3)] border border-indigo-500" 
                      : "bg-[#F0F4F8] text-slate-500 hover:text-slate-700 shadow-[2px_2px_6px_rgba(163,177,198,0.3),-2px_-2px_6px_rgba(255,255,255,0.8)] border border-white"}
                  `}
                >
                  <span className="text-sm rounded-full transition-all duration-300 active:scale-95 hover:-translate-y-0.5 hover:shadow-lg shadow-sm">{cat.name}</span>
                  <span 
                    className={`
                      flex items-center justify-center px-2 py-0.5 text-base font-medium rounded-full
                      ${isActive ? "bg-indigo-800 text-indigo-100" : "bg-slate-200 text-slate-500"}
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
        <div className="text-sm font-medium text-slate-500 pl-1 mt-1">
          Showing <span className="text-slate-800 font-bold">{totalFilteredCount}</span> tools in <span className="text-indigo-600 font-bold">{activeCategory}</span>
        </div>

      </div>
    </div>
  );
}

