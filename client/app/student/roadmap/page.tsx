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
  Sparkles,
  Loader2,
  TrendingUp,
  Map as MapIcon
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

const demoRoadmapArr = [
  { day: 1, topic: "Core Data Structures Mastery", status: "Completed", priority: "High", icon: "frontend" },
  { day: 2, topic: "Advanced Algorithm Design", status: "Completed", priority: "High", icon: "backend" },
  { day: 3, topic: "System Architecture Protocols", status: "Active", priority: "Medium", icon: "code" },
  { day: 4, topic: "Neural Network Foundations", status: "Pending", priority: "Critical", icon: "code" },
  { day: 5, topic: "Full-Stack Deployment Nodes", status: "Pending", priority: "High", icon: "backend" },
  { day: 6, topic: "API Security & Auth", status: "Pending", priority: "High", icon: "frontend" },
  { day: 7, topic: "Database Optimization", status: "Pending", priority: "Medium", icon: "backend" },
  { day: 8, topic: "Cloud Infrastructure Setup", status: "Pending", priority: "High", icon: "code" },
];

export default function StrategicRoadmap() {
  const router = useRouter()
  const [roadmapData, setRoadmapData] = useState<any[]>(demoRoadmapArr)
  const [loading, setLoading] = useState(true)

  const getApiUrl = (path: string) => {
    const hostname = typeof window !== 'undefined' ? window.location.hostname : '127.0.0.1';
    return `http://${hostname}:8001${path}`;
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
        if (json.roadmap && Array.isArray(json.roadmap) && json.roadmap.length > 0) {
          setRoadmapData(json.roadmap)
        }
      }
    } catch (error) {
      console.error("Roadmap Sync Interrupted", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full space-y-8 pb-20 text-[#0F172A] font-sans selection:bg-blue-500/10">
      {/* Header Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-4 mb-2">
          <span className="p-2.5 bg-blue-100 rounded-xl text-blue-600 shadow-sm border border-blue-200">
            <MapIcon className="h-6 w-6" />
          </span>
          <h1 className="text-3xl md:text-4xl font-black uppercase leading-none text-[#0F172A]">
            Strategic <span className="text-[#2563EB]">Roadmap</span>
          </h1>
        </div>
        
        <div className="p-6 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm relative overflow-hidden flex items-center gap-6 hover:shadow-md transition-all duration-500">
          <div className="h-10 w-10 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm border border-blue-100 flex-shrink-0">
            <Sparkles className="h-5 w-5 animate-pulse" />
          </div>
          <p className="text-xs md:text-sm font-black text-[#475569] leading-relaxed max-w-5xl uppercase tracking-tight">
            60-DAY PROD-READINESS PROTOCOL: ACTIVE AND SYNCHRONIZED.
          </p>
        </div>
      </div>

      {/* Strategic Roadmap Module (PREMIUM) */}
      <div className="bg-white border border-[#E2E8F0] shadow-sm p-8 space-y-8 rounded-[2.5rem] hover:shadow-lg transition-all duration-500">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-slate-100 pb-6">
          <h2 className="text-lg font-black uppercase text-[#0F172A] flex items-center gap-3">
            <Calendar className="h-5 w-5 text-blue-600" /> 60-Day Progress Node
          </h2>
          <div className="flex items-center gap-6 bg-[#F1F5F9] px-6 py-2.5 rounded-xl border border-[#CBD5E1]">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-[8px] font-black uppercase tracking-widest text-[#475569]">Done</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#2563EB]" />
              <span className="text-[8px] font-black uppercase tracking-widest text-[#475569]">Active</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-slate-300" />
              <span className="text-[8px] font-black uppercase tracking-widest text-[#475569]">Pending</span>
            </div>
          </div>
        </div>

        {/* Timeline Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {roadmapData.map((node: any, i: number) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={cn(
                "relative flex flex-col p-6 rounded-[2rem] border transition-all duration-300 group shadow-sm",
                node.status === 'Completed' ? "bg-emerald-50/30 border-emerald-100" : 
                node.status === 'Active' ? "bg-white border-blue-600 shadow-md ring-4 ring-blue-50" : "bg-white border-[#E2E8F0]"
              )}
            >
              <div className="flex items-center justify-between mb-4">
                <span className={cn(
                  "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border",
                  node.status === 'Completed' ? "bg-emerald-100 text-emerald-700 border-emerald-200" :
                  node.status === 'Active' ? "bg-blue-600 text-white border-blue-400" : "bg-[#F1F5F9] text-[#64748B] border-[#E2E8F0]"
                )}>DAY {node.day || (i + 1)}</span>
                {node.status === 'Completed' ? <CheckCircle className="h-4 w-4 text-emerald-500" /> : (node.status === 'Active' ? <Zap className="h-4 w-4 text-blue-600 animate-pulse" /> : <Circle className="h-4 w-4 text-[#CBD5E1]" />)}
              </div>
              <h4 className="text-[11px] font-black uppercase text-slate-900 leading-tight mb-4 min-h-[2.5rem]">{node.topic}</h4>
              <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                <span className="text-[7px] font-black text-[#94A3B8] uppercase tracking-widest">{node.priority} Priority</span>
                <div className="h-7 w-7 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                  {node.icon === 'frontend' ? <Boxes className="h-4 w-4" /> : (node.icon === 'backend' ? <Cpu className="h-4 w-4" /> : <Code2 className="h-4 w-4" />)}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Strategic Intervention Node */}
      <div className="bg-[#F1F5F9] border border-[#CBD5E1] p-10 mt-8 rounded-[2.5rem] relative overflow-hidden group">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          <div className="space-y-4">
            <h2 className="text-3xl font-black uppercase text-[#0F172A] leading-tight">Strategic Consistency</h2>
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-3">
              <TrendingUp className="h-5 w-5" /> Optimizing Study Velocity
            </p>
          </div>
          <div className="p-8 bg-white border border-[#E2E8F0] rounded-[2rem] flex flex-col items-center justify-center shadow-lg">
            <p className="text-[9px] font-black text-[#94A3B8] uppercase tracking-[.2em] mb-1">CURRENT SCORE</p>
            <p className="text-6xl font-black text-blue-600">92%</p>
          </div>
        </div>
      </div>
    </div>
  )
}
