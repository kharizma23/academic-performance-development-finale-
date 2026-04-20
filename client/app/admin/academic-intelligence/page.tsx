"use client";

import React, { useState, useEffect } from "react";
import { 
 Building2, School, User, TrendingUp, AlertTriangle, 
 ArrowLeft, Download, Zap, Target, GraduationCap, 
 ClipboardList, Activity, ArrowRight, Search
} from "lucide-react";
import { 
 CartesianGrid, Tooltip, Legend, 
 ResponsiveContainer, LineChart, Line, AreaChart, Area, Cell,
 RadarChart, PolarGrid, PolarAngleAxis, Radar, ComposedChart, Bar, XAxis, YAxis
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { 
 fetchInstitutionIntelligence, 
 fetchDepartmentIntelligence, 
 fetchStudentAcademicProfile 
} from "@/lib/api-academic-intelligence";
import { useRouter } from "next/navigation";

const COLORS = ["#0f172a", "#1e293b", "#334155", "#475569", "#64748b"];

export default function AcademicIntelligencePage() {
 const router = useRouter();
 const [level, setLevel] = useState<"institution" | "department" | "student">("institution");
 const [selectedDept, setSelectedDept] = useState("");
 const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
 const [loading, setLoading] = useState(true);
 const [data, setData] = useState<any>(null);

 useEffect(() => {
 loadLevel(level, selectedDept, selectedStudent);
 }, [level, selectedDept, selectedStudent]);

 const loadLevel = async (lvl: string, dept: string, studentId: string | null) => {
 setLoading(true);
 try {
 if (lvl === "institution") {
 const res = await fetchInstitutionIntelligence();
 setData(res);
 } else if (lvl === "department") {
 const res = await fetchDepartmentIntelligence(dept);
 setData(res);
 } else if (lvl === "student" && studentId) {
 const res = await fetchStudentAcademicProfile(studentId);
 setData(res);
 }
 } catch (err) {
 console.error(err);
 } finally {
 setLoading(false);
 }
 };

 const handleBack = () => {
 if (level === "student") setLevel("department");
 else if (level === "department") setLevel("institution");
 };

 return (
 <div className="min-h-screen bg-[#f8fafc] p-6 lg:p-8">
  {/* Header */}
  <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
  <div className="space-y-2">
    <div className="flex items-center gap-2">
      <button 
        onClick={() => router.push('/admin')}
        className="p-1.5 hover:bg-slate-200 rounded-lg transition-all"
      >
        <ArrowLeft className="h-4 w-4 text-slate-600" />
      </button>
      <span className="text-[10px] font-bold text-[#1a4d2e] bg-[#d9f99d] px-2 py-0.5 rounded-full uppercase tracking-wider">
        Academic Hub
      </span>
    </div>
    <h1 className="text-2xl font-black text-slate-900 flex items-center gap-3 uppercase tracking-tight">
    {level === "institution" && <Building2 className="h-6 w-6 text-[#4d7c0f]" />}
    {level === "department" && <School className="h-6 w-6 text-[#4d7c0f]" />}
    {level === "student" && <User className="h-6 w-6 text-[#4d7c0f]" />}
    {level === "institution" ? "Institutional Intelligence" : 
    level === "department" ? `${selectedDept} Departmental Analysis` : 
    "Precision Student Insight"}
    </h1>
  </div>

  <div className="flex items-center gap-2">
  <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-lg shadow-sm hover:bg-slate-50 transition-all uppercase tracking-wider">
    <Download className="h-4 w-4" />
    Export PDF
  </button>
  {level !== "institution" && (
  <button 
    onClick={handleBack}
    className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg shadow-md hover:bg-slate-800 transition-all uppercase tracking-wider"
  >
    Back to Global
  </button>
  )}
  </div>
  </header>

  <AnimatePresence mode="wait">
  <motion.main 
  key={level + selectedDept + selectedStudent}
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -10 }}
  transition={{ duration: 0.2 }}
  >
  {level === "institution" && <InstitutionView data={data} loading={loading} setLevel={setLevel} setSelectedDept={setSelectedDept} router={router} />}
  {level === "department" && <DepartmentView data={data} loading={loading} setLevel={setLevel} setSelectedStudent={setSelectedStudent} />}
  {level === "student" && <StudentLevelView data={data} loading={loading} />}
  </motion.main>
  </AnimatePresence>
 </div>
 );
}

