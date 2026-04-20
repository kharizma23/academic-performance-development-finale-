"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
 Calendar,
 CheckCircle,
 Circle,
 Zap,
 Clock,
 Boxes,
 Cpu,
 Code2,
 RotateCcw,
 Sparkles,
 Loader2,
 TrendingUp,
 Map
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

export default function StrategicRoadmap() {
 const router = useRouter()
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
 const res = await fetch(getApiUrl("/student/overview"), { headers })
 if (res.ok) {
 const json = await res.json()
 setData(json.roadmap)
 }
 } catch (error) {
 console.error("Failed to fetch roadmap node", error)
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
 {/* Header Section */}
 <div className="space-y-6">
 <div className="flex items-center gap-6 mb-4">
 <span className="p-3 bg-blue-100 rounded-xl text-blue-600 shadow-sm border border-blue-200">
 <Map className="h-8 w-8" />
 </span>
 <h1 className="text-4xl md:text-6xl font-black  uppercase leading-none text-[#0F172A]">
 Strategic <span className="text-[#2563EB]">Roadmap</span>
 </h1>
 </div>
 
 <div className="p-10 rounded-[3rem] bg-white border border-[#E2E8F0] shadow-md relative overflow-hidden flex items-center gap-10 hover:shadow-xl transition-all duration-500">
 <div className="h-20 w-20 bg-blue-50 rounded-[2.5rem] flex items-center justify-center text-blue-600 shadow-sm border border-blue-100 flex-shrink-0">
 <Sparkles className="h-10 w-10 animate-pulse" />
 </div>
 <p className="text-xl md:text-2xl font-bold text-[#475569] leading-relaxed max-w-5xl uppercase ">
 60-DAY PROD-READINESS PROTOCOL: ACTIVE AND SYNCHRONIZED.
 </p>
 </div>
 </div>

 {/* Strategic Roadmap Module (PREMIUM) */}
 <div className="glass-card bg-white border border-[#E2E8F0] shadow-md p-16 space-y-16 rounded-[4.5rem] hover:shadow-2xl transition-all duration-500">
 <div className="flex flex-col md:flex-row items-center justify-between gap-10 border-b-2 border-blue-600 pb-10">
 <h2 className="text-4xl font-black uppercase  text-[#0F172A] flex items-center gap-6 ">
 <Calendar className="h-10 w-10 text-blue-600" /> 60-Day Progress Node
 </h2>
 <div className="flex items-center gap-8 bg-[#F1F5F9] px-10 py-4 rounded-[2rem] border border-[#CBD5E1] shadow-sm">
 <div className="flex items-center gap-4">
 <span className="h-3 w-3 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]" />
 <span className="text-[10px] font-black uppercase tracking-widest text-[#475569]">Done</span>
 </div>
 <div className="flex items-center gap-4">
 <span className="h-3 w-3 rounded-full bg-[#2563EB] shadow-[0_0_10px_#2563eb]" />
 <span className="text-[10px] font-black uppercase tracking-widest text-[#475569]">Active</span>
 </div>
 <div className="flex items-center gap-4">
 <span className="h-3 w-3 rounded-full bg-slate-300" />
 <span className="text-[10px] font-black uppercase tracking-widest text-[#475569]">Pending</span>
 </div>
 </div>
 </div>

 {/* Timeline Grid (FULL 60-DAY EXPLORATION) */}
 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
 {data?.map((node: any, i: number) => (
 <motion.div 
 key={i}
 initial={{ opacity: 0, scale: 0.95 }}
 animate={{ opacity: 1, scale: 1 }}
 transition={{ delay: i * 0.02 }}
 className={cn(
 "relative flex flex-col p-8 rounded-[2.5rem] border transition-all duration-300 overflow-hidden group shadow-sm",
 node.status === 'Completed' ? "bg-emerald-50 border-emerald-100 opacity-60 grayscale-[0.4] hover:grayscale-0 hover:scale-105" : 
 node.status === 'Active' ? "bg-white border-blue-600 shadow-xl scale-110 z-10 border-2 ring-8 ring-blue-50" : "bg-white border-[#E2E8F0] hover:border-blue-200"
 )}
 >
 <div className="flex items-center justify-between mb-4">
 <span className={cn(
 "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border",
 node.status === 'Completed' ? "bg-white text-emerald-600 border-emerald-100" :
 node.status === 'Active' ? "bg-blue-600 text-white border-blue-400" : "bg-[#F1F5F9] text-[#475569]/40 border-[#E2E8F0]"
 )}>DAY {node.day}</span>
 {node.status === 'Completed' ? <CheckCircle className="h-5 w-5 text-emerald-500" /> : (node.status === 'Active' ? <Zap className="h-5 w-5 text-blue-600 animate-pulse" /> : <Circle className="h-5 w-5 text-[#E2E8F0]" />)}
 </div>
 <h4 className={cn(
 "text-sm font-black uppercase  leading-tight h-12 line-clamp-2",
 node.status === 'Active' ? "text-blue-600" : "text-[#0F172A]"
 )}>{node.topic}</h4>
 <div className="mt-4 pt-4 border-t border-[#F1F5F9] flex items-center justify-between">
 <span className="text-[9px] font-black text-[#475569]/30 uppercase tracking-[0.2em] ">{node.priority}</span>
 <div className="h-8 w-8 rounded-xl bg-slate-50 flex items-center justify-center text-[#475569]/40">
 {node.icon === 'frontend' ? <Boxes className="h-4 w-4" /> : (node.icon === 'backend' ? <Cpu className="h-4 w-4" /> : <Code2 className="h-4 w-4" />)}
 </div>
 </div>
 </motion.div>
 ))}
 </div>
 </div>

 {/* Strategic Intervention Node */}
 <div className="glass-card bg-[#F1F5F9] border border-[#CBD5E1] shadow-md p-14 space-y-12 mt-12 bg-pattern overflow-hidden h-fit rounded-[4rem]">
 <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
 <div className="space-y-6 flex-1">
 <h2 className="text-5xl font-black uppercase  text-[#0F172A] underline decoration-blue-600 underline-offset-[20px] mb-10 leading-tight">Strategic Consistency Node</h2>
 <p className="text-xs font-black text-blue-600 uppercase tracking-[0.4em] flex items-center gap-6 animate-pulse shadow-sm">
 <TrendingUp className="h-8 w-8" /> OPTIMIZING STUDY VELOCITY SETS
 </p>
 </div>
 <div className="p-16 bg-white border border-[#E2E8F0] rounded-[5rem] flex flex-col items-center justify-center text-center shadow-xl hover:shadow-2xl transition-all duration-500 scale-110 md:scale-100 h-fit">
 <p className="text-[10px] font-black text-[#475569]/30 uppercase tracking-[.4em] mb-4">CONSISTENCY SCORE</p>
 <p className="text-[10rem] font-black text-[#0F172A] leading-none  drop-shadow-sm">92<span className="text-3xl ml-3 font-black text-blue-600">%</span></p>
 </div>
 </div>
 </div>
 </div>
 )
}
