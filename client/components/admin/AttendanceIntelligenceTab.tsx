"use client";

import React, { useState, useMemo } from "react";
import { 
  Users, AlertTriangle, TrendingUp, Calendar,
  Loader2, Activity, ShieldAlert, LayoutGrid,
  ChevronRight, BrainCircuit, Download, Search,
  Filter, FileText, CheckCircle2, UserPlus,
  ArrowUpRight, Mail, Zap
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, 
  CartesianGrid, Tooltip, AreaChart, Area, Cell, BarChart, Bar,
  ReferenceLine, ReferenceDot
} from "recharts";
import { cn } from "@/lib/utils";

// --- SAMPLE DATASET ---
const initialStudents = [
  { id: "737622-S001", name: "Arun", dept: "CSE", attendance: 82, absents: 4, year: "3" },
  { id: "737622-S002", name: "Priya", dept: "ECE", attendance: 58, absents: 12, year: "2" },
  { id: "737622-S003", name: "Karthik", dept: "IT", attendance: 72, absents: 8, year: "4" },
  { id: "737622-S004", name: "Divya", dept: "CSE", attendance: 90, absents: 2, year: "1" },
  { id: "737622-S005", name: "Rahul", dept: "EEE", attendance: 65, absents: 10, year: "3" },
  { id: "737622-S006", name: "Manoj", dept: "AIML", attendance: 45, absents: 18, year: "2" },
  { id: "737622-S007", name: "Deepa", dept: "ECE", attendance: 78, absents: 6, year: "4" },
];

const subjects = [
  { name: "DBMS", attendance: 68 },
  { name: "DSA", attendance: 85 },
  { name: "OS", attendance: 55 },
  { name: "NWC", attendance: 92 },
  { name: "AI", attendance: 78 },
];

// --- COMPARATIVE ANALYTICS DATA ---
const comparativeData = [
  { day: "D1", student: 85, dept: 82, inst: 80 },
  { day: "D2", student: 82, dept: 83, inst: 81 },
  { day: "D3", student: 88, dept: 82, inst: 80 },
  { day: "D4", student: 75, dept: 81, inst: 79 }, // Lowest Point
  { day: "D5", student: 80, dept: 84, inst: 82 },
  { day: "D6", student: 84, dept: 83, inst: 81 },
  { day: "D7", student: 83, dept: 82, inst: 80 },
  { day: "D8 (P)", student: 86, dept: 84, inst: 81, isPredicted: true }, // Forecast
];

