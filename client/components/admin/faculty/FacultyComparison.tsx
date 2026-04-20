"use client";
import React, { useState } from "react";
import { GitCompare, RefreshCw, Star, TrendingUp, Activity, Users, BookOpen, Award } from "lucide-react";
import { fetchFacultyComparison } from "@/lib/api-faculty";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Props {
 facultyList: any[];
}

const metrics = [
 { key: "rating", label: "Rating /5", icon: Star, format: (v: number) => `${v}/5` },
 { key: "impact", label: "Impact %", icon: TrendingUp, format: (v: number) => `${v}%` },
 { key: "pass_rate", label: "Pass Rate", icon: Activity, format: (v: number) => `${v}%` },
 { key: "consistency", label: "Consistency", icon: Award, format: (v: number) => `${v}%` },
 { key: "total_reviews", label: "Reviews", icon: Users, format: (v: number) => v },
 { key: "positive_reviews", label: "Pos Reviews", icon: Star, format: (v: number) => v },
 { key: "projects_completed", label: "Projects", icon: BookOpen, format: (v: number) => v },
 { key: "attendance_correlation", label: "Attendance Corr", icon: Activity, format: (v: number) => v },
];

export default function FacultyComparison({ facultyList }: Props) {
 const [id1, setId1] = useState("");
 const [id2, setId2] = useState("");
 const [result, setResult] = useState<any>(null);
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState("");

 const handleCompare = async () => {
 if (!id1 || !id2 || id1 === id2) {
 setError("Select two different nodes.");
 return;
 }
 setError("");
 setLoading(true);
 try {
 const data = await fetchFacultyComparison(id1, id2);
 setResult(data);
 } catch {
 setError("Handshake failure.");
 } finally {
 setLoading(false);
 }
 };

 const getWinner = (key: string) => {
 if (!result) return null;
 const v1 = result.faculty1[key] ?? 0;
 const v2 = result.faculty2[key] ?? 0;
 if (v1 > v2) return 1;
 if (v2 > v1) return 2;
 return 0;
 };

 return (
 <div className="space-y-4 animate-in fade-in duration-700">
  {/* Controls */}
  <Card className="p-5 rounded-xl border border-slate-100 bg-white shadow-sm">
    <div className="flex items-center gap-2 mb-4">
      <GitCompare className="h-4 w-4 text-emerald-600" />
      <h2 className="text-sm font-black uppercase tracking-tight">Head-to-Head Analysis</h2>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
      <div className="md:col-span-12 lg:col-span-5">
        <label className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-1.5 block">Faculty Node A</label>
        <select
          className="w-full h-9 bg-slate-50 border border-slate-200 rounded-lg px-3 text-[10px] font-bold text-slate-900 outline-none uppercase"
          value={id1} onChange={e => setId1(e.target.value)}
        >
          <option value="">-- NODE A --</option>
          {facultyList.map(f => <option key={f.id} value={f.id}>{f.name} ({f.department})</option>)}
        </select>
      </div>
      <div className="md:hidden lg:flex lg:col-span-2 text-center pb-2.5">
        <span className="text-[10px] font-black text-slate-300">VS</span>
      </div>
      <div className="md:col-span-12 lg:col-span-5">
        <label className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-1.5 block">Faculty Node B</label>
        <select
          className="w-full h-9 bg-slate-50 border border-slate-200 rounded-lg px-3 text-[10px] font-bold text-slate-900 outline-none uppercase"
          value={id2} onChange={e => setId2(e.target.value)}
        >
          <option value="">-- NODE B --</option>
          {facultyList.filter(f => f.id !== id1).map(f => <option key={f.id} value={f.id}>{f.name} ({f.department})</option>)}
        </select>
      </div>
    </div>
    {error && <p className="text-rose-500 font-bold text-[9px] uppercase mt-2">{error}</p>}
    <Button
      onClick={handleCompare}
      disabled={loading}
      className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white h-9 rounded-lg font-black uppercase tracking-widest text-[9px] transition-all flex items-center justify-center gap-2 disabled:opacity-50 border-none shadow-sm"
    >
      {loading ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <GitCompare className="h-3.5 w-3.5" />}
      {loading ? "Analyzing..." : "Run Analysis"}
    </Button>
  </Card>

  {/* Comparison Results */}
  {result && (
  <Card className="rounded-xl border border-slate-100 bg-white shadow-sm overflow-hidden">
    <div className="grid grid-cols-3 bg-slate-50/50 border-b border-slate-100">
      <div className="p-4 text-center">
        <div className="h-9 w-9 bg-blue-600 text-white rounded-lg flex items-center justify-center text-xs font-black mx-auto mb-2 shadow-sm">
          {result.faculty1.name?.[0]}
        </div>
        <p className="text-[10px] font-black text-slate-900 uppercase truncate leading-none">{result.faculty1.name}</p>
        <p className="text-[8px] font-bold text-blue-600 uppercase mt-1">{result.faculty1.department}</p>
      </div>
      <div className="p-4 text-center flex items-center justify-center">
        <span className="text-[10px] font-black text-slate-200">VS</span>
      </div>
      <div className="p-4 text-center">
        <div className="h-9 w-9 bg-emerald-600 text-white rounded-lg flex items-center justify-center text-xs font-black mx-auto mb-2 shadow-sm">
          {result.faculty2.name?.[0]}
        </div>
        <p className="text-[10px] font-black text-slate-900 uppercase truncate leading-none">{result.faculty2.name}</p>
        <p className="text-[8px] font-bold text-emerald-600 uppercase mt-1">{result.faculty2.department}</p>
      </div>
    </div>

    <div className="divide-y divide-slate-50">
      {metrics.map(m => {
        const v1 = result.faculty1[m.key] ?? 0;
        const v2 = result.faculty2[m.key] ?? 0;
        const winner = getWinner(m.key);
        const max = Math.max(Number(v1), Number(v2), 1);
        return (
          <div key={m.key} className="grid grid-cols-3 items-center py-2.5 px-3 group hover:bg-slate-50">
            <div className={cn("flex items-center justify-end gap-2", winner === 1 && "font-black")}>
              {winner === 1 && <span className="text-[7px] bg-blue-50 text-blue-600 px-1 py-0.5 rounded font-black border border-blue-100">WIN</span>}
              <div className="w-16 h-1 bg-slate-100 rounded-full overflow-hidden shrink-0">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(Number(v1) / max) * 100}%` }} />
              </div>
              <span className={cn("text-[10px] w-8 text-right", winner === 1 ? "text-blue-600 font-black" : "text-slate-500")}>{m.format(v1)}</span>
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <m.icon size={10} className="text-slate-300" />
              <span className="text-[8px] font-black uppercase text-slate-400 truncate">{m.label}</span>
            </div>
            <div className={cn("flex items-center gap-2", winner === 2 && "font-black")}>
              <span className={cn("text-[10px] w-8", winner === 2 ? "text-emerald-600 font-black" : "text-slate-500")}>{m.format(v2)}</span>
              <div className="w-16 h-1 bg-slate-100 rounded-full overflow-hidden shrink-0">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(Number(v2) / max) * 100}%` }} />
              </div>
              {winner === 2 && <span className="text-[7px] bg-emerald-50 text-emerald-600 px-1 py-0.5 rounded font-black border border-emerald-100">WIN</span>}
            </div>
          </div>
        );
      })}
    </div>

    {(() => {
      let w1 = 0, w2 = 0;
      metrics.forEach(m => { const w = getWinner(m.key); if (w === 1) w1++; else if (w === 2) w2++; });
      const overallWinner = w1 > w2 ? result.faculty1 : w2 > w1 ? result.faculty2 : null;
      return (
        <div className={cn("p-3 flex items-center justify-center gap-2 text-white", overallWinner ? "bg-emerald-600" : "bg-slate-800")}>
          {overallWinner ? (
            <>
              <Award className="h-3 w-3" />
              <p className="text-[9px] font-black uppercase tracking-widest">
                Overall Consensus: {overallWinner.name} ({w1 > w2 ? w1 : w2}/{metrics.length} metrics)
              </p>
            </>
          ) : (
            <p className="text-[9px] font-black uppercase tracking-widest">Statistical Equilibrium (Tie)</p>
          )}
        </div>
      );
    })()}
  </Card>
  )}
 </div>
 );
}
