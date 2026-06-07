import React, { useState } from 'react';
import { useProjects, Project } from '../../context/ProjectContext';
import { Plus, FolderOpen, Calendar, MapPin, Building, Share2, Printer, ChevronRight, BarChart3, AlertCircle, Upload, Play, FileText, ArrowRight, Home, Route } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { CalculationHistory } from '../ui/CalculationHistory';

export default function ProjectManager() {
  const { projects, activeProjectId, setActiveProjectId, addProject, deleteProject } = useProjects();
  const [view, setView] = useState<'list' | 'detail' | 'compare'>('list');
  const [viewedProjectId, setViewedProjectId] = useState<string | null>(null);
  const [compareIds, setCompareIds] = useState<[string, string] | [null, null]>([null, null]);
  
  const [isCreating, setIsCreating] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', location: '', type: 'Residential', startDate: '' });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.name) return;
    addProject({
       name: newProject.name,
       location: newProject.location || 'Unknown',
       type: newProject.type,
       startDate: newProject.startDate || new Date().toISOString().split('T')[0]
    });
    setIsCreating(false);
    setNewProject({ name: '', location: '', type: 'Residential', startDate: '' });
  };

  const handleView = (id: string) => {
    setViewedProjectId(id);
    setView('detail');
  };

  const toggleCompareSelect = (id: string) => {
    if (compareIds[0] === id) setCompareIds([null, compareIds[1]]);
    else if (compareIds[1] === id) setCompareIds([compareIds[0], null]);
    else if (!compareIds[0]) setCompareIds([id, compareIds[1]]);
    else if (!compareIds[1]) setCompareIds([compareIds[0], id]);
  };

  if (view === 'detail' && viewedProjectId) {
    const project = projects.find(p => p.id === viewedProjectId);
    if (!project) return <div className="p-8">Project not found</div>;
    return <ProjectDetail project={project} onBack={() => setView('list')} />;
  }

  if (view === 'compare' && compareIds[0] && compareIds[1]) {
    const p1 = projects.find(p => p.id === compareIds[0]);
    const p2 = projects.find(p => p.id === compareIds[1]);
    if (p1 && p2) return <ProjectCompare p1={p1} p2={p2} onBack={() => setView('list')} />;
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/40 backdrop-blur-xl border border-white/60 p-6 md:p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div>
          <h2 className="text-3xl font-semibold tabular-nums tracking-tight text-slate-800 tracking-tight flex items-center gap-3">
             <div className="p-3 bg-indigo-500 text-white rounded-[24px] shadow-[0_4px_14px_rgba(99,102,241,0.39)]">
               <FolderOpen className="w-8 h-8" />
             </div>
             Project Manager
          </h2>
          <p className="text-slate-500 mt-2 font-medium">Manage and group your calculations by project.</p>
        </div>
        <div className="flex gap-2">
           {compareIds[0] && compareIds[1] && (
             <button onClick={() => setView('compare')} className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-full font-bold shadow-[0_4px_14px_rgba(16,185,129,0.39)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.23)] transition-all animate-pulse">
                Compare Selected
             </button>
           )}
           <button 
             onClick={() => setIsCreating(!isCreating)}
             className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full font-bold shadow-[0_4px_14px_rgba(99,102,241,0.39)] hover:shadow-[0_6px_20px_rgba(99,102,241,0.23)] transition-all flex items-center gap-2"
           >
             <Plus className="w-5 h-5" /> New Project
           </button>
        </div>
      </div>

      {isCreating && (
        <form onSubmit={handleCreate} className="bg-white/40 backdrop-blur-xl border border-white/60 p-6 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] transform transition-all">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Plus className="text-indigo-500" /> Create New Project
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Project Name</label>
              <input type="text" value={newProject.name} onChange={e => setNewProject({...newProject, name: e.target.value})} className="w-full px-4 py-2.5 rounded-[24px] border border-white/60 bg-white/50 focus:ring-2 focus:ring-indigo-500 outline-none backdrop-blur-sm" required placeholder="e.g. Al-Hamra Tower" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Location</label>
              <input type="text" value={newProject.location} onChange={e => setNewProject({...newProject, location: e.target.value})} className="w-full px-4 py-2.5 rounded-[24px] border border-white/60 bg-white/50 focus:ring-2 focus:ring-indigo-500 outline-none backdrop-blur-sm" placeholder="City, Area" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Type</label>
              <select value={newProject.type} onChange={e => setNewProject({...newProject, type: e.target.value})} className="w-full px-4 py-2.5 rounded-[24px] border border-white/60 bg-white/50 focus:ring-2 focus:ring-indigo-500 outline-none backdrop-blur-sm">
                <option>Residential</option>
                <option>Commercial</option>
                <option>Infrastructure</option>
                <option>Industrial</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Start Date</label>
              <input type="date" value={newProject.startDate} onChange={e => setNewProject({...newProject, startDate: e.target.value})} className="w-full px-4 py-2.5 rounded-[24px] border border-white/60 bg-white/50 focus:ring-2 focus:ring-indigo-500 outline-none backdrop-blur-sm" />
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button type="submit" className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-[24px] hover:bg-indigo-700 transition shadow-md">Save Project</button>
            <button type="button" onClick={() => setIsCreating(false)} className="px-6 py-2.5 bg-white/50 border border-white/60 text-slate-600 font-bold rounded-[24px] hover:bg-white/80 transition shadow-sm">Cancel</button>
          </div>
        </form>
      )}

      {projects.length === 0 && !isCreating ? (
        <div className="flex flex-col gap-8 w-full max-w-4xl mx-auto py-6">
          <div className="text-center space-y-4">
            {/* Animated Workflow Illustration */}
            <div className="flex justify-center mb-6">
               <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-[24px] bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 transform transition duration-500 hover:scale-110">
                     <Building className="w-7 h-7 text-slate-900" />
                  </div>
                  <div className="flex flex-col gap-1 w-10">
                     <div className="h-1.5 bg-indigo-500/30 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 w-full animate-[translateX_2s_ease-in-out_infinite]" style={{ animationName: 'progress' }}></div>
                     </div>
                  </div>
                  <div className="w-16 h-16 rounded-[24px] bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 transform transition duration-500 hover:scale-110 animation-delay-200">
                     <BarChart3 className="w-7 h-7 text-slate-900" />
                  </div>
                  <div className="flex flex-col gap-1 w-10">
                     <div className="h-1.5 bg-emerald-500/30 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 w-full animate-[translateX_2s_ease-in-out_infinite]" style={{ animationName: 'progress', animationDelay: '0.4s' }}></div>
                     </div>
                  </div>
                  <div className="w-16 h-16 rounded-[24px] bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/20 transform transition duration-500 hover:scale-110 animation-delay-400">
                     <FileText className="w-7 h-7 text-slate-900" />
                  </div>
               </div>
               <style>{`
                  @keyframes progress {
                     0% { transform: translateX(-100%); }
                     50% { transform: translateX(0%); }
                     100% { transform: translateX(100%); }
                  }
               `}</style>
            </div>
             
             <h3 className="text-3xl font-semibold tabular-nums tracking-tight text-slate-800">Welcome to Project Manager</h3>
             <p className="text-slate-500 text-lg max-w-2xl mx-auto">
               Group your estimates, track material quantities, and manage multi-stage construction projects in one centralized dashboard.
             </p>
          </div>

          {/* 3-Step Workflow Onboarding Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 relative bg-white border border-slate-200 rounded-[2rem] shadow-sm divide-y md:divide-y-0 md:divide-x divide-slate-100 overflow-hidden mt-2">
             {[
               { icon: Plus, title: "1. Create Project", desc: "Set up a workspace for your site" },
               { icon: Play, title: "2. Run Calculations", desc: "Use estimators & save results" },
               { icon: FileText, title: "3. View Reports", desc: "Track aggregated materials & costs" }
             ].map((step, i) => (
                <div key={i} className="p-8 flex flex-col items-center text-center bg-slate-50/30 rounded-[24px] border border-slate-200 shadow-sm text-slate-800 hover:bg-slate-50 rounded-[24px] border border-slate-200 shadow-sm text-slate-800 transition cursor-default">
                   <div className="w-12 h-12 rounded-full border-2 border-indigo-100 flex items-center justify-center mb-4 bg-white text-indigo-600 shadow-sm">
                      <step.icon className="w-5 h-5" />
                   </div>
                   <h4 className="font-bold text-slate-800 mb-2">{step.title}</h4>
                   <p className="text-sm text-slate-500">{step.desc}</p>
                </div>
             ))}
          </div>

          {/* Setup Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2">
             <div className="bg-white border border-indigo-100 p-8 rounded-[2rem] shadow-sm flex flex-col justify-center">
                <h4 className="font-bold text-lg mb-1 text-slate-800">Quick Start Templates</h4>
                <p className="text-sm text-slate-500 mb-5">Begin with a predefined project framework.</p>
                <div className="space-y-3">
                   <button 
                     onClick={() => {
                        setNewProject({ name: 'My House Project', location: '', type: 'Residential', startDate: new Date().toISOString().split('T')[0] });
                        setIsCreating(true);
                     }}
                     className="w-full flex items-center justify-between p-4 group bg-slate-50 hover:bg-indigo-50 rounded-[24px] border border-slate-100 hover:border-indigo-200 transition-all"
                   >
                      <div className="flex items-center gap-4">
                         <div className="bg-white p-3 rounded-[24px] shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                            <Home className="w-5 h-5 text-indigo-500" />
                         </div>
                         <div className="text-left">
                            <h5 className="font-bold text-slate-700 group-hover:text-indigo-600 transition">Start Residential Project</h5>
                            <p className="text-xs text-slate-500 mt-0.5">Houses, apartments, buildings</p>
                         </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 transition -translate-x-2 group-hover:translate-x-0" />
                   </button>

                   <button 
                     onClick={() => {
                        setNewProject({ name: 'Highway Expansion', location: '', type: 'Infrastructure', startDate: new Date().toISOString().split('T')[0] });
                        setIsCreating(true);
                     }}
                     className="w-full flex items-center justify-between p-4 group bg-slate-50 hover:bg-emerald-50 rounded-[24px] border border-slate-100 hover:border-emerald-200 transition-all"
                   >
                      <div className="flex items-center gap-4">
                         <div className="bg-white p-3 rounded-[24px] shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                            <Route className="w-5 h-5 text-emerald-500" />
                         </div>
                         <div className="text-left">
                            <h5 className="font-bold text-slate-700 group-hover:text-emerald-600 transition">Start Road Project</h5>
                            <p className="text-xs text-slate-500 mt-0.5">Highways, pavements, bridges</p>
                         </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-500 transition -translate-x-2 group-hover:translate-x-0" />
                   </button>
                </div>
             </div>

             <div className="bg-white border p-8 rounded-[2rem] shadow-lg flex flex-col justify-center text-center text-slate-900 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 group-hover:rotate-12 transition-all duration-700 pointer-events-none">
                   <Upload className="w-40 h-40" />
                </div>
                <div className="relative z-10 w-full">
                   <div className="w-12 h-12 bg-slate-50 rounded-[24px] border border-slate-200 shadow-sm text-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100 group-hover:scale-110 transition-transform">
                      <FileText className="w-6 h-6 text-slate-300" />
                   </div>
                   <h4 className="font-bold text-xl mb-2 text-slate-900">Import Existing Data</h4>
                   <p className="text-slate-400 text-sm mb-8 px-4">Restore a previously saved project from a JSON or CSV file to continue your work without losing history.</p>
                   
                   <label className="cursor-pointer inline-flex w-[80%] items-center justify-center gap-2 px-6 py-4 bg-indigo-500 hover:bg-indigo-400 text-white rounded-[24px] font-bold transition shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:shadow-[0_0_25px_rgba(99,102,241,0.5)]">
                      <Upload className="w-5 h-5" /> Select File to Import
                      <input type="file" className="hidden" accept=".json,.csv" onChange={(e) => {
                         if (e.target.files && e.target.files.length > 0) {
                            alert("Import functionality would process: " + e.target.files[0].name + " here. (Feature coming soon)");
                         }
                      }} />
                   </label>
                </div>
             </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(proj => {
             const isCompare = compareIds[0] === proj.id || compareIds[1] === proj.id;
             return (
            <div key={proj.id} className={`group bg-white  border ${activeProjectId === proj.id ? 'border-indigo-500 ring-1 ring-indigo-500' : 'border-slate-200 '} p-6 rounded-[2rem] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col relative overflow-hidden`}>
              
              {isCompare && (
                 <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/10">
                    <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center border-2 border-white pointer-events-none"></div>
                 </div>
              )}

              <div className="flex justify-between items-start mb-4 relative z-10">
                 <div>
                   <h3 className="text-xl font-semibold text-slate-800 leading-tight">{proj.name}</h3>
                   <div className="flex items-center gap-2 mt-2">
                     <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full">{proj.type}</span>
                     {activeProjectId === proj.id && (
                       <span className="px-2.5 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full">Active</span>
                     )}
                   </div>
                 </div>
              </div>
              
              <div className="space-y-2 mb-6">
                 <div className="flex items-center gap-2 text-sm text-slate-500">
                    <MapPin className="w-4 h-4" /> {proj.location}
                 </div>
                 <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Calendar className="w-4 h-4" /> Started {proj.startDate ? new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(proj.startDate)) : 'N/A'}
                 </div>
                 <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                    <BarChart3 className="w-4 h-4" /> {proj.estimates.length} calculations saved
                 </div>
              </div>
              
              <div className="mt-auto flex flex-col gap-2">
                 <div className="flex gap-2">
                   <button onClick={() => handleView(proj.id)} className="flex-1 py-2.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 font-bold rounded-[24px] transition flex justify-center items-center gap-1">
                      View Details <ChevronRight className="w-4 h-4" />
                   </button>
                   <button 
                     onClick={() => setActiveProjectId(activeProjectId === proj.id ? null : proj.id)} 
                     className={`px-4 py-2.5 font-bold rounded-[24px] transition ${activeProjectId === proj.id ? 'bg-slate-100 text-slate-500  ' : 'border border-indigo-200 text-indigo-600 hover:bg-indigo-50  '}`}
                     title={activeProjectId === proj.id ? "Deactivate" : "Set as Active Project"}
                   >
                     {activeProjectId === proj.id ? "Disable" : "Set Active"}
                   </button>
                 </div>
                 
                 <button 
                   onClick={() => toggleCompareSelect(proj.id)}
                   className={`w-full py-2 text-xs font-bold rounded-[24px] transition-colors border ${isCompare ? 'bg-emerald-50 text-emerald-700 border-emerald-200   ' : 'bg-transparent text-slate-400 border-slate-200 hover:border-slate-300  :'}`}
                 >
                   {isCompare ? "Selected for Compare" : "Select to Compare"}
                 </button>
              </div>
            </div>
             );
          })}
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// PROJECT COMPARE VIEW
// -------------------------------------------------------------
function ProjectCompare({ p1, p2, onBack }: { p1: Project, p2: Project, onBack: () => void }) {
  const getTotals = (proj: Project) => {
     let cost = 0;
     let matCount = 0;
     const materials: Record<string, number> = {};
     proj.estimates.forEach(est => {
        cost += Number(est.cost) || 0;
        if (est.materials) {
           Object.entries(est.materials).forEach(([m, d]) => {
              if (!materials[m]) { materials[m] = 0; matCount++; }
              materials[m] += d.quantity;
           });
        }
     });
     return { cost, matCount, materials };
  };

  const t1 = getTotals(p1);
  const t2 = getTotals(p2);
  
  const allMaterialKeys = Array.from(new Set([...Object.keys(t1.materials), ...Object.keys(t2.materials)])).sort();

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
       <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold transition">
          <ChevronRight className="w-5 h-5 rotate-180" /> Back to Projects
       </button>
       
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
         
          {[p1, p2].map((proj, i) => {
            const totals = i === 0 ? t1 : t2;
            return (
         <div key={proj.id} className="bg-white/40 backdrop-blur-xl border border-white/60 p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <h1 className="text-2xl font-semibold tabular-nums tracking-tight text-slate-800 mb-6 flex items-center gap-2">
               <span className="w-6 h-6 rounded-full bg-indigo-500 text-white shadow-md flex items-center justify-center text-sm">{i+1}</span>
               {proj.name}
            </h1>
            
            <div className="space-y-6">
              <div className="p-4 bg-emerald-50/50 backdrop-blur-md rounded-[24px] border border-emerald-100/50 shadow-sm text-slate-800 rounded-[24px]">
                 <p className="text-sm font-bold text-emerald-700 uppercase tracking-wider mb-1">Total Cost estimate</p>
                 <p className="text-3xl font-semibold tabular-nums tracking-tight text-emerald-600">${totals.cost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                 {i === 1 && t1.cost !== 0 && (
                    <p className={`text-sm font-bold ${t2.cost > t1.cost ? 'text-rose-500' : 'text-emerald-500'} mt-1`}>
                       {Math.abs(t2.cost - t1.cost).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} difference
                    </p>
                 )}
              </div>
              
              <div className="bg-white/50 border border-white/60 p-5 rounded-[24px] shadow-[0_4px_24px_rgba(15,23,42,0.02)]">
                 <h4 className="font-bold text-slate-800 mb-3 border-b border-slate-200/50 pb-2">Material Comparison</h4>
                 <div className="space-y-3">
                    {allMaterialKeys.map(m => {
                       const v1 = t1.materials[m] || 0;
                       const v2 = t2.materials[m] || 0;
                       const v = i === 0 ? v1 : v2;
                       const higher = (i === 0 && v1 > v2) || (i === 1 && v2 > v1);
                       return (
                          <div key={m} className="flex justify-between items-center text-sm py-1 border-b border-slate-100/50 last:border-0">
                            <span className="font-semibold text-slate-600">{m}</span>
                            <span className={`font-semibold tabular-nums tracking-tight ${higher ? 'text-indigo-600 ' : 'text-slate-700 '}`}>
                               {v > 0 ? v.toFixed(1) : '-'}
                            </span>
                          </div>
                       )
                    })}
                 </div>
              </div>
            </div>
         </div>
            )})}
            
       </div>
    </div>
  );
}
function ProjectDetail({ project, onBack }: { project: Project, onBack: () => void }) {
  const { deleteEstimate } = useProjects();
  const [inflationRate, setInflationRate] = useState<number>(0);
  const [wasteFactor, setWasteFactor] = useState<number>(0);

  const costMultiplier = 1 + (inflationRate / 100);
  const qtyMultiplier = 1 + (wasteFactor / 100);
  
  // Aggregate total cost
  const totalCost = project.estimates.reduce((sum, est) => sum + (Number(est.cost) || 0), 0) * costMultiplier;
  
  // Aggregate Materials
  const aggregatedMaterials: Record<string, { quantity: number; unit: string; count: number }> = {};
  project.estimates.forEach(est => {
    if (est.materials) {
      Object.entries(est.materials).forEach(([matName, { quantity, unit }]) => {
         const key = `${matName.toLowerCase()}_${unit.toLowerCase()}`;
         if (!aggregatedMaterials[key]) {
           aggregatedMaterials[key] = { quantity: 0, unit, count: 0 };
         }
         aggregatedMaterials[key].quantity += quantity * qtyMultiplier;
         aggregatedMaterials[key].count += 1;
      });
    }
  });

  // Prepare Pie Chart Data based on estimate cost categories
  const categoryCosts = project.estimates.reduce((acc, est) => {
     const cat = est.category || 'Other';
     acc[cat] = (acc[cat] || 0) + ((Number(est.cost) || 0) * costMultiplier);
     return acc;
  }, {} as Record<string, number>);

  const pieData = Object.keys(categoryCosts).map(key => ({
     name: key,
     value: categoryCosts[key]
  }));
  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  const handleExportPDF = () => {
    alert("Exporting full project PDF...");
  };

  const handleShare = () => {
    const url = `${window.location.origin}/project?id=${project.id}&share=true`;
    navigator.clipboard.writeText(url);
    alert("Read-only share link copied to clipboard!");
  };

  const timelineData = [...project.estimates]
    .sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(est => ({
      name: est.name,
      date: new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(est.date)),
      cost: (Number(est.cost) || 0) * costMultiplier
    }));

  const cumulativeTimelineData = timelineData.map((d, i) => ({
    ...d,
    cumulativeCost: timelineData.slice(0, i + 1).reduce((sum, item) => sum + item.cost, 0)
  }));

  const topMaterialKeys = Object.entries(aggregatedMaterials)
    .sort((a,b) => b[1].quantity - a[1].quantity)
    .slice(0, 3)
    .map(e => e[0]);

  const materialTrendData = [...project.estimates]
    .sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(est => {
      const dataPoint: any = { 
        name: est.name,
        date: new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(est.date))
      };
      if (est.materials) {
        topMaterialKeys.forEach(matKey => {
           const [matName, unit] = matKey.split('_');
           let qty = 0;
           const entry = Object.entries(est.materials).find(([k,v]) => `${k.toLowerCase()}_${v.unit.toLowerCase()}` === matKey);
           if(entry) qty = entry[1].quantity * qtyMultiplier;
           dataPoint[matName.charAt(0).toUpperCase() + matName.slice(1)] = qty;
        });
      } else {
        topMaterialKeys.forEach(matKey => {
           const [matName, unit] = matKey.split('_');
           dataPoint[matName.charAt(0).toUpperCase() + matName.slice(1)] = 0;
        });
      }
      return dataPoint;
  });
  
  const chartColors = ['#6366f1', '#10b981', '#f59e0b'];

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
       <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold transition">
          <ChevronRight className="w-5 h-5 rotate-180" /> Back to Projects
       </button>
       
       <div className="flex flex-col lg:flex-row gap-6">
         {/* Main Summary Panel */}
         <div className="flex-1 space-y-6">
           <div className="bg-white/40 backdrop-blur-xl border border-white/60 p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-5">
               <Building className="w-48 h-48" />
             </div>
             
             <div className="relative z-10">
                <div className="flex justify-between items-start">
                   <div>
                      <span className="px-3 py-1 bg-white/60 shadow-sm text-indigo-600 font-bold rounded-full text-xs uppercase tracking-wider mb-3 inline-block backdrop-blur-md">
                         {project.type}
                      </span>
                      <h1 className="text-3xl md:text-[clamp(1.75rem,5vw,2.5rem)] break-all font-semibold tabular-nums tracking-tight text-slate-900 mb-2">{project.name}</h1>
                      <div className="flex items-center gap-4 text-slate-500 font-medium">
                         <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {project.location}</span>
                         <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Started {project.startDate ? new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date(project.startDate)) : 'N/A'}</span>
                      </div>
                   </div>
                   <div className="flex gap-2">
                      <button onClick={handleShare} className="p-3 bg-white/50 hover:bg-white/80 text-slate-600 rounded-[24px] transition shadow-[0_4px_14px_rgba(15,23,42,0.03)] backdrop-blur-md" title="Share Project">
                         <Share2 className="w-5 h-5" />
                      </button>
                      <button onClick={handleExportPDF} className="p-3 bg-indigo-50/50 hover:bg-indigo-100/60 text-indigo-600 rounded-[24px] transition shadow-[0_4px_14px_rgba(15,23,42,0.03)] backdrop-blur-md" title="Export PDF">
                         <Printer className="w-5 h-5" />
                      </button>
                   </div>
                </div>

                <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
                   <div className="bg-emerald-50/50 backdrop-blur-md p-5 rounded-[24px] border border-emerald-100/50">
                     <p className="text-emerald-700 font-bold text-sm uppercase tracking-wider mb-1">Total Estimated Cost</p>
                     <p className="text-3xl font-semibold tabular-nums tracking-tight text-emerald-600">${totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                   </div>
                   <div className="bg-indigo-50/50 backdrop-blur-md p-5 rounded-[24px] border border-indigo-100/50">
                     <p className="text-indigo-700 font-bold text-sm uppercase tracking-wider mb-1">Calculations Run</p>
                     <p className="text-3xl font-semibold tabular-nums tracking-tight text-indigo-600">{project.estimates.length}</p>
                   </div>
                   <div className="bg-amber-50/50 backdrop-blur-md p-5 rounded-[24px] border border-amber-100/50">
                     <p className="text-amber-700 font-bold text-sm uppercase tracking-wider mb-1">Total Materials</p>
                     <p className="text-3xl font-semibold tabular-nums tracking-tight text-amber-600">{Object.keys(aggregatedMaterials).length}</p>
                   </div>
                </div>

                {project.estimates.length > 0 && (
                <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-slate-200/50">
                   <div>
                      <h3 className="text-lg font-semibold mb-6 text-slate-800">Cumulative Cost Trend</h3>
                      <div className="h-64">
                         <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={cumulativeTimelineData}>
                               <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                               <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                               <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(val) => `$${val >= 1000 ? (val/1000).toFixed(0)+'k' : val}`} width={60} />
                               <Tooltip formatter={(val: number) => `$${val.toLocaleString()}`} contentStyle={{ borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                               <Line type="monotone" dataKey="cumulativeCost" name="Cumulative Cost" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                            </LineChart>
                         </ResponsiveContainer>
                      </div>
                   </div>
                   
                   <div>
                      <h3 className="text-lg font-semibold mb-6 text-slate-800">Key Materials Consumption</h3>
                      <div className="h-64">
                         <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={materialTrendData}>
                               <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                               <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                               <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} width={40} />
                               <Tooltip contentStyle={{ borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} cursor={{ fill: '#f1f5f9', opacity: 0.5 }} />
                               <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                               {topMaterialKeys.map((key, i) => {
                                  const [matName] = key.split('_');
                                  const name = matName.charAt(0).toUpperCase() + matName.slice(1);
                                  return <Bar key={key} dataKey={name} fill={chartColors[i % chartColors.length]} radius={[4, 4, 0, 0]} maxBarSize={40} />;
                               })}
                            </BarChart>
                         </ResponsiveContainer>
                      </div>
                   </div>
                </div>
                )}
             </div>
           </div>

           {/* Global Adjustments / Executive Variables */}
           <div className="bg-white/40 backdrop-blur-xl border border-white/60 p-6 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <h2 className="text-lg font-semibold mb-4 text-slate-800 flex items-center gap-2">
                 Global Macro Adjustments
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 <div>
                    <label className="text-sm font-bold text-slate-600 block mb-2">Cost Inflation / Contingency: <span className="text-indigo-600">{inflationRate}%</span></label>
                    <input type="range" min="0" max="30" step="1" value={inflationRate} onChange={e => setInflationRate(Number(e.target.value))} className="w-full accent-indigo-600" />
                    <p className="text-xs text-slate-500 mt-1">Applies an automatic price hike to all historical estimates.</p>
                 </div>
                 <div>
                    <label className="text-sm font-bold text-slate-600 block mb-2">Material Waste Factor: <span className="text-amber-600">{wasteFactor}%</span></label>
                    <input type="range" min="0" max="25" step="1" value={wasteFactor} onChange={e => setWasteFactor(Number(e.target.value))} className="w-full accent-amber-600" />
                    <p className="text-xs text-slate-500 mt-1">Uniformly bumps all BOQ material quantities.</p>
                 </div>
              </div>
           </div>

           {/* Timeline & Operations */}
           <div className="bg-white/40 backdrop-blur-xl border border-white/60 p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <h2 className="text-xl font-semibold mb-6 text-slate-800">Calculation Timeline</h2>
              {project.estimates.length === 0 ? (
                 <div className="text-center py-10 text-slate-400 font-medium bg-slate-50/50 rounded-[24px] shadow-sm text-slate-800 rounded-[24px] border border-dashed border-slate-200/60">
                    <AlertCircle className="w-10 h-10 mx-auto mb-3 opacity-50" />
                    No calculation results saved to this project yet.
                 </div>
              ) : (
                <div className="space-y-4">
                  {project.estimates.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((est, idx) => (
                    <div key={est.id} className="flex items-start gap-4 p-4 rounded-[24px] hover:bg-white/60 transition group border border-transparent hover:border-white/80 shadow-[0_4px_14px_rgba(15,23,42,0.02)]">
                       <div className="flex flex-col items-center mt-1">
                         <div className="w-3 h-3 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
                         {idx !== project.estimates.length - 1 && <div className="w-0.5 h-full bg-slate-200/60 my-1"></div>}
                       </div>
                       <div className="flex-1">
                          <div className="flex justify-between">
                            <h4 className="font-bold text-slate-800 text-lg">{est.name}</h4>
                            <span className="text-sm font-bold text-indigo-600">${((Number(est.cost) || 0) * costMultiplier).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                          </div>
                          <p className="text-sm text-slate-500 font-medium mb-2">{new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' }).format(new Date(est.date))} • {est.category}</p>
                          
                          {/* Mini material preview */}
                          {est.materials && Object.keys(est.materials).length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                               {Object.entries(est.materials).slice(0, 4).map(([mat, data]) => (
                                 <span key={mat} className="px-2 py-1 bg-white/60 border border-white/80 text-slate-600 rounded text-xs font-semibold shadow-[0_2px_8px_rgba(15,23,42,0.02)]">
                                   {mat}: {(data.quantity * qtyMultiplier).toFixed(1)} {data.unit}
                                 </span>
                               ))}
                               {Object.keys(est.materials).length > 4 && (
                                 <span className="px-2 py-1 bg-white/60 border border-white/80 text-slate-500 rounded text-xs font-semibold shadow-[0_2px_8px_rgba(15,23,42,0.02)]">
                                   +{Object.keys(est.materials).length - 4} more
                                 </span>
                               )}
                            </div>
                          )}
                       </div>
                    </div>
                  ))}
                </div>
              )}
           </div>
         </div>

         {/* Sidebar Summary */}
         <div className="w-full lg:w-80 space-y-6">
            <div className="bg-white/40 backdrop-blur-xl border border-white/60 p-6 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
               <h3 className="font-bold text-lg mb-4 text-slate-800">Cost Breakdown</h3>
               {pieData.length > 0 ? (
                 <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={5} dataKey="value">
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(val: number) => `$${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} />
                      </PieChart>
                    </ResponsiveContainer>
                 </div>
               ) : (
                 <div className="h-48 flex items-center justify-center text-slate-400 text-sm italic border border-dashed rounded-[24px] border-slate-200/60 bg-white/30">No data</div>
               )}
               
               <div className="space-y-3 mt-4">
                  {pieData.map((d, i) => (
                    <div key={d.name} className="flex justify-between items-center text-sm">
                       <div className="flex items-center gap-2">
                         <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></span>
                         <span className="font-medium text-slate-600">{d.name}</span>
                       </div>
                       <span className="font-bold text-slate-800">${d.value.toLocaleString('en-US')}</span>
                    </div>
                  ))}
               </div>
            </div>

            <div className="bg-white/40 backdrop-blur-xl border border-white/60 p-6 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
               <h3 className="font-bold text-lg mb-4 text-slate-800">Aggregated Materials</h3>
               <div className="space-y-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                  {Object.entries(aggregatedMaterials).length === 0 ? (
                     <p className="text-slate-500 text-sm">No materials calculated.</p>
                  ) : (
                     Object.entries(aggregatedMaterials).map(([key, data]) => {
                        const [name, _] = key.split('_');
                        return (
                          <div key={key} className="flex justify-between items-center py-2 border-b border-slate-100/50 last:border-0">
                             <div className="flex flex-col">
                               <span className="font-bold text-sm text-slate-700 capitalize">{name}</span>
                             </div>
                             <div className="flex flex-col items-end">
                               <span className="font-semibold tabular-nums tracking-tight text-indigo-600">{data.quantity.toFixed(1)} {data.unit}</span>
                             </div>
                          </div>
                        )
                     })
                  )}
               </div>
            </div>
         </div>
       </div>
    
      <CalculationHistory
        calculatorId="project_manager"
        estimationName="Project Summary"
        currentInputs={{}}
      />
      </div>
  );
}
