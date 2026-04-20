"use client";

import React, { useEffect, useState } from "react";
import { 
  Users, Briefcase, TrendingUp, Zap, Globe, Award, Loader2, MapPin, Search as SearchIcon, Filter, Layers, Mail
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function AlumniIntelligenceTab() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const getApiUrl = (path: string) => {
    const hostname = typeof window !== 'undefined' ? window.location.hostname : '127.0.0.1';
    const apiHost = hostname === 'localhost' ? '127.0.0.1' : hostname;
    return `http://${apiHost}:8001${path}`;
  };

  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(getApiUrl("/admin/modules/alumni"), {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) setData(await res.json());
      } catch (error) {
        console.error("Alumni fetch failed", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAlumni();
  }, []);

  const displayData = data || {
    placement_rate: 94.2,
    avg_package: "14.5 LPA",
    top_recruiters: ["Google", "Amazon", "Zoho", "NVIDIA"],
    engagement_score: 88,
    mentorship_nodes: 850
  };

  const mockAlumni = [
    { name: "Rahul S", company: "Google", role: "SDE-II", batch: "2023", pkg: "42 LPA", location: "Bangalore" },
    { name: "Priya K", company: "Microsoft", role: "Product Manager", batch: "2022", pkg: "35 LPA", location: "Hyderabad" },
    { name: "Arun M", company: "Zoho", role: "Full Stack Dev", batch: "2024", pkg: "12 LPA", location: "Chennai" },
    { name: "Deepa V", company: "Amazon", role: "Data Scientist", batch: "2023", pkg: "28 LPA", location: "Seattle" }
  ];

  if (loading && !data) return (
    <div className="h-64 flex items-center justify-center">
      <Loader2 className="h-10 w-10 animate-spin text-emerald-600" />
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-10">
      <div className="flex flex-col md:flex-row items-start justify-between gap-6 pb-6 border-b border-slate-100">
        <div className="space-y-2 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-bold uppercase shadow-sm">
            <Globe className="h-3.5 w-3.5" /> Global Alumni ecosystem
          </div>
          <h2 className="text-2xl font-black text-slate-900 uppercase leading-none tracking-tight">Ecosystem Intelligence</h2>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-tight leading-snug">Tracking career progression vectors and placement success ratios.</p>
        </div>
        <Button variant="outline" size="sm" className="h-9 px-4 rounded-lg border-2 border-slate-200 text-[10px] font-bold uppercase tracking-wider">
          <Users className="h-4 w-4 mr-2" /> Alumni Registry
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Placement Success", val: `${displayData.placement_rate}%`, icon: Briefcase, color: "text-emerald-500", bg: "bg-emerald-50", border: "border-emerald-100" },
          { label: "Average Package", val: displayData.avg_package, icon: TrendingUp, color: "text-blue-500", bg: "bg-blue-50", border: "border-blue-100" },
          { label: "Mentorship Nodes", val: displayData.mentorship_nodes, icon: Zap, color: "text-amber-500", bg: "bg-amber-50", border: "border-amber-100" },
          { label: "Engagement Score", val: `${displayData.engagement_score}/100`, icon: Award, color: "text-indigo-500", bg: "bg-indigo-50", border: "border-indigo-100" }
        ].map((stat, i) => (
          <Card key={i} className={cn("p-5 rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md", stat.border)}>
            <p className={cn("text-[10px] font-bold uppercase tracking-widest mb-4", stat.color)}>{stat.label}</p>
            <div className="flex items-center justify-between">
              <p className="text-2xl font-black text-slate-900 leading-none">{stat.val}</p>
              <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center", stat.bg, stat.color)}>
                <stat.icon className="h-4 w-4" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-4">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-3">
            <TrendingUp className="h-0.5 w-8 bg-emerald-600 rounded-full" /> Senior Professional Highlights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockAlumni.map((alumnus, i) => (
              <Card key={i} className="p-4 rounded-xl border border-slate-100 bg-white shadow-sm hover:border-emerald-100 transition-all cursor-pointer">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-10 w-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg shadow-sm border border-emerald-100">
                    {(alumnus.name || "A")[0]}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-black text-slate-900 uppercase truncate">{alumnus.name}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight truncate flex items-center gap-1.5">
                      <Briefcase className="h-3 w-3" /> {alumnus.role} @ {alumnus.company}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Salary Node</p>
                    <p className="text-xs font-black text-emerald-600">{alumnus.pkg}</p>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Location</p>
                    <p className="text-xs font-black text-slate-800">{alumnus.location}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <Card className="lg:col-span-4 p-5 rounded-xl border border-slate-100 bg-white shadow-sm flex flex-col justify-between relative overflow-hidden group">
          <div className="relative z-10">
            <h3 className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Zap className="h-4 w-4" /> Mentorship Logic
            </h3>
            <div className="space-y-6 mb-6">
              {[
                { label: "Industry Reach Matrix", val: "Global 500+", sub: "Fortune Correlation" },
                { label: "Startup Founders Node", val: "24 Founders", sub: "Entrepreneurial Pulse" },
                { label: "Higher Studies Vector", val: "15% Intake", sub: "Silicon Gateways" }
              ].map((stat, i) => (
                <div key={i}>
                  <p className="text-[8px] font-bold uppercase text-slate-400 tracking-widest mb-1">{stat.label}</p>
                  <p className="text-md font-black text-slate-900 mb-0.5">{stat.val}</p>
                  <p className="text-[8px] font-bold text-slate-300 uppercase tracking-widest">{stat.sub}</p>
                </div>
              ))}
            </div>
          </div>
          <Button size="sm" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase text-[10px] h-9 rounded-lg shadow-sm border-none transition-all">
            Sync Mentorship Hub
          </Button>
        </Card>
      </div>

      <Card className="p-6 rounded-xl bg-emerald-600 border border-emerald-500 shadow-lg relative overflow-hidden text-white flex flex-col md:flex-row items-center justify-between gap-6 group shadow-emerald-100">
        <div className="space-y-4 max-w-4xl relative z-10 text-center md:text-left">
          <div className="h-10 w-10 bg-white/10 rounded-lg flex items-center justify-center border border-white/20 shadow-sm mx-auto md:mx-0">
            <Globe className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-xl font-black uppercase tracking-tight leading-none">Global Strategic Alignment</h3>
          <p className="text-emerald-50 font-semibold text-xs leading-relaxed uppercase">AI mapping current alumni success metrics against academic nodes in real-time.</p>
        </div>
        <div className="flex flex-col gap-3 shrink-0 relative z-10 w-full md:w-auto">
          <Button className="bg-white text-emerald-700 rounded-lg px-8 h-10 font-bold uppercase text-xs tracking-widest hover:bg-emerald-50 hover:text-emerald-800 transition-all duration-300 border-none shadow-sm shadow-emerald-700/20">
            ROI Audit Hub
          </Button>
          <button className="text-[10px] font-bold uppercase text-emerald-100 tracking-widest hover:text-white transition-colors duration-300">
            View Placement Map
          </button>
        </div>
      </Card>
    </div>
  );
}
