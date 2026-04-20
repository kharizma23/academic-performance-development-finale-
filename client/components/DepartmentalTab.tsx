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
 <div className="text-center space-y-2">
 <h3 className="text-xl font-bold text-slate-800 uppercase tracking-tight">Generating Intelligence Report</h3>
 <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase animate-pulse">Syncing Departmental Nodes...</p>
 </div>
 </motion.div>
 )}
 </AnimatePresence>

 {/* SECTION 1: DEPARTMENT OVERVIEW HEADER */}
 <div className="relative overflow-hidden group p-6 mb-6 bg-white rounded-2xl border border-slate-200 shadow-sm">

 <div className="relative z-10 flex flex-col xl:flex-row items-center justify-between gap-6">
 <div className="flex items-center gap-6">
 <div className="h-12 w-12 shrink-0 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-200">
 <Brain className="h-6 w-6 shrink-0 text-slate-600" />
 </div>
 <div className="space-y-1">
 <div className="flex items-center gap-2">
 <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[8px] font-bold uppercase tracking-widest border border-indigo-100 rounded-full">Department Node</span>
 <div className="h-2 w-2 shrink-0 rounded-full bg-emerald-500 animate-pulse"></div>
 </div>
 <div className="flex flex-col">
 <select
 className="text-2xl font-black bg-transparent border-none outline-none cursor-pointer text-slate-900 focus:ring-0 appearance-none leading-none max-w-full uppercase"
 value={selectedDept}
 onChange={(e) => setSelectedDept(e.target.value)}
 >
 {DEPARTMENTS.map(d => <option key={d} value={d} className="text-sm font-bold bg-white text-slate-900">{d === "ALL" ? "GLOBAL" : d} ENGINE</option>)}
 </select>
 <div className="text-[10px] font-bold text-slate-400 mt-2 flex flex-wrap items-center gap-4 uppercase tracking-widest">
 <div className="flex items-center gap-1.5">
 <UserCheck className="h-3 w-3 shrink-0 text-slate-400" />
 HOD: <span className="text-slate-900 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200">{data.metrics.hod_name}</span>
 </div>
 <span className="opacity-20 hidden md:block">|</span>
 <div className="flex items-center gap-1.5">
 <Users className="h-3 w-3 shrink-0 text-slate-400" />
 Faculty: <span className="text-slate-900 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200">{data.metrics.total_faculty} Nodes</span>
 </div>
 </div>
 </div>
 </div>
 </div>

 <div className="flex flex-wrap gap-8 items-center justify-center xl:justify-end">
 <div className="text-right space-y-1">
 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Health Score</p>
 <div className="flex items-center gap-4 justify-end">
 <div className="h-2 w-32 shrink-0 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
 <motion.div
 initial={{ width: 0 }}
 animate={{ width: `${data.metrics.ai_health_score}%` }}
 className="h-full bg-slate-600"
 ></motion.div>
 </div>
 <span className="text-2xl font-black text-slate-900 leading-none">{data.metrics.ai_health_score}</span>
 </div>
 </div>

 <div className="h-10 w-px bg-slate-200 hidden xl:block"></div>

 <div className="flex flex-col items-end gap-1">
 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Placement Map</p>
 <div className="flex items-center gap-3 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
 <TrendingUp className="h-3 w-3 shrink-0 text-slate-400" />
 <span className="text-xl font-black text-slate-900 leading-none">{data.metrics.placement_forecast_percent}%</span>
 </div>
 </div>

 <motion.div
 animate={{ scale: [1, 1.02, 1] }}
 transition={{ duration: 3, repeat: Infinity }}
 className={cn(
 "px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border flex items-center gap-2 shadow-sm bg-white",
 data.metrics.stability_indicator === 'Stable' ? "text-emerald-600 border-emerald-100" :
 data.metrics.stability_indicator === 'Monitoring' ? "text-amber-600 border-amber-100" :
 "text-rose-600 border-rose-100"
 )}>
 <Activity className="h-3 w-3 shrink-0" />
 {data.metrics.stability_indicator}
 </motion.div>
 </div>
 </div>
 </div>

 {/* SECTION 2: ACADEMIC CORE ANALYTICS */}
 {/* SECTION 2: ACADEMIC CORE ANALYTICS */}
 <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
 <div className="lg:col-span-4 flex flex-col gap-6">
 <Card className="relative overflow-hidden group p-6 bg-white border border-slate-100 shadow-sm">
 <div className="absolute -top-10 -right-10 opacity-5 transition-transform duration-700 group-hover:scale-110">
 <TrendingUp className="h-40 w-40 shrink-0 text-slate-800" />
 </div>
 <div className="relative z-10 space-y-4">
 <div className="space-y-1">
 <span className="px-2 py-0.5 bg-slate-50 text-slate-400 text-[8px] font-bold uppercase tracking-widest border border-slate-100 rounded-full inline-block mb-1">Growth Intelligence</span>
 <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Academic Momentum</h3>
 </div>
 <div className="space-y-4">
 <div className="space-y-1.5">
 <div className="flex justify-between items-center text-[8px] font-bold text-slate-400 tracking-widest uppercase">
 <span>Growth Index</span>
 <span className="text-emerald-600">+12%</span>
 </div>
 <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
 <motion.div initial={{ width: 0 }} animate={{ width: '82%' }} className="h-full bg-emerald-500" />
 </div>
 </div>
 <div className="space-y-1.5">
 <div className="flex justify-between items-center text-[8px] font-bold text-slate-400 tracking-widest uppercase">
 <span>Consistency Score</span>
 <span className="text-slate-900">94%</span>
 </div>
 <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
 <motion.div initial={{ width: 0 }} animate={{ width: '94%' }} className="h-full bg-slate-600" />
 </div>
 </div>
 </div>
 <div className="pt-4 border-t border-slate-50 grid grid-cols-2 gap-4">
 <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
 <p className="text-lg font-black text-slate-900">8.01</p>
 <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Avg CGPA</p>
 </div>
 <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
 <p className="text-lg font-black text-slate-900">6.5%</p>
 <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Volatility</p>
 </div>
 </div>
 </div>
 </Card>

 <Card className="p-4 border-l-2 border-l-amber-400 bg-amber-50/30 shadow-sm">
 <div className="flex items-center gap-4">
 <div className="h-10 w-10 rounded-lg bg-amber-100/50 flex items-center justify-center shrink-0">
 <Sparkles className="h-4 w-4 text-amber-600" />
 </div>
 <p className="text-xs font-bold text-amber-900 leading-snug">
 "Subject-wise external gap is narrowing, indicating improved pedagogical alignment."
 </p>
 </div>
 </Card>
 </div>
 </div>


 {/* SECTION 4: PLACEMENT INTELLIGENCE */}
 <div className="grid grid-cols-12 gap-6 mb-6">
 <div className="col-span-12 xl:col-span-4">
 <Card className="p-6 h-full border border-slate-100 bg-slate-50/50 rounded-2xl w-full flex flex-col shadow-sm">
 <div className="space-y-6 flex-1">
 <div className="space-y-1">
 <CardTitle className="text-xl font-black text-slate-900 uppercase">Placement Eligibility</CardTitle>
 <CardDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Opportunity Mapping</CardDescription>
 </div>

 <div className="space-y-4">
 <EligibilityBar label="IT Services" value={82} icon={<Cpu className="h-4 w-4" />} color="blue" sub="TCS, Infosys Ready" />
 <EligibilityBar label="Product / Dream" value={34} icon={<Sparkles className="h-4 w-4" />} color="amber" sub="Big Tech Pipeline" />
 <EligibilityBar label="Core Engineering" value={48} icon={<Settings2 className="h-4 w-4" />} color="emerald" sub="Core Technical Depth" />
 <EligibilityBar label="Higher Studies" value={data.advanced_ai.higher_studies_percent} icon={<GraduationCap className="h-4 w-4" />} color="purple" sub="Research Vectors" />
 </div>

 <div className="p-4 rounded-xl bg-white flex items-center justify-between border border-slate-100 shadow-sm mt-6">
 <div className="space-y-1">
 <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Stream Alignment</p>
 <p className="text-xl font-black text-slate-900">42 Nodes</p>
 </div>
 <div className="h-10 w-10 shrink-0 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center">
 <Briefcase className="h-4 w-4 text-teal-600" />
 </div>
 </div>
 </div>
 </Card>
 </div>

 <div className="col-span-12 xl:col-span-8">
 <Card className="p-6 h-full border border-slate-100 bg-white rounded-2xl w-full shadow-sm">
 <div className="space-y-6">
 <div className="flex justify-between items-start">
 <div className="space-y-1">
 <CardTitle className="text-xl font-black text-slate-900 uppercase">Skill Gap Analysis</CardTitle>
 <CardDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Core vs. IT Readiness</CardDescription>
 </div>
 <div className="text-right">
 <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Dept Score</p>
 <p className="text-2xl font-black text-emerald-600 leading-none">{data.metrics.skill_gap_index_core_it}%</p>
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 <SkillMetricCard label="Coding Proficiency" value={data.metrics.coding_readiness} color="emerald" icon={<Cpu className="h-4 w-4" />} trend="+5.2%" />
 <SkillMetricCard label="Communication" value={data.metrics.communication_readiness} color="blue" icon={<Users className="h-4 w-4" />} trend="+2.1%" />
 <SkillMetricCard label="Aptitude & Logic" value={78.5} color="purple" icon={<Brain className="h-4 w-4" />} trend="+8.4%" />
 <SkillMetricCard label="Core Technical" value={data.metrics.core_skill_depth} color="amber" icon={<Settings2 className="h-4 w-4" />} trend="+3.0%" />
 </div>

 <div className="relative p-6 rounded-xl bg-slate-50 overflow-hidden border border-slate-100 shadow-inner">
 <div className="absolute top-0 right-0 p-4 opacity-5">
 <Lightbulb className="h-24 w-24 text-slate-900" />
 </div>
 <div className="relative z-10 space-y-4">
 <div className="flex items-center gap-3">
 <Lightbulb className="h-5 w-5 text-indigo-600" />
 <p className="text-[10px] font-black uppercase tracking-widest text-indigo-700">AI Strategy Node</p>
 </div>
 <p className="text-sm font-bold text-slate-900 leading-snug">
 "{data.weekly_insight || "Increase focus on coding bootcamps for 3rd Year students to capture the upcoming hiring surge."}"
 </p>
 </div>
 </div>
 </div>
 </Card>
 </div>
 </div>



 {/* SECTION 8: AI WEEKLY INTELLIGENCE REPORT */}
 <Card className="overflow-hidden border border-slate-100 bg-white rounded-2xl mb-8 w-full shadow-sm">
 <div className="grid grid-cols-12">
 <div className="col-span-12 xl:col-span-4 bg-slate-50 text-slate-900 p-8 relative overflow-hidden flex flex-col justify-between border-r border-slate-100">
 <div className="relative z-10 space-y-4">
 <span className="px-3 py-1 bg-white text-indigo-600 font-bold text-[10px] uppercase tracking-widest rounded-full inline-block border border-slate-100 shadow-sm">Autonomous Report</span>
 <h2 className="text-3xl font-black uppercase text-slate-900 leading-tight">Weekly Intelligence</h2>
 <p className="text-[10px] font-bold opacity-60 leading-relaxed text-slate-500 uppercase tracking-widest">
 Decision-ready summary processed via AI kernel.
 </p>
 <div className="flex flex-col gap-3 pt-6">
 <Button 
 onClick={handleDownloadPDF}
 disabled={reportLoading}
 className="h-10 rounded-xl bg-slate-900 text-white hover:bg-slate-800 font-bold text-xs uppercase tracking-widest shadow-sm flex items-center justify-center gap-2"
 >
 {reportLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />} Download PDF
 </Button>
 <Button 
 onClick={handleShareToHOD}
 disabled={reportLoading}
 variant="outline" className="h-10 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all bg-transparent"
 >
 <Share2 className="h-4 w-4" /> Share to HOD
 </Button>
 </div>
 </div>
 </div>
 <div className="col-span-12 xl:col-span-8 p-8 flex flex-col justify-center bg-slate-50/50">
 <div className="space-y-8">
 <div className="space-y-3">
 <div className="flex items-center gap-4">
 <div className="h-10 w-10 shrink-0 border border-slate-200 bg-white rounded-lg flex items-center justify-center text-slate-400 shadow-sm">
 <Lightbulb className="h-5 w-5" />
 </div>
 <h5 className="text-lg font-black text-slate-900 uppercase">Strategic Summary</h5>
 </div>
 <p className="text-sm font-bold text-slate-600 leading-relaxed border-l-2 border-slate-200 pl-6 py-2 italic font-serif">
 "{data.weekly_report.summary}"
 </p>
 </div>

 <div className="h-px w-full bg-slate-100" />

 <div className="space-y-3">
 <div className="flex items-center gap-4">
 <div className="h-10 w-10 shrink-0 border border-slate-200 bg-white rounded-lg flex items-center justify-center text-emerald-600 shadow-sm">
 <CheckCircle2 className="h-5 w-5" />
 </div>
 <h5 className="text-lg font-black text-slate-900 uppercase">Recommended Action</h5>
 </div>
 <p className="text-sm font-bold text-emerald-800 leading-relaxed border-l-2 border-emerald-200 pl-6 py-2">
 "{data.weekly_report.recommendation}"
 </p>
 </div>
 </div>
 </div>
 </div>
 </Card>

 {/* SECTION 9: COMPARATIVE ANALYTICS */}
 <div className="space-y-6 mb-8 pt-4">
 <div className="flex items-center justify-between">
 <div className="space-y-1">
 <h3 className="text-2xl font-black text-slate-900 uppercase">Performance Hub</h3>
 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Institutional benchmark comparison</p>
 </div>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
 <div className="lg:col-span-8">
 <Card className="bg-white p-6 h-full border border-slate-100 rounded-2xl shadow-sm">
 <div className="h-[300px] w-full">
 <ResponsiveContainer width="100%" height="100%">
 <BarChart data={data.comparative_analysis} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
 <XAxis
 dataKey="metric"
 axisLine={false}
 tickLine={false}
 tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
 className="uppercase shrink-0"
 />
 <YAxis hide />
 <Tooltip
 cursor={{ fill: '#F1F5F9' }}
 contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #f1f5f9', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', padding: '10px', color: '#1e293b', fontSize: '10px' }}
 />
 <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontWeight: 700, textTransform: 'uppercase', fontSize: '10px', color: '#94a3b8', letterSpacing: '0.1em' }} />
 <Bar dataKey="dept_value" name="Dept" fill="#0f172a" radius={[2, 2, 0, 0]} barSize={30} />
 <Bar dataKey="inst_value" name="Institutional Avg" fill="#cbd5e1" radius={[2, 2, 0, 0]} barSize={30} />
 </BarChart>
 </ResponsiveContainer>
 </div>
 </Card>
 </div>

 <div className="lg:col-span-4 space-y-6">
 <Card className="bg-white p-6 border border-slate-100 rounded-2xl shadow-sm overflow-hidden relative group">
 <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
 <Zap className="h-32 w-32 text-emerald-500" />
 </div>
 <div className="relative z-10 space-y-3">
 <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Outperforming</p>
 <h4 className="text-xl font-black text-slate-900 uppercase">Academic Consistency</h4>
 <p className="text-xs font-medium text-slate-500 leading-relaxed">
 Currently 14% higher than institutional average.
 </p>
 </div>
 </Card>
 <Card className="bg-white p-6 border border-slate-100 rounded-2xl shadow-sm overflow-hidden relative group">
 <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
 <AlertTriangle className="h-32 w-32 text-amber-500" />
 </div>
 <div className="relative z-10 space-y-3">
 <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">At Risk/Lagging</p>
 <h4 className="text-xl font-black text-slate-900 uppercase">Skill Gap Narrowing</h4>
 <p className="text-xs font-medium text-slate-500 leading-relaxed">
 Currently 3.2% below target. Recommendation: Increase department hackathons.
 </p>
 </div>
 </Card>
 </div>
 </div>
 </div>

 {/* BLOCK 10: DEPARTMENT STRATEGIC KPI PANEL */}
 <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-8 border-t border-slate-100">
 <KPICard label="Graduation" value={`${data.advanced_ai.graduation_rate}%`} icon={<GraduationCap className="h-4 w-4" />} />
 <KPICard label="Placement" value={`${data.advanced_ai.avg_time_to_placement}m`} icon={<Clock className="h-4 w-4" />} />
 <KPICard label="Founders" value={data.advanced_ai.startup_founders_count} icon={<Sparkles className="h-4 w-4" />} />
 <KPICard label="Research" value={data.advanced_ai.research_paper_count} icon={<FileText className="h-4 w-4" />} />
 <KPICard label="Studies" value={`${data.advanced_ai.higher_studies_percent}%`} icon={<Library className="h-4 w-4" />} />
 </div>

 {/* INTERVENTION MODAL */}
 <Dialog
 isOpen={interventionModal.isOpen}
 onClose={() => setInterventionModal({ isOpen: false, subject: null })}
 title="Academic Intervention"
 description="Remedial workflow for low-performing nodes"
 >
 {interventionModal.subject && (
 <div className="space-y-6 py-4 bg-white p-4 rounded-xl">
 <div className="grid grid-cols-3 gap-4">
 <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 shadow-sm">
 <p className="text-[8px] font-bold uppercase text-slate-400 tracking-widest mb-1">Subject</p>
 <p className="text-xs font-bold text-slate-900 truncate uppercase">{interventionModal.subject.subject_name}</p>
 </div>
 <div className="bg-rose-50/50 p-3 rounded-lg border border-rose-100 shadow-sm">
 <p className="text-[8px] font-bold uppercase text-rose-400 tracking-widest mb-1">Pass %</p>
 <p className="text-xl font-black text-rose-600 leading-none">{interventionModal.subject.pass_percentage}%</p>
 </div>
 <div className="bg-amber-50/50 p-3 rounded-lg border border-amber-100 shadow-sm">
 <p className="text-[8px] font-bold uppercase text-amber-400 tracking-widest mb-1">Backlog</p>
 <p className="text-xl font-black text-amber-600 leading-none">{interventionModal.subject.backlog_rate}%</p>
 </div>
 </div>

 <div className="space-y-2">
 <h4 className="text-[10px] font-bold uppercase text-slate-400 tracking-widest mb-2">Actions</h4>

 <Button
 onClick={() => {
 alert(`Remedial workflow initiated for ${interventionModal.subject.subject_name}`);
 }}
 className="w-full h-12 bg-white hover:bg-slate-50 border border-slate-200 text-slate-900 flex items-center justify-between px-4 rounded-xl group transition-all"
 >
 <div className="flex items-center gap-4">
 <div className="h-8 w-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 group-hover:text-slate-600">
 <Calendar className="h-4 w-4" />
 </div>
 <div className="text-left">
 <p className="text-sm font-bold uppercase text-slate-900">Schedule Remedial</p>
 </div>
 </div>
 <ArrowUpRight className="h-4 w-4 text-slate-300 group-hover:text-slate-900 transition-all" />
 </Button>

 <Button
 onClick={() => {}}
 className="w-full h-12 bg-white hover:bg-slate-50 border border-slate-200 text-slate-900 flex items-center justify-between px-4 rounded-xl group transition-all"
 >
 <div className="flex items-center gap-4">
 <div className="h-8 w-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 group-hover:text-slate-600">
 <UserPlus className="h-4 w-4" />
 </div>
 <div className="text-left">
 <p className="text-sm font-bold uppercase text-slate-900">Assign Mentor</p>
 </div>
 </div>
 <ArrowUpRight className="h-4 w-4 text-slate-300 group-hover:text-slate-900 transition-all" />
 </Button>

 <Button
 onClick={() => {}}
 className="w-full h-12 bg-white hover:bg-slate-50 border border-slate-200 text-slate-900 flex items-center justify-between px-4 rounded-xl group transition-all"
 >
 <div className="flex items-center gap-4">
 <div className="h-8 w-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 group-hover:text-slate-600">
 <Sparkles className="h-4 w-4" />
 </div>
 <div className="text-left">
 <p className="text-sm font-bold uppercase text-slate-900">AI Study Plan</p>
 </div>
 </div>
 <ArrowUpRight className="h-4 w-4 text-slate-300 group-hover:text-slate-900 transition-all" />
 </Button>

 <Button
 onClick={() => {}}
 className="w-full h-12 bg-white hover:bg-slate-50 border border-slate-200 text-slate-900 flex items-center justify-between px-4 rounded-xl group transition-all"
 >
 <div className="flex items-center gap-4">
 <div className="h-8 w-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 group-hover:text-slate-600">
 <Send className="h-4 w-4" />
 </div>
 <div className="text-left">
 <p className="text-sm font-bold uppercase text-slate-900">Notify Nodes</p>
 </div>
 </div>
 <ArrowUpRight className="h-4 w-4 text-slate-300 group-hover:text-slate-900 transition-all" />
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
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    blue: "bg-indigo-50 text-indigo-600 border-indigo-100",
    rose: "bg-rose-50 text-rose-600 border-rose-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100"
  };
  return (
    <span className={cn("px-2 py-0.5 rounded-md text-[8px] font-bold uppercase tracking-widest border shadow-sm", colors[color])}>
      {children}
    </span>
  );
}

