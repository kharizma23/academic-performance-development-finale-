"use client";

import React, { useEffect, useState } from "react";
import { 
  ClipboardList, Zap, Plus, Loader2, CheckCircle2, 
  Play, Calendar, Edit2, Target, BarChart3
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function TestAssessmentTab() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const getApiUrl = (path: string) => {
    const hostname = typeof window !== 'undefined' ? window.location.hostname : '127.0.0.1';
    const apiHost = hostname === 'localhost' ? '127.0.0.1' : hostname;
    return `http://${apiHost}:8001${path}`;
  };

  const fetchTests = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(getApiUrl("/admin/modules/tests"), {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) setData(await res.json());
    } catch (error) {
      console.error("Tests fetch failed", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  const displayData = data.length > 0 ? data : [
    { title: "Advanced Neural Systems Mid-Term", submissions_count: 85, total_students: 120, avg_score: 72 },
    { title: "Cloud Infrastructure Practical", submissions_count: 110, total_students: 120, avg_score: 84 },
    { title: "Quantum Computing Logic Audit", submissions_count: 45, total_students: 120, avg_score: 68 }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-10">
      {/* Header with Stats */}
      <div className="flex flex-col md:flex-row items-start justify-between gap-6 pb-6 border-b border-slate-100">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-bold tracking-widest uppercase">
            <Target className="h-3 w-3" /> Assessment Matrix Control
          </div>
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Test & Evaluation Engine</h2>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-tight leading-snug">Autonomous test generation and automated evaluation vectors.</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" className="bg-indigo-600 text-white rounded-lg h-9 font-bold uppercase text-[10px] tracking-widest hover:bg-indigo-700 shadow-sm transition-all border-none">
            <Zap className="h-3.5 w-3.5 mr-2" /> AI Generation
          </Button>
        </div>
      </div>

      {/* Test Cards Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayData.map((test, i) => (
          <Card key={i} className="group p-5 rounded-xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  <ClipboardList className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-black text-slate-900 uppercase truncate">{test.title}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Calendar className="h-2.5 w-2.5" /> Apr 12
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <p className="text-[8px] font-bold uppercase text-slate-400 tracking-widest mb-0.5">Submissions</p>
                  <p className="text-md font-black text-slate-900 ">{test.submissions_count}/{test.total_students}</p>
                </div>
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-100">
                  <p className="text-[8px] font-bold uppercase text-emerald-600 tracking-widest mb-0.5">Mean Score</p>
                  <p className="text-md font-black text-emerald-900 ">{test.avg_score}%</p>
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-[8px] font-bold uppercase text-slate-400 tracking-widest">Completion</p>
                  <p className="text-[10px] font-black text-indigo-600 ">31.25%</p>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-50">
                  <div className="h-full bg-indigo-600 rounded-full transition-all" style={{ width: '31.25%' }} />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-50">
              <Button size="sm" variant="outline" className="flex-1 h-8 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                <Play className="h-3 w-3 mr-2" /> Audit
              </Button>
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-lg text-slate-400 hover:text-indigo-600">
                <Edit2 className="h-3 w-3" />
              </Button>
            </div>
          </Card>
        ))}
        
        {/* Create Test Card */}
        <Card className="p-5 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center gap-3 hover:bg-white transition-all cursor-pointer">
          <div className="h-10 w-10 rounded-lg bg-indigo-50 border border-white flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
            <Plus className="h-5 w-5" />
          </div>
          <div className="text-center">
            <p className="text-xs font-black text-slate-900 uppercase">Create Module</p>
            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Generate with AI Node</p>
          </div>
        </Card>
      </div>

      {/* Strategic Intervention */}
      <Card className="p-6 rounded-xl border border-indigo-100 bg-indigo-50/50 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden group">
        <div className="space-y-3 max-w-4xl relative z-10 text-center md:text-left">
          <h4 className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest flex items-center justify-center md:justify-start gap-2">
            <Zap className="h-3 w-3" /> Institutional Evaluation Logic
          </h4>
          <h3 className="text-lg font-black text-indigo-950 uppercase leading-none truncate">Cross-Subject Evaluator Core</h3>
          <p className="text-indigo-500 font-semibold text-xs leading-relaxed uppercase">AI identifies subject clusters with high failure density and suggests re-assessment strategies.</p>
        </div>
        <Button size="sm" className="bg-white text-indigo-600 border border-indigo-100 rounded-lg h-9 px-6 font-bold uppercase text-[10px] tracking-widest hover:bg-indigo-600 hover:text-white transition-all shrink-0 shadow-sm">
          Institutional Performance Audit
        </Button>
      </Card>
    </div>
  );
}
