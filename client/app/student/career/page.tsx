"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Map, Loader2, Target, Sparkles, 
  ArrowUpRight, Rocket, Compass, 
  Zap, BrainCircuit, LineChart, Star,
  X, CheckCircle2, ChevronRight, BookOpen,
  Award, TrendingUp, AlertTriangle
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function CareerNavigator() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedRole, setSelectedRole] = useState<any>(null)
  const [student, setStudent] = useState<any>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const getApiUrl = (path: string) => {
    return `http://127.0.0.1:8001${path}`;
  };

  const fetchProfileAndCareer = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      setErrorMessage("Access Token Missing. Please Terminate Access and Re-login.")
      setLoading(false)
      return
    }
    
    const headers = { 'Authorization': `Bearer ${token}` }
    try {
      // 1. Fetch Profile via FAIL-SAFE Stable Node
      const profileRes = await fetch(getApiUrl("/student/profile_stable"), { headers })
      if (!profileRes.ok) {
        const errorText = await profileRes.text()
        console.error("Profile Fetch Error:", profileRes.status, errorText)
        throw new Error(`Identity Node Error (${profileRes.status}): ${errorText}`)
      }
      const profileData = await profileRes.json()
      setStudent(profileData)

      // 2. Fetch Career Recommendations using real ID
      const careerRes = await fetch(getApiUrl(`/career/recommendations/${profileData.id}`), { headers })
      if (!careerRes.ok) {
        const errorText = await careerRes.text()
        console.error("Career Recommendations Fetch Error:", careerRes.status, errorText)
        throw new Error(`Intelligence Bridge Error (${careerRes.status}): ${errorText}`)
      }
      setData(await careerRes.json())
      
    } catch (error: any) {
      console.error("Failed to fetch career node:", error)
      setErrorMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfileAndCareer()
  }, [])

  if (loading) return (
    <div className="flex h-[40vh] items-center justify-center">
      <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
    </div>
  )

  if (!data || !student) return (
    <div className="flex h-[40vh] flex-col items-center justify-center p-8 bg-white border border-[#E2E8F0] rounded-[2rem] text-center space-y-4">
      <div className="p-4 bg-rose-50 border border-rose-100 rounded-full">
         <AlertTriangle className="h-10 w-10 text-rose-600" />
      </div>
      <div className="space-y-1">
        <h3 className="text-sm font-black uppercase text-[#0F172A]">Synchronization Failure</h3>
        <p className="text-[10px] font-black uppercase tracking-widest text-[#475569]/60">Student Identity Node or Career Intelligence could not be localized.</p>
        {errorMessage && (
          <p className="mt-2 text-[9px] font-bold text-rose-600 bg-rose-50 px-3 py-1 rounded-lg border border-rose-100 uppercase tracking-tight">
            Diagnostic: {errorMessage}
          </p>
        )}
      </div>
      <button 
        onClick={() => window.location.reload()}
        className="px-6 py-2 bg-[#0F172A] text-white text-[9px] font-black uppercase tracking-widest rounded-lg shadow-sm"
      >
        Retry Pull
      </button>
    </div>
  )

  return (
    <div className="w-full space-y-8 pb-20 text-[#0F172A] font-sans selection:bg-blue-500/10">
      <div className="space-y-4">
        <div className="flex items-center gap-4 mb-2">
          <span className="p-2 bg-blue-100 rounded-xl text-blue-600 border border-blue-200 shadow-sm">
            <Map className="h-6 w-6" />
          </span>
          <h1 className="text-3xl md:text-4xl font-black uppercase leading-none text-[#0F172A]">
            Career <span className="text-blue-600">Navigator</span>
          </h1>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm relative overflow-hidden flex items-center gap-6">
          <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shadow-sm border border-blue-100 flex-shrink-0">
            <BrainCircuit className="h-6 w-6 animate-pulse" />
          </div>
          <p className="text-sm font-bold text-[#475569] leading-relaxed max-w-5xl uppercase">
            AI-DRIVEN RECOMMENDATION: "{data.ai_recommendations}"
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Career Trajectory Nodes (DYNAMIC) */}
        <div className="bg-white border border-[#E2E8F0] shadow-sm p-8 space-y-8 rounded-[2.5rem] hover:shadow-md transition-all h-fit">
          <h2 className="text-2xl font-black uppercase text-[#0F172A] flex items-center gap-4 border-b border-[#F1F5F9] pb-4">
            <Star className="h-6 w-6 text-blue-600" /> Optimal Trajectories
          </h2>
          <div className="space-y-6">
            {data.roles.map((path: any, i: number) => (
              <div 
                key={i} 
                onClick={() => setSelectedRole(path)}
                className="p-6 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] group cursor-pointer hover:border-blue-600 hover:bg-white transition-all shadow-sm flex flex-col md:flex-row items-center gap-6"
              >
                <div className="h-16 w-16 bg-white border border-[#E2E8F0] rounded-xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                  <Rocket className="h-8 w-8" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm",
                      path.readiness === 'HIGH' ? "bg-emerald-50 border-emerald-100 text-emerald-600" : (path.readiness === 'MEDIUM' ? "bg-amber-50 border-amber-100 text-amber-600" : "bg-rose-50 border-rose-100 text-rose-600")
                    )}>{path.readiness} READINESS</span>
                  </div>
                  <h4 className="text-xl font-black text-[#0F172A] uppercase leading-tight mb-2 group-hover:text-blue-600 transition-colors">{path.title}</h4>
                  <div className="flex items-center justify-center md:justify-start gap-4">
                    <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest leading-none underline decoration-blue-100 underline-offset-4">MATCH INDEX: {path.match}%</span>
                    <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest leading-none">Est. LPA: {path.lpa}</span>
                  </div>
                </div>
                <ArrowUpRight className="h-6 w-6 text-[#E2E8F0] group-hover:text-blue-600 transition-all scale-75 group-hover:scale-100" />
              </div>
            ))}
          </div>
        </div>

        {/* Domain Match Matrix (DYNAMIC) */}
        <div className="space-y-8">
          <div className="bg-white border border-[#E2E8F0] shadow-sm p-8 space-y-8 rounded-[2.5rem] flex flex-col items-center hover:shadow-md transition-all">
            <h2 className="text-xl font-black uppercase text-[#0F172A] flex items-center justify-center gap-4 border-b border-[#F1F5F9] pb-4 w-full text-center">
              <Zap className="h-6 w-6 text-amber-600" /> Domain Match Matrix
            </h2>
            <div className="grid grid-cols-2 gap-6 w-full">
              {Object.entries(data.domain_scores || {}).map(([name, match]: any, i: number) => (
                <div key={i} className="flex flex-col items-center justify-center p-6 bg-[#F1F5F9] rounded-2xl border border-[#CBD5E1] hover:bg-white hover:border-blue-600 group transition-all shadow-sm">
                  <p className="text-[9px] font-black text-[#475569]/60 uppercase tracking-widest mb-4 text-center leading-none">{name} SECTOR</p>
                  <div className="relative h-20 w-20 flex items-center justify-center mb-4">
                    <svg className="h-full w-full -rotate-90">
                      <circle cx="40" cy="40" r="36" stroke="#E2E8F0" strokeWidth="6" fill="transparent" />
                      <circle cx="40" cy="40" r="36" stroke="#2563EB" strokeWidth="6" fill="transparent" strokeDasharray="226" strokeDashoffset={226 - (226 * match) / 100} className="transition-all duration-1000 group-hover:stroke-blue-600" />
                    </svg>
                    <span className="absolute text-xl font-black text-[#0F172A] leading-none">{Math.round(match)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Institutional Readiness (DYNAMIC) */}
          <div className="bg-[#2563EB] shadow-md p-8 space-y-6 flex items-center gap-6 text-white rounded-[2.5rem] overflow-hidden group">
            <div className="flex-1 space-y-2 relative z-10">
              <h4 className="text-lg font-black uppercase leading-none">Institutional Readiness</h4>
              <div className="h-2 w-full bg-blue-400/20 rounded-full border border-blue-400/40 p-0.5 shadow-inner">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${data.institutional_readiness}%` }}
                  transition={{ duration: 1.5, delay: 0.2 }}
                  className="h-full bg-white rounded-full shadow-[0_0_10px_white]"
                />
              </div>
            </div>
            <p className="text-5xl font-black leading-none relative z-10">{data.institutional_readiness}<span className="text-xl ml-1 font-black">%</span></p>
          </div>
        </div>
      </div>

      {/* Career Delta Node (DYNAMIC) */}
      <div className="bg-[#F1F5F9] border border-[#CBD5E1] shadow-sm p-10 space-y-8 rounded-[2.5rem] bg-pattern overflow-hidden h-fit flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-4 flex-1 text-center md:text-left">
          <h2 className="text-3xl font-black uppercase text-[#0F172A] leading-tight underline decoration-blue-600 underline-offset-[12px] mb-4">Requirement Delta</h2>
          <p className="text-[10px] font-black text-[#475569]/60 uppercase tracking-[0.2em] flex items-center justify-center md:justify-start gap-4">
            <LineChart className="h-4 w-4 text-blue-600" /> AI-PATHWAY SYNC REQUIRED
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center md:justify-end gap-4 md:w-1/2">
          {data.roles[0].missing_skills.length > 0 ? data.roles[0].missing_skills.map((skill: string, i: number) => (
            <div key={i} className="px-6 py-3 bg-white border border-[#E2E8F0] rounded-xl text-[9px] font-black uppercase tracking-widest text-[#0F172A] hover:bg-rose-600 hover:text-white hover:border-none transition-all cursor-pointer shadow-sm leading-none hover:scale-105">
              {skill} NODE
            </div>
          )) : (
             <div className="px-6 py-3 bg-emerald-600 border border-emerald-500 rounded-xl text-[9px] font-black uppercase tracking-widest text-white shadow-sm leading-none">
              ZERO DELTA - FULLY OPTIMIZED
            </div>
          )}
        </div>
      </div>

      {/* DETAIL MODAL OVERLAY */}
      <AnimatePresence>
        {selectedRole && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-[#0F172A]/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl border border-[#E2E8F0] overflow-hidden flex flex-col max-h-[90vh]">
              <div className="p-8 border-b border-[#F1F5F9] flex items-center justify-between bg-[#F8FAFC]">
                <div className="flex items-center gap-6">
                   <div className="h-16 w-16 bg-blue-600 rounded-[1.25rem] flex items-center justify-center text-white shadow-lg">
                      <Rocket className="h-8 w-8" />
                   </div>
                   <div className="space-y-1">
                      <h2 className="text-2xl font-black text-[#0F172A] uppercase leading-tight">{selectedRole.title}</h2>
                      <div className="flex items-center gap-3">
                        <span className={cn(
                          "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                          selectedRole.readiness === 'HIGH' ? "bg-emerald-50 border-emerald-100 text-emerald-600" : "bg-amber-50 border-amber-100 text-amber-600"
                        )}>{selectedRole.readiness} READINESS</span>
                        <span className="text-[9px] font-black uppercase tracking-widest text-[#475569]/60">{selectedRole.domain} DOMAIN</span>
                      </div>
                   </div>
                </div>
                <button onClick={() => setSelectedRole(null)} className="h-10 w-10 bg-white border border-[#E2E8F0] rounded-full flex items-center justify-center shadow-sm hover:text-rose-600 hover:bg-rose-50 transition-all"><X className="h-5 w-5" /></button>
              </div>

              <div className="p-8 overflow-y-auto space-y-10 custom-scrollbar">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-6">
                       <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#475569] border-b border-[#F1F5F9] pb-3 flex items-center gap-3"><Zap className="h-4 w-4 text-blue-600" /> Skill Matrix Sync</h3>
                       <div className="space-y-4">
                          <p className="text-[9px] font-black uppercase tracking-widest text-emerald-600">Acquired Competencies:</p>
                          <div className="flex flex-wrap gap-2">
                             {selectedRole.required_skills.filter((s:any) => !selectedRole.missing_skills.includes(s)).map((s:any, i:number) => (
                               <div key={i} className="px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-lg text-[9px] font-black text-emerald-600 uppercase flex items-center gap-2">
                                  <CheckCircle2 className="h-3 w-3" /> {s}
                               </div>
                             ))}
                          </div>
                          
                          {selectedRole.missing_skills.length > 0 && (
                            <>
                              <p className="text-[9px] font-black uppercase tracking-widest text-rose-600 mt-4">Required Delta:</p>
                              <div className="flex flex-wrap gap-2">
                                {selectedRole.missing_skills.map((s:any, i:number) => (
                                  <div key={i} className="px-4 py-2 bg-rose-50 border border-rose-100 rounded-lg text-[9px] font-black text-rose-600 uppercase flex items-center gap-2">
                                      <X className="h-3 w-3" /> {s}
                                  </div>
                                ))}
                              </div>
                            </>
                          )}
                       </div>
                    </div>

                    <div className="space-y-6">
                       <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#475569] border-b border-[#F1F5F9] pb-3 flex items-center gap-3"><Compass className="h-4 w-4 text-blue-600" /> Learning Trajectory</h3>
                       <div className="space-y-4">
                          {selectedRole.learning_path.map((step: string, i: number) => (
                            <div key={i} className="flex items-center gap-4 bg-[#F8FAFC] border border-[#E2E8F0] p-4 rounded-xl group hover:border-blue-600 transition-all">
                               <div className="h-8 w-8 bg-white border border-[#CBD5E1] rounded-lg flex items-center justify-center text-[10px] font-black text-blue-600 shadow-sm shrink-0">{i+1}</div>
                               <p className="text-[10px] font-bold text-[#0F172A] uppercase">{step}</p>
                            </div>
                          ))}
                       </div>
                    </div>
                 </div>

                 <div className="bg-blue-50 border border-blue-100 p-8 rounded-[2rem] relative overflow-hidden">
                    <div className="absolute -right-4 -bottom-4 opacity-5"><TrendingUp className="h-40 w-40 text-blue-600" /></div>
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                       <div className="space-y-2">
                          <h4 className="text-lg font-black uppercase text-blue-900">AI Remediation Insight</h4>
                          <p className="text-xs font-bold text-blue-800/80 leading-relaxed uppercase">"{selectedRole.suggestions[0]}. This will stabilize your match index within 30 solar cycles."</p>
                       </div>
                       <div className="flex gap-4 shrink-0">
                          <div className="text-center p-4 bg-white rounded-2xl border border-blue-100 shadow-sm w-32">
                             <p className="text-[8px] font-black text-[#475569] uppercase tracking-widest mb-1">Impact</p>
                             <p className="text-2xl font-black text-blue-600 leading-none">+18%</p>
                          </div>
                          <div className="text-center p-4 bg-white rounded-2xl border border-blue-100 shadow-sm w-32">
                             <p className="text-[8px] font-black text-[#475569] uppercase tracking-widest mb-1">Stability</p>
                             <p className="text-2xl font-black text-emerald-600 leading-none">High</p>
                          </div>
                       </div>
                    </div>
                 </div>
                 
                 <div className="flex justify-end pt-4">
                    <button onClick={() => setSelectedRole(null)} className="h-12 px-10 bg-[#0F172A] hover:bg-black text-white font-black uppercase tracking-widest text-[10px] rounded-xl shadow-lg transition-all">
                       Commit to Trajectory
                    </button>
                 </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
