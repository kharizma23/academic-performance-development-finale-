"use client"

import React, { useState } from 'react'
import { 
  TrendingUp, 
  Zap, 
  Target, 
  ArrowUpRight, 
  ArrowDownRight,
  BarChart3, 
  CheckCircle2, 
  AlertTriangle,
  FileText,
  Download,
  Flame,
  BrainCircuit,
  Award,
  Activity,
  Minus,
  Scale,
  Cpu
} from "lucide-react"
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Cell
} from 'recharts'
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"

interface AcademicJourneyProps {
  data: any
  trend: any[]
  subjects: any[]
  insight: any
}

export default function AcademicJourney({ data, trend, subjects, insight }: AcademicJourneyProps) {
  const [targetCgpa, setTargetCgpa] = useState(data?.target_cgpa || 9.0)

  const downloadReport = async () => {
    const element = document.getElementById('academic-report-node')
    if (!element) return
    
    const canvas = await html2canvas(element, { scale: 2 })
    const imgData = canvas.toDataURL('image/png')
    
    const pdf = new jsPDF('p', 'mm', 'a4')
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
    pdf.save(`${data?.student?.name || 'Student'}_Academic_Journey.pdf`)
  }

  if (!data) return (
    <div className="h-[40vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 opacity-40">
        <BrainCircuit className="h-10 w-10 animate-pulse text-blue-600" />
        <p className="text-xs font-black uppercase tracking-widest text-[#0F172A]">Syncing Academic Node...</p>
      </div>
    </div>
  )

  return (
    <div className="space-y-10 animate-in fade-in duration-700 w-full overflow-hidden" id="academic-report-node">
      {/* Top Tactical Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Improvement Card */}
        <div className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-[280px] group relative overflow-hidden">
          <div className="flex justify-between items-start relative z-10">
            <div className="space-y-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-sm" /> IMPROVEMENT
              </p>
              <h4 className="text-7xl font-black text-emerald-600 leading-none">+{data.improvement_delta}</h4>
            </div>
            <div className="h-12 w-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 transition-all border border-emerald-100">
              <TrendingUp className="h-6 w-6" />
            </div>
          </div>
          <div className="flex items-center gap-4 relative z-10 pt-6 border-t border-emerald-50">
            <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">VELOCITY: ACCELERATING</p>
          </div>
        </div>

        {/* Backlog Tracker */}
        <div className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm transition-all flex flex-col justify-between h-[280px] group relative overflow-hidden">
          <div className="flex justify-between items-start relative z-10">
            <div className="space-y-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-slate-200" /> ARREARS
              </p>
              <h4 className="text-7xl font-black text-slate-900 leading-none">{data.backlogs}</h4>
            </div>
            <div className="h-12 w-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-600 border border-slate-100">
              <Minus className="h-6 w-6" />
            </div>
          </div>
          <div className="flex items-center gap-4 relative z-10 pt-6 border-t border-slate-50">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <p className="text-[9px] font-black uppercase text-emerald-600">STABLE</p>
          </div>
        </div>

        {/* Consistency */}
        <div className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm transition-all h-[280px] flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="space-y-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">CONSISTENCY</p>
              <h4 className="text-4xl font-black text-blue-600 uppercase leading-none">{(data?.consistency || "N/A").split(' - ')[0]}</h4>
              <p className="text-base font-black text-slate-900 uppercase">{(data?.consistency || "").split(' - ')[1] || "Sync Mode"}</p>
            </div>
            <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 border border-blue-100">
              <Flame className="h-6 w-6" />
            </div>
          </div>
          <div className="flex items-center gap-4 pt-6 border-t border-blue-50">
             <Activity className="h-4 w-4 text-blue-600" />
             <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest">PULSE: 98%</p>
          </div>
        </div>

        {/* Risk Node */}
        <div className={cn(
          "p-8 rounded-[2.5rem] border transition-all h-[280px] flex flex-col justify-between shadow-sm",
          data.risk_level === 'Low' ? "border-emerald-100 bg-emerald-50/20" : "border-rose-100 bg-rose-50/20"
        )}>
          <div className="flex justify-between items-start">
            <div className="space-y-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">RISK INDEX</p>
              <h4 className={cn("text-5xl font-black leading-none", data.risk_level === 'Low' ? "text-emerald-600" : "text-rose-600")}>{data.risk_level}</h4>
            </div>
            <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center border", data.risk_level === 'Low' ? "bg-emerald-50 border-emerald-100 text-emerald-600" : "bg-rose-50 border-rose-100 text-rose-600")}>
              <Activity className="h-6 w-6" />
            </div>
          </div>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-tight line-clamp-2">{data.risk_reason}</p>
        </div>
      </div>

      {/* Main Analysis Hub */}
      <div className="grid lg:grid-cols-12 gap-8">
        {/* Trend Section */}
        <div className="lg:col-span-8 bg-white border border-slate-100 shadow-sm p-8 rounded-[2.5rem] space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-xl font-black uppercase text-slate-900 flex items-center gap-3">
                <BarChart3 className="h-6 w-6 text-blue-600" /> Performance Matrix
              </h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-9">Institutional CGPA Trajectory</p>
            </div>
            <Button onClick={downloadReport} className="h-10 px-6 bg-slate-900 hover:bg-black text-white rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2 transition-all">
              <Download className="h-4 w-4" /> REPORT
            </Button>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend}>
                <defs>
                  <linearGradient id="colorCgpa" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="sem" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 10, fontWeight: '900', letterSpacing: '0.1em'}} />
                <YAxis domain={[0, 10]} axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 10, fontWeight: '900'}} />
                <Tooltip content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-[#0F172A] p-4 rounded-2xl shadow-xl text-white border border-white/10">
                        <p className="text-[10px] font-black text-blue-400 uppercase">{payload[0].payload.sem}</p>
                        <p className="text-2xl font-black">{payload[0].value} CGPA</p>
                      </div>
                    );
                  }
                  return null;
                }} />
                <Area type="monotone" dataKey="cgpa" stroke="#2563EB" strokeWidth={4} fillOpacity={1} fill="url(#colorCgpa)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          {/* Table Container */}
          <div className="pt-6 border-t border-slate-50 overflow-x-auto">
             <table className="w-full text-left">
                <thead>
                   <tr className="text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                      <th className="pb-4">Subject Node</th>
                      <th className="pb-4 text-center">CIA</th>
                      <th className="pb-4 text-center">SEM</th>
                      <th className="pb-4 text-center">Grade</th>
                      <th className="pb-4 text-right">Status</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                   {subjects.map((sub, i) => (
                      <tr key={i} className="group hover:bg-slate-50/50 transition-all">
                         <td className="py-6">
                            <p className="text-sm font-black uppercase text-slate-900 group-hover:text-blue-600 transition-colors">{sub.subject}</p>
                            <p className="text-[8px] font-black text-slate-400 uppercase">SEM: {sub.sem}</p>
                         </td>
                         <td className="text-center py-6">
                            <span className="text-xs font-black text-slate-600">{sub.internal}</span>
                         </td>
                         <td className="text-center py-6">
                            <span className="text-xs font-black text-slate-600">{sub.external}</span>
                         </td>
                         <td className="text-center py-6">
                            <span className="h-8 w-8 inline-flex items-center justify-center bg-blue-50 text-blue-600 rounded-lg text-xs font-black">{sub.grade}</span>
                         </td>
                         <td className="text-right py-6">
                            <span className={cn(
                              "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest",
                              sub.status === 'Pass' ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"
                            )}>{sub.status}</span>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
        </div>

        {/* AI Insight Sidebar */}
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-[#0F172A] p-8 rounded-[2.5rem] text-white space-y-8 shadow-xl">
              <h3 className="text-lg font-black uppercase tracking-widest text-blue-400 border-b border-white/10 pb-4">Neural Insight</h3>
              <div className="space-y-6">
                 <p className="text-xs font-bold text-slate-200 leading-relaxed uppercase">"{insight.analysis}"</p>
                 <div className="space-y-4">
                    <div className="space-y-2">
                       <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Mastery Peaks</p>
                       <div className="flex flex-wrap gap-2">
                          {insight.strong_subjects.map((s: any) => (
                             <span key={s} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[9px] font-black uppercase">{s}</span>
                          ))}
                       </div>
                    </div>
                    <div className="space-y-2">
                       <p className="text-[9px] font-black text-rose-400 uppercase tracking-widest">Growth Nodes</p>
                       <div className="flex flex-wrap gap-2">
                          {insight.weak_subjects.map((s: any) => (
                             <span key={s} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[9px] font-black uppercase text-rose-200">{s}</span>
                          ))}
                       </div>
                    </div>
                 </div>
                 <div className="p-6 bg-blue-600/10 border border-blue-600/20 rounded-2xl">
                    <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-2">Recommendation</p>
                    <p className="text-sm font-black text-slate-100 uppercase leading-relaxed">{insight.recommendation}</p>
                 </div>
              </div>
           </div>
           
           {/* Heatmap Node: Compact */}
           <div className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm">
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 border-b pb-4 mb-6">Activity Heatmap</h4>
              <div className="grid grid-cols-6 gap-3">
                 {Array.from({ length: 18 }).map((_, i) => (
                    <div key={i} className={cn(
                      "h-8 rounded-lg",
                      i < 4 ? "bg-emerald-600" : (i < 10 ? "bg-emerald-400/60" : "bg-slate-100")
                    )} />
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}
