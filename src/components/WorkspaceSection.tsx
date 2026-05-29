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
} from "lucide-react";
import { getMyEstimates, saveEstimate } from "../lib/estimates";
import CountUp from "react-countup";
import { getCategoryThemeNew } from "./ToolCard";

export default function WorkspaceSection({
  onSelect,
}: {
  onSelect: (id: string) => void;
}) {
  const { user } = useAuth();
  const { settings } = useSettings();
  const [recentTools, setRecentTools] = useState<any[]>([]);
  const [favoriteTools, setFavoriteTools] = useState<any[]>([]);
  const [savedProjects, setSavedProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");

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

    // Load recent estimates
    async function loadData() {
      if (!user) return;
      try {
        const data: any[] | undefined = await getMyEstimates();
        if (data) {
          data.sort((a, b) => b.createdAt - a.createdAt);
          setSavedProjects(data.slice(0, 3));
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
  }, [user, settings.usedTools]);

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) return;
    try {
      if (user) {
        await saveEstimate(newProjectName, {}, "Project Folder");
        const data: any[] | undefined = await getMyEstimates();
        if (data) {
          data.sort((a, b) => b.createdAt - a.createdAt);
          setSavedProjects(data.slice(0, 3));
        }
      }
    } catch {
      const newProj = {
        name: newProjectName,
        type: "Project Folder",
        createdAt: Date.now(),
      };
      setSavedProjects((prev) => [newProj, ...prev].slice(0, 3));
    }
    setNewProjectName("");
    setIsCreatingProject(false);
  };

  if (!user) return null;

  return (
    <div className="w-full py-8 md:py-12 mb-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h2
            className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight"
            style={{ fontFamily: '"Clash Display", sans-serif' }}
          >
            Continue Where You Left Off
          </h2>
          <p className="text-slate-500 font-medium mt-2">
            Welcome back, {user.displayName?.split(" ")[0] || "Engineer"}. Ready
            to build something?
          </p>
        </div>

        {/* Stat Card */}
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl px-5 py-3 flex items-center gap-4 shrink-0 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-indigo-500 shadow-sm">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
              Efficiency
            </div>
            <div className="text-sm font-bold text-indigo-900">
              You've saved{" "}
              <CountUp start={0} end={3.2} decimals={1} duration={2.5} /> hours
              this month
            </div>
          </div>
        </div>
      </div>

      {/* Quick Launch Favorites */}
      <div className="flex items-center gap-3 overflow-x-auto pb-4 mb-4 no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap mr-2">
          Favorites:
        </span>
        {favoriteTools.map((mod) => (
          <button
            key={`fav-${mod.id}`}
            onClick={() => onSelect(mod.id)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-md hover:-translate-y-0.5 rounded-full whitespace-nowrap text-sm font-bold text-slate-700 transition-all shrink-0"
          >
            <mod.icon className="w-4 h-4 text-indigo-500" />
            {mod.title}
          </button>
        ))}
        <button
          onClick={() => {
            /* Open module list */
          }}
          className="w-9 h-9 rounded-full bg-slate-50 border border-slate-200 flex flex-col items-center justify-center hover:bg-slate-100 transition-colors shrink-0"
        >
          <Plus className="w-4 h-4 text-slate-500" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Recently Used Tools */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[14px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Clock className="w-4 h-4" /> Recent Tools
            </h3>
            <button className="text-[13px] font-bold text-indigo-600 hover:underline flex items-center gap-1 group">
              View Directory{" "}
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          <div className="flex overflow-x-auto md:grid md:grid-cols-2 gap-4 pb-4 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 snap-x">
            {recentTools.map((mod, idx) => {
              const theme = getCategoryThemeNew(mod.category);
              return (
                <motion.button
                  key={`recent-${mod.id}-${idx}`}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onSelect(mod.id)}
                  className={`min-w-[260px] md:min-w-0 bg-white border ${theme.border} rounded-[20px] p-5 text-left flex flex-col hover:shadow-lg transition-all snap-start group`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 text-slate-600 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center transition-colors">
                      <mod.icon className="w-6 h-6" />
                    </div>
                    <div className="px-2.5 py-1 bg-slate-100 text-slate-500 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      {mod.lastUsed}
                    </div>
                  </div>
                  <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-1">
                    {mod.title}
                  </h4>
                  <p className="text-xs text-slate-500 font-medium">
                    {mod.category}
                  </p>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Project Folders / Saved Calculations */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[14px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <FolderOpen className="w-4 h-4" /> Project Folders
            </h3>
            <button
              onClick={() => setIsCreatingProject(true)}
              className="w-7 h-7 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 flex items-center justify-center transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 bg-white border border-slate-200 rounded-[24px] overflow-hidden flex flex-col shadow-sm">
            <AnimatePresence>
              {isCreatingProject && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-slate-50 border-b border-slate-200 overflow-hidden"
                >
                  <div className="p-4 flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="e.g. Tower Block Phase 1"
                      className="flex-1 text-sm bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500/50"
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
                      className="w-9 h-9 flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg transition-colors shrink-0"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setIsCreatingProject(false);
                        setNewProjectName("");
                      }}
                      className="w-9 h-9 flex items-center justify-center bg-white border border-slate-200 hover:bg-slate-100 text-slate-500 rounded-lg transition-colors shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {loading ? (
              <div className="p-8 text-center text-slate-400 flex flex-col items-center">
                <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin mb-3"></div>
                Loading projects...
              </div>
            ) : savedProjects.length > 0 ? (
              <div className="flex flex-col divide-y divide-slate-100">
                {savedProjects.map((proj, idx) => (
                  <div
                    key={idx}
                    className="p-4 hover:bg-slate-50 transition-colors cursor-pointer group flex items-start gap-3"
                  >
                    <div className="w-10 h-10 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
                      <FolderOpen className="w-5 h-5 fill-orange-200/50" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-sm font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                          {proj.name || "Untitled Check"}
                        </h4>
                        <button className="text-slate-300 hover:text-slate-500">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium flex items-center gap-2 mt-1">
                        <span>
                          {new Date(proj.createdAt).toLocaleDateString()}
                        </span>
                        <span>•</span>
                        <span className="truncate">
                          {proj.type || "Estimate"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Demo Add Project Folder */}
                <button className="p-4 flex items-center justify-center gap-2 text-indigo-600 font-bold text-sm bg-indigo-50/50 hover:bg-indigo-50 transition-colors mt-auto">
                  <FolderPlus className="w-4 h-4" /> View All Projects
                </button>
              </div>
            ) : (
              <div className="p-8 text-center flex flex-col items-center justify-center h-full">
                <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                  <FolderOpen className="w-8 h-8 text-slate-300" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">
                  No Projects Yet
                </h4>
                <p className="text-xs text-slate-500 mb-4 max-w-[200px]">
                  Save your calculations to project folders.
                </p>
                <button
                  onClick={() => onSelect("qs-workflow")}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs transition-colors"
                >
                  Create Estimate
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
