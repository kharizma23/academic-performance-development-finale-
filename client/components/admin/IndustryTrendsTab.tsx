"use client";

import React, { useEffect, useState } from "react";
import { 
 TrendingUp, Cpu, Globe, Briefcase, 
 Zap, Loader2, ArrowUpRight, Search, 
 BarChart3, Activity, Layers, Target, 
 Rocket, Compass, Star, ChevronRight
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function IndustryTrendsTab() {
 const [data, setData] = useState<any[]>([]);
 const [loading, setLoading] = useState(true);

 const getApiUrl = (path: string) => {
 const hostname = typeof window !== 'undefined' ? window.location.hostname : '127.0.0.1';
 const apiHost = hostname === 'localhost' ? '127.0.0.1' : hostname;
 return `http://${apiHost}:8001${path}`;
 };

 const fetchTrends = async () => {
 setLoading(true);
 try {
 const token = localStorage.getItem('token');
 const res = await fetch(getApiUrl("/admin/modules/trends"), {
 headers: { 'Authorization': `Bearer ${token}` }
 });
 if (res.ok) setData(await res.json());
 } catch (error) {
 console.error("Trends fetch failed", error);
 } finally {
 setLoading(false);
 }
 };

 useEffect(() => {
 fetchTrends();
 }, []);

 const displayData = data.length > 0 ? data : [
 { skill: "Deep Learning", demand: "High", salary_avg: "18.5 LPA", requirement: "PyTorch & Neural Architecture." },
 { skill: "Cloud Security", demand: "High", salary_avg: "15.2 LPA", requirement: "AWS Security & Kubernetes." },
 { skill: "Blockchain Dev", demand: "Medium", salary_avg: "12.8 LPA", requirement: "Solidity & Web3 integration." }
 ];

 return (
 <div className="space-y-6 animate-in fade-in duration-700 pb-10">
  {/* Header Section */}
  <div className="flex flex-col md:flex-row items-start justify-between gap-6 pb-6 border-b border-slate-100">
    <div className="space-y-1">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-100 text-amber-600 text-[10px] font-bold tracking-widest uppercase">
        <TrendingUp className="h-3 w-3" /> Global Market Intelligence
      </div>
      <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Industry Pulse</h2>
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-tight leading-snug">Monitoring global tech demand and salary vectors.</p>
    </div>
    <div className="flex gap-2">
      <Button size="sm" variant="outline" className="h-9 px-4 text-[10px] font-bold uppercase tracking-widest border-slate-200">
        <Search className="h-3.5 w-3.5 mr-2" /> Global Market
      </Button>
    </div>
  </div>

  {/* Trends Matrix Cards */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {displayData.map((trend, i) => (
      <Card key={i} className="p-5 rounded-xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-4 mb-4">
            <div className="h-10 w-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
              <Cpu className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-black text-slate-900 uppercase truncate leading-tight">{trend.skill}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[8px] font-black uppercase text-amber-600 tracking-widest px-1.5 py-0.5 bg-amber-50 rounded">{trend.demand} Demand</span>
                <div className="flex gap-0.5">
                  {[1, 2, 3].map(j => <Star key={j} className="h-2 w-2 text-amber-500 fill-current" />)}
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1 leading-none">Mean Compensation</p>
              <p className="text-lg font-black text-slate-900 leading-none">{trend.salary_avg}</p>
            </div>
            
            <div className="space-y-1.5">
              <h4 className="text-[8px] font-black uppercase text-slate-900 tracking-widest flex items-center gap-1.5">
                <Target className="h-2.5 w-2.5 text-amber-600" /> Tactical Requirement
              </h4>
              <p className="text-[10px] font-bold text-slate-400 leading-relaxed uppercase">"{trend.requirement}"</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-4 border-t border-slate-50 mt-4">
          <Button variant="outline" size="sm" className="flex-1 h-8 rounded-lg text-[9px] font-bold uppercase tracking-widest">
            <Compass className="h-3.5 w-3.5 mr-2" /> Skill Road
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg text-slate-400 hover:text-amber-600">
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    ))}
  </div>

  {/* Strategic Intervention Hub */}
  <Card className="p-6 rounded-xl border border-amber-100 bg-amber-50/50 shadow-sm relative overflow-hidden group">
    <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
      <div className="space-y-3 max-w-4xl text-center md:text-left">
        <h4 className="text-[10px] font-black text-amber-600 uppercase tracking-widest flex items-center justify-center md:justify-start gap-2">
          <Activity className="h-3 w-3" /> Industry Convergence Node
        </h4>
        <h3 className="text-xl font-black text-slate-900 uppercase leading-none">Skill Dynamic Hub</h3>
        <p className="text-[10px] font-bold text-slate-500 leading-relaxed uppercase max-w-2xl">Scanning global hiring protocols from Top 500 tech firms to identify institutional skill-gap clusters. Deploying real-time curriculum adjustments.</p>
      </div>
      <Button className="bg-amber-600 hover:bg-amber-700 text-white font-black uppercase text-[10px] h-9 px-6 rounded-lg shadow-md shadow-amber-200 shrink-0 transition-all active:scale-95 border-none">
        Launch Evolution Node
      </Button>
    </div>
  </Card>

  {/* Bottom Sector Highlights */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <Card className="p-5 rounded-xl bg-white border border-slate-200 text-slate-900 relative shadow-md overflow-hidden group">
      <div className="absolute bottom-0 right-0 p-6 opacity-10">
        <Layers className="h-16 w-16" />
      </div>
      <p className="text-[9px] font-bold uppercase tracking-widest text-indigo-400 mb-4">Sector Foresight</p>
      <h3 className="text-sm font-black uppercase leading-tight">R&amp;D Lab Clusters</h3>
      <p className="text-[10px] font-semibold text-slate-400 leading-relaxed uppercase mt-2">"Emergent demand for Spatial Computing and Quantum Infrastructure nodes identified in automotive sector."</p>
    </Card>
    <Card className="p-5 rounded-xl bg-amber-950 text-white relative shadow-sm overflow-hidden group">
      <div className="absolute bottom-0 right-0 p-6 opacity-10">
        <Globe className="h-16 w-16" />
      </div>
      <p className="text-[9px] font-bold uppercase tracking-widest text-amber-500 mb-4">Hiring Velocity</p>
      <h3 className="text-sm font-black uppercase leading-tight">Global Inflow Index</h3>
      <p className="text-[10px] font-semibold text-amber-500/60 leading-relaxed uppercase mt-2">"5% growth in remote-first core engineering roles across Asian tech corridor noted for FY 2026."</p>
    </Card>
  </div>
 </div>
 );
}