function InstitutionView({ data, loading, setLevel, setSelectedDept, router }: any) {
 if (loading || !data) return <SkeletonLoader />;

 return (
 <div className="space-y-6">
  {/* Metric Cards */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
  <MetricCard 
  label="Performance Index" 
  value={data.overall.avg_cgpa} 
  icon={TrendingUp} 
  bg="bg-indigo-600" 
  />
  <MetricCard 
  label="Inst. Pass Rate" 
  value={`${data.overall.pass_percentage}%`} 
  icon={Target} 
  bg="bg-[#1a4d2e]" 
  />
  <MetricCard 
  label="Risk Nodes" 
  value={data.overall.backlog_count} 
  icon={AlertTriangle} 
  bg="bg-rose-600" 
  />
  <MetricCard 
  label="Node Saturation" 
  value={data.overall.total_students} 
  icon={GraduationCap} 
  bg="bg-amber-600" 
  />
  </div>

  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group">
    <h3 className="text-sm font-black text-slate-800 mb-6 flex items-center gap-2 uppercase tracking-tight">
      <TrendingUp className="h-4 w-4 text-indigo-600" />
      Institutional Proficiency Matrix
    </h3>
    <div className="h-[300px]">
    <ResponsiveContainer width="100%" height="100%">
    <ComposedChart data={data.department_trends}>
    <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
    <XAxis dataKey="department" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10, fontWeight: 700}} />
    <YAxis domain={[5, 10]} hide />
    <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px', border: 'none', fontSize: '10px' }} />
    <Bar dataKey="avg_cgpa" name="Average CGPA" radius={[4, 4, 0, 0]} barSize={30}>
    {data.department_trends.map((entry: any, index: number) => {
    const colors = ["#4f46e5", "#0ea5e9", "#10b981", "#f59e0b", "#f43f5e", "#8b5cf6", "#ec4899", "#14b8a6", "#ef4444", "#3b82f6", "#22c55e", "#d946ef", "#f97316"];
    return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
    })}
    </Bar>
    <Line type="monotone" dataKey="avg_cgpa" name="Trend" tooltipType="none" stroke="#1e293b" strokeWidth={2} dot={{ r: 3, fill: '#ffffff', stroke: '#1e293b', strokeWidth: 2 }} />
    </ComposedChart>
    </ResponsiveContainer>
    </div>
  </section>

  <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group">
    <h3 className="text-sm font-black text-slate-800 mb-6 flex items-center gap-2 uppercase tracking-tight">
      <Activity className="h-4 w-4 text-emerald-600" />
      Cognitive Development Trend
    </h3>
    <div className="h-[300px]">
    <ResponsiveContainer width="100%" height="100%">
    <AreaChart data={data.yearly_performance}>
    <defs>
    <linearGradient id="colorCgpa" x1="0" y1="0" x2="0" y2="1">
    <stop offset="5%" stopColor="#4d7c0f" stopOpacity={0.2}/>
    <stop offset="95%" stopColor="#4d7c0f" stopOpacity={0}/>
    </linearGradient>
    </defs>
    <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
    <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fontSize: 10}} />
    <YAxis domain={[5, 10]} axisLine={false} tickLine={false} tick={{fontSize: 10}} />
    <Tooltip contentStyle={{ fontSize: '10px', borderRadius: '8px' }} />
    <Area type="monotone" dataKey="cgpa" stroke="#1a4d2e" strokeWidth={3} fillOpacity={1} fill="url(#colorCgpa)" />
    </AreaChart>
    </ResponsiveContainer>
    </div>
  </section>
  </div>

  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
  <h3 className="text-sm font-black text-slate-800 mb-6 border-b border-slate-100 pb-2 uppercase tracking-tight">
  Drill-down: Departmental Portals
  </h3>
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
  {data.department_trends.map((dept: any) => (
  <button
  key={dept.department}
  onClick={() => {
    router.push(`/admin/department/${dept.department.toLowerCase()}`);
  }}
  className="p-4 bg-slate-50 hover:bg-slate-100 transition-all rounded-lg text-left border border-slate-200 group relative"
  >
  <span className="text-xl font-black text-slate-900 group-hover:text-indigo-600 block mb-0.5">{dept.department}</span>
  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{dept.student_count} Nodes</span>
  <ArrowRight className="absolute bottom-4 right-4 h-4 w-4 text-slate-300 group-hover:text-indigo-600 transition-all transform group-hover:translate-x-1" />
  </button>
  ))}
  </div>
  </div>
 </div>
 );
}