function SegmentProgress({ label, value, total, color }: any) {
  const colors: any = {
    rose: "bg-rose-500",
    blue: "bg-indigo-500",
    emerald: "bg-emerald-500",
    purple: "bg-purple-500"
  };
  const percent = Math.round((value / total) * 100);
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-tight text-slate-500">
        <span>{label}</span>
        <span className="text-slate-900 font-black">{percent}%</span>
      </div>
      <div className="h-1.5 w-full bg-slate-50 border border-slate-100 overflow-hidden rounded-full">
        <motion.div initial={{ width: 0 }} animate={{ width: `${percent}%` }} className={cn("h-full rounded-full transition-all duration-1000", colors[color])} />
      </div>
    </div>
  );
}

function EligibilityBar({ label, value, icon, color, sub }: any) {
  const barColors: any = {
    blue: "bg-indigo-500",
    amber: "bg-amber-500",
    emerald: "bg-emerald-500",
    purple: "bg-purple-500"
  };
  const iconColors: any = {
    blue: "text-indigo-600 bg-indigo-50 border border-indigo-100",
    amber: "text-amber-600 bg-amber-50 border border-amber-100",
    emerald: "text-emerald-600 bg-emerald-50 border border-emerald-100",
    purple: "text-purple-600 bg-purple-50 border border-purple-100"
  };
  return (
    <div className="space-y-4 bg-white p-4 rounded-xl border border-slate-100 hover:border-slate-200 transition-all shadow-sm">
      <div className="flex justify-between items-center px-1">
        <div className="flex items-center gap-4">
          <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center shadow-sm", iconColors[color])}>
            {React.cloneElement(icon, { className: "h-5 w-5" })}
          </div>
          <div>
            <p className="font-black text-slate-900 text-sm uppercase leading-none">{label}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{sub}</p>
          </div>
        </div>
        <p className="text-xl font-black text-slate-900">{value}%</p>
      </div>
      <div className="h-2 w-full bg-slate-50 border border-slate-100 overflow-hidden rounded-full">
        <motion.div initial={{ width: 0 }} animate={{ width: `${value}%` }} className={cn("h-full rounded-full transition-all duration-1000", barColors[color])} />
      </div>
    </div>
  );
}

