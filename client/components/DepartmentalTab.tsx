"use client"

import React, { useState, useEffect } from 'react';
import {
 ShieldCheck, Activity, Layers, Zap, UserCheck, TrendingUp,
 AlertTriangle, Cpu, Crosshair, GraduationCap, Users,
 Briefcase, Award, Brain, BarChart3, PieChart as PieChartIcon,
 ArrowUpRight, Target, Flame, Lightbulb, CheckCircle2,
 Calendar, Library, BookOpen, Clock, Settings2, Sparkles,
 FileText, Share2, Download, TrendingDown, LayoutDashboard,
 AlertCircle, GraduationCap as GradIcon, UserPlus, Send, Loader2
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
 PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
 AreaChart, Area, XAxis, YAxis, CartesianGrid,
 BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis,
 PolarRadiusAxis, Radar, LineChart, Line, Legend
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchDepartmentInsights, fetchDepartmentReportData } from '@/lib/api-admin';

const DEPARTMENTS = [
  "ALL", "AGRI", "AIDS", "AIML", "BME", "BT", "CIVIL", "CS", "CSE", "DS", "ECE", "EEE",
  "EIE", "FD", "FT", "IT", "MECH", "MT"
];

export default function DepartmentalTab() {
 const [selectedDept, setSelectedDept] = useState("ALL");
 const [data, setData] = useState<any>(null);
 const [loading, setLoading] = useState(false);
 const [reportLoading, setReportLoading] = useState(false);
 const [reportData, setReportData] = useState<any>(null);
 const [interventionModal, setInterventionModal] = useState({ isOpen: false, subject: null as any });

 // Using cached API functions from @/lib/api-admin

 useEffect(() => {
 const fetchInsights = async () => {
 if (!selectedDept) return;
 setLoading(true);


 try {
 const resData = await fetchDepartmentInsights(selectedDept);
 setData(resData);
 } catch (err) {
 console.error("Failed to fetch department insights", err);
 } finally {
 setLoading(false);
 }
 };
 fetchInsights();
 }, [selectedDept]);

 const handleDownloadPDF = async () => {
 setReportLoading(true);
 try {
 const rData = await fetchDepartmentReportData(selectedDept);
 setReportData(rData);

 // Give React time to render the hidden report
 setTimeout(async () => {
 const doc = new jsPDF('p', 'mm', 'a4');
 const reportElement = document.getElementById('department-pdf-report');
 if (!reportElement) return;

 const pages = reportElement.querySelectorAll('.pdf-page');
 for (let i = 0; i < pages.length; i++) {
 const page = pages[i] as HTMLElement;
 const canvas = await html2canvas(page, {
 scale: 2,
 useCORS: true,
 backgroundColor: '#F8FAF5'
 });
 const imgData = canvas.toDataURL('image/png');
 const imgProps = (doc as any).getImageProperties(imgData);
 const pdfWidth = doc.internal.pageSize.getWidth();
 const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
 
 if (i > 0) doc.addPage();
 doc.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
 }
 
 doc.save(`AI_Weekly_Intelligence_${selectedDept}.pdf`);
 setReportLoading(false);
 setReportData(null);
 }, 1000);
 } catch (err) {
 console.error("PDF Generation failed", err);
 setReportLoading(false);
 }
 };

 const handleShareToHOD = () => {
 setReportLoading(true);
 setTimeout(() => {
 setReportLoading(false);
 alert("Report Shared Successfully with HOD via Secure Channel.");
 }, 1500);
 };

 if (loading) return (
 <div className="flex flex-col items-center justify-center p-48 gap-28 bg-[#F8FAF5]">
 <div className="relative">
 <TrendingUp className="h-40 w-40 shrink-0 text-blue-600 animate-spin" />
 </div>
 <p className="text-3xl font-bold text-blue-900 tracking-widest uppercase">Initializing Departmental Data...</p>
 </div>
 );

 if (!data) return <div className="p-32 text-center font-bold text-rose-600 bg-rose-50 rounded-2xl border border-rose-200">Neural Sync Failed. Please refresh.</div>;

 return (
 <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 w-full pb-32 pt-16">
 <AnimatePresence>
 {reportLoading && (
 <motion.div 
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 className="fixed inset-0 z-[100] bg-white/90 backdrop-blur-xl flex flex-col items-center justify-center gap-28"
 >
 <div className="relative">
 <motion.div 
 animate={{ rotate: 360 }}
 transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
 className="h-72 w-48 shrink-0 border-t-2 border-r-2 border-slate-600 rounded-full"
 />
 <ShieldCheck className="h-20 w-20 shrink-0 text-slate-700 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shrink-0" />
 </div>
 <div className="text-center space-y-4">
 <h3 className="text-6xl font-black text-blue-900 uppercase ">Generating Intelligence Report</h3>
 <p className="text-xl font-medium tracking-[0.3em] text-blue-700 uppercase animate-pulse">Syncing Departmental Nodes & AI Insights...</p>
 </div>
 </motion.div>
 )}
 </AnimatePresence>

 {/* SECTION 1: DEPARTMENT OVERVIEW HEADER */}
 <div className="relative overflow-hidden group p-14 mb-12 bg-white rounded-3xl border border-blue-300 shadow-2xl">

 <div className="relative z-10 flex flex-col xl:flex-row items-center justify-between gap-12">
 <div className="flex items-center gap-10">
 <div className="h-24 w-24 shrink-0 rounded-[2rem] bg-slate-100 flex items-center justify-center border border-slate-300 shadow-xl">
 <Brain className="h-12 w-12 shrink-0 text-slate-700" />
 </div>
 <div className="space-y-4">
 <div className="flex items-center gap-6">
 <span className="px-5 py-2 bg-blue-100 text-slate-700 text-lg font-black uppercase tracking-widest border border-slate-300 rounded-full">Department Node</span>
 <div className="h-4 w-4 shrink-0 rounded-full bg-slate-600 animate-pulse shadow-[0_0_20px_rgba(148,171,144,1)]"></div>
 </div>
 <div className="flex flex-col">
 <select
 className="text-4xl md:text-7xl font-black bg-transparent border-none outline-none cursor-pointer  text-blue-900 focus:ring-0 appearance-none leading-none max-w-full uppercase"
 value={selectedDept}
 onChange={(e) => setSelectedDept(e.target.value)}
 >
 {DEPARTMENTS.map(d => <option key={d} value={d} className="text-4xl font-black bg-white text-blue-900">{d === "ALL" ? "GLOBAL" : d} ENGINE</option>)}
 </select>
 <div className="text-lg font-black text-blue-700 mt-6 flex flex-wrap items-center gap-10 uppercase tracking-widest">
 <div className="flex items-center gap-3">
 <UserCheck className="h-6 w-6 shrink-0 text-slate-700" />
 HOD: <span className="text-blue-900 bg-slate-100 px-4 py-2 rounded-xl border border-slate-300 shadow-sm">{data.metrics.hod_name}</span>
 </div>
 <span className="opacity-20 hidden md:block">|</span>
 <div className="flex items-center gap-3">
 <Users className="h-6 w-6 shrink-0 text-slate-700" />
 Faculty: <span className="text-blue-900 bg-slate-100 px-4 py-2 rounded-xl border border-slate-300 shadow-sm">{data.metrics.total_faculty} Nodes</span>
 </div>
 </div>
 </div>
 </div>
 </div>

 <div className="flex flex-wrap gap-16 items-center justify-center xl:justify-end">
 <div className="text-right space-y-4">
 <p className="text-sm font-black text-blue-700 uppercase tracking-[0.3em]">Dept Health Score</p>
 <div className="flex items-center gap-8 justify-end">
 <div className="h-6 w-80 shrink-0 bg-blue-200 rounded-full overflow-hidden border border-blue-300 shadow-inner">
 <motion.div
 initial={{ width: 0 }}
 animate={{ width: `${data.metrics.ai_health_score}%` }}
 className="h-full bg-slate-600 shadow-[0_0_40px_rgba(148,171,144,0.8)]"
 ></motion.div>
 </div>
 <span className="text-7xl font-black text-blue-900  leading-none">{data.metrics.ai_health_score}</span>
 </div>
 </div>

 <div className="h-48 w-px bg-blue-300 hidden xl:block"></div>

 <div className="flex flex-col items-end gap-4">
 <p className="text-xl font-black text-blue-700 uppercase tracking-[0.4em]">Placement Forecast</p>
 <div className="flex items-center gap-8 bg-blue-100 px-8 py-4 rounded-[2rem] border border-blue-300 shadow-xl">
 <TrendingUp className="h-10 w-10 shrink-0 text-slate-700" />
 <span className="text-6xl font-black text-blue-900  leading-none">{data.metrics.placement_forecast_percent}%</span>
 </div>
 </div>

 <motion.div
 animate={{ scale: [1, 1.05, 1] }}
 transition={{ duration: 3, repeat: Infinity }}
 className={cn(
 "px-10 py-6 rounded-3xl text-2xl font-black uppercase tracking-[0.4em] border-2 flex items-center gap-6 backdrop-blur-2xl shadow-2xl",
 data.metrics.stability_indicator === 'Stable' ? "bg-emerald-100 text-emerald-700 border-emerald-300" :
 data.metrics.stability_indicator === 'Monitoring' ? "bg-amber-100 text-amber-700 border-amber-300" :
 "bg-rose-100 text-rose-700 border-rose-300"
 )}>
 <Activity className="h-8 w-8 shrink-0" />
 {data.metrics.stability_indicator}
 </motion.div>
 </div>
 </div>
 </div>

 {/* SECTION 2: ACADEMIC CORE ANALYTICS */}
 {/* SECTION 2: ACADEMIC CORE ANALYTICS */}
 <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-12">

 <div className="lg:col-span-4 flex flex-col gap-28">
 <Card className="neon-card flex-grow relative overflow-hidden group p-20 bg-gradient-to-br from-blue-50 to-white">
 <div className="absolute -top-16 -right-10 opacity-5 transition-transform duration-700 group-hover:scale-110 group-hover:rotate-12">
 <TrendingUp className="h-96 w-96 shrink-0 text-slate-600 shrink-0" />
 </div>
 <div className="relative z-10 space-y-8">
 <div className="space-y-2">
 <span className="px-3 py-1 bg-slate-100 text-slate-700 text-[16px] font-bold uppercase tracking-widest border border-slate-300 rounded-full inline-block mb-2">Growth Intelligence</span>
 <h3 className="text-5xl font-bold  text-blue-900 leading-tight">Academic Momentum</h3>
 </div>
 <div className="space-y-6">
 <div className="space-y-2">
 <div className="flex justify-between items-center text-base font-semibold text-blue-700 tracking-widest uppercase">
 <span>Growth Index</span>
 <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">+12%</span>
 </div>
 <div className="h-2 w-full bg-blue-200 rounded-full overflow-hidden">
 <motion.div initial={{ width: 0 }} animate={{ width: '82%' }} className="h-full bg-gradient-to-r from-emerald-600 to-emerald-500 shadow-[0_0_15px_rgba(5,150,105,0.6)]" />
 </div>
 </div>
 <div className="space-y-2">
 <div className="flex justify-between items-center text-base font-semibold text-blue-700 tracking-widest uppercase">
 <span>Consistency Score</span>
 <span className="text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-300">94%</span>
 </div>
 <div className="h-2 w-full bg-blue-200 rounded-full overflow-hidden">
 <motion.div initial={{ width: 0 }} animate={{ width: '94%' }} className="h-full bg-gradient-to-r from-slate-600 to-slate-500 shadow-[0_0_15px_rgba(148,171,144,0.6)]" />
 </div>
 </div>
 </div>
 <div className="pt-6 border-t border-blue-300 grid grid-cols-2 gap-32">
 <div className="bg-blue-100 p-14 rounded-xl border border-blue-300">
 <p className="text-5xl font-black text-blue-900 ">8.01</p>
 <p className="text-base font-medium text-blue-700 uppercase tracking-widest mt-1">Avg CGPA</p>
 </div>
 <div className="bg-blue-100 p-14 rounded-xl border border-blue-300">
 <p className="text-5xl font-black text-blue-900 ">6.5%</p>
 <p className="text-base font-medium text-blue-700 uppercase tracking-widest mt-1">Volatility</p>
 </div>
 </div>
 </div>
 </Card>

 <Card className="neon-card p-16 border-l-4 border-l-amber-600 bg-amber-50">
 <div className="flex items-center gap-5">
 <div className="h-24 w-24 rounded-xl bg-amber-100 border border-amber-400 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(217,119,6,0.2)]">
 <Sparkles className="h-12 w-12 shrink-0 text-amber-700 shrink-0" />
 </div>
 <p className="text-2xl font-medium text-amber-800 leading-relaxed">
 "Subject-wise external gap is narrowing, indicating improved pedagogical alignment."
 </p>
 </div>
 </Card>
 </div>
 </div>


 {/* SECTION 4: PLACEMENT INTELLIGENCE */}
 <div className="grid grid-cols-12 gap-12 mb-16">
 <div className="col-span-12 xl:col-span-4">
 <Card className="p-10 h-full border border-blue-200 bg-blue-50 rounded-[3rem] w-full flex flex-col shadow-2xl">
 <div className="space-y-12 flex-1">
 <div className="space-y-4">
 <CardTitle className="text-4xl font-black text-blue-900  uppercase">Placement Eligibility</CardTitle>
 <CardDescription className="text-xl font-bold text-blue-700 uppercase tracking-[0.4em]">Institutional Dream-Offer Mapping</CardDescription>
 </div>

 <div className="space-y-12">
 <EligibilityBar label="IT Services Companies" value={82} icon={<Cpu className="h-8 w-8" />} color="blue" sub="TCS, Infosys, Wipro Ready" />
 <EligibilityBar label="Product / Dream Companies" value={34} icon={<Sparkles className="h-8 w-8" />} color="amber" sub="Amazon, Google, Microsoft Pipeline" />
 <EligibilityBar label="Core Engineering Roles" value={48} icon={<Settings2 className="h-8 w-8" />} color="emerald" sub="Dept Specific Core Alignment" />
 <EligibilityBar label="Higher Studies / Research" value={data.advanced_ai.higher_studies_percent} icon={<GraduationCap className="h-8 w-8" />} color="purple" sub="GATE, GRE, Research Oriented" />
 </div>

 <div className="p-10 rounded-[2.5rem] bg-white flex items-center justify-between border border-blue-200 shadow-2xl mt-12">
 <div className="space-y-2">
 <p className="text-sm font-black text-blue-600 uppercase tracking-widest">Company Eligibility Count</p>
 <p className="text-5xl font-black text-blue-900  leading-none">42 Streams</p>
 </div>
 <div className="h-24 w-24 shrink-0 rounded-[2rem] bg-indigo-50 border border-indigo-200 flex items-center justify-center shadow-xl">
 <Briefcase className="h-12 w-12 shrink-0 text-indigo-600" />
 </div>
 </div>
 </div>
 </Card>
 </div>

 <div className="col-span-12 xl:col-span-8">
 <Card className="p-10 h-full border border-blue-200 bg-white rounded-[3rem] w-full shadow-2xl">
 <div className="space-y-12">
 <div className="flex justify-between items-center">
 <div className="space-y-4">
 <CardTitle className="text-4xl font-black text-blue-900  uppercase">Skill Gap Analysis</CardTitle>
 <CardDescription className="text-xl font-bold text-blue-700 uppercase tracking-[0.4em]">Core vs. IT Readiness breakdown</CardDescription>
 </div>
 <div className="text-right">
 <p className="text-sm font-black text-blue-600 uppercase tracking-widest">Dept skill score</p>
 <p className="text-7xl font-black text-emerald-600  leading-none">{data.metrics.skill_gap_index_core_it}%</p>
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
 <SkillMetricCard label="Coding Proficiency" value={data.metrics.coding_readiness} color="emerald" icon={<Cpu className="h-8 w-8" />} trend="+5.2%" />
 <SkillMetricCard label="Communication" value={data.metrics.communication_readiness} color="blue" icon={<Users className="h-8 w-8" />} trend="+2.1%" />
 <SkillMetricCard label="Aptitude & Logic" value={78.5} color="purple" icon={<Brain className="h-8 w-8" />} trend="+8.4%" />
 <SkillMetricCard label="Core Technical" value={data.metrics.core_skill_depth} color="amber" icon={<Settings2 className="h-8 w-8" />} trend="+3.0%" />
 </div>

 <div className="relative p-12 lg:p-16 rounded-[4rem] bg-indigo-50 overflow-hidden border-2 border-indigo-200 shadow-2xl shadow-indigo-500/10">
 <div className="relative z-10 space-y-10">
 <div className="flex items-center gap-12">
 <Lightbulb className="h-20 w-20 shrink-0 text-indigo-600" />
 <p className="text-3xl font-black uppercase tracking-[0.4em] text-indigo-700">AI Strategy Recommendation</p>
 </div>
 <p className="text-4xl md:text-5xl font-black text-indigo-900 leading-tight ">
 "{data.weekly_insight || "Increase focus on coding bootcamps for 3rd Year students to capture the upcoming hiring surge."}"
 </p>
 </div>
 </div>
 </div>
 </Card>
 </div>
 </div>



 {/* SECTION 8: AI WEEKLY INTELLIGENCE REPORT */}
 <Card className="overflow-hidden border border-blue-200 bg-white rounded-[3rem] mb-16 w-full shadow-2xl">
 <div className="grid grid-cols-12">
 <div className="col-span-12 xl:col-span-4 bg-indigo-50 text-indigo-900 p-16 relative overflow-hidden flex flex-col justify-between border-r border-blue-200">
 <div className="relative z-10 space-y-8">
 <span className="px-8 py-3 bg-indigo-100 text-indigo-700 font-black text-2xl uppercase tracking-widest rounded-full inline-block border border-indigo-300 shadow-sm">Automatic Report</span>
 <h2 className="text-6xl lg:text-8xl font-black uppercase  text-indigo-950 leading-tight">AI Weekly Intelligence</h2>
 <p className="text-2xl font-bold opacity-80 leading-relaxed text-indigo-800 uppercase tracking-widest">
 Institutional decision-ready summary generated using autonomous processing.
 </p>
 <div className="flex flex-col gap-8 pt-12">
 <Button 
 onClick={handleDownloadPDF}
 disabled={reportLoading}
 className="h-32 rounded-[2rem] bg-indigo-600 text-white hover:bg-indigo-700 font-black text-3xl lg:text-4xl uppercase tracking-widest shadow-2xl border-none flex items-center justify-center gap-6 transition-all"
 >
 {reportLoading ? <Loader2 className="h-12 w-12 shrink-0 animate-spin" /> : <Download className="h-12 w-12 shrink-0" />} Download PDF Report
 </Button>
 <Button 
 onClick={handleShareToHOD}
 disabled={reportLoading}
 variant="outline" className="h-24 rounded-[2rem] border-2 border-indigo-300 text-indigo-700 hover:bg-indigo-200 hover:text-indigo-900 font-black text-2xl uppercase tracking-widest flex items-center justify-center gap-6 transition-all bg-transparent"
 >
 <Share2 className="h-10 w-10 shrink-0" /> Share to HOD
 </Button>
 </div>
 </div>
 </div>
 <div className="col-span-12 xl:col-span-8 p-16 lg:p-24 flex flex-col justify-center bg-blue-50">
 <div className="space-y-16">
 <div className="space-y-6">
 <div className="flex items-center gap-10">
 <div className="h-24 w-24 shrink-0 border-2 border-blue-300 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-xl">
 <Lightbulb className="h-12 w-12 shrink-0" />
 </div>
 <h5 className="text-5xl font-black text-blue-900 uppercase ">Strategic Summary</h5>
 </div>
 <p className="text-4xl lg:text-5xl font-bold text-blue-800 leading-relaxed border-l-8 border-indigo-400 pl-16 py-6">
 "{data.weekly_report.summary}"
 </p>
 </div>

 <div className="h-px w-full bg-blue-200" />

 <div className="space-y-6">
 <div className="flex items-center gap-10">
 <div className="h-24 w-24 shrink-0 border-2 border-emerald-300 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shadow-xl">
 <CheckCircle2 className="h-12 w-12 shrink-0" />
 </div>
 <h5 className="text-5xl font-black text-blue-900 uppercase ">Recommended Action</h5>
 </div>
 <p className="text-4xl lg:text-5xl font-bold text-emerald-800 leading-relaxed border-l-8 border-emerald-400 pl-16 py-6">
 "{data.weekly_report.recommendation}"
 </p>
 </div>
 </div>
 </div>
 </div>
 </Card>

 {/* SECTION 9: COMPARATIVE ANALYTICS */}
 <div className="space-y-12 mb-20 pt-10">
 <div className="flex items-center justify-between">
 <div className="space-y-6">
 <h3 className="text-6xl font-black text-blue-900  uppercase">Comparative Performance Hub</h3>
 <p className="text-2xl font-bold text-blue-600 uppercase tracking-[0.4em]">Institutional benchmark vs Departmental Reality</p>
 </div>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mt-12">
 <div className="lg:col-span-8">
 <Card className="bg-white p-16 h-full border border-blue-200 rounded-[4rem] shadow-2xl">
 <div className="h-[600px] w-full">
 <ResponsiveContainer width="100%" height="100%">
 <BarChart data={data.comparative_analysis} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
 <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="#E2E8F0" />
 <XAxis
 dataKey="metric"
 axisLine={false}
 tickLine={false}
 tick={{ fill: '#475569', fontSize: 22, fontWeight: 900 }}
 className="uppercase shrink-0"
 />
 <YAxis hide />
 <Tooltip
 cursor={{ fill: '#F1F5F9' }}
 contentStyle={{ backgroundColor: '#ffffff', borderRadius: '40px', border: '4px solid #E2E8F0', boxShadow: '0 40px 100px rgba(0,0,0,0.1)', padding: '40px', color: '#1e293b' }}
 />
 <Legend iconType="circle" wrapperStyle={{ paddingTop: '60px', fontWeight: 900, textTransform: 'uppercase', fontSize: '20px', color: '#475569', letterSpacing: '0.2em' }} />
 <Bar dataKey="dept_value" name="Department" fill="#6366f1" radius={[16, 16, 16, 16]} barSize={120} />
 <Bar dataKey="inst_value" name="Institution" fill="#94a3b8" radius={[16, 16, 16, 16]} barSize={120} />
 </BarChart>
 </ResponsiveContainer>
 </div>
 </Card>
 </div>

 <div className="lg:col-span-4 space-y-16">
 <Card className="bg-white p-16 border border-blue-200 rounded-[4rem] shadow-2xl overflow-hidden relative group">
 <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:opacity-20 transition-opacity">
 <Zap className="h-[20rem] w-[20rem] text-emerald-500" />
 </div>
 <div className="relative z-10 space-y-8">
 <p className="text-xl font-black text-emerald-600 uppercase tracking-[0.4em]">Outperforming Metric</p>
 <h4 className="text-6xl font-black text-blue-900  uppercase">Academic Consistency</h4>
 <p className="text-3xl font-bold text-blue-700 leading-relaxed">
 Currently 14% higher than institutional average. Maintaining hyper-stability across all clusters.
 </p>
 </div>
 </Card>
 <Card className="bg-white p-16 border border-blue-200 rounded-[4rem] shadow-2xl overflow-hidden relative group">
 <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:opacity-20 transition-opacity">
 <AlertTriangle className="h-[20rem] w-[20rem] text-amber-500" />
 </div>
 <div className="relative z-10 space-y-8">
 <p className="text-xl font-black text-amber-600 uppercase tracking-[0.4em]">Lagging Metric</p>
 <h4 className="text-6xl font-black text-blue-900  uppercase">Skill Gap Narrowing</h4>
 <p className="text-3xl font-bold text-blue-700 leading-relaxed">
 Currently 3.2% below target. Recommendation: Increase department-wide hackathon frequency.
 </p>
 </div>
 </Card>
 </div>
 </div>
 </div>

 {/* BLOCK 10: DEPARTMENT STRATEGIC KPI PANEL */}
 <div className="grid grid-cols-1 md:grid-cols-5 gap-8 pt-16 border-t border-blue-200">
 <KPICard label="Graduation Rate" value={`${data.advanced_ai.graduation_rate}%`} icon={<GraduationCap className="h-6 w-6" />} />
 <KPICard label="Avg Placement Time" value={`${data.advanced_ai.avg_time_to_placement}m`} icon={<Clock className="h-6 w-6" />} />
 <KPICard label="Startup Founders" value={data.advanced_ai.startup_founders_count} icon={<Sparkles className="h-6 w-6" />} />
 <KPICard label="Research Papers" value={data.advanced_ai.research_paper_count} icon={<FileText className="h-6 w-6" />} />
 <KPICard label="Higher Studies" value={`${data.advanced_ai.higher_studies_percent}%`} icon={<Library className="h-6 w-6" />} />
 </div>

 {/* INTERVENTION MODAL */}
 <Dialog
 isOpen={interventionModal.isOpen}
 onClose={() => setInterventionModal({ isOpen: false, subject: null })}
 title="Strategic Academic Intervention"
 description="Automated remedial workflow for low-performing nodes"
 >
 {interventionModal.subject && (
 <div className="space-y-12 py-8 bg-white p-8 rounded-3xl">
 <div className="grid grid-cols-3 gap-8">
 <div className="bg-blue-50 p-6 rounded-2xl border border-blue-200 shadow-sm">
 <p className="text-xs font-black uppercase text-blue-500 tracking-widest mb-2">Subject</p>
 <p className="text-xl font-bold text-blue-900 truncate leading-none uppercase">{interventionModal.subject.subject_name}</p>
 </div>
 <div className="bg-blue-50 p-6 rounded-2xl border border-blue-200 shadow-sm">
 <p className="text-xs font-black uppercase text-blue-500 tracking-widest mb-2">Performance</p>
 <p className="text-4xl font-black text-rose-600 leading-none">{interventionModal.subject.pass_percentage}%</p>
 </div>
 <div className="bg-blue-50 p-6 rounded-2xl border border-blue-200 shadow-sm">
 <p className="text-xs font-black uppercase text-blue-500 tracking-widest mb-2">Backlog</p>
 <p className="text-4xl font-black text-amber-600 leading-none">{interventionModal.subject.backlog_rate}%</p>
 </div>
 </div>

 <div className="space-y-4">
 <h4 className="text-sm font-bold uppercase text-blue-600 tracking-widest mb-4">Recommended Actions</h4>

 <Button
 onClick={() => {
 console.log(`Action: Schedule Remedial Classes for ${interventionModal.subject.subject_name}`);
 alert(`Remedial workflow initiated for ${interventionModal.subject.subject_name}`);
 }}
 className="w-full h-24 bg-white hover:bg-blue-50 border border-blue-200 text-blue-900 flex items-center justify-between px-8 rounded-2xl group transition-all shadow-md"
 >
 <div className="flex items-center gap-6">
 <div className="h-16 w-16 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 group-hover:bg-blue-200 shadow-sm">
 <Calendar className="h-8 w-8" />
 </div>
 <div className="text-left">
 <p className="text-xl font-black uppercase  text-blue-900">Schedule Remedial Classes</p>
 <p className="text-xs text-blue-500 font-bold uppercase mt-1">Create extra sessions & notify faculty</p>
 </div>
 </div>
 <ArrowUpRight className="h-8 w-8 text-blue-400 group-hover:text-blue-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
 </Button>

 <Button
 onClick={() => console.log(`Action: Assign Faculty Mentor for ${interventionModal.subject.subject_name}`)}
 className="w-full h-24 bg-white hover:bg-blue-50 border border-blue-200 text-blue-900 flex items-center justify-between px-8 rounded-2xl group transition-all shadow-md"
 >
 <div className="flex items-center gap-6">
 <div className="h-16 w-16 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-200">
 <UserPlus className="h-8 w-8" />
 </div>
 <div className="text-left">
 <p className="text-xl font-black uppercase  text-blue-900">Assign Faculty Mentor</p>
 <p className="text-xs text-blue-500 font-bold uppercase mt-1">Link specialists to high-risk students</p>
 </div>
 </div>
 <ArrowUpRight className="h-8 w-8 text-blue-400 group-hover:text-emerald-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
 </Button>

 <Button
 onClick={() => console.log(`Action: Generate Study Plan for ${interventionModal.subject.subject_name}`)}
 className="w-full h-24 bg-white hover:bg-blue-50 border border-blue-200 text-blue-900 flex items-center justify-between px-8 rounded-2xl group transition-all shadow-md"
 >
 <div className="flex items-center gap-6">
 <div className="h-16 w-16 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 group-hover:bg-purple-200">
 <Sparkles className="h-8 w-8" />
 </div>
 <div className="text-left">
 <p className="text-xl font-black uppercase  text-blue-900">Generate AI Study Plan</p>
 <p className="text-xs text-blue-500 font-bold uppercase mt-1">Autonomous weekly roadmap generation</p>
 </div>
 </div>
 <ArrowUpRight className="h-8 w-8 text-blue-400 group-hover:text-purple-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
 </Button>

 <Button
 onClick={() => console.log(`Action: Notify Students for ${interventionModal.subject.subject_name}`)}
 className="w-full h-24 bg-white hover:bg-blue-50 border border-blue-200 text-blue-900 flex items-center justify-between px-8 rounded-2xl group transition-all shadow-md"
 >
 <div className="flex items-center gap-6">
 <div className="h-16 w-16 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 group-hover:bg-blue-200">
 <Send className="h-8 w-8" />
 </div>
 <div className="text-left">
 <p className="text-xl font-black uppercase  text-blue-900">Notify Affected Students</p>
 <p className="text-xs text-blue-500 font-bold uppercase mt-1">Broadcast alert to candidate dashboards</p>
 </div>
 </div>
 <ArrowUpRight className="h-8 w-8 text-blue-400 group-hover:text-blue-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
 </Button>
 </div>
 </div>
 )}
 </Dialog>

 {/* HIDDEN PDF REPORT TEMPLATE */}
 <div 
 id="department-pdf-report" 
 style={{ position: 'absolute', left: '-9999px', top: 0, width: '210mm', color: '#1F2937' }}
 >
 {reportData && (
 <>
 {/* PAGE 1: OVERVIEW */}
 <div className="pdf-page bg-[#FAFAF5] p-16 min-h-[297mm] flex flex-col gap-12 border-b border-blue-200">
 <div className="flex justify-between items-start">
 <div className="space-y-2">
 <div className="flex items-center gap-4">
 <div className="h-2 w-2 shrink-0 rounded-full bg-blue-600"></div>
 <span className="text-xs font-black uppercase tracking-widest text-blue-600">Institutional Intelligence</span>
 </div>
 <h1 className="text-5xl font-black uppercase  text-blue-900">Weekly AI Report</h1>
 <p className="text-xl font-bold text-blue-700">{reportData.department_name} • {reportData.current_week}</p>
 </div>
 <div className="text-right">
 <h2 className="text-3xl font-black text-blue-600 ">AGIT-v4</h2>
 <p className="text-xs font-bold text-blue-400 uppercase tracking-widest">Autonomous Engine</p>
 </div>
 </div>

 <div className="grid grid-cols-2 gap-8 mt-6">
 <div className="bg-white p-6 rounded-2xl border border-blue-200 space-y-2 shadow-sm">
 <p className="text-xs font-bold text-blue-500 uppercase tracking-widest text-center">Total Students</p>
 <p className="text-4xl font-black text-blue-900 text-center ">{reportData.total_students}</p>
 </div>
 <div className="bg-white p-6 rounded-2xl border border-blue-200 space-y-2 shadow-sm">
 <p className="text-xs font-bold text-blue-500 uppercase tracking-widest text-center">Avg CGPA</p>
 <p className="text-4xl font-black text-emerald-600 text-center ">{reportData.avg_cgpa}</p>
 </div>
 <div className="bg-white p-6 rounded-2xl border border-blue-200 space-y-2 shadow-sm">
 <p className="text-xs font-bold text-blue-500 uppercase tracking-widest text-center">Avg Attendance</p>
 <p className="text-4xl font-black text-blue-600 text-center ">{reportData.avg_attendance}%</p>
 </div>
 <div className="bg-white p-6 rounded-2xl border border-blue-200 space-y-2 shadow-sm">
 <p className="text-xs font-bold text-blue-500 uppercase tracking-widest text-center">Submission Rate</p>
 <p className="text-4xl font-black text-purple-600 text-center ">{reportData.assignment_submission_rate}%</p>
 </div>
 </div>

 <div className="flex-grow flex flex-col gap-8 mt-8">
 <h3 className="text-xl font-bold text-blue-900 uppercase ">Performance Trend (Last 4 Weeks)</h3>
 <div className="h-[300px] w-full bg-white rounded-2xl p-6 border border-blue-200 shadow-sm overflow-hidden">
 <ResponsiveContainer width="100%" height="100%">
 <LineChart data={reportData.performance_trend}>
 <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
 <XAxis dataKey="week" stroke="#9CA3AF" fontSize={10} tickLine={false} axisLine={false} />
 <YAxis stroke="#9CA3AF" fontSize={10} tickLine={false} axisLine={false} />
 <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #E5E7EB', borderRadius: '12px' }} />
 <Line type="monotone" dataKey="performance_score" stroke="#6B8E23" strokeWidth={4} dot={{ r: 4, fill: '#6B8E23' }} activeDot={{ r: 6, strokeWidth: 0 }} />
 </LineChart>
 </ResponsiveContainer>
 </div>
 </div>
 </div>

 {/* PAGE 2: ANALYTICS */}
 <div className="pdf-page bg-[#FAFAF5] p-16 min-h-[297mm] flex flex-col gap-12 border-b border-blue-200">
 <div className="space-y-2">
 <h2 className="text-4xl font-black uppercase  text-blue-900">Academic Analytics</h2>
 <div className="h-1 w-12 shrink-0 bg-blue-600"></div>
 </div>

 <div className="space-y-4">
 <h3 className="text-xl font-bold text-blue-900 uppercase ">Top Performing Students</h3>
 <div className="bg-white rounded-2xl overflow-hidden border border-blue-200 shadow-sm">
 <table className="w-full text-left">
 <thead>
 <tr className="border-b border-blue-200 bg-blue-50">
 <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-blue-600">Rank</th>
 <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-blue-600">Student Name</th>
 <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-blue-600">CGPA</th>
 </tr>
 </thead>
 <tbody>
 {reportData.top_students.map((st: any) => (
 <tr key={st.rank} className="border-b border-blue-100">
 <td className="px-6 py-4 font-black text-2xl text-blue-600">#{st.rank}</td>
 <td className="px-6 py-4 font-bold text-xl text-blue-900">{st.name}</td>
 <td className="px-6 py-4 font-black text-2xl text-emerald-600">{st.cgpa}</td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>

 <div className="flex-grow flex flex-col gap-8">
 <h3 className="text-xl font-bold text-blue-900 uppercase ">Score Distribution</h3>
 <div className="h-[300px] w-full bg-white rounded-2xl p-6 border border-blue-200 shadow-sm overflow-hidden">
 <ResponsiveContainer width="100%" height="100%">
 <BarChart data={reportData.score_distribution}>
 <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" horizontal={false} />
 <XAxis dataKey="range" stroke="#9CA3AF" fontSize={10} tickLine={false} axisLine={false} />
 <YAxis axisLine={false} tickLine={false} hide />
 <Bar dataKey="count" fill="#6B8E23" radius={[4, 4, 0, 0]} barSize={40}>
 {reportData.score_distribution.map((entry: any, index: number) => (
 <Cell key={`cell-${index}`} fill={index === 0 ? '#059669' : (index === 4 ? '#DC2626' : '#6B8E23')} />
 ))}
 </Bar>
 </BarChart>
 </ResponsiveContainer>
 </div>
 </div>
 </div>

 {/* PAGE 3: AI INSIGHTS */}
 <div className="pdf-page bg-[#FAFAF5] p-16 min-h-[297mm] flex flex-col gap-12">
 <div className="space-y-2">
 <h2 className="text-4xl font-black uppercase  text-blue-900">AI Intelligence Hub</h2>
 <div className="h-1 w-12 shrink-0 bg-blue-600"></div>
 </div>

 <div className="grid grid-cols-1 gap-8">
 <div className="bg-blue-50 p-8 rounded-2xl border border-blue-200 space-y-4 shadow-sm">
 <div className="flex items-center gap-6">
 <div className="h-12 w-12 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm border border-blue-100">
 <Brain className="h-8 w-8" />
 </div>
 <h4 className="text-2xl font-black text-blue-900 uppercase ">Growth Predictions</h4>
 </div>
 <div className="grid grid-cols-2 gap-8">
 <div className="space-y-1">
 <p className="text-xs font-bold text-blue-500 uppercase tracking-widest">Predicted Top Node</p>
 <p className="text-2xl font-bold text-blue-900">{reportData.predicted_top_student}</p>
 </div>
 <div className="space-y-1">
 <p className="text-xs font-bold text-blue-500 uppercase tracking-widest">Next Sem CGPA Forecast</p>
 <p className="text-2xl font-bold text-emerald-600">{reportData.predicted_avg_cgpa}</p>
 </div>
 </div>
 </div>

 <div className="bg-white p-8 rounded-2xl border border-blue-200 space-y-4 shadow-sm">
 <div className="flex items-center gap-6">
 <div className="h-12 w-12 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600 border border-rose-100 shadow-sm">
 <AlertCircle className="h-8 w-8" />
 </div>
 <h4 className="text-2xl font-black text-blue-900 uppercase ">Critical Risk Factors</h4>
 </div>
 <div className="space-y-4">
 <div className="space-y-2">
 <p className="text-xs font-bold text-blue-500 uppercase tracking-widest">Struggling Subjects</p>
 <div className="flex flex-wrap gap-4 pt-1">
 {reportData.struggling_subjects.map((sub: string) => (
 <span key={sub} className="px-4 py-2 bg-rose-50 text-rose-600 border border-rose-100 rounded-lg font-bold text-sm">{sub}</span>
 ))}
 </div>
 </div>
 <div className="space-y-2">
 <p className="text-xs font-bold text-blue-500 uppercase tracking-widest">Attendance Anomalies</p>
 <ul className="space-y-2 pt-1">
 {reportData.attendance_alerts.map((alert: string, idx: number) => (
 <li key={idx} className="flex items-center gap-4 text-sm font-medium text-blue-700">
 <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500"></div>
 {alert}
 </li>
 ))}
 </ul>
 </div>
 </div>
 </div>

 <div className="bg-blue-900 p-8 rounded-2xl flex items-center justify-between shadow-xl">
 <div className="space-y-2">
 <h4 className="text-3xl font-black text-white uppercase ">Academic Health Score</h4>
 <p className="text-sm font-bold text-blue-300 uppercase tracking-widest">{reportData.academic_health_status}</p>
 </div>
 <div className="relative flex items-center justify-center">
 <svg className="h-24 w-24 shrink-0 -rotate-90">
 <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/10" />
 <circle 
 cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" 
 strokeDasharray={251.3}
 strokeDashoffset={251.3 * (1 - reportData.academic_health_score / 100)}
 className="text-blue-400"
 />
 </svg>
 <span className="absolute text-xl font-black text-white">{reportData.academic_health_score}</span>
 </div>
 </div>
 </div>
 </div>
 </>
 )}
 </div>

 </div >
 );
}

// --- Helper UI Components ---

function Badge({ children, color }: { children: string, color: string }) {
 const colors: any = {
 emerald: "bg-emerald-100 text-emerald-700 border-emerald-300",
 blue: "bg-blue-100 text-blue-700 border-blue-300",
 rose: "bg-rose-100 text-rose-700 border-rose-300",
 purple: "bg-purple-100 text-purple-700 border-purple-300"
 };
 return (
 <span className={cn("px-6 py-3 rounded-xl text-xl font-black uppercase tracking-[0.2em] border shadow-sm", colors[color])}>
 {children}
 </span>
 );
}

function SegmentProgress({ label, value, total, color }: any) {
 const colors: any = {
 rose: "bg-rose-500 shadow-[0_0_30px_rgba(244,63,94,0.3)]",
 blue: "bg-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.3)]",
 emerald: "bg-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.3)]",
 purple: "bg-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.3)]"
 };
 const percent = Math.round((value / total) * 100);
 return (
 <div className="space-y-6">
 <div className="flex justify-between items-center text-3xl font-black uppercase tracking-[0.4em] text-blue-700">
 <span>{label}</span>
 <span className="text-blue-900 bg-blue-100 px-5 py-2 rounded-2xl border border-blue-200">{percent}%</span>
 </div>
 <div className="h-10 w-full bg-blue-200 border border-blue-300 overflow-hidden rounded-full shadow-inner">
 <motion.div initial={{ width: 0 }} animate={{ width: `${percent}%` }} className={cn("h-full rounded-full transition-all duration-1000", colors[color])} />
 </div>
 </div>
 );
}

function EligibilityBar({ label, value, icon, color, sub }: any) {
 const barColors: any = {
 blue: "bg-blue-500 shadow-[0_0_40px_rgba(59,130,246,0.4)]",
 amber: "bg-amber-500 shadow-[0_0_40px_rgba(245,158,11,0.4)]",
 emerald: "bg-emerald-500 shadow-[0_0_40px_rgba(16,185,129,0.4)]",
 purple: "bg-purple-500 shadow-[0_0_40px_rgba(168,85,247,0.4)]"
 };
 const iconColors: any = {
 blue: "text-blue-600 bg-blue-50 border-4 border-blue-200 shadow-blue-500/10",
 amber: "text-amber-600 bg-amber-50 border-4 border-amber-200 shadow-amber-500/10",
 emerald: "text-emerald-600 bg-emerald-50 border-4 border-emerald-200 shadow-emerald-500/10",
 purple: "text-purple-600 bg-purple-50 border-4 border-purple-200 shadow-purple-500/10"
 };
 return (
 <div className="space-y-8 bg-white p-12 rounded-[4rem] border border-blue-200 hover:border-slate-300 transition-all shadow-xl">
 <div className="flex justify-between items-center px-4">
 <div className="flex items-center gap-10">
 <div className={cn("h-40 w-40 rounded-[2.5rem] flex items-center justify-center shadow-lg", iconColors[color])}>
 {React.cloneElement(icon, { className: "h-20 w-20" })}
 </div>
 <div>
 <p className="font-black text-blue-900 text-5xl uppercase  leading-none">{label}</p>
 <p className="text-2xl font-black text-blue-600 uppercase tracking-[0.4em] mt-3">{sub}</p>
 </div>
 </div>
 <p className="text-7xl font-black text-blue-900 ">{value}%</p>
 </div>
 <div className="h-8 w-full bg-blue-100 border border-blue-200 overflow-hidden rounded-full shadow-inner">
 <motion.div initial={{ width: 0 }} animate={{ width: `${value}%` }} className={cn("h-full rounded-full transition-all duration-1000", barColors[color])} />
 </div>
 </div>
 );
}

function SkillMetricCard({ label, value, color, icon, trend }: any) {
 const colors: any = {
 emerald: { bar: "bg-emerald-500 shadow-[0_0_40px_rgba(16,185,129,0.4)]", icon: "text-emerald-600 bg-emerald-50 border-4 border-emerald-200 shadow-emerald-500/10" },
 blue: { bar: "bg-indigo-500 shadow-[0_0_40px_rgba(99,102,241,0.4)]", icon: "text-indigo-600 bg-indigo-50 border-4 border-indigo-200 shadow-indigo-500/10" },
 purple: { bar: "bg-purple-500 shadow-[0_0_40px_rgba(168,85,247,0.4)]", icon: "text-purple-600 bg-purple-50 border-4 border-purple-200 shadow-purple-500/10" },
 amber: { bar: "bg-amber-500 shadow-[0_0_40px_rgba(245,158,11,0.4)]", icon: "text-amber-600 bg-amber-50 border-4 border-amber-200 shadow-amber-500/10" }
 };
 return (
 <div className="p-16 rounded-[4rem] bg-white border-4 border-blue-200 hover:border-slate-400 hover:bg-blue-50 transition-all group shadow-2xl overflow-hidden relative">
 <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity text-blue-400">
 {React.cloneElement(icon, { className: "h-[20rem] w-[20rem]" })}
 </div>
 <div className="flex justify-between items-start mb-10 relative z-10">
 <div className={cn("h-36 w-36 rounded-2xl flex items-center justify-center transition-all shadow-xl", colors[color].icon)}>
 {React.cloneElement(icon, { className: "h-20 w-20" })}
 </div>
 <span className="text-3xl font-black text-emerald-700 bg-emerald-100 border-2 border-emerald-300 rounded-[2rem] px-8 py-3 flex items-center gap-6 group-hover:scale-110 transition-transform shadow-[0_0_40px_rgba(16,185,129,0.2)]">
 <TrendingUp className="h-8 w-8 shrink-0" />
 {trend}
 </span>
 </div>
 <div className="space-y-10 relative z-10">
 <div>
 <h5 className="text-4xl font-black text-blue-600 uppercase tracking-[0.4em] mb-4">{label}</h5>
 <p className="text-9xl font-black text-blue-900  drop-shadow-xl">{value}%</p>
 </div>
 <div className="h-10 w-full bg-blue-100 rounded-full overflow-hidden border-2 border-blue-200 shadow-inner mt-4">
 <motion.div initial={{ width: 0 }} animate={{ width: `${value}%` }} className={cn("h-full rounded-full transition-all duration-1000", colors[color].bar)} />
 </div>
 </div>
 </div>
 );
}

function KPICard({ label, value, icon }: any) {
 return (
 <div className="flex items-center gap-6 p-6 rounded-2xl bg-white border border-blue-200 group hover:border-blue-400 transition-all shadow-md hover:shadow-lg">
 <div className="h-16 w-16 shrink-0 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-100 transition-all">
 {React.cloneElement(icon, { className: "h-8 w-8" })}
 </div>
 <div className="space-y-1">
 <p className="text-xs font-black text-blue-500 uppercase tracking-widest">{label}</p>
 <p className="text-3xl font-black text-blue-900  leading-none">{value}</p>
 </div>
 </div>
 );
}

function RocketIcon() {
 return (
 <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
 <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
 <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
 <path d="M9 12H4s.5-1 1-4c1.5 0 3 .5 3 .5L12 9" />
 <path d="M12 15v5s1-.5 4-1c0-1.5-.5-3-.5-3L15 12" />
 </svg>
 )
}
