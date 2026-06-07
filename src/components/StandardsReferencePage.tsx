import React, { useState } from "react";
import { Search, BookOpen, ShieldCheck, ArrowRight, Download } from "lucide-react";

export const standardsData = [
  {
    id: "is-456",
    code: "IS 456:2000",
    title: "Plain and Reinforced Concrete",
    country: "India",
    category: "Concrete",
    description: "The primary Indian Standard code of practice for general structural use of plain and reinforced concrete. Covers design clauses, material specifications, and workmanship.",
    toolIds: ["concrete-advanced", "house"],
    toolNames: ["Concrete Mix Design", "House Estimator"],
    pdfLink: "/assets/standards/is-456.pdf"
  },
  {
    id: "is-800",
    code: "IS 800:2007",
    title: "General Construction in Steel",
    country: "India",
    category: "Steel",
    description: "Code of practice for general construction in steel, transitioning from working stress method to limit state design method for structural steel detailing.",
    toolIds: ["interactive-steel", "house"],
    toolNames: ["Interactive Steel Calculator", "House Estimator"],
    pdfLink: "/assets/standards/is-800.pdf"
  },
  {
    id: "is-10262",
    code: "IS 10262:2019",
    title: "Concrete Mix Proportioning",
    country: "India",
    category: "Concrete",
    description: "Guidelines for proportioning of concrete mixes to achieve specified characteristics like workability, compressive strength, and durability.",
    toolIds: ["concrete-advanced"],
    toolNames: ["Concrete Mix Design"],
    pdfLink: "/assets/standards/is-10262.pdf"
  },
  {
    id: "is-1200",
    code: "IS 1200",
    title: "Method of Measurement",
    country: "India",
    category: "Quantity",
    description: "Standardizes the method of measurement of building and civil engineering works for preparation of estimates and bills of quantities.",
    toolIds: ["house", "qs-workflow"],
    toolNames: ["House Estimator", "BOQ Generator"],
    pdfLink: "/assets/standards/is-1200.pdf"
  },
  {
    id: "bcp-2021",
    code: "BCP-2021",
    title: "Building Code of Pakistan",
    country: "Pakistan",
    category: "Building",
    description: "Seismic provisions and general building construction guidelines for structural, fire, and life safety in Pakistan. Formulated by the PEC.",
    toolIds: ["house", "staircase-calculator"],
    toolNames: ["House Estimator", "Staircase Calculator"],
    pdfLink: "/assets/standards/bcp-2021.pdf"
  },
  {
    id: "nha-specs",
    code: "NHA Specs",
    title: "NHA General Specifications",
    country: "Pakistan",
    category: "Infrastructure",
    description: "Standard specifications for road and bridge works by the National Highway Authority (NHA) of Pakistan, detailing earthwork, sub-base, and asphalt provisions.",
    toolIds: ["earthwork-advanced"],
    toolNames: ["Earthwork"],
    pdfLink: "/assets/standards/nha-specs.pdf"
  },
  {
    id: "pec-bidding",
    code: "PEC Documents",
    title: "Standard Bidding Documents",
    country: "Pakistan",
    category: "Management",
    description: "Pakistan Engineering Council (PEC) standard guidelines for procurement of civil works, contracting, and BOQ formulations.",
    toolIds: ["qs-workflow"],
    toolNames: ["BOQ Generator"],
    pdfLink: "/assets/standards/pec-bidding.pdf"
  },
  {
    id: "dbc",
    code: "DBC",
    title: "Dubai Building Code",
    country: "UAE",
    category: "Building",
    description: "Comprehensive code designed to unify building design across Dubai, focusing on structural stability, safety, sustainability, and accessibility.",
    toolIds: ["house", "lintel-design-tool"],
    toolNames: ["House Estimator", "Lintel Scheduler"],
    pdfLink: "/assets/standards/dbc.pdf"
  },
  {
    id: "adibc",
    code: "ADIBC",
    title: "Abu Dhabi International Building Code",
    country: "UAE",
    category: "Building",
    description: "Based on the International Building Code (IBC) with tailored amendments for the Emirate of Abu Dhabi to regulate commercial and residential construction.",
    toolIds: ["house"],
    toolNames: ["House Estimator"],
    pdfLink: "/assets/standards/adibc.pdf"
  },
  {
    id: "uae-fire",
    code: "UAE FLSC",
    title: "UAE Fire and Life Safety Code",
    country: "UAE",
    category: "Safety",
    description: "Mandatory civil defense requirements for fire protection systems, egress strategies, and facade safety across all Emirates.",
    toolIds: ["qs-workflow"],
    toolNames: ["BOQ Generator"],
    pdfLink: "/assets/standards/uae-fire.pdf"
  },
  {
    id: "morth",
    code: "MORTH",
    title: "Specifications for Road & Bridge Works",
    country: "International",
    category: "Infrastructure",
    description: "Ministry of Road Transport and Highways (MORTH) specifications serving as the backbone for highway estimations, pavement design, and testing.",
    toolIds: ["earthwork-advanced"],
    toolNames: ["Earthwork"],
    pdfLink: "/assets/standards/morth.pdf"
  },
  {
    id: "irc-37",
    code: "IRC:37-2018",
    title: "Flexible Pavement Design",
    country: "International",
    category: "Infrastructure",
    description: "Guidelines for the design of flexible pavements, calculating traffic loadings (msa), and determining layer thicknesses for bituminous roads.",
    toolIds: ["earthwork-advanced"],
    toolNames: ["Earthwork"],
    pdfLink: "/assets/standards/irc-37.pdf"
  }
];