function DepartmentView({ data, loading, setLevel, setSelectedStudent }: any) {
 if (loading || !data) return <SkeletonLoader />;

 return (
 <div className="space-y-6">
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
  <MetricCard label="Dept Index" value={data.metrics.avg_cgpa} icon={TrendingUp} bg="bg-emerald-600" />
  <MetricCard label="Risk Saturation" value={`${data.metrics.risk_ratio}%`} icon={AlertTriangle} bg="bg-rose-500" />
  <MetricCard label="Attendance" value={`${data.metrics.attendance_avg}%`} icon={Activity} bg="bg-blue-500" />
  <MetricCard label="Cohort Size" value={data.metrics.total_students} icon={GraduationCap} bg="bg-slate-800" />
  </div>

  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
  <div className="lg:col-span-8 space-y-6">
  <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
    <h3 className="text-sm font-black text-slate-800 mb-6 flex items-center gap-2 uppercase tracking-tight">
      <ClipboardList className="h-4 w-4 text-orange-600" />
      Subject Difficulty Index
    </h3>
    <div className="h-[300px]">
    <ResponsiveContainer width="100%" height="100%">
    <ComposedChart layout="vertical" data={data.subject_analysis}>
    <CartesianGrid strokeDasharray="3 3" horizontal={false} strokeOpacity={0.1} />
    <XAxis type="number" domain={[0, 100]} axisLine={false} tickLine={false} tick={{fontSize: 10}} />
    <YAxis type="category" dataKey="name" width={120} axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 700}} />
    <Tooltip contentStyle={{ fontSize: '10px', borderRadius: '8px' }} />
    <Bar dataKey="pass_rate" fill="#1a4d2e" radius={[0, 4, 4, 0]} barSize={25}>
    {data.subject_analysis.map((entry: any, index: number) => (
    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
    ))}
    </Bar>
    </ComposedChart>
    </ResponsiveContainer>
    </div>
  </section>

  <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
    <h3 className="text-sm font-black text-slate-800 mb-6 flex items-center gap-2 uppercase tracking-tight">
      <Zap className="h-4 w-4 text-indigo-600" />
      Grade Variance
    </h3>
    <div className="h-[300px]">
    <ResponsiveContainer width="100%" height="100%">
    <LineChart data={data.internal_external_gap}>
    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
    <XAxis dataKey="subject" axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 700}} />
    <YAxis domain={[50, 100]} axisLine={false} tickLine={false} tick={{fontSize: 10}} />
    <Tooltip contentStyle={{ fontSize: '10px', borderRadius: '8px' }} />
    <Line type="step" dataKey="internal" stroke="#1a4d2e" strokeWidth={3} dot={{ r: 4 }} />
    <Line type="step" dataKey="external" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} />
    </LineChart>
    </ResponsiveContainer>
    </div>
  </section>
  </div>

  <div className="lg:col-span-4 space-y-6">
  <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
    <h4 className="text-xs font-black text-slate-800 mb-4 flex items-center gap-2 uppercase tracking-tight">
    Sentiment Flow
    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
    </h4>
    <div className="grid grid-cols-6 gap-2">
    {Array.from({ length: 24 }).map((_, i) => (
    <div 
    key={i} 
    className={`h-8 rounded-lg ${i % 3 === 0 ? 'bg-rose-400' : (i % 5 === 0 ? 'bg-amber-400' : 'bg-emerald-400')} shadow-sm`} 
    />
    ))}
    </div>
    <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-100">
    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1">Conclusion Engine</p>
    <p className="text-[10px] font-bold text-slate-700 leading-relaxed uppercase">
    "Saturation high in core analytics nodes. Remedial intervention recommended for 12.4% of cohort."
    </p>
    </div>
  </section>

  <section className="bg-slate-900 p-6 rounded-xl text-white shadow-md relative overflow-hidden group">
  <h4 className="text-[10px] font-bold opacity-60 mb-6 uppercase tracking-widest">Benchmarks</h4>
  <div className="space-y-4">
  {Object.entries(data.year_wise_cgpa).map(([year, gpa]: any) => (
    <div key={year} className="flex items-center justify-between">
      <span className="text-slate-400 text-[10px] font-bold uppercase">{year} Performance</span>
      <span className="text-sm font-black bg-white/10 px-3 py-1 rounded-lg">{gpa}</span>
    </div>
  ))}
  </div>
  </section>
  </div>
  </div>
  
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
  <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Departmental Roster</h3>
  <div className="relative w-full sm:w-64">
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
    <input type="text" placeholder="Search ID..." className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 text-xs rounded-lg outline-none focus:border-indigo-600" />
  </div>
  </div>
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
  {["Sanjay S", "Meera K", "Arjun N", "Priya V"].map((name, i) => (
  <div 
  key={i} 
  onClick={() => { setSelectedStudent("sample-id"); setLevel("student"); }}
  className="p-3 bg-white border border-slate-100 rounded-lg hover:border-indigo-600 transition-all cursor-pointer flex items-center justify-between group"
  >
  <div>
  <p className="text-xs font-black text-slate-900 uppercase">{name}</p>
  <p className="text-[8px] font-bold text-slate-400">7376221CSE00{i+1}</p>
  </div>
  <ArrowRight className="h-3 w-3 text-slate-300 group-hover:text-indigo-600" />
  </div>
  ))}
  </div>
  </div>
 </div>
 );
}

