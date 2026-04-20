"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
 Users, GraduationCap, Target, Briefcase, Activity, Zap, ShieldCheck, ShieldAlert, Layers, TrendingUp
} from "lucide-react";
import { 
 ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
 AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip
} from "recharts";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const DEPARTMENTS = [
 { id: "CSE", name: "Computer Science and Engineering (CSE)" },
 { id: "IT", name: "Information Technology (IT)" },
 { id: "ECE", name: "Electronics and Communication Engineering (ECE)" },
 { id: "EEE", name: "Electrical and Electronics Engineering (EEE)" },
 { id: "MECH", name: "Mechanical Engineering (MECH)" },
 { id: "AIML", name: "Artificial Intelligence & Machine Learning (AI & ML)" },
 { id: "DS", name: "Data Science (DS)" },
 { id: "CS", name: "Cyber Security (CS)" },
 { id: "AIDS", name: "Artificial Intelligence & Data Science (AI & DS)" },
 { id: "MT", name: "Mechatronics Engineering(MT)" },
 { id: "BT", name: "Biotechnology(BT)" },
 { id: "EIE", name: "Electronics and Instrumentation engineering (E&I)" },
 { id: "BME", name: "Biomedical Engineering(BM)" },
 { id: "AGRI", name: "Agricultural Engineering (AGRI)" },
 { id: "FD", name: "Fashion Design (FD)" },
 { id: "FT", name: "Food Technology (FT)" }
];

interface DeptProps {
 currentDept: string;
}

