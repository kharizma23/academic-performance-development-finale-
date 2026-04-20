"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
 Map, Loader2, Target, Sparkles, 
 ArrowUpRight, Rocket, Compass, 
 Zap, BrainCircuit, LineChart, Star
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function CareerNavigator() {
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
 const res = await fetch(getApiUrl("/student/career"), { headers })
 if (res.ok) setData(await res.json())
 } catch (error) {
 console.error("Failed to fetch career node", error)
 } finally {
 setLoading(false)
 }
 }

 if (loading) return (
 <div className="flex h-[80vh] items-center justify-center">
 <Loader2 className="h-24 w-24 animate-spin text-blue-600" />
 </div>
 )

 return (
 <div className="w-full space-y-12 pb-40 text-[#0F172A] font-sans selection:bg-blue-500/10">
 <div className="space-y-6">
 <div className="flex items-center gap-6 mb-4">
 <span className="p-3 bg-blue-100 rounded-xl text-blue-600 border border-blue-200 shadow-sm">
 <Map className="h-8 w-8" />
 </span>
 <h1 className="text-4xl md:text-6xl font-black  uppercase leading-none text-[#0F172A]">
 Career <span className="text-blue-600 underline decoration-[#E2E8F0] underline-offset-[16px]">Navigator</span>
 </h1>
 </div>

 <div className="p-10 rounded-[4rem] bg-white border border-[#E2E8F0] shadow-md relative overflow-hidden flex items-center gap-10">
 <div className="h-20 w-20 bg-blue-50 rounded-[2.5rem] flex items-center justify-center text-blue-600 shadow-sm border border-blue-100 flex-shrink-0">
 <BrainCircuit className="h-10 w-10 animate-pulse" />
 </div>
 <p className="text-xl md:text-2xl font-bold text-[#475569]  leading-relaxed max-w-5xl uppercase">
 AI-DRIVEN RECOMMENDATION: "{data?.ai_recommendations}"
 </p>
 </div>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-8">
 {/* Career Trajectory Nodes (LIGHT THEME) */}
 <div className="glass-card bg-white border border-[#E2E8F0] shadow-md p-16 space-y-12 h-fit hover:shadow-xl transition-all duration-500">
 <h2 className="text-4xl font-black uppercase  text-[#0F172A] flex items-center gap-6 border-b-2 border-blue-600 pb-6">
 <Star className="h-10 w-10 text-blue-600" /> Optimal Trajectory Paths
 </h2>
 <div className="space-y-10">
 {data?.suggested_paths.map((path: any, i: number) => (
 <div key={i} className="p-12 rounded-[3.5rem] bg-[#F8FAFC] border border-[#E2E8F0] group hover:border-blue-600 hover:bg-white transition-all shadow-sm hover:shadow-xl duration-300 flex flex-col md:flex-row items-center gap-10">
 <div className="h-24 w-24 bg-white border-2 border-[#E2E8F0] rounded-[2rem] flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white group-hover:border-none transition-all shadow-sm">
 <Rocket className="h-12 w-12" />
 </div>
 <div className="flex-1 text-center md:text-left">
 <div className="flex items-center justify-center md:justify-start gap-4 mb-3">
 <span className={cn(
 "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm",
 path.readiness === 'High' ? "bg-emerald-50 border-emerald-100 text-emerald-600" : "bg-blue-50 border-blue-100 text-blue-600 font-bold"
 )}>{path.readiness} READINESS</span>
 </div>
 <h4 className="text-4xl font-black text-[#0F172A] uppercase  leading-tight mb-2 group-hover:text-blue-600 transition-colors">{path.role}</h4>
 <div className="flex items-center justify-center md:justify-start gap-3">
 <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest leading-none underline decoration-blue-100 underline-offset-8">MATCH INDEX: {path.match}%</span>
 </div>
 </div>
 <ArrowUpRight className="h-12 w-12 text-[#E2E8F0] group-hover:text-blue-600 transition-all scale-75 group-hover:scale-100" />
 </div>
 ))}
 </div>
 </div>

 {/* Domain Match Matrix (LIGHT THEME) */}
 <div className="space-y-12">
 <div className="glass-card bg-white border border-[#E2E8F0] shadow-md p-16 space-y-12 flex flex-col items-center hover:shadow-xl transition-all duration-500">
 <h2 className="text-3xl font-black uppercase  text-[#0F172A] flex items-center justify-center gap-6 border-b-2 border-[#F1F5F9] pb-6 w-full text-center mb-10">
 <Zap className="h-10 w-10 text-amber-600 shadow-sm" /> Domain Match Matrix
 </h2>
 <div className="grid grid-cols-2 gap-10 w-full">
 {Object.entries(data?.domain_matches || {}).map(([name, match]: any, i: number) => (
 <div key={i} className="flex flex-col items-center justify-center p-10 bg-[#F1F5F9] rounded-[3rem] border border-[#CBD5E1] hover:bg-white hover:border-blue-600 group transition-all shadow-sm">
 <p className="text-[10px] font-black text-[#475569]/40 uppercase tracking-[0.4em] mb-6 text-center leading-none">{name} SECTOR</p>
 <div className="relative h-32 w-32 flex items-center justify-center mb-6">
 <svg className="h-full w-full -rotate-90">
 <circle cx="64" cy="64" r="58" stroke="#E2E8F0" strokeWidth="12" fill="transparent" />
 <circle cx="64" cy="64" r="58" stroke="#2563EB" strokeWidth="12" fill="transparent" strokeDasharray="364.4" strokeDashoffset={364.4 - (364.4 * match) / 100} className="transition-all duration-1000 group-hover:stroke-blue-600" />
 </svg>
 <span className="absolute text-3xl font-black text-[#0F172A]  leading-none">{match}%</span>
 </div>
 </div>
 ))}
 </div>
 </div>

 <div className="glass-card bg-[#2563EB] border border-[#2563EB] shadow-2xl p-12 space-y-8 flex items-center gap-10 text-white rounded-[3.5rem] overflow-hidden group">
 <div className="flex-1 space-y-4 relative z-10">
 <h4 className="text-2xl font-black uppercase  leading-none ">Institutional Readiness</h4>
 <div className="h-4 w-full bg-blue-400/20 rounded-full border border-blue-400/40 p-0.5 shadow-inner">
 <motion.div 
 initial={{ width: 0 }}
 animate={{ width: '82%' }}
 transition={{ duration: 1.5, delay: 0.2 }}
 className="h-full bg-white rounded-full shadow-[0_0_15px_white]"
 />
 </div>
 </div>
 <p className="text-8xl font-black  leading-none relative z-10">82<span className="text-2xl ml-2 font-black">%</span></p>
 </div>
 </div>
 </div>

 {/* Career Delta Node (LIGHT THEME) */}
 <div className="glass-card bg-[#F1F5F9] border border-[#CBD5E1] shadow-md p-14 space-y-12 mt-12 bg-pattern overflow-hidden h-fit">
 <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
 <div className="space-y-6 flex-1 text-center md:text-left">
 <h2 className="text-5xl font-black uppercase  text-[#0F172A] leading-tight underline decoration-blue-600 underline-offset-[20px] mb-10">Career Requirement Delta</h2>
 <p className="text-xs font-black text-[#475569]/40 uppercase tracking-[0.4em] flex items-center justify-center md:justify-start gap-6">
 <LineChart className="h-6 w-6 text-blue-600" /> AI-PATHWAY SYNC REQUIRED
 </p>
 </div>
 <div className="flex flex-wrap items-center justify-center md:justify-end gap-6 md:w-1/2">
 {['SYSTEMS ARCHITECTURE', 'SCALABILITY', 'AI-OPS', 'NEUTRAL LOGIC'].map((skill, i) => (
 <div key={i} className="px-10 py-5 bg-white border border-[#E2E8F0] rounded-[2.5rem] text-[11px] font-black uppercase tracking-widest text-[#0F172A] hover:bg-blue-600 hover:text-white hover:border-none transition-all cursor-pointer shadow-sm leading-none hover:scale-105">
 {skill} NODE
 </div>
 ))}
 </div>
 </div>
 </div>
 </div>
 )
}
