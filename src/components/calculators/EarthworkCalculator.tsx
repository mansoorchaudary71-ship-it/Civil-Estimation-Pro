"use client";
import React from "react";

export function EarthworkCalculator({ initialData }: { initialData: any }) {
  return (
    <div className="p-6 bg-white rounded-[12px] shadow-[0_2px_12px_rgba(0,0,0,0.08)] border border-slate-200">
      <h2 className="text-[18px] font-bold mb-4">{initialData.target_keyword}</h2>
      <pre className="bg-slate-50 p-4 rounded text-sm overflow-auto">
        {JSON.stringify(initialData, null, 2)}
      </pre>
      <div className="mt-4 p-4 bg-yellow-50 text-yellow-900 rounded">
        <strong>Total Hauling Trips:</strong> {initialData.total_hauling_trips} trips
      </div>
    </div>
  );
}
