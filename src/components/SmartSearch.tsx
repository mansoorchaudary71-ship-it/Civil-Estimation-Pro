import React, { useState, useEffect, useRef } from "react";
import { Search, Loader2, Sparkles, Mic, X, Clock, Box } from "lucide-react";
import { ALL_MODULES } from "./Dashboard";

interface SmartSearchProps {
  onSelect: (id: string, query?: string) => void;
}

interface SearchResult {
  toolId: string;
  toolName: string;
  category: string;
  matchReason: string;
  confidenceScore: number;
  isLocal?: boolean;
}

// TIER 2: SYNONYM MAPPING & CATEGORIZATION
const SYNONYM_MAP: Record<string, string[]> = {
  "mix design": ["concrete", "cement", "quantity surveyor"],
  "bricks": ["masonry", "brickwork", "wall"],
  "rebar": ["steel", "reinforcement", "bar bending", "bbs"],
  "bbs": ["steel", "bar bending schedule"],
  "slump": ["concrete", "workability", "test"],
  "excavation": ["earthwork", "cut", "fill", "grading", "digging"],
  "water": ["tank", "sump", "plumbing", "capacity"],
  "paint": ["finishing", "painting", "wall", "interior"],
  "plaster": ["mortar", "finishing", "wall"],
  "slab": ["concrete", "rcc", "roof", "deck"],
  "column": ["pillar", "rcc", "concrete"],
  "footing": ["foundation", "base", "rcc"],
  "beam": ["rcc", "concrete"],
  "tile": ["flooring", "ceramic", "finishing"],
  "wood": ["timber", "carpentry", "doors", "windows"],
};

