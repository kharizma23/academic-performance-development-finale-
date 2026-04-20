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
    return `http://127.0.0.1:8001${path}`;
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
    <div className="flex h-[40vh] items-center justify-center">
      <Loader2 className="h-10 w-10 animate-spin text-amber-600" />
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
    <div className="w-full space-y-8 pb-20 text-[#0F172A] font-sans selection:bg-blue-500/10">
      <div className="space-y-4">
        <div className="flex items-center gap-4 mb-2">
          <span className="p-2 bg-amber-100 rounded-xl text-amber-600 border border-amber-200 shadow-sm">
            <Zap className="h-6 w-6" />
          </span>
          <h1 className="text-3xl md:text-4xl font-black uppercase leading-none text-[#0F172A]">
            Skill <span className="text-amber-600">Lab</span>
          </h1>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm relative overflow-hidden flex items-center gap-6 group hover:shadow-md transition-all">
          <div className="h-12 w-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 shadow-sm border border-amber-100 flex-shrink-0">
            <BrainCircuit className="h-6 w-6 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-sm font-bold text-[#475569] leading-relaxed max-w-5xl uppercase">
            AI-DETECTED SKILL GAPS: FOCUS ON SYSTEM DESIGN AND MICROSERVICES TO UNLOCK SENIOR NODE ROLES.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Radar Chart (LIGHT THEME) */}
        <div className="bg-white border border-[#E2E8F0] shadow-sm p-8 space-y-8 rounded-[2.5rem] hover:shadow-md transition-all">
          <h2 className="text-2xl font-black uppercase text-[#0F172A] flex items-center gap-4 border-b border-[#F1F5F9] pb-4">
            <Activity className="h-6 w-6 text-amber-600" /> Neural Analysis
          </h2>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#F1F5F9" strokeWidth={2} />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 12, fontWeight: '900' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} axisLine={false} tick={false} />
                <Radar 
                  name="Skills" 
                  dataKey="A" 
                  stroke="#f59e0b" 
                  strokeWidth={4} 
                  fill="#f59e0b" 
                  fillOpacity={0.4} 
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #E2E8F0', borderRadius: '12px', fontSize: '12px', padding: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}
                  itemStyle={{ color: '#0F172A', fontWeight: '900' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gap Matrix & Resources (LIGHT THEME) */}
        <div className="space-y-8">
          <div className="bg-white border border-[#E2E8F0] shadow-sm p-8 space-y-6 rounded-[2.5rem] hover:shadow-md transition-all">
            <h2 className="text-xl font-black uppercase text-[#0F172A] flex items-center gap-3 border-b border-[#F1F5F9] pb-4">
              <Target className="h-5 w-5 text-amber-600" /> Skill Gap Matrix
            </h2>
            <div className="space-y-4">
              {data?.gap_analysis.map((gap: any, i: number) => (
                <div key={i} className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between group hover:border-amber-600 hover:bg-white transition-all shadow-sm">
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-amber-600 uppercase tracking-widest leading-none">{gap.gap} PRIORITY GAP</p>
                    <p className="text-lg font-black uppercase text-[#0F172A] leading-none mb-1">{gap.skill}</p>
                    <p className="text-[10px] font-bold text-[#475569]/60 uppercase tracking-tight">{gap.recommendation}</p>
                  </div>
                  <ChevronRight className="h-6 w-6 text-[#E2E8F0] group-hover:text-amber-600 transition-all scale-75 group-hover:scale-100" />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-[#E2E8F0] shadow-sm p-8 space-y-6 rounded-[2.5rem] hover:shadow-md transition-all">
            <h2 className="text-xl font-black uppercase text-[#0F172A] flex items-center gap-3 border-b border-[#F1F5F9] pb-4">
              <BookOpen className="h-5 w-5 text-blue-600" /> Recommender Node
            </h2>
            <div className="flex flex-wrap gap-2">
              {data?.recommended_resources.map((res: any, i: number) => (
                <div key={i} className="px-4 py-2 bg-[#F1F5F9] border border-[#CBD5E1] rounded-xl flex items-center gap-2 group hover:bg-white hover:border-blue-600 transition-all cursor-pointer shadow-sm">
                  <p className="text-[9px] font-black uppercase tracking-widest text-[#475569] group-hover:text-[#0F172A] leading-none">{res}</p>
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shadow-sm group-hover:animate-pulse" />
                </div>
              ))}
            </div>
            <Button className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-md transition-all">
              <Rocket className="h-4 w-4 mr-2" /> Explore Content
            </Button>
          </div>
        </div>
      </div>

      {/* Evolution Timeline (LIGHT THEME) */}
      <div className="bg-white border border-[#E2E8F0] shadow-sm p-8 space-y-8 rounded-[2.5rem] hover:shadow-md transition-all overflow-hidden h-fit">
        <h2 className="text-2xl font-black uppercase text-[#0F172A] flex items-center gap-4 border-b border-[#F1F5F9] pb-4 w-fit">
          <LineChart className="h-6 w-6 text-blue-600" /> Evolution Timeline
        </h2>
        <div className="flex flex-col md:flex-row items-stretch justify-between gap-6 relative overflow-hidden h-fit">
          <div className="absolute h-1 w-full bg-[#E2E8F0] top-1/2 -translate-y-1/2 flex max-md:hidden" />
          {data?.roadmap.map((phase: any, i: number) => (
            <div key={i} className="relative z-10 w-full md:w-1/3 p-6 bg-white rounded-3xl border border-[#E2E8F0] flex flex-col items-center text-center space-y-4 shadow-sm group transition-all hover:shadow-md border-t-4 border-t-transparent hover:border-t-amber-500">
              <div className={cn(
                "h-12 w-12 rounded-xl flex items-center justify-center border transition-all",
                phase.status === 'Completed' ? "bg-emerald-50 border-emerald-100 text-emerald-600" :
                phase.status === 'Active' ? "bg-amber-50 border-amber-100 text-amber-600 animate-pulse" : "bg-[#F1F5F9] border-[#E2E8F0] text-[#94A3B8]"
              )}>
                {phase.status === 'Completed' ? <CheckCircle2 className="h-6 w-6" /> : (phase.status === 'Active' ? <Zap className="h-6 w-6 text-amber-600" /> : <Clock className="h-6 w-6" />)}
              </div>
              <div className="space-y-2">
                <p className="text-[9px] font-black text-[#64748B] uppercase tracking-[0.2em]">{phase.date}</p>
                <p className="text-sm font-black uppercase text-[#0F172A] leading-tight group-hover:text-amber-600 transition-colors h-10">{phase.phase}</p>
                <p className={cn("text-[8px] font-black uppercase tracking-widest", phase.status === 'Completed' ? "text-emerald-500" : (phase.status === 'Active' ? "text-amber-500" : "text-[#94A3B8]"))}>{phase.status}</p>
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
