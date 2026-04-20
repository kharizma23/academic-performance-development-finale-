"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
 Zap, Loader2, Target, BrainCircuit, 
 Sparkles, LineChart, BookOpen, ChevronRight, 
 Activity, Clock, Rocket
} from "lucide-react"
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from "recharts"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export default function SkillLab() {
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
 const res = await fetch(getApiUrl("/student/skills"), { headers })
 if (res.ok) setData(await res.json())
 } catch (error) {
 console.error("Failed to fetch skill node", error)
 } finally {
 setLoading(false)
 }
 }

 if (loading) return (
 <div className="flex h-[80vh] items-center justify-center">
 <Loader2 className="h-24 w-24 animate-spin text-amber-600" />
 </div>
 )

 const radarData = [
 { subject: 'Coding', A: data?.scores.coding, full: 100 },
 { subject: 'Aptitude', A: data?.scores.aptitude, full: 100 },
 { subject: 'Communication', A: data?.scores.communication, full: 100 },
 { subject: 'Data Science', A: 72, full: 100 },
 { subject: 'DevOps', A: 85, full: 100 },
 { subject: 'Design', A: 64, full: 100 }
 ]

 return (
 <div className="w-full space-y-12 pb-40 text-[#0F172A] font-sans selection:bg-blue-500/10">
 <div className="space-y-6">
 <div className="flex items-center gap-6 mb-4">
 <span className="p-3 bg-amber-100 rounded-xl text-amber-600 border border-amber-200 shadow-sm">
 <Zap className="h-8 w-8" />
 </span>
 <h1 className="text-4xl md:text-6xl font-black  uppercase leading-none text-[#0F172A]">
 Skill <span className="text-amber-600 underline decoration-[#E2E8F0] underline-offset-[16px]">Lab</span>
 </h1>
 </div>

 <div className="p-10 rounded-[3rem] bg-white border border-[#E2E8F0] shadow-md relative overflow-hidden flex items-center gap-10">
 <div className="h-20 w-20 bg-amber-50 rounded-[2rem] flex items-center justify-center text-amber-600 shadow-sm border border-amber-100 flex-shrink-0">
 <BrainCircuit className="h-10 w-10" />
 </div>
 <p className="text-xl md:text-2xl font-bold text-[#475569] leading-relaxed max-w-5xl uppercase">
 AI-DETECTED SKILL GAPS: FOCUS ON SYSTEM DESIGN AND MICROSERVICES TO UNLOCK SENIOR NODE ROLES.
 </p>
 </div>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-8">
 {/* Radar Chart (LIGHT THEME) */}
 <div className="glass-card bg-white border border-[#E2E8F0] shadow-md p-16 space-y-12 h-fit hover:shadow-xl transition-all duration-500">
 <h2 className="text-4xl font-black uppercase  text-[#0F172A] flex items-center gap-6 border-b-2 border-amber-600 pb-6">
 <Activity className="h-10 w-10 text-amber-600 shadow-sm" /> Neutral Analysis Mapping
 </h2>
 <div className="h-[500px]">
 <ResponsiveContainer width="100%" height="100%">
 <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
 <PolarGrid stroke="#F1F5F9" strokeWidth={2} />
 <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 16, fontWeight: '900' }} />
 <PolarRadiusAxis angle={30} domain={[0, 100]} axisLine={false} tick={false} />
 <Radar 
 name="Skills" 
 dataKey="A" 
 stroke="#f59e0b" 
 strokeWidth={6} 
 fill="#f59e0b" 
 fillOpacity={0.4} 
 />
 <Tooltip 
 contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #E2E8F0', borderRadius: '16px', fontSize: '18px', padding: '20px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}
 itemStyle={{ color: '#0F172A', fontWeight: '900' }}
 />
 </RadarChart>
 </ResponsiveContainer>
 </div>
 </div>

 {/* Gap Matrix & Resources (LIGHT THEME) */}
 <div className="space-y-12">
 <div className="glass-card bg-white border border-[#E2E8F0] shadow-md p-12 space-y-10">
 <h2 className="text-3xl font-black uppercase  text-[#0F172A] flex items-center gap-6 border-b-2 border-[#F1F5F9] pb-6 text-center">
 <Target className="h-9 w-9 text-amber-600" /> AI Skill Gap Matrix
 </h2>
 <div className="space-y-6">
 {data?.gap_analysis.map((gap: any, i: number) => (
 <div key={i} className="p-8 rounded-[2rem] bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between group hover:border-amber-600 hover:bg-white transition-all shadow-sm duration-300">
 <div className="space-y-2">
 <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest leading-none">{gap.gap} PRIORITY GAP</p>
 <p className="text-3xl font-black uppercase text-[#0F172A]  leading-none ">{gap.skill}</p>
 <p className="text-xs font-bold text-[#475569]/60 uppercase tracking-widest">{gap.recommendation}</p>
 </div>
 <ChevronRight className="h-10 w-10 text-[#E2E8F0] group-hover:text-amber-600 transition-all scale-75 group-hover:scale-100" />
 </div>
 ))}
 </div>
 </div>

 <div className="glass-card bg-white border border-[#E2E8F0] shadow-md p-12 space-y-10">
 <h2 className="text-3xl font-black uppercase  text-[#0F172A] flex items-center gap-6 border-b-2 border-[#F1F5F9] pb-6">
 <BookOpen className="h-9 w-9 text-blue-600" /> Core Recommendations
 </h2>
 <div className="flex flex-wrap gap-4">
 {data?.recommended_resources.map((res: any, i: number) => (
 <div key={i} className="px-6 py-3 bg-[#F1F5F9] border-2 border-[#CBD5E1] rounded-2xl flex items-center gap-4 group hover:bg-white hover:border-blue-600 transition-all cursor-pointer shadow-sm">
 <p className="text-[10px] font-black uppercase tracking-widest text-[#475569] group-hover:text-[#0F172A] leading-none">{res}</p>
 <span className="h-2 w-2 rounded-full bg-amber-500 shadow-md group-hover:animate-pulse" />
 </div>
 ))}
 </div>
 <Button className="premium-button w-full !h-20 text-xl font-black shadow-xl mt-4 active:scale-95 leading-none">
 <Rocket className="h-7 w-7 mr-4" /> EXPLORE ALL RESOURCES
 </Button>
 </div>
 </div>
 </div>

 {/* Evolution Timeline (LIGHT THEME) */}
 <div className="glass-card bg-white border border-[#E2E8F0] shadow-md p-12 space-y-12 mt-12 bg-pattern overflow-hidden h-fit">
 <h2 className="text-4xl font-black uppercase  text-[#0F172A] flex items-center gap-6 border-b-2 border-blue-600 pb-6 max-w-lg mb-10 w-fit">
 <LineChart className="h-10 w-10 text-blue-600" /> Evolution Timeline Node
 </h2>
 <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden h-fit">
 <div className="absolute h-1 w-full bg-[#E2E8F0] top-1/2 -translate-y-1/2 hidden md:block" />
 {data?.roadmap.map((phase: any, i: number) => (
 <div key={i} className="relative z-10 w-full md:w-auto p-12 bg-white rounded-[2.5rem] border border-[#E2E8F0] flex flex-col items-center text-center space-y-6 shadow-md hover:shadow-xl transition-all duration-500 group border-t-8 border-t-transparent hover:border-t-amber-500">
 <div className={cn(
 "h-16 w-16 rounded-2xl flex items-center justify-center border-2 shadow-sm transition-all",
 phase.status === 'Completed' ? "bg-emerald-50 border-emerald-100 text-emerald-600" :
 phase.status === 'Active' ? "bg-amber-50 border-amber-100 text-amber-600 animate-pulse" : "bg-[#F1F5F9] border-[#E2E8F0] text-[#475569]/40"
 )}>
 {phase.status === 'Completed' ? <CheckCircle2 className="h-8 w-8" /> : (phase.status === 'Active' ? <Zap className="h-8 w-8 text-amber-600" /> : <Clock className="h-8 w-8" />)}
 </div>
 <div className="space-y-4">
 <p className="text-[10px] font-black text-[#475569]/50 uppercase tracking-[0.3em]">{phase.date}</p>
 <p className="text-2xl font-black uppercase text-[#0F172A]  leading-none group-hover:text-amber-600 transition-colors">{phase.phase}</p>
 <p className={cn("text-[10px] font-black uppercase tracking-widest", phase.status === 'Completed' ? "text-emerald-500" : (phase.status === 'Active' ? "text-amber-500" : "text-[#475569]/20"))}>{phase.status}</p>
 </div>
 </div>
 ))}
 </div>
 </div>
 </div>
 )
}

function CheckCircle2(props: any) {
 return (
 <svg
 {...props}
 xmlns="http://www.w3.org/2000/svg"
 width="24"
 height="24"
 viewBox="0 0 24 24"
 fill="none"
 stroke="currentColor"
 strokeWidth="2"
 strokeLinecap="round"
 strokeLinejoin="round"
 >
 <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
 <path d="m9 12 2 2 4-4" />
 </svg>
 )
}
