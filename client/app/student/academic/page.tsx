"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
 GraduationCap, Loader2, TrendingUp, BarChart3, 
 BookOpen, CheckCircle2, AlertTriangle, Sparkles 
} from "lucide-react"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from "recharts"
import { cn } from "@/lib/utils"

export default function AcademicJourney() {
 const [data, setData] = useState<any>(null)
 const [trend, setTrend] = useState<any[]>([])
 const [subjects, setSubjects] = useState<any[]>([])
 const [insight, setInsight] = useState<any>(null)
 const [loading, setLoading] = useState(true)

 const getApiUrl = (path: string) => {
 return `http://127.0.0.1:8001${path}`;
 };

 useEffect(() => {
 fetchData()
 }, [])

 const fetchData = async () => {
 const token = localStorage.getItem('token')
 const headers = { 'Authorization': `Bearer ${token}` }
 try {
 const [acadRes, trendRes, subjRes, insightRes] = await Promise.all([
 fetch(getApiUrl("/student/academic"), { headers }),
 fetch(getApiUrl("/student/academic/trend"), { headers }),
 fetch(getApiUrl("/student/academic/subjects"), { headers }),
 fetch(getApiUrl("/student/academic/insight"), { headers })
 ])
 
 if (acadRes.ok) setData(await acadRes.json())
 if (trendRes.ok) setTrend(await trendRes.json())
 if (subjRes.ok) setSubjects(await subjRes.json())
 if (insightRes.ok) setInsight(await insightRes.json())
 } catch (error) {
 console.error("Failed to fetch academic matrix", error)
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
 <span className="p-3 bg-emerald-100 rounded-xl text-emerald-600 border border-emerald-200 shadow-sm">
 <GraduationCap className="h-8 w-8" />
 </span>
 <h1 className="text-4xl md:text-6xl font-black  uppercase leading-none text-[#0F172A]">
 Academic <span className="text-emerald-600">Journey</span>
 </h1>
 </div>

 <div className="p-10 rounded-[2.5rem] bg-white border border-[#E2E8F0] shadow-md relative overflow-hidden flex items-center gap-10">
 <div className="h-20 w-20 bg-emerald-50 rounded-3xl flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-100 flex-shrink-0">
 <Sparkles className="h-10 w-10" />
 </div>
 <p className="text-xl md:text-2xl font-bold text-[#475569] leading-relaxed max-w-5xl">
 "{insight?.analysis || 'Neural pulse stable.'}"
 </p>
 </div>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-8">
 {/* Semester Graph (LIGHT THEME) */}
 <div className="lg:col-span-2 glass-card bg-white border border-[#E2E8F0] shadow-md p-16 space-y-12">
 <h2 className="text-4xl font-black uppercase  text-[#0F172A] flex items-center gap-6 border-b-2 border-emerald-600 pb-6">
 <BarChart3 className="h-10 w-10 text-emerald-600" /> Semester Performance Graph
 </h2>
 <div className="h-[500px]">
 <ResponsiveContainer width="100%" height="100%">
 <BarChart data={trend}>
 <CartesianGrid strokeDasharray="10 10" vertical={false} stroke="#F1F5F9" />
 <XAxis dataKey="sem" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 16, fontWeight: '900' }} />
 <YAxis axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 16, fontWeight: '900' }} />
 <Tooltip 
 contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #E2E8F0', borderRadius: '16px', fontSize: '18px', padding: '20px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}
 itemStyle={{ color: '#0F172A', fontWeight: '900' }}
 />
 <Bar dataKey="cgpa" radius={[12, 12, 0, 0]}>
 {trend?.map((entry: any, index: number) => (
 <Cell key={`cell-${index}`} fill={index === trend.length -1 ? '#10b981' : '#F1F5F9'} />
 ))}
 </Bar>
 </BarChart>
 </ResponsiveContainer>
 </div>
 </div>

 {/* Progress Indicators (LIGHT THEME) */}
 <div className="space-y-12 h-full">
 <div className="glass-card bg-white border border-[#E2E8F0] shadow-md p-12 space-y-12 h-fit hover:shadow-xl transition-all duration-500">
 <div className="space-y-4">
 <p className="text-[11px] font-black uppercase tracking-[0.4em] text-[#475569]/50 underline underline-offset-[12px] decoration-[#E2E8F0]">BACKLOG COUNT</p>
 <p className="text-8xl font-black  text-[#0F172A] leading-none pt-4">{data?.backlogs}</p>
 </div>
 <div className="space-y-4 pt-4">
 <p className="text-[11px] font-black uppercase tracking-[0.4em] text-[#475569]/50 underline underline-offset-[12px] decoration-[#E2E8F0]">GROWTH DELTA</p>
 <div className="flex items-center gap-6">
 <TrendingUp className="h-10 w-10 text-emerald-600" />
 <p className="text-8xl font-black  text-emerald-600 leading-none pt-4 shadow-sm">{data?.improvement_delta}</p>
 </div>
 </div>
 </div>

 <div className="glass-card bg-[#F8FAFC] border border-[#E2E8F0] shadow-md p-10 space-y-8 flex flex-col items-center text-center">
 <div className="h-14 w-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-200">
 <AlertTriangle className="h-8 w-8" />
 </div>
 <h4 className="text-xl font-black text-[#0F172A] uppercase leading-tight ">IMPROVEMENT PROTOCOL ACTIVE</h4>
 <p className="text-sm font-bold text-[#475569] uppercase tracking-widest leading-relaxed">Focus on Sem-4 Cloud Computing to maximize peak CGPA index.</p>
 </div>
 </div>
 </div>

 {/* Subject Mark Matrix (LIGHT THEME) */}
 <div className="glass-card bg-white border border-[#E2E8F0] shadow-md p-12 space-y-12 mt-12 bg-pattern">
 <h2 className="text-4xl font-black uppercase  text-[#0F172A] flex items-center gap-6 border-b-2 border-emerald-600 pb-6 max-w-2xl">
 <BookOpen className="h-10 w-10 text-emerald-600" /> Institutional Subject Nodes
 </h2>
 <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
 {subjects?.map((sub: any, idx: number) => (
 <div key={idx} className="p-12 rounded-[3.5rem] bg-[#F1F5F9] border border-[#CBD5E1] group hover:border-emerald-600 hover:bg-white transition-all shadow-sm hover:shadow-xl flex flex-col justify-between">
 <div className="space-y-6">
 <div className="flex justify-between items-start">
 <div className="h-16 w-16 bg-white border border-[#E2E8F0] rounded-2xl flex items-center justify-center font-black text-2xl text-[#0F172A] group-hover:bg-emerald-600 group-hover:text-white group-hover:border-none shadow-sm transition-all duration-300">
 {sub.grade}
 </div>
 <span className="text-[10px] font-black text-[#475569]/40 uppercase tracking-widest shadow-sm">SEM {sub.sem}</span>
 </div>
 <h4 className="text-3xl font-black text-[#0F172A] uppercase  leading-tight min-h-[80px]">{sub.subject}</h4>
 </div>
 <div className="pt-10 flex items-end justify-between border-t border-[#E2E8F0] group-hover:border-emerald-100">
 <p className="text-[11px] font-black uppercase tracking-[0.3em] text-emerald-600 ">SCORE TOTAL</p>
 <p className="text-6xl font-black text-[#0F172A] leading-none ">{sub.total}</p>
 </div>
 </div>
 ))}
 </div>
 </div>
 </div>
 )
}
