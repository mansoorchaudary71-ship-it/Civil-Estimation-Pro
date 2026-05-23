import React from "react";
import { GlobalSettingsToggle } from "../ui/GlobalSettingsToggle";
import { useHouseSpecs } from "../../context/HouseSpecsContext";
import {
  Box,
  Layers,
  Droplet,
  AppWindow,
  LayoutGrid,
  Paintbrush,
  ArrowUpRight,
  Sliders,
} from "lucide-react";
export default function HouseSpecs() {
  const { specs, updateSpecs } = useHouseSpecs();
  return (
    <div className="w-full h-full overflow-y-auto bg-transparent text-gray-900 font-sans p-6 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8 pb-24">
        <header className="mb-10">
          <h1 className="text-[28px] lg:text-5xl font-extrabold tracking-tight bg-gradient-to-r   bg-clip-text text-transparent pb-2">
            Material Specs & Finishing
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg font-medium">
            Define material specifications, structural mixes, and finish
            qualities mapping to central dynamic rates.
          </p>
          <div className="mt-5 w-fit">
            <GlobalSettingsToggle align="left" showCurrency={false} />
          </div>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Brickwork Card */}
          <GlassCard
            title="Brickwork"
            icon={<Box className="w-5 h-5 text-red-500" />}
            color="red"
          >
            <div className="space-y-4">
              <SelectInput
                label="Brick Class"
                value={specs.brickwork.type}
                onChange={(v: string) => updateSpecs("brickwork", "type", v)}
                options={[
                  { label: "A-Class (Premium)", value: "aClass" },
                  { label: "B-Class (Standard)", value: "bClass" },
                ]}
              />
              <NumberInput
                label="Wastage (%)"
                value={specs.brickwork.wastagePct.toString()}
                onChange={(v: string) =>
                  updateSpecs("brickwork", "wastagePct", parseFloat(v) || 0)
                }
              />
            </div>
          </GlassCard>
          {/* Concrete / Structure */}
          <GlassCard
            title="Concrete Mix"
            icon={<Layers className="w-5 h-5 text-gray-700 dark:text-gray-300" />}
            color="gray"
          >
            <div className="space-y-4">
              <SelectInput
                label="Slab Mix Ratio"
                value={specs.concrete.slabMix}
                onChange={(v: string) => updateSpecs("concrete", "slabMix", v)}
                options={[
                  { label: "1:1.5:3 (M20)", value: "1:1.5:3" },
                  { label: "1:2:4 (M15)", value: "1:2:4" },
                ]}
              />
              <SelectInput
                label="Foundation Mix"
                value={specs.concrete.foundationMix}
                onChange={(v: string) =>
                  updateSpecs("concrete", "foundationMix", v)
                }
                options={[
                  { label: "1:3:6 (M10)", value: "1:3:6" },
                  { label: "1:4:8 (M7.5)", value: "1:4:8" },
                ]}
              />
            </div>
          </GlassCard>
          {/* Plastering */}
          <GlassCard
            title="Plastering"
            icon={<Droplet className="w-5 h-5 text-teal-500" />}
            color="teal"
          >
            <div className="space-y-4">
              <SelectInput
                label="Mortar Ratio"
                value={specs.plastering.mortarRatio}
                onChange={(v: string) =>
                  updateSpecs("plastering", "mortarRatio", v)
                }
                options={[
                  { label: "1:4 (Rich mix)", value: "1:4" },
                  { label: "1:5 (Standard)", value: "1:5" },
                  { label: "1:6 (Lean mix)", value: "1:6" },
                ]}
              />
              <div className="grid grid-cols-2 gap-3">
                <NumberInput
                  label="Inner (in)"
                  value={specs.plastering.innerThickness}
                  onChange={(v: string) =>
                    updateSpecs("plastering", "innerThickness", v)
                  }
                />
                <NumberInput
                  label="Outer (in)"
                  value={specs.plastering.outerThickness}
                  onChange={(v: string) =>
                    updateSpecs("plastering", "outerThickness", v)
                  }
                />
              </div>
            </div>
          </GlassCard>
          {/* Flooring */}
          <GlassCard
            title="Flooring"
            icon={<LayoutGrid className="w-5 h-5 text-amber-500" />}
            color="amber"
          >
            <div className="space-y-4">
              <SelectInput
                label="Material Type"
                value={specs.flooring.type}
                onChange={(v: string) => updateSpecs("flooring", "type", v)}
                options={[
                  { label: "Ceramic Tiles", value: "ceramic" },
                  { label: "Porcelain Tiles", value: "porcelain" },
                  { label: "Marble Slab", value: "marble" },
                  { label: "Wooden Laminate", value: "wooden" },
                ]}
              />
              <NumberInput
                label="Market Price (/sqft)"
                value={specs.flooring.pricePerSqft}
                onChange={(v: string) =>
                  updateSpecs("flooring", "pricePerSqft", v)
                }
              />
            </div>
          </GlassCard>
          {/* Ceiling */}
          <GlassCard
            title="Ceiling Finish"
            icon={<ArrowUpRight className="w-5 h-5 text-indigo-600" />}
            color="indigo"
          >
            <div className="space-y-4 pb-4">
              <ToggleGroup
                value={specs.ceiling.type}
                onChange={(v: string) => updateSpecs("ceiling", "type", v)}
                options={[
                  { label: "POP", value: "pop" },
                  { label: "Gypsum", value: "gypsum" },
                  { label: "Bare", value: "bare" },
                ]}
              />
              <p className="text-[11px] text-gray-700 dark:text-gray-300 mt-4 leading-relaxed font-medium">
                {specs.ceiling.type === "pop" &&
                  "Standard Plaster of Paris finishes offering smooth surfaces."}
                {specs.ceiling.type === "gypsum" &&
                  "False ceiling boards. Ideal for recessed / hidden lighting."}
                {specs.ceiling.type === "bare" &&
                  "Bare concrete finish (Industrial look), zero added cost."}
              </p>
            </div>
          </GlassCard>
          {/* Doors & Windows */}
          <GlassCard
            title="Doors & Windows"
            icon={<AppWindow className="w-5 h-5 text-sky-500" />}
            color="sky"
          >
            <div className="space-y-4">
              <SelectInput
                label="Material"
                value={specs.doorsWindows.type}
                onChange={(v: string) => updateSpecs("doorsWindows", "type", v)}
                options={[
                  { label: "Solid Wood", value: "solidWood" },
                  { label: "Ash Wood", value: "ashWood" },
                  { label: "Aluminum", value: "aluminum" },
                  { label: "UPVC Profiles", value: "upvc" },
                ]}
              />
              <NumberInput
                label="Total Openings (sqft)"
                value={specs.doorsWindows.openingsSqft}
                onChange={(v: string) =>
                  updateSpecs("doorsWindows", "openingsSqft", v)
                }
                desc="Deducted from brickwork volume."
              />
            </div>
          </GlassCard>
          {/* Paint & Finishes */}
          <GlassCard
            title="Paint & Finishes"
            icon={<Paintbrush className="w-5 h-5 text-fuchsia-500" />}
            color="fuchsia"
          >
            <div className="space-y-4">
              <SelectInput
                label="Interior Paint"
                value={specs.paint.interior}
                onChange={(v: string) => updateSpecs("paint", "interior", v)}
                options={[
                  { label: "Distemper (Standard)", value: "distemper" },
                  { label: "Plastic Emulsion", value: "emulsion" },
                ]}
              />
              <SelectInput
                label="Exterior Paint"
                value={specs.paint.exterior}
                onChange={(v: string) => updateSpecs("paint", "exterior", v)}
                options={[
                  { label: "Weather Shield", value: "weatherShield" },
                  { label: "Texture / Rockwall", value: "texture" },
                ]}
              />
            </div>
          </GlassCard>
          {/* Electrical & MEP */}
          <GlassCard
            title="Electrical & MEP"
            icon={<Sliders className="w-5 h-5 text-cyan-500" />}
            color="sky"
          >
            <div className="space-y-4">
              <SelectInput
                label="Electrical Wiring"
                value={specs.electrical.wiring}
                onChange={(v: string) => updateSpecs("electrical", "wiring", v)}
                options={[
                  {
                    label: "3/0.29 & 7/0.29 Standard",
                    value: "3/0.29 & 7/0.29 Standard",
                  },
                  { label: "Premium Brand", value: "Premium Brand" },
                ]}
              />
              <SelectInput
                label="Switches & Boards"
                value={specs.electrical.switches}
                onChange={(v: string) =>
                  updateSpecs("electrical", "switches", v)
                }
                options={[
                  { label: "Local Standard", value: "Local Standard" },
                  { label: "Premium", value: "Premium" },
                ]}
              />
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
function GlassCard({
  title,
  icon,
  children,
  color,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  color: string;
}) {
  const bgColors: Record<string, string> = {
    red: "bg-red-500/10 border-red-500/20 text-red-600",
    gray: "bg-gray-500/10 border-gray-500/20 text-gray-600",
    teal: "bg-teal-500/10 border-teal-500/20 text-teal-600",
    amber: "bg-amber-500/10 border-amber-500/20 text-amber-600",
    indigo: "bg-indigo-500/10 border-indigo-500/20 text-indigo-600",
    sky: "bg-sky-500/10 border-sky-500/20 text-sky-600",
    fuchsia: "bg-fuchsia-500/10 border-fuchsia-500/20 text-fuchsia-600",
  };
  return (
    <div className="bg-white/70 backdrop-blur-3xl border border-white p-6 rounded-[12px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-transform hover:-translate-y-[2px] hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)]-[0_12px_40px_rgb(0,0,0,0.06)] transition-all">
      <div className="flex items-center gap-3 mb-6">
        <div className={`p-2.5 rounded-[12px] ${bgColors[color]}`}>
          {icon}
        </div>
        <h3 className="text-lg font-bold text-gray-800">
          {title}
        </h3>
      </div>
      {children}
    </div>
  );
}
function SelectInput({ label, value, options, onChange }: any) {
  return (
    <div>
      <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 uppercase tracking-widest mb-1.5">
        {label}
      </label>
      <div className="relative">
        <select
          className="w-full bg-gray-50/80 border border-gray-200 text-gray-800 rounded-[12px] px-4 py-3 text-sm font-semibold appearance-none focus:outline-none focus:ring-2 focus:ring-[#6B46C1]/30 transition-shadow transition-colors"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {options.map((opt: any) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-700 dark:text-gray-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>
      </div>
    </div>
  );
}
function NumberInput({ label, value, onChange, desc }: any) {
  return (
    <div>
      <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 uppercase tracking-widest mb-1.5">
        {label}
      </label>
      <input
        type="number"
        step="any"
        className="w-full bg-gray-50/80 border border-gray-200 text-gray-800 rounded-[12px] px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#6B46C1]/30 transition-shadow transition-colors"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {desc && (
        <p className="text-[10px] text-gray-700 dark:text-gray-300 mt-1.5 font-bold tracking-wide">
          {desc}
        </p>
      )}
    </div>
  );
}
function ToggleGroup({ value, onChange, options }: any) {
  return (
    <div className="flex bg-gray-100/80 backdrop-blur-sm p-1 rounded-[12px] w-full border border-gray-200/50">
      {options.map((opt: any) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`flex-1 py-2.5 px-3 text-[12px] font-bold rounded-[12px] transition-all duration-300 ${value === opt.value ? "bg-white text-gray-800 shadow-[0_2px_12px_rgba(0,0,0,0.08)]" : "text-gray-700 dark:text-gray-300 hover:text-gray-700 hover:bg-gray-200/50"}`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