function SkillMetricCard({ label, value, color, icon, trend }: any) {
  const colors: any = {
    emerald: { bar: "bg-emerald-500", icon: "text-emerald-600 bg-emerald-50 border border-emerald-100" },
    blue: { bar: "bg-indigo-500", icon: "text-indigo-600 bg-indigo-50 border border-indigo-100" },
    purple: { bar: "bg-purple-500", icon: "text-purple-600 bg-purple-50 border border-purple-100" },
    amber: { bar: "bg-amber-500", icon: "text-amber-600 bg-amber-50 border border-amber-100" }
  };
  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 transition-all group shadow-sm overflow-hidden relative">
      <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity text-slate-400">
        {React.cloneElement(icon, { className: "h-24 w-24" })}
      </div>
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center transition-all shadow-sm", colors[color].icon)}>
          {React.cloneElement(icon, { className: "h-5 w-5" })}
        </div>
        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-lg px-2 py-0.5 flex items-center gap-1.5 transition-transform shadow-sm">
          <TrendingUp className="h-3 w-3" />
          {trend}
        </span>
      </div>
      <div className="space-y-4 relative z-10">
        <div>
          <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</h5>
          <p className="text-3xl font-black text-slate-900">{value}%</p>
        </div>
        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
          <motion.div initial={{ width: 0 }} animate={{ width: `${value}%` }} className={cn("h-full rounded-full transition-all duration-1000", colors[color].bar)} />
        </div>
      </div>
    </div>
  );
}

function KPICard({ label, value, icon }: any) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-100 group hover:border-slate-200 transition-all shadow-sm">
      <div className="h-10 w-10 shrink-0 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-slate-600 group-hover:bg-slate-100 transition-all">
        {React.cloneElement(icon, { className: "h-4 w-4" })}
      </div>
      <div className="space-y-0.5">
        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
        <p className="text-lg font-black text-slate-900 leading-none">{value}</p>
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