export default function StandardsReferencePage({ onNavigate, initialActiveCountry = "All" }: { onNavigate?: (id: string) => void, initialActiveCountry?: string }) {
  const [activeCountry, setActiveCountry] = useState(initialActiveCountry);
  const [searchTerm, setSearchTerm] = useState("");

  const countries = ["All", "India", "Pakistan", "UAE", "International"];

  const filteredStandards = standardsData.filter(std => {
    const matchesCountry = activeCountry === "All" || std.country === activeCountry;
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = std.code.toLowerCase().includes(searchLower) || std.title.toLowerCase().includes(searchLower);
    return matchesCountry && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#0A0F1E] font-sans pb-24">
      {/* Header Section */}
      <div className="bg-gradient-to-b from-[#0D1525] to-[#0A0F1E] border-b border-slate-800/60 pt-20 pb-16 px-6 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full bg-amber-500/5 blur-[120px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
          <BookOpen className="w-12 h-12 text-amber-500 mb-6" />
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight mb-6 relative">
            Engineering <span className="text-amber-500">Standards & Codes</span> Hub
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl leading-relaxed mb-10">
            A comprehensive reference library of the civil engineering standards, specifications, and building codes powering our estimation tools across key international markets.
          </p>

          <div className="w-full max-w-xl relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              placeholder="Search by code (e.g. 'IS 456') or title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0D1525] border border-slate-700/50 rounded-xl py-4 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-transparent shadow-inner"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-10">
        {/* Country Filter */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          {countries.map(country => (
            <button
              key={country}
              onClick={() => setActiveCountry(country)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all shadow-sm
                ${activeCountry === country 
                  ? 'bg-amber-500 text-slate-900 shadow-[0_0_15px_rgba(245,158,11,0.3)]' 
                  : 'bg-slate-800/60 text-slate-400 border border-slate-700/50 hover:bg-slate-700 hover:text-white'
                }`}
            >
              {country}
            </button>
          ))}
        </div>

        {/* Standards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStandards.length > 0 ? (
            filteredStandards.map(std => (
              <div 
                key={std.id} 
                className="bg-[#0D1525] border border-slate-800 rounded-2xl p-6 flex flex-col group hover:border-amber-500/30 hover:shadow-[0_8px_30px_rgba(245,158,11,0.05)] transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="font-mono text-sm font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 px-3 py-1 rounded-lg">
                    {std.code}
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-bold text-slate-500 bg-slate-900/50 px-2 py-1 rounded">
                    <ShieldCheck className="w-3 h-3 text-slate-400" />
                    {std.country}
                  </div>
                </div>

                <div className="mb-2">
                   <span className={`text-[10px] inline-block uppercase font-bold tracking-widest mb-2 px-2 py-0.5 rounded-full ${
                      std.category === 'Concrete' ? 'bg-blue-500/10 text-blue-400' :
                      std.category === 'Steel' ? 'bg-slate-500/10 text-slate-400' :
                      std.category === 'Building' ? 'bg-amber-500/10 text-amber-400' :
                      std.category === 'Infrastructure' ? 'bg-emerald-500/10 text-emerald-400' :
                      std.category === 'Safety' ? 'bg-red-500/10 text-red-400' :
                      'bg-indigo-500/10 text-indigo-400'
                   }`}>
                    {std.category}
                   </span>
                   <h3 className="text-xl font-bold text-white group-hover:text-amber-50 transition-colors">
                    {std.title}
                   </h3>
                </div>

                <p className="text-sm text-slate-400 leading-relaxed mb-6 flex-grow">
                  {std.description}
                </p>

                {std.pdfLink && (
                  <div className="mb-6">
                    <a
                      href={std.pdfLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      className="inline-flex items-center gap-2 px-3 py-2 bg-slate-800/80 hover:bg-amber-500 hover:text-slate-900 border border-slate-700/50 rounded-lg text-sm font-semibold text-slate-300 transition-colors w-max"
                    >
                      <Download className="w-4 h-4" />
                      Download PDF
                    </a>
                  </div>
                )}

                <div className="pt-5 border-t border-slate-800/60">
                  <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-3">Integrations</p>
                  <div className="flex flex-wrap gap-2">
                    {std.toolNames.map((tool, idx) => (
                      <button
                        key={idx}
                        onClick={() => onNavigate?.(std.toolIds[idx])}
                        className="text-xs font-semibold px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 hover:text-amber-400 border border-slate-700/50 rounded-md text-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        {tool}
                        <ArrowRight className="w-3 h-3 opacity-50" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))
          ) : (
             <div className="col-span-full py-20 text-center">
               <BookOpen className="w-12 h-12 text-slate-700 mx-auto mb-4" />
               <h3 className="text-lg font-bold text-slate-300 mb-2">No standards found</h3>
               <p className="text-slate-500">Try adjusting your search term or country filter.</p>
             </div>
          )}
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 bg-gradient-to-r from-amber-500/10 to-[#0A0F1E] border border-amber-500/20 rounded-3xl p-8 md:p-12 text-center max-w-4xl mx-auto relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px] pointer-events-none"></div>
           <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 relative z-10">Ready to put these standards into practice?</h2>
           <p className="text-slate-400 mb-8 max-w-xl mx-auto relative z-10">Access 55+ professional civil engineering calculators and tools that automatically apply these specific country codes to your estimates.</p>
           <button onClick={() => {
              if (onNavigate) {
                 onNavigate('home');
              } else {
                 window.location.href = '/#tools';
              }
           }} className="px-8 py-4 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] relative z-10">
             Explore All Tools
           </button>
        </div>
      </div>
    </div>
  );
}
