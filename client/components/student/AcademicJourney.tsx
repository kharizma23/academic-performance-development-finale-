"use client"

import React, { useState } from 'react'
import { 
 TrendingUp, 
 Zap, 
 Target, 
 ArrowUpRight, 
 ArrowDownRight,
 BarChart3, 
 CheckCircle2, 
 AlertTriangle,
 FileText,
 Download,
 Flame,
 BrainCircuit,
 Award,
 Activity,
 Minus,
 Scale,
 Cpu
} from "lucide-react"
import { 
 LineChart, 
 Line, 
 XAxis, 
 YAxis, 
 CartesianGrid, 
 Tooltip, 
 ResponsiveContainer,
 AreaChart,
 Area,
 BarChart,
 Bar,
 Cell
} from 'recharts'
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"

interface AcademicJourneyProps {
 data: any
 trend: any[]
 subjects: any[]
 insight: any
}

export default function AcademicJourney({ data, trend, subjects, insight }: AcademicJourneyProps) {
 const [targetCgpa, setTargetCgpa] = useState(data?.target_cgpa || 9.0)

 const downloadReport = async () => {
 const element = document.getElementById('academic-report-node')
 if (!element) return
 
 const canvas = await html2canvas(element, { scale: 2 })
 const imgData = canvas.toDataURL('image/png')
 
 const pdf = new jsPDF('p', 'mm', 'a4')
 const pdfWidth = pdf.internal.pageSize.getWidth()
 const pdfHeight = (canvas.height * pdfWidth) / canvas.width
 
 pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
 pdf.save(`${data?.student?.name || 'Student'}_Academic_Journey.pdf`)
 }

 if (!data) return (
 <div className="h-[60vh] flex items-center justify-center">
 <div className="flex flex-col items-center gap-6 opacity-20">
 <BrainCircuit className="h-20 w-20 animate-pulse" />
 <p className="text-xl font-black uppercase tracking-[0.5em]">Synchronizing Academic Node...</p>
 </div>
 </div>
 )

 return (
 <div className="space-y-16 animate-in fade-in duration-1000 w-full overflow-hidden" id="academic-report-node">
 {/* Top Tactical Row */}
 <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
 {/* Improvement Card */}
 <motion.div 
 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
 className="p-16 rounded-[3.5rem] bg-white border-4 border-slate-50 shadow-2xl hover:shadow-[0_80px_160px_rgba(0,0,0,0.15)] transition-all duration-700 flex flex-col justify-between h-[420px] group relative overflow-hidden"
 >
 <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-50 rounded-full -mr-40 -mt-40 opacity-0 group-hover:opacity-100 transition-all duration-1000 scale-0 group-hover:scale-100" />
 <div className="flex justify-between items-start relative z-10">
 <div className="space-y-8">
 <p className="text-base lg:text-lg font-black text-slate-400 uppercase tracking-[0.6em] opacity-60 flex items-center gap-6">
 <div className="h-4 w-4 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]" /> IMPROVEMENT DELTA
 </p>
 <h4 className="text-[9rem] lg:text-[10.5rem] font-[1000]  text-emerald-600 leading-none drop-shadow-2xl">{data.improvement_delta}</h4>
 </div>
 <div className="h-28 w-28 bg-emerald-50 rounded-[2rem] flex items-center justify-center border-4 border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-xl group-hover:rotate-12 transform">
 <TrendingUp className="h-14 w-14 text-emerald-600 group-hover:text-white" />
 </div>
 </div>
 <div className="flex items-center gap-8 relative z-10 pt-10 border-t-8 border-emerald-50/50">
 <div className="h-5 w-5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_30px_rgba(16,185,129,0.6)]" />
 <p className="text-base lg:text-lg font-[1000] text-emerald-600 uppercase tracking-[0.4em] opacity-90">NEURAL VELOCITY: ACCELERATING</p>
 </div>
 </motion.div>

 {/* Backlog Tracker */}
 <motion.div 
 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
 className="p-14 rounded-[3.5rem] bg-white border-2 border-slate-50 shadow-2xl hover:shadow-[0_60px_120px_rgba(0,0,0,0.12)] transition-all duration-700 flex flex-col justify-between h-[400px] group relative overflow-hidden"
 >
 <div className="absolute top-0 right-0 w-64 h-64 bg-slate-100 rounded-full -mr-32 -mt-32 opacity-0 group-hover:opacity-100 transition-all duration-1000 scale-0 group-hover:scale-100" />
 <div className="flex justify-between items-start relative z-10">
 <div className="space-y-6">
 <p className="text-sm lg:text-base font-black text-slate-400 uppercase tracking-[0.6em] opacity-50 flex items-center gap-4">
 <div className="h-3 w-3 rounded-full bg-slate-300" /> ARREAR STATUS
 </p>
 <h4 className="text-[8.5rem] lg:text-[9.5rem] font-[1000]  text-[#0F172A] leading-none drop-shadow-2xl">{data.backlogs}</h4>
 </div>
 <div className="h-24 w-24 bg-slate-50 rounded-[1.5rem] flex items-center justify-center border-2 border-slate-100 group-hover:bg-[#0F172A] group-hover:text-white transition-all shadow-xl group-hover:-rotate-6 transform">
 <Minus className="h-12 w-12 text-slate-600 group-hover:text-white" />
 </div>
 </div>
 <div className="flex items-center gap-6 relative z-10 pt-8 border-t-4 border-slate-50">
 <CheckCircle2 className="h-7 w-7 text-emerald-600 shadow-emerald-200" />
 <p className="text-sm lg:text-base font-black uppercase tracking-[0.4em] text-emerald-600">NODES STABLE</p>
 </div>
 </motion.div>

 {/* Accuracy / consistency */}
 <motion.div 
 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
 className="p-16 rounded-[4rem] bg-white border-4 border-slate-50 shadow-2xl hover:shadow-[0_80px_160px_rgba(0,0,0,0.15)] transition-all duration-700 flex flex-col justify-between h-[420px] group relative overflow-hidden"
 >
 <div className="flex justify-between items-start relative z-10">
 <div className="space-y-10">
 <p className="text-base lg:text-lg font-black text-slate-400 uppercase tracking-[0.6em] opacity-60">STUDY CONSISTENCY</p>
 <h4 className="text-[4rem] lg:text-[5.5rem] font-[1000]  text-blue-600 uppercase leading-[0.8] drop-shadow-xl">{data.consistency.split(' - ')[0]}</h4>
 <p className="text-xl lg:text-3xl font-[1000] text-[#0F172A] opacity-80 leading-tight uppercase ">{data.consistency.split(' - ')[1]}</p>
 </div>
 <div className="h-28 w-28 bg-blue-50 rounded-3xl flex items-center justify-center border-4 border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-2xl group-hover:rotate-12 transform">
 <Flame className="h-14 w-14 text-blue-600 group-hover:text-white" />
 </div>
 </div>
 <div className="flex items-center gap-8 relative z-10 pt-10 border-t-8 border-blue-50/50">
 <Activity className="h-8 w-8 text-blue-600 animate-pulse" />
 <p className="text-base lg:text-lg font-[1000] text-blue-600 uppercase tracking-[0.6em] ">PULSE STABILITY: 98%</p>
 </div>
 </motion.div>

 {/* Risk Node */}
 <motion.div 
 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
 className={cn(
 "p-14 rounded-[4rem] bg-white border-2 shadow-sm hover:shadow-2xl transition-all duration-700 flex flex-col justify-between h-[380px] group",
 data.risk_level === 'Low' ? "border-emerald-100 bg-emerald-50/20" : "border-rose-100 bg-rose-50/20"
 )}
 >
 <div className="flex justify-between items-start">
 <div className="space-y-4">
 <p className="text-xs lg:text-sm font-black text-slate-400 uppercase tracking-[0.5em] opacity-50">RISK INDICATOR</p>
 <h4 className={cn("text-7xl lg:text-[8rem] font-black  leading-none", data.risk_level === 'Low' ? "text-emerald-600" : "text-rose-600")}>{data.risk_level}</h4>
 </div>
 <div className={cn("h-20 w-20 rounded-3xl flex items-center justify-center border-2 group-hover:scale-110 transition-transform shadow-sm", data.risk_level === 'Low' ? "bg-emerald-50 border-emerald-100" : "bg-rose-50 border-rose-100")}>
 <Activity className={cn("h-10 w-10", data.risk_level === 'Low' ? "text-emerald-600" : "text-rose-600")} />
 </div>
 </div>
 <p className="text-xs lg:text-lg font-black text-slate-500/60 uppercase tracking-widest leading-tight">{data.risk_reason}</p>
 </motion.div>
 </div>

 {/* Performance Matrix Hub */}
 <div className="flex flex-col xl:flex-row gap-16 h-fit">
 {/* Left: Trend & Subjects */}
 <div className="flex-[2.2] space-y-16">
 {/* CGPA Trend Chart */}
 <div className="glass-card bg-white border-4 border-slate-50 shadow-2xl p-14 lg:p-20 rounded-[4rem] group hover:shadow-[0_60px_120px_rgba(0,0,0,0.1)] transition-all duration-1000">
 <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-12 gap-8">
 <div className="space-y-4">
 <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-6">
 <BarChart3 className="h-10 w-10 text-blue-600" />
 <h3 className="text-4xl lg:text-5xl font-[1000] uppercase  text-[#0F172A] ">SEMESTER PERFORMANCE MATRIX</h3>
 </motion.div>
 <p className="text-lg font-black text-slate-400 uppercase tracking-[0.6em] opacity-50 ml-16">Institutional CGPA Trajectory</p>
 </div>
 <Button onClick={downloadReport} className="bg-[#0F172A] hover:bg-black text-white !h-16 px-10 rounded-[1.2rem] font-black uppercase text-xs lg:text-base tracking-[0.3em] flex items-center gap-6 shadow-2xl active:scale-95 transition-all">
 <Download className="h-6 w-6" /> DOWNLOAD REPORT NODE
 </Button>
 </div>
 <div className="h-[550px] w-full mt-8">
 <ResponsiveContainer width="100%" height="100%">
 <AreaChart data={trend} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
 <defs>
 <linearGradient id="colorCgpa" x1="0" y1="0" x2="0" y2="1">
 <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2}/>
 <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
 </linearGradient>
 </defs>
 <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="#F1F5F9" />
 <XAxis 
 dataKey="sem" 
 axisLine={false} 
 tickLine={false} 
 tick={{fill: '#94A3B8', fontSize: 16, fontWeight: '900', letterSpacing: '0.1em'}}
 dy={30}
 />
 <YAxis 
 domain={[0, 10]} 
 axisLine={false} 
 tickLine={false} 
 tick={{fill: '#94A3B8', fontSize: 16, fontWeight: '900'}}
 dx={-20}
 />
 <Tooltip 
 cursor={{ stroke: '#2563EB', strokeWidth: 4, strokeDasharray: '10 10' }}
 content={({ active, payload }) => {
 if (active && payload && payload.length) {
 return (
 <div className="bg-[#0F172A] p-12 rounded-[2.5rem] border-4 border-white/10 shadow-2xl space-y-4 animate-in zoom-in duration-300">
 <p className="text-xs lg:text-sm font-black text-blue-400 uppercase tracking-[0.5em]">{payload[0].payload.sem}</p>
 <p className="text-5xl lg:text-7xl font-black text-white  leading-none">{payload[0].value}<span className="text-sm lg:text-xl text-white/40 not- ml-4 tracking-normal font-black">CGPA</span></p>
 <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden mt-4">
 <div className="h-full bg-blue-600" style={{ width: `${(payload[0].value / 10) * 100}%` }} />
 </div>
 </div>
 );
 }
 return null;
 }}
 />
 <Area 
 type="monotone" 
 dataKey="cgpa" 
 stroke="#2563EB" 
 strokeWidth={10}
 fillOpacity={1} 
 fill="url(#colorCgpa)"
 animationDuration={3000}
 activeDot={{ r: 12, fill: '#2563EB', stroke: '#fff', strokeWidth: 6 }}
 />
 </AreaChart>
 </ResponsiveContainer>
 </div>
 </div>

 {/* Subject Analysis Table */}
 <div className="glass-card bg-white border-2 border-[#E2E8F0] shadow-sm p-10 lg:p-14 rounded-[3.5rem] group hover:shadow-2xl transition-all duration-1000">
 <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-12 gap-6">
 <div className="space-y-3">
 <h3 className="text-3xl lg:text-4xl font-black uppercase  text-[#0F172A] flex items-center gap-4 leading-none">
 <Zap className="h-8 w-8 text-blue-600" /> SUBJECT MASTERY LEDGER
 </h3>
 <p className="text-xs lg:text-sm font-black text-slate-400 uppercase tracking-widest opacity-50 ml-12">Granular Performance Neural Mapping</p>
 </div>
 <div className="flex items-center gap-3 px-6 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
 <Activity className="h-5 w-5 text-blue-600 animate-pulse" />
 <span className="text-[10px] font-black uppercase tracking-widest text-[#475569]">{subjects.length} SUBJECTS SYNCED</span>
 </div>
 </div>
 <div className="overflow-x-auto custom-scrollbar">
 <table className="w-full border-collapse">
 <thead>
 <tr className="border-b-4 border-[#F1F5F9]">
 <th className="text-left py-10 text-xs lg:text-sm font-black text-slate-400 uppercase tracking-[0.4em] opacity-40">SUBJECT NODE</th>
 <th className="text-center py-10 text-xs lg:text-sm font-black text-slate-400 uppercase tracking-[0.4em] opacity-40">CIA (INTERNAL)</th>
 <th className="text-center py-10 text-xs lg:text-sm font-black text-slate-400 uppercase tracking-[0.4em] opacity-40">SEM (EXTERNAL)</th>
 <th className="text-center py-10 text-xs lg:text-sm font-black text-slate-400 uppercase tracking-[0.4em] opacity-40">TOTAL SYNC</th>
 <th className="text-center py-10 text-xs lg:text-sm font-black text-slate-400 uppercase tracking-[0.4em] opacity-40">GRADE</th>
 <th className="text-right py-10 text-xs lg:text-sm font-black text-slate-400 uppercase tracking-[0.4em] opacity-40">MASTER STATUS</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-[#F1F5F9]">
 {subjects.map((sub, i) => (
 <tr key={i} className="group/row hover:bg-slate-50/80 transition-all duration-500">
 <td className="py-12 lg:py-16">
 <div className="space-y-3 px-8">
 <p className="text-3xl lg:text-4xl font-black text-blue-950 uppercase  group-hover/row:text-blue-600 transition-all duration-500 leading-none drop-shadow-sm">{sub.subject}</p>
 <p className="text-[10px] lg:text-xs font-black text-slate-400 uppercase tracking-widest opacity-40 flex items-center gap-3">
 <div className="h-2 w-2 rounded-full bg-slate-200" /> SEMESTER: {sub.sem}
 </p>
 </div>
 </td>
 <td className="text-center py-12 px-8">
 <div className={cn(
 "inline-flex flex-col items-center gap-2 px-8 py-5 rounded-[2rem] border-2 shadow-lg transition-all duration-500 transform group-hover/row:scale-105",
 sub.internal < 30 ? "bg-rose-50 border-rose-100 text-rose-700 shadow-rose-100" : "bg-emerald-50 border-emerald-100 text-emerald-700 shadow-emerald-100"
 )}>
 <span className="text-[8px] font-black uppercase tracking-widest opacity-40">CIA</span>
 <span className="text-2xl lg:text-3xl font-black">{sub.internal}<span className="text-[10px] opacity-20 ml-2">/ 50</span></span>
 </div>
 </td>
 <td className="text-center py-12 px-8">
 <div className="inline-flex flex-col items-center gap-2 px-8 py-5 rounded-[2rem] bg-slate-50 border-2 border-slate-100 text-slate-600 shadow-lg transition-all duration-500 transform group-hover/row:scale-105">
 <span className="text-[8px] font-black uppercase tracking-widest opacity-40">SEM</span>
 <span className="text-2xl lg:text-3xl font-black">{sub.external}<span className="text-[10px] opacity-20 ml-2">/ 50</span></span>
 </div>
 </td>
 <td className="text-center py-12 px-8">
 <div className="flex flex-col items-center gap-3">
 <span className="text-2xl lg:text-4xl font-[1000]  text-blue-900 leading-none drop-shadow-md group-hover/row:text-blue-600 transition-colors uppercase">{sub.total}</span>
 <div className="h-2 w-24 bg-slate-100 rounded-full overflow-hidden">
 <div className="h-full bg-blue-600" style={{ width: `${sub.total}%` }} />
 </div>
 </div>
 </td>
 <td className="text-center py-12 px-8">
 <div className="h-16 w-16 lg:h-20 lg:w-20 mx-auto rounded-2xl bg-blue-950 text-white flex flex-col items-center justify-center shadow-xl group-hover/row:scale-110 group-hover/row:rotate-6 transition-all duration-700 border-2 border-white/20">
 <span className="text-[8px] font-black uppercase tracking-widest opacity-40 mb-1">GRADE</span>
 <span className="text-xl lg:text-3xl font-black">{sub.grade}</span>
 </div>
 </td>
 <td className="text-right py-12 pr-8">
 <div className={cn(
 "inline-flex items-center gap-4 px-8 py-3 rounded-2xl text-[10px] lg:text-xs font-black uppercase tracking-widest shadow-xl transition-all transform group-hover/row:scale-105 ",
 sub.status === 'Pass' ? "bg-emerald-600 text-white" : "bg-rose-600 text-white"
 )}>
 {sub.status === 'Pass' ? <CheckCircle2 className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
 {sub.status.toUpperCase()}
 </div>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 </div>

 {/* Right: AI Analysis & Goals */}
 <div className="flex-1 space-y-16">
 {/* AI Advisor Card */}
 <div className="glass-card bg-[#0F172A] border border-[#0F172A] shadow-2xl p-16 lg:p-24 rounded-[5.5rem] text-white space-y-12 group hover:shadow-[0_60px_150px_rgba(37,99,235,0.3)] transition-all duration-1000 relative overflow-hidden h-fit">
 <div className="absolute top-0 right-0 p-16 opacity-5 group-hover:scale-150 transition-transform duration-2000 rotate-12">
 <BrainCircuit className="h-48 w-48 lg:h-64 lg:w-64" />
 </div>
 <div className="relative z-10 space-y-12">
 <div className="space-y-4">
 <h3 className="text-4xl lg:text-6xl font-black uppercase tracking-[0.4em] border-b-4 border-white/10 pb-10 shadow-sm leading-none ">NEURAL <span className="text-blue-400">ADVISOR</span></h3>
 <div className="flex items-center gap-4">
 <div className="h-3 w-3 rounded-full bg-blue-500 animate-pulse shadow-2xl" />
 <p className="text-xs lg:text-sm font-black text-blue-400 uppercase tracking-[1em] opacity-60">AUTH-GRADED TRAJECTORY</p>
 </div>
 </div>
 <div className="space-y-8">
 <p className="text-xs lg:text-lg font-black text-blue-400 uppercase tracking-[0.5em] shadow-sm opacity-50 ">CRITICAL ANALYSIS MATRIX</p>
 <div className="p-10 lg:p-14 rounded-[4rem] bg-white/5 border-2 border-white/10 text-xl lg:text-3xl font-bold leading-[1.6] shadow-inner text-slate-200">
 "{insight.analysis}"
 </div>
 </div>
 <div className="grid grid-cols-1 gap-8">
 <div className="p-10 rounded-[3rem] bg-white/[0.03] border-2 border-white/5 space-y-6 group/node hover:bg-white/[0.07] transition-all">
 <p className="text-xs lg:text-base font-black text-emerald-400 uppercase tracking-[0.8em] flex items-center gap-4">
 <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" /> STRONG NODES
 </p>
 <div className="flex flex-wrap gap-4 text-white">
 {insight.strong_subjects.map((s: string) => (
 <span key={s} className="px-6 py-3 bg-emerald-500/10 text-emerald-400 rounded-2xl text-xs lg:text-xl font-black border border-emerald-500/20  uppercase">{s}</span>
 ))}
 </div>
 </div>
 <div className="p-10 rounded-[3rem] bg-white/[0.03] border-2 border-white/5 space-y-6 group/node hover:bg-white/[0.07] transition-all text-white">
 <p className="text-xs lg:text-base font-black text-rose-400 uppercase tracking-[0.8em] flex items-center gap-4 text-white">
 <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" /> WEAK NODES
 </p>
 <div className="flex flex-wrap gap-4">
 {insight.weak_subjects.map((s: string) => (
 <span key={s} className="px-6 py-3 bg-rose-500/10 text-rose-400 rounded-2xl text-xs lg:text-xl font-black border border-rose-500/20  uppercase">{s}</span>
 ))}
 </div>
 </div>
 </div>
 <div className="p-12 lg:p-16 rounded-[4.5rem] bg-[#2563EB]/10 border-2 border-blue-500/20 space-y-8 animate-in slide-in-from-bottom-5 duration-1000 shadow-2xl shadow-blue-900/40">
 <p className="text-xs lg:text-xl font-black text-blue-400 uppercase tracking-[1em] flex items-center gap-6 ">
 <Target className="h-8 w-8 animate-bounce" /> RECOMMENDATION NODE
 </p>
 <p className="text-lg lg:text-[1.75rem] font-bold text-slate-100 leading-[1.6] ">{insight.recommendation}</p>
 </div>
 </div>
 </div>

 {/* Performance Heatmap node */}
 <div className="glass-card bg-white border-2 border-[#E2E8F0] shadow-md p-16 lg:p-24 rounded-[5.5rem] group hover:shadow-2xl transition-all duration-1000">
 <div className="flex items-center justify-between mb-16 border-b-2 border-blue-600 pb-10">
 <h3 className="text-3xl lg:text-5xl font-black uppercase  text-[#0F172A] flex items-center gap-8 ">
 <Activity className="h-12 w-12 text-blue-600 animate-pulse" /> ACADEMIC HEATMAP
 </h3>
 <div className="px-6 py-2 bg-[#F8FAFC] border-2 border-[#E2E8F0] rounded-full text-xs font-black text-slate-400 uppercase tracking-widest opacity-60">MASTER SYNC</div>
 </div>
 <div className="grid grid-cols-6 gap-6 lg:gap-10">
 {Array.from({ length: 24 }).map((_, i) => (
 <motion.div 
 key={i} 
 whileHover={{ scale: 1.2, zIndex: 10, rotate: 6 }}
 className={cn(
 "h-16 lg:h-24 w-full rounded-[1.5rem] transition-all duration-700 cursor-pointer shadow-sm relative group/cell",
 i < 5 ? "bg-emerald-600 shadow-[0_10px_30px_rgba(5,150,105,0.3)]" : (i < 12 ? "bg-emerald-400/80" : (i < 18 ? "bg-amber-400/50" : "bg-slate-100/80"))
 )}
 >
 <div className="absolute inset-0 bg-white opacity-0 group-hover/cell:opacity-20 transition-opacity rounded-[1.5rem]" />
 </motion.div>
 ))}
 </div>
 <div className="flex justify-between mt-12 text-xs lg:text-sm font-black text-slate-400 uppercase tracking-[0.8em] opacity-40">
 <span>LOWER MASTERY</span>
 <span>PEAK SYNC</span>
 </div>
 </div>

 {/* Goal Tracker Module */}
 <div className="glass-card bg-white border-2 border-[#E2E8F0] shadow-md p-16 lg:p-24 rounded-[5rem] group hover:shadow-2xl transition-all duration-1000 flex flex-col justify-between h-fit">
 <div className="space-y-16">
 <div className="flex items-center justify-between border-b-2 border-amber-500 pb-10">
 <h3 className="text-3xl lg:text-5xl font-black uppercase  text-[#0F172A] ">GOAL TRACKER</h3>
 <Award className="h-12 w-12 text-amber-500 animate-bounce" />
 </div>
 <div className="space-y-10">
 <div className="flex justify-between items-end">
 <p className="text-xs lg:text-xl font-black text-slate-400 uppercase tracking-[0.8em] opacity-50">INSTITUTIONAL TARGET</p>
 <p className="text-7xl lg:text-[8rem] font-black  text-[#0F172A] leading-none mb-[-10px]">{targetCgpa}</p>
 </div>
 <div className="relative pt-4">
 <div className="h-6 lg:h-10 bg-slate-100 rounded-full overflow-hidden border-2 border-slate-200/50 shadow-inner">
 <motion.div 
 initial={{ width: 0 }} 
 animate={{ width: `${data.progress_to_goal}%` }} 
 transition={{ duration: 3, ease: "easeOut" }}
 className="h-full bg-gradient-to-r from-amber-400 to-amber-600 shadow-[0_0_40px_rgba(245,158,11,0.6)] relative" 
 >
 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
 </motion.div>
 </div>
 <motion.div 
 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
 className="absolute top-0 right-0 translate-y-[-120%] bg-amber-600 text-white px-6 py-2 rounded-2xl text-xs lg:text-sm font-black uppercase tracking-widest shadow-xl flex items-center gap-2"
 >
 <Cpu className="h-4 w-4" /> {data.progress_to_goal}% SYNCED
 </motion.div>
 </div>
 <div className="flex justify-between items-center opacity-30 ">
 <p className="text-xs font-black uppercase tracking-widest">CURRENT: {trend[trend.length-1]?.cgpa}</p>
 <p className="text-xs font-black uppercase tracking-widest text-[#0F172A]">TARGET: {targetCgpa}</p>
 </div>
 </div>
 </div>
 </div>
 </div>
 </div>
 </div>
 )
}
