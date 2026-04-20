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
    return `http://127.0.0.1:8001${path}`;
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
    <div className="flex h-[40vh] items-center justify-center">
      <Loader2 className="h-10 w-10 animate-spin text-emerald-600" />
    </div>
  )

  return (
    <div className="w-full space-y-8 pb-20 text-[#0F172A] font-sans selection:bg-emerald-500/10">
      <div className="space-y-4">
        <div className="flex items-center gap-4 mb-2">
          <span className="p-2 bg-emerald-100 rounded-xl text-emerald-600 border border-emerald-200 shadow-sm">
            <LineChart className="h-6 w-6" />
          </span>
          <h1 className="text-3xl md:text-4xl font-black uppercase leading-none text-[#0F172A]">
            Progress <span className="text-emerald-600">Tracker</span>
          </h1>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm relative overflow-hidden flex items-center gap-6 hover:shadow-md transition-all">
          <div className="h-12 w-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-100 flex-shrink-0">
            <Gauge className="h-6 w-6 animate-pulse" />
          </div>
          <p className="text-sm font-bold text-[#475569] leading-relaxed max-w-5xl uppercase">
            PEAK PERFORMANCE DETECTED: "{data?.ai_feedback}"
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weekly Progress Sync (LIGHT THEME) */}
        <div className="bg-white border border-[#E2E8F0] shadow-sm p-8 space-y-8 rounded-[2.5rem] hover:shadow-md transition-all h-fit">
          <h2 className="text-2xl font-black uppercase text-[#0F172A] flex items-center gap-4 border-b border-[#F1F5F9] pb-4">
            <CheckCircle2 className="h-6 w-6 text-emerald-600" /> Weekly Synchronization
          </h2>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.weekly_tracking}>
                <defs>
                  <linearGradient id="progGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 10, fontWeight: 'bold' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 10, fontWeight: 'bold' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #E2E8F0', borderRadius: '12px', fontSize: '12px', padding: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}
                  itemStyle={{ color: '#0F172A', fontWeight: '900' }}
                />
                <Area type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={3} fill="url(#progGlow)" />
                <Area type="monotone" dataKey="tasks" stroke="#CBD5E1" strokeWidth={2} strokeDasharray="5 5" fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-between p-6 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl group hover:bg-white hover:border-emerald-600 transition-all shadow-sm">
            <div className="space-y-1">
              <p className="text-[9px] font-black text-[#475569]/60 uppercase tracking-widest leading-none mb-1">TASK COMPLETION DELTA</p>
              <p className="text-2xl font-black text-[#0F172A] group-hover:text-emerald-600 transition-colors">{data?.task_completion_rate}%</p>
            </div>
            <CheckCircle2 className="h-8 w-8 text-emerald-600 shadow-sm opacity-60" />
          </div>
        </div>

        {/* Growth & Stability Matrix (LIGHT THEME) */}
        <div className="space-y-8">
          <div className="bg-white border border-[#E2E8F0] shadow-sm p-8 space-y-8 flex flex-col items-center hover:shadow-md transition-all rounded-[2.5rem]">
            <h2 className="text-xl font-black uppercase text-[#0F172A] flex items-center justify-center gap-4 border-b border-[#F1F5F9] pb-4 w-full text-center">
              <TrendingUp className="h-6 w-6 text-blue-600" /> Institutional Projection
            </h2>
            <div className="flex items-center justify-center gap-6 py-6 relative overflow-hidden h-fit w-full">
              <div className="absolute inset-0 bg-blue-100/10 -rotate-12 translate-x-12 opacity-40 group-hover:scale-110 transition-all duration-1000" />
              <p className="text-8xl font-black text-[#0F172A] leading-none drop-shadow-sm relative z-10">{data?.academic_growth?.toFixed(1)}</p>
              <div className="h-16 w-1 bg-[#E2E8F0] rounded-full relative z-10" />
              <div className="space-y-2 relative z-10">
                <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest underline decoration-[#E2E8F0] decoration-2 underline-offset-4 leading-none mb-1">DELTA PULSE</p>
                <p className="text-lg font-black text-[#475569]/80 uppercase leading-none">+0.4 SEM-GROWTH</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white border border-[#E2E8F0] shadow-sm p-6 flex flex-col items-center justify-center text-center group hover:border-emerald-600 hover:bg-emerald-50 transition-all rounded-3xl">
              <Zap className="h-10 w-10 text-white p-2 bg-emerald-600 rounded-xl shadow-sm transition-transform group-hover:scale-110 mb-3" />
              <div className="space-y-1">
                <p className="text-[9px] font-black text-[#475569]/60 uppercase tracking-widest leading-none">SKILL IMPROVEMENT</p>
                <p className="text-sm font-black text-[#0F172A] uppercase leading-none group-hover:text-emerald-600 transition-colors shadow-sm">{data?.skill_improvement?.split('in')[0] || ''}</p>
              </div>
            </div>
            <div className="bg-white border border-[#E2E8F0] shadow-sm p-6 flex flex-col items-center justify-center text-center group hover:border-blue-600 hover:bg-blue-50 transition-all rounded-3xl">
              <ShieldCheck className="h-10 w-10 text-white p-2 bg-blue-600 rounded-xl shadow-sm transition-transform group-hover:rotate-12 mb-3" />
              <div className="space-y-1">
                <p className="text-[9px] font-black text-[#475569]/60 uppercase tracking-widest leading-none">RANK STABILITY</p>
                <p className="text-sm font-black text-[#0F172A] uppercase leading-none group-hover:text-blue-600 transition-colors shadow-sm">PEAK-CONSISTENT</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Neurometric Delta Hub (LIGHT THEME) */}
      <div className="bg-[#F1F5F9] border border-[#CBD5E1] shadow-sm p-8 space-y-8 mt-6 rounded-[2.5rem] bg-pattern overflow-hidden h-fit">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          <div className="space-y-4 flex-1 text-center md:text-left">
            <h2 className="text-3xl font-black uppercase text-[#0F172A] underline decoration-blue-600 underline-offset-[8px] mb-4 leading-tight">Neurometric Synchrony</h2>
            <p className="text-[9px] font-black text-[#475569]/60 uppercase tracking-widest flex items-center justify-center md:justify-start gap-3 shadow-sm">
              <Activity className="h-5 w-5 text-blue-600 animate-pulse" /> SYSTEM-WIDE ACCURACY: 98.4% STABLE
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "VELOCITY", val: "88%" },
              { label: "CONSISTENCY", val: "94%" },
              { label: "ACCURACY", val: "82%" },
              { label: "SYNC", val: "100%" }
            ].map((stat, i) => (
              <div key={i} className="p-6 bg-white border border-[#E2E8F0] rounded-2xl flex flex-col items-center text-center space-y-2 shadow-sm hover:bg-blue-600 group hover:border-none transition-all">
                <p className="text-[9px] font-black uppercase tracking-widest text-[#475569]/60 group-hover:text-white/80 transition-all shadow-sm leading-none">{stat.label}</p>
                <p className="text-2xl font-black drop-shadow-sm font-mono leading-none group-hover:text-white transition-colors">{stat.val}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
