"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
 BarChart3, Loader2, Target, CheckCircle2, 
 AlertCircle, Activity, Sparkles, TrendingUp, 
 Trophy, LineChart, PieChart, ShieldAlert
} from "lucide-react"
import { ResponsiveContainer, PieChart as RePieChart, Pie, Cell, Tooltip, Legend } from "recharts"
import { cn } from "@/lib/utils"

export default function MyResultsAnalytics() {
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
 const res = await fetch(getApiUrl("/student/results"), { headers })
 if (res.ok) setData(await res.json())
 } catch (error) {
 console.error("Failed to fetch results node", error)
 } finally {
 setLoading(false)
 }
 }

 if (loading) return (
 <div className="flex h-[80vh] items-center justify-center">
 <Loader2 className="h-24 w-24 animate-spin text-indigo-600" />
 </div>
 )

 const COLORS = ['#2563EB', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']

 return (
 <div className="w-full space-y-12 pb-40 text-[#0F172A] font-sans selection:bg-blue-500/10">
 <div className="space-y-6">
 <div className="flex items-center gap-6 mb-4">
 <span className="p-3 bg-indigo-100 rounded-xl text-indigo-600 border border-indigo-200 shadow-sm">
 <BarChart3 className="h-8 w-8" />
 </span>
 <h1 className="text-4xl md:text-6xl font-black  uppercase leading-none text-[#0F172A]">
 Results <span className="text-indigo-600 underline decoration-[#E2E8F0] underline-offset-[16px]">Analytics</span>
 </h1>
 </div>
 
 <div className="p-10 rounded-[3rem] bg-white border border-[#E2E8F0] shadow-md relative overflow-hidden flex items-center gap-10">
 <div className="h-20 w-20 bg-indigo-50 rounded-[2rem] flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100 flex-shrink-0">
 <TrendingUp className="h-10 w-10" />
 </div>
 <p className="text-xl md:text-2xl font-bold text-[#475569] tracking-tigher uppercase leading-relaxed w-full">
 NEURAL FEEDBACK: "{data?.ai_feedback}"
 </p>
 </div>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-8">
 {/* Ranking Analytics Node (LIGHT THEME) */}
 <div className="glass-card bg-white border border-[#E2E8F0] shadow-md p-16 space-y-12 h-fit hover:shadow-xl transition-all duration-500">
 <h2 className="text-3xl font-black uppercase  text-[#0F172A] flex items-center gap-6 border-b-2 border-indigo-600 pb-6">
 <Trophy className="h-10 w-10 text-indigo-600 shadow-sm" /> Global Rank Analytics
 </h2>
 <div className="grid grid-cols-2 gap-10">
 {data?.test_results.map((res: any, i: number) => (
 <div key={i} className="p-10 rounded-[3rem] bg-[#F8FAFC] border border-[#E2E8F0] space-y-6 hover:bg-white hover:border-indigo-600 transition-all group shadow-sm">
 <p className="text-[10px] font-black text-[#475569]/40 uppercase tracking-[0.4em]">{res.exam} NODE</p>
 <div className="space-y-2">
 <p className="text-6xl font-black text-[#0F172A] drop-shadow-sm group-hover:scale-105 transition-transform">#{res.rank}</p>
 <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{res.percentile}% PERCENTILE</p>
 </div>
 <div className="h-3 w-full bg-[#E2E8F0] rounded-full overflow-hidden border border-[#CBD5E1] shadow-inner">
 <motion.div 
 initial={{ width: 0 }}
 animate={{ width: `${res.percentile}%` }}
 transition={{ duration: 1, delay: 0.5 }}
 className="h-full bg-indigo-600 shadow-md" 
 />
 </div>
 </div>
 ))}
 </div>
 </div>

 {/* Accuracy Delta Projection (LIGHT THEME) */}
 <div className="glass-card bg-white border border-[#E2E8F0] shadow-md p-16 space-y-12 h-full flex flex-col justify-center items-center hover:shadow-xl transition-all duration-500">
 <h2 className="text-3xl font-black uppercase  text-[#0F172A] flex items-center gap-6 border-b-2 border-[#F1F5F9] pb-6 w-full text-center mb-10">
 <PieChart className="h-10 w-10 text-blue-600 shadow-sm" /> Accuracy Multi-Matrix
 </h2>
 <div className="h-[400px] w-full">
 <ResponsiveContainer width="100%" height="100%">
 <RePieChart>
 <Pie 
 data={[
 { name: 'ACCURATE NODES', value: 85 },
 { name: 'DEVIATION NODES', value: 15 }
 ]} 
 cx="50%" 
 cy="50%" 
 innerRadius={110} 
 outerRadius={180} 
 paddingAngle={10} 
 dataKey="value"
 stroke="none"
 >
 <Cell fill="#2563EB" />
 <Cell fill="#F1F5F9" />
 </Pie>
 <Tooltip 
 contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #E2E8F0', borderRadius: '16px', fontSize: '18px', padding: '20px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}
 itemStyle={{ color: '#0F172A', fontWeight: '900' }}
 />
 <Legend 
 verticalAlign="bottom" 
 align="center" 
 wrapperStyle={{ paddingTop: '40px', fontSize: '14px', fontWeight: '900', textTransform: 'uppercase', color: '#475569' }}
 />
 </RePieChart>
 </ResponsiveContainer>
 </div>
 </div>
 </div>

 {/* Critical Weak Area Nodes (LIGHT THEME) */}
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mt-12 bg-rose-50 p-12 rounded-[4rem] border border-rose-100 shadow-md">
 <div className="flex flex-col justify-center space-y-6">
 <h2 className="text-5xl font-black uppercase  text-[#0F172A] leading-tight">Weak Node Intelligence</h2>
 <p className="text-xs font-black text-rose-600 uppercase tracking-[0.4em] flex items-center gap-4 animate-pulse">
 <ShieldAlert className="h-6 w-6" /> CRITICAL DEVIATIONS DETECTED
 </p>
 </div>
 {data?.weak_areas.map((area: string, i: number) => (
 <div key={i} className="p-12 rounded-[3.5rem] bg-white border border-[#E2E8F0] shadow-sm group hover:border-rose-600 hover:shadow-xl transition-all duration-300">
 <div className="h-16 w-16 bg-rose-100 border-2 border-rose-200 rounded-[2rem] flex items-center justify-center text-rose-600 mb-8 group-hover:bg-rose-600 group-hover:text-white group-hover:border-none transition-all shadow-sm">
 <ShieldAlert className="h-9 w-9" />
 </div>
 <h4 className="text-3xl font-black text-[#0F172A] uppercase  leading-tight mb-4 group-hover:text-rose-600">{area}</h4>
 <div className="flex items-center gap-4 text-[10px] font-black text-[#475569]/40 uppercase tracking-widest">
 <Activity className="h-4 w-4" /> RECALIBRATION REQUIRED
 </div>
 </div>
 ))}
 </div>

 {/* Global Test Synchrony (LIGHT THEME) */}
 <div className="glass-card bg-white border border-[#E2E8F0] shadow-md p-12 space-y-12 mt-12 hover:shadow-xl transition-all duration-500">
 <h2 className="text-4xl font-black uppercase  text-[#0F172A] flex items-center gap-6 border-b-2 border-indigo-600 pb-6 w-full">
 <CheckCircle2 className="h-10 w-10 text-indigo-600 shadow-sm" /> Global Synchronization Log
 </h2>
 <div className="space-y-6">
 {data?.test_results.map((res: any, i: number) => (
 <div key={i} className="p-10 rounded-[3rem] bg-[#F8FAFC] border border-[#E2E8F0] hover:bg-white hover:border-indigo-600 transition-all flex items-center justify-between group shadow-sm">
 <div className="flex items-center gap-10">
 <div className="h-16 w-16 rounded-2xl bg-white border border-[#E2E8F0] flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
 <Sparkles className="h-8 w-8" />
 </div>
 <div>
 <p className="text-[10px] font-black text-[#475569]/40 uppercase tracking-[0.4em] leading-none mb-2">EXAM ENTITY</p>
 <p className="text-3xl font-black text-[#0F172A] uppercase ">{res.exam}</p>
 </div>
 </div>
 <div className="text-right space-y-2">
 <p className="text-6xl font-black text-[#0F172A] leading-none  group-hover:text-indigo-600 transition-colors">{res.score}%</p>
 <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest opacity-60">STABLE RESPONSE</p>
 </div>
 </div>
 ))}
 </div>
 </div>
 </div>
 )
}
