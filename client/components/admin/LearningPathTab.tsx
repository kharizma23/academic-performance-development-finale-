"use client";

import React, { useEffect, useState } from "react";
import { 
  GraduationCap, Target, Compass, Loader2, 
  Zap, CheckCircle2, Award, ArrowRightCircle, 
  Share2, History, TrendingUp, Search as SearchIcon, 
  BookOpen, Layers, Settings, Activity, Sparkles, ChevronRight
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function LearningPathTab() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const getApiUrl = (path: string) => {
    const hostname = typeof window !== 'undefined' ? window.location.hostname : '127.0.0.1';
    const apiHost = hostname === 'localhost' ? '127.0.0.1' : hostname;
    return `http://${apiHost}:8000${path}`;
  };

  const fetchPath = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(getApiUrl("/admin/modules/learning-path/1"), {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) setData(await res.json());
    } catch (error) {
      console.error("Learning path fetch failed", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPath();
  }, []);

  const displayData = data || {
    goal: "Data Scientist",
    progress: 68,
    steps: ["Foundational Mathematics", "Advanced Data Science", "Neural Infrastructure", "Industrial Capstone"],
    certificates: ["AWS Certified", "TensorFlow Expert", "Python Core", "Data Viz"]
  };

  const steps = displayData.steps || ["Core Foundations", "Specialized Certification", "Project Prototype", "Industry Integration"];

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-start justify-between gap-6 pb-6 border-b border-slate-100 relative group">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-100 text-purple-600 text-[10px] font-bold tracking-widest uppercase">
            <Compass className="h-3 w-3" /> Growth Vector Node
          </div>
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Learning Roadmap</h2>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-tight leading-snug">AI-synthesized personalized roadmaps based on industrial demand.</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg px-4 h-9 text-[10px] font-bold uppercase tracking-widest shadow-sm">
            <Sparkles className="h-3.5 w-3.5 mr-2" /> Generate Roadmap
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Step Timeline */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center gap-3">
             <div className="h-0.5 w-8 bg-purple-600 rounded-full" />
             <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
               Path: {displayData.goal} Node
             </h3>
          </div>
          
          <div className="space-y-4 pl-4 border-l border-slate-100">
            {steps.map((step: string, i: number) => {
              const isCompleted = i < 2;
              const isCurrent = i === 2;
              return (
                <Card key={i} className={cn(
                  "p-4 rounded-xl border transition-all relative",
                  isCompleted ? "bg-white border-emerald-100 opacity-80" : (isCurrent ? "bg-white border-purple-200 shadow-md" : "bg-slate-50 border-slate-100 opacity-60")
                )}>
                  <div className={cn(
                    "absolute top-1/2 -left-3 -translate-y-1/2 h-2.5 w-2.5 rounded-full border-2 border-white shadow-sm transition-all",
                    isCompleted ? "bg-emerald-500" : (isCurrent ? "bg-purple-600 animate-pulse" : "bg-slate-200")
                  )} />
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "h-10 w-10 rounded-lg flex items-center justify-center font-black text-sm shadow-sm",
                        isCompleted ? "bg-emerald-50 text-emerald-600" : (isCurrent ? "bg-purple-50 text-purple-600" : "bg-white text-slate-400")
                      )}>
                        <Layers className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-3">
                          <p className={cn("text-sm font-black uppercase truncate", isCompleted ? "text-emerald-900" : (isCurrent ? "text-purple-900" : "text-slate-400"))}>{step}</p>
                          {isCurrent && <span className="px-2 py-0.5 text-[7px] font-black uppercase text-purple-600 bg-purple-50 border border-purple-100 rounded tracking-widest">Active</span>}
                        </div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Target Mastery: {85 + i * 2}%</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 text-[9px] font-bold uppercase tracking-widest border border-slate-100">Access Hub</Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Side Metrics */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="p-6 rounded-xl bg-slate-900 border border-slate-800 text-white shadow-sm flex flex-col justify-between h-full">
            <div className="space-y-6">
              <h3 className="text-[10px] font-black text-purple-400 uppercase tracking-widest flex items-center gap-2">
                <Activity className="h-3.5 w-3.5" /> Growth Metrics
              </h3>
              
              <div className="space-y-1.5">
                <div className="flex items-end justify-between">
                  <p className="text-[8px] font-bold uppercase text-slate-400 tracking-widest">Global Progression</p>
                  <p className="text-xl font-black text-white leading-none">{displayData.progress}%</p>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: `${displayData.progress}%` }} />
                </div>
              </div>
              
              <div className="pt-4 border-t border-white/5">
                <h4 className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-4">Earned Credentials</h4>
                <div className="grid grid-cols-2 gap-2">
                  {displayData.certificates?.map((cert: string, i: number) => (
                    <div key={i} className="p-3 rounded-lg bg-white/5 border border-white/5 flex items-center gap-2">
                      <Award className="h-3 w-3 text-purple-400 shrink-0" />
                      <p className="text-[9px] font-bold text-white uppercase truncate">{cert}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Button className="w-full mt-6 bg-purple-600 hover:bg-purple-700 text-white font-black uppercase text-[10px] h-10 rounded-lg shadow-md border-none transition-all active:scale-95">
              <Share2 className="h-3.5 w-3.5 mr-2" /> Export Dossier
            </Button>
          </Card>

          <Card className="p-4 rounded-xl bg-white border border-slate-100 shadow-sm relative overflow-hidden group">
            <h4 className="text-[8px] font-black text-indigo-600 uppercase tracking-widest mb-2">Tactical Recommendation</h4>
            <p className="text-[10px] font-bold text-slate-700 uppercase leading-snug">Accelerate Deep Learning clusters to maximize placement ROI targets.</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
