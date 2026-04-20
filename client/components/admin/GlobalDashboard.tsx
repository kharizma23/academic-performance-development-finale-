"use client";

import React from "react";
import {
 Users, GraduationCap, Target, Award, AlertTriangle, TrendingUp,
 Activity, Briefcase, ShieldCheck, Layers, UserPlus, FileText
} from "lucide-react";
import {
 ResponsiveContainer, PieChart, Pie, Cell, Tooltip, RadarChart,
 PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from "recharts";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const CLUSTER_COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444'];

interface GlobalDashboardProps {
 data: any;
 setSelectedCluster?: (cluster: any) => void;
 setIsInterventionOpen?: (open: boolean) => void;
}

const GlobalDashboard: React.FC<GlobalDashboardProps> = ({
 data,
 setSelectedCluster,
 setIsInterventionOpen
}) => {
 if (!data) return null;

 return (
 <div className="w-full bg-slate-50 text-slate-900 font-sans pb-10 space-y-4">
    {/* KPI Grid */}
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
      {[
        { label: "Total Students", value: data.institutional?.total_students || 0, icon: Users, progress: 100, color: "bg-blue-600" },
        { label: "Active Nodes", value: data.institutional?.active_students || 0, icon: GraduationCap, progress: 95, color: "bg-blue-500" },
        { label: "Placement", value: `${data.institutional?.placement_readiness_avg || 0}%`, icon: Target, progress: data.institutional?.placement_readiness_avg || 0, color: (data.institutional?.placement_readiness_avg || 0) > 75 ? "bg-emerald-500" : "bg-amber-500" },
        { label: "Avg GPA", value: data.institutional?.avg_cgpa || 0, icon: Award, progress: (data.institutional?.avg_cgpa || 0) * 10, color: "bg-emerald-600" },
        { label: "DNA Index", value: data.institutional?.dna_score || 0, icon: Activity, progress: data.institutional?.dna_score || 0, color: "bg-blue-700" },
        { label: "Risk Factor", value: `${data.institutional?.risk_ratio || 0}%`, icon: AlertTriangle, progress: data.institutional?.risk_ratio || 0, color: (data.institutional?.risk_ratio || 0) > 20 ? "bg-rose-500" : "bg-blue-400" },
        { label: "Growth", value: data.institutional?.avg_growth_index || 0, icon: TrendingUp, progress: 80, color: "bg-blue-800" }
      ].map((kpi, i) => (
        <Card key={i} className="p-3.5 flex flex-col justify-between hover:shadow-md transition-all h-24 relative overflow-hidden group bg-white border-slate-200">
          <div className="flex items-center justify-between">
            <div className="p-1.5 rounded-lg bg-slate-50 text-slate-400">
              <kpi.icon className="h-3.5 w-3.5" />
            </div>
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{kpi.label}</p>
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-950 leading-none">{kpi.value}</h3>
            <div className="mt-2 w-full h-1 bg-slate-100 rounded-full overflow-hidden">
              <div className={cn("h-full", kpi.color)} style={{ width: `${kpi.progress}%` }}></div>
            </div>
          </div>
        </Card>
      ))}
    </div>

    {/* Row 2: Insights & Procedures */}
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      <Card className="lg:col-span-8 p-5 rounded-xl border-slate-200 bg-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-emerald-50 p-2 rounded-lg text-emerald-600">
            <Activity className="h-4 w-4" />
          </div>
          <h2 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">AI Strategic Vector Engine</h2>
        </div>
        <p className="text-sm font-bold text-slate-700 leading-relaxed uppercase">
          {data.weekly_insight || "AI analysis indicates optimal learning velocity. Strategic alignment required for Year 3 cohorts."}
        </p>
      </Card>

      <Card className="lg:col-span-4 p-5 rounded-xl border-slate-200 bg-white">
        <h2 className="text-[10px] font-black text-slate-900 mb-4 flex items-center gap-2 uppercase tracking-widest">
          <ShieldCheck className="h-4 w-4 text-blue-600" /> Tactical Procedures
        </h2>
        <div className="grid grid-cols-3 lg:grid-cols-1 gap-2">
          {[
            { label: "Student Node", icon: UserPlus, bg: "bg-slate-50", color: "text-blue-700" },
            { label: "Risk Matrix", icon: AlertTriangle, bg: "bg-rose-50", color: "text-rose-600" },
            { label: "Certification", icon: FileText, bg: "bg-blue-50", color: "text-blue-600" }
          ].map((action, i) => (
            <button key={i} className={cn("flex items-center gap-3 border border-slate-100 p-2.5 rounded-lg text-left transition-all hover:bg-slate-50", action.bg)}>
              <action.icon className="h-3 w-3 shrink-0" />
              <span className="text-[8px] font-black text-slate-800 uppercase tracking-tight truncate">{action.label}</span>
            </button>
          ))}
        </div>
      </Card>
    </div>

    {/* Row 3: Vulnerability, Clusters, Placement */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="p-5 rounded-xl bg-white border-slate-200">
        <h2 className="text-[10px] font-black text-slate-900 mb-6 flex items-center gap-2 uppercase tracking-widest">
          <AlertTriangle className="h-4 w-4 text-rose-500" /> Vulnerability Audit
        </h2>
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-rose-50/50 rounded-lg p-4 border border-rose-100 text-center">
            <p className="text-[7px] font-black text-rose-600 mb-1 uppercase tracking-widest">CRITICAL</p>
            <p className="text-xl font-black text-rose-600">{data.early_warning?.high_risk_count || 0}</p>
          </div>
          <div className="bg-amber-50/50 rounded-lg p-4 border border-amber-100 text-center">
            <p className="text-[7px] font-black text-amber-600 mb-1 uppercase tracking-widest">ANOMALIES</p>
            <p className="text-xl font-black text-amber-600">{data.early_warning?.medium_risk_count || 0}</p>
          </div>
        </div>
        <div className="space-y-1.5">
          <div className="flex justify-between text-[8px] font-bold text-slate-400 uppercase tracking-widest">
            <span>Stability Index</span>
            <span className="text-emerald-600">{data.early_warning?.low_risk_percent || 0}% SECURE</span>
          </div>
          <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-600" style={{ width: `${data.early_warning?.low_risk_percent || 0}%` }}></div>
          </div>
        </div>
      </Card>

      <Card className="p-5 rounded-xl bg-white border-slate-200">
        <h2 className="text-[10px] font-black text-slate-900 mb-4 flex items-center gap-2 uppercase tracking-widest">
          <Layers className="h-4 w-4 text-blue-600" /> Neural Clusters
        </h2>
        <div className="h-28 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data.performance_clusters || []} cx="50%" cy="50%" innerRadius="65%" outerRadius="90%" paddingAngle={4} dataKey="count" stroke="none">
                {(data.performance_clusters || []).map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={CLUSTER_COLORS[index % CLUSTER_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '8px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-4">
          {['Elite', 'Stable', 'Ascending', 'Critical'].map((label, i) => (
            <div key={i} className="flex items-center gap-1.5 text-[7px] font-black uppercase text-slate-500 bg-slate-50 p-1.5 rounded border border-slate-100">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: CLUSTER_COLORS[i] }}></span>
              {label}
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-5 rounded-xl bg-white border-slate-200">
        <h2 className="text-[10px] font-black text-slate-900 mb-6 flex items-center gap-2 uppercase tracking-widest">
          <Briefcase className="h-4 w-4 text-blue-600" /> Placement Projection
        </h2>
        <div className="flex flex-col items-center">
          <div className="relative w-32 h-20 overflow-hidden">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={[{ value: data.placement_forecast?.forecast_placement_percent || 78 }, { value: 100 - (data.placement_forecast?.forecast_placement_percent || 78) }]} cx="50%" cy="100%" innerRadius="75%" outerRadius="110%" startAngle={180} endAngle={0} dataKey="value" stroke="none">
                  <Cell fill="#10B981" />
                  <Cell fill="#F1F5F9" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-end pb-1">
              <span className="text-xl font-black text-slate-950">{data.placement_forecast?.forecast_placement_percent || 0}%</span>
            </div>
          </div>
          <div className="w-full grid grid-cols-2 gap-2 mt-4">
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-center">
              <p className="text-[7px] font-bold text-slate-500 uppercase">Skill Gap</p>
              <p className="text-[10px] font-black text-rose-600">{data.placement_forecast?.skill_gap_avg || 0}%</p>
            </div>
            <div className="p-2.5 bg-blue-50/50 rounded-lg border border-blue-100 text-center">
              <p className="text-[7px] font-bold text-blue-600 uppercase">Readiness</p>
              <p className="text-[10px] font-black text-blue-900">{data.placement_forecast?.avg_career_readiness || 0}%</p>
            </div>
          </div>
        </div>
      </Card>
    </div>

    {/* Row 4: Impact, Heatmap, Anomalies */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <Card className="p-5 rounded-xl bg-white border-slate-200 shadow-sm">
         <h2 className="text-[10px] font-black text-slate-900 mb-6 flex items-center gap-2 uppercase tracking-widest">
           <Users className="h-4 w-4 text-blue-600" /> Influence Matrix
         </h2>
         <div className="h-40">
           <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data.faculty_impact}>
                <PolarGrid stroke="#F1F5F9" />
                <PolarAngleAxis dataKey="name" tick={{ fill: '#94A3B8', fontSize: 8, fontWeight: '700' }} />
                <PolarRadiusAxis domain={[0, 100]} tick={false} />
                <Radar name="Impact" dataKey="impact_score" stroke="#2563EB" strokeWidth={1} fill="#3B82F6" fillOpacity={0.3} />
              </RadarChart>
           </ResponsiveContainer>
         </div>
      </Card>

      <Card className="p-5 rounded-xl bg-white border-slate-200 shadow-sm">
         <h2 className="text-[10px] font-black text-slate-900 mb-6 flex items-center gap-2 uppercase tracking-widest">
           <Activity className="h-4 w-4 text-blue-600" /> Infrastructure Heatmap
         </h2>
         <div className="w-full flex flex-col gap-1.5">
           {['AIML', 'CSE', 'ECE', 'EEE', 'MECH'].map((dept, i) => (
             <div key={dept} className="flex items-center gap-1.5">
               <span className="text-[8px] font-bold text-slate-500 w-8 truncate uppercase">{dept}</span>
               <div className="flex-1 grid grid-cols-5 gap-1">
                 {[1, 2, 3, 4, 5].map(s => {
                   const status = (i + s) % 5 === 0 ? "bg-rose-500" : (i + s) % 3 === 0 ? "bg-amber-400" : "bg-emerald-500";
                   return <div key={`${dept}-${s}`} className={`h-2.5 rounded-sm transition-all hover:scale-110 ${status}`}></div>
                 })}
               </div>
             </div>
           ))}
         </div>
         <div className="mt-4 flex justify-between px-1">
           {['CRIT', 'STAB', 'OPT'].map((l, i) => (
             <div key={l} className="flex items-center gap-1">
               <div className={cn("h-1.5 w-1.5 rounded-full", i === 0 ? "bg-rose-500" : i === 1 ? "bg-amber-400" : "bg-emerald-500")}></div>
               <span className="text-[7px] font-bold text-slate-400 uppercase tracking-tighter">{l}</span>
             </div>
           ))}
         </div>
      </Card>

      <Card className="p-5 rounded-xl bg-white border-slate-200 shadow-sm">
         <h2 className="text-[10px] font-black text-slate-900 mb-6 flex items-center gap-2 uppercase tracking-widest">
           <AlertTriangle className="h-4 w-4 text-rose-500" /> Neural Anomaly Feed
         </h2>
         <div className="space-y-2 max-h-[160px] overflow-y-auto no-scrollbar">
           {data.ai_anomalies?.map((alert: any, i: number) => (
             <div key={i} className={cn(
               "p-2.5 rounded-lg border flex items-start gap-2.5 transition-all hover:bg-slate-50",
               alert.priority === 'high' ? 'bg-rose-50/50 border-rose-100' : 'bg-amber-50/50 border-amber-100'
             )}>
                <div className="min-w-0">
                  <p className={cn("text-[8px] font-black uppercase tracking-tight", alert.priority === 'high' ? 'text-rose-800' : 'text-amber-800')}>{alert.type}</p>
                  <p className="text-[9px] font-bold text-slate-600 mt-0.5 leading-snug uppercase">{alert.detail}</p>
                </div>
             </div>
           ))}
         </div>
      </Card>
    </div>
 </div>
 );
};

export default GlobalDashboard;
