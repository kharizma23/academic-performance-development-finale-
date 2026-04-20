"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
 LineChart, Loader2, Target, CheckCircle2, 
 Sparkles, Zap, TrendingUp, Activity, 
 ArrowUpRight, Clock, ShieldCheck, 
 Radar, Gauge
} from "lucide-react"
import { ResponsiveContainer, LineChart as ReLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area } from "recharts"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export default function ProgressTracker() {
 const [data, setData] = useState<any>(null)
 const [loading, setLoading] = useState(true)

 const getApiUrl = (path: string) => {
 return `http://127.0.0.1:8000${path}`;
 };

 useEffect(() => {
 fetchData()
 }, [])

 const fetchData = async () => {
 const token = localStorage.getItem('token')
 const headers = { 'Authorization': `Bearer ${token}` }
 try {
 const res = await fetch(getApiUrl("/student/progress"), { headers })
 if (res.ok) setData(await res.json())
 } catch (error) {
 console.error("Failed to fetch progress node", error)
 } finally {
 setLoading(false)
 }
 }

 if (loading) return (
 <div className="flex h-[80vh] items-center justify-center">
 <Loader2 className="h-24 w-24 animate-spin text-emerald-600" />
 </div>
 )

 return (
 <div className="w-full space-y-12 pb-40 text-[#0F172A] font-sans selection:bg-emerald-500/10">
 <div className="space-y-6">
 <div className="flex items-center gap-6 mb-4">
 <span className="p-3 bg-emerald-100 rounded-xl text-emerald-600 border border-emerald-200 shadow-sm">
 <LineChart className="h-8 w-8" />
 </span>
 <h1 className="text-4xl md:text-6xl font-black  uppercase leading-none text-[#0F172A]">
 Progress <span className="text-emerald-600 underline decoration-[#E2E8F0] underline-offset-[16px]">Tracker</span>
 </h1>
 </div>

 <div className="p-10 rounded-[4rem] bg-white border border-[#E2E8F0] shadow-md relative overflow-hidden flex items-center gap-10 hover:shadow-xl transition-all duration-500">
 <div className="h-20 w-20 bg-emerald-50 rounded-[2.5rem] flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-100 flex-shrink-0">
 <Gauge className="h-10 w-10 animate-pulse" />
 </div>
 <p className="text-xl md:text-2xl font-bold text-[#475569]  leading-relaxed max-w-5xl uppercase">
 PEAK PERFORMANCE DETECTED: "{data?.ai_feedback}"
 </p>
 </div>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-8">
 {/* Weekly Progress Sync (LIGHT THEME) */}
 <div className="glass-card bg-white border border-[#E2E8F0] shadow-md p-16 space-y-12 h-fit hover:shadow-xl transition-all duration-500">
 <h2 className="text-4xl font-black uppercase  text-[#0F172A] flex items-center gap-6 border-b-2 border-emerald-600 pb-6">
 <CheckCircle2 className="h-10 w-10 text-emerald-600 shadow-sm" /> Weekly Synchronization
 </h2>
 <div className="h-[400px]">
 <ResponsiveContainer width="100%" height="100%">
 <AreaChart data={data?.weekly_tracking}>
 <defs>
 <linearGradient id="progGlow" x1="0" y1="0" x2="0" y2="1">
 <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
 <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
 </linearGradient>
 </defs>
 <CartesianGrid strokeDasharray="10 10" vertical={false} stroke="#F1F5F9" />
 <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 18, fontWeight: '900' }} />
 <YAxis axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 18, fontWeight: '900' }} />
 <Tooltip 
 contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #E2E8F0', borderRadius: '16px', fontSize: '18px', padding: '20px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}
 itemStyle={{ color: '#0F172A', fontWeight: '900' }}
 />
 <Area type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={8} fill="url(#progGlow)" />
 <Area type="monotone" dataKey="tasks" stroke="#CBD5E1" strokeWidth={4} strokeDasharray="12 12" fill="transparent" />
 </AreaChart>
 </ResponsiveContainer>
 </div>
 <div className="flex items-center justify-between p-8 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[2.5rem] group hover:bg-white hover:border-emerald-600 transition-all shadow-sm">
 <div className="space-y-1">
 <p className="text-[10px] font-black text-[#475569]/40 uppercase tracking-[.4em] leading-none mb-2">TASK COMPLETION DELTA</p>
 <p className="text-4xl font-black text-[#0F172A]  group-hover:text-emerald-600 transition-colors">{data?.task_completion_rate}%</p>
 </div>
 <CheckCircle2 className="h-12 w-12 text-emerald-600 shadow-sm opacity-60" />
 </div>
 </div>

 {/* Growth & Stability Matrix (LIGHT THEME) */}
 <div className="space-y-12">
 <div className="glass-card bg-white border border-[#E2E8F0] shadow-md p-16 space-y-12 flex flex-col items-center hover:shadow-xl transition-all duration-500">
 <h2 className="text-3xl font-black uppercase  text-[#0F172A] flex items-center justify-center gap-6 border-b-2 border-[#F1F5F9] pb-6 w-full text-center mb-10">
 <TrendingUp className="h-10 w-10 text-blue-600 shadow-sm" /> Institutional Projection
 </h2>
 <div className="flex items-center justify-center gap-12 py-12 relative overflow-hidden h-fit w-full">
 <div className="absolute inset-0 bg-blue-100/10 -rotate-12 translate-x-12 opacity-40 group-hover:scale-150 transition-all duration-1000" />
 <p className="text-[12rem] font-black text-[#0F172A] leading-none  drop-shadow-sm relative z-10">{data?.academic_growth?.toFixed(1)}</p>
 <div className="h-32 w-[6px] bg-[#E2E8F0] rounded-full relative z-10" />
 <div className="space-y-4 relative z-10">
 <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.5em] underline decoration-[#E2E8F0] decoration-2 underline-offset-8 leading-none mb-2">DELTA PULSE</p>
 <p className="text-3xl font-black text-[#475569]/60 uppercase leading-none">+0.4 SEM-GROWTH</p>
 </div>
 </div>
 <Button className="premium-button w-full !h-24 text-2xl font-black active:scale-95 shadow-xl leading-none">
 <ArrowUpRight className="h-8 w-8 mr-4" /> EXPLORE DETAILED SCALE
 </Button>
 </div>

 <div className="grid grid-cols-2 gap-10">
 <div className="glass-card bg-white border border-[#E2E8F0] shadow-md p-10 space-y-6 flex flex-col items-center justify-center text-center group hover:border-emerald-600 hover:bg-emerald-50 transition-all duration-300">
 <Zap className="h-14 w-14 text-white p-4 bg-emerald-600 rounded-[2rem] shadow-lg transition-transform group-hover:scale-110" />
 <div className="space-y-2">
 <p className="text-[10px] font-black text-[#475569]/30 uppercase tracking-[.2em] leading-none mb-1">SKILL IMPROVEMENT</p>
 <p className="text-xl font-black text-[#0F172A] uppercase leading-none group-hover:text-emerald-600 transition-colors shadow-sm">{data?.skill_improvement.split('in')[0]}</p>
 </div>
 </div>
 <div className="glass-card bg-white border border-[#E2E8F0] shadow-md p-10 space-y-6 flex flex-col items-center justify-center text-center group hover:border-blue-600 hover:bg-blue-50 transition-all duration-300">
 <ShieldCheck className="h-14 w-14 text-white p-4 bg-blue-600 rounded-[2rem] shadow-lg transition-transform group-hover:rotate-12" />
 <div className="space-y-2">
 <p className="text-[10px] font-black text-[#475569]/30 uppercase tracking-[.2em] leading-none mb-1">RANK STABILITY</p>
 <p className="text-xl font-black text-[#0F172A] uppercase leading-none group-hover:text-blue-600 transition-colors shadow-sm">PEAK-CONSISTENT</p>
 </div>
 </div>
 </div>
 </div>
 </div>

 {/* Neurometric Delta Hub (LIGHT THEME) */}
 <div className="glass-card bg-[#F1F5F9] border border-[#CBD5E1] shadow-md p-14 space-y-12 mt-12 bg-pattern overflow-hidden h-fit">
 <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
 <div className="space-y-6 flex-1 text-center md:text-left">
 <h2 className="text-6xl font-black uppercase  text-[#0F172A] underline decoration-blue-600 underline-offset-[20px] mb-10 shadow-sm leading-tight">Neurometric Synchrony</h2>
 <p className="text-xs font-black text-[#475569]/40 uppercase tracking-[0.4em] flex items-center justify-center md:justify-start gap-6 shadow-sm">
 <Activity className="h-8 w-8 text-blue-600 animate-pulse" /> SYSTEM-WIDE ACCURACY: 98.4% STABLE
 </p>
 </div>
 <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
 {[
 { label: "VELOCITY", val: "88%" },
 { label: "CONSISTENCY", val: "94%" },
 { label: "ACCURACY", val: "82%" },
 { label: "SYNC", val: "100%" }
 ].map((stat, i) => (
 <div key={i} className="p-10 bg-white border border-[#E2E8F0] rounded-[3.5rem] flex flex-col items-center text-center space-y-3 shadow-md hover:bg-blue-600 group hover:border-none transition-all duration-300">
 <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#475569]/50 group-hover:text-white group-hover:opacity-60 transition-all shadow-sm leading-none">{stat.label}</p>
 <p className="text-4xl font-black drop-shadow-sm font-mono leading-none group-hover:text-white transition-colors ">{stat.val}</p>
 </div>
 ))}
 </div>
 </div>
 </div>
 </div>
 )
}
