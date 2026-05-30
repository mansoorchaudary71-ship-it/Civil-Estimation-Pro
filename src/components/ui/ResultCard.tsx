import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { HelpCircle, AlertTriangle, CheckCircle, Info } from "lucide-react";
import { useCountUp } from "../../hooks/useCountUp";
import { useSettings } from "../../context/SettingsContext";

export interface ResultCardProps {
  title: string;
  value: string | number;
  unit?: React.ReactNode;
  icon?: React.ReactNode;
  description?: React.ReactNode;
  badge?: React.ReactNode;
  variant?:
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "neutral"
    | "dark"
    | "info"
    | "purple"
    | "cyan"
    | "pink"
    | "yellow";
  className?: string;
  delay?: number;
  status?: "normal" | "high" | "exceeds";
  comparisonText?: string;
  explanation?: string;
  secondaryUnit?: string;
  secondaryValue?: string | number;
}

const statusConfig = {
  normal: {
    icon: CheckCircle,
    className: "text-emerald-500 bg-emerald-500/10",
    label: "Normal",
  },
  high: {
    icon: AlertTriangle,
    className: "text-amber-500 bg-amber-500/10",
    label: "High",
  },
  exceeds: {
    icon: AlertTriangle,
    className: "text-rose-500 bg-rose-500/10",
    label: "Exceeds limits",
  },
};

function parseAndFormat(
  strValue: string | number,
  title: string = "",
  unitNode: React.ReactNode = "",
) {
  const str = String(strValue);
  const numericMatch = str.match(/-?[\d,.]+/);
  if (!numericMatch)
    return { num: 0, prefix: str, suffix: "", decimals: 0, isNumeric: false };

  const numStr = numericMatch[0].replace(/,/g, "");
  const num = parseFloat(numStr);
  const index = str.indexOf(numericMatch[0]);
  let prefix = str.substring(0, index);
  let suffix = str.substring(index + numericMatch[0].length);

  // Decide decimal places based on context (from title or suffix/unit)
  const titleLower = title.toLowerCase();
  const unitLower = (
    typeof unitNode === "string" ? unitNode : suffix
  ).toLowerCase();
  const origDecimalsMatch = numStr.match(/\.(\d+)/);
  let decimals = origDecimalsMatch ? origDecimalsMatch[1].length : 2;

  if (
    unitLower.includes("bag") ||
    unitLower.includes("nos") ||
    titleLower.includes("count") ||
    titleLower.includes("bricks") ||
    titleLower.includes("panels") ||
    (typeof unitNode === "string" && unitNode.toLowerCase().includes("nos"))
  ) {
    decimals = 0;
  } else if (
    unitLower.includes("m³") ||
    unitLower.includes("cu.m") ||
    unitLower.includes("cft") ||
    unitLower.includes("sq.m") ||
    unitLower.includes("sft") ||
    unitLower.includes("ton")
  ) {
    decimals = 2;
  } else if (
    unitLower.includes("rs") ||
    unitLower.includes("pkr") ||
    titleLower.includes("cost") ||
    titleLower.includes("price") ||
    titleLower.includes("rate") ||
    prefix.includes("$") ||
    prefix.includes("Rs") ||
    suffix.includes("Rs")
  ) {
    if (
      titleLower.includes("pkr") ||
      prefix.toLowerCase().includes("rs") ||
      suffix.toLowerCase().includes("rs") ||
      unitLower.includes("rs")
    ) {
      decimals = 0; // Spec: "All currency in PKR must show: Rs 1,115,500" - 0 decimals
      if (
        !prefix.toLowerCase().includes("rs") &&
        !suffix.toLowerCase().includes("rs") &&
        !unitLower.includes("rs")
      ) {
        prefix = "Rs "; // Force prefix if it's missing but context is PKR
      }
    } else {
      decimals = 2; // "2 for costs" generally
    }
  } else if (Number.isInteger(num)) {
    decimals = 0;
  }

  // Ensure "Rs " formatting specifically requests PKR (Rs 1,115,500). Wait, the prompt said "Rs 1,115,500", but didn't state decimals as 0 for all currency, just "All currency in PKR must show: Rs 1,115,500". "2 for costs". I'll use 2 for costs unless it's Rs.

  return { num, prefix, suffix, decimals, isNumeric: !isNaN(num) };
}

