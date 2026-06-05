import React from "react";
import { AlertTriangle, ShieldCheck, Calendar, Globe, Code } from "lucide-react";

export interface ToolPageFooterProps {
  toolName: string;
  standards: string[];
  formulaDescription: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  lastUpdated: string;
  category: string;
}

export default function ToolPageFooter({
  toolName,
  standards,
  formulaDescription,
  difficulty,
  lastUpdated,
  category,
}: ToolPageFooterProps) {
  return (
    <div className="mt-8 space-y-3 border-t border-slate-800/60 pt-8">
      {/* Formula Transparency Box */}
      <div className="bg-[#0D1525] border border-slate-700/50 rounded-xl p-5 shadow-sm">
        <h3 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
          <Code className="w-5 h-5 text-[#F59E0B]" />
          Methodology & Standards
        </h3>
        <div className="bg-[#0A0F1E] rounded-lg p-4 mb-4 border border-slate-800">
          <p className="font-mono text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
            {formulaDescription}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {standards.length > 0 ? (
            standards.map((standard, index) => (
              <div
                key={index}
                className="flex items-center gap-1.5 bg-slate-800/50 border border-slate-700 text-slate-300 px-3 py-1.5 rounded-full text-xs font-semibold"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#F59E0B]" />
                {standard}
              </div>
            ))
          ) : (
            <div className="text-xs text-slate-500 font-medium">Standard general practice formulas applied</div>
          )}
        </div>
      </div>

      {/* Professional Disclaimer */}
      <div className="bg-[#0A0F1E] border border-amber-900/30 rounded-xl p-5 flex gap-4 items-start">
        <div className="bg-amber-500/10 p-2 rounded-lg shrink-0 mt-0.5">
          <AlertTriangle className="w-5 h-5 text-[#F59E0B]" />
        </div>
        <div>
          <h4 className="text-[#F59E0B] font-bold text-sm uppercase tracking-wider mb-1">
            Professional Liability Disclaimer
          </h4>
          <p className="text-slate-400 text-sm leading-relaxed">
            This tool is provided for educational and preliminary estimation purposes only. All calculations must be verified by a licensed professional engineer before being used in actual construction, design, or structural detailing. The creators assume no liability for direct, indirect, or consequential damages resulting from the use of this software.
          </p>
        </div>
      </div>

      {/* Metadata Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-[#0D1525] border border-slate-800 rounded-lg p-4 flex items-center gap-3">
          <Calendar className="w-5 h-5 text-slate-500" />
          <div>
            <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Last Reviewed</p>
            <p className="text-sm text-slate-300 font-medium mt-0.5">{lastUpdated}</p>
          </div>
        </div>
        <div className="bg-[#0D1525] border border-slate-800 rounded-lg p-4 flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-slate-500" />
          <div>
            <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Complexity</p>
            <p className="text-sm text-slate-300 font-medium mt-0.5">{difficulty}</p>
          </div>
        </div>
        <div className="bg-[#0D1525] border border-slate-800 rounded-lg p-4 flex items-center gap-3">
          <Globe className="w-5 h-5 text-slate-500" />
          <div>
            <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Platform Category</p>
            <p className="text-sm text-slate-300 font-medium mt-0.5">{category}</p>
          </div>
        </div>
      </div>

      {/* Related Standards Links */}
      {standards.length > 0 && (
        <div className="border border-slate-800/60 rounded-xl p-5 bg-[#0D1525]/50">
          <h4 className="text-slate-300 font-bold mb-3 text-sm">Official Standards References</h4>
          <ul className="space-y-2">
            {standards.slice(0, 3).map((standard, idx) => (
              <li key={idx} className="flex items-center gap-2 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]"></div>
                <a
                  href={`https://www.google.com/search?q=${encodeURIComponent(standard + " code civil engineering pdf")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-[#F59E0B] transition-colors"
                >
                  Search Reference Documentation for {standard} &rarr;
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
