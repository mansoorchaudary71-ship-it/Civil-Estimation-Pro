import React, { useState } from 'react';
import { useProjects, Project } from '../../context/ProjectContext';
import { Plus, FolderOpen, Calendar, MapPin, Building, Share2, Printer, ChevronRight, BarChart3, AlertCircle } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 md:p-8 rounded-[2rem] shadow-sm">
        <div>
          <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-3">
             <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-2xl">
               <FolderOpen className="w-8 h-8" />
             </div>
             Project Manager
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Manage and group your calculations by project.</p>
        </div>
        <div className="flex gap-2">
           {compareIds[0] && compareIds[1] && (
             <button onClick={() => setView('compare')} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-full font-bold shadow-md hover:shadow-lg transition-all animate-pulse">
                Compare Selected
             </button>
           )}
           <button 
             onClick={() => setIsCreating(!isCreating)}
             className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
           >
             <Plus className="w-5 h-5" /> New Project
           </button>
        </div>
      </div>

      {isCreating && (
        <form onSubmit={handleCreate} className="bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-900/30 p-6 rounded-[2rem] shadow-sm transform transition-all">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Plus className="text-indigo-500" /> Create New Project
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Project Name</label>
              <input type="text" value={newProject.name} onChange={e => setNewProject({...newProject, name: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none" required placeholder="e.g. Al-Hamra Tower" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Location</label>
              <input type="text" value={newProject.location} onChange={e => setNewProject({...newProject, location: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="City, Area" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Type</label>
              <select value={newProject.type} onChange={e => setNewProject({...newProject, type: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none">
                <option>Residential</option>
                <option>Commercial</option>
                <option>Infrastructure</option>
                <option>Industrial</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Start Date</label>
              <input type="date" value={newProject.startDate} onChange={e => setNewProject({...newProject, startDate: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button type="submit" className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition">Save Project</button>
            <button type="button" onClick={() => setIsCreating(false)} className="px-6 py-2.5 bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition">Cancel</button>
          </div>
        </form>
      )}

      {projects.length === 0 && !isCreating ? (
        <div className="py-20 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2rem]">
          <FolderOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">No projects yet</h3>
          <p className="text-slate-500">Create a project to start grouping your estimates and calculations.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(proj => {
             const isCompare = compareIds.includes(proj.id);
             return (
            <div key={proj.id} className={`group bg-white dark:bg-slate-900 border ${activeProjectId === proj.id ? 'border-indigo-500 ring-1 ring-indigo-500' : 'border-slate-200 dark:border-slate-800'} p-6 rounded-[2rem] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col relative overflow-hidden`}>
              
              {isCompare && (
                 <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/10">
                    <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center border-2 border-white dark:border-slate-900 pointer-events-none"></div>
                 </div>
              )}

              <div className="flex justify-between items-start mb-4 relative z-10">
                 <div>
                   <h3 className="text-xl font-bold text-slate-800 dark:text-white leading-tight">{proj.name}</h3>
                   <div className="flex items-center gap-2 mt-2">
                     <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold rounded-full">{proj.type}</span>
                     {activeProjectId === proj.id && (
                       <span className="px-2.5 py-1 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 text-xs font-bold rounded-full">Active</span>
                     )}
                   </div>
                 </div>
              </div>
              
              <div className="space-y-2 mb-6">
                 <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <MapPin className="w-4 h-4" /> {proj.location}
                 </div>
                 <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <Calendar className="w-4 h-4" /> Started {proj.startDate ? new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(proj.startDate)) : 'N/A'}
                 </div>
                 <div className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
                    <BarChart3 className="w-4 h-4" /> {proj.estimates.length} calculations saved
                 </div>
              </div>
              
              <div className="mt-auto flex flex-col gap-2">
                 <div className="flex gap-2">
                   <button onClick={() => handleView(proj.id)} className="flex-1 py-2.5 bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 font-bold rounded-xl transition flex justify-center items-center gap-1">
                      View Details <ChevronRight className="w-4 h-4" />
                   </button>
                   <button 
                     onClick={() => setActiveProjectId(activeProjectId === proj.id ? null : proj.id)} 
                     className={`px-4 py-2.5 font-bold rounded-xl transition ${activeProjectId === proj.id ? 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400' : 'border border-indigo-200 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-400 dark:hover:bg-indigo-900/30'}`}
                     title={activeProjectId === proj.id ? "Deactivate" : "Set as Active Project"}
                   >
                     {activeProjectId === proj.id ? "Disable" : "Set Active"}
                   </button>
                 </div>
                 
                 <button 
                   onClick={() => toggleCompareSelect(proj.id)}
                   className={`w-full py-2 text-xs font-bold rounded-xl transition-colors border ${isCompare ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30' : 'bg-transparent text-slate-400 border-slate-200 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700'}`}
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
         <div key={proj.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2rem] shadow-sm">
            <h1 className="text-2xl font-black text-slate-800 dark:text-white mb-6 flex items-center gap-2">
               <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm">{i+1}</span>
               {proj.name}
            </h1>
            
            <div className="space-y-6">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                 <p className="text-sm font-bold text-slate-500 mb-1">Total Cost estimate</p>
                 <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400">${totals.cost.toLocaleString()}</p>
                 {i === 1 && t1.cost !== 0 && (
                    <p className={`text-sm font-bold ${t2.cost > t1.cost ? 'text-rose-500' : 'text-emerald-500'} mt-1`}>
                       {Math.abs(t2.cost - t1.cost).toLocaleString()} difference
                    </p>
                 )}
              </div>
              
              <div>
                 <h4 className="font-bold text-slate-700 dark:text-slate-300 mb-3 border-b border-slate-200 dark:border-slate-700 pb-2">Material Comparison</h4>
                 <div className="space-y-3">
                    {allMaterialKeys.map(m => {
                       const v1 = t1.materials[m] || 0;
                       const v2 = t2.materials[m] || 0;
                       const v = i === 0 ? v1 : v2;
                       const higher = (i === 0 && v1 > v2) || (i === 1 && v2 > v1);
                       return (
                          <div key={m} className="flex justify-between items-center text-sm">
                            <span className="font-semibold text-slate-600 dark:text-slate-400">{m}</span>
                            <span className={`font-black ${higher ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'}`}>
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
  
  // Aggregate total cost
  const totalCost = project.estimates.reduce((sum, est) => sum + (Number(est.cost) || 0), 0);
  
  // Aggregate Materials
  const aggregatedMaterials: Record<string, { quantity: number; unit: string; count: number }> = {};
  project.estimates.forEach(est => {
    if (est.materials) {
      Object.entries(est.materials).forEach(([matName, { quantity, unit }]) => {
         const key = `${matName.toLowerCase()}_${unit.toLowerCase()}`;
         if (!aggregatedMaterials[key]) {
           aggregatedMaterials[key] = { quantity: 0, unit, count: 0 };
         }
         aggregatedMaterials[key].quantity += quantity;
         aggregatedMaterials[key].count += 1;
      });
    }
  });

  // Prepare Pie Chart Data based on estimate cost categories
  const categoryCosts = project.estimates.reduce((acc, est) => {
     const cat = est.category || 'Other';
     acc[cat] = (acc[cat] || 0) + (Number(est.cost) || 0);
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

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
       <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold transition">
          <ChevronRight className="w-5 h-5 rotate-180" /> Back to Projects
       </button>
       
       <div className="flex flex-col lg:flex-row gap-6">
         {/* Main Summary Panel */}
         <div className="flex-1 space-y-6">
           <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2rem] shadow-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-5">
               <Building className="w-48 h-48" />
             </div>
             
             <div className="relative z-10">
                <div className="flex justify-between items-start">
                   <div>
                      <span className="px-3 py-1 bg-indigo-50 text-indigo-600 font-bold rounded-full text-xs uppercase tracking-wider mb-3 inline-block">
                         {project.type}
                      </span>
                      <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2">{project.name}</h1>
                      <div className="flex items-center gap-4 text-slate-500 font-medium">
                         <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {project.location}</span>
                         <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Started {project.startDate ? new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date(project.startDate)) : 'N/A'}</span>
                      </div>
                   </div>
                   <div className="flex gap-2">
                      <button onClick={handleShare} className="p-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl transition shadow-sm" title="Share Project">
                         <Share2 className="w-5 h-5" />
                      </button>
                      <button onClick={handleExportPDF} className="p-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl transition shadow-sm" title="Export PDF">
                         <Printer className="w-5 h-5" />
                      </button>
                   </div>
                </div>

                <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
                   <div className="bg-emerald-50 dark:bg-emerald-500/10 p-5 rounded-2xl border border-emerald-100 dark:border-emerald-500/20">
                     <p className="text-emerald-700 dark:text-emerald-400 font-bold text-sm uppercase tracking-wider mb-1">Total Estimated Cost</p>
                     <p className="text-3xl font-black text-emerald-600 dark:text-emerald-300">${totalCost.toLocaleString()}</p>
                   </div>
                   <div className="bg-indigo-50 dark:bg-indigo-500/10 p-5 rounded-2xl border border-indigo-100 dark:border-indigo-500/20">
                     <p className="text-indigo-700 dark:text-indigo-400 font-bold text-sm uppercase tracking-wider mb-1">Calculations Run</p>
                     <p className="text-3xl font-black text-indigo-600 dark:text-indigo-300">{project.estimates.length}</p>
                   </div>
                   <div className="bg-amber-50 dark:bg-amber-500/10 p-5 rounded-2xl border border-amber-100 dark:border-amber-500/20">
                     <p className="text-amber-700 dark:text-amber-400 font-bold text-sm uppercase tracking-wider mb-1">Total Materials</p>
                     <p className="text-3xl font-black text-amber-600 dark:text-amber-300">{Object.keys(aggregatedMaterials).length}</p>
                   </div>
                </div>
             </div>
           </div>

           {/* Timeline & Operations */}
           <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2rem] shadow-sm">
              <h2 className="text-xl font-bold mb-6 text-slate-800 dark:text-white">Calculation Timeline</h2>
              {project.estimates.length === 0 ? (
                 <div className="text-center py-10 text-slate-400 font-medium bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                    <AlertCircle className="w-10 h-10 mx-auto mb-3 opacity-50" />
                    No calculation results saved to this project yet.
                 </div>
              ) : (
                <div className="space-y-4">
                  {project.estimates.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((est, idx) => (
                    <div key={est.id} className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition group border border-transparent hover:border-slate-100 dark:hover:border-slate-700">
                       <div className="flex flex-col items-center mt-1">
                         <div className="w-3 h-3 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
                         {idx !== project.estimates.length - 1 && <div className="w-0.5 h-full bg-slate-200 dark:bg-slate-700 my-1"></div>}
                       </div>
                       <div className="flex-1">
                          <div className="flex justify-between">
                            <h4 className="font-bold text-slate-800 dark:text-white text-lg">{est.name}</h4>
                            <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">${(Number(est.cost) || 0).toLocaleString()}</span>
                          </div>
                          <p className="text-sm text-slate-500 font-medium mb-2">{new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' }).format(new Date(est.date))} • {est.category}</p>
                          
                          {/* Mini material preview */}
                          {est.materials && Object.keys(est.materials).length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                               {Object.entries(est.materials).slice(0, 4).map(([mat, data]) => (
                                 <span key={mat} className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded text-xs font-semibold">
                                   {mat}: {data.quantity.toFixed(1)} {data.unit}
                                 </span>
                               ))}
                               {Object.keys(est.materials).length > 4 && (
                                 <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded text-xs font-semibold">
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
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-[2rem] shadow-sm">
               <h3 className="font-bold text-lg mb-4 text-slate-800 dark:text-white">Cost Breakdown</h3>
               {pieData.length > 0 ? (
                 <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={5} dataKey="value">
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(val: number) => `$${val.toLocaleString()}`} />
                      </PieChart>
                    </ResponsiveContainer>
                 </div>
               ) : (
                 <div className="h-48 flex items-center justify-center text-slate-400 text-sm italic border border-dashed rounded-xl border-slate-200 dark:border-slate-700">No data</div>
               )}
               
               <div className="space-y-3 mt-4">
                  {pieData.map((d, i) => (
                    <div key={d.name} className="flex justify-between items-center text-sm">
                       <div className="flex items-center gap-2">
                         <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></span>
                         <span className="font-medium text-slate-600 dark:text-slate-300">{d.name}</span>
                       </div>
                       <span className="font-bold text-slate-800 dark:text-white">${d.value.toLocaleString()}</span>
                    </div>
                  ))}
               </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-[2rem] shadow-sm">
               <h3 className="font-bold text-lg mb-4 text-slate-800 dark:text-white">Aggregated Materials</h3>
               <div className="space-y-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                  {Object.entries(aggregatedMaterials).length === 0 ? (
                     <p className="text-slate-500 text-sm">No materials calculated.</p>
                  ) : (
                     Object.entries(aggregatedMaterials).map(([key, data]) => {
                        const [name, _] = key.split('_');
                        return (
                          <div key={key} className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
                             <div className="flex flex-col">
                               <span className="font-bold text-sm text-slate-700 dark:text-slate-200 capitalize">{name}</span>
                             </div>
                             <div className="flex flex-col items-end">
                               <span className="font-black text-indigo-600 dark:text-indigo-400">{data.quantity.toFixed(1)} {data.unit}</span>
                             </div>
                          </div>
                        )
                     })
                  )}
               </div>
            </div>
         </div>
       </div>
    </div>
  );
}
