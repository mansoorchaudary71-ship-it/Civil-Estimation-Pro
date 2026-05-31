import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Box, Layers, Calculator, Play, Lock, LockOpen, Sparkles, TrendingUp, Hexagon, Component, Workflow, Hammer } from 'lucide-react';
import { ALL_MODULES } from './Dashboard';
import Tilt from 'react-parallax-tilt';

interface BentoGridProps {
  modules: typeof ALL_MODULES;
  onSelect: (id: string) => void;
  usedTools?: string[];
}

const AbstractShape = ({ type }: { type: 'concrete' | 'steel' | 'architectural' | 'soil' | 'default' }) => {
  return (
    <motion.div 
      className="absolute -bottom-6 -right-6 md:-bottom-12 md:-right-12 w-48 h-48 md:w-64 md:h-64 opacity-[0.1] pointer-events-none blur-[1px]"
      whileHover={{ rotate: 15, scale: 1.1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {type === 'concrete' && (
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 20L180 60V140L100 180L20 140V60L100 20Z" fill="url(#gradConcrete)" stroke="#6366f1" strokeWidth="4"/>
          <path d="M100 20V100L180 60 M100 100V180 M20 60L100 100" stroke="#6366f1" strokeWidth="4"/>
          <defs>
            <linearGradient id="gradConcrete" x1="0" y1="0" x2="200" y2="200">
              <stop offset="0%" stopColor="#818cf8" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.1" />
            </linearGradient>
          </defs>
        </svg>
      )}
      {type === 'steel' && (
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M60 20H140V60H110V140H140V180H60V140H90V60H60V20Z" fill="url(#gradSteel)" stroke="#3b82f6" strokeWidth="4"/>
          <defs>
            <linearGradient id="gradSteel" x1="0" y1="0" x2="200" y2="200">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#2563eb" stopOpacity="0.2" />
            </linearGradient>
          </defs>
        </svg>
      )}
      {type === 'architectural' && (
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="80" fill="url(#gradArch)" stroke="#10b981" strokeWidth="4"/>
          <path d="M100 20L180 180H20L100 20Z" stroke="#10b981" strokeWidth="4" fill="none"/>
          <defs>
            <linearGradient id="gradArch" x1="0" y1="0" x2="200" y2="200">
              <stop offset="0%" stopColor="#34d399" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#059669" stopOpacity="0.1" />
            </linearGradient>
          </defs>
        </svg>
      )}
      {(type === 'soil' || type === 'default') && (
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="40" y="40" width="120" height="120" rx="20" fill="url(#gradDef)" stroke="#8b5cf6" strokeWidth="4" transform="rotate(45 100 100)"/>
          <defs>
            <linearGradient id="gradDef" x1="0" y1="0" x2="200" y2="200">
              <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.1" />
            </linearGradient>
          </defs>
        </svg>
      )}
    </motion.div>
  );
};

const BentoCard = ({ 
  mod, 
  onSelect, 
  isUsed, 
  size,
  index 
}: { 
  mod: (typeof ALL_MODULES)[0]; 
  onSelect: (id: string) => void;
  isUsed: boolean;
  size: 'large' | 'small';
  index: number;
}) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const getShapeType = () => {
    if (mod.title.toLowerCase().includes('concrete')) return 'concrete';
    if (mod.title.toLowerCase().includes('steel') || mod.title.toLowerCase().includes('bar')) return 'steel';
    if (mod.category.toLowerCase().includes('architecture')) return 'architectural';
    if (mod.category.toLowerCase().includes('soil')) return 'soil';
    return 'default';
  };

  const IconMap: Record<string, React.ElementType> = {
    Box, Layers, Calculator, Play, Lock, LockOpen, Sparkles, TrendingUp, Hexagon, Component, Workflow, Hammer
  };
  const IconComponent = mod.icon ? (IconMap[mod.icon as string] || Calculator) : Calculator;

  const colSpanClass = size === 'large' ? 'md:col-span-2' : 'col-span-1';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: (index % 6) * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className={`${colSpanClass} h-full`}
    >
      <Tilt
        tiltMaxAngleX={size === 'large' ? 2 : 4}
        tiltMaxAngleY={size === 'large' ? 2 : 4}
        perspective={1200}
        scale={1.02}
        transitionSpeed={400}
        glareEnable={false}
        className="h-full w-full"
      >
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => onSelect(mod.id)}
          className={`group relative h-full w-full rounded-[24px] overflow-hidden cursor-pointer bg-white/70 backdrop-blur-xl border border-white/80 ${size === 'large' ? 'p-8' : 'p-6'} flex flex-col justify-between transition-all duration-300 transform-gpu shadow-[0_8px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_-10px_rgba(79,70,229,0.15)] bg-gradient-to-br from-white/90 to-white/40 hover:border-indigo-100/80`}
        >
          {/* Mouse follow radial gradient */}
          {isHovered && (
            <div
              className="pointer-events-none absolute inset-0 mix-blend-screen opacity-50 transition-opacity duration-300"
              style={{
                background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(99, 102, 241, 0.1), transparent 40%)`,
              }}
            />
          )}

          {/* Premium/New tags */}
          <div className="absolute top-4 right-4 flex gap-2 z-20">
            {mod.premium && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 text-orange-700 shadow-sm border border-orange-200/50">
                <span className="text-[10px] font-bold uppercase tracking-wider">PRO</span>
                {isHovered ? <LockOpen className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
              </div>
            )}
            {mod.isNew && (
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100">
                <Sparkles className="w-3 h-3" />
                <span className="text-[10px] font-bold uppercase tracking-wider">NEW</span>
              </div>
            )}
          </div>

          <div className="flex flex-col z-10 h-full relative">
            <div className={`flex items-center justify-center ${size === 'large' ? 'w-16 h-16 rounded-2xl mb-6' : 'w-12 h-12 rounded-xl mb-5'} bg-white border border-slate-100 text-indigo-500 shadow-sm group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors duration-300`}>
              {React.createElement(IconComponent as React.ElementType, { className: size === 'large' ? 'w-8 h-8' : 'w-6 h-6' })}
            </div>
            
            <div className="mt-auto">
              <h4 className={`${size === 'large' ? 'text-2xl lg:text-3xl pr-12' : 'text-lg pr-4'} font-extrabold text-slate-800 mb-2 group-hover:text-indigo-700 transition-colors leading-tight`}>
                {mod.title}
              </h4>
              <p className={`${size === 'large' ? 'text-sm lg:text-base max-w-[85%]' : 'text-xs max-w-[95%]'} text-slate-500 font-medium leading-relaxed`}>
                {mod.description}
              </p>
            </div>
          </div>

          {/* Abstract background shape for large cards */}
          {size === 'large' && (
            <div className="pointer-events-none absolute right-0 bottom-0 top-0 w-1/2 flex items-end justify-end overflow-hidden z-0">
              <div className="group-hover:scale-105 group-hover:-translate-y-2 transition-transform duration-[2s] ease-out w-full h-full relative">
                 <AbstractShape type={getShapeType()} />
              </div>
            </div>
          )}

          {/* Decorative Corner Glow */}
          <div className="absolute right-0 bottom-0 w-32 h-32 bg-indigo-50 mix-blend-multiply opacity-0 group-hover:opacity-[0.3] blur-[40px] rounded-full transition-opacity duration-700 pointer-events-none"></div>
          
        </div>
      </Tilt>
    </motion.div>
  );
};

export const BentoGrid = ({ modules, onSelect, usedTools = [] }: BentoGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 w-full auto-rows-[250px] md:auto-rows-[280px]">
      {modules.map((mod, idx) => {
        let size: 'large' | 'small' = 'small';
        // Make index 0, 3, 6 large (span 2 columns on big screens)
        if (idx % 4 === 0) {
          size = 'large';
        }
        
        return (
          <BentoCard 
            key={mod.id} 
            mod={mod} 
            onSelect={onSelect} 
            isUsed={usedTools.includes(mod.id)} 
            size={size}
            index={idx}
          />
        );
      })}
    </div>
  );
};
