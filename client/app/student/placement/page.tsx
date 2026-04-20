"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
 Rocket, Loader2, Target, CheckCircle2, 
 ArrowUpRight, Sparkles, FileText, 
 MessageSquare, Zap, Trophy, ShieldCheck, 
 Play
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export default function PlacementBooster() {
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
 const res = await fetch(getApiUrl("/student/placement"), { headers })
 if (res.ok) setData(await res.json())
 } catch (error) {
 console.error("Failed to fetch placement node", error)
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
 <div className="w-full space-y-12 pb-40 text-[#0F172A] font-sans selection:bg-blue-500/10">
 <div className="space-y-6">
 <div className="flex items-center gap-6 mb-4">
 <span className="p-3 bg-emerald-100 rounded-xl text-emerald-600 border border-emerald-200 shadow-sm">
 <Rocket className="h-8 w-8" />
 </span>
 <h1 className="text-4xl md:text-6xl font-black  uppercase leading-none text-[#0F172A]">
 Placement <span className="text-emerald-600 underline decoration-[#E2E8F0] underline-offset-[16px]">Booster</span>
 </h1>
 </div>

 <div className="p-10 rounded-[4rem] bg-white border border-[#E2E8F0] shadow-md relative overflow-hidden flex items-center gap-10">
 <div className="h-20 w-20 bg-emerald-50 rounded-[2.5rem] flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-100 flex-shrink-0">
 <Trophy className="h-10 w-10 animate-bounce" />
 </div>
 <p className="text-xl md:text-2xl font-bold text-[#475569]  uppercase leading-relaxed max-w-5xl">
 PLACEMENT STATUS: ELIGIBLE FOR 42+ HIGH-INDEX CORPORATE NODES.
 </p>
 </div>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-8">
 {/* Eligible Company Nodes (LIGHT THEME) */}
 <div className="glass-card bg-white border border-[#E2E8F0] shadow-md p-16 space-y-12 h-fit hover:shadow-xl transition-all duration-500">
 <h2 className="text-4xl font-black uppercase  text-[#0F172A] flex items-center gap-6 border-b-2 border-emerald-600 pb-6">
 <Trophy className="h-10 w-10 text-emerald-600 shadow-sm" /> Global Career Gateway
 </h2>
 <div className="space-y-10">
 {data?.eligible_companies.map((comp: any, i: number) => (
 <div key={i} className="p-12 rounded-[3.5rem] bg-[#F8FAFC] border border-[#E2E8F0] group hover:border-emerald-600 hover:bg-white transition-all shadow-sm hover:shadow-xl duration-300 flex items-center justify-between">
 <div className="space-y-4">
 <div className="flex items-center gap-4">
 <span className={cn(
 "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm transition-all",
 comp.status === 'High Priority' ? "bg-emerald-600 text-white border-emerald-100" : "bg-[#F1F5F9] border-[#CBD5E1] text-[#475569]/60 group-hover:bg-emerald-50 group-hover:text-emerald-600"
 )}>{comp.status}</span>
 <span className="text-[10px] font-black text-[#475569]/40 uppercase tracking-widest leading-none">MATCH: {comp.match}%</span>
 </div>
 <h4 className="text-4xl font-black text-[#0F172A] uppercase  leading-none group-hover:text-emerald-600 transition-colors">{comp.name}</h4>
 <p className="text-[11px] font-black text-[#475569]/50 uppercase tracking-[0.4em] ">{comp.role}</p>
 </div>
 <ArrowUpRight className="h-12 w-12 text-[#E2E8F0] group-hover:text-emerald-600 transition-all scale-75 group-hover:scale-100" />
 </div>
 ))}
 </div>
 </div>

 {/* Rating & Insights (LIGHT THEME) */}
 <div className="space-y-12">
 <div className="glass-card bg-white border border-[#E2E8F0] shadow-md p-16 space-y-12 flex flex-col items-center hover:shadow-xl transition-all duration-500">
 <div className="space-y-4 text-center w-full">
 <h2 className="text-3xl font-black uppercase  text-[#0F172A] flex items-center justify-center gap-6 underline underline-offset-[20px] decoration-emerald-600 mb-12 shadow-sm">
 <FileText className="h-10 w-10 text-emerald-600 shadow-sm" /> Resume Neural Rating
 </h2>
 <div className="relative h-56 w-56 mx-auto flex items-center justify-center bg-[#F8FAFC] border-8 border-emerald-50 rounded-full shadow-inner group overflow-hidden">
 <div className="absolute inset-0 bg-emerald-600/5 group-hover:bg-emerald-600 transition-colors duration-500" />
 <span className="relative z-10 text-8xl font-black text-[#0F172A] group-hover:text-white leading-none drop-shadow-sm transition-colors duration-500">{data?.resume_score}<span className="text-2xl font-black ml-2">%</span></span>
 </div>
 <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.5em] mt-8 shadow-sm">PEAK ARTIFACT STABILITY</p>
 </div>
 <Button className="premium-button !bg-emerald-600 hover:!bg-emerald-500 !h-24 !px-12 text-2xl font-black shadow-xl mt-8 animate-pulse hover:animate-none">
 <Zap className="h-8 w-8 mr-4" /> AUTO-TUNE ARTIFACT
 </Button>
 </div>

 <div className="glass-card bg-[#F1F5F9] border border-[#CBD5E1] shadow-md p-10 space-y-10 group hover:bg-white hover:border-blue-600 transition-all duration-300">
 <h2 className="text-3xl font-black uppercase  text-[#0F172A] flex items-center gap-6 border-b-2 border-white pb-6 shadow-sm">
 <MessageSquare className="h-9 w-9 text-blue-600" /> Interview Intelligence
 </h2>
 <div className="space-y-6">
 {data?.interview_tips.map((tip: string, i: number) => (
 <div key={i} className="p-8 rounded-[2.5rem] bg-white border border-[#E2E8F0] flex items-center gap-8 group hover:bg-blue-50 hover:border-blue-200 transition-all shadow-sm">
 <div className="h-12 w-12 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl flex items-center justify-center font-black text-[#0F172A] group-hover:bg-emerald-600 group-hover:text-white group-hover:border-none transition-all shadow-sm">
 <span className="text-xl font-black leading-none">{i+1}</span>
 </div>
 <p className="text-xl font-black text-[#0F172A] uppercase  leading-relaxed">{tip}</p>
 </div>
 ))}
 </div>
 </div>
 </div>
 </div>

 {/* Mock Delta Node (LIGHT THEME) */}
 <div className="glass-card bg-white border border-[#E2E8F0] shadow-md p-12 space-y-12 mt-12 bg-pattern overflow-hidden h-fit">
 <h2 className="text-4xl font-black uppercase  text-[#0F172A] flex items-center gap-6 border-b-2 border-blue-600 pb-6 max-w-lg mb-10 w-fit">
 <Play className="h-10 w-10 text-blue-600" /> Mock Simulation Delta
 </h2>
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
 {data?.mock_tests.map((test: any, i: number) => (
 <div key={i} className="p-12 bg-[#F1F5F9] rounded-[4.5rem] border border-[#CBD5E1] flex flex-col items-center text-center space-y-6 group hover:bg-white hover:border-blue-600 hover:shadow-xl transition-all duration-500">
 <div className="h-20 w-20 rounded-[2.5rem] bg-white border border-[#E2E8F0] flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm group-hover:scale-110">
 <ShieldCheck className="h-10 w-10" />
 </div>
 <div className="space-y-4">
 <p className="text-[10px] font-black text-[#475569]/30 uppercase tracking-[.2em]">{test.type} NODE</p>
 <p className="text-7xl font-black text-[#0F172A]  leading-none group-hover:text-blue-600 transition-colors font-mono">{test.score}<span className="text-2xl ml-1 font-black">%</span></p>
 <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest leading-none shadow-sm">STABLE RESPONSE</p>
 </div>
 </div>
 ))}
 <div className="p-12 bg-white rounded-[4.5rem] border-4 border-dashed border-[#E2E8F0] flex flex-col items-center justify-center text-center space-y-6 group hover:border-blue-600 hover:bg-blue-50 transition-all duration-500 shadow-sm cursor-pointer">
 <div className="h-24 w-24 bg-[#F8FAFC] border-2 border-[#E2E8F0] rounded-full flex items-center justify-center text-[#E2E8F0] group-hover:bg-blue-600 group-hover:text-white group-hover:border-none transition-all shadow-md group-hover:scale-110">
 <Play className="h-10 w-10" />
 </div>
 <p className="text-[10px] font-black text-[#475569]/40 uppercase tracking-[0.4em] mb-2 group-hover:text-blue-600 transition-colors">INITIALIZE NEW MOCK</p>
 </div>
 </div>
 </div>
 </div>
 )
}