function StudentLevelView({ data, loading }: any) {
 if (loading || !data) return <SkeletonLoader />;

 return (
 <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
  <div className="lg:col-span-4 space-y-6">
  <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm text-center relative overflow-hidden group">
  <div className="absolute top-0 left-0 w-full h-16 bg-slate-900" />
  <div className="relative z-10 pt-4">
    <div className="h-20 w-20 bg-white rounded-full mx-auto p-1 shadow-md ring-4 ring-white">
      <div className="h-full w-full bg-slate-50 rounded-full flex items-center justify-center">
        <User className="h-10 w-10 text-slate-200" />
      </div>
    </div>
    <h2 className="text-lg font-black text-slate-900 mt-4 uppercase tracking-tight">{data.profile.name}</h2>
    <p className="text-indigo-600 text-[10px] font-bold uppercase tracking-widest mt-1">{data.profile.roll_number}</p>
    
    <div className="mt-6 grid grid-cols-2 gap-3">
      <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-left">
        <span className="block text-xl font-black text-slate-900 leading-none">{data.profile.cgpa}</span>
        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Global CGPA</span>
      </div>
      <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-left">
        <span className="block text-xl font-black text-blue-600 leading-none">{data.profile.attendance}%</span>
        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Attendance</span>
      </div>
    </div>
  </div>
  </div>

  <div className="bg-slate-900 p-6 rounded-xl text-white shadow-md relative overflow-hidden group">
    <h4 className="text-[10px] font-bold text-white/40 mb-6 text-center uppercase tracking-widest">Skill Analysis</h4>
    <div className="h-[250px]">
    <ResponsiveContainer width="100%" height="100%">
    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={[
    { subject: 'Coding', A: data.skill_spider.coding },
    { subject: 'Logic', A: data.skill_spider.aptitude },
    { subject: 'Comm', A: data.skill_spider.communication },
    { subject: 'Theory', A: data.skill_spider.theory },
    { subject: 'Practical', A: data.skill_spider.practical },
    ]}>
    <PolarGrid stroke="rgba(255,255,255,0.1)" />
    <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 8, fontWeight: 'bold' }} />
    <Radar dataKey="A" stroke="#d9f99d" fill="#d9f99d" fillOpacity={0.3} />
    <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', border: 'none', fontSize: '10px' }} />
    </RadarChart>
    </ResponsiveContainer>
    </div>
  </div>
  </div>

  <div className="lg:col-span-8 space-y-6">
  <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
    <h3 className="text-sm font-black text-slate-800 mb-6 flex items-center gap-2 uppercase tracking-tight">
      <TrendingUp className="h-4 w-4 text-indigo-600" />
      Cognitive Trajectory Mapping
    </h3>
    <div className="h-[300px]">
    <ResponsiveContainer width="100%" height="100%">
    <AreaChart data={data.performance_history}>
    <defs>
    <linearGradient id="colorGpa" x1="0" y1="0" x2="0" y2="1">
    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
    </linearGradient>
    </defs>
    <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
    <XAxis dataKey="sem" axisLine={false} tickLine={false} tick={{fontSize: 10}} />
    <YAxis domain={[5, 10]} axisLine={false} tickLine={false} tick={{fontSize: 10}} />
    <Tooltip contentStyle={{ fontSize: '10px', borderRadius: '8px' }} />
    <Area type="monotone" dataKey="gpa" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorGpa)" dot={{ r: 4 }} />
    </AreaChart>
    </ResponsiveContainer>
    </div>
  </section>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative group overflow-hidden">
    <div className="flex items-center gap-3 mb-6">
    <div className="h-8 w-8 bg-rose-50 rounded-lg flex items-center justify-center border border-rose-100 shadow-sm">
    <AlertTriangle className="h-4 w-4 text-rose-500" />
    </div>
    <h4 className="text-xs font-black text-slate-800 uppercase tracking-tight">AI Risk Analysis</h4>
    </div>
    
    <div className="space-y-4">
    <div>
    <div className="flex justify-between items-baseline mb-2">
    <span className="text-[8px] font-bold text-rose-500 uppercase tracking-widest">Backlog Prob.</span>
    <span className="text-xl font-black text-rose-950 leading-none">{data.risk_assessment.prob_backlog}%</span>
    </div>
    <div className="h-2 w-full bg-rose-50 rounded-full overflow-hidden">
    <motion.div initial={{ width: 0 }} animate={{ width: `${data.risk_assessment.prob_backlog}%` }} className="h-full bg-rose-500" />
    </div>
    </div>
    <p className="text-[10px] font-bold text-slate-600 leading-relaxed uppercase">
    "Engine identifies variance in theoretical performance. Status: <span className="text-emerald-600">Stable</span>."
    </p>
    </div>
    </div>

    <div className="bg-slate-900 p-6 rounded-xl shadow-md relative overflow-hidden group">
    <div className="flex items-center gap-3 mb-6">
    <div className="h-8 w-8 bg-white/10 rounded-lg flex items-center justify-center border border-white/20">
    <Zap className="h-4 w-4 text-[#d9f99d]" />
    </div>
    <h4 className="text-xs font-black text-white uppercase tracking-tight">AI Action Plan</h4>
    </div>
    <ul className="space-y-2">
    {data.risk_assessment.suggestions.map((s: string, i: number) => (
    <li key={i} className="flex items-center gap-3 p-2 bg-white/5 border border-white/5 rounded-lg transition-all group/item">
      <div className="h-1.5 w-1.5 rounded-full bg-[#d9f99d] shadow-[0_0_5px_rgba(217,249,157,0.5)] flex-shrink-0" />
      <span className="text-[9px] font-bold text-slate-300 group-hover/item:text-white uppercase leading-tight">{s}</span>
    </li>
    ))}
    </ul>
    </div>
  </div>
  </div>
 </div>
 );
}

function MetricCard({ label, value, icon: Icon, bg }: any) {
 return (
 <div className={`${bg} p-5 rounded-xl text-white shadow-sm relative overflow-hidden group transition-all hover:translate-y-[-2px]`}>
 <Icon className="absolute top-2 right-2 h-10 w-10 opacity-10 group-hover:scale-110 transition-transform" />
 <div className="relative z-10">
 <h4 className="text-[8px] font-bold uppercase tracking-widest opacity-70 mb-1">{label}</h4>
 <p className="text-2xl font-black leading-none">{value}</p>
 </div>
 </div>
 );
}

function SkeletonLoader() {
 return (
 <div className="animate-pulse space-y-6">
 <div className="grid grid-cols-4 gap-4">
 {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-20 bg-slate-200 rounded-xl" />)}
 </div>
 <div className="grid grid-cols-2 gap-6">
 <div className="h-64 bg-slate-200 rounded-xl" />
 <div className="h-64 bg-slate-200 rounded-xl" />
 </div>
 </div>
 );
}
