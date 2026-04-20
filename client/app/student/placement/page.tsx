"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Rocket, Loader2, Trophy, ArrowUpRight, 
  FileText, ShieldCheck, Play, Zap, 
  Send, Target, Activity, CheckCircle2,
  X, BrainCircuit, Bell, Briefcase
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export default function PlacementBooster() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [applications, setApplications] = useState<any[]>([])
  
  // Modals
  const [showApplyModal, setShowApplyModal] = useState<any>(null)
  const [showResumeTune, setShowResumeTune] = useState(false)
  const [showMockInterview, setShowMockInterview] = useState(false)
  
  // Mock Interview State
  const [mockStep, setMockStep] = useState(0)
  const [mockAnswer, setMockAnswer] = useState("")
  const [mockFeedback, setMockFeedback] = useState("")

  const getApiUrl = (path: string) => {
    return `http://127.0.0.1:8001${path}`;
  };

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    // Simulated Neural Fetching Process
    setTimeout(() => {
      setData({
        cgpa: 8.4,
        projects_score: 80,
        skills_score: 85,
        resume_score: 76,
        eligible_companies: [
          { name: "Google Node", role: "SWE II", req_skills: ["React", "System Design"], match_skills: 90, match_projects: 85, match_cgpa: 85 },
          { name: "Meta Systems", role: "Architect", req_skills: ["Python", "Scale"], match_skills: 80, match_projects: 70, match_cgpa: 80 },
          { name: "Amazon Cloud", role: "DevOps", req_skills: ["AWS", "Docker"], match_skills: 60, match_projects: 65, match_cgpa: 70 },
          { name: "Stripe Connect", role: "Backend Node", req_skills: ["Go", "Microservices"], match_skills: 88, match_projects: 90, match_cgpa: 85 }
        ]
      })
      
      setApplications([
        { name: "HyperNodeTech", role: "Frontend AI", status: "Interview", date: "2 Days Ago" },
        { name: "Alpha Systems", role: "Backend Dev", status: "Applied", date: "1 Week Ago" }
      ])
      
      setLoading(false)
    }, 800)
  }

  const calculateMatch = (comp: any) => {
    const s = comp.match_skills * 0.5
    const cgpa = comp.match_cgpa * 0.2
    const p = comp.match_projects * 0.3
    return Math.round(s + cgpa + p)
  }

  const getMatchStatus = (score: number) => {
    if (score >= 85) return { label: 'ELIGIBLE', color: 'emerald' }
    if (score >= 70) return { label: 'MODERATE', color: 'amber' }
    return { label: 'IMPROVE', color: 'rose' }
  }

  const handleApply = (comp: any) => {
    setShowApplyModal(comp)
    setTimeout(() => {
      setApplications(prev => [{ name: comp.name, role: comp.role, status: "Applied", date: "Just Now" }, ...prev])
      setShowApplyModal(null)
    }, 1500)
  }

  const handleMockSubmit = () => {
    setMockStep(2) // Simulating evaluation
    setTimeout(() => {
      setMockFeedback("NEURAL EVALUATION: Strong initial context, but lacking structural deep-dive into microservices scaling logic. Recommend reviewing CAP theorem.")
      setMockStep(3) // Showing feedback
    }, 2000)
  }

  if (loading) return (
    <div className="flex h-[40vh] items-center justify-center">
      <Loader2 className="h-10 w-10 animate-spin text-emerald-600" />
    </div>
  )

  const readinessScore = data ? Math.round(((data.cgpa * 10) + data.skills_score + data.projects_score + data.resume_score) / 4) : 0
  const readinessLabel = readinessScore >= 85 ? 'Ready' : (readinessScore >= 70 ? 'Almost Ready' : 'Not Ready')

  return (
    <div className="w-full space-y-8 pb-20 text-[#0F172A] font-sans selection:bg-blue-500/10 relative">
      <div className="space-y-4">
        <div className="flex items-center gap-4 mb-2">
          <span className="p-2 bg-emerald-100 rounded-xl text-emerald-600 border border-emerald-200 shadow-sm">
            <Rocket className="h-6 w-6" />
          </span>
          <h1 className="text-3xl md:text-4xl font-black uppercase leading-none text-[#0F172A]">
            Placement <span className="text-emerald-600">Intelligence</span>
          </h1>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm relative overflow-hidden flex items-center gap-6">
          <div className="h-12 w-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-100 flex-shrink-0">
            <Target className="h-6 w-6 animate-pulse" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-bold text-[#475569] uppercase leading-relaxed max-w-5xl">
              READINESS PROTOCOL: {readinessLabel}. OVERALL SCORE: {readinessScore}%
            </p>
            <div className="h-1.5 w-64 bg-[#F1F5F9] rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${readinessScore}%` }} className={cn("h-full", readinessScore >= 85 ? 'bg-emerald-500' : readinessScore >= 70 ? 'bg-amber-500' : 'bg-rose-500')} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Global Gateway Match System */}
        <div className="bg-white border border-[#E2E8F0] shadow-sm p-8 space-y-6 rounded-[2.5rem] hover:shadow-md transition-all h-fit">
          <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-4">
            <h2 className="text-xl font-black uppercase text-[#0F172A] flex items-center gap-4">
              <Trophy className="h-5 w-5 text-emerald-600" /> Global Gateway
            </h2>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] font-black tracking-widest uppercase text-[#475569]/60">LIVE MATCHING</span>
            </div>
          </div>
          
          <div className="space-y-4">
            {data?.eligible_companies.map((comp: any, i: number) => {
              const score = calculateMatch(comp)
              const status = getMatchStatus(score)
              return (
                <div key={i} className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] group hover:border-emerald-600 hover:bg-white transition-all shadow-sm flex flex-col justify-between overflow-hidden relative">
                  <div className={`absolute top-0 right-0 w-2 h-full bg-${status.color}-500 opacity-80`} />
                  <div className="flex items-center justify-between mb-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border bg-${status.color}-50 text-${status.color}-700 border-${status.color}-200 shadow-sm`}>
                          {status.label}
                        </span>
                        <span className="text-[9px] font-black text-[#475569]/60 uppercase tracking-widest">MATCH: {score}%</span>
                      </div>
                      <h4 className="text-lg font-black text-[#0F172A] uppercase leading-none group-hover:text-emerald-600 transition-colors">{comp.name}</h4>
                      <p className="text-[9px] font-black text-[#475569]/60 uppercase tracking-widest">{comp.role}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-3 border-t border-[#E2E8F0]">
                    <div className="flex items-center gap-2 max-w-[60%] flex-wrap">
                      {comp.req_skills.map((s: string, idx: number) => (
                        <span key={idx} className="text-[8px] font-black bg-white border border-[#E2E8F0] px-2 py-0.5 rounded text-[#475569]">{s}</span>
                      ))}
                    </div>
                    {status.label !== 'IMPROVE' ? (
                      <Button onClick={() => handleApply(comp)} className="h-8 px-4 text-[9px] font-black tracking-widest uppercase bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-sm">
                        Apply Now
                      </Button>
                    ) : (
                      <Button disabled className="h-8 px-4 text-[9px] font-black tracking-widest uppercase bg-slate-100 text-slate-400 rounded-lg shadow-sm">
                        Skill Gap
                      </Button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="space-y-8">
          {/* Application Tracker */}
          <div className="bg-white border border-[#E2E8F0] shadow-sm p-8 space-y-6 rounded-[2.5rem] hover:shadow-md transition-all">
            <h2 className="text-xl font-black uppercase text-[#0F172A] flex items-center gap-3 border-b border-[#F1F5F9] pb-4">
              <Briefcase className="h-5 w-5 text-blue-600" /> Active Applications
            </h2>
            <div className="space-y-4">
              {applications.length > 0 ? applications.map((app, i) => (
                <div key={i} className="p-4 rounded-xl border border-[#E2E8F0] bg-white flex items-center justify-between shadow-sm">
                  <div className="space-y-1">
                    <p className="text-sm font-black text-[#0F172A] uppercase leading-none">{app.name}</p>
                    <p className="text-[9px] font-bold text-[#475569]/60 uppercase tracking-widest">{app.role} • {app.date}</p>
                  </div>
                  <span className={cn("px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border", 
                    app.status === 'Selected' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                    app.status === 'Interview' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                  )}>
                    {app.status}
                  </span>
                </div>
              )) : (
                <p className="text-[10px] font-black text-[#475569]/40 uppercase tracking-widest text-center py-4">NO ACTIVE PROCESS LOCATED.</p>
              )}
            </div>
          </div>

          {/* Neural Resume Artifact */}
          <div className="bg-white border border-[#E2E8F0] shadow-sm p-8 space-y-8 flex flex-col items-center hover:shadow-md transition-all rounded-[2.5rem]">
            <div className="space-y-4 text-center w-full">
              <h2 className="text-xl font-black uppercase text-[#0F172A] flex items-center justify-center gap-4 border-b border-[#F1F5F9] pb-4 w-full">
                <FileText className="h-5 w-5 text-emerald-600" /> Resume Artifact Status
              </h2>
              <div className="relative h-40 w-40 mx-auto flex items-center justify-center bg-[#F8FAFC] border-[6px] border-emerald-50 rounded-full shadow-inner group overflow-hidden mt-6">
                <div className="absolute inset-0 bg-emerald-600/5 group-hover:bg-emerald-600 transition-colors duration-500" />
                <span className="relative z-10 text-5xl font-black text-[#0F172A] group-hover:text-white leading-none transition-colors duration-500">{data?.resume_score}<span className="text-xl font-black ml-1">%</span></span>
              </div>
              <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mt-6">GAP: MISSING "SYSTEM DESIGN" & "AWS" KEYWORDS</p>
            </div>
            <Button onClick={() => setShowResumeTune(true)} className="w-full bg-emerald-600 hover:bg-emerald-700 h-10 text-[10px] font-black uppercase tracking-widest shadow-sm rounded-xl">
              <Zap className="h-4 w-4 mr-2" /> AUTO-TUNE ARTIFACT
            </Button>
          </div>
        </div>
      </div>

      {/* Mock Interview & Intelligence Base */}
      <div className="bg-white border border-[#E2E8F0] shadow-sm p-8 space-y-6 rounded-[2.5rem] overflow-hidden flex flex-col items-center hover:shadow-md transition-all">
        <h2 className="text-xl font-black uppercase text-[#0F172A] flex items-center gap-3 border-b border-[#F1F5F9] pb-4 w-full">
          <BrainCircuit className="h-5 w-5 text-blue-600" /> Interview Intelligence Protocol
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          <div className="bg-[#F1F5F9] p-6 rounded-2xl border border-[#CBD5E1] flex flex-col gap-4">
            <h3 className="text-[10px] font-black uppercase text-[#475569]/60 tracking-widest mb-2">AI BEHAVIORAL TIPS</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-[10px] font-black uppercase text-[#0F172A] leading-relaxed border-l-2 border-blue-600 pl-3">
                Use the STAR Method for behavioral queries.
              </li>
              <li className="flex items-center gap-3 text-[10px] font-black uppercase text-[#0F172A] leading-relaxed border-l-2 border-blue-600 pl-3">
                Speak specifically about scalable architecture details.
              </li>
              <li className="flex items-center gap-3 text-[10px] font-black uppercase text-[#0F172A] leading-relaxed border-l-2 border-blue-600 pl-3">
                Address previous project failures as growth nodes.
              </li>
            </ul>
          </div>

          <div 
            onClick={() => {setMockStep(1); setShowMockInterview(true)}}
            className="p-8 bg-blue-50 rounded-2xl border-2 border-dashed border-blue-200 flex flex-col items-center justify-center text-center space-y-3 group hover:border-blue-600 hover:bg-blue-600 transition-all shadow-sm cursor-pointer"
          >
            <div className="h-12 w-12 bg-white border border-[#E2E8F0] rounded-full flex items-center justify-center text-blue-600 group-hover:bg-white transition-all shadow-sm group-hover:scale-110">
              <Play className="h-5 w-5 ml-1" />
            </div>
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest group-hover:text-white transition-colors">INITIALIZE MOCK INTERVIEW</p>
          </div>
        </div>
      </div>

      {/* OVERLAYS / MODALS */}
      <AnimatePresence>
        {showApplyModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
             <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-sm w-full flex flex-col items-center space-y-6 text-center">
                <Loader2 className="h-12 w-12 text-emerald-600 animate-spin" />
                <h3 className="text-xl font-black uppercase text-[#0F172A]">Applying to {showApplyModal.name}</h3>
                <p className="text-[10px] font-black tracking-widest text-[#475569]/60 uppercase">Injecting Profile Artifacts...</p>
             </div>
          </motion.div>
        )}

        {showResumeTune && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
             <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full border border-[#E2E8F0] space-y-6 relative overflow-hidden">
                <button onClick={() => setShowResumeTune(false)} className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full hover:bg-rose-100 hover:text-rose-600 transition-colors"><X className="h-4 w-4" /></button>
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <Zap className="h-6 w-6 text-emerald-600" />
                  <h3 className="text-lg font-black uppercase text-[#0F172A]">Artifact Tuning Protocol</h3>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-rose-50 rounded-xl space-y-2 border border-rose-100">
                    <p className="text-[9px] font-black uppercase tracking-widest text-rose-600">Skill Gap Detected</p>
                    <p className="text-xs font-bold text-[#0F172A] uppercase">Missing keywords: "System Design", "AWS", "Microservices". Target roles heavily favor these.</p>
                  </div>
                  <div className="p-4 bg-emerald-50 rounded-xl space-y-2 border border-emerald-100">
                    <p className="text-[9px] font-black uppercase tracking-widest text-emerald-600">Actionable Suggestion</p>
                    <p className="text-xs font-bold text-[#0F172A] uppercase">Integrate AWS deployment nodes in "Project X" description. Highlight specific scale metrics.</p>
                  </div>
                  <Button onClick={() => setShowResumeTune(false)} className="w-full bg-[#0F172A] hover:bg-black text-white h-10 text-[9px] font-black tracking-widest uppercase">ACKNOWLEDGE & UPDATE</Button>
                </div>
             </div>
          </motion.div>
        )}

        {showMockInterview && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-6">
             <div className="bg-[#F8FAFC] p-8 rounded-[2.5rem] shadow-2xl max-w-2xl w-full border border-[#E2E8F0] space-y-6 relative flex flex-col h-[70vh]">
                <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
                  <div className="flex items-center gap-3">
                    <BrainCircuit className="h-6 w-6 text-blue-600 animate-pulse" />
                    <h3 className="text-xl font-black uppercase text-[#0F172A]">AI Mock Interview</h3>
                  </div>
                  <button onClick={() => {setShowMockInterview(false); setMockStep(0)}} className="p-2 bg-slate-200 rounded-full hover:bg-rose-500 hover:text-white transition-colors"><X className="h-4 w-4" /></button>
                </div>
                
                <div className="flex-1 flex flex-col justify-center space-y-6">
                  {mockStep === 1 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <p className="text-[9px] font-black text-blue-600 uppercase tracking-[0.2em] mb-2">QUESTION 1 / 5 (SYSTEM DESIGN)</p>
                      <h4 className="text-2xl font-black text-[#0F172A] uppercase leading-tight">"How would you design a scalable rate limiter for a distributed API gateway?"</h4>
                      <textarea 
                        value={mockAnswer}
                        onChange={(e) => setMockAnswer(e.target.value)}
                        placeholder="INJECT YOUR ARCHITECTURE RESPONSE..."
                        className="w-full h-32 p-4 bg-white border border-[#CBD5E1] rounded-xl text-sm font-bold text-[#0F172A] uppercase focus:border-blue-600 focus:outline-none resize-none shadow-inner"
                      />
                      <Button disabled={!mockAnswer.trim()} onClick={handleMockSubmit} className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-[10px] font-black uppercase tracking-widest text-white rounded-xl">
                        Submit Response
                      </Button>
                    </div>
                  )}

                  {mockStep === 2 && (
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
                      <p className="text-[10px] font-black text-[#475569] tracking-widest uppercase">EVALUATING NEURAL LOGIC...</p>
                    </div>
                  )}

                  {mockStep === 3 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="h-16 w-16 bg-amber-100 text-amber-600 border-2 border-amber-200 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <Activity className="h-8 w-8" />
                      </div>
                      <h4 className="text-lg font-black text-center text-[#0F172A] uppercase">EVALUATION COMPLETE</h4>
                      <div className="p-5 bg-white border border-[#E2E8F0] shadow-sm rounded-xl">
                        <p className="text-sm font-bold text-[#0F172A] uppercase leading-relaxed">{mockFeedback}</p>
                      </div>
                      <Button onClick={() => {setShowMockInterview(false); setMockStep(0)}} className="w-full bg-[#0F172A] hover:bg-black h-12 text-[10px] font-black uppercase tracking-widest text-white rounded-xl">
                        CONCLUDE SIMULATION
                      </Button>
                    </div>
                  )}
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
