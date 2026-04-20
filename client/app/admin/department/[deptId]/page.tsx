"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  Building2, ArrowLeft, Users, TrendingUp, AlertTriangle, 
  Target, GraduationCap, Zap, Activity, BrainCircuit, ShieldAlert,
  ClipboardList, CheckCircle2, FileText, ChevronRight, BarChart3,
  Mail, XCircle, Search, Filter, Building, Briefcase, CalendarCheck, 
  ArrowRightCircle, Banknote, CheckCircle, Crosshair,
  BellRing, History, Sparkles, Stethoscope, Layers, Flame
} from "lucide-react";
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip,
  BarChart, Bar, Cell, LineChart, Line, Legend, RadarChart, PolarGrid,
  PolarAngleAxis, Radar, PieChart, Pie
} from "recharts";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DepartmentCommandCenter() {
  const { deptId } = useParams();
  const router = useRouter();
  const departmentName = (deptId as string).toUpperCase();
  
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview"); // overview, academics, placements, interventions
  
  // Simulated AI insights & Data models (since we need full 10 modules without pre-existing endpoints for each)
  const [data, setData] = useState<any>(null);

  const getApiUrl = (path: string) => {
    const envUrl = process.env.NEXT_PUBLIC_API_URL;
    if (envUrl) return `${envUrl}${path}`;
    
    const hostname = typeof window !== 'undefined' ? window.location.hostname : '127.0.0.1';
    const apiHost = hostname === 'localhost' ? '127.0.0.1' : hostname;
    return `http://${apiHost}:8001${path}`;
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Concurrent fetch with validation node
      const fetchNode = async (path: string) => {
        const res = await fetch(getApiUrl(path), { headers });
        if (!res.ok) throw new Error(`Node Sync Failed [${path}]: ${res.status}`);
        return res.json();
      };

      const [kpi, subjects, faculty, top, risk, placement] = await Promise.all([
        fetchNode(`/api/department/${deptId}/kpi`),
        fetchNode(`/api/department/${deptId}/subjects`),
        fetchNode(`/api/department/${deptId}/faculty`),
        fetchNode(`/api/department/${deptId}/top-performers`),
        fetchNode(`/api/department/${deptId}/at-risk`),
        fetchNode(`/api/department/${deptId}/placement-details`)
      ]);

      setData({
        overview: {
          total_students: kpi.total_students,
          avg_cgpa: kpi.avg_cgpa,
          placement_readiness: kpi.placement_percentage,
          risk_students: kpi.risk_nodes,
          status: kpi.risk_nodes > 50 ? "CRITICAL" : (kpi.risk_nodes > 20 ? "WARNING" : "STABLE"),
          ai_insight: kpi.ai_insight
        },
        subjects: subjects.map((s: any) => ({
          name: s.name, avg: s.avg_score, pass: s.pass_percentage, difficulty: s.backlog_percentage > 15 ? "High" : (s.backlog_percentage > 8 ? "Medium" : "Low")
        })),
        critical_students: risk.map((r: any) => ({
          id: r.id, name: r.name, cgpa: r.cgpa, attendance: r.attendance, issue: r.issue
        })),
        top_performers: top,
        trends: kpi.performance_trajectory.map((t: any, i: number) => ({
          term: t.sem, attendance: kpi.attendance_score + i, marks: (t.avg * 10), placement: kpi.placement_percentage - i
        })),
        skill_gap: [
          { skill: "Core Theory", gap: 10 + (kpi.academic_score % 15) },
          { skill: "Institutional DNA", gap: 18 + (kpi.attendance_score % 10) },
          { skill: "Practical Lab", gap: 8 + (kpi.placement_percentage % 12) }
        ],
        faculty: faculty.slice(0, 5),
        interventions: risk.slice(0, 2).map((r: any, i: number) => ({
          id: `INT-${i}`, student: r.name, type: "Mentor Assigned", status: "Active"
        })),
        placements: {
          funnel: [
            { stage: "Eligible", count: Math.floor(kpi.total_students * 0.8) },
            { stage: "Placed", count: Math.floor(kpi.total_students * (kpi.placement_percentage/100)) }
          ],
          packages: {
            highest: placement.highest_package,
            average: placement.average_package,
            companies: placement.companies
          },
          roles: [
            { name: "SDE", value: 30 + (kpi.academic_score % 25) },
            { name: "Core", value: 20 + (kpi.attendance_score % 20) },
            { name: "Other", value: 50 - ((kpi.academic_score % 25) + (kpi.attendance_score % 20)) }
          ],
          upcoming_drives: [
            { company: "Institutional Partner", role: "Trainee", date: "Next Week", eligible: 120 }
          ],
          non_eligible_reasons: [
            { reason: "CGPA < 6.0", count: Math.floor(kpi.total_students * 0.1) }
          ],
           mock_interviews: top.slice(0, 3).map((t: any, idx: number) => ({
            name: t.name, score: Number(((7.0 + (kpi.academic_score % 30) / 10 + (idx * 0.2)).toFixed(1))), status: idx === 0 ? "Ready" : "Review"
          })),
          company_matcher: top.slice(0, 2).map((t: any, idx: number) => ({
            student: t.name, fit: placement.companies[idx]?.name || "Tier 1", matchScore: 80 + (kpi.placement_percentage % 15) + idx
          }))
        }
      });
      setLoading(false);
    } catch (err) {
      console.error("Data extraction error:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (deptId) fetchData();
  }, [deptId]);

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
        <div className="h-32 w-32 relative flex items-center justify-center mb-8">
           <div className="absolute inset-0 rounded-full border-t-8 border-indigo-600 animate-spin"></div>
           <BrainCircuit className="h-10 w-10 text-indigo-900 animate-pulse" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 uppercase tracking-widest text-center">
          Initializing Neural Matrix...<br />
          <span className="text-indigo-600">DEPARTMENTAL COMMAND CENTER</span>
        </h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-indigo-50/30 p-5 pt-24 lg:p-8 lg:pt-24 space-y-12 animate-in fade-in duration-700">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-5 pb-8 border-b-8 border-slate-200/50">
        <div className="flex items-center gap-5">
          <Button onClick={() => router.push('/admin/academic-intelligence')} variant="outline" className="h-10 w-10 rounded-2xl border-2 border-slate-200 bg-white text-indigo-600 hover:bg-indigo-50 hover:text-indigo-800 shadow-md">
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div className="h-8 w-8 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-2xl border-2 border-white">
            <Building2 className="h-12 w-12" />
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-bold text-slate-900 uppercase tracking-tight">
              {departmentName} <span className="text-indigo-600">Command</span>
            </h1>
            <div className="flex items-center gap-4 mt-3">
              <span className="px-4 py-1.5 bg-indigo-100 text-indigo-700 font-semibold rounded-lg uppercase tracking-widest text-sm border-2 border-indigo-200">
                AI-Powered Analytics
              </span>
              <span className={`px-4 py-1.5 font-semibold rounded-lg uppercase tracking-widest text-sm border-2 ${data.overview.status === 'STABLE' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-amber-100 text-amber-700 border-amber-200'}`}>
                Status: {data.overview.status}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border-4 border-slate-200 shadow-sm">
           {['overview', 'academics', 'placements', 'interventions'].map(tab => (
             <button 
               key={tab}
               onClick={() => setActiveTab(tab)}
               className={`px-6 py-3 rounded-xl text-lg font-semibold uppercase transition-all ${activeTab === tab ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-500 hover:bg-slate-100'}`}
             >
               {tab}
             </button>
           ))}
        </div>
      </div>

      {activeTab === 'overview' && (
      <div className="space-y-12">
        
        {/* 1. AI Department Summary (Banner) */}
        <Card className="p-5 rounded-2xl border-2 border-indigo-500 bg-indigo-950 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 w-full">
           <div className="absolute top-0 left-0 p-4 opacity-10"><Sparkles className="h-10 w-10 text-indigo-400" /></div>
           <div className="relative z-10 flex items-center gap-6">
             <div className="bg-indigo-600 p-4 rounded-2xl shadow-inner"><BrainCircuit className="h-10 w-10 text-white" /></div>
             <div>
               <h3 className="text-2xl font-semibold text-indigo-300 uppercase tracking-widest mb-1">Live Intelligence Summary</h3>
               <p className="text-xl font-bold text-white leading-tight">
                 {data.overview.ai_insight || `${departmentName} exhibits strong placement scaling, but ${data.overview.risk_students} nodes are projecting failure.`}
               </p>
             </div>
           </div>
           <Button className="h-10 px-4 bg-indigo-500 hover:bg-indigo-400 text-white font-semibold uppercase text-2xl rounded-xl shadow-lg whitespace-nowrap relative z-10 transition-all border-none">
             View Full Analysis
           </Button>
        </Card>

        {/* TOP ROW: Health Score | Alerts | Placement Snapshot */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* 2. Department Health Score */}
            <Card className="p-6 rounded-2xl border-2 border-slate-100 shadow-2xl bg-white flex flex-col items-center text-center">
               <h3 className="text-xl font-bold text-slate-400 uppercase tracking-widest mb-8 w-full text-left">Department Health</h3>
               <div className="relative h-[16rem] w-[16rem] flex items-center justify-center bg-indigo-50 rounded-full border-2 border-indigo-100 shadow-inner">
                 <p className="text-4xl leading-none font-bold text-indigo-700">{data.overview.health_score || 85}%</p>
               </div>
               <div className="w-full mt-12 space-y-4">
                  <div className="flex justify-between font-semibold text-2xl uppercase text-slate-500 bg-slate-50 p-4 rounded-2xl"><span>Academic</span><span className="text-slate-900 text-lg">{data.overview.academic_score || 82}%</span></div>
                  <div className="flex justify-between font-semibold text-2xl uppercase text-slate-500 bg-slate-50 p-4 rounded-2xl"><span>Placement</span><span className="text-slate-900 text-lg">{data.overview.placement_percentage}%</span></div>
                  <div className="flex justify-between font-semibold text-2xl uppercase text-slate-500 bg-slate-50 p-4 rounded-2xl"><span>Attendance</span><span className="text-slate-900 text-lg">{data.overview.attendance_score || 88}%</span></div>
               </div>
            </Card>

            {/* 3. Critical Alerts */}
            <Card className="p-6 rounded-2xl border-2 border-rose-100 bg-rose-50 shadow-2xl flex flex-col">
              <h3 className="text-xl font-bold text-rose-500 uppercase tracking-widest mb-8 w-full text-left flex items-center justify-between">
                <span>Critical Alerts</span>
                <span className="bg-rose-500 text-white px-6 py-3 rounded-2xl font-semibold text-2xl">3 ACTIVE</span>
              </h3>
              <div className="space-y-6 grow flex flex-col justify-center">
                 <div className="flex items-start gap-6 p-6 bg-white rounded-xl shadow-sm border border-rose-100">
                   <AlertTriangle className="h-8 w-8 text-rose-500 shrink-0" />
                   <div><p className="font-semibold text-rose-900 text-xl leading-tight">{data.overview.risk_students} Students At-Risk</p><p className="text-2xl font-semibold text-rose-400 mt-2">CGPA below threshold</p></div>
                 </div>
                 <div className="flex items-start gap-6 p-6 bg-white rounded-xl shadow-sm border border-rose-100">
                   <Flame className="h-8 w-8 text-orange-500 shrink-0" />
                   <div><p className="font-semibold text-slate-900 text-xl leading-tight">Attendance Cluster Drop</p><p className="text-2xl font-semibold text-slate-400 mt-2">Sem 5 averages hit {data.overview.attendance_score - 11 || 74}%</p></div>
                 </div>
              </div>
              <Button className="w-full mt-8 bg-rose-600 hover:bg-rose-700 text-white font-semibold uppercase text-lg shadow-lg h-20 border-none rounded-xl">Take Direct Action</Button>
            </Card>

            {/* 8. Placement Snapshot */}
            <Card className="p-6 rounded-2xl border-2 border-emerald-100 bg-emerald-50 shadow-2xl flex flex-col">
              <h3 className="text-xl font-bold text-emerald-600 uppercase tracking-widest mb-8 w-full text-left flex items-center justify-between">
                <span>Placement Vector</span>
                <Target className="h-12 w-12" />
              </h3>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-emerald-100 flex flex-col items-center justify-center mb-8 grow">
                 <p className="text-6xl leading-none font-semibold text-emerald-600">{data.overview.placement_readiness}%</p>
                 <p className="text-lg font-bold text-emerald-800 uppercase tracking-widest mt-8">Currently Eligible</p>
              </div>
              <div className="flex justify-between items-center p-6 bg-white rounded-t-[2rem] border-b-[4px] border-emerald-100/50 mt-auto">
                 <span className="font-semibold text-slate-500 text-2xl uppercase">Avg Package</span>
                 <span className="font-semibold text-slate-900 text-xl">{data.placements.packages.average} LPA</span>
              </div>
              <div className="flex justify-between items-center p-6 bg-white rounded-b-[2rem]">
                 <span className="font-semibold text-slate-500 text-2xl uppercase">Top Recruiter</span>
                 <span className="font-semibold text-slate-900 text-xl">{data.placements.packages.companies[0].name}</span>
              </div>
            </Card>
        </div>

        {/* 4. Top vs Risk Students Snapshot */}
        <Card className="rounded-2xl border-2 border-slate-100 shadow-2xl overflow-hidden bg-slate-900">
           <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x-[8px] divide-slate-800">
             {/* LEFT: Top Students */}
             <div className="p-6 bg-indigo-950 text-white">
                <h3 className="text-xl font-bold text-indigo-300 uppercase tracking-widest mb-8 flex items-center gap-4">
                  <TrendingUp className="h-10 w-10 text-indigo-400" /> Executive Tier Performers
                </h3>
                 <div className="space-y-6">
                   {data.top_performers.slice(0,3).map((stu: any, i: number) => (
                     <div key={i} className="bg-indigo-900/50 p-6 rounded-2xl flex justify-between items-center border-2 border-indigo-800/50 shadow-sm">
                        <div className="flex items-center gap-6">
                          <div className="h-8 w-8 bg-indigo-600 rounded-full flex items-center justify-center font-semibold text-2xl shrink-0">#{i+1}</div>
                          <p className="font-semibold text-xl uppercase text-indigo-50 leading-none">{stu.name}</p>
                        </div>
                        <span className="font-semibold text-indigo-300 text-xl border-l-[4px] border-indigo-700 pl-6 py-2">{stu.cgpa} CGPA</span>
                     </div>
                   ))}
                 </div>
             </div>
             {/* RIGHT: At-Risk */}
             <div className="p-6 bg-rose-950 text-white">
                <h3 className="text-xl font-bold text-rose-300 uppercase tracking-widest mb-8 flex items-center gap-4">
                  <AlertTriangle className="h-10 w-10 text-rose-400" /> Critical Risk Profiles
                </h3>
                <div className="space-y-6">
                  {data.critical_students.slice(0,3).map((sys: any, i: number) => (
                    <div key={i} className="bg-rose-900/50 p-6 rounded-2xl flex justify-between items-center border-2 border-rose-800/50 shadow-sm">
                       <div className="flex flex-col gap-2">
                         <p className="font-semibold text-xl uppercase text-rose-50 px-2 leading-none">{sys.name}</p>
                         <p className="text-2xl font-bold tracking-widest text-rose-400 mt-1 px-2">{sys.issue}</p>
                       </div>
                       <div className="flex gap-6 items-center">
                          <span className="font-semibold text-rose-300 text-xl border-l-[4px] border-rose-700 pl-6 py-2">{sys.cgpa}</span>
                          <Button size="lg" variant="outline" className="bg-transparent border-rose-600 text-white hover:bg-rose-600 uppercase font-semibold tracking-widest hidden lg:flex text-2xl py-8 px-6 border-[3px] rounded-xl">Trace</Button>
                       </div>
                    </div>
                  ))}
                </div>
             </div>
           </div>
        </Card>

         {/* 5. Trend Intelligence AND AI Insight Banner underneath */}
        <Card className="p-6 rounded-2xl border-2 border-slate-100 shadow-2xl bg-white">
            <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight mb-8 flex items-center gap-4 border-b-4 border-slate-50 pb-6">
              <History className="h-10 w-10 text-indigo-600" /> Trend Intelligence Matrix
            </h3>
            {/* AI Insight Embedded */}
            <div className="bg-indigo-50 border-l-[12px] border-indigo-500 p-6 rounded-r-[3rem] flex items-start md:items-center gap-5 shadow-sm">
              <div className="bg-indigo-100 p-4 rounded-full shrink-0">
                 <BrainCircuit className="h-8 w-8 text-indigo-600 animate-pulse" />
              </div>
              <div>
                <p className="font-semibold text-xl lg:text-2xl text-slate-900 uppercase tracking-tight mb-4">AI Interpretation Engine</p>
                <p className="font-semibold text-lg text-indigo-700 leading-tight">Platform heuristics indicate Academic Marks are actively dropping moving from Sem 4 → Sem 5. Urgent macro intervention pattern required to preserve placement threshold.</p>
              </div>
            </div>
        </Card>         {/* 6. AI Recommendation Engine & 7. Quick Action Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
           {/* Recommendation Engine */}
           <Card className="lg:col-span-7 p-6 rounded-2xl border-2 border-slate-100 shadow-2xl bg-white">
              <h3 className="text-lg font-bold text-slate-900 uppercase tracking-widest mb-8 flex items-center gap-3">
                <Stethoscope className="h-10 w-10 text-indigo-500" /> Prescriptive AI Logic
              </h3>
              <div className="space-y-4">
                 <div className="bg-slate-50 p-6 rounded-2xl border-2 border-slate-100 flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div>
                      <p className="font-semibold text-lg text-slate-800 uppercase">Start {data.placements.roles[0].name} Bridge</p>
                      <p className="font-bold text-slate-500 mt-2 text-lg">AI resolves the 35% targeted skill deficit mapped in Placements.</p>
                    </div>
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold uppercase shrink-0 h-10 px-4 text-xl shadow-lg border-none">Execute Plan</Button>
                 </div>
                 <div className="bg-slate-50 p-6 rounded-2xl border-2 border-slate-100 flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div>
                      <p className="font-semibold text-lg text-slate-800 uppercase">Schedule Mock Drive</p>
                      <p className="font-bold text-slate-500 mt-2 text-lg">Targets the {data.overview.risk_students} risk profile nodes instantly.</p>
                    </div>
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold uppercase shrink-0 h-10 px-4 text-xl shadow-lg border-none">Execute Plan</Button>
                 </div>
              </div>
           </Card>

           {/* Quick Actions Panel */}
           <Card className="lg:col-span-5 p-6 rounded-2xl border-2 border-slate-100 shadow-2xl bg-indigo-900 text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 p-5 opacity-20"><Zap className="h-10 w-10 text-indigo-400" /></div>
             <h3 className="text-lg font-bold text-indigo-300 uppercase tracking-widest mb-8 relative z-10 flex items-center gap-3">
               <Activity className="h-8 w-8"/> Quick Actions
             </h3>
             <div className="grid grid-cols-2 gap-4 relative z-10">
               <Button className="h-20 text-xl bg-white/10 hover:bg-white text-indigo-100 hover:text-indigo-900 font-semibold tracking-widest uppercase border-4 border-white/20 transition-all">Create Test</Button>
               <Button className="h-20 text-xl bg-white/10 hover:bg-white text-indigo-100 hover:text-indigo-900 font-semibold tracking-widest uppercase border-4 border-white/20 transition-all">Launch Intervene</Button>
               <Button className="h-20 text-xl bg-rose-500/20 hover:bg-rose-500 text-rose-100 hover:text-white font-semibold tracking-widest uppercase border-4 border-rose-500/50 transition-all">Notify Nodes</Button>
               <Button className="h-20 text-xl bg-white/10 hover:bg-white text-indigo-100 hover:text-indigo-900 font-semibold tracking-widest uppercase border-4 border-white/20 transition-all">Export Report</Button>
             </div>
           </Card>
        </div>         {/* 9. Upcoming Events & 10. Student Heatmap Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
           <Card className="p-6 rounded-2xl border-2 border-slate-100 shadow-2xl bg-white">
              <h3 className="text-lg font-bold text-slate-900 uppercase tracking-widest mb-8 flex items-center gap-3">
                <BellRing className="h-10 w-10 text-amber-500" /> Institutional Sync
              </h3>
              <div className="space-y-4">
                 <div className="flex gap-6 items-center border-b-4 border-slate-50 pb-6 pt-2">
                   <div className="bg-amber-100 h-12 w-12 flex flex-col items-center justify-center rounded-2xl shrink-0"><span className="text-base font-semibold text-amber-600">OCT</span><span className="text-xl font-bold text-amber-800 leading-none">14</span></div>
                   <div><p className="font-semibold text-lg text-slate-800 uppercase leading-none">{data.placements.upcoming_drives[0].company} Drive</p><p className="text-xl font-bold text-slate-400 mt-2 uppercase tracking-wider">Placements Vector</p></div>
                 </div>
                 <div className="flex gap-6 items-center pt-4">
                   <div className="bg-indigo-100 h-12 w-12 flex flex-col items-center justify-center rounded-2xl shrink-0"><span className="text-base font-semibold text-indigo-600">OCT</span><span className="text-xl font-bold text-indigo-800 leading-none">22</span></div>
                   <div><p className="font-semibold text-lg text-slate-800 uppercase leading-none">Internal Assessment</p><p className="text-xl font-bold text-slate-400 mt-2 uppercase tracking-wider">Academic Vector</p></div>
                 </div>
              </div>
           </Card>

           <Card className="p-6 rounded-2xl border-2 border-slate-100 shadow-2xl bg-white relative overflow-hidden flex flex-col">
              <div className="absolute top-0 right-0 p-5 opacity-5"><Layers className="h-12 w-12 text-slate-900" /></div>
              <h3 className="text-lg font-bold text-slate-900 uppercase tracking-widest mb-8 flex items-center gap-3 relative z-10 w-full">
                <Layers className="h-10 w-10 text-indigo-500" /> Density Heatmap
              </h3>
              <div className="space-y-6 relative z-10 grow flex flex-col justify-center">
                 <div>
                   <div className="flex justify-between font-semibold text-xl uppercase mb-2"><span className="text-emerald-600">Strong Core (8.0+)</span><span className="text-slate-800">45%</span></div>
                   <div className="w-full bg-slate-100 h-8 rounded-full overflow-hidden border-2 border-slate-200"><div className="bg-emerald-500 h-full w-[45%]"></div></div>
                 </div>
                 <div>
                   <div className="flex justify-between font-semibold text-xl uppercase mb-2"><span className="text-amber-600">Average Core (6.0 - 8.0)</span><span className="text-slate-800">42%</span></div>
                   <div className="w-full bg-slate-100 h-8 rounded-full overflow-hidden border-2 border-slate-200"><div className="bg-amber-500 h-full w-[42%]"></div></div>
                 </div>
                 <div>
                   <div className="flex justify-between font-semibold text-xl uppercase mb-2"><span className="text-rose-600">Weak Core (&lt;6.0)</span><span className="text-slate-800">13%</span></div>
                   <div className="w-full bg-slate-100 h-8 rounded-full overflow-hidden border-2 border-slate-200"><div className="bg-rose-500 h-full w-[13%]"></div></div>
                 </div>
              </div>
           </Card>
        </div>

      </div>
      )}

      {activeTab === 'academics' && (
      <div className="space-y-12">
        {/* 2. SUBJECT PERFORMANCE MATRIX */}
        <Card className="p-6 rounded-2xl border-2 border-slate-100 shadow-2xl bg-white overflow-hidden">
          <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight mb-8 border-b-4 border-slate-100 pb-6 flex items-center justify-between">
            <span className="flex items-center gap-4"><ClipboardList className="h-10 w-10 text-slate-700" /> Subject Performance Matrix</span>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input type="text" placeholder="Search subjects..." className="pl-12 pr-4 py-3 rounded-2xl bg-slate-100 border-none font-bold outline-none" />
            </div>
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-600 text-2xl uppercase tracking-widest font-semibold border-b-4 border-slate-100">
                  <th className="pb-8 pl-4">Subject Core</th>
                  <th className="pb-8 text-center">Avg Marks</th>
                  <th className="pb-8 text-center">Pass %</th>
                  <th className="pb-8 text-center">Difficulty Zone</th>
                  <th className="pb-8 text-right pr-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y-4 divide-slate-50">
                {data.subjects.map((sub: any, i: number) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors group">
                    <td className="py-8 pl-4 font-semibold text-lg text-slate-900">{sub.name}</td>
                    <td className="py-8 text-center font-semibold text-lg text-slate-800">{sub.avg}</td>
                    <td className="py-8 text-center">
                      <span className={`inline-flex px-5 py-2 rounded-lg font-semibold text-xl ${sub.pass > 85 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        {sub.pass}%
                      </span>
                    </td>
                    <td className="py-6 text-center">
                      <span className={`inline-flex px-5 py-2 rounded-lg font-semibold text-xl uppercase ${sub.difficulty === 'Critical' ? 'bg-rose-100 text-rose-700' : sub.difficulty === 'High' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'}`}>
                        {sub.difficulty}
                      </span>
                    </td>
                    <td className="py-6 text-right pr-4">
                      <Button variant="outline" className="rounded-xl border-4 font-semibold uppercase shadow-sm h-14 px-6 text-lg">
                        View Details <ChevronRight className="h-5 w-5 ml-2" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* 9. FACULTY IMPACT ANALYSIS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
           <Card className="p-6 rounded-2xl border-2 border-slate-100 shadow-xl bg-white">
              <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight mb-8">Faculty Analytics</h3>
              <div className="space-y-6">
                {data.faculty.map((f: any, i: number) => (
                  <div key={i} className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border-4 border-slate-100">
                    <div>
                      <p className="font-semibold text-2xl text-slate-900">{f.name}</p>
                      <p className="font-semibold text-lg text-slate-400 tracking-wider uppercase mt-1">{f.subject}</p>
                    </div>
                    <div className="h-10 w-10 bg-white border-2 border-indigo-100 rounded-[1.2rem] flex items-center justify-center font-semibold text-lg text-indigo-600 shadow-sm shrink-0">
                      {f.rating}
                    </div>
                  </div>
                ))}
              </div>
           </Card>
           
           {/* 10. BENCHMARK COMPARISON */}
           <Card className="p-6 rounded-2xl border-2 border-slate-100 shadow-xl bg-white">
              <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight mb-8">Benchmark vs Institution</h3>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={[
                    { metric: 'Academics', Dept: 80, Inst: 70 },
                    { metric: 'Placement', Dept: 65, Inst: 60 },
                    { metric: 'Attendance', Dept: 70, Inst: 80 },
                    { metric: 'Skills', Dept: 60, Inst: 55 },
                    { metric: 'Research', Dept: 85, Inst: 65 }
                  ]}>
                    <PolarGrid stroke="#e2e8f0" strokeWidth={2} />
                    <PolarAngleAxis dataKey="metric" tick={{fill: '#475569', fontWeight: 900, fontSize: 16}} />
                    <Tooltip contentStyle={{ borderRadius: '1rem', border: '5px solid #f1f5f9', fontWeight: '900', color: '#0f172a' }} />
                    <Radar name="This Dept" dataKey="Dept" stroke="#4F46E5" strokeWidth={3} fill="#4F46E5" fillOpacity={0.4} />
                    <Radar name="Institution" dataKey="Inst" stroke="#cbd5e1" strokeWidth={3} fill="#cbd5e1" fillOpacity={0.4} />
                    <Legend wrapperStyle={{ fontWeight: 900, fontSize: 18 }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
           </Card>
        </div>
      </div>
      )}

      {activeTab === 'placements' && (
      <div className="space-y-12">
         {/* 1. Placement Funnel & 2. Role Distribution */}
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <Card className="p-6 lg:p-8 rounded-[2rem] border-0 shadow-[0_20px_50px_rgba(225,29,72,0.08)] bg-gradient-to-br from-white to-rose-50/30">
               <div className="flex justify-between items-center mb-10 border-b border-rose-100/50 pb-6">
                 <h3 className="text-xl font-black text-rose-950 uppercase tracking-tighter flex items-center gap-3">
                   <div className="p-3 bg-rose-100 text-rose-600 rounded-xl">
                     <AlertTriangle className="h-6 w-6" strokeWidth={3} />
                   </div>
                   Department Placement Risk Timeline
                 </h3>
                 <span className="px-4 py-2 bg-rose-600 text-white text-xs font-black rounded-lg uppercase tracking-widest shadow-lg shadow-rose-200">Yearly</span>
               </div>
               
               <div className="h-[280px] w-full">
                 <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={[
                     { year: "2023", risk: 14.5 },
                     { year: "2024", risk: 11.2 },
                     { year: "2025", risk: 16.8 },
                     { year: "2026", risk: data.overview?.risk_students > 30 ? 25.4 : (data.overview?.risk_students || 15.2) }
                   ]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                     <defs>
                       <linearGradient id="colorRiskDetail" x1="0" y1="0" x2="0" y2="1">
                         <stop offset="5%" stopColor="#e11d48" stopOpacity={0.6}/>
                         <stop offset="95%" stopColor="#e11d48" stopOpacity={0.0}/>
                       </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="#ffe4e6" />
                     <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: '#fda4af', fontWeight: 900, fontSize: 14 }} dy={10} />
                     <YAxis axisLine={false} tickLine={false} tick={{ fill: '#fda4af', fontWeight: 900, fontSize: 13 }} />
                     <Tooltip 
                       contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 20px 40px -5px rgba(225,29,72,0.2)', backgroundColor: '#fff', padding: '1rem 1.5rem' }}
                       labelStyle={{ color: '#881337', fontWeight: 900, fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '4px' }}
                       itemStyle={{ fontWeight: 900, color: '#e11d48', fontSize: '1.2rem' }}
                       cursor={{ stroke: '#f43f5e', strokeWidth: 2, strokeDasharray: '3 3' }}
                     />
                     <Area 
                       type="monotone" 
                       dataKey="risk" 
                       stroke="#e11d48" 
                       strokeWidth={6} 
                       fill="url(#colorRiskDetail)" 
                       name="Risk Index"
                       activeDot={{ r: 8, strokeWidth: 4, stroke: '#fff', fill: '#e11d48', style: {filter: 'drop-shadow(0px 4px 6px rgba(225,29,72,0.5))'} }}
                     />
                   </AreaChart>
                 </ResponsiveContainer>
               </div>
            </Card>

            <Card className="p-6 rounded-2xl border-2 border-slate-100 shadow-2xl bg-white">
               <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight mb-8 flex items-center gap-3">
                 <Briefcase className="h-10 w-10 text-indigo-500" /> Sector Allocation
               </h3>
               <div className="h-[250px]">
                 <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                     <Pie data={data.placements.roles} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value" label={({name}) => name} labelLine={false} style={{fontWeight: 900, fontSize: 12}}>
                       {data.placements.roles.map((_: any, i: number) => <Cell key={i} fill={['#4F46E5', '#10B981', '#F59E0B', '#64748B'][i % 4]} />)}
                     </Pie>
                     <Tooltip contentStyle={{ borderRadius: '1rem', border: '5px solid #f1f5f9', fontWeight: '900' }} />
                   </PieChart>
                 </ResponsiveContainer>
               </div>
            </Card>
         </div>

         {/* 3. Company Match Engine & 4. Mock Interview Tracker */}
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <Card className="p-6 rounded-2xl border-2 border-indigo-100 bg-indigo-50 shadow-xl">
               <div className="flex justify-between items-center mb-6">
                 <h3 className="text-lg font-bold text-indigo-900 uppercase tracking-tight flex items-center gap-3">
                   <Crosshair className="h-10 w-10 text-indigo-600" /> AI Company Matcher
                 </h3>
                 <Button className="font-semibold uppercase rounded-xl bg-indigo-600 hover:bg-indigo-700 h-14 text-xl shadow-md border-none text-white px-8">Run AI Match</Button>
               </div>
               <div className="space-y-4">
                 {data.placements.company_matcher.map((match: any, i: number) => (
                   <div key={i} className="flex justify-between items-center bg-white p-6 rounded-2xl border-4 border-indigo-100 shadow-sm">
                     <p className="font-semibold text-2xl text-slate-900 uppercase">{match.student}</p>
                     <div className="flex items-center gap-6">
                       <span className="px-5 py-2 bg-slate-100 text-slate-700 rounded-lg font-semibold text-lg uppercase"><Building className="h-5 w-5 inline mr-2"/> {match.fit}</span>
                       <span className="text-xl font-bold text-indigo-600">{match.matchScore}% Match</span>
                     </div>
                   </div>
                 ))}
               </div>
            </Card>

            <Card className="p-6 rounded-2xl border-2 border-amber-100 bg-amber-50 shadow-xl">
               <h3 className="text-lg font-bold text-amber-900 uppercase tracking-tight mb-6 flex items-center gap-3">
                 <CheckCircle className="h-10 w-10 text-amber-600" /> Mock Interview Telemetry
               </h3>
               <div className="space-y-4">
                 {data.placements.mock_interviews.map((mock: any, i: number) => (
                   <div key={i} className="flex justify-between items-center bg-white p-6 rounded-2xl border-4 border-amber-100 shadow-sm">
                     <p className="font-semibold text-2xl text-slate-900 uppercase">{mock.name}</p>
                     <div className="flex items-center gap-6">
                       <span className={`px-5 py-2 rounded-lg font-semibold text-sm uppercase ${mock.status === 'Ready' ? 'bg-emerald-100 text-emerald-700' : mock.status === 'Critical' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-700'}`}>{mock.status}</span>
                       <span className="text-xl font-bold text-amber-600 border-l-4 border-amber-50 pl-6">{mock.score}/10</span>
                     </div>
                   </div>
                 ))}
               </div>
            </Card>
         </div>

         {/* 5. Package Analysis & 6. Upcoming Drives Panel */}
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <Card className="lg:col-span-8 p-6 rounded-2xl border-2 border-slate-100 bg-white shadow-2xl">
               <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight mb-8 flex items-center gap-3">
                 <Banknote className="h-10 w-10 text-emerald-500" /> Package Distribution
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                 <div className="bg-emerald-50 p-5 rounded-xl border-4 border-emerald-100 flex flex-col items-center justify-center">
                    <p className="text-2xl font-semibold text-emerald-600 uppercase">Highest CTC</p>
                    <p className="text-3xl font-semibold text-emerald-800 tracking-tighter mt-2">{data.placements.packages.highest} LPA</p>
                 </div>
                 <div className="bg-slate-50 p-5 rounded-xl border-4 border-slate-100 flex flex-col items-center justify-center">
                    <p className="text-2xl font-semibold text-slate-500 uppercase">Average CTC</p>
                    <p className="text-3xl font-semibold text-slate-800 tracking-tighter mt-2">{data.placements.packages.average} LPA</p>
                 </div>
               </div>
               <div className="space-y-4">
                 {data.placements.packages.companies.map((comp: any, i: number) => (
                   <div key={i} className="flex justify-between items-center p-5 border-b-4 border-slate-50">
                      <p className="font-semibold text-lg text-slate-700 uppercase">{comp.name}</p>
                      <div className="flex items-center gap-5">
                        <span className="font-semibold text-xl text-slate-400 uppercase">{comp.hires} Recruits</span>
                        <span className="font-semibold text-xl text-emerald-600">{comp.ctc} LPA</span>
                      </div>
                   </div>
                 ))}
               </div>
            </Card>

            <Card className="lg:col-span-4 p-6 rounded-2xl border-2 border-slate-100 bg-slate-900 text-white shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-5 opacity-10 pointer-events-none text-emerald-400">
                  <CalendarCheck className="h-10 w-10" />
               </div>
               <h3 className="text-lg font-bold text-emerald-400 uppercase tracking-tight mb-8 flex items-center gap-3 relative z-10">
                 <CalendarCheck className="h-10 w-10" /> Upcoming Drives
               </h3>
               <div className="space-y-6 relative z-10">
                 {data.placements.upcoming_drives.map((drive: any, i: number) => (
                   <div key={i} className="bg-slate-800 p-6 rounded-2xl border-l-[8px] border-emerald-500 shadow-md">
                     <div className="flex justify-between items-start mb-3">
                       <p className="font-semibold text-lg text-white uppercase leading-none">{drive.company}</p>
                       <span className="bg-emerald-950 text-emerald-400 text-sm font-semibold px-3 py-1.5 rounded-lg uppercase tracking-widest">{drive.date}</span>
                     </div>
                     <p className="font-semibold text-xl text-slate-400 uppercase">{drive.role}</p>
                     <Button className="w-full mt-6 h-14 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold text-xl uppercase shadow-lg border-none">Notify {drive.eligible} Eligible</Button>
                   </div>
                 ))}
               </div>
            </Card>
         </div>

         {/* 7. Non-Eligible Student Tracker & Bridge Panel */}
         <Card className="p-6 rounded-2xl border-2 border-rose-100 bg-white shadow-2xl">
            <h3 className="text-lg font-bold text-rose-600 uppercase tracking-tight mb-8 flex items-center gap-3 border-b-4 border-rose-50 pb-6">
              <ShieldAlert className="h-10 w-10 text-rose-500" /> Non-Eligible Tracker & AI Bridge Solutions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {data.placements.non_eligible_reasons.map((reason: any, i: number) => (
                <div key={i} className="bg-rose-50 p-6 rounded-xl border-4 border-rose-100 relative pt-12">
                   <div className="absolute top-0 inset-x-0 h-10 bg-rose-200 text-rose-800 font-semibold flex items-center justify-center uppercase tracking-widest text-sm rounded-t-[1.7rem]">
                      {reason.count} Students Flagged
                   </div>
                   <p className="font-semibold text-2xl text-rose-900 uppercase text-center mt-2">{reason.reason}</p>
                   <Button variant="outline" className="w-full mt-6 border-4 border-rose-200 text-rose-600 hover:bg-rose-600 hover:text-white font-semibold uppercase">Launch Auto-Tutor</Button>
                </div>
              ))}
            </div>
         </Card>

      </div>
      )}

      {activeTab === 'interventions' && (
      <div className="space-y-12">
        {/* 3. CRITICAL STUDENT ZONE */}
        <Card className="p-6 rounded-2xl border-2 border-rose-100 shadow-2xl bg-white overflow-hidden relative">
           <div className="absolute top-0 right-0 p-5 h-full opacity-[0.03] pointer-events-none">
             <ShieldAlert className="h-full w-full" />
           </div>
           <h3 className="text-lg font-bold text-rose-600 uppercase tracking-tight mb-8">
             Critical Action Zone (Threshold Breach)
           </h3>
           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
             {data.critical_students.map((sys: any, i: number) => (
               <div key={i} className="bg-white p-6 rounded-3xl border-2 border-slate-100 shadow-lg relative pt-12">
                 <div className="absolute top-0 inset-x-0 h-10 bg-rose-50 border-b-4 border-rose-100 flex items-center justify-center">
                    <span className="text-sm font-semibold text-rose-600 tracking-widest uppercase animate-pulse">{sys.issue}</span>
                 </div>
                 <div className="flex justify-between items-start mt-4 mb-6">
                    <div>
                      <p className="text-2xl font-semibold text-slate-900">{sys.name}</p>
                      <p className="text-sm font-bold text-slate-400">{sys.id}</p>
                    </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-slate-50 p-3 rounded-xl border-2 border-slate-100 text-center">
                       <p className="text-2xl font-semibold text-slate-800">{sys.cgpa}</p>
                       <p className="text-[10px] font-bold text-slate-400 uppercase">CGPA</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border-2 border-slate-100 text-center">
                       <p className="text-2xl font-semibold text-slate-800">{sys.attendance}%</p>
                       <p className="text-[10px] font-bold text-slate-400 uppercase">Attended</p>
                    </div>
                 </div>
                 <div className="flex flex-col gap-3">
                   <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold uppercase rounded-xl shadow-md">
                     Assign Mentor
                   </Button>
                   <Button variant="outline" className="w-full font-semibold uppercase rounded-xl border-2 hover:bg-rose-50 hover:text-rose-600">
                     Halt Access
                   </Button>
                 </div>
               </div>
             ))}
           </div>
        </Card>

        {/* 8. INTERVENTION CONTROL PANEL */}
        <Card className="p-6 rounded-2xl border-2 border-slate-100 shadow-2xl bg-white overflow-hidden">
           <h3 className="text-2xl font-semibold text-slate-900 uppercase tracking-tight mb-8 border-b-4 border-slate-100 pb-6 flex items-center gap-3">
             <ShieldAlert className="h-8 w-8 text-indigo-600" /> Active Intervention Logs
           </h3>
           <div className="space-y-4">
             {data.interventions.map((log: any, i: number) => (
               <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-slate-50 rounded-2xl border-4 border-slate-100">
                 <div className="flex items-center gap-6 mb-4 md:mb-0">
                   <div className={`h-10 w-10 rounded-2xl flex items-center justify-center border-4 ${log.status === 'Active' ? 'bg-emerald-100 border-emerald-200 text-emerald-600' : 'bg-amber-100 border-amber-200 text-amber-600'}`}>
                     {log.status === 'Active' ? <CheckCircle2 className="h-8 w-8" /> : <Activity className="h-8 w-8" />}
                   </div>
                   <div>
                     <p className="text-xl font-semibold text-slate-900 uppercase">{log.type}</p>
                     <p className="text-slate-500 font-bold">Target: <span className="text-slate-900">{log.student}</span> | Tracker: {log.id}</p>
                   </div>
                 </div>
                 <Button variant="outline" className="rounded-xl border-4 font-semibold uppercase">
                   Manage Node
                 </Button>
               </div>
             ))}
           </div>
        </Card>
      </div>
      )}

    </div>
  );
}