export default function AttendanceIntelligenceTab() {
  const [students, setStudents] = useState(initialStudents);
  const [interventions, setInterventions] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [deptFilter, setDeptFilter] = useState("ALL");
  const [timeRange, setTimeRange] = useState("30D");

  // --- LOGIC: ANALYTICS ---
  const stats = useMemo(() => {
    const total = students.length;
    const avg = students.reduce((acc, s) => acc + s.attendance, 0) / total;
    const lowCount = students.filter(s => s.attendance < 75).length;
    const criticalCount = students.filter(s => s.attendance < 60).length;
    return { avg: avg.toFixed(1), lowCount, criticalCount };
  }, [students]);

  // --- LOGIC: STATUS INDICATOR ---
  const statusNode = useMemo(() => {
    const current = comparativeData[6].student;
    if (current < 75) return { label: "CRITICAL", color: "bg-rose-600", border: "border-rose-400" };
    if (current < 85) return { label: "WARNING", color: "bg-amber-500", border: "border-amber-300" };
    return { label: "STABLE", color: "bg-emerald-500", border: "border-emerald-300" };
  }, []);

  // --- LOGIC: MIN POINT DETECTION ---
  const minPoint = useMemo(() => {
    return comparativeData.reduce((prev, curr) => (prev.student < curr.student ? prev : curr));
  }, []);

  // --- LOGIC: RISK DETECTION ---
  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.id.includes(searchQuery);
      const matchesDept = deptFilter === "ALL" || s.dept === deptFilter;
      return matchesSearch && matchesDept;
    });
  }, [students, searchQuery, deptFilter]);

  // --- LOGIC: AI PREDICTION ---
  const predictAttendance = (current: number, absents: number) => {
    const predicted = current - (absents * 0.5);
    return predicted.toFixed(1);
  };

  // --- ACTIONS ---
  const deployIntervention = (studentId: string) => {
    if (interventions.includes(studentId)) return;
    toast.loading(`Deploying Neural Intervention...`, { id: "int" });
    setTimeout(() => {
      setInterventions([...interventions, studentId]);
      toast.success("Intervention Node Active.", { id: "int" });
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-10">
      {/* 1. KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-5 rounded-xl bg-indigo-600 shadow-lg text-white relative overflow-hidden group border border-indigo-500 shadow-indigo-100">
          <p className="text-[10px] font-bold uppercase text-slate-400 tracking-widest mb-4">Overall Attendance</p>
          <div className="flex items-end justify-between">
            <p className="text-3xl font-black leading-none">{stats.avg}%</p>
            <div className={cn("px-2 py-1 rounded-md text-[8px] font-bold uppercase tracking-widest border", statusNode.color, statusNode.border)}>
               {statusNode.label}
            </div>
          </div>
        </Card>
        <Card className="p-5 rounded-xl bg-amber-500 shadow-sm text-white relative overflow-hidden group border border-amber-400">
          <p className="text-[10px] font-bold uppercase text-amber-100 tracking-widest mb-4">Low Attendance</p>
          <div className="flex items-end justify-between">
            <p className="text-3xl font-black leading-none">{stats.lowCount}</p>
            <p className="text-[8px] font-bold bg-amber-600/50 px-2 py-1 rounded-md border border-amber-300 uppercase">Below 75%</p>
          </div>
        </Card>
        <Card className="p-5 rounded-xl bg-rose-600 shadow-sm text-white relative overflow-hidden group border border-rose-500">
          <p className="text-[10px] font-bold uppercase text-rose-200 tracking-widest mb-4">Critical Nodes</p>
          <div className="flex items-end justify-between">
            <p className="text-3xl font-black leading-none">{stats.criticalCount}</p>
            <p className="text-[8px] font-bold bg-rose-700/50 px-2 py-1 rounded-md border border-rose-400 uppercase">Urgent Action</p>
          </div>
        </Card>
        <Card className="p-5 rounded-xl bg-white shadow-sm border border-slate-200 group">
          <p className="text-[10px] font-bold uppercase text-slate-400 tracking-widest mb-4">Dispatched Nodes</p>
          <div className="flex items-end justify-between">
            <p className="text-3xl font-black text-slate-900 leading-none">{interventions.length}</p>
            <Button variant="ghost" size="sm" onClick={() => setInterventions([])} className="h-7 text-[8px] font-bold uppercase border border-slate-200">Clear</Button>
          </div>
        </Card>
      </div>

      {/* 2. INTELLIGENT ANALYTICS HUB */}
      <div className="grid grid-cols-1 gap-6">
        <Card className="p-6 rounded-xl border border-slate-200 bg-white shadow-sm relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8 border-b border-slate-100 pb-6">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-sm">
                <BrainCircuit className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">Attendance Command Center</h3>
                <div className="flex items-center gap-2">
                   <div className="flex bg-slate-100 p-0.5 rounded-md border border-slate-200">
                      {["7D", "30D", "SEM"].map(range => (
                         <button key={range} onClick={() => setTimeRange(range)} className={cn("px-2 py-0.5 rounded-md text-[8px] font-bold uppercase transition-all", timeRange === range ? "bg-indigo-600 text-white shadow-md" : "text-slate-400 hover:text-slate-600")}>{range}</button>
                      ))}
                   </div>
                   <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} className="bg-slate-50 border border-slate-200 rounded-md px-2 h-6 text-[8px] font-bold uppercase outline-none focus:ring-1 focus:ring-indigo-500">
                      <option value="ALL">All Depts</option>
                      <option value="CSE">CSE Dept</option>
                      <option value="ECE">ECE Dept</option>
                      <option value="AIML">AIML Dept</option>
                   </select>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
               <Button size="sm" onClick={() => toast.error("Dispatching Warning...")} className="h-8 px-4 bg-rose-600 text-white rounded-lg text-[10px] font-bold uppercase">Dispatch Alert</Button>
                <Button size="sm" onClick={() => toast.info("Assigning Mentor...")} className="h-8 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[10px] font-bold uppercase border-none shadow-sm shadow-indigo-200">Assign Mentor</Button>
            </div>
          </div>
          
          <div className="h-[250px] w-full relative">
            <div className="absolute top-0 right-0 z-30 flex flex-col gap-2 bg-white/90 p-3 rounded-lg border border-slate-200 shadow-sm backdrop-blur-md">
               <div className="flex items-center gap-2">
                  <div className="h-1.5 w-6 bg-indigo-600 rounded-full"></div>
                  <span className="text-[8px] font-bold uppercase text-slate-700">Student Vector</span>
               </div>
               <div className="flex items-center gap-2">
                  <div className="h-1.5 w-6 bg-amber-500 rounded-full"></div>
                  <span className="text-[8px] font-bold uppercase text-slate-700">Dept Node</span>
               </div>
               <div className="flex items-center gap-2 border-t border-slate-100 pt-1">
                  <div className="h-1.5 w-6 border-t-2 border-dotted border-indigo-400"></div>
                  <span className="text-[8px] font-bold uppercase text-slate-400">Forecast</span>
               </div>
            </div>

            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={comparativeData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" axisLine={{ stroke: '#e2e8f0' }} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }} dy={10} />
                <YAxis domain={[0, 100]} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }} dx={-10} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px', padding: '8px' }} itemStyle={{ fontSize: '10px', color: '#fff', fontWeight: 'bold' }} labelStyle={{ fontSize: '10px', color: '#818cf8', fontWeight: 'bold', marginBottom: '4px' }} cursor={{ stroke: '#e2e8f0', strokeWidth: 2 }} />
                <Line name="Student" type="monotone" dataKey="student" stroke="#4f46e5" strokeWidth={2} dot={{ r: 4, fill: '#4f46e5' }} />
                <Line name="Dept" type="monotone" dataKey="dept" stroke="#f59e0b" strokeWidth={1} dot={false} strokeOpacity={0.5} />
                <Line name="Forecast" type="monotone" dataKey={(d) => d.day === "D7" || d.isPredicted ? d.student : null} stroke="#4f46e5" strokeWidth={1} strokeDasharray="5 5" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
             <div className="space-y-1">
                <h4 className="text-[10px] font-bold text-indigo-900 uppercase flex items-center gap-2">
                   <Zap className="h-3 w-3 text-amber-500" /> Neural Diagnostic
                </h4>
                <p className="text-xs font-semibold text-slate-700 leading-tight uppercase">
                   Attendance Drop Detected @ <span className="text-rose-600 font-bold">Day 4</span>.
                </p>
             </div>
             <div className="space-y-1">
                <h4 className="text-[10px] font-bold text-emerald-600 uppercase flex items-center gap-2">
                   <Activity className="h-3 w-3" /> Forecast Peak
                </h4>
                <p className="text-xs font-semibold text-slate-700 leading-tight uppercase">
                   AI predicts <span className="text-emerald-600 font-bold">86% peak stability</span>.
                </p>
             </div>
          </div>
        </Card>
      </div>

      {/* 3. SUBJECT-WISE HEATMAP */}
      <Card className="p-6 rounded-xl border border-slate-200 bg-white shadow-sm">
         <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-3">
           <LayoutGrid className="h-4 w-4 text-indigo-600" /> Subject-wise Matrix
         </h3>
         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
           {subjects.map((sub, i) => {
             const color = sub.attendance > 85 ? "bg-emerald-500" : sub.attendance > 70 ? "bg-amber-500" : "bg-rose-500";
             return (
               <div key={i} className={cn("p-4 rounded-xl shadow-sm transition-all hover:scale-105 cursor-pointer", color)}>
                 <p className="text-[8px] font-bold uppercase text-white/80 mb-1">{sub.name}</p>
                 <p className="text-xl font-black text-white leading-none">{sub.attendance}%</p>
               </div>
             )
           })}
         </div>
      </Card>

      {/* 4. RISK STUDENT AUDIT */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Institutional Risk Audit</h3>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search UI..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs font-semibold text-slate-900 focus:border-indigo-500 outline-none shadow-sm transition-all placeholder:text-slate-300"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {filteredStudents.map((student) => {
            const risk = student.attendance < 60 ? "HIGH" : student.attendance < 75 ? "MEDIUM" : "LOW";
            const predicted = predictAttendance(student.attendance, student.absents);
            const isIntervened = interventions.includes(student.id);

            return (
              <Card key={student.id} className={cn("p-4 rounded-xl border transition-all bg-white shadow-sm relative overflow-hidden", 
                risk === "HIGH" ? "border-rose-100" : risk === "MEDIUM" ? "border-amber-100" : "border-emerald-100")}>
                
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center text-white shadow-sm",
                      risk === "HIGH" ? "bg-rose-600" : risk === "MEDIUM" ? "bg-amber-500" : "bg-emerald-500")}>
                      <Users className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <p className="text-sm font-black text-slate-900 truncate">{student.name}</p>
                        <span className={cn("px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tight",
                          risk === "HIGH" ? "bg-rose-100 text-rose-700" : risk === "MEDIUM" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700")}>
                          {risk}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                         <span>{student.dept}</span>
                         <span className="h-1 w-1 bg-slate-200 rounded-full" />
                         <span>Year {student.year}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 w-full md:w-auto">
                    <div className="bg-slate-50 px-4 py-2 rounded-lg border border-slate-100 text-center flex-1 md:flex-none md:w-24">
                       <p className="text-[8px] font-bold text-slate-400 uppercase mb-0.5">Current</p>
                       <p className="text-lg font-black text-slate-900">{student.attendance}%</p>
                    </div>
                    <div className={cn("px-4 py-2 rounded-lg border text-center flex-1 md:flex-none md:w-24", 
                      parseFloat(predicted) < 75 ? "bg-rose-50 border-rose-100" : "bg-emerald-50 border-emerald-100")}>
                       <p className="text-[8px] font-bold text-slate-400 uppercase mb-0.5">Predict</p>
                       <p className={cn("text-lg font-black", parseFloat(predicted) < 75 ? "text-rose-600" : "text-emerald-600")}>{predicted}%</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 w-full md:w-auto">
                    {isIntervened ? (
                      <div className="flex-1 md:w-32 h-9 bg-indigo-50 border border-indigo-200 rounded-lg flex items-center justify-center gap-2 text-indigo-600 text-[10px] font-bold uppercase shadow-inner">
                        <CheckCircle2 className="h-3 w-3" /> Dispatched
                      </div>
                    ) : (
                      <Button onClick={() => deployIntervention(student.id)} className="flex-1 md:w-32 h-9 bg-indigo-600 text-white rounded-lg text-[10px] font-bold uppercase shadow-sm border-none">
                         Intervene
                      </Button>
                    )}
                    <button className="h-9 w-9 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center text-slate-400 shadow-sm hover:text-indigo-600 transition-colors">
                       <Mail className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {parseFloat(predicted) < 75 && (
                  <div className="absolute top-0 left-0 right-0 h-1 w-full bg-rose-500 animate-pulse z-0" />
                )}
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  );
}
