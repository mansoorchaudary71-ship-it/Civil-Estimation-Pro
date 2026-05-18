import React from 'react';
import metalData from '../../data/metalData.json';
import concreteData from '../../data/concreteData.json';
import houseData from '../../data/houseData.json';
import earthworkData from '../../data/earthworkData.json';

interface RelatedCalculatorsProps {
  category: string;
  currentSlug: string;
}

const CATEGORY_NAMES: Record<string, string> = {
  metal: "Steel & Metal Structure Calculators",
  concrete: "Concrete & RCC Volume Estimators",
  house: "Residential Construction & Grey Structure Estimators",
  earthworks: "Earthworks & Trench Excavation"
};

const CROSS_POLLINATION_MAP: Record<string, string[]> = {
  metal: ['concrete', 'house'],
  concrete: ['metal', 'earthworks'],
  house: ['concrete', 'earthworks'],
  earthworks: ['house', 'concrete']
};

export function RelatedCalculators({ category, currentSlug }: RelatedCalculatorsProps) {
  let currentDataList: any[] = [];
  switch (category) {
    case 'metal': currentDataList = metalData; break;
    case 'concrete': currentDataList = concreteData; break;
    case 'house': currentDataList = houseData; break;
    case 'earthworks': currentDataList = earthworkData; break;
  }

  // 4 sequential links (Next/Previous within the same category)
  const currentIdx = currentDataList.findIndex((d) => d.slug === currentSlug);
  const sequentialItems: any[] = [];
  
  if (currentIdx !== -1 && currentDataList.length > 1) {
    let startIdx = currentIdx - 2;
    let endIdx = currentIdx + 2;
    
    // Bounds adjustments
    if (startIdx < 0) {
      endIdx += Math.abs(startIdx);
      startIdx = 0;
    }
    if (endIdx >= currentDataList.length) {
      startIdx -= (endIdx - currentDataList.length + 1);
      endIdx = currentDataList.length - 1;
    }
    startIdx = Math.max(0, startIdx);
    
    // Collect specific neighbors
    for (let i = startIdx; i <= endIdx; i++) {
      if (i !== currentIdx && sequentialItems.length < 4) {
        sequentialItems.push(currentDataList[i]);
      }
    }
    
    // Fallback if we somehow didn't get 4 items
    if (sequentialItems.length < 4) {
      for (let i = 0; i < currentDataList.length; i++) {
        if (i !== currentIdx && !sequentialItems.includes(currentDataList[i])) {
          sequentialItems.push(currentDataList[i]);
          if (sequentialItems.length >= 4) break;
        }
      }
    }
  }

  const sequentialLinks = sequentialItems.map((item) => ({
    label: "Similar Calculation",
    title: item.target_keyword,
    url: `/calculators/${category}/${item.slug}`
  }));

  // 2 High-level category hub links
  const categoryHubLinks = [
    {
      label: "Category Hub",
      title: `Back to All ${CATEGORY_NAMES[category] || 'Calculators'}`,
      url: `/calculators/${category}`
    },
    {
      label: "Master Hub",
      title: "View All Civil Engineering Estimation Tools",
      url: "/calculators"
    }
  ];

  // 2 Cross-Pollination links
  const crossCategories = CROSS_POLLINATION_MAP[category] || ['concrete', 'metal'];
  const crossLinks = crossCategories.slice(0, 2).map((tgtCat) => {
    let tgtList: any[] = [];
    switch (tgtCat) {
      case 'metal': tgtList = metalData; break;
      case 'concrete': tgtList = concreteData; break;
      case 'house': tgtList = houseData; break;
      case 'earthworks': tgtList = earthworkData; break;
    }
    
    // Consistently pick an item based on the current slug's length so it's pseudo-random but SSR stable
    const seedIdx = currentSlug.length % tgtList.length;
    const targetItem = tgtList[seedIdx] || tgtList[0];
    
    return {
      label: "Related Tool",
      title: targetItem ? targetItem.target_keyword : `Explore ${CATEGORY_NAMES[tgtCat]}`,
      url: targetItem ? `/calculators/${tgtCat}/${targetItem.slug}` : `/calculators/${tgtCat}`
    };
  });

  return (
    <section className="mt-16 bg-slate-900 rounded-3xl p-8 sm:p-10 border border-slate-800">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white">Silo Link Grid: Continue Exploring</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Discover sequential tools, categorical hubs, and related structural estimators.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Render sequential links (exact 4) */}
        {sequentialLinks.map((link, idx) => (
          <a key={`seq-${idx}`} href={link.url} className="group p-5 bg-slate-800 rounded-xl border border-slate-700 hover:border-indigo-500 hover:bg-slate-800/80 transition-all flex flex-col">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">{link.label}</span>
            <span className="text-sm font-semibold text-slate-200 group-hover:text-white capitalize leading-snug">{link.title}</span>
          </a>
        ))}
        
        {/* Render Cross Pollination links (exact 2) */}
        {crossLinks.map((link, idx) => (
          <a key={`cross-${idx}`} href={link.url} className="group p-5 bg-slate-800 rounded-xl border border-slate-700 hover:border-emerald-500 hover:bg-slate-800/80 transition-all flex flex-col">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">{link.label}</span>
            <span className="text-sm font-semibold text-slate-200 group-hover:text-white capitalize leading-snug">{link.title}</span>
          </a>
        ))}

        {/* Render Category Hubs (exact 2) */}
        {categoryHubLinks.map((link, idx) => (
          <a key={`hub-${idx}`} href={link.url} className="group p-5 bg-[#EDED78] rounded-xl border border-indigo-500 hover:bg-[#F0F0C0]0 hover:border-indigo-400 shadow-lg shadow-indigo-900/20 transition-all flex flex-col justify-center items-start">
            <span className="text-xs font-bold text-indigo-200 uppercase tracking-wider mb-2">{link.label}</span>
            <span className="text-sm font-bold text-white capitalize leading-snug">{link.title}</span>
          </a>
        ))}
      </div>
    </section>
  );
}
