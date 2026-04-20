"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  ClipboardCheck, Loader2, Play, Clock, 
  CheckCircle2, AlertCircle, Sparkles, 
  Timer, Send, ChevronRight, X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function MyExams() {
  const [exams, setExams] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeExam, setActiveExam] = useState<any>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const getApiUrl = (path: string) => {
    return `http://127.0.0.1:8001${path}`;
  };

  useEffect(() => {
    fetchExams()
  }, [])

  useEffect(() => {
    let timer: any
    if (activeExam && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => (prev > 0 ? prev - 1 : 0))
      }, 1000)
    } else if (activeExam && timeLeft === 0) {
      handleAutoSubmit()
    }
    return () => clearInterval(timer)
  }, [activeExam, timeLeft])

  const fetchExams = async () => {
    const token = localStorage.getItem('token')
    const headers = { 'Authorization': `Bearer ${token}` }
    try {
      const res = await fetch(getApiUrl("/student/exams"), { headers })
      if (res.ok) setExams(await res.json())
    } catch (error) {
      console.error("Failed to fetch exams node", error)
    } finally {
      setLoading(false)
    }
  }

  const startExam = async (exam: any) => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(getApiUrl(`/student/exams/${exam.id}`), {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        const fullExam = await res.json()
        setActiveExam(fullExam)
        const duration = parseInt(fullExam.duration.replace('m', '')) * 60
        setTimeLeft(duration)
        setCurrentQuestionIndex(0)
      }
    } catch (error) {
      console.error("Failed to fetch exam depth node", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAutoSubmit = () => {
    setIsSubmitting(true)
    setTimeout(() => {
      setActiveExam(null)
      setIsSubmitting(false)
      alert("Temporal constraint reached. Node response automatically synchronized.")
      fetchExams()
    }, 2000)
  }

  const handleSubmit = () => {
    setIsSubmitting(true)
    setTimeout(() => {
      setActiveExam(null)
      setIsSubmitting(false)
      alert("Exam metrics successfully committed to the institutional cloud.")
      fetchExams()
    }, 2000)
  }

  if (loading) return (
    <div className="flex h-[40vh] items-center justify-center">
      <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
    </div>
  )

  return (
    <div className="w-full space-y-8 pb-20 text-[#0F172A] font-sans selection:bg-blue-500/10">
      <div className="space-y-4">
        <div className="flex items-center gap-4 mb-2">
          <span className="p-2 bg-blue-100 rounded-xl text-blue-600 border border-blue-200 shadow-sm">
            <ClipboardCheck className="h-6 w-6" />
          </span>
          <h1 className="text-3xl md:text-4xl font-black uppercase leading-none text-[#0F172A]">
            My <span className="text-[#2563EB]">Exams</span>
          </h1>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm relative overflow-hidden flex items-center gap-6">
          <p className="text-sm font-bold text-[#475569] uppercase leading-relaxed max-w-5xl">
            PENDING ASSESSMENTS DETECTED. INITIALIZE NEURAL VALIDATION TO MAINTAIN ACADEMIC SYNCHRONY.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {exams.map((exam: any) => (
          <motion.div 
            key={exam.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "p-8 space-y-6 rounded-[2.5rem] border transition-all shadow-sm group hover:shadow-md",
              exam.status === 'Completed' ? "bg-emerald-50 border-emerald-100" : "bg-white border-[#E2E8F0] hover:border-blue-600"
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={cn(
                "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm",
                exam.difficulty === 'High' ? "bg-rose-50 border-rose-100 text-rose-600" : "bg-blue-50 border-blue-100 text-blue-600"
              )}>{exam.difficulty} DIFF</span>
              <div className="flex items-center gap-2 text-[9px] font-bold text-[#475569] uppercase tracking-widest leading-none">
                <Clock className="h-4 w-4 text-blue-500" /> {exam.duration}
              </div>
            </div>
            <h4 className="text-xl font-black text-[#0F172A] uppercase leading-tight min-h-[40px] group-hover:text-blue-600 transition-colors">{exam.title}</h4>
            <div className="flex items-center justify-between mt-auto">
              <p className={cn("text-[9px] font-black uppercase tracking-widest", exam.status === 'Completed' ? "text-emerald-600" : "text-[#475569]/40")}>{exam.status}</p>
              {exam.status !== 'Completed' ? (
                <Button onClick={() => startExam(exam)} className="h-10 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-md transition-all group-hover:scale-105">
                  <Play className="h-4 w-4 mr-2" /> Start Mode
                </Button>
              ) : (
                <CheckCircle2 className="h-8 w-8 text-emerald-500 opacity-60" />
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Exam Simulation Node */}
      <AnimatePresence>
        {activeExam && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-[#F8FAFC] flex flex-col items-center p-6 lg:p-12 overflow-y-auto custom-scrollbar"
          >
            <div className="w-full max-w-4xl space-y-8">
              <div className="flex items-center justify-between p-8 bg-white rounded-[2.5rem] border border-[#E2E8F0] shadow-md">
                <div className="space-y-2">
                  <h3 className="text-2xl font-black uppercase text-[#0F172A]">{activeExam.title}</h3>
                  <p className="text-[9px] font-black text-[#475569]/40 uppercase tracking-[0.2em]">NODE-X VALIDATION IN PROGRESS</p>
                </div>
                <div className="flex items-center gap-4 bg-blue-600 px-6 py-3 rounded-2xl shadow-md text-white">
                  <Timer className="h-6 w-6 text-white animate-pulse" />
                  <p className="text-2xl font-black font-mono">
                    {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                  </p>
                </div>
              </div>

              <div className="bg-white p-10 space-y-10 border border-[#E2E8F0] rounded-[2.5rem] shadow-md min-h-[400px]">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <span className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center font-black text-xl text-white shadow-sm">
                      {currentQuestionIndex + 1}
                    </span>
                    <p className="text-[9px] font-black text-[#475569]/40 uppercase tracking-[0.2em]">QUESTION ENTITY</p>
                  </div>
                  <h2 className="text-2xl font-black text-[#0F172A] uppercase leading-relaxed">
                    "{activeExam.questions[currentQuestionIndex].question}"
                  </h2>
                </div>

                <div className="grid gap-4">
                  {activeExam.questions[currentQuestionIndex].type === 'MCQ' ? (
                    activeExam.questions[currentQuestionIndex].options.map((opt: string, i: number) => (
                      <button 
                        key={i}
                        className="w-full p-6 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-blue-600 hover:bg-blue-50 text-left transition-all flex items-center justify-between shadow-sm group"
                      >
                        <span className="text-lg font-black text-[#0F172A] uppercase group-hover:text-blue-600 transition-colors">{opt}</span>
                        <div className="h-6 w-6 rounded-full border-2 border-[#E2E8F0] group-hover:border-blue-600 flex items-center justify-center shadow-inner" />
                      </button>
                    ))
                  ) : (
                    <textarea 
                      placeholder="INJECT DESCRIPTIVE LOGIC HERE..."
                      className="w-full h-48 p-6 bg-[#F1F5F9] border border-[#CBD5E1] rounded-2xl text-lg font-bold text-[#0F172A] placeholder:text-[#475569]/40 focus:outline-none focus:border-blue-600 focus:bg-white transition-all uppercase"
                    />
                  )}
                </div>

                <div className="flex items-center justify-between pt-8 border-t border-[#E2E8F0]">
                  <div className="flex gap-4">
                    {currentQuestionIndex > 0 && (
                      <Button 
                        onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                        className="h-12 px-6 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#0F172A] font-black uppercase text-xs tracking-widest border border-[#CBD5E1] rounded-xl shadow-sm"
                      > Back </Button>
                    )}
                    {currentQuestionIndex < activeExam.questions.length - 1 ? (
                      <Button 
                        onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                        className="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase text-xs tracking-widest rounded-xl shadow-sm"
                      > Next Node </Button>
                    ) : (
                      <Button 
                        disabled={isSubmitting}
                        onClick={handleSubmit}
                        className="h-12 px-8 text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest rounded-xl shadow-md"
                      >
                        {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5 mr-3" />}
                        COMMIT RESPONSE
                      </Button>
                    )}
                  </div>
                  <Button 
                    onClick={() => setActiveExam(null)}
                    className="h-10 px-6 bg-rose-50 hover:bg-rose-100 text-rose-600 font-black uppercase text-[10px] tracking-widest transition-all rounded-xl border border-rose-100 shadow-sm"
                  > ABORT SESSION </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
