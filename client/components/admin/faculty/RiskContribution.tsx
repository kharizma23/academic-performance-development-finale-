"use client";
import React, { useState, useEffect } from "react";
import { ShieldAlert, Users, TrendingDown, Bell, BookOpen, AlertTriangle, Activity, Sparkles, X, ChevronLeft, AlertCircle, RefreshCw, Send, Calendar, Download, GitCompare } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell, PieChart, Pie, LineChart, Line, Legend } from "recharts";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Props {
  riskData: any[];
  onSelectFaculty?: (id: string) => void;
}

export default function RiskContribution({ riskData, onSelectFaculty }: Props) {
  const [selectedFacultyId, setSelectedFacultyId] = useState<string | null>(null);
  const [facultyDetails, setFacultyDetails] = useState<any>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [aiInsights, setAiInsights] = useState<any>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [drilldownFilter, setDrilldownFilter] = useState("ALL");
  const [compareId1, setCompareId1] = useState("");
  const [compareId2, setCompareId2] = useState("");

  const getApiUrl = (path: string) => {
    const hostname = typeof window !== 'undefined' ? window.location.hostname : '127.0.0.1';
    return `http://${hostname}:8001/api${path}`;
  };

  // Mock enrichment if the backend doesn't provide enough riskData format
  const enhancedRiskData = riskData.length > 0 ? riskData : [
    { id: "F1", name: "Deepika Gupta", risk_students: 18, risk_score: 85, department: "CSE", subjects: ["CS101", "CS201"] },
    { id: "F2", name: "Varun Aggarwal", risk_students: 15, risk_score: 72, department: "ECE", subjects: ["EC301"] },
    { id: "F3", name: "Kala Gupta", risk_students: 12, risk_score: 64, department: "IT", subjects: ["IT402"] },
    { id: "F4", name: "Jaya Gupta", risk_students: 10, risk_score: 55, department: "MECH", subjects: ["ME101"] },
    { id: "F5", name: "Yamini Chettiar", risk_students: 6, risk_score: 40, department: "CSE", subjects: ["CS305"] }
  ];

  const totalAtRisk = enhancedRiskData.reduce((acc, curr) => acc + (curr.risk_students || 0), 0);
  const maxRisk = Math.max(...enhancedRiskData.map(r => r.risk_students), 1);
  const highRiskDepts = ["CSE", "ECE"]; // Can be derived

  // Fetch AI Insights
  const fetchAiAnalysis = async () => {
    setAiLoading(true);
    try {
      const res = await fetch(getApiUrl('/ai/risk-analysis'), { method: 'POST' });
      if (res.ok) {
        setAiInsights(await res.json());
      } else {
        throw new Error("Failed");
      }
    } catch {
      setAiInsights({
        summary: "Systemic risk identified in 2nd Year CSE modules due to recent curriculum upgrades.",
        causes: ["Low attendance correlation in remote lectures", "Complex subject material in CS201"],
        actions: ["Mandatory Mentoring Hub", "Deploy remedial bridge courses"]
      });
    } finally {
      setAiLoading(false);
    }
  };

  useEffect(() => {
    fetchAiAnalysis();
  }, []);

  // Fetch drilldown details
  const fetchDetails = async (id: string) => {
    setSelectedFacultyId(id);
    setDetailLoading(true);
    try {
      const res = await fetch(getApiUrl(`/risk/faculty/${id}`));
      if (res.ok) {
        setFacultyDetails(await res.json());
      } else {
         throw new Error("Failed");
      }
    } catch {
      setTimeout(() => {
         setFacultyDetails({
           id,
           name: enhancedRiskData.find(f => f.id === id)?.name || "Faculty",
           marks_avg: 45,
           attendance_avg: 68,
           reasons: [
             { name: "Low Marks", value: 40 },
             { name: "Low Attendance", value: 30 },
             { name: "Subject Difficulty", value: 30 }
           ],
           students: [
             { id: "S1", name: "Rahul S", marks: 34, attendance: 55, risk: "High" },
             { id: "S2", name: "Anita V", marks: 56, attendance: 60, risk: "Medium" },
             { id: "S3", name: "Vikas K", marks: 44, attendance: 75, risk: "High" },
             { id: "S4", name: "Priya M", marks: 72, attendance: 85, risk: "Low" },
             { id: "S5", name: "Arjun D", marks: 28, attendance: 40, risk: "High" }
           ]
         });
         setDetailLoading(false);
      }, 600);
    }
  };

  // Generic Action
  const performAction = (action: string) => {
    toast.success(`${action} sequence initiated.`, { icon: <ShieldAlert className="text-emerald-500 h-4 w-4" />});
  };

  const trendData = [
    { name: "Wk 1", risk: 45 },
    { name: "Wk 2", risk: 52 },
    { name: "Wk 3", risk: 48 },
    { name: "Wk 4", risk: 61 },
    { name: "Wk 5", risk: 58 },
  ];

  /* ------------------------------------------------------------------------
     DRILLDOWN VIEW
  ------------------------------------------------------------------------ */
  if (selectedFacultyId && facultyDetails) {
    const filteredStudents = drilldownFilter === "ALL" 
        ? facultyDetails.students 
        : facultyDetails.students.filter((s:any) => s.risk.toUpperCase() === drilldownFilter.toUpperCase());

    return (
      <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-4">
             <Button variant="outline" size="sm" onClick={() => setSelectedFacultyId(null)} className="h-8 shadow-sm">
                <ChevronLeft className="h-4 w-4 mr-1" /> Back to Matrix
             </Button>
             <div>
               <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                 Risk Drilldown: <span className="text-rose-600">{facultyDetails.name}</span>
               </h2>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">Analyzing root causes and student impact</p>
             </div>
          </div>
          {/* Action Center - Feature 9 */}
          <div className="flex gap-2">
             <Button onClick={() => performAction("Extra Class Assignment")} size="sm" className="h-8 bg-indigo-600 hover:bg-indigo-700 text-[9px] font-black uppercase tracking-widest">
               <Calendar className="h-3 w-3 mr-1.5" /> Assign Extra Class
             </Button>
             <Button onClick={() => performAction("Faculty Notification")} size="sm" className="h-8 bg-rose-600 hover:bg-rose-700 text-[9px] font-black uppercase tracking-widest">
               <Bell className="h-3 w-3 mr-1.5" /> Notify Faculty
             </Button>
             <Button variant="outline" onClick={() => performAction("Report Gen")} size="sm" className="h-8 text-[9px] font-black uppercase tracking-widest">
               <Download className="h-3 w-3 mr-1.5" /> Report
             </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           {/* Faculty Risk Breakdown - Feature 4 */}
           <Card className="p-5 rounded-xl border border-slate-100 bg-white shadow-sm flex flex-col">
              <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2 mb-4">
                <AlertCircle className="h-4 w-4 text-rose-500" /> Root Cause Breakdown
              </h3>
              <div className="flex-1 flex flex-col items-center justify-center">
                 <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                         <Pie data={facultyDetails.reasons} innerRadius="60%" outerRadius="80%" paddingAngle={5} dataKey="value" stroke="none">
                           {facultyDetails.reasons.map((r:any, i:number) => (
                             <Cell key={i} fill={i === 0 ? "#EF4444" : i === 1 ? "#F59E0B" : "#8B5CF6"} />
                           ))}
                         </Pie>
                         <Tooltip contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)", fontSize: "10px" }} />
                      </PieChart>
                    </ResponsiveContainer>
                 </div>
                 <div className="grid grid-cols-3 gap-2 w-full mt-2">
                    {facultyDetails.reasons.map((r:any, i:number) => (
                      <div key={i} className="text-center">
                         <div className={cn("h-2 w-2 rounded-full mx-auto mb-1", i === 0 ? "bg-rose-500" : i === 1 ? "bg-amber-500" : "bg-purple-500")} />
                         <p className="text-[7px] font-black uppercase tracking-tighter text-slate-500">{r.name}</p>
                         <p className="text-lg font-black text-slate-900 leading-none">{r.value}%</p>
                      </div>
                    ))}
                 </div>
              </div>
           </Card>

           {/* Metrics Overview */}
           <div className="space-y-4">
              <Card className="p-5 rounded-xl bg-slate-50 border border-slate-100 shadow-sm flex items-center gap-4">
                 <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600">
                    <TrendingDown className="h-6 w-6" />
                 </div>
                 <div>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Average Marks</h4>
                    <p className="text-3xl font-black text-slate-900 leading-none">{facultyDetails.marks_avg}%</p>
                 </div>
              </Card>
              <Card className="p-5 rounded-xl bg-slate-50 border border-slate-100 shadow-sm flex items-center gap-4">
                 <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
                    <Activity className="h-6 w-6" />
                 </div>
                 <div>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Attendance Avg</h4>
                    <p className="text-3xl font-black text-slate-900 leading-none">{facultyDetails.attendance_avg}%</p>
                 </div>
              </Card>
           </div>

           {/* AI Insight Mini */}
           <Card className="p-5 bg-indigo-600 border border-indigo-500 rounded-xl text-white shadow-lg shadow-indigo-100">
             <h3 className="text-[10px] font-black text-indigo-200 uppercase tracking-widest flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-emerald-300" /> Contextual AI Insight
             </h3>
             <p className="text-xs font-bold leading-relaxed opacity-90 mb-4">
               "{facultyDetails.name}'s risk vector is largely driven by low marks. Recommend rapid deployment of remedial assessments and bridging material focusing on core fundamentals."
             </p>
             <Button size="sm" onClick={() => performAction("Mentoring Scheduler")} className="w-full bg-white text-indigo-600 hover:bg-slate-50 font-black text-[9px] uppercase tracking-widest">
                Schedule Mentoring
             </Button>
           </Card>
        </div>

        {/* Student Drilldown - Feature 5 */}
        <Card className="bg-white border border-slate-100 rounded-xl shadow-sm overflow-hidden">
           <div className="p-4 border-b border-slate-50 flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-50/50">
             <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
               <Users className="h-4 w-4 text-emerald-600" /> Impacted Students ({filteredStudents.length})
             </h3>
             <div className="flex gap-2 bg-white border border-slate-200 p-1 rounded-lg">
                {["ALL", "HIGH", "MEDIUM", "LOW"].map(f => (
                   <button 
                     key={f} 
                     onClick={() => setDrilldownFilter(f)}
                     className={cn("px-3 py-1 rounded text-[8px] font-black uppercase tracking-widest transition-all", drilldownFilter === f ? "bg-slate-900 text-white" : "text-slate-500 hover:bg-slate-50")}
                   >
                     {f}
                   </button>
                ))}
             </div>
           </div>
           <div className="overflow-x-auto">
             <table className="w-full text-left">
               <thead className="bg-white border-b border-slate-100">
                 <tr className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                   <th className="p-4">Student</th>
                   <th className="p-4">Marks Extracted</th>
                   <th className="p-4">Attendance Node</th>
                   <th className="p-4 text-right">Risk Level</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                 {filteredStudents.map((s:any) => (
                   <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                     <td className="p-4">
                       <p className="text-xs font-black text-slate-900 uppercase">{s.name}</p>
                       <p className="text-[8px] font-bold text-slate-400">{s.id}</p>
                     </td>
                     <td className="p-4">
                       <div className="flex items-center gap-2">
                          <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                             <div className={cn("h-full", s.marks < 40 ? "bg-rose-500" : "bg-emerald-500")} style={{width: `${Math.min(s.marks,100)}%`}}></div>
                          </div>
                          <span className={cn("text-[10px] font-black", s.marks < 40 ? "text-rose-600" : "text-slate-900")}>{s.marks}%</span>
                       </div>
                     </td>
                     <td className="p-4">
                       <div className="flex items-center gap-2">
                          <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                             <div className={cn("h-full", s.attendance < 60 ? "bg-amber-500" : "bg-blue-500")} style={{width: `${Math.min(s.attendance,100)}%`}}></div>
                          </div>
                          <span className={cn("text-[10px] font-black", s.attendance < 60 ? "text-amber-600" : "text-slate-900")}>{s.attendance}%</span>
                       </div>
                     </td>
                     <td className="p-4 text-right">
                       <span className={cn(
                         "px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest border",
                         s.risk === 'High' ? "bg-rose-50 text-rose-600 border-rose-200" : 
                         s.risk === 'Medium' ? "bg-amber-50 text-amber-600 border-amber-200" : 
                         "bg-emerald-50 text-emerald-600 border-emerald-200"
                       )}>
                         {s.risk} Priority
                       </span>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </Card>
      </div>
    );
  }

  /* ------------------------------------------------------------------------
     MAIN OVERVIEW MODULE
  ------------------------------------------------------------------------ */
  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* 1. Top Summary Bar with Badges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         <Card className="bg-rose-50 border border-rose-100 p-5 rounded-xl shadow-sm flex items-center gap-4">
           <div className="h-10 w-10 bg-rose-100 rounded-lg flex items-center justify-center text-rose-600 shrink-0">
             <AlertTriangle className="h-5 w-5" />
           </div>
           <div>
             <p className="text-[10px] font-black uppercase tracking-widest text-rose-400">Total At-Risk</p>
             <div className="flex items-baseline gap-2">
               <p className="text-2xl font-black text-rose-600 leading-none mt-1">{totalAtRisk}</p>
               <span className="text-[8px] font-black bg-rose-600 text-white px-1.5 py-0.5 rounded uppercase">Critical</span>
             </div>
           </div>
         </Card>
         <Card className="bg-white border border-slate-100 p-5 rounded-xl shadow-sm flex items-center gap-4">
           <div className="h-10 w-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 shrink-0">
             <Users className="h-5 w-5" />
           </div>
           <div>
             <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Faculty Nodes</p>
             <div className="flex items-baseline gap-2">
               <p className="text-2xl font-black text-slate-900 leading-none mt-1">{enhancedRiskData.length}</p>
               <span className="text-[8px] font-black bg-emerald-100 border border-emerald-200 text-emerald-700 px-1.5 py-0.5 rounded uppercase">Active</span>
             </div>
           </div>
         </Card>
         <Card className="bg-indigo-50 border border-indigo-100 p-5 rounded-xl shadow-sm flex items-center gap-4">
           <div className="h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 shrink-0">
             <BookOpen className="h-5 w-5" />
           </div>
           <div>
             <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400">High Risk Depts</p>
             <div className="flex flex-wrap gap-1 mt-1">
               {highRiskDepts.map(d => (
                 <span key={d} className="text-[9px] font-black bg-indigo-600 text-white px-2 py-0.5 rounded uppercase">{d}</span>
               ))}
             </div>
           </div>
         </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* 2. At-Risk Volume Hub */}
        <Card className="xl:col-span-8 bg-white border border-slate-100 rounded-xl p-5 shadow-sm">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-900 mb-6 flex items-center gap-2">
            <TrendingDown className="h-4 w-4 text-rose-500" /> At-Risk Volume Hub
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={enhancedRiskData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 9, fontWeight: "bold", fill: "#64748b" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fontWeight: "bold", fill: "#64748b" }} axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{ fill: 'rgba(241, 245, 249, 0.5)' }}
                  contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: '10px', fontWeight: 'bold' }} 
                />
                <Bar 
                  dataKey="risk_students" 
                  radius={[4, 4, 0, 0]} 
                  barSize={40}
                  onClick={(data) => fetchDetails(data.id)}
                  className="cursor-pointer transition-all hover:opacity-80"
                >
                  {enhancedRiskData.map((r, i) => (
                    <Cell key={i} fill={r.risk_students >= 15 ? "#EF4444" : r.risk_students >= 10 ? "#F59E0B" : "#10B981"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[8px] font-bold text-slate-400 mt-2 text-center uppercase tracking-widest">* Click on a bar to drill down into faculty metrics</p>
        </Card>

        {/* 3. Priority Leaderboard */}
        <Card className="xl:col-span-4 bg-white border border-slate-100 rounded-xl p-5 shadow-sm overflow-hidden flex flex-col">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-900 mb-4 flex items-center gap-2">
            <Users className="h-4 w-4 text-indigo-600" /> Priority Leaderboard
          </h3>
          <div className="space-y-3 flex-1 overflow-y-auto pr-1 no-scrollbar min-h-0">
            {[...enhancedRiskData].sort((a,b) => b.risk_score - a.risk_score).map((r, i) => {
              const color = i === 0 ? "bg-rose-500" : i < 3 ? "bg-amber-500" : "bg-emerald-500";
              const textColor = i === 0 ? "text-rose-600" : i < 3 ? "text-amber-600" : "text-emerald-600";
              return (
                <div
                  key={r.id}
                  className="p-3 bg-slate-50 rounded-lg hover:border-slate-300 border border-slate-100 cursor-pointer transition-all group"
                  onClick={() => fetchDetails(r.id)}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={cn("h-6 w-6 rounded flex items-center justify-center text-[10px] font-black text-white shrink-0", color)}>
                      #{i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-slate-900 text-[10px] uppercase truncate">{r.name}</p>
                      <p className="text-[8px] font-bold tracking-widest text-slate-400">{r.department}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className={cn("text-sm font-black", textColor)}>{r.risk_score}</p>
                      <p className="text-[7px] text-slate-400 font-bold uppercase tracking-tighter">Risk Score</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                     <div className="flex-1 h-1 bg-slate-200 rounded-full overflow-hidden">
                       <div className={cn("h-full transition-all duration-700", color)} style={{ width: `${Math.min(r.risk_score, 100)}%` }} />
                     </div>
                     <span className="text-[8px] font-black text-slate-500">{r.risk_students} Stds</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 6. Risk Heatmap / Matrix */}
        <Card className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-900 mb-6 flex items-center gap-2">
            <Activity className="h-4 w-4 text-emerald-600" /> Dept Risk Heatmap
          </h3>
          <div className="space-y-4">
             {["CSE", "ECE", "IT", "MECH"].map(dept => {
                const fInDept = enhancedRiskData.filter(f => f.department === dept);
                const avgRisk = fInDept.length > 0 ? fInDept.reduce((a,b)=>a+b.risk_score, 0)/fInDept.length : Math.random() * 60 + 20;
                return (
                  <div key={dept} className="flex items-center gap-3">
                     <p className="w-10 flex-shrink-0 text-[10px] font-black uppercase text-slate-600">{dept}</p>
                     <div className="flex-1 grid grid-cols-5 gap-1">
                        {[1,2,3,4,5].map(cell => {
                           const intensity = Math.min((avgRisk / 20) * cell, 100);
                           return (
                             <div 
                               key={cell} 
                               className="h-8 rounded"
                               style={{ backgroundColor: `rgb(${255}, ${200 - intensity*1.5}, ${200 - intensity*1.5})`}}
                             />
                           )
                        })}
                     </div>
                     <span className="w-8 text-right text-[10px] font-black text-slate-900">{Math.round(avgRisk)}%</span>
                  </div>
                )
             })}
          </div>
        </Card>

        {/* 7. Time Trend Analysis */}
        <Card className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm">
           <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-900 mb-6 flex items-center gap-2">
             <Activity className="h-4 w-4 text-blue-500" /> Institution Risk Trend
           </h3>
           <div className="h-48">
             <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="name" tick={{fontSize: 9, fontWeight: "bold", fill: "#64748b"}} axisLine={false} tickLine={false} />
                  <YAxis tick={{fontSize: 9, fontWeight: "bold", fill: "#64748b"}} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: '10px' }} />
                  <Line type="monotone" dataKey="risk" stroke="#3B82F6" strokeWidth={3} dot={{r: 4, fill: "#3B82F6", strokeWidth: 2, stroke: "#fff"}} />
                </LineChart>
             </ResponsiveContainer>
           </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 8. AI Insight Panel */}
        <Card className="p-6 rounded-xl bg-indigo-600 border border-indigo-500 text-white shadow-lg shadow-indigo-100 relative overflow-hidden group">
           {window.location.hostname !== 'localhost' && <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500 rounded-full blur-3xl group-hover:bg-rose-500 transition-colors duration-1000" />}
           <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center justify-between mb-4">
                 <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-emerald-300" /> Neural Risk Analysis
                 </h3>
                 {aiLoading && <RefreshCw className="h-4 w-4 animate-spin text-indigo-300" />}
              </div>
              <div className="space-y-4 flex-1">
                 <p className="text-sm font-bold opacity-90 leading-relaxed border-l-2 border-indigo-400 pl-3">
                    {aiInsights ? aiInsights.summary : "Analyzing institutional risk patterns..."}
                 </p>
                 {aiInsights && (
                   <div className="space-y-3 pt-3">
                     <div>
                       <p className="text-[8px] font-black text-indigo-200 uppercase tracking-widest mb-1.5">Root Causes Identified</p>
                       <ul className="space-y-1">
                         {aiInsights.causes.map((c:string, i:number) => (
                           <li key={i} className="text-[10px] font-bold bg-indigo-500/20 px-2 py-1 rounded border border-indigo-400/20 flex gap-2"><AlertTriangle className="h-3 w-3 text-amber-300 shrink-0" /> {c}</li>
                         ))}
                       </ul>
                     </div>
                     <div>
                       <p className="text-[8px] font-black text-indigo-200 uppercase tracking-widest mb-1.5">Automated Suggestions</p>
                       <ul className="space-y-1">
                         {aiInsights.actions.map((c:string, i:number) => (
                           <li key={i} className="text-[10px] font-bold bg-emerald-500/10 px-2 py-1 rounded border border-emerald-400/20 flex gap-2"><Send className="h-3 w-3 text-emerald-300 shrink-0" /> {c}</li>
                         ))}
                       </ul>
                     </div>
                   </div>
                 )}
              </div>
              <Button onClick={fetchAiAnalysis} disabled={aiLoading} className="w-full mt-4 bg-white text-indigo-600 hover:bg-slate-50 font-black text-[9px] h-9 uppercase tracking-widest transition-all">
                {aiLoading ? "Processing..." : "Force Re-Scan"}
              </Button>
           </div>
        </Card>

        {/* 10. Compare Faculty Component */}
        <Card className="p-6 rounded-xl bg-white border border-slate-100 shadow-sm flex flex-col">
           <div className="flex items-center gap-3 mb-6">
              <GitCompare className="h-5 w-5 text-purple-500" />
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 leading-none">Micro-Compare Nodes</h3>
           </div>
           
           <div className="space-y-4 flex-1">
             <div className="flex items-center gap-4">
                <select className="flex-1 h-9 flex items-center justify-between px-3 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-700 outline-none uppercase" value={compareId1} onChange={(e)=>setCompareId1(e.target.value)}>
                   <option value="">-- Faculty A --</option>
                   {enhancedRiskData.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                </select>
                <span className="text-[10px] font-black text-slate-300 shrink-0">VS</span>
                <select className="flex-1 h-9 flex items-center justify-between px-3 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-700 outline-none uppercase" value={compareId2} onChange={(e)=>setCompareId2(e.target.value)}>
                   <option value="">-- Faculty B --</option>
                   {enhancedRiskData.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                </select>
             </div>

             {compareId1 && compareId2 && compareId1 !== compareId2 && (
                <div className="pt-4 border-t border-slate-50 animate-in slide-in-from-bottom-2">
                   {[
                     { label: "Risk Score", key: "risk_score" },
                     { label: "At-Risk Count", key: "risk_students" },
                   ].map((m, i) => {
                     const f1 = enhancedRiskData.find(f => f.id === compareId1);
                     const f2 = enhancedRiskData.find(f => f.id === compareId2);
                     const val1 = f1?.[m.key] || 0;
                     const val2 = f2?.[m.key] || 0;
                     const max = Math.max(val1, val2, 1);
                     return (
                        <div key={i} className="mb-4">
                           <p className="text-[8px] text-center font-black uppercase tracking-widest text-slate-400 mb-1">{m.label}</p>
                           <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 basis-[45%] justify-end">
                                 <span className="text-xs font-black text-slate-900">{val1}</span>
                                 <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden flex justify-end">
                                    <div className="h-full bg-blue-500 rounded-full transition-all" style={{width: `${(val1/max)*100}%`}}></div>
                                 </div>
                              </div>
                              <span className="text-[10px] text-slate-300 mx-2">|</span>
                              <div className="flex items-center gap-2 basis-[45%]">
                                 <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-rose-500 rounded-full transition-all" style={{width: `${(val2/max)*100}%`}}></div>
                                 </div>
                                 <span className="text-xs font-black text-slate-900">{val2}</span>
                              </div>
                           </div>
                        </div>
                     )
                   })}
                   <Button onClick={() => setCompareId1("")} size="sm" variant="outline" className="w-full mt-2 h-8 text-[9px] font-black uppercase tracking-widest text-slate-500">Reset Comparison</Button>
                </div>
             )}
             
             {compareId1 === compareId2 && compareId1 !== "" && (
               <p className="text-center text-[10px] text-rose-500 font-bold uppercase mt-4">Select distinct faculty nodes</p>
             )}
             
             {(!compareId1 || !compareId2) && (
               <div className="h-32 flex items-center justify-center border-2 border-dashed border-slate-100 rounded-xl mt-4">
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Awaiting Parameter Selection</p>
               </div>
             )}
           </div>
        </Card>
      </div>

    </div>
  );
}
