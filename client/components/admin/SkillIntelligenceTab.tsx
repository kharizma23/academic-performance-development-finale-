"use client";

import React, { useState, useEffect } from "react";
import { 
 Zap, Target, TrendingUp, ShieldAlert, 
 Layers, Briefcase, Activity, Globe, RefreshCw, 
 Star, CheckCircle2, AlertTriangle, Fingerprint,
 Download, Search, Users
} from "lucide-react";
import { 
 ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, 
 PolarRadiusAxis, Radar, LineChart, Line, XAxis, YAxis, 
 CartesianGrid, Tooltip, AreaChart, Area, BarChart, Bar,
 Cell, PieChart, Pie
} from "recharts";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const DNA_COLORS = ["#6B8E23", "#4D7C0F", "#808000", "#556B2F"];

export default function SkillIntelligenceTab() {
 const [loading, setLoading] = useState(false);
 const [overview, setOverview] = useState<any>(null);
 const [profile, setProfile] = useState<any>(null);
 const [roadmap, setRoadmap] = useState<any>(null);
 const [matches, setMatches] = useState<any[]>([]);

 const getApiUrl = (path: string) => {
 const hostname = typeof window !== 'undefined' ? window.location.hostname : '127.0.0.1';
 const apiHost = hostname === 'localhost' ? '127.0.0.1' : hostname;
 return `http://${apiHost}:8000${path}`;
 };

 const fetchData = async () => {
 setLoading(true);
 try {
 const [ovRes, profRes, roadRes, matchRes] = await Promise.all([
 fetch(getApiUrl("/api/skills/overview")),
 fetch(getApiUrl("/api/skills/profile/STU492")),
 fetch(getApiUrl("/api/skills/roadmap/STU492")),
 fetch(getApiUrl("/api/skills/match"))
 ]);

 setOverview(await ovRes.json());
 setProfile(await profRes.json());
 setRoadmap(await roadRes.json());
 setMatches(await matchRes.json());
 } catch (err) {
 console.error("AI Skill Node Connection Dropped.", err);
 } finally {
 setLoading(false);
 }
 };

 useEffect(() => { fetchData(); }, []);

 const displayOverview = overview || {
 company_readiness: 78,
 skill_growth: 12.4
 };

 const displayProfile = profile || {
 skill_score: 82,
 confidence_score: 89,
 dna: {
 coding: { score: 88, insight: "Algorithmic optimization." },
 communication: { score: 72, insight: "Technical reasoning." },
 aptitude: { score: 94, insight: "Logical processing." },
 core: { score: 85, insight: "Verified knowledge base." }
 },
 evolution: [
 { month: 'Jan', '2024': 40, '2025': 55, '2026': 72 },
 { month: 'Feb', '2024': 42, '2025': 58, '2026': 75 },
 { month: 'Mar', '2024': 45, '2025': 62, '2026': 82 }
 ],
 badges: ["Alpha Coder", "Logic Elite", "System Architect"]
 };

 const displayRoadmap = roadmap || {
 domain_suggestion: "Neural Architect",
 weeks: [
 { week: 1, duration: "10 Days", topic: "Foundational ML", resource: "MIT OCW" },
 { week: 2, duration: "14 Days", topic: "Deep Learning Hub", resource: "Stanford CS231n" }
 ],
 progress: 64
 };

 const displayMatches = matches.length > 0 ? matches : [
 { company: "Google", match: 84, status: "High probability" },
 { company: "Microsoft", match: 72, status: "Skill gap identified" },
 { company: "Zoho", match: 91, status: "Optimal alignment" }
 ];

 return (
 <div className="space-y-6 pb-10 animate-in fade-in transition-all duration-700">
  {/* Header Section */}
  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
  <div className="space-y-1">
  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-bold tracking-widest uppercase">
  <Fingerprint className="h-3 w-3" /> Cognitive Hub
  </div>
  <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Skill Intelligence</h1>
  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">AI-Powered Skill DNA & Growth Velocity</p>
  </div>
  <div className="flex gap-2">
  <Button size="sm" onClick={fetchData} variant="outline" className="h-9 px-4 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
  <RefreshCw className="h-3.5 w-3.5" /> Re-Scan
  </Button>
  <Button size="sm" className="bg-slate-900 text-white hover:bg-slate-800 h-9 px-6 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 border-none">
  <Download className="h-3.5 w-3.5" /> Export
  </Button>
  </div>
  </div>

  {/* Metrics Grid */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
  {[
  { label: "Skill Score", value: displayProfile.skill_score + "%", icon: Zap, color: "text-blue-600", bg: "bg-blue-50" },
  { label: "Confidence", value: displayProfile.confidence_score + "%", icon: ShieldAlert, color: "text-blue-600", bg: "bg-blue-50" },
  { label: "Readiness Delta", value: displayOverview.company_readiness + "%", icon: Target, color: "text-emerald-600", bg: "bg-emerald-50" },
  { label: "Growth Velocity", value: "+" + displayOverview.skill_growth + "%", icon: TrendingUp, color: "text-rose-600", bg: "bg-rose-50" }
  ].map((stat, i) => (
  <Card key={i} className="p-4 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-3">
      <span className={cn("p-1.5 rounded-lg", stat.bg, stat.color)}>
        <stat.icon className="h-4 w-4" />
      </span>
      <div className="h-1 w-12 bg-slate-100 rounded-full overflow-hidden">
        <div className={cn("h-full", stat.bg.replace('50', '500'))} style={{width: stat.value}} />
      </div>
    </div>
    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{stat.label}</p>
    <h3 className="text-xl font-black text-slate-900 leading-none">{stat.value}</h3>
  </Card>
  ))}
  </div>

  <div className="grid grid-cols-12 gap-6">
  {/* Skill DNA */}
  <Card className="col-span-12 lg:col-span-5 p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
        <Fingerprint className="h-4 w-4 text-blue-600" />
        Skill DNA Profile
        </h2>
        <span className="text-[9px] font-black bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full border border-blue-100 uppercase tracking-widest">
        Active
        </span>
      </div>
      <div className="h-[250px] w-full bg-slate-50/50 rounded-xl p-4 border border-slate-50">
        <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={[
        { subject: 'Coding', A: displayProfile.dna.coding.score },
        { subject: 'Comm', A: displayProfile.dna.communication.score },
        { subject: 'Aptitude', A: displayProfile.dna.aptitude.score },
        { subject: 'Core', A: displayProfile.dna.core.score },
        { subject: 'Design', A: 70 },
        { subject: 'Logic', A: 90 }
        ]}>
        <PolarGrid stroke="#E2E8F0" />
        <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748B', fontSize: 9, fontWeight: 'bold' }} />
        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
        <Radar name="Skill DNA" dataKey="A" stroke="#4D7C0F" fill="#4D7C0F" fillOpacity={0.4} />
        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', fontSize: '10px' }} />
        </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
    <div className="mt-6 space-y-2">
    {Object.entries(displayProfile.dna || {}).map(([key, value]: [string, any]) => (
    <div key={key} className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
      <div className="flex justify-between items-center mb-0.5">
        <span className="text-[10px] font-black text-slate-700 uppercase">{key}</span>
        <span className="text-[10px] font-black text-blue-600">{value.score}%</span>
      </div>
      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tight leading-none">{value.insight}</p>
    </div>
    ))}
    </div>
  </Card>

  {/* Evolution Timeline */}
  <div className="col-span-12 lg:col-span-7 space-y-6">
  <Card className="p-6 border border-slate-200 shadow-sm relative overflow-hidden group">
    <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight flex items-center gap-2 mb-6">
    <TrendingUp className="h-4 w-4 text-blue-600" />
    Skill Evolution
    </h2>
    <div className="h-[220px] w-full relative">
      <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={displayProfile.evolution}>
      <defs>
      <linearGradient id="color2026" x1="0" y1="0" x2="0" y2="1">
      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.1}/>
      <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
      </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
      <XAxis dataKey="month" tick={{ fontSize: 9, fontWeight: 700, fill: '#64748B' }} axisLine={false} tickLine={false} />
      <YAxis domain={[0, 100]} tick={{ fontSize: 9, fontWeight: 700, fill: '#64748B' }} axisLine={false} tickLine={false} />
      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', fontSize: '10px' }} />
      <Area type="monotone" dataKey="2026" stroke="#2563EB" strokeWidth={3} fillOpacity={1} fill="url(#color2026)" dot={{ r: 3 }} />
      </AreaChart>
      </ResponsiveContainer>
    </div>
    <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Activity className="h-4 w-4 text-blue-600" />
        <div>
          <p className="text-xs font-black text-slate-900 uppercase leading-none">Velocity Locked</p>
          <p className="text-[8px] font-bold text-slate-400 uppercase mt-1 tracking-widest">Predicted Dec 2026</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-black text-blue-600 leading-none underline">+28.4% DNA Growth</p>
      </div>
    </div>
  </Card>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <Card className="p-5 border border-slate-200 bg-slate-900 text-white relative overflow-hidden">
    <h3 className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-3 flex items-center gap-2">
    <AlertTriangle className="h-3.5 w-3.5" /> Matrix Gap
    </h3>
    <p className="text-[10px] font-black text-slate-300 leading-relaxed uppercase mb-4">
    Shortfall detected in <span className="text-white">System Design (Distributed)</span>. Match risk for FAANG.
    </p>
    <div className="flex flex-wrap gap-1.5">
    {["Systems", "GCP", "Kafka"].map(s => (
    <span key={s} className="px-2 py-0.5 bg-rose-500/10 border border-white/10 rounded text-[8px] font-bold uppercase text-rose-300">
    {s}
    </span>
    ))}
    </div>
  </Card>
  <Card className="p-5 border border-blue-100 bg-blue-600 text-white relative overflow-hidden">
    <h3 className="text-[10px] font-black text-blue-200 uppercase tracking-widest mb-3 flex items-center gap-2">
    <Globe className="h-3.5 w-3.5" /> Domain Suggestion
    </h3>
    <p className="text-lg font-black text-white leading-none mt-1 mb-1 uppercase truncate">"{displayRoadmap.domain_suggestion}"</p>
    <p className="text-[8px] font-bold text-blue-200 uppercase tracking-widest">Node Recognition Pattern</p>
  </Card>
  </div>
  </div>
  </div>

  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  <Card className="p-6 border border-slate-100 shadow-sm">
  <h2 className="text-xs font-black text-slate-900 uppercase tracking-tight flex items-center gap-2 mb-6">
  <Layers className="h-4 w-4 text-emerald-600" />
  AI Learning Roadmap
  </h2>
  <div className="space-y-4 relative">
  {displayRoadmap.weeks.map((w: any) => (
  <div key={w.week} className="relative pl-6 border-l-2 border-slate-50 group">
  <div className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-white border-2 border-slate-200 group-hover:border-blue-600 transition-colors z-10" />
  <div className="p-3 bg-slate-50 hover:bg-white border border-slate-100 rounded-lg transition-all cursor-default">
  <span className="text-[8px] font-bold text-blue-600 uppercase">Phase {w.week} ({w.duration})</span>
  <h4 className="text-xs font-black text-slate-900 mt-1 uppercase truncate">{w.topic}</h4>
  </div>
  </div>
  ))}
  </div>
  </Card>

  <Card className="p-6 border border-slate-100 shadow-sm">
  <h2 className="text-xs font-black text-slate-900 uppercase tracking-tight flex items-center gap-2 mb-6">
  <Briefcase className="h-4 w-4 text-blue-600" />
  Company Match Matrix
  </h2>
  <div className="space-y-4">
  {displayMatches.map((m: any) => (
  <div key={m.company} className="space-y-1.5">
  <div className="flex justify-between items-baseline">
  <span className="text-[10px] font-black text-slate-900 uppercase">{m.company}</span>
  <span className="text-[10px] font-black text-blue-600">{m.match}% Match</span>
  </div>
  <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
  <div className={cn("h-full", m.match > 80 ? 'bg-blue-600' : 'bg-slate-400')} style={{width: `${m.match}%`}} />
  </div>
  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{m.status}</p>
  </div>
  ))}
  </div>
  </Card>

  <Card className="p-6 border border-slate-100 shadow-sm text-center flex flex-col items-center justify-center">
  <h2 className="text-xs font-black text-slate-900 uppercase tracking-tight flex items-center gap-2 mb-6 w-full text-left">
  <Activity className="h-4 w-4 text-rose-600" />
  AI Index Hub
  </h2>
  <div className="relative h-24 w-24 mb-6">
  <ResponsiveContainer width="100%" height="100%">
  <PieChart>
  <Pie data={[{ value: displayProfile.skill_score }, { value: 100 - displayProfile.skill_score }]} innerRadius="70%" outerRadius="100%" stroke="none" dataKey="value">
  <Cell fill="#4D7C0F" /><Cell fill="#F1F5F9" />
  </Pie>
  </PieChart>
  </ResponsiveContainer>
  <div className="absolute inset-0 flex flex-col items-center justify-center">
  <span className="text-xl font-black text-slate-900 leading-none">{displayProfile.skill_score}</span>
  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">IQ Units</span>
  </div>
  </div>
  <div className="bg-slate-50 px-4 py-2 rounded-lg border border-slate-100">
  <p className="text-[10px] font-black text-slate-900 leading-none mb-1 uppercase underline decoration-emerald-500">94th Percentile</p>
  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none">Global Ranking</p>
  </div>
  </Card>
  </div>
 </div>
 );
}
