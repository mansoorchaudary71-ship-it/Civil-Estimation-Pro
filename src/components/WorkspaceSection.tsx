import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../contexts/AuthContext";
import { useSettings } from "../context/SettingsContext";
import { ALL_MODULES } from "./Dashboard";
import {
  Clock,
  FolderOpen,
  Plus,
  ArrowRight,
  TrendingUp,
  FolderPlus,
  MoreVertical,
  Activity,
  Calculator,
  X,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FileText,
  Flame,
  Bell, // new imports
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { getMyEstimates, saveEstimate } from "../lib/estimates";
import CountUp from "react-countup";


export default function WorkspaceSection({
  onSelect,
}: {
  onSelect: (id: string) => void;
}) {
  const { user } = useAuth();
  const { settings } = useSettings();
  const [recentTools, setRecentTools] = useState<any[]>([]);
  const [favoriteTools, setFavoriteTools] = useState<any[]>([]);
  const [recommendedTools, setRecommendedTools] = useState<any[]>([]);
  const [savedProjects, setSavedProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [checklistOpen, setChecklistOpen] = useState(true);
  
  // Time-based greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  useEffect(() => {
    // Populate favorite tools based on popular or custom logic
    const favs = ALL_MODULES.filter((m) =>
      settings.usedTools?.includes(m.id),
    ).slice(0, 5);
    if (favs.length < 5) {
      favs.push(
        ...ALL_MODULES.filter((m) => m.isPopular && !favs.includes(m)).slice(
          0,
          5 - favs.length,
        ),
      );
    }
    setFavoriteTools(favs);

    // Recent tools mock based on settings
    const recent = (settings.usedTools || [])
      .map((id) => ALL_MODULES.find((m) => m.id === id))
      .filter(Boolean)
      .reverse()
      .slice(0, 4);

    if (recent.length < 4) {
      recent.push(
        ...ALL_MODULES.filter((m) => !recent.includes(m)).slice(
          0,
          4 - recent.length,
        ),
      );
    }
    setRecentTools(
      recent.map((m) => ({
        ...m,
        lastUsed: new Date(
          Date.now() - Math.random() * 100000000,
        ).toLocaleDateString(),
      })),
    );

    // Recommended tools based on role
    let recommended = ALL_MODULES.filter(m => m.isPopular).slice(0, 3);
    if (settings.role === 'Student') {
       recommended = ALL_MODULES.filter(m => ['concrete-mix', 'bbs-generator', 'unit-converter'].includes(m.id));
    } else if (settings.role === 'Contractor') {
       recommended = ALL_MODULES.filter(m => ['quick-rough', 'house', 'brickwork'].includes(m.id));
    }
    if (recommended.length === 0) recommended = ALL_MODULES.slice(0, 3);
    setRecommendedTools(recommended);

    // Load recent estimates
    async function loadData() {
      if (!user) return;
      try {
        const data: any[] | undefined = await getMyEstimates();
        if (data) {
          data.sort((a, b) => b.createdAt - a.createdAt);
          setSavedProjects(data.slice(0, 5)); // Load up to 5
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      loadData();
    } else {
      setLoading(false);
    }
  }, [user, settings.usedTools, settings.role]);

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) return;
    try {
      if (user) {
        await saveEstimate(newProjectName, {}, "Project Folder");
        const data: any[] | undefined = await getMyEstimates();
        if (data) {
          data.sort((a, b) => b.createdAt - a.createdAt);
          setSavedProjects(data.slice(0, 5));
        }
      }
    } catch {
      const newProj = {
        name: newProjectName,
        type: "Project Folder",
        createdAt: Date.now(),
      };
      setSavedProjects((prev) => [newProj, ...prev].slice(0, 5));
    }
    setNewProjectName("");
    setIsCreatingProject(false);
  };

  if (!user) return null;

  const completedProfile = !!settings.role && !!settings.projectType;
  const ranCalc = !!settings.hasRunCalculation;
  const exportedBOQ = !!settings.hasExportedBOQ;
  const savedTool = settings.favoriteTools && settings.favoriteTools.length > 0;

  const tasks = [
    { label: 'Complete your profile', done: completedProfile },
    { label: 'Run your first calculation', done: ranCalc },
    { label: 'Export your first BOQ', done: exportedBOQ },
    { label: 'Save a tool to favorites', done: savedTool },
  ];

  const completedCount = tasks.filter(t => t.done).length;
  const progress = (completedCount / tasks.length) * 100;
  const progressPercent = Math.round(progress);

  // Mock Notifications
  const notifications = [
    { id: 1, text: "New Tool: Solar Roof Calculator is now live!", type: "new" },
    { id: 2, text: "Don't forget to export your 'Tower Block Phase 1' BOQ.", type: "reminder" }
  ];

  return (
    <div className="w-full py-8 md:py-12 mb-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">


        {/* Quick Stats */}
        <div className="flex gap-4 overflow-x-auto pb-2 md:pb-0 scrollbar-hide shrink-0">
          <div className="bg-white  border border-slate-200  rounded-[32px] px-5 py-4 flex items-center gap-4 shadow-sm min-w-[200px]">
            <div className="w-10 h-10 rounded-full bg-slate-100  flex items-center justify-center text-slate-500 ">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                Calculations
              </div>
              <div className="text-lg font-semibold tabular-nums tracking-tight text-slate-900  mt-0.5">
                <CountUp start={0} end={42} duration={2} /> <span className="text-sm font-medium text-slate-500 ">this month</span>
              </div>
            </div>
          </div>
          <div className="bg-[#FFFFFF]/10  border border-[#FFFFFF]/20  rounded-[32px] px-5 py-4 flex items-center gap-4 shadow-sm min-w-[200px]">
            <div className="w-10 h-10 rounded-full bg-white  flex items-center justify-center text-slate-900">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Time Saved
              </div>
              <div className="text-lg font-semibold tabular-nums tracking-tight text-slate-900  mt-0.5">
                <CountUp start={0} end={14.5} decimals={1} duration={2.5} /> <span className="text-sm font-medium text-slate-900">hrs</span>
              </div>
            </div>
          </div>
          <div className="bg-white  rounded-[32px] px-5 py-4 flex items-center gap-4 shadow-sm min-w-[200px]">
             <div className="w-10 h-10 rounded-full bg-white  flex items-center justify-center text-emerald-400 border border-slate-200  shadow-sm">
               <Flame className="w-5 h-5" />
             </div>
             <div>
               <div className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                 Current Streak
               </div>
               <div className="text-lg font-semibold tabular-nums tracking-tight text-slate-900 mt-0.5">
                 <CountUp start={0} end={7} duration={1.5} /> <span className="text-sm font-medium text-slate-600">days</span>
               </div>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-start mb-8">
        <div className="lg:col-span-2">
          {/* Your Tools (Favorites) */}
          <div className="mb-8">
             <div className="flex items-center justify-between mb-4">
               <h3 className="text-[14px] font-bold text-slate-600 uppercase tracking-widest flex items-center gap-2">
                 <Activity className="w-4 h-4" /> Your Tools
               </h3>
             </div>
             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {favoriteTools.map((mod) => (
                  <button
                    key={`your-${mod.id}`}
                    onClick={() => onSelect(mod.id)}
                    className="flex items-center gap-3 px-4 py-3 bg-white  border border-slate-200  hover:border-[#FFFFFF]/40 text-slate-900 hover:shadow-md hover:-translate-y-0.5 rounded-[32px] text-sm font-bold text-slate-700  transition-all text-left"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#FFFFFF]/10  flex items-center justify-center text-slate-900  shrink-0">
                       <mod.icon className="w-4 h-4" />
                    </div>
                    <span className="truncate">{mod.title}</span>
                  </button>
                ))}
                <button
                  onClick={() => {/* open all modules */}}
                  className="flex items-center gap-3 px-4 py-3 bg-slate-50  border border-slate-200  border-dashed hover:border-slate-300  rounded-[32px] text-sm font-bold text-slate-500  transition-all text-left"
                >
                   <div className="w-8 h-8 rounded-full bg-white  border border-slate-200  flex items-center justify-center shrink-0">
                      <Plus className="w-4 h-4" />
                   </div>
                   Pin Tool
                </button>
             </div>
          </div>

          {/* Recent History */}
          <div className="mb-0">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[14px] font-bold text-slate-600 uppercase tracking-widest flex items-center gap-2">
                <Clock className="w-4 h-4" /> Recent History
              </h3>
            </div>
            
            <div className="bg-white  border border-slate-200  rounded-[32px] overflow-hidden flex flex-col shadow-sm">
               {loading ? (
                 <div className="p-8 text-center text-slate-600 flex flex-col items-center">
                   <div className="w-8 h-8 rounded-full border-2 border-[#FFFFFF] border-t-transparent animate-spin mb-3"></div>
                   Loading recent...
                 </div>
               ) : savedProjects.length > 0 ? (
                 <div className="flex flex-col divide-y divide-slate-100">
                    {savedProjects.map((proj, idx) => (
                      <div
                        key={`recent-${idx}`}
                        className="p-4 hover:bg-slate-50  transition-colors group flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-4 min-w-0 flex-1">
                           <div className="w-10 h-10 rounded-[32px] bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                             <FileText className="w-5 h-5" />
                           </div>
                           <div className="min-w-0 pr-4">
                             <h4 className="text-sm font-bold text-slate-900  truncate group-hover:text-slate-900  transition-colors">
                               {proj.name || "Untitled Estimate"}
                             </h4>
                             <div className="text-[11px] text-slate-500  font-medium flex items-center gap-2 mt-1">
                               <span>
                                 {new Date(proj.createdAt).toLocaleDateString()}
                               </span>
                               <span>•</span>
                               <span className="truncate">
                                 {proj.type || "Estimation"}
                               </span>
                             </div>
                           </div>
                        </div>
                        <button 
                           onClick={() => { /* re-run logic */ }}
                           className="px-3 py-1.5 bg-slate-100  text-slate-600  hover:bg-[#FFFFFF] hover:text-slate-900 rounded-[32px] text-xs font-bold transition-colors flex items-center gap-1 shrink-0"
                        >
                           <RefreshCw className="w-3.5 h-3.5" /> Re-run
                        </button>
                      </div>
                    ))}
                 </div>
               ) : (
                 <div className="p-8 text-center flex flex-col items-center">
                    <FileText className="w-8 h-8 text-slate-700 mb-3" />
                    <p className="text-sm font-bold text-slate-900 ">No recent calculations</p>
                 </div>
               )}
            </div>
          </div>

          {/* Project Folders */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[14px] font-bold text-slate-600 uppercase tracking-widest flex items-center gap-2">
                <FolderOpen className="w-4 h-4" /> Project Folders
              </h3>
              <button
                onClick={() => setIsCreatingProject(true)}
                className="w-7 h-7 rounded-full bg-[#FFFFFF]/10  text-slate-900  hover:bg-[#FFFFFF]/20 flex items-center justify-center transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            <div className="bg-white  border border-slate-200  rounded-[32px] overflow-hidden flex flex-col shadow-sm">
                <AnimatePresence>
                  {isCreatingProject && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-slate-50  border-b border-slate-200  overflow-hidden"
                    >
                      <div className="p-4 flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="e.g. Tower Block Phase 1"
                          className="flex-1 text-sm bg-white  border border-slate-200  rounded-[32px] px-3 py-2 outline-none focus:ring-2 focus:ring-[#FFFFFF]/50 min-h-[44px]"
                          value={newProjectName}
                          onChange={(e) => setNewProjectName(e.target.value)}
                          onKeyDown={(e) =>
                            e.key === "Enter" && handleCreateProject()
                          }
                          autoFocus
                        />
                        <button
                          onClick={handleCreateProject}
                          disabled={!newProjectName.trim()}
                          className="w-9 h-9 flex items-center justify-center bg-[#FFFFFF] hover:bg-[#FFFFFF] disabled:opacity-50 text-slate-900 rounded-[32px] transition-colors shrink-0"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setIsCreatingProject(false);
                            setNewProjectName("");
                          }}
                          className="w-9 h-9 flex items-center justify-center bg-white  border border-slate-200  hover:bg-slate-100  text-slate-500  rounded-[32px] transition-colors shrink-0"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {loading ? (
                  <div className="p-8 text-center text-slate-600 flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full border-2 border-[#FFFFFF] border-t-transparent animate-spin mb-3"></div>
                    Loading folders...
                  </div>
                ) : savedProjects.length > 0 ? (
                  <div className="flex flex-col divide-y divide-slate-100">
                     {savedProjects.map((proj, idx) => (
                       <div
                         key={`folder-${idx}`}
                         className="p-4 hover:bg-slate-50  transition-colors group flex items-start gap-3 cursor-pointer"
                       >
                         <div className="w-10 h-10 rounded-[32px] bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
                           <FolderOpen className="w-5 h-5 fill-orange-200/50" />
                         </div>
                         <div className="flex-1 min-w-0">
                           <div className="flex items-center justify-between gap-2">
                             <h4 className="text-sm font-bold text-slate-900  truncate group-hover:text-slate-900  transition-colors">
                               {proj.name || "Untitled"}
                             </h4>
                             <button className="text-slate-700 hover:text-slate-500 ">
                               <MoreVertical className="w-4 h-4" />
                             </button>
                           </div>
                           <div className="text-[11px] text-slate-500  font-medium flex items-center gap-2 mt-1">
                             <span>Folder created</span>
                           </div>
                         </div>
                       </div>
                     ))}
                  </div>
                ) : (
                  <div className="p-8 text-center flex flex-col items-center">
                     <FolderOpen className="w-8 h-8 text-slate-700 mb-3" />
                     <p className="text-sm font-bold text-slate-900 ">No project folders</p>
                  </div>
                )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-8">
           {/* Recommended Tools */}
           <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[14px] font-bold text-slate-600 uppercase tracking-widest flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" /> Recommended For You
                </h3>
              </div>
              <div className="flex flex-col gap-3">
                 {recommendedTools.map(mod => (
                    <button 
                      key={`rec-${mod.id}`}
                      onClick={() => onSelect(mod.id)}
                      className="flex items-center justify-between p-4 bg-white  hover:bg-slate-50  rounded-[32px] border border-slate-200  transition-all text-left group shadow-sm hover:shadow-md"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-[32px] bg-slate-50  flex items-center justify-center text-slate-600  group-hover:bg-[#FFFFFF] group-hover:text-slate-900 transition-colors">
                          <mod.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900  text-sm">{mod.title}</p>
                          <p className="text-[11px] text-slate-500 ">{mod.category}</p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-700 group-hover:text-slate-900  group-hover:translate-x-1 transition-all" />
                    </button>
                 ))}
              </div>
           </div>

           {/* Notifications */}
           <div className="bg-[#FFFFFF]/10  rounded-[32px] border border-[#FFFFFF]/20  p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                 <Bell className="w-32 h-32 text-slate-900 -rotate-12" />
              </div>
              <h3 className="font-bold text-slate-900  mb-4 flex items-center gap-2 relative z-10">
                 <Bell className="w-4 h-4" /> Notifications
              </h3>
              <div className="flex flex-col gap-3 relative z-10">
                 {notifications.map(note => (
                    <div key={note.id} className="bg-white  backdrop-blur-sm p-3 rounded-[32px] border border-indigo-50/50 flex items-start gap-3">
                       <div className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${note.type === 'new' ? 'bg-amber-500' : 'bg-[#FFFFFF]/10 '}`} />
                       <p className="text-sm font-medium text-slate-700  leading-snug">{note.text}</p>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
      
      {/* Settings Modal Toggle Hint */}
      <div className="text-center mt-4">
         <p className="text-xs font-medium text-slate-600">
            Tip: You can toggle Dark/Light mode in your <button className="text-slate-900 font-bold hover:underline">Profile Settings</button>.
         </p>
      </div>

    </div>
  );
}