export function ResultCard({
  title,
  value,
  unit,
  icon,
  badge,
  description,
  variant = "neutral",
  className = "",
  delay = 0,
  status,
  comparisonText,
  explanation,
  secondaryUnit,
  secondaryValue,
}: ResultCardProps) {
  const { formatCurrency } = useSettings();

  // Parsing & Animation
  const parsed = parseAndFormat(value, title, unit);
  const animatedRaw = useCountUp(parsed.num, 800);

  // Conditionally animate if it is actually a number
  let displayValue = parsed.isNumeric
    ? `${parsed.prefix}${animatedRaw.toLocaleString("en-US", { minimumFractionDigits: parsed.prefix.trim() === "Rs" ? 0 : parsed.decimals, maximumFractionDigits: parsed.prefix.trim() === "Rs" ? 0 : parsed.decimals })}${parsed.suffix}`
    : value;

  // Some overrides for exactly matching user's string example
  const isCurrency =
    parsed.isNumeric &&
    Object.keys(parsed).length > 0 &&
    (title.toLowerCase().includes("cost") ||
      title.toLowerCase().includes("price") ||
      title.toLowerCase().includes("budget") ||
      title.toLowerCase().includes("savings") ||
      parsed.prefix.includes("Rs") ||
      parsed.prefix.includes("$") ||
      parsed.suffix.includes("Rs"));
  if (isCurrency && !unit?.toString().toLowerCase().includes("bag")) {
    const cleanSuffix = parsed.suffix
      .replace(/rs\.?/i, "")
      .replace(/\$/i, "")
      .trim();
    displayValue = `${formatCurrency(animatedRaw, false)}${cleanSuffix ? " " + cleanSuffix : ""}`;
  }

  const [expanded, setExpanded] = useState(false);
  const palette = [
    "text-purple-600",
    "text-sky-500",
    "text-amber-500",
    "text-teal-600",
  ];
  const getColor = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) hash += str.charCodeAt(i);
    return palette[hash % 4];
  };
  const valueColor = getColor(title);
  const statusDetails = status ? statusConfig[status] : null;
  const StatusIcon = statusDetails ? statusDetails.icon : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      transition={{ duration: 0.4, delay, ease: [0.23, 1, 0.32, 1] }}
      className={`relative p-4 sm:p-5 bg-white  border border-slate-200   rounded-[24px] shadow-sm hover:shadow-md flex flex-col gap-2.5 transition-all duration-300 w-full overflow-hidden ${className}`}
    >
      <div className="flex items-start justify-between gap-3 w-full relative z-10">
        <div className="flex flex-col max-w-[80%]">
          <div className="flex items-center gap-2">
            {icon && (
              <div className="p-1.5 rounded-[24px] bg-slate-50 flex-shrink-0 border border-slate-100 text-[#6B46C1] [#8b5cf6]">
                {icon}
              </div>
            )}
            <h4 className="text-[10px] sm:text-xs font-bold text-slate-600 uppercase tracking-widest truncate flex items-center gap-1">
              {title}
              {explanation && (
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="opacity-70 hover:opacity-100 transition-opacity p-0.5 text-slate-500"
                  title="What does this mean?"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                </button>
              )}
            </h4>
          </div>

          {comparisonText && (
            <div className="flex items-center gap-1.5 mt-2 text-slate-500">
              <div className="flex items-end gap-[3px] h-3.5 opacity-70">
                <div className="w-1 bg-current h-1/3 rounded-full" />
                <div className="w-1 bg-current h-2/3 rounded-full" />
                <div className="w-1 bg-current h-full rounded-full animate-pulse" />
              </div>
              <span className="text-[10px] font-bold opacity-80 uppercase tracking-wider">
                {comparisonText}
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col items-end gap-2">
          {badge && (
            <div className="flex-shrink-0 flex items-center bg-purple-50 border border-purple-200 text-[#6B46C1] text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              {badge}
            </div>
          )}
          {statusDetails && StatusIcon && (
            <div
              className={`flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${statusDetails.className}`}
            >
              <StatusIcon className="w-3 h-3" />
              {statusDetails.label}
            </div>
          )}
        </div>
      </div>

      <div
        className="flex flex-col w-full relative z-10 mt-1 overflow-hidden"
        role="alert"
        aria-live="polite"
      >
        <span className="sr-only">
          Calculation updated: {title} is {displayValue} {unit}
        </span>
        <div
          className="flex flex-wrap items-baseline gap-1.5 sm:gap-2"
          aria-hidden="true"
        >
          <span
            className={`text-[clamp(1.75rem,5vw,2.5rem)] leading-none font-black tracking-tighter break-all max-w-full ${valueColor}`}
          >
            {displayValue}
          </span>
          {unit && (
            <span className="text-[13px] sm:text-sm font-semibold ml-1 shrink-0 text-slate-500">
              {unit}
            </span>
          )}
        </div>

        {secondaryValue !== undefined && secondaryUnit && (
          <div className="text-[11px] sm:text-xs font-bold text-slate-500 mt-0.5">
            ={" "}
            {typeof secondaryValue === "number"
              ? secondaryValue.toLocaleString("en-US", {
                  maximumFractionDigits: 2,
                })
              : secondaryValue}{" "}
            {secondaryUnit}
          </div>
        )}

        {description && !secondaryValue && (
          <div className="text-[11px] sm:text-xs text-slate-500 font-medium leading-relaxed max-w-full break-words mt-1">
            {description}
          </div>
        )}
      </div>

      <AnimatePresence>
        {expanded && explanation && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden relative z-10"
          >
            <div className="mt-3 pt-3 border-t border-slate-100">
              <div className="flex items-start gap-2 text-slate-600">
                <Info className="w-4 h-4 mt-0.5 opacity-80 text-[#6B46C1]" />
                <p className="text-[11px] sm:text-xs opacity-90 leading-relaxed font-medium">
                  {explanation}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