export default function SmartSearch({ onSelect }: SmartSearchProps) {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [localResults, setLocalResults] = useState<SearchResult[]>([]);
  const [aiResults, setAiResults] = useState<SearchResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const localSearch = (searchQuery: string): SearchResult[] => {
    const q = searchQuery.toLowerCase().replace(/[^\w\s]/g, "");
    if (!q) return [];
    const words = q.split(/\s+/).filter(w => w.length > 1);

    const matchedSynonyms: string[] = [];
    for (const [key, synonyms] of Object.entries(SYNONYM_MAP)) {
      if (q.includes(key) || words.some(w => key.includes(w))) {
        matchedSynonyms.push(...synonyms);
      }
    }

    const searchTerms = [...new Set([...words, ...matchedSynonyms])];

    const results = ALL_MODULES.map(module => {
      let score = 0;
      const title = module.title.toLowerCase();
      const desc = (module.desc || "").toLowerCase();
      const category = module.category.toLowerCase();
      
      // Fuzzy matching
      searchTerms.forEach(term => {
        if (title.includes(term)) score += 10;
        if (desc.includes(term)) score += 3;
        if (category.includes(term)) score += 2;
      });

      if (q === title) score += 50;

      return { module, score };
    }).filter(r => r.score > 0).sort((a, b) => b.score - a.score);

    return results.slice(0, 4).map(r => ({
      toolId: r.module.id,
      toolName: r.module.title,
      category: r.module.category,
      matchReason: `Matched via keyword or category (${r.module.category})`,
      confidenceScore: r.score > 15 ? 0.9 : 0.6,
      isLocal: true,
    }));
  };

  const performAISearch = async (searchQuery: string, existingLocalIds: string[]) => {
    setIsSearching(true);
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery })
      });
      if (res.ok) {
        const data = await res.json();
        // Track analytics
        const history = JSON.parse(localStorage.getItem('search_history') || '[]');
        history.push({ query: searchQuery, timestamp: new Date().toISOString(), resultsCount: data.results?.length || 0 });
        localStorage.setItem('search_history', JSON.stringify(history.slice(-100)));

        if (data.results && data.results.length > 0) {
          // Filter out those already in localResults
          const newAiResults = data.results.filter((r: SearchResult) => !existingLocalIds.includes(r.toolId));
          setAiResults(newAiResults);
        } else {
          setAiResults([]);
        }
      } else {
        setAiResults([]);
      }
    } catch (e) {
      console.error(e);
      setAiResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setShowDropdown(true);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (value.trim().length >= 2) {
      const locals = localSearch(value);
      setLocalResults(locals);

      // TIER 3: Fallback or augment using AI
      setIsSearching(true);
      timeoutRef.current = setTimeout(() => {
        performAISearch(value, locals.map(l => l.toolId));
      }, 600);
    } else {
      setLocalResults([]);
      setAiResults([]);
      setIsSearching(false);
    }
  };

  const handleSelect = (toolId: string) => {
    setShowDropdown(false);
    setIsFocused(false);
    onSelect(toolId, query);
    
    // Log to backend analytics
    fetch("/api/analytics/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, clickedTool: toolId })
    }).catch(e => console.error("Analytics error", e));

    setQuery("");
  };

  const startVoiceSearch = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice search is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setShowDropdown(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      setIsListening(false);
      
      const locals = localSearch(transcript);
      setLocalResults(locals);
      performAISearch(transcript, locals.map(l => l.toolId));
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const hasResults = localResults.length > 0 || aiResults.length > 0;
  const isCompletelyEmpty = query.length >= 2 && !isSearching && !hasResults;

  return (
    <div className="relative w-full z-50" ref={dropdownRef}>
      <div 
        className={`flex items-center w-full h-[60px] md:h-[70px] bg-[var(--bg-surface-glass)] backdrop-blur-xl border border-[var(--border-light)] transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] rounded-full shadow-sm hover:shadow-md ${isFocused || showDropdown && query ? 'ring-2 ring-[var(--accent-primary)] ring-opacity-50 border-transparent bg-white dark:bg-[#151821]' : ''}`}
        onClick={() => inputRef.current?.focus()}
      >
        <div className="pl-6 md:pl-8 pr-4 flex items-center justify-center h-full">
          {isSearching ? (
             <Loader2 className="w-5 h-5 md:w-6 md:h-6 text-[var(--accent-primary)] animate-spin" />
          ) : (
             <Search className={`w-5 h-5 md:w-6 md:h-6 transition-colors duration-300 ${isFocused ? 'text-[var(--accent-primary)]' : 'text-[var(--text-secondary)]'}`} />
          )}
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => { setIsFocused(true); if(query) setShowDropdown(true); }}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          placeholder="Search tools, materials, or 'how much concrete...'"
          className="w-full h-full bg-transparent border-none outline-none text-[16px] md:text-[18px] font-medium text-[var(--text-primary)] placeholder-[var(--text-secondary)] px-2 cursor-text"
        />
        <div className="mr-3 pr-2 flex items-center gap-1">
          {query && (
            <button onClick={(e) => { e.stopPropagation(); setQuery(""); setLocalResults([]); setAiResults([]); inputRef.current?.focus(); }} className="p-2.5 rounded-full hover:bg-[var(--border-light)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors duration-200">
              <X className="w-5 h-5" />
            </button>
          )}
          <div className="h-6 w-[1px] bg-[var(--border-light)] mx-1 hidden sm:block"></div>
          <button 
            type="button"
            onClick={(e) => { e.stopPropagation(); startVoiceSearch(); }}
            className={`p-3 rounded-full transition-all duration-300 ${isListening ? 'bg-red-50 text-red-500 animate-pulse' : 'hover:bg-[var(--border-light)] text-[var(--text-secondary)] hover:text-[var(--accent-primary)]'}`}
          >
            <Mic className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Suggested Results Dropdown */}
      {showDropdown && query.trim().length > 0 && (
        <div className="absolute top-[calc(100%+12px)] left-0 right-0 bg-[var(--bg-surface-glass)] backdrop-blur-[20px] rounded-[24px] border border-[var(--border-light)] shadow-[0_20px_40px_rgba(0,0,0,0.08)] overflow-hidden z-50 flex flex-col animate-in fade-in slide-in-from-top-2 duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] will-change-transform">
          <div className="overflow-y-auto max-h-[70vh] flex-1 p-2 md:p-3">
            
            {/* Suggested Tools (Tier 1 & 2) */}
            {localResults.length > 0 && (
              <div className="mb-4">
                <div className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)]">
                  Suggested Tools & Calculators
                </div>
                <div className="space-y-1">
                  {localResults.map((result, idx) => {
                    const fullModuleData = ALL_MODULES.find(m => m.id === result.toolId);
                    return (
                      <div 
                        key={`local-${idx}`} 
                        onClick={() => handleSelect(result.toolId)}
                        className="group cursor-pointer flex flex-col sm:flex-row items-center gap-4 bg-transparent hover:bg-white/60 dark:hover:bg-white/5 p-3 rounded-2xl transition-all duration-200 hover:shadow-sm hover:-translate-y-[1px]"
                      >
                        <div className="w-12 h-12 shrink-0 rounded-xl flex items-center justify-center shadow-sm bg-white dark:bg-slate-800 border border-[var(--border-light)] text-[var(--accent-primary)] group-hover:scale-105 transition-transform duration-300">
                           {fullModuleData?.icon ? <fullModuleData.icon className="w-6 h-6" /> : <Box className="w-6 h-6" />}
                        </div>
                        
                        <div className="flex-1 w-full text-center sm:text-left">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-0.5">
                            <h4 className="font-bold text-[16px] text-[var(--text-primary)]">
                              {result.toolName}
                            </h4>
                            <span className="hidden sm:inline bg-[var(--border-light)] text-[var(--text-secondary)] text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                              {result.category}
                            </span>
                          </div>
                          <p className="text-xs text-[var(--text-secondary)] font-medium">
                            {result.matchReason}
                          </p>
                        </div>

                        {fullModuleData?.estimatedTime && (
                          <div className="hidden lg:flex shrink-0 items-center justify-end gap-2 text-xs text-[var(--text-secondary)] font-medium bg-[var(--bg-main)] px-2 py-1 rounded-lg">
                             <Clock className="w-3.5 h-3.5"/> {fullModuleData.estimatedTime}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* AI Insights (Tier 3) */}
            {(aiResults.length > 0 || (isSearching && localResults.length === 0)) && (
              <div className="mb-2 relative rounded-[20px] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-primary)] to-[#8A2BE2] opacity-[0.03] z-0"></div>
                <div className="relative z-10 p-2 border-t border-[var(--border-light)]">
                  <div className="px-3 py-2 text-xs font-bold uppercase tracking-widest text-[var(--accent-primary)] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> AI Insights / Smart Suggestions
                  </div>
                  
                  {isSearching ? (
                     <div className="space-y-2 p-2 relative">
                       {[1, 2].map(i => (
                         <div key={i} className="animate-pulse flex items-center gap-4 p-3 rounded-2xl">
                           <div className="w-12 h-12 rounded-xl bg-[var(--border-light)]"></div>
                           <div className="flex-1 space-y-2">
                             <div className="h-3 bg-[var(--border-light)] rounded-full w-1/3"></div>
                             <div className="h-2 bg-[var(--border-light)] rounded-full w-2/3"></div>
                           </div>
                         </div>
                       ))}
                     </div>
                  ) : (
                    <div className="space-y-1">
                      {aiResults.map((result, idx) => {
                        const fullModuleData = ALL_MODULES.find(m => m.id === result.toolId);
                        return (
                          <div 
                            key={`ai-${idx}`} 
                            onClick={() => handleSelect(result.toolId)}
                            className="group cursor-pointer flex flex-col sm:flex-row items-center gap-4 bg-transparent hover:bg-white/80 dark:hover:bg-white/10 p-3 rounded-2xl transition-all duration-200 hover:shadow-sm border border-transparent hover:border-[var(--accent-primary)]/20"
                          >
                            <div className="w-12 h-12 shrink-0 rounded-xl flex items-center justify-center shadow-sm bg-[var(--bg-main)] border border-[var(--border-light)] text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors duration-300">
                               {fullModuleData?.icon ? <fullModuleData.icon className="w-6 h-6" /> : <Box className="w-6 h-6" />}
                            </div>
                            
                            <div className="flex-1 w-full text-center sm:text-left">
                              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-0.5">
                                <h4 className="font-bold text-[16px] text-[var(--text-primary)]">
                                  {result.toolName}
                                </h4>
                              </div>
                              <p className="text-xs text-[var(--text-secondary)] font-medium">
                                {result.matchReason}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Empty State */}
            {isCompletelyEmpty && (
              <div className="text-center py-10 px-4">
                <div className="w-16 h-16 bg-[var(--bg-main)] border border-[var(--border-light)] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-[var(--text-secondary)]" />
                </div>
                <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">No exact tool found</h3>
                <p className="text-sm text-[var(--text-secondary)] max-w-sm mx-auto mb-6">
                  Looking for "{query}"? We don't have a dedicated tool, but our AI Assistant can likely calculate it for you.
                </p>
                <button 
                  onClick={() => handleSelect("ai")}
                  className="bg-gradient-to-r from-[var(--accent-primary)] to-[#8A2BE2] bg-cover text-white font-bold py-3 px-6 rounded-full inline-flex items-center gap-2 shadow-[0_8px_16px_var(--accent-glow)] transition-transform hover:scale-[1.02] active:scale-[0.98]"
                  style={{ background: 'var(--accent-gradient)' }}
                >
                  <Sparkles className="w-5 h-5 text-white" />
                  Ask AI Assistant to Calculate
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

