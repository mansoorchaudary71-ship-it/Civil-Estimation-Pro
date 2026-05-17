import React, { useState, useEffect } from 'react';
import { X, ArrowRight, ArrowLeft, Home, Building, Truck, Ruler, Calculator, Box, CheckCircle2 } from 'lucide-react';
import { useGlobalSettings } from '../../context/SettingsContext';
import { ModuleId } from '../Sidebar';

interface OnboardingModalProps {
  onNavigate: (id: ModuleId) => void;
}

export function OnboardingModal({ onNavigate }: OnboardingModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { currentUnit, setCurrentUnit } = useGlobalSettings();
  const [selectedType, setSelectedType] = useState<'residential' | 'commercial' | 'infrastructure'>('residential');

  useEffect(() => {
    const hasSeen = localStorage.getItem('civilpro_has_seen_onboarding');
    if (!hasSeen) {
      const timer = setTimeout(() => setIsOpen(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('civilpro_has_seen_onboarding', 'true');
  };

  const nextStep = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setStep(s => Math.min(3, s + 1));
      setIsTransitioning(false);
    }, 300);
  };

  const prevStep = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setStep(s => Math.max(1, s - 1));
      setIsTransitioning(false);
    }, 300);
  };

  const finish = (modId?: ModuleId) => {
    handleClose();
    if (modId) {
       onNavigate(modId);
    }
  };

  if (!isOpen) return null;

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className={`space-y-6 transition-all duration-300 ${isTransitioning ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}`}>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-[#111111] dark:text-white mb-2">What are you building?</h2>
              <p className="text-[#111111]/60 dark:text-white/60 text-sm">We'll personalize your Civil Pro experience.</p>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              {[
                { id: 'residential', title: 'Residential', icon: Home, desc: 'Homes, villas & small apartments' },
                { id: 'commercial', title: 'Commercial', icon: Building, desc: 'Offices, retail & high-rises' },
                { id: 'infrastructure', title: 'Infrastructure', icon: Truck, desc: 'Roads, bridges & earthworks' }
              ].map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id as any)}
                  className={`flex items-center gap-4 p-4 rounded-xl border text-left transition-all ${
                    selectedType === type.id 
                      ? 'border-[#111111] dark:border-white bg-[#111111]/5 dark:bg-white/10 ring-1 ring-[#111111] dark:ring-white' 
                      : 'border-[#111111]/10 dark:border-white/10 hover:border-[#111111]/30 dark:hover:border-white/30 hover:bg-[#111111]/5 dark:hover:bg-white/5'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                    selectedType === type.id ? 'bg-[#111111] dark:bg-white text-white dark:text-[#111111]' : 'bg-[#111111]/5 dark:bg-white/5 text-[#111111] dark:text-white'
                  }`}>
                    <type.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#111111] dark:text-white">{type.title}</h3>
                    <p className="text-sm text-[#111111]/60 dark:text-white/60 mt-0.5">{type.desc}</p>
                  </div>
                </button>
              ))}
            </div>
            
            <button 
              onClick={nextStep}
              className="w-full py-4 rounded-xl font-bold text-white bg-[#111111] dark:bg-white dark:text-[#111111] hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
            >
              Continue <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        );
      case 2:
        return (
          <div className={`space-y-6 transition-all duration-300 ${isTransitioning ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}`}>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-[#111111] dark:text-white mb-2">Set your preferences</h2>
              <p className="text-[#111111]/60 dark:text-white/60 text-sm">You can always change this later in settings.</p>
            </div>
            
            <div className="space-y-4">
               <div>
                  <label className="text-[13px] font-bold text-[#111111]/50 dark:text-white/50 tracking-widest uppercase mb-3 block">Measurement System</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setCurrentUnit('Metric')}
                      className={`py-4 px-4 rounded-xl border text-center font-bold transition-all ${
                        currentUnit === 'Metric' 
                          ? 'border-[#111111] dark:border-white bg-[#111111]/5 dark:bg-white/10 ring-1 ring-[#111111] dark:ring-white text-[#111111] dark:text-white' 
                          : 'border-[#111111]/10 dark:border-white/10 hover:border-[#111111]/30 dark:hover:border-white/30 text-[#111111]/60 dark:text-white/60'
                      }`}
                    >
                      <div className="text-lg">Metric</div>
                      <div className="text-xs font-normal mt-1 opacity-70">Meters, cm, kg</div>
                    </button>
                    <button
                      onClick={() => setCurrentUnit('Imperial')}
                      className={`py-4 px-4 rounded-xl border text-center font-bold transition-all ${
                        currentUnit === 'Imperial' 
                          ? 'border-[#111111] dark:border-white bg-[#111111]/5 dark:bg-white/10 ring-1 ring-[#111111] dark:ring-white text-[#111111] dark:text-white' 
                          : 'border-[#111111]/10 dark:border-white/10 hover:border-[#111111]/30 dark:hover:border-white/30 text-[#111111]/60 dark:text-white/60'
                      }`}
                    >
                      <div className="text-lg">Imperial</div>
                      <div className="text-xs font-normal mt-1 opacity-70">Feet, inches, lbs</div>
                    </button>
                  </div>
               </div>
            </div>
            
            <div className="flex gap-3 pt-4">
              <button 
                onClick={prevStep}
                className="py-4 px-5 rounded-xl font-bold border border-[#111111]/10 dark:border-white/10 text-[#111111] dark:text-white hover:bg-[#111111]/5 dark:hover:bg-white/5 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={nextStep}
                className="flex-1 py-4 rounded-xl font-bold text-white bg-[#111111] dark:bg-white dark:text-[#111111] hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
              >
                Next Step <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        );
      case 3:
        
        let tools = [];
        if (selectedType === 'residential') {
           tools = [
             { id: 'house', title: 'House Estimator', desc: 'Full home quantities from plan out', icon: Home },
             { id: 'calculators', title: 'Material Splits', desc: 'Detailed cement, sand & aggregate formulas', icon: Box }
           ];
        } else if (selectedType === 'commercial') {
           tools = [
             { id: 'master-rcc', title: 'RCC Master', desc: 'Structural steel & concrete mass calc', icon: Building },
             { id: 'takeoff', title: '2D Takeoff', desc: 'Measure PDF blueprints instantly', icon: Ruler }
           ];
        } else {
           tools = [
             { id: 'earthworks', title: 'Earthworks Estimator', desc: 'Cut & fill volume analysis', icon: Truck },
             { id: 'road-pavement', title: 'Road Pavement', desc: 'Sub-base, base course & asphalt quantities', icon: Calculator }
           ];
        }

        return (
          <div className={`space-y-6 transition-all duration-300 ${isTransitioning ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}`}>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
                 <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-[#111111] dark:text-white mb-2">You're all set!</h2>
              <p className="text-[#111111]/60 dark:text-white/60 text-sm">Based on your choices, we recommend starting here:</p>
            </div>
            
            <div className="flex flex-col gap-3 py-2">
               {tools.map(t => (
                 <button
                    key={t.id}
                    onClick={() => finish(t.id as ModuleId)}
                    className="flex flex-col items-start p-4 bg-slate-50 dark:bg-[#1A1A1A] border border-slate-100 dark:border-white/5 hover:border-blue-500 dark:hover:border-blue-400 rounded-xl transition-all shadow-sm hover:shadow"
                 >
                    <div className="flex items-center gap-3 mb-1">
                       <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                          <t.icon className="w-5 h-5" />
                       </div>
                       <span className="font-bold text-[#111111] dark:text-white text-[16px]">{t.title}</span>
                    </div>
                    <p className="text-[#111111]/60 dark:text-white/60 text-[13px] ml-11">{t.desc}</p>
                 </button>
               ))}
            </div>

            <button 
              onClick={() => finish()}
              className="w-full py-4 rounded-xl font-bold text-[#111111] dark:text-white bg-transparent hover:bg-[#111111]/5 dark:hover:bg-white/5 transition-colors border border-[#111111]/10 dark:border-white/10"
            >
              Go to Dashboard
            </button>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
       {/* Backdrop */}
       <div 
         className="absolute inset-0 bg-[#111111]/40 dark:bg-black/60 backdrop-blur-md animate-in fade-in duration-300"
       />

       {/* Modal */}
       <div className="relative w-full max-w-md bg-white dark:bg-[#111111] rounded-[24px] shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden flex flex-col hide-scrollbar max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#111111]/5 dark:border-white/5">
             <div className="flex gap-1.5">
               {[1, 2, 3].map(i => (
                 <div 
                   key={i} 
                   className={`h-1.5 rounded-full transition-all duration-500 ${step >= i ? 'w-8 bg-[#111111] dark:bg-white' : 'w-4 bg-[#111111]/10 dark:bg-white/10'}`} 
                 />
               ))}
             </div>
             <button 
               onClick={handleClose}
               className="p-1.5 rounded-full text-[#111111]/40 dark:text-white/40 hover:text-[#111111] dark:hover:text-white hover:bg-[#111111]/5 dark:hover:bg-white/5 transition-all"
               title="Skip onboarding"
             >
               <X className="w-5 h-5" />
             </button>
          </div>

          {/* Content */}
          <div className="p-6 sm:p-8">
             {renderStep()}
          </div>
       </div>
    </div>
  );
}
