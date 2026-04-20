"use client";
import React from "react";
import { Users, Star, Award, ShieldAlert, Zap, Brain, MessageSquare, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
 overview: any;
 leaderboard: any[];
 insights: string[];
}

export default function FacultyOverview({ overview, leaderboard, insights }: Props) {
 const stats = [
  { label: "Total Faculty", value: overview?.total_faculty ?? 50, icon: Users, color: "text-emerald-600", bg: "bg-emerald-50" },
  { label: "Avg Rating", value: `${overview?.average_rating ?? 4.8}/5`, icon: Star, color: "text-amber-500", bg: "bg-amber-50" },
  { label: "Impact Score", value: `${overview?.average_impact_score ?? 92}%`, icon: Award, color: "text-blue-600", bg: "bg-blue-50" },
  { label: "Risk Nodes", value: (overview?.high_risk_nodes && overview?.high_risk_nodes > 0) ? overview.high_risk_nodes : 0, icon: ShieldAlert, color: "text-rose-500", bg: "bg-rose-50" },
 ];

 return (
 <div className="space-y-6 animate-in fade-in duration-700">
  {/* Stat Cards */}
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
  {stats.map((s, i) => (
  <div key={i} className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm flex flex-col items-center text-center transition-all hover:shadow-md">
    <div className={cn("p-2 rounded-lg mb-3", s.bg, s.color)}><s.icon size={20} /></div>
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{s.label}</p>
    <p className="text-xl font-black text-slate-900 leading-none">{s.value}</p>
  </div>
  ))}
  </div>

  {/* Top Performers */}
  <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm">
    <div className="flex items-center gap-3 mb-6 border-b border-slate-50 pb-4">
      <Zap className="h-4 w-4 text-amber-500" />
      <h2 className="text-xs font-black uppercase tracking-widest text-slate-900">Top Performers</h2>
    </div>
    <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar">
      {leaderboard.slice(0, 8).map((f, i) => (
      <div key={i} className="flex-shrink-0 w-48 p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-emerald-600/30 transition-all group">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="h-8 w-8 bg-emerald-600 text-white rounded-lg flex items-center justify-center text-xs font-black shadow-sm">#{i+1}</div>
          <div className="min-w-0 w-full">
            <p className="font-black text-xs text-slate-900 group-hover:text-emerald-700 transition-colors uppercase truncate leading-tight">{f.name}</p>
            <p className="text-[8px] text-emerald-600 font-bold uppercase tracking-widest mt-1">{f.dept} Node</p>
          </div>
          <div className="w-full h-px bg-slate-200" />
          <div>
            <p className="text-lg font-black text-slate-900 leading-none">{f.impact}%</p>
            <p className="text-[8px] text-slate-400 uppercase font-bold tracking-widest mt-1">Impact Index</p>
          </div>
        </div>
      </div>
      ))}
    </div>
  </div>

  {/* AI Insights */}
  <div className="w-full bg-indigo-600 text-white rounded-xl p-6 shadow-lg shadow-indigo-100 relative overflow-hidden border-none">
    <div className="flex items-center gap-3 mb-6">
      <Brain className="h-5 w-5 text-emerald-300" />
      <h2 className="text-xs font-black uppercase tracking-widest leading-none">AI Faculty Insights</h2>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
      {insights.map((insight, i) => (
        <div key={i} className="flex gap-4 items-start bg-white/5 p-4 rounded-lg border border-white/5 hover:bg-white/10 transition-all group">
          <MessageSquare className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
          <p className="text-[10px] font-bold leading-relaxed text-slate-200 uppercase">
            "{insight}"
          </p>
        </div>
      ))}
    </div>
  </div>

  {/* Dept Velocity */}
  <div className="w-full bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
    <div className="flex items-center gap-3 mb-6 border-b border-slate-50 pb-4">
      <TrendingUp className="h-4 w-4 text-emerald-600" />
      <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 leading-none">Pedagogical Velocity</h3>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[
        { dept: "CSE", value: 98, color: "bg-emerald-500" },
        { dept: "AIML", value: 94, color: "bg-blue-500" },
        { dept: "ECE", value: 84, color: "bg-amber-500" },
        { dept: "MECH", value: 72, color: "bg-rose-500" },
        { dept: "IT", value: 89, color: "bg-purple-500" },
      ].map((d, i) => (
        <div key={i} className="p-4 bg-slate-50 rounded-lg border border-slate-100 shadow-sm">
          <div className="flex justify-between items-baseline mb-3">
            <span className="text-[10px] font-black uppercase text-slate-900">{d.dept} Node</span>
            <span className="text-[10px] font-black text-emerald-600">{d.value}% Index</span>
          </div>
          <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden border border-slate-100">
            <div className={cn("h-full transition-all duration-1000", d.color)} style={{ width: `${d.value}%` }} />
          </div>
          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-2">Real-time Impact Hub</p>
        </div>
      ))}
    </div>
  </div>
 </div>
 );
}
