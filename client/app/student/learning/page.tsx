"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
 Library, Loader2, Play, FileText, 
 Zap, Bookmark, Search, Clock, 
 Sparkles, ArrowUpRight, CheckCircle2, 
 Target, BrainCircuit, LineChart
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export default function LearningHub() {
 const [data, setData] = useState<any>(null)
 const [loading, setLoading] = useState(true)
 const [filter, setFilter] = useState("All")

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
 const res = await fetch(getApiUrl("/student/resources"), { headers })
 if (res.ok) setData(await res.json())
 } catch (error) {
 console.error("Failed to fetch learning node", error)
 } finally {
 setLoading(false)
 }
 }

 if (loading) return (
 <div className="flex h-[80vh] items-center justify-center">
 <Loader2 className="h-24 w-24 animate-spin text-blue-600" />
 </div>
 )

 const filteredResources = data?.personalized_resources.filter((r: any) => filter === "All" || r.type === filter)

 return (
 <div className="w-full space-y-12 pb-40 text-[#0F172A] font-sans selection:bg-blue-500/10">
 <div className="space-y-6">
 <div className="flex items-center gap-6 mb-4">
 <span className="p-3 bg-blue-100 rounded-xl text-blue-600 border border-blue-200 shadow-sm">
 <Library className="h-8 w-8" />
 </span>
 <h1 className="text-4xl md:text-6xl font-black  uppercase leading-none text-[#0F172A] ">
 Learning <span className="text-blue-600 underline decoration-[#E2E8F0] underline-offset-[16px]">Hub</span>
 </h1>
 </div>

 <div className="p-10 rounded-[4rem] bg-white border border-[#E2E8F0] shadow-md relative overflow-hidden flex items-center gap-10 hover:shadow-xl transition-all duration-500">
 <div className="h-20 w-20 bg-blue-50 rounded-[2.5rem] flex items-center justify-center text-blue-600 shadow-sm border border-blue-100 flex-shrink-0">
 <Sparkles className="h-10 w-10 animate-pulse" />
 </div>
 <p className="text-xl md:text-2xl font-bold text-[#475569]  leading-relaxed max-w-5xl uppercase">
 AI-CURATED REPOSITORY DETECTED. ALL RESOURCE NODES ALIGNED WITH YOUR CAREER TRAJECTORY.
 </p>
 </div>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-8">
 {/* Resource Matrix (LIGHT THEME) */}
 <div className="lg:col-span-2 space-y-10">
 <div className="flex items-center justify-between p-8 bg-white rounded-[2.5rem] border border-[#E2E8F0] shadow-md backdrop-blur-xl">
 <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
 {["All", "Video", "PDF", "Lab"].map((f) => (
 <button 
 key={f}
 onClick={() => setFilter(f)}
 className={cn(
 "px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm leading-none border-2",
 filter === f ? "bg-blue-600 text-white border-blue-600 shadow-lg" : "bg-white text-[#475569]/60 border-[#E2E8F0] hover:bg-slate-50 hover:text-blue-600"
 )}
 > {f} </button>
 ))}
 </div>
 <div className="relative hidden md:block w-72">
 <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-[#475569]/30" />
 <input placeholder="SEARCH REPOSITORY..." className="input-glass !h-14 !pl-14 !pr-6 !text-xs !bg-[#F1F5F9] border-[#E2E8F0] uppercase tracking-widest " />
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
 {filteredResources.map((res: any, i: number) => (
 <div key={i} className="glass-card bg-white border border-[#E2E8F0] shadow-md p-10 space-y-8 group hover:border-blue-600 hover:shadow-2xl transition-all duration-500 flex flex-col justify-between h-[500px]">
 <div className="space-y-6">
 <div className="flex items-center justify-between">
 <div className="h-16 w-16 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[2rem] flex items-center justify-center text-[#475569] group-hover:bg-blue-600 group-hover:text-white group-hover:border-none transition-all shadow-sm">
 {res.type === 'Video' ? <Play className="h-8 w-8" /> : (res.type === 'PDF' ? <FileText className="h-8 w-8" /> : <Zap className="h-8 w-8" />)}
 </div>
 <button className="h-10 w-10 bg-white border border-[#E2E8F0] rounded-full flex items-center justify-center text-[#475569]/40 hover:text-rose-500 hover:border-rose-100 hover:bg-rose-50 transition-all shadow-sm">
 <Bookmark className="h-5 w-5" />
 </button>
 </div>
 <h4 className="text-3xl font-black text-[#0F172A] uppercase leading-tight  h-[100px] line-clamp-3 group-hover:text-blue-600 transition-colors shadow-sm">{res.title}</h4>
 <div className="space-y-5">
 <div className="flex justify-between items-end">
 <p className="text-[10px] font-black text-[#475569]/40 uppercase tracking-[0.2em] underline underline-offset-8 decoration-blue-100">PROGRESS SYNC</p>
 <span className="text-2xl font-black text-blue-600  shadow-sm">{res.progress}%</span>
 </div>
 <div className="h-3 w-full bg-[#F1F5F9] rounded-full border border-[#E2E8F0] overflow-hidden shadow-inner">
 <motion.div 
 initial={{ width: 0 }}
 animate={{ width: `${res.progress}%` }}
 transition={{ duration: 1, delay: 0.5 }}
 className="h-full bg-blue-600 shadow-xl" 
 />
 </div>
 </div>
 </div>
 <Button className="premium-button !h-16 !px-8 text-xs shadow-xl active:scale-95 leading-none group-hover:scale-[1.03] transition-transform">
 INITIALIZE ACCESS <ArrowUpRight className="h-5 w-5 ml-2" />
 </Button>
 </div>
 ))}
 </div>
 </div>

 {/* AI Feature Set (LIGHT THEME) */}
 <div className="space-y-12">
 <div className="glass-card bg-white border border-[#E2E8F0] shadow-md p-12 space-y-10 hover:shadow-xl transition-all duration-500 text-center flex flex-col items-center">
 <h2 className="text-3xl font-black uppercase  text-[#0F172A] border-b-2 border-indigo-600 pb-6 w-full mb-10 shadow-sm flex items-center justify-center gap-6">
 <Sparkles className="h-9 w-9 text-indigo-600" /> AI-PATHWAY SYNC
 </h2>
 <div className="space-y-6 w-full">
 {data?.recommended_topics.map((topic: string, i: number) => (
 <div key={i} className="p-8 rounded-[3rem] bg-[#F1F5F9] border border-[#CBD5E1] flex items-center gap-6 group hover:bg-white hover:border-indigo-600 transition-all shadow-sm duration-300">
 <div className="h-10 w-10 bg-white border border-[#E2E8F0] rounded-xl flex items-center justify-center text-[#475569] group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
 <Zap className="h-5 w-5" />
 </div>
 <p className="text-xl font-black text-[#0F172A] uppercase  group-hover:text-indigo-600 transition-colors">{topic}</p>
 </div>
 ))}
 </div>
 </div>

 <div className="glass-card bg-[#0F172A] border border-[#0F172A] shadow-2xl p-12 space-y-10 flex-1 h-fit text-white rounded-[4rem] group overflow-hidden">
 <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-125 transition-transform duration-1000 h-fit">
 <Bookmark className="h-24 w-24" />
 </div>
 <h2 className="text-3xl font-black uppercase  text-white flex items-center gap-6 border-b border-white/10 pb-6 shadow-sm relative z-10 w-full mb-10">
 <Bookmark className="h-9 w-9 text-blue-400" /> Hub Bookmarks
 </h2>
 <div className="space-y-6 relative z-10">
 {data?.bookmarks.map((bm: string, i: number) => (
 <div key={i} className="flex items-center justify-between p-6 bg-white/5 border border-white/5 rounded-[2rem] group cursor-pointer hover:bg-white/10 transition-all h-16 shadow-md border-l-8 border-l-blue-600 pl-8">
 <p className="text-sm font-black text-white/80 group-hover:text-white uppercase tracking-widest line-clamp-1 leading-none">{bm}</p>
 <ArrowUpRight className="h-5 w-5 text-white/20 group-hover:text-white transition-all" />
 </div>
 ))}
 </div>
 </div>
 </div>
 </div>

 {/* Hub Stability Delta (LIGHT THEME) */}
 <div className="glass-card bg-[#F1F5F9] border border-[#CBD5E1] shadow-md p-14 space-y-12 mt-12 bg-pattern overflow-hidden h-fit">
 <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
 <div className="space-y-6 flex-1 text-center md:text-left">
 <h2 className="text-6xl font-black uppercase  text-[#0F172A] underline decoration-blue-600 underline-offset-[20px] mb-10 shadow-sm leading-tight">Institutional Hub Stability</h2>
 <p className="text-xs font-black text-blue-600 uppercase tracking-[0.4em] flex items-center justify-center md:justify-start gap-6 animate-pulse shadow-sm">
 <CheckCircle2 className="h-8 w-8" /> REPOSITORY SYNC STATUS: 100% ONLINE
 </p>
 </div>
 <div className="p-16 bg-white border border-[#E2E8F0] rounded-[5rem] flex flex-col items-center justify-center text-center shadow-xl hover:shadow-2xl transition-all duration-500 scale-110 md:scale-100">
 <p className="text-[10px] font-black text-[#475569]/30 uppercase tracking-[.4em] mb-4">HUB STABILITY</p>
 <p className="text-[10rem] font-black text-[#0F172A] leading-none  drop-shadow-sm">94<span className="text-3xl ml-3 font-black text-blue-600">%</span></p>
 </div>
 </div>
 </div>
 </div>
 )
}
