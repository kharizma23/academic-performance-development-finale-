"use client";

import React, { useState, useEffect } from "react";
import { 
 Zap, Target, TrendingUp, Award, ShieldAlert, 
 Layers, Briefcase, Activity, Globe, MessageSquare, 
 FileText, UserPlus, Search, RefreshCw, Star, 
 CheckCircle2, AlertTriangle, BookOpen, Fingerprint,
 LineChart as LineIcon, PieChart as PieIcon,
 Download, LayoutGrid, Users, ArrowUpRight,
 TrendingDown, BarChart3, Binary, Rocket, ShieldCheck,
 Coins, HelpCircle
} from "lucide-react";
import { 
 ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, 
 PolarRadiusAxis, Radar, LineChart, Line, XAxis, YAxis, 
 CartesianGrid, Tooltip, AreaChart, Area, BarChart, Bar,
 Cell, PieChart, Pie
} from "recharts";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function CareerPredictionTab() {
 const router = useRouter();
 const [loading, setLoading] = useState(true);
 const [prediction, setPrediction] = useState<any>(null);
 const [matches, setMatches] = useState<any[]>([]);
 const [roadmap, setRoadmap] = useState<any>(null);
 const [companies, setCompanies] = useState<any[]>([]);
 const [alignment, setAlignment] = useState<any>(null);
 const [selectedDomain, setSelectedDomain] = useState<any>(null);
 const [domainDetails, setDomainDetails] = useState<any>(null);
 const [isRedirecting, setIsRedirecting] = useState(false);

 const getApiUrl = (path: string) => {
 const hostname = typeof window !== 'undefined' ? window.location.hostname : '127.0.0.1';
 return `http://${hostname}:8000${path}`;
 };

 const fetchDetails = async (domain: string) => {
 try {
 const res = await fetch(getApiUrl(`/api/career/details/${domain}`));
 if (!res.ok) throw new Error("Neural Link Failure");
 setDomainDetails(await res.json());
 setSelectedDomain(domain);
 } catch (err) {
 console.error("Neural Detail Link Offline.", err);
 }
 };

 const fetchData = async () => {
 setLoading(true);
 try {
 const studentId = "STU492";
 const [predRes, matchRes, roadRes, compRes, alignRes] = await Promise.all([
 fetch(getApiUrl(`/api/career/predict/${studentId}`)),
 fetch(getApiUrl(`/api/career/match/${studentId}`)),
 fetch(getApiUrl(`/api/career/roadmap/${studentId}`)),
 fetch(getApiUrl(`/api/career/companies/${studentId}`)),
 fetch(getApiUrl(`/api/career/alignment/${studentId}`))
 ]);

 setPrediction(await predRes.json());
 setMatches(await matchRes.json());
 setRoadmap(await roadRes.json());
 setCompanies(await compRes.json());
 setAlignment(await alignRes.json());
 } catch (err) {
 console.error("AI Career Node Offline.", err);
 } finally {
 setLoading(false);
 }
 };

 useEffect(() => { fetchData(); }, []);

 const displayPrediction = prediction || {
 readiness_score: 84,
 confidence_score: 92,
 primary: { role: "Neural Architect", domain: "AIML", score: 88, lpa: "18.5" },
 secondary: { role: "Cloud Security Specialist", domain: "Cyber", score: 76, lpa: "14.2" },
 backup: { role: "Full Stack Engineer", domain: "Web", score: 94, lpa: "12.8" }
 };

 const displayMatches = matches.length > 0 ? matches : [
 { domain: "Artificial Intelligence", status: "Optimal", match: 88 },
 { domain: "Cloud Architecture", status: "High Performance", match: 74 },
 { domain: "Data Science", status: "Secure", match: 91 }
 ];

 const displayRoadmap = roadmap || {
 steps: [
 { id: 1, label: "Neural Foundations", status: "Completed" },
 { id: 2, label: "Core Optimization", status: "Active" },
 { id: 3, label: "Institutional Capstone", status: "Pending" }
 ],
 learning_path: ["Deep Learning Hub", "PyTorch Specialist", "System Design"]
 };

 const displayCompanies = companies.length > 0 ? companies : [
 { name: "Google", match: 84, reason: "Elite algorithmic proficiency detected." },
 { name: "Microsoft", match: 72, reason: "Cloud infrastructure alignment verified." }
 ];

 const displayAlignment = alignment || {
 alignment_score: 89,
 analysis: "High synergy detected between vocational interest and institutional skill DNA.",
 switch_simulation: { action: "Quant Research", result: "Neural drift detected. 15% efficiency loss projected." }
 };

 return (
    <div className="space-y-4 pb-12 animate-in slide-in-from-bottom-4 duration-700">
      {/* 1. Header & AI Summary */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
          <Rocket className="h-24 w-24 text-blue-900" />
        </div>
        <div className="relative z-10 flex-1">
          <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-bold tracking-widest uppercase mb-2">
            <Binary className="h-3 w-3" /> Neural Career Engine
          </div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tight">AI Career Prediction</h1>
          <p className="text-slate-500 font-medium text-xs mt-1 max-w-xl">
            Synthesizing student DNA into predictive career vectors based on market readiness and institutional performance.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 relative z-10">
          <div className="px-4 py-2 bg-slate-50 rounded-xl text-slate-900 flex items-center gap-3 border border-slate-200">
            <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Activity className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider leading-none mb-1">Readiness</p>
              <p className="text-lg font-black text-slate-900">{displayPrediction.readiness_score}%</p>
            </div>
          </div>
          <Button className="h-10 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg uppercase tracking-wider text-[10px] border-none shadow-sm transition-all">
            <Download className="h-3.5 w-3.5 mr-2" /> Career Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* 1. AI Recommendation Engine */}
        <div className="col-span-12 lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { type: 'Primary Path', data: displayPrediction.primary, color: 'blue', icon: Rocket, label: 'High Match' },
            { type: 'Secondary Option', data: displayPrediction.secondary, color: 'slate', icon: TrendingUp, label: 'Optimized' },
            { type: 'Strategic Backup', data: displayPrediction.backup, color: 'slate', icon: ShieldCheck, label: 'Stable' }
          ].map((path, i) => (
            <Card 
              key={i} 
              onClick={() => fetchDetails(path.data?.domain)}
              className={`p-4 border border-slate-200 hover:shadow-md transition-all relative overflow-hidden group cursor-pointer ${i === 0 ? 'bg-blue-50/20 border-blue-200' : 'bg-white'}`}
            >
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-start mb-3">
                  <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${i === 0 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                    {path.type}
                  </span>
                  <path.icon className={`h-3.5 w-3.5 ${i === 0 ? 'text-blue-600' : 'text-slate-400'}`} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-0.5 tracking-tight">{path.data?.role}</h3>
                <div className="flex items-center gap-1.5 mb-3">
                  <span className={`h-1.5 w-1.5 rounded-full ${i === 0 ? 'bg-blue-600' : 'bg-slate-300'}`} />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{path.label} ({path.data?.score?.toFixed(0)} Neural Units)</span>
                </div>
                <div className="mt-auto border-t border-slate-100 pt-3 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Coins className="h-3 w-3 text-slate-400" />
                    <span className="text-sm font-bold text-slate-800">{path.data?.lpa} LPA</span>
                  </div>
                  <ArrowUpRight className="h-3 w-3 text-slate-300 group-hover:text-blue-600 transition-colors" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* 2. AI Confidence Index */}
        <Card className="col-span-12 lg:col-span-4 p-4 border border-slate-200 flex flex-col bg-slate-900 border-slate-800 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-3xl -mr-12 -mt-12" />
          <h2 className="text-xs font-bold uppercase tracking-widest flex items-center gap-2 mb-4">
            <Activity className="h-3 w-3 text-blue-400" />
            Career Confidence Index
          </h2>
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="relative h-32 w-32 mb-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={[
                      { value: displayPrediction.confidence_score }, 
                      { value: 100 - displayPrediction.confidence_score }
                    ]} 
                    innerRadius="80%" outerRadius="100%" startAngle={180} endAngle={0} 
                    stroke="none" dataKey="value"
                  >
                    <Cell fill="#3B82F6" />
                    <Cell fill="#1E293B" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pt-6">
                <span className="text-3xl font-black text-white leading-none">{displayPrediction.confidence_score}%</span>
                <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1">Neural Sync</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* 3. Domain Match Score */}
        <Card className="col-span-12 lg:col-span-4 p-5 border border-slate-200 shadow-sm bg-white">
          <h2 className="text-xs font-bold uppercase tracking-widest flex items-center gap-2 mb-6 text-slate-900">
            <BarChart3 className="h-3.5 w-3.5 text-blue-600" />
            Domain Match Score
          </h2>
          <div className="space-y-4">
            {displayMatches.map((m: any) => (
              <div key={m.domain} className="space-y-1.5">
                <div className="flex justify-between items-end">
                  <span className="text-sm font-bold text-slate-800">{m.domain}</span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{m.match}% Sync</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${m.match > 80 ? 'bg-blue-600' : 'bg-slate-400'}`} 
                    style={{width: `${m.match}%`}} 
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* 4. Career Path Visualizer */}
        <Card className="col-span-12 lg:col-span-8 p-5 border border-slate-200 shadow-sm flex flex-col bg-slate-950 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none" />
          <h2 className="text-xs font-bold uppercase tracking-widest flex items-center gap-2 mb-8 relative z-10">
            <Globe className="h-3.5 w-3.5 text-blue-400" />
            Career Roadmap Visualizer
          </h2>
          <div className="flex-1 flex items-center justify-between px-8 relative py-8 z-10">
            <div className="absolute left-10 right-10 top-1/2 h-0.5 bg-slate-800 -translate-y-1/2 rounded-full" />
            {displayRoadmap.steps.map((step: any, i: number) => (
              <div key={step.id} className="relative z-10 flex flex-col items-center group">
                <div className={`h-8 w-8 rounded-lg flex items-center justify-center transition-all duration-500 border ${
                  step.status === 'Completed' ? 'bg-blue-600 text-white border-blue-500 shadow-lg' : 
                  step.status === 'Active' ? 'bg-blue-400 text-white border-blue-300 animate-pulse' : 
                  'bg-slate-900 text-slate-600 border-slate-800'
                }`}>
                  <span className="text-[10px] font-bold">{step.id}</span>
                </div>
                <div className="absolute top-10 w-24 text-center">
                  <p className="text-[10px] font-bold text-white uppercase tracking-tighter leading-tight">{step.label}</p>
                  <p className="text-[8px] font-medium text-slate-500 uppercase tracking-widest mt-0.5">{step.status}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 p-3 bg-slate-900/50 border border-slate-800 rounded-lg flex items-center gap-3 z-10">
            <div className="text-[10px] font-bold text-blue-400 uppercase tracking-widest border-r border-slate-800 pr-3">Learning Path</div>
            <div className="flex flex-wrap gap-2">
              {displayRoadmap.learning_path.map((p: string) => (
                <span key={p} className="px-2 py-0.5 bg-slate-800 text-[9px] font-medium text-slate-300 rounded border border-slate-700">
                  {p}
                </span>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* 10. Interest VS Skill Alignment */}
        <Card className="col-span-12 lg:col-span-5 p-6 border border-slate-200 bg-white shadow-sm flex flex-col">
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2 mb-6">
            <Fingerprint className="h-4 w-4 text-blue-600" />
            Domain Match Insights
          </h2>
          <div className="flex-1 flex flex-col space-y-4">
             <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
               <div className="flex items-center justify-between mb-2">
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Alignment Synergy</span>
                 <span className="text-sm font-black text-blue-600">{displayAlignment.alignment_score}%</span>
               </div>
               <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                 <div className="h-full bg-blue-600" style={{width: `${displayAlignment.alignment_score}%`}} />
               </div>
             </div>
             <div className="space-y-3">
               <div className="flex items-start gap-3 p-3 hover:bg-slate-50 rounded-lg transition-colors group">
                 <div className="p-2 bg-blue-50 rounded-lg text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                   <Target className="h-4 w-4" />
                 </div>
                 <div>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Core Delta</p>
                   <p className="text-sm font-medium text-slate-900 leading-snug">{displayAlignment.analysis}</p>
                 </div>
               </div>
               <div className="flex items-start gap-3 p-3 hover:bg-slate-50 rounded-lg transition-colors group">
                 <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                   <RefreshCw className="h-4 w-4" />
                 </div>
                 <div>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Switch Simulation</p>
                   <p className="text-sm font-medium text-slate-900 leading-snug">{displayAlignment.switch_simulation.result}</p>
                 </div>
               </div>
             </div>
          </div>
        </Card>

        {/* 8. Target Institution Matrix & Risk */}
        <div className="col-span-12 lg:col-span-7 flex flex-col gap-4">
          <Card className="p-5 border border-slate-200 shadow-sm h-full">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2 mb-6">
              <Users className="h-3.5 w-3.5 text-blue-600" />
              Target Institution Matrix
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {displayCompanies.map((c: any) => (
                <div key={c.name} className="p-3 bg-slate-50 border border-slate-200 rounded-xl hover:border-blue-300 transition-all">
                  <div className="flex justify-between items-center mb-1.5">
                    <h4 className="text-sm font-bold text-slate-900">{c.name}</h4>
                    <span className="text-[9px] font-bold text-blue-600 uppercase bg-blue-50 px-1.5 rounded-full">
                      {c.match}%
                    </span>
                  </div>
                  <p className="text-[10px] font-medium text-slate-500 leading-relaxed">{c.reason}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-4 border border-rose-100 bg-rose-50/30 flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-rose-500 text-white flex items-center justify-center shrink-0">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-[10px] font-bold text-rose-600 uppercase tracking-widest mb-0.5">Career Risk Analysis</h2>
              <p className="text-xs font-semibold text-slate-900">Neural engine detects <span className="text-emerald-600">Optimal Stability</span> for current path.</p>
            </div>
          </Card>
        </div>
      </div>

  {/* Detailed Domain Overlay */}
  {selectedDomain && (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
      <Card className="w-full max-w-3xl bg-white rounded-xl overflow-hidden shadow-2xl relative">
        <Button 
          variant="ghost" 
          onClick={() => setSelectedDomain(null)}
          className="absolute top-4 right-4 h-8 w-8 p-0 rounded-lg hover:bg-slate-100 text-slate-400"
        >
          <UserPlus className="h-4 w-4 rotate-45" />
        </Button>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 bg-blue-600 text-white rounded-lg flex items-center justify-center shadow-lg">
              <Target className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-950 uppercase tracking-tight">{domainDetails?.title}</h2>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">DIFFICULTY: {domainDetails?.difficulty}</span>
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">DEMAND: {domainDetails?.market_demand}</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="space-y-4">
              <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                <BookOpen className="h-3.5 w-3.5 text-blue-600" />
                Foundational Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {domainDetails?.skills_focus.map((s: string) => (
                  <div key={s} className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-2 hover:border-blue-300 transition-colors">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-600 shrink-0" />
                    <span className="text-[10px] font-black text-slate-700 uppercase">{s}</span>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-blue-50/50 rounded-lg border border-dashed border-blue-100 mt-4 text-[10px] font-bold text-blue-900 leading-relaxed uppercase">
                Institutional Recommendation: Focus on certifications related to {domainDetails?.skills_focus[0]} to bridge current DNA gaps by Q4 2026.
              </div>
            </div>
            <div className="bg-slate-50/50 rounded-xl p-5 border border-slate-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <Globe className="h-20 w-20 text-blue-900" />
              </div>
              <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-4 relative z-10">Neural Skill Gap Analysis</h3>
              <div className="space-y-4 relative z-10">
                {domainDetails?.gap_analysis.map((row: any) => (
                  <div key={row.s} className="space-y-1.5">
                    <div className="flex justify-between text-[9px] font-black uppercase tracking-tight">
                      <span className="text-slate-500">{row.s}</span>
                      <span className={row.v < 50 ? 'text-rose-600' : 'text-blue-600'}>{row.v}% Proficiency</span>
                    </div>
                    <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden">
                      <div className={`h-full ${row.v < 50 ? 'bg-rose-500' : 'bg-blue-600'}`} style={{width: `${row.v}%`}} />
                    </div>
                  </div>
                ))}
              </div>
              <Button 
                disabled={isRedirecting}
                onClick={async () => {
                  setIsRedirecting(true);
                  try {
                    const res = await fetch(getApiUrl("/api/bridge/start"), {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ studentId: 'STU492', domain: selectedDomain })
                    });
                    if (!res.ok) throw new Error("Neural Handshake Failure");
                    const data = await res.json();
                    router.push(`/bridge/${data.programId}`);
                  } catch (err) {
                    console.error("Neural Bridge Link Failure.", err);
                    setIsRedirecting(false);
                  }
                }}
                className="w-full mt-6 bg-slate-900 text-white hover:bg-black border-none rounded-lg h-10 uppercase tracking-widest text-[10px] font-black transition-all"
              >
                {isRedirecting ? (
                  <div className="flex items-center justify-center gap-2">
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    Recalibrating...
                  </div>
                ) : "Initiate Bridge Program"}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )}
 </div>
 );
}