export default function DepartmentIntelligence({ currentDept }: DeptProps) {
 const router = useRouter();
 const [loading, setLoading] = useState(true);
 const [kpiData, setKpiData] = useState<any>(null);
 const [facultyData, setFacultyData] = useState<any[]>([]);
 const [insightMessage, setInsightMessage] = useState<string>("");

 const getApiUrl = (path: string) => {
 const hostname = typeof window !== 'undefined' ? window.location.hostname : '127.0.0.1';
 const protocol = (typeof window !== 'undefined' ? window.location.protocol : 'http:') || 'http:';
 const apiHost = hostname === 'localhost' ? '127.0.0.1' : hostname;
 return `${protocol}//${apiHost}:8001${path}`;
 };

 const fetchData = async () => {
 setLoading(true);
 try {
 const token = localStorage.getItem('token');
 const headers = { 'Authorization': `Bearer ${token}` };

 const [kpiRes, facRes] = await Promise.all([
 fetch(getApiUrl(`/api/department/${currentDept}/kpi`), { headers }).catch(() => null),
 fetch(getApiUrl(`/api/department/${currentDept}/faculty`), { headers }).catch(() => null)
 ]);

 if (kpiRes?.ok) {
  const kpi = await kpiRes.json();
  setKpiData(kpi);
  if (kpi.ai_insight) setInsightMessage(kpi.ai_insight);
 }
 if (facRes?.ok) setFacultyData(await facRes.json());

 } catch (err: any) {
  console.error("Node data extraction error", err);
 } finally {
  setLoading(false);
 }
 };

 useEffect(() => {
 if (currentDept) {
 fetchData();
 }
 }, [currentDept]);

 const displayKPI = kpiData || {
 total_students: 0,
 total_staff: 0,
 avg_cgpa: 0,
 placement_percentage: 0,
 risk_nodes: 0
 };

 return (
 <div className="w-full space-y-4 animate-in fade-in duration-700">
  {/* Header Section */}
  <Card className="bg-slate-950 p-6 rounded-xl border-none shadow-md relative overflow-hidden group">
    <div className="relative z-10 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white border border-white/10 shadow-lg">
          <Layers className="h-5 w-5" />
        </div>
        <div className="space-y-0.5">
          <h1 className="text-lg font-black text-white uppercase tracking-tight">{currentDept} Intelligence Node</h1>
          <p className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest leading-none">{DEPARTMENTS.find(d => d.id === currentDept)?.name}</p>
        </div>
      </div>
      <div className="hidden sm:flex items-center gap-3 bg-white/5 border border-white/5 px-3 py-1.5 rounded-lg">
        <div className="text-right">
          <p className="text-[7px] font-bold text-indigo-300 uppercase tracking-widest leading-none mb-1">Status</p>
          <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest leading-none">Operational</p>
        </div>
      </div>
    </div>
  </Card>

  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
    {[
      { label: "Active Cohort", value: displayKPI.total_students, icon: Users, color: "text-blue-500", bg: "bg-blue-50" },
      { label: "Faculty Nodes", value: displayKPI.total_staff, icon: GraduationCap, color: "text-indigo-500", bg: "bg-indigo-50" },
      { label: "Mean Velocity", value: displayKPI.avg_cgpa, icon: Target, color: "text-emerald-500", bg: "bg-emerald-50" },
      { label: "Placement %", value: `${displayKPI.placement_percentage}%`, icon: Briefcase, color: "text-amber-500", bg: "bg-amber-50" },
      { label: "Risk Factors", value: displayKPI.risk_nodes, icon: ShieldAlert, color: "text-rose-600", bg: "bg-rose-50" }
    ].map((kpi, idx) => (
      <Card key={idx} className="bg-white p-4 rounded-xl border-slate-200 shadow-sm hover:shadow-md transition-all">
        <div className="flex items-center gap-3">
          <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center", kpi.bg, kpi.color)}>
            <kpi.icon className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-0.5 truncate">{kpi.label}</p>
            <h3 className="text-lg font-black text-slate-900 leading-none">{kpi.value}</h3>
          </div>
        </div>
      </Card>
    ))}
  </div>

  <Card className="bg-indigo-600 p-4 rounded-xl text-white border-none shadow-md">
    <div className="flex items-center gap-2.5 mb-2.5">
      <Zap className="h-4 w-4 text-emerald-500" />
      <h4 className="text-[9px] font-black uppercase tracking-widest leading-none">Autonomous Intelligence stream</h4>
    </div>
    <div className="bg-white/5 p-3 rounded-lg border border-white/5">
      <p className="text-[11px] font-bold text-white/90 uppercase leading-snug">
        {insightMessage || "Synchronizing cross-node departmental analytics for localized intelligence reporting."}
      </p>
    </div>
  </Card>

  <div className="flex overflow-x-auto gap-1.5 pb-2 no-scrollbar">
    {DEPARTMENTS.map((dept) => (
      <button
        key={dept.id}
        onClick={() => router.push(`/admin/department/${dept.id}`)}
        className={cn("px-3 py-1 text-[8px] font-black uppercase tracking-widest transition-all border rounded flex-shrink-0", 
          currentDept.toUpperCase() === dept.id.toUpperCase() 
          ? "bg-indigo-600 border-indigo-600 text-white shadow-sm"
          : "bg-white border-slate-200 text-slate-500 hover:border-slate-400")
        }
      >
        {dept.id}
      </button>
    ))}
  </div>

  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
    <Card className="md:col-span-12 lg:col-span-5 p-5 rounded-xl border-slate-200 bg-white">
       <div className="flex items-center justify-between mb-6">
          <h2 className="text-[10px] font-black text-slate-900 uppercase tracking-tight">Faculty Impact Matrix</h2>
          <Users className="h-3 w-3 text-indigo-600" />
       </div>
       <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={facultyData?.length ? facultyData : [
              { radar_label: 'Core', impact_score: 95 },
              { radar_label: 'R&D', impact_score: 80 },
              { radar_label: 'Projects', impact_score: 85 },
              { radar_label: 'Mentors', impact_score: 75 },
              { radar_label: 'Grants', impact_score: 60 }
            ]}>
              <PolarGrid stroke="#f1f5f9" />
              <PolarAngleAxis dataKey="radar_label" tick={{ fill: '#94A3B8', fontSize: 8, fontWeight: 700 }} />
              <PolarRadiusAxis domain={[0, 100]} tick={false} />
              <Radar name="Impact" dataKey="impact_score" stroke="#4F46E5" strokeWidth={1.5} fill="#6366F1" fillOpacity={0.3} />
            </RadarChart>
          </ResponsiveContainer>
       </div>
    </Card>

    <Card className="md:col-span-12 lg:col-span-7 p-5 rounded-xl border-slate-200 bg-white">
       <div className="flex items-center justify-between mb-6">
          <h2 className="text-[10px] font-black text-slate-900 uppercase tracking-tight">Academic Performance Trajectory</h2>
          <TrendingUp className="h-3 w-3 text-emerald-600" />
        </div>
        <div className="h-48 w-full">
           <ResponsiveContainer width="100%" height="100%">
             <AreaChart data={kpiData?.performance_trajectory || [
               { sem: 'S1', avg: 7.2 },
               { sem: 'S2', avg: 7.4 },
               { sem: 'S3', avg: 7.1 },
               { sem: 'S4', avg: 7.8 },
               { sem: 'S5', avg: 8.0 }
             ]}>
               <defs>
                 <linearGradient id="colorTrajectory" x1="0" y1="0" x2="0" y2="1">
                   <stop offset="5%" stopColor="#10B981" stopOpacity={0.1}/>
                   <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                 </linearGradient>
               </defs>
               <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
               <XAxis dataKey="sem" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontWeight: 700, fontSize: 8}} dy={5} />
               <YAxis domain={[5, 10]} axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontWeight: 700, fontSize: 8}} dx={-5} />
               <Tooltip contentStyle={{ fontSize: '9px', borderRadius: '4px', border: '1px solid #F1F5F9', fontWeight: 'bold' }} />
               <Area type="monotone" dataKey="avg" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorTrajectory)" />
             </AreaChart>
           </ResponsiveContainer>
        </div>
      </Card>
  </div>

  <div className="flex justify-center pt-2">
    <Button 
      onClick={() => router.push(`/admin/intervention?dept=${currentDept}`)}
      size="sm"
      className="bg-rose-600 hover:bg-rose-700 text-white text-[9px] font-black uppercase tracking-widest rounded-lg h-9 px-6 border-none"
    >
      <ShieldCheck className="h-3.5 w-3.5 mr-2" />
      Initialize Department Interventions
    </Button>
  </div>
 </div>
 );
}
