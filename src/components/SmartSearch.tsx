import React, { useState, useEffect, useRef, useCallback } from "react";
import { Search, Loader2, Sparkles, Mic, FileText, BarChart, HardHat, Triangle, X, Clock, Settings, Building, Map, Zap, FileSpreadsheet, Box } from "lucide-react";
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
}

export default function SmartSearch({ onSelect }: SmartSearchProps) {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    // Check cache
    const cacheKey = `search_cache_${searchQuery.toLowerCase()}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      setResults(JSON.parse(cached));
      setIsSearching(false);
      return;
    }

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
          localStorage.setItem(cacheKey, JSON.stringify(data.results));
          setResults(data.results);
        } else {
          setResults([]);
        }
      } else {
        setResults([]);
      }
    } catch (e) {
      console.error(e);
      setResults([]);
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
      setIsSearching(true);
      timeoutRef.current = setTimeout(() => {
        performSearch(value);
      }, 400);
    } else {
      setResults([]);
      setIsSearching(false);
    }
  };

  const handleSelect = (toolId: string) => {
    setShowDropdown(false);
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
      performSearch(transcript);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <div className="relative w-full z-50" ref={dropdownRef}>
      <div 
        className={`flex items-center w-full h-[60px] md:h-[70px] bg-white dark:bg-slate-900 border-2 transition-all duration-300 rounded-[2rem] shadow-lg ${showDropdown && query ? 'border-indigo-500 shadow-indigo-500/20' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}`}
        onClick={() => inputRef.current?.focus()}
      >
        <div className="pl-6 md:pl-8 pr-4 flex items-center justify-center h-full">
          {isSearching ? (
             <Loader2 className="w-5 h-5 md:w-6 md:h-6 text-indigo-500 animate-spin" />
          ) : (
             <Search className="w-5 h-5 md:w-6 md:h-6 text-slate-400 dark:text-slate-500" />
          )}
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setShowDropdown(true)}
          placeholder="Ask anything (e.g. 'slab steel required', 'plot floors limit')..."
          className="w-full h-full bg-transparent border-none outline-none text-[16px] md:text-[18px] font-medium text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 px-2 cursor-text"
        />
        <div className="mr-3 pr-2 flex items-center gap-1">
          {query && (
            <button onClick={(e) => { e.stopPropagation(); setQuery(""); setResults([]); inputRef.current?.focus(); }} className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors duration-200">
              <X className="w-5 h-5" />
            </button>
          )}
          <div className="h-6 w-[2px] bg-slate-200 dark:bg-slate-800 mx-1 hidden sm:block"></div>
          <button 
            type="button"
            onClick={(e) => { e.stopPropagation(); startVoiceSearch(); }}
            className={`p-3 rounded-full transition-all duration-200 shadow-sm ${isListening ? 'bg-red-50 text-red-500 animate-pulse' : 'bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400'}`}
          >
            <Mic className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Suggested Results Dropdown */}
      {showDropdown && query.trim().length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-3 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden z-50 py-4 max-h-[70vh] flex flex-col">
          <div className="px-6 mb-3 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-500" /> AI Semantic Search
            </span>
          </div>
          
          <div className="overflow-y-auto px-4 flex-1">
            {isSearching ? (
              <div className="space-y-3 py-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse flex items-center gap-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-3xl">
                    <div className="w-12 h-12 rounded-2xl bg-slate-200 dark:bg-slate-700"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-full w-1/3"></div>
                      <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full w-2/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : results.length > 0 ? (
              <div className="space-y-3 pb-2">
                {results.map((result, idx) => {
                  const fullModuleData = ALL_MODULES.find(m => m.id === result.toolId);
                  
                  return (
                    <div 
                      key={idx} 
                      onClick={() => handleSelect(result.toolId)}
                      className="group cursor-pointer flex flex-col sm:flex-row items-center gap-4 bg-slate-50 hover:bg-indigo-50 dark:bg-slate-800/30 dark:hover:bg-indigo-900/20 p-4 rounded-3xl transition-all border border-transparent hover:border-indigo-100 dark:hover:border-indigo-800/50"
                    >
                      <div className={`w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center shadow-md
                        ${fullModuleData ? fullModuleData.colorClass : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200'}`}
                        style={fullModuleData?.styleStyle === "glass" ? { background: "transparent" } : {}}
                      >
                         {fullModuleData?.icon ? <fullModuleData.icon className="w-7 h-7" /> : <Box className="w-7 h-7" />}
                      </div>
                      
                      <div className="flex-1 w-full text-center sm:text-left">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                          <h4 className="font-bold text-[17px] text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                            {result.toolName}
                          </h4>
                          <span className="hidden sm:inline bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 text-[11px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                            {result.category}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                          {result.matchReason}
                        </p>
                      </div>

                      {fullModuleData?.estimatedTime && (
                        <div className="hidden lg:flex shrink-0 items-center justify-end gap-3 text-sm text-slate-500 font-medium">
                           <div className="flex items-center gap-1"><Clock className="w-4 h-4"/> {fullModuleData.estimatedTime}</div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : query.length >= 2 ? (
              <div className="text-center py-10">
                <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">No exact tool found</h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
                  We couldn't find a dedicated tool for "{query}", but our AI Assistant can probably answer your construction question in seconds.
                </p>
                <button 
                  onClick={() => handleSelect("ai")}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-full inline-flex items-center gap-2 shadow-lg transition-transform hover:-translate-y-0.5"
                >
                  <Sparkles className="w-5 h-5" />
                  Ask AI Assistant Instead
                </button>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
