"use client";
import React from "react";

export function ConcreteCalculator({ initialData }: { initialData: any }) {
  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-200">
      <h2 className="text-2xl font-bold mb-4">{initialData.target_keyword}</h2>
      <pre className="bg-slate-50 p-4 rounded text-sm overflow-auto">
        {JSON.stringify(initialData, null, 2)}
      </pre>
      <div className="mt-4 p-4 bg-orange-50 text-orange-900 rounded">
        <strong>Cement Bags Required:</strong> {initialData.cement_bags_required} bags
      </div>
    </div>
  );
}
