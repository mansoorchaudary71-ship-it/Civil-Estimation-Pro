import React, { useState, useEffect } from "react";
import {
  Columns,
  CircleDashed,
  Square,
  Calculator,
  Layers,
  Droplets,
} from "lucide-react";
import { GlobalSettingsToggle } from "../ui/GlobalSettingsToggle";
import { useSettings } from "../../context/SettingsContext";
import ShareButtonWithPopup from "./ShareMenu";
const mixRatios: Record<string, { c: number; s: number; a: number }> = {
  "M10 (1:3:6)": { c: 1, s: 3, a: 6 },
  "M15 (1:2:4)": { c: 1, s: 2, a: 4 },
  "M20 (1:1.5:3)": { c: 1, s: 1.5, a: 3 },
  "M25 (1:1:2)": { c: 1, s: 1, a: 2 },
};
function CircularColumnInputs({
  diameter,
  setDiameter,
}: {
  diameter: string;
  setDiameter: (val: string) => void;
}) {
  return (
    <div className="animate-in fade-in slide-in-from-top-2 duration-300">
      {" "}
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1 whitespace-nowrap">
        Diameter (m)
      </label>{" "}
      <input
        type="number"
        className="w-full bg-white border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all shadow-sm flex-1 min-w-fit whitespace-nowrap"
        value={diameter}
        onChange={(e) => setDiameter(e.target.value)}
        placeholder="e.g. 0.4"
      />{" "}
    </div>
  );
}
function RectangularColumnInputs({
  length,
  width,
  setLength,
  setWidth,
  isSquare,
}: {
  length: string;
  width: string;
  setLength: (val: string) => void;
  setWidth: (val: string) => void;
  isSquare: boolean;
}) {
  return (
    <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
      {" "}
      <div>
        {" "}
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1 whitespace-nowrap">
          {isSquare ? "Side Length (m)" : "Length (m)"}
        </label>{" "}
        <input
          type="number"
          className="w-full bg-white border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all shadow-sm flex-1 min-w-fit whitespace-nowrap"
          value={length}
          onChange={(e) => {
            setLength(e.target.value);
            if (isSquare) setWidth(e.target.value);
          }}
          placeholder="e.g. 0.3"
        />{" "}
      </div>{" "}
      {!isSquare && (
        <div>
          {" "}
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1 whitespace-nowrap">
            Width (m)
          </label>{" "}
          <input
            type="number"
            className="w-full bg-white border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all shadow-sm flex-1 min-w-fit whitespace-nowrap"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            placeholder="e.g. 0.3"
          />{" "}
        </div>
      )}{" "}
    </div>
  );
}
export default function ColumnEstimator() {
  const { settings } = useSettings();
  const [shape, setShape] = useState<"rectangular" | "square" | "circular">(
    "rectangular",
  );
  const [length, setLength] = useState("0.3");
  const [width, setWidth] = useState("0.4");
  const [diameter, setDiameter] = useState("0.4");
  const [height, setHeight] = useState("3.0");
  const [count, setCount] = useState("1");
  const [mix, setMix] = useState("M20 (1:1.5:3)");
  const l = parseFloat(length) || 0;
  const w = shape === "square" ? l : parseFloat(width) || 0;
  const d = parseFloat(diameter) || 0;
  const h = parseFloat(height) || 0;
  const n = parseFloat(count) || 1;
  let vol = 0;
  if (shape === "circular") {
    vol = Math.PI * Math.pow(d / 2, 2) * h * n;
  } else {
    vol = l * w * h * n;
  }
  const dryVol = vol * 1.54;
  const ratio = mixRatios[mix];
  const totalRatio = ratio.c + ratio.s + ratio.a;
  const cementM3 = (dryVol * ratio.c) / totalRatio;
  const cementBags = Math.ceil(cementM3 / 0.0347);
  const sandCft = ((dryVol * ratio.s) / totalRatio) * 35.3147;
  const aggCft = ((dryVol * ratio.a) / totalRatio) * 35.3147;
  return (
    <div className="w-full h-full overflow-y-auto bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white p-6 md:p-8">
      {" "}
      <div className="max-w-4xl mx-auto space-y-6">
        {" "}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {" "}
          <div>
            {" "}
            <h1 className="text-3xl font-black mb-2 flex items-center gap-3 text-slate-800 dark:text-white whitespace-nowrap">
              {" "}
              <Columns className="w-8 h-8 text-blue-600 dark:text-blue-400" />{" "}
              Column Concrete Estimator{" "}
            </h1>{" "}
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              Calculate concrete volume and material breakdown for columns.
            </p>{" "}
          </div>{" "}
          <GlobalSettingsToggle align="left" showCurrency={false} />{" "}
        </div>{" "}
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden flex-1 min-w-fit whitespace-nowrap">
          {" "}
          <div className="p-6 md:p-8 space-y-8">
            {" "}
            {/* Shape Toggle Group */}{" "}
            <div>
              {" "}
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">
                Column Shape
              </label>{" "}
              <div className="bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl flex flex-col sm:flex-row w-full md:w-auto gap-1">
                {" "}
                <button
                  onClick={() => setShape("rectangular")}
                  className={`flex-1 flex justify-center items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${shape === "rectangular" ? "bg-white dark:bg-slate-700 text-blue-600 shadow border border-slate-200/50 dark:border-slate-600" : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"}`}
                >
                  {" "}
                  <Square className="w-4 h-4" /> Rectangular{" "}
                </button>{" "}
                <button
                  onClick={() => setShape("square")}
                  className={`flex-1 flex justify-center items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${shape === "square" ? "bg-white dark:bg-slate-700 text-blue-600 shadow border border-slate-200/50 dark:border-slate-600" : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"}`}
                >
                  {" "}
                  <Square className="w-4 h-4" /> Square{" "}
                </button>{" "}
                <button
                  onClick={() => setShape("circular")}
                  className={`flex-1 flex justify-center items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${shape === "circular" ? "bg-white dark:bg-slate-700 text-blue-600 shadow border border-slate-200/50 dark:border-slate-600" : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"}`}
                >
                  {" "}
                  <CircleDashed className="w-4 h-4" /> Circular{" "}
                </button>{" "}
              </div>{" "}
            </div>{" "}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {" "}
              <div className="space-y-6">
                {" "}
                {/* Dynamically Render Inputs */}{" "}
                {shape === "circular" ? (
                  <CircularColumnInputs
                    diameter={diameter}
                    setDiameter={setDiameter}
                  />
                ) : (
                  <RectangularColumnInputs
                    length={length}
                    width={width}
                    setLength={setLength}
                    setWidth={setWidth}
                    isSquare={shape === "square"}
                  />
                )}{" "}
                <div className="grid grid-cols-2 gap-4">
                  {" "}
                  <div>
                    {" "}
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1 whitespace-nowrap">
                      Height (m)
                    </label>{" "}
                    <input
                      type="number"
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all shadow-sm flex-1 min-w-fit whitespace-nowrap"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                    />{" "}
                  </div>{" "}
                  <div>
                    {" "}
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1 whitespace-nowrap">
                      Number of Columns
                    </label>{" "}
                    <input
                      type="number"
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all shadow-sm flex-1 min-w-fit whitespace-nowrap"
                      value={count}
                      onChange={(e) => setCount(e.target.value)}
                    />{" "}
                  </div>{" "}
                </div>{" "}
                <div>
                  {" "}
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1 whitespace-nowrap">
                    Concrete Mix
                  </label>{" "}
                  <select
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all shadow-sm appearance-none flex-1 min-w-fit whitespace-nowrap"
                    value={mix}
                    onChange={(e) => setMix(e.target.value)}
                  >
                    {" "}
                    {Object.keys(mixRatios).map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}{" "}
                  </select>{" "}
                </div>{" "}
              </div>{" "}
              {/* Visual Aid */}{" "}
              <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl flex flex-col items-center justify-center px-4 py-3 border border-slate-100 dark:border-slate-700/50 min-h-[300px] flex-1 min-w-fit whitespace-nowrap">
                {" "}
                <div
                  className="w-40 h-40 relative flex items-center justify-center text-blue-200 dark:text-blue-900 border-[8px] mb-6 shadow-inner transition-all duration-500 ease-in-out"
                  style={{
                    borderRadius:
                      shape === "circular"
                        ? "50%"
                        : shape === "square"
                          ? "1rem"
                          : "1rem",
                    borderColor: "currentColor",
                    width: shape === "rectangular" ? "160px" : "140px",
                    height: shape === "rectangular" ? "120px" : "140px",
                  }}
                >
                  {" "}
                  <div className="absolute inset-0 flex items-center justify-center">
                    {" "}
                    <div className="w-2 h-2 rounded-full bg-blue-400 dark:bg-blue-600" />{" "}
                    <div className="absolute top-2 w-1 h-3 rounded-full bg-blue-300 dark:bg-blue-700" />{" "}
                    <div className="absolute bottom-2 w-1 h-3 rounded-full bg-blue-300 dark:bg-blue-700" />{" "}
                    <div className="absolute left-2 w-3 h-1 rounded-full bg-blue-300 dark:bg-blue-700" />{" "}
                    <div className="absolute right-2 w-3 h-1 rounded-full bg-blue-300 dark:bg-blue-700" />{" "}
                  </div>{" "}
                </div>{" "}
                <div className="text-center">
                  {" "}
                  <h4 className="font-bold text-slate-800 dark:text-white capitalize">
                    {shape} Column Cross-Section
                  </h4>{" "}
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    {" "}
                    {shape === "circular"
                      ? `Ø ${d}m`
                      : shape === "square"
                        ? `${l} × ${l}m`
                        : `${l} × ${w}m`}{" "}
                    <span className="mx-2">•</span> Height: {h}m{" "}
                  </p>{" "}
                </div>{" "}
              </div>{" "}
            </div>{" "}
            {/* Results Grid */}{" "}
            <div className="flex flex-wrap  gap-6 pt-6 border-t border-slate-100 dark:border-slate-800 items-center w-full">
              {" "}
              <div className="bg-blue-50 dark:bg-blue-900/20 px-4 py-3 rounded-2xl border border-blue-100 dark:border-blue-800/50 flex-1 min-w-fit whitespace-nowrap">
                {" "}
                <div className="flex items-center gap-2 mb-4">
                  {" "}
                  <Droplets className="w-5 h-5 text-blue-600 dark:text-blue-400" />{" "}
                  <h4 className="font-bold text-blue-800 dark:text-blue-300">
                    Concrete Volume
                  </h4>{" "}
                </div>{" "}
                <div className="grid grid-cols-2 gap-4">
                  {" "}
                  <div>
                    {" "}
                    <span className="block text-xs font-semibold text-blue-500 dark:text-blue-400 mb-1">
                      Wet Volume
                    </span>{" "}
                    <div className="flex items-baseline gap-2">
                      {" "}
                      <span className="text-3xl font-black text-blue-700 dark:text-blue-200 whitespace-nowrap">
                        {vol.toFixed(3)}
                      </span>{" "}
                      <span className="text-blue-600 dark:text-blue-400 font-medium">
                        m³
                      </span>{" "}
                    </div>{" "}
                  </div>{" "}
                  <div>
                    {" "}
                    <span className="block text-xs font-semibold text-blue-500 dark:text-blue-400 mb-1">
                      Dry Volume
                    </span>{" "}
                    <div className="flex items-baseline gap-2">
                      {" "}
                      <span className="text-3xl font-black text-blue-700 dark:text-blue-200 whitespace-nowrap">
                        {dryVol.toFixed(3)}
                      </span>{" "}
                      <span className="text-blue-600 dark:text-blue-400 font-medium">
                        m³
                      </span>{" "}
                    </div>{" "}
                  </div>{" "}
                </div>{" "}
              </div>{" "}
              <div className="bg-slate-100 dark:bg-slate-800 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 flex-1 min-w-fit whitespace-nowrap">
                {" "}
                <h4 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                  {" "}
                  <Layers className="w-5 h-5 text-slate-500 dark:text-slate-400" />{" "}
                  Material Breakdown{" "}
                </h4>{" "}
                <div className="grid grid-cols-3 gap-4">
                  {" "}
                  <div>
                    {" "}
                    <span className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                      Cement
                    </span>{" "}
                    <span className="block text-xl font-bold text-slate-800 dark:text-white whitespace-nowrap">
                      {cementBags}{" "}
                      <span className="text-sm text-slate-500">bags</span>
                    </span>{" "}
                  </div>{" "}
                  <div>
                    {" "}
                    <span className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                      Sand
                    </span>{" "}
                    <span className="block text-xl font-bold text-slate-800 dark:text-white whitespace-nowrap">
                      {sandCft.toFixed(1)}{" "}
                      <span className="text-sm text-slate-500">cft</span>
                    </span>{" "}
                  </div>{" "}
                  <div>
                    {" "}
                    <span className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                      Aggregate
                    </span>{" "}
                    <span className="block text-xl font-bold text-slate-800 dark:text-white whitespace-nowrap">
                      {aggCft.toFixed(1)}{" "}
                      <span className="text-sm text-slate-500">cft</span>
                    </span>{" "}
                  </div>{" "}
                </div>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
      <ShareButtonWithPopup
        activeTab="Column Concrete"
        title={`${shape} Column Concrete Estimation`}
        data={{
          "Wet Volume": `${vol.toFixed(3)} m³`,
          "Dry Volume": `${dryVol.toFixed(3)} m³`,
          Cement: `${cementBags} bags`,
          Sand: `${sandCft.toFixed(1)} cft`,
          Aggregate: `${aggCft.toFixed(1)} cft`,
        }}
        exportFormat={{
          inputs: {
            Shape: shape,
            Count: String(count),
            Height: `${height} m`,
            "Concrete Mix": mix,
            ...(shape === "circular"
              ? { Diameter: `${diameter} m` }
              : shape === "square"
                ? { "Side Length": `${length} m` }
                : { Length: `${length} m`, Width: `${width} m` }),
          },
          breakdown: {
            "Wet Concrete Volume": `${vol.toFixed(3)} m³`,
            "Dry Concrete Volume": `${dryVol.toFixed(3)} m³`,
            "Cement Needed": `${cementBags} bags`,
            "Sand Needed": `${sandCft.toFixed(1)} cft`,
            "Aggregate Needed": `${aggCft.toFixed(1)} cft`,
          },
        }}
      />{" "}
    </div>
  );
}
