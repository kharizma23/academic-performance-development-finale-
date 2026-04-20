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
    return `http://127.0.0.1:8001${path}`;
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
    <div className="flex h-[40vh] items-center justify-center">
      <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
    </div>
  )

  const COLORS = ['#2563EB', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']

  return (
    <div className="w-full space-y-8 pb-20 text-[#0F172A] font-sans selection:bg-blue-500/10">
      <div className="space-y-4">
        <div className="flex items-center gap-4 mb-2">
          <span className="p-2 bg-indigo-100 rounded-xl text-indigo-600 border border-indigo-200 shadow-sm">
            <BarChart3 className="h-6 w-6" />
          </span>
          <h1 className="text-3xl md:text-4xl font-black uppercase leading-none text-[#0F172A]">
            Results <span className="text-indigo-600">Analytics</span>
          </h1>
        </div>
        
        <div className="p-6 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm relative overflow-hidden flex items-center gap-6">
          <p className="text-sm font-bold text-[#475569] uppercase leading-relaxed w-full">
            NEURAL FEEDBACK: "{data?.ai_feedback}"
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Ranking Analytics Node (LIGHT THEME) */}
        <div className="bg-white border border-[#E2E8F0] shadow-sm p-8 space-y-8 rounded-[2.5rem] hover:shadow-md transition-all">
          <h2 className="text-xl font-black uppercase text-[#0F172A] flex items-center gap-4 border-b border-indigo-50 pb-4">
            <Trophy className="h-6 w-6 text-indigo-600" /> Global Rank Analytics
          </h2>
          <div className="grid grid-cols-2 gap-6">
            {data?.test_results.map((res: any, i: number) => (
              <div key={i} className="p-6 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-4 hover:bg-white hover:border-indigo-600 transition-all group shadow-sm">
                <p className="text-[9px] font-black text-[#475569]/60 uppercase tracking-widest">{res.exam} NODE</p>
                <div className="space-y-1">
                  <p className="text-4xl font-black text-[#0F172A] group-hover:scale-105 transition-transform">#{res.rank}</p>
                  <p className="text-[9px] font-black text-indigo-600 uppercase tracking-tight">{res.percentile}% PERCENTILE</p>
                </div>
                <div className="h-1.5 w-full bg-[#E2E8F0] rounded-full overflow-hidden shadow-inner">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${res.percentile}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-indigo-600 shadow-sm" 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Accuracy Delta Projection (LIGHT THEME) */}
        <div className="bg-white border border-[#E2E8F0] shadow-sm p-8 space-y-8 rounded-[2.5rem] flex flex-col justify-center items-center hover:shadow-md transition-all">
          <h2 className="text-xl font-black uppercase text-[#0F172A] flex items-center gap-4 border-b border-[#F1F5F9] pb-4 w-full text-center">
            <PieChart className="h-6 w-6 text-blue-600" /> Accuracy Matrix
          </h2>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie 
                  data={[
                    { name: 'ACCURATE NODES', value: 85 },
                    { name: 'DEVIATION NODES', value: 15 }
                  ]} 
                  cx="50%" 
                  cy="50%" 
                  innerRadius={70} 
                  outerRadius={100} 
                  paddingAngle={5} 
                  dataKey="value"
                  stroke="none"
                >
                  <Cell fill="#2563EB" />
                  <Cell fill="#F1F5F9" />
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #E2E8F0', borderRadius: '12px', fontSize: '10px', padding: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}
                  itemStyle={{ color: '#0F172A', fontWeight: '900' }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  align="center" 
                  wrapperStyle={{ paddingTop: '20px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', color: '#475569' }}
                />
              </RePieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Critical Weak Area Nodes (LIGHT THEME) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 bg-rose-50 p-8 rounded-[2.5rem] border border-rose-100 shadow-sm">
        <div className="flex flex-col justify-center space-y-4">
          <h2 className="text-2xl font-black uppercase text-[#0F172A] leading-tight">Weak Node Intelligence</h2>
          <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest flex items-center gap-2 animate-pulse">
            <ShieldAlert className="h-4 w-4" /> CRITICAL DEVIATIONS DETECTED
          </p>
        </div>
        {data?.weak_areas.map((area: string, i: number) => (
          <div key={i} className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm group hover:border-rose-600 hover:shadow-md transition-all">
            <div className="h-10 w-10 bg-rose-50 border border-rose-100 rounded-xl flex items-center justify-center text-rose-600 mb-4 group-hover:bg-rose-600 group-hover:text-white transition-all shadow-sm">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <h4 className="text-lg font-black text-[#0F172A] uppercase leading-tight mb-2 group-hover:text-rose-600">{area}</h4>
          </div>
        ))}
      </div>

      {/* Global Test Synchrony (LIGHT THEME) */}
      <div className="bg-white border border-[#E2E8F0] shadow-sm p-8 space-y-8 rounded-[2.5rem] hover:shadow-md transition-all">
        <h2 className="text-xl font-black uppercase text-[#0F172A] flex items-center gap-4 border-b border-indigo-50 pb-4 w-full">
          <CheckCircle2 className="h-6 w-6 text-indigo-600" /> Synchronization Log
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.test_results.map((res: any, i: number) => (
            <div key={i} className="p-6 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] hover:bg-white hover:border-indigo-600 transition-all flex items-center justify-between group shadow-sm">
              <div className="space-y-1">
                <p className="text-[9px] font-black text-[#475569]/60 uppercase tracking-widest">EXAM ENTITY</p>
                <p className="text-lg font-black text-[#0F172A] uppercase">{res.exam}</p>
              </div>
              <div className="text-right space-y-1">
                <p className="text-3xl font-black text-[#0F172A] leading-none group-hover:text-indigo-600 transition-colors">{res.score}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
