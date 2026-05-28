import React, { useState } from "react";
import { FileSpreadsheet, CheckCircle2, Gift, Download, Smartphone, Mail, User, ShieldCheck, Check } from "lucide-react";

export default function ExcelPromo() {
  const [formData, setFormData] = useState({ name: "", email: "", whatsapp: "" });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="w-full max-w-[1400px] mx-auto px-4 lg:px-8 mb-20 animate-in fade-in duration-500">
        <div className="bg-gradient-to-br from-yellow-400 to-amber-500 rounded-[2rem] p-8 md:p-16 text-center text-slate-900 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-xl">
              <Check className="w-12 h-12 text-green-500" />
            </div>
            <h2 className="text-3xl md:text-5xl font-black mb-4 uppercase tracking-tight text-white drop-shadow-md">
              Success! Check your Email
            </h2>
            <p className="text-lg md:text-xl font-bold text-amber-900 mb-8 max-w-xl mx-auto">
              Your free Excel Estimation Pack has been sent to your email and WhatsApp. Happy Estimating!
            </p>
            <button 
              onClick={() => setIsSubmitted(false)}
              className="px-6 py-2 bg-black/10 hover:bg-black/20 text-slate-900 font-bold rounded-lg transition-colors"
            >
              Back to Form
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 lg:px-8 mb-20">
      <div className="bg-gradient-to-br from-[#ffd700] via-[#ffb900] to-[#ffaa00] rounded-[2.5rem] p-1 md:p-2 shadow-[0_20px_50px_rgba(255,170,0,0.3)] relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none transition-transform duration-700 group-hover:scale-110 group-hover:rotate-12">
          <FileSpreadsheet className="w-64 h-64 text-white" />
        </div>
        
        {/* Golden Border Wrapper */}
        <div className="bg-white/95 backdrop-blur-2xl rounded-[2.2rem] p-6 md:p-10 lg:p-12 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          
          {/* Left Column: Content */}
          <div className="space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black uppercase tracking-wider text-xs px-4 py-1.5 rounded-full mb-6 shadow-md shadow-orange-500/20">
                <Gift className="w-4 h-4" /> 100% Free Download
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight mb-4 tracking-tight drop-shadow-sm">
                Get the Ultimate <br className="hidden md:block"/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">
                  Excel Estimation Pack
                </span>
              </h2>
              <p className="text-lg text-slate-500 font-medium drop-shadow-sm">
                The most comprehensive construction calculation templates, pre-formatted and ready to use in Excel.
              </p>
            </div>

            <div className="space-y-4">
              {[
                "Measurement Sheets (6 trades)",
                "Auto BOQ Generator",
                "Material Takeoff Sheet",
                "Cost Summary Sheet",
                "Bar Bending Schedule",
                "Rate Analysis Templates"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  </div>
                  <span className="font-bold text-slate-700">{item}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-200">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                <FileSpreadsheet className="w-4 h-4" /> Excel-Based
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                <ShieldCheck className="w-4 h-4" /> Fully Editable
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                <Download className="w-4 h-4" /> Lifetime Use
              </div>
            </div>
          </div>

          {/* Right Column: Lead Form */}
          <div className="bg-slate-50/80 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-slate-200 shadow-xl relative">
            <div className="absolute -top-4 -right-4 w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center border-4 border-white shadow-lg z-10 animate-pulse">
               <Smartphone className="w-5 h-5 text-white" />
            </div>

            <div className="mb-6 text-center">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Where should we send it?</h3>
              <p className="text-sm text-slate-500">Delivered instantly via Email & WhatsApp.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="text" 
                    required 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Engineer Name"
                    className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-amber-500 font-medium text-slate-900 placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="email" 
                    required 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="your@email.com"
                    className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-amber-500 font-medium text-slate-900 placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">WhatsApp Number</label>
                <div className="relative">
                  <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="tel" 
                    required 
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                    placeholder="+91 900 0000000"
                    className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-amber-500 font-medium text-slate-900 placeholder:text-slate-400"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white font-black text-[17px] py-4 rounded-xl flex items-center justify-center gap-2 shadow-[0_8px_30px_rgba(249,115,22,0.3)] hover:shadow-[0_8px_40px_rgba(249,115,22,0.5)] transition-all hover:-translate-y-1 active:scale-95 border border-white/10 mt-4"
              >
                <Download className="w-6 h-6" />
                GET FREE EXCEL PACK
              </button>
              <p className="text-xs text-center text-slate-500 mt-4">
                We respect your privacy. No spam, ever.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
