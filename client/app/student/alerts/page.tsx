"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  AlertTriangle, Loader2, ShieldCheck, UserCheck, 
  MessageSquare, ArrowRight, Zap, Target, 
  Sparkles, ShieldAlert, LineChart, Activity, CheckCircle2,
  Calendar, BookOpen, Clock, X, BrainCircuit, RefreshCw,
  TrendingDown, TrendingUp
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export default function MyAlerts() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ cgpa: 0, attendance: 0, testScore: 0 })
  
  const getApiUrl = (path: string) => {
    const envUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8001';
    return `${envUrl}${path}`;
  };

  // History and Interventions
  const [history, setHistory] = useState<any[]>([
    { title: "Mid-Term Deviation", date: "2 Weeks Ago", status: "Resolved" }
  ])
  const [interventions, setInterventions] = useState([
    { title: "DSA Bridge Sequence", status: "Ongoing" },
    { title: "Calculus Crash Course", status: "Completed" }
  ])

  // Modals
  const [activeFixPlan, setActiveFixPlan] = useState<any>(null)
  const [showMentorModal, setShowMentorModal] = useState(false)
  const [toastMsg, setToastMsg] = useState("")

  const fetchStats = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(getApiUrl("/student/profile"), {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStats({
          cgpa: data.current_cgpa || 0,
          attendance: data.attendance_percentage || 0,
          testScore: data.academic_dna_score || 0
        });
      }
    } catch (error) {
      console.error("Failed to sync risk metrics", error);
    }
  };

  useEffect(() => {
    fetchStats()
    setTimeout(() => {
      setLoading(false)
    }, 600)
  }, [])

  const generateDynamicAlerts = () => {
    const alerts = []
    
    // CGPA Logic
    if (stats.cgpa < 6.5) alerts.push({ id: 'cgpa', priority: 'CRITICAL', title: "Low Academic Index", reason: "Cumulative Grade Point Average dropped below institutional threshold.", value: stats.cgpa, action: "Increase tutorial attendance and request remedial assignments.", icon: TrendingDown })
    else if (stats.cgpa < 7.5) alerts.push({ id: 'cgpa', priority: 'WARNING', title: "CGPA Fluctuation", reason: "Tracking below standard academic projection.", value: stats.cgpa, action: "Monitor scoring across upcoming internals.", icon: TrendingDown })

    // Attendance Logic
    if (stats.attendance < 75) alerts.push({ id: 'att', priority: 'CRITICAL', title: "Attendance Deviation", reason: "Mandatory campus presence is severely compromised.", value: `${stats.attendance}%`, action: "100% attendance required for the next 4 weeks.", icon: Clock })
    else if (stats.attendance < 85) alerts.push({ id: 'att', priority: 'WARNING', title: "Attendance Margin", reason: "Approaching risky absence quota.", value: `${stats.attendance}%`, action: "Ensure presence in core modules.", icon: Clock })

    // Test Score Logic
    if (stats.testScore < 50) alerts.push({ id: 'test', priority: 'CRITICAL', title: "Performance Risk", reason: "Latest periodic assessment resulted in a fail grade.", value: `${stats.testScore}%`, action: "Complete mandatory bridge protocol.", icon: Activity })
    else if (stats.testScore < 65) alerts.push({ id: 'test', priority: 'WARNING', title: "Performance Drop", reason: "Sub-optimal output during recent evaluations.", value: `${stats.testScore}%`, action: "Review marked syllabus nodes immediately.", icon: Activity })

    return alerts
  }

  const alerts = generateDynamicAlerts()

  const handleSimulateImprovement = () => {
    // Moves stats out of critical bounds to test auto-resolution!
    setStats({ cgpa: 8.6, attendance: 92, testScore: 85 })
    
    // Auto push resolved to history
    alerts.forEach(a => {
      setHistory(prev => [{ title: a.title, date: "Just Now", status: "Resolved" }, ...prev])
    })
  }

  const handleSimulateRisk = () => {
    setStats({ cgpa: 6.2, attendance: 71, testScore: 45 })
  }

  const handleFixPlan = (alert: any) => {
    setActiveFixPlan(alert)
  }

  const handleShowToast = (msg: string) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(""), 3000)
  }

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-[#F8FAFC]">
      <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
    </div>
  )

  return (
    <div className="w-full space-y-8 pb-20 text-[#0F172A] font-sans selection:bg-rose-500/10">
      
      {/* Header Segment */}
      <div className="bg-white p-8 rounded-[2rem] border border-[#E2E8F0] shadow-sm relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
        <div>
           <div className="flex items-center gap-4 mb-2">
             <span className={cn("p-2 rounded-xl border shadow-sm", alerts.length > 0 ? "bg-rose-100 text-rose-600 border-rose-200" : "bg-emerald-100 text-emerald-600 border-emerald-200")}>
               <ShieldAlert className="h-6 w-6" />
             </span>
             <h1 className="text-3xl font-black uppercase text-[#0F172A] leading-none">Risk Monitoring <span className={alerts.length > 0 ? "text-rose-600" : "text-emerald-600"}>Node</span></h1>
           </div>
           
           <div className={cn("inline-flex items-center gap-2 px-4 py-2 mt-4 rounded-xl border shadow-sm text-[10px] font-black uppercase tracking-widest", alerts.length > 0 ? "bg-rose-50 border-rose-100 text-rose-600" : "bg-emerald-50 border-emerald-100 text-emerald-600")}>
             <Activity className={cn("h-4 w-4", alerts.length > 0 && "animate-pulse")} /> 
             {alerts.length > 0 ? 'CRITICAL DEVIATIONS DETECTED. IMMEDIATE INTERVENTION REQUIRED.' : 'ALL NODES WITHIN TOLERANCE. PULSE STABLE.'}
           </div>
        </div>

        {/* Development Tool to Test Dynamic Auto-Resolution */}
        <div className="flex items-center gap-3 bg-[#F8FAFC] p-4 rounded-2xl border border-[#E2E8F0] z-10 shrink-0">
           <div className="mr-2">
             <p className="text-[8px] font-black uppercase tracking-widest text-[#475569] mb-1">DATA DYNAMICS TERMINAL</p>
             <p className="text-xs font-black uppercase text-[#0F172A]">Simulate Sync</p>
           </div>
           <Button onClick={handleSimulateRisk} variant="outline" className="h-9 px-4 text-[9px] font-black uppercase tracking-widest shadow-sm hover:bg-rose-50 hover:text-rose-600">Inject Risk</Button>
           <Button onClick={handleSimulateImprovement} className="h-9 px-4 bg-[#0F172A] hover:bg-black text-white text-[9px] font-black uppercase tracking-widest shadow-sm">Stabilize Node</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Dynamic Alerts Matrix */}
        <div className="bg-white border border-[#E2E8F0] shadow-sm p-8 space-y-6 rounded-[2.5rem] h-fit">
          <h2 className="text-lg font-black uppercase text-[#0F172A] flex items-center gap-3 border-b border-[#F1F5F9] pb-3">
            <AlertTriangle className={cn("h-5 w-5", alerts.length > 0 ? "text-rose-600" : "text-emerald-600")} /> Real-Time Triggers
          </h2>
          
          <div className="space-y-4">
            <AnimatePresence>
               {alerts.length > 0 ? alerts.map((alert, i) => (
                 <motion.div 
                   key={alert.id}
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, scale: 0.95 }}
                   className={cn(
                     "p-6 rounded-2xl border shadow-sm flex flex-col gap-4 group transition-all",
                     alert.priority === 'CRITICAL' ? "bg-rose-50 border-rose-200" : "bg-amber-50 border-amber-200"
                   )}
                 >
                   <div className="flex items-start justify-between gap-4">
                     <div className="flex items-start gap-4">
                       <div className={cn("h-10 w-10 rounded-xl border flex items-center justify-center shrink-0 shadow-sm", alert.priority === 'CRITICAL' ? "bg-white border-rose-200 text-rose-600" : "bg-white border-amber-200 text-amber-600")}>
                         <alert.icon className="h-5 w-5" />
                       </div>
                       <div className="space-y-0.5">
                         <div className="flex items-center gap-2">
                            <span className={cn("px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border shadow-[0_0_10px_rgba(0,0,0,0.05)]", alert.priority === 'CRITICAL' ? "bg-rose-600 text-white border-rose-700" : "bg-amber-500 text-white border-amber-600")}>{alert.priority} DETECT</span>
                         </div>
                         <h4 className="text-sm font-black text-[#0F172A] uppercase leading-none mt-1">{alert.title}</h4>
                         <p className="text-[10px] font-bold text-[#475569] uppercase leading-tight mt-1">{alert.reason}</p>
                       </div>
                     </div>
                     <div className="text-right">
                       <p className="text-[8px] font-black uppercase tracking-widest text-[#475569]">Metric</p>
                       <p className={cn("text-2xl font-black leading-none mt-0.5", alert.priority === 'CRITICAL' ? "text-rose-600" : "text-amber-600")}>{alert.value}</p>
                     </div>
                   </div>

                   <div className="pt-4 border-t border-black/5 flex flex-wrap items-center gap-2">
                     <Button variant="outline" className="h-8 px-4 text-[9px] font-black uppercase tracking-widest bg-white hover:bg-slate-50 text-[#0F172A]">View Details</Button>
                     <Button onClick={() => handleFixPlan(alert)} className="h-8 px-4 text-[9px] font-black uppercase tracking-widest bg-blue-600 hover:bg-blue-700 text-white">Fix Plan</Button>
                     <Button onClick={() => setShowMentorModal(true)} className="h-8 px-4 text-[9px] font-black uppercase tracking-widest bg-emerald-600 hover:bg-emerald-700 text-white"><MessageSquare className="h-3 w-3 mr-2"/> Contact Mentor</Button>
                   </div>
                 </motion.div>
               )) : (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 rounded-2xl bg-emerald-50 border border-emerald-100 text-center space-y-4 shadow-sm">
                   <div className="h-16 w-16 bg-white border border-emerald-200 rounded-full flex items-center justify-center mx-auto shadow-sm">
                     <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                   </div>
                   <div>
                     <h3 className="text-sm font-black text-emerald-700 uppercase">ACADEMIC DNA STABILIZED</h3>
                     <p className="text-[10px] font-bold text-emerald-600/80 uppercase tracking-widest">All metrics operating within optimal thresholds.</p>
                   </div>
                 </motion.div>
               )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Segment: Mentor, Interventions & History */}
        <div className="space-y-8">
          
          <div className="bg-white border border-[#E2E8F0] shadow-sm p-8 space-y-6 rounded-[2.5rem]">
            <h2 className="text-lg font-black uppercase text-[#0F172A] flex items-center justify-between border-b border-[#F1F5F9] pb-3">
              <span className="flex items-center gap-3"><UserCheck className="h-5 w-5 text-blue-600" /> Mentor Sync</span>
              <Button onClick={() => setShowMentorModal(true)} variant="outline" className="h-7 px-3 text-[8px] font-black uppercase tracking-widest text-blue-600 border-blue-200 bg-blue-50">Sync Schedule</Button>
            </h2>
            
            <div className="flex items-center gap-6 p-6 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl shadow-sm">
               <div className="h-14 w-14 bg-white border border-[#CBD5E1] rounded-xl flex items-center justify-center text-blue-600 shadow-sm shrink-0">
                 <UserCheck className="h-6 w-6" />
               </div>
               <div>
                 <h4 className="text-lg font-black uppercase text-[#0F172A] leading-none mb-1">Dr. Aruna Kumar</h4>
                 <p className="text-[9px] font-black uppercase tracking-widest text-[#475569]">Cognitive Lead & Institutional Mentor</p>
               </div>
            </div>
            
            <Button onClick={() => setShowMentorModal(true)} className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest text-[9px] rounded-xl shadow-sm">
              <MessageSquare className="h-4 w-4 mr-2" /> Initialize Chat Sync
            </Button>
          </div>

          <div className="bg-white border border-[#E2E8F0] shadow-sm p-8 space-y-6 rounded-[2.5rem]">
            <h2 className="text-lg font-black uppercase text-[#0F172A] flex items-center gap-3 border-b border-[#F1F5F9] pb-3">
              <Target className="h-5 w-5 text-blue-600" /> Intervention Nodes
            </h2>
            <div className="space-y-3">
              {interventions.map((prog, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center shadow-sm", prog.status === 'Ongoing' ? 'bg-amber-50 border border-amber-200 text-amber-600' : 'bg-emerald-50 border border-emerald-200 text-emerald-600')}>
                      {prog.status === 'Ongoing' ? <RefreshCw className="h-4 w-4 animate-spin-slow" /> : <CheckCircle2 className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-[#0F172A] uppercase leading-none">{prog.title}</p>
                      <p className="text-[8px] font-black text-[#475569] uppercase tracking-widest mt-1">{prog.status}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-[#E2E8F0] shadow-sm p-8 space-y-6 rounded-[2.5rem]">
             <h2 className="text-lg font-black uppercase text-[#0F172A] flex items-center gap-3 border-b border-[#F1F5F9] pb-3">
               <ShieldCheck className="h-5 w-5 text-emerald-600" /> Alert History
             </h2>
             <div className="space-y-3">
               {history.map((hist, i) => (
                 <div key={i} className="flex flex-col p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                       <p className="text-[10px] font-black text-[#0F172A] uppercase leading-none">{hist.title}</p>
                       <span className="px-2 py-0.5 bg-emerald-100 text-emerald-600 text-[8px] font-black uppercase tracking-widest rounded shadow-sm">{hist.status}</span>
                    </div>
                    <p className="text-[8px] font-bold text-[#475569] uppercase tracking-widest">Marked: {hist.date}</p>
                 </div>
               ))}
               {history.length === 0 && <p className="text-[10px] font-black uppercase text-[#475569] tracking-widest text-center py-4">No historical records.</p>}
             </div>
          </div>

        </div>
      </div>

      {/* AI Stability Core */}
      <div className="bg-[#0F172A] border border-[#0F172A] shadow-lg p-8 space-y-8 rounded-[2.5rem] relative overflow-hidden mt-8 text-white">
         <div className="absolute top-0 right-0 p-8 opacity-10">
           <BrainCircuit className="h-40 w-40" />
         </div>
         <div className="relative z-10 space-y-2">
            <h3 className="text-xl font-black uppercase leading-tight">AI Stability Hub</h3>
            <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-2">
              <Sparkles className="h-4 w-4" /> Global Neural Suggestions Engine Run
            </p>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10 w-full lg:w-3/4">
            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl space-y-3">
               <h4 className="text-[9px] font-black text-blue-400 uppercase tracking-widest">BRIDGE SYNCHRONY</h4>
               <p className="text-xs font-bold leading-relaxed uppercase opacity-80">"Review your data structures mock module to stabilize the placement index. Generating interactive lab nodes..."</p>
            </div>
            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl space-y-3">
               <h4 className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">BEHAVIORAL ALIGNMENT</h4>
               <p className="text-xs font-bold leading-relaxed uppercase opacity-80">"Increase attendance syncs structurally to maintain semester credit validity. Check local node schedule."</p>
            </div>
         </div>
      </div>

      {/* FIX PLAN MODAL OVERLAY */}
      <AnimatePresence>
        {activeFixPlan && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-[#0F172A]/80 backdrop-blur-md flex items-center justify-center p-4">
             <div className="bg-white w-full max-w-2xl rounded-[2rem] shadow-2xl border border-[#E2E8F0] overflow-hidden">
                <div className="p-6 border-b border-[#F1F5F9] flex items-center justify-between bg-[#F8FAFC]">
                   <div className="flex items-center gap-3">
                     <div className="h-10 w-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
                       <BrainCircuit className="h-5 w-5" />
                     </div>
                     <div>
                       <h2 className="text-lg font-black text-[#0F172A] uppercase">AI Remediation Plan</h2>
                       <p className="text-[9px] font-black text-[#475569] uppercase tracking-widest mt-0.5">TARGET: {activeFixPlan.title}</p>
                     </div>
                   </div>
                   <button onClick={() => setActiveFixPlan(null)} className="h-8 w-8 bg-white border border-[#E2E8F0] rounded-full flex items-center justify-center shadow-sm hover:text-rose-600 hover:bg-rose-50 transition-colors"><X className="h-4 w-4" /></button>
                </div>
                
                <div className="p-8 space-y-8">
                   <div className="p-5 bg-blue-50 border border-blue-100 rounded-2xl relative overflow-hidden">
                      <div className="absolute -right-2 -bottom-2 opacity-5"><Target className="h-24 w-24 text-blue-600" /></div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#475569] mb-2">NEURAL TRAJECTORY FIX:</p>
                      <p className="text-sm font-bold text-blue-900 leading-relaxed uppercase">"{activeFixPlan.action}"</p>
                   </div>
                   
                   <div className="space-y-4">
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#475569]">STUDY PLAN NODES</p>
                      {[
                        "Complete 2 Hours of Remedial PDF Logs.",
                        "Synchronize with Mentor within 48 Hours.",
                        "Complete the Module Quiz Bridge."
                      ].map((step, i) => (
                        <div key={i} className="flex items-center gap-4 bg-[#F8FAFC] border border-[#CBD5E1] p-4 rounded-xl">
                           <div className="h-6 w-6 bg-white border border-[#CBD5E1] rounded-full flex items-center justify-center text-[10px] font-black shadow-sm shrink-0">{i+1}</div>
                           <p className="text-[10px] font-bold text-[#0F172A] uppercase">{step}</p>
                        </div>
                      ))}
                   </div>
                   
                   <Button onClick={() => setActiveFixPlan(null)} className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest text-[10px] rounded-xl shadow-md">
                      Commit To Plan
                   </Button>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MENTOR MODAL OVERLAY */}
      <AnimatePresence>
        {showMentorModal && (
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-[#0F172A]/80 backdrop-blur-md flex items-center justify-center p-4">
             <div className="bg-white w-full max-w-xl rounded-[2rem] shadow-2xl border border-[#E2E8F0] overflow-hidden">
                <div className="p-6 border-b border-[#F1F5F9] flex items-center justify-between bg-[#F8FAFC]">
                   <div className="flex items-center gap-3">
                     <div className="h-10 w-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 shadow-sm">
                       <Calendar className="h-5 w-5" />
                     </div>
                     <div>
                       <h2 className="text-lg font-black text-[#0F172A] uppercase">Mentor Synchronization</h2>
                       <p className="text-[9px] font-black text-[#475569] uppercase tracking-widest mt-0.5">CONNECTING TO: DR. ARUNA KUMAR</p>
                     </div>
                   </div>
                   <button onClick={() => setShowMentorModal(false)} className="h-8 w-8 bg-white border border-[#E2E8F0] rounded-full flex items-center justify-center shadow-sm hover:text-rose-600 hover:bg-rose-50 transition-colors"><X className="h-4 w-4" /></button>
                </div>
                
                <div className="p-8 space-y-6">
                   <div className="grid grid-cols-2 gap-4">
                      <Button onClick={() => { setShowMentorModal(false); handleShowToast("Chat sequence initiated...") }} className="h-16 bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white border border-blue-200 transition-colors uppercase font-black tracking-widest text-[9px] flex flex-col gap-2 rounded-xl">
                        <MessageSquare className="h-4 w-4" /> INITIATE CHAT
                      </Button>
                      <Button onClick={() => { setShowMentorModal(false); handleShowToast("Calendar slot requested...") }} className="h-16 bg-emerald-50 hover:bg-emerald-600 text-emerald-600 hover:text-white border border-emerald-200 transition-colors uppercase font-black tracking-widest text-[9px] flex flex-col gap-2 rounded-xl">
                        <Calendar className="h-4 w-4" /> BOOK CALENDAR SLOT
                      </Button>
                   </div>
                   
                   <div className="pt-6 border-t border-[#F1F5F9] space-y-4">
                     <p className="text-[9px] font-black uppercase tracking-widest text-[#475569] mb-2">QUICK MESSAGE INJECTION</p>
                     <textarea placeholder="DESCRIBE YOUR ACADEMIC BLOCKER..." className="w-full h-24 p-4 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-[10px] uppercase font-bold focus:border-blue-600 focus:outline-none resize-none" />
                     <Button onClick={() => { setShowMentorModal(false); handleShowToast("Message synced securely to mentor terminal.") }} className="w-full h-10 bg-[#0F172A] hover:bg-black text-white font-black uppercase tracking-widest text-[9px] rounded-xl shadow-md">
                        Transmit Data
                     </Button>
                   </div>
                </div>
             </div>
           </motion.div>
        )}
      </AnimatePresence>

      {/* CUSTOM IN-APP TOAST */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }} 
            animate={{ opacity: 1, y: 0, scale: 1 }} 
            exit={{ opacity: 0, scale: 0.9, y: 20 }} 
            className="fixed bottom-8 right-8 z-[100] bg-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl border border-emerald-500 flex items-center gap-4"
          >
            <div className="h-8 w-8 bg-white/20 rounded-full flex items-center justify-center shrink-0">
               <CheckCircle2 className="h-5 w-5 text-white" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest">{toastMsg}</p>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}
