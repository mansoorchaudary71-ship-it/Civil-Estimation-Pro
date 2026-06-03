import React, { useState, useEffect } from "react";
import { Home, Clock, Save, Share2, User, X, MessageCircle, Mail, Copy } from "lucide-react";
import toast from "react-hot-toast";

export default function BottomNavBar({
  activeModule,
  onNavigate,
  onOpenProfile,
  onOpenHistory,
}: {
  activeModule: string;
  onNavigate: (module: string) => void;
  onOpenProfile: () => void;
  onOpenHistory: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Do NOT appear on the home/landing page or other non-tool static pages
  const isStaticPage = [
    "home",
    "about",
    "careers",
    "contact",
    "blog",
    "pricing",
    "privacy",
    "terms",
    "cookies",
  ].includes(activeModule || "home");

  if (isStaticPage) {
    return null;
  }

  const handleSave = () => {
    const saved = JSON.parse(localStorage.getItem("saved_results") || "[]");
    
    // Attempt to read result if possible, or just save generic message
    const resultElement = document.getElementById("estimation-result");
    const resultText = resultElement ? resultElement.innerText : "Result saved successfully";

    if (!resultElement) {
        toast("Nothing specific to save yet, but page bookmarked!", { icon: "ℹ️" });
    } else {
        toast.success("Result saved ✓");
    }

    const newSaved = [
      {
        toolName: activeModule,
        result: resultText,
        timestamp: new Date().toISOString(),
      },
      ...saved,
    ].slice(0, 50); // Keep last 50

    localStorage.setItem("saved_results", JSON.stringify(newSaved));
  };

  const handleShare = () => {
    // Show our custom unified bottom share menu
    setIsShareOpen(true);
  };

  const handleNativeShare = async () => {
    const url = window.location.href;
    const title = document.title || "Civil Estimation Pro";
    const resultElement = document.getElementById("estimation-result");
    const resultText = resultElement ? resultElement.innerText : "Check out this civil engineering calculation.";

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: resultText,
          url,
        });
        setIsShareOpen(false);
        return;
      } catch (err) {
        console.log("Share aborted:", err);
      }
    } else {
        copyToClipboard();
    }
  };

  const copyToClipboard = () => {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
      setIsShareOpen(false);
  };

  const navItems = [
    { id: "home", icon: Home, label: "Home", action: () => onNavigate("home") },
    { id: "history", icon: Clock, label: "History", action: onOpenHistory },
    { id: "save", icon: Save, label: "Save", action: handleSave },
    { id: "share", icon: Share2, label: "Share", action: handleShare },
    { id: "profile", icon: User, label: "Profile", action: onOpenProfile },
  ];

  return (
    <>
      <div
        className="fixed left-4 right-4 z-[9998] bg-white border border-slate-200 md:hidden flex justify-around items-center shadow-[0_8px_30px_rgba(0,0,0,0.12)] rounded-full h-[56px] px-2"
        style={{ bottom: "calc(1rem + env(safe-area-inset-bottom))" }}
      >
        {navItems.map((item) => {
          const isActive = activeModule === item.id;
          
          return (
            <button
              key={item.id}
              onClick={item.action}
              className={`flex flex-col items-center justify-center flex-1 h-full gap-0.5 p-0 transition-colors rounded-full ${
                isActive ? "text-[#F59E0B]" : "text-slate-400"
              } hover:bg-slate-50`}
            >
              <item.icon 
                className="w-5 h-5" 
                strokeWidth={isActive ? 2.5 : 2} 
                fill={isActive ? "currentColor" : "none"} 
              />
              <span className="text-[10px] font-medium tracking-tight">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      {isShareOpen && (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-end p-4 font-sans pointer-events-auto md:hidden">
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setIsShareOpen(false)}
          />
          <div
            className="relative w-full bg-white rounded-t-3xl rounded-b-3xl shadow-2xl z-10 overflow-hidden font-sans border border-slate-200"
            style={{ animation: "modalSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards" }}
          >
            <style>{` @keyframes modalSlideUp { from { opacity: 0; transform: translateY(100%); } to { opacity: 1; transform: translateY(0); } } `}</style>
            
            <div className="pt-5 pb-4 px-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Share Tool</h3>
                <p className="text-xs text-slate-500 font-medium">Share your calculation or the tool link</p>
              </div>
              <button onClick={() => setIsShareOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500 bg-white shadow-sm border border-slate-200">
                <X className="w-5 h-5"/>
              </button>
            </div>

            <div className="p-4 flex flex-col gap-3">
              <button
                onClick={handleNativeShare}
                className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 text-sm font-bold bg-[#F59E0B]/10 text-[#F59E0B] hover:bg-[#F59E0B]/20 active:scale-[0.98]"
              >
                <div className="p-2 rounded-xl bg-white text-[#F59E0B] shadow-sm shrink-0">
                  <Share2 className="w-5 h-5" />
                </div>
                Share Menu / More Options...
              </button>

              <button
                onClick={() => {
                  const url = encodeURIComponent(window.location.href);
                  window.open(`https://wa.me/?text=${url}`, "_blank");
                  setIsShareOpen(false);
                }}
                className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 text-sm font-bold bg-green-50 text-green-700 hover:bg-green-100 active:scale-[0.98]"
              >
                <div className="p-2 rounded-xl bg-white text-green-500 shadow-sm shrink-0">
                  <MessageCircle className="w-5 h-5" />
                </div>
                WhatsApp
              </button>

              <button
                onClick={() => {
                  const url = encodeURIComponent(window.location.href);
                  const title = encodeURIComponent(document.title);
                  window.open(`mailto:?subject=${title}&body=Check out this link: ${url}`, "_self");
                  setIsShareOpen(false);
                }}
                className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 text-sm font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 active:scale-[0.98]"
              >
                <div className="p-2 rounded-xl bg-white text-blue-500 shadow-sm shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                Email
              </button>

              <button
                onClick={copyToClipboard}
                className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 text-sm font-bold bg-slate-50 text-slate-700 hover:bg-slate-100 active:scale-[0.98]"
              >
                <div className="p-2 rounded-xl bg-white text-slate-500 shadow-sm shrink-0">
                  <Copy className="w-5 h-5" />
                </div>
                Copy Link
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
