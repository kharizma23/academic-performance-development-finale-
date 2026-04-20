"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
 AlertTriangle, Loader2, ShieldCheck, UserCheck, 
 MessageSquare, ArrowRight, Zap, Target, 
 Sparkles, ShieldAlert, LineChart, Activity, CheckCircle2
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export default function MyAlerts() {
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
 const res = await fetch(getApiUrl("/student/alerts"), { headers })
 if (res.ok) setData(await res.json())
 } catch (error) {
 console.error("Failed to fetch alerts node", error)
 } finally {
 setLoading(false)
 }
 }

 if (loading) return (
 <div className="flex h-[80vh] items-center justify-center">
 <Loader2 className="h-24 w-24 animate-spin text-rose-600" />
 </div>
 )

 return (
 <div className="w-full space-y-12 pb-40 text-[#0F172A] font-sans selection:bg-rose-500/10">
 <div className="space-y-6">
 <div className="flex items-center gap-6 mb-4">
 <span className="p-3 bg-rose-100 rounded-xl text-rose-600 border border-rose-200 shadow-sm">
 <AlertTriangle className="h-8 w-8" />
 </span>
 <h1 className="text-4xl md:text-6xl font-black  uppercase leading-none text-[#0F172A]">
 Alerts <span className="text-rose-600 underline decoration-[#E2E8F0] underline-offset-[16px]">& Support</span>
 </h1>
 </div>

 <div className="p-10 rounded-[4rem] bg-white border border-[#E2E8F0] shadow-md relative overflow-hidden flex items-center gap-10">
 <div className="h-20 w-20 bg-rose-50 rounded-[2.5rem] flex items-center justify-center text-rose-600 shadow-sm border border-rose-100 flex-shrink-0">
 <ShieldAlert className="h-10 w-10 animate-pulse" />
 </div>
 <p className="text-xl md:text-2xl font-bold text-rose-600  uppercase leading-relaxed max-w-5xl">
 STABILITY PROTOCOL: "{data?.active_alerts.length > 0 ? 'CRITICAL DEVIATIONS DETECTED. INITIALIZE BRIDGE SYNC.' : 'ALL NODES WITHIN TOLERANCE. PULSE STABLE.'}"
 </p>
 </div>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-8">
 {/* Active Risk Alerts (LIGHT THEME) */}
 <div className="glass-card bg-white border border-[#E2E8F0] shadow-md p-16 space-y-12 h-fit hover:shadow-xl transition-all duration-500">
 <h2 className="text-4xl font-black uppercase  text-[#0F172A] flex items-center gap-6 border-b-2 border-rose-600 pb-6">
 <ShieldAlert className="h-10 w-10 text-rose-600 shadow-sm" /> Risk Deviation Alerts
 </h2>
 <div className="space-y-10">
 {data?.active_alerts.length > 0 ? data?.active_alerts.map((alert: any, i: number) => (
 <div key={i} className="p-10 rounded-[3.5rem] bg-rose-50 border border-rose-100 group hover:bg-rose-600 hover:border-none transition-all shadow-sm duration-300 flex items-center gap-10">
 <div className="h-20 w-20 bg-white border border-rose-100 group-hover:bg-rose-500 rounded-[2.5rem] flex items-center justify-center text-rose-500 group-hover:text-white transition-all shadow-md">
 <AlertTriangle className="h-10 w-10" />
 </div>
 <div className="flex-1 space-y-2">
 <p className="text-[10px] font-black text-rose-600 group-hover:text-white uppercase tracking-[0.4em] leading-none mb-2 shadow-sm">{alert.type} NODE</p>
 <h4 className="text-3xl font-black text-[#0F172A] group-hover:text-white uppercase  leading-none">{alert.title}</h4>
 <p className="text-sm font-bold text-[#475569]/60 group-hover:text-white/80 uppercase leading-none">{alert.desc}</p>
 </div>
 </div>
 )) : (
 <div className="p-16 rounded-[4rem] bg-emerald-50 border border-emerald-100 text-center space-y-6 shadow-sm hover:shadow-xl transition-all duration-500">
 <CheckCircle2 className="h-20 w-20 text-emerald-500 mx-auto animate-bounce opacity-40 shadow-sm" />
 <p className="text-2xl font-black text-emerald-600 uppercase  underline decoration-emerald-200 underline-offset-8">ALL NODES SYNCHRONIZED</p>
 </div>
 )}
 </div>
 </div>

 {/* Mentor & Bridge Protocol (LIGHT THEME) */}
 <div className="space-y-12">
 <div className="glass-card bg-white border border-[#E2E8F0] shadow-md p-16 space-y-12 hover:shadow-xl transition-all duration-500 text-center">
 <h2 className="text-3xl font-black uppercase  text-[#0F172A] border-b-2 border-blue-600 pb-6 w-fit mx-auto mb-10 shadow-sm flex items-center gap-6">
 <UserCheck className="h-10 w-10 text-blue-600" /> Institutional Mentor
 </h2>
 <div className="p-12 rounded-[3.5rem] bg-[#F1F5F9] border border-[#CBD5E1] shadow-md space-y-10 group relative transition-all duration-500 overflow-hidden hover:bg-white hover:border-blue-600">
 <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:rotate-12 transition-transform h-fit">
 <Zap className="h-24 w-24 text-blue-600" />
 </div>
 <div className="flex flex-col items-center gap-8 relative z-10">
 <div className="h-24 w-24 bg-white border border-[#E2E8F0] rounded-[3.5rem] flex items-center justify-center text-blue-600 shadow-sm group-hover:bg-blue-600 group-hover:text-white group-hover:border-none transition-all duration-300">
 <UserCheck className="h-12 w-12" />
 </div>
 <div className="space-y-2">
 <h4 className="text-4xl font-black uppercase  leading-none group-hover:text-blue-600 transition-colors">{data?.mentor.name}</h4>
 <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#475569]/50 shadow-sm">{data?.mentor.role}</p>
 </div>
 </div>
 <div className="pt-10 border-t border-[#E2E8F0] flex flex-wrap gap-4 items-center justify-center relative z-10 group-hover:border-blue-100">
 <Button className="premium-button !h-16 !px-10 text-xs shadow-xl active:scale-95 leading-none">
 <MessageSquare className="h-5 w-5 mr-3" /> INITIALIZE SYNC
 </Button>
 <Button className="w-fit !h-16 px-10 bg-white border-2 border-[#E2E8F0] text-[#475569] font-black uppercase tracking-widest rounded-2xl hover:bg-slate-50 hover:border-blue-200 hover:text-blue-600 transition-all shadow-sm text-xs leading-none">
 SYNC SCHEDULE
 </Button>
 </div>
 </div>
 </div>

 <div className="glass-card bg-white border border-[#E2E8F0] shadow-md p-12 space-y-10 hover:shadow-xl transition-all duration-500">
 <h2 className="text-3xl font-black uppercase  text-[#0F172A] flex items-center gap-6 border-b-2 border-[#F1F5F9] pb-6 shadow-sm">
 <Zap className="h-9 w-9 text-blue-600" /> Active Intervention Nodes
 </h2>
 <div className="space-y-6">
 {data?.interventions.map((prog: string, i: number) => (
 <div key={i} className="flex items-center justify-between p-8 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[2.5rem] group hover:bg-blue-50 hover:border-blue-600 transition-all shadow-sm duration-300">
 <div className="flex items-center gap-6">
 <div className="h-10 w-10 bg-white border border-[#E2E8F0] rounded-xl flex items-center justify-center text-[#475569] group-hover:bg-blue-600 group-hover:text-white group-hover:border-none transition-all shadow-sm">
 <Target className="h-5 w-5" />
 </div>
 <p className="text-xl font-black text-[#0F172A] uppercase  leading-none group-hover:text-blue-600 transition-all">{prog}</p>
 </div>
 <ArrowRight className="h-6 w-6 text-[#E2E8F0] group-hover:text-blue-600 group-hover:translate-x-2 transition-all scale-75 group-hover:scale-100" />
 </div>
 ))}
 </div>
 </div>
 </div>
 </div>

 {/* AI Stability Hub (LIGHT THEME) */}
 <div className="glass-card bg-[#F1F5F9] border border-[#CBD5E1] shadow-md p-14 space-y-12 mt-12 bg-pattern overflow-hidden h-fit">
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 relative z-10">
 <div className="flex flex-col justify-center space-y-6">
 <h3 className="text-5xl font-black uppercase  text-[#0F172A] underline decoration-blue-600 underline-offset-[20px] mb-10 leading-tight">Neural Stability Insights</h3>
 <p className="text-xs font-black text-blue-600 uppercase tracking-[0.4em] flex items-center gap-6 shadow-sm animate-pulse">
 <Sparkles className="h-8 w-8" /> AI-PATHWAY ANALYSIS STABLE
 </p>
 </div>
 {[
 { title: "BRIDGE SYNCHRONY", desc: "Prioritize DSA Fundamentals bridge node to stabilize placement eligibility index.", icon: Activity },
 { title: "MENTOR CALIBRATION", desc: "Increase recurring sync sets with Dr. Aruna Kumar to optimize academic DNA mapping.", icon: LineChart }
 ].map((sugg, i) => (
 <div key={i} className="p-12 rounded-[4rem] bg-white border border-[#E2E8F0] shadow-sm group hover:border-blue-600 hover:shadow-2xl transition-all duration-300">
 <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-[.4em] mb-6 underline underline-offset-8 decoration-[#E2E8F0] shadow-sm">{sugg.title}</h4>
 <p className="text-2xl font-black text-[#0F172A] leading-relaxed uppercase  group-hover:text-blue-600 transition-colors">"{sugg.desc}"</p>
 <div className="flex justify-end pt-8">
 <sugg.icon className="h-10 w-10 text-[#E2E8F0] group-hover:text-blue-600 transition-all scale-75 group-hover:scale-100" />
 </div>
 </div>
 ))}
 </div>
 </div>
 </div>
 )
}
