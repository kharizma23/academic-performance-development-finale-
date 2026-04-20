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
 return `http://127.0.0.1:8000${path}`;
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
 <div className="flex h-[80vh] items-center justify-center">
 <Loader2 className="h-24 w-24 animate-spin text-blue-600" />
 </div>
 )

 return (
 <div className="w-full space-y-12 pb-40 text-[#0F172A] font-sans selection:bg-blue-500/10">
 <div className="space-y-6">
 <div className="flex items-center gap-6 mb-4">
 <span className="p-3 bg-blue-100 rounded-xl text-blue-600 border border-blue-200 shadow-sm">
 <ClipboardCheck className="h-8 w-8" />
 </span>
 <h1 className="text-4xl md:text-6xl font-black  uppercase leading-none text-[#0F172A]">
 My <span className="text-[#2563EB] underline decoration-[#E2E8F0] underline-offset-[16px]">Exams</span>
 </h1>
 </div>

 <div className="p-10 rounded-[3rem] bg-white border border-[#E2E8F0] shadow-md relative overflow-hidden flex items-center gap-10">
 <p className="text-xl md:text-2xl font-bold text-[#475569] tracking-tigher uppercase leading-relaxed max-w-5xl">
 PENDING ASSESSMENTS DETECTED. INITIALIZE NEURAL VALIDATION TO MAINTAIN ACADEMIC SYNCHRONY.
 </p>
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 pt-8">
 {exams.map((exam: any) => (
 <motion.div 
 key={exam.id}
 initial={{ opacity: 0, y: 30 }}
 animate={{ opacity: 1, y: 0 }}
 className={cn(
 "glass-card p-12 space-y-10 border transition-all shadow-md group hover:shadow-2xl duration-500",
 exam.status === 'Completed' ? "bg-emerald-50 border-emerald-100" : "bg-white border-[#E2E8F0] hover:border-blue-600"
 )}
 >
 <div className="flex items-center justify-between mb-4">
 <span className={cn(
 "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm",
 exam.difficulty === 'High' ? "bg-rose-50 border-rose-100 text-rose-600" : "bg-blue-50 border-blue-100 text-blue-600 font-bold"
 )}>{exam.difficulty} DIFF</span>
 <div className="flex items-center gap-2 text-[10px] font-bold text-[#475569] uppercase tracking-widest leading-none">
 <Clock className="h-4 w-4 text-blue-500" /> {exam.duration}
 </div>
 </div>
 <h4 className="text-3xl font-black text-[#0F172A] uppercase leading-tight  min-h-[80px] group-hover:text-blue-600 transition-colors">{exam.title}</h4>
 <div className="flex items-center justify-between mt-auto">
 <p className={cn("text-[10px] font-black uppercase tracking-[.3em]", exam.status === 'Completed' ? "text-emerald-600" : "text-[#475569]/40")}>{exam.status}</p>
 {exam.status !== 'Completed' ? (
 <Button onClick={() => startExam(exam)} className="premium-button !h-16 !px-8 text-sm group-hover:scale-105 transition-transform duration-300">
 <Play className="h-5 w-5 mr-3" /> START NODE
 </Button>
 ) : (
 <CheckCircle2 className="h-10 w-10 text-emerald-500 opacity-60" />
 )}
 </div>
 </motion.div>
 ))}
 </div>

 {/* Exam Simulation Node (LIGHT THEME MODAL) */}
 <AnimatePresence>
 {activeExam && (
 <motion.div 
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 className="fixed inset-0 z-[100] bg-[#F8FAFC] flex flex-col items-center p-12 overflow-y-auto custom-scrollbar"
 >
 <div className="w-full max-w-6xl space-y-12">
 <div className="flex items-center justify-between p-10 bg-white rounded-[3rem] border border-[#E2E8F0] shadow-xl">
 <div className="space-y-2">
 <h3 className="text-4xl font-black uppercase  text-[#0F172A] ">{activeExam.title}</h3>
 <p className="text-[10px] font-black text-[#475569]/40 uppercase tracking-[0.4em]">NODE-X VALIDATION IN PROGRESS</p>
 </div>
 <div className="flex items-center gap-8 bg-blue-600 px-10 py-5 rounded-[2rem] border border-[#2563EB] shadow-2xl text-white">
 <Timer className="h-9 w-9 text-white animate-pulse" />
 <p className="text-4xl font-black font-mono ">
 {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
 </p>
 </div>
 </div>

 <div className="glass-card bg-white p-16 space-y-16 border border-[#E2E8F0] shadow-2xl min-h-[500px]">
 <div className="space-y-8">
 <div className="flex items-center gap-6">
 <span className="h-12 w-12 bg-blue-600 rounded-xl flex items-center justify-center font-black text-2xl border border-white/20 text-white shadow-lg">
 {currentQuestionIndex + 1}
 </span>
 <p className="text-[10px] font-black text-[#475569]/40 uppercase tracking-[0.4em]">QUESTION ENTITY</p>
 </div>
 <h2 className="text-4xl font-black text-[#0F172A] uppercase  leading-relaxed ">
 "{activeExam.questions[currentQuestionIndex].question}"
 </h2>
 </div>

 <div className="grid gap-8">
 {activeExam.questions[currentQuestionIndex].type === 'MCQ' ? (
 activeExam.questions[currentQuestionIndex].options.map((opt: string, i: number) => (
 <button 
 key={i}
 className="w-full p-8 rounded-[2rem] bg-[#F8FAFC] border border-[#E2E8F0] hover:border-blue-600 hover:bg-blue-50 text-left transition-all group flex items-center justify-between shadow-sm hover:shadow-md"
 >
 <span className="text-2xl font-black text-[#0F172A] uppercase  group-hover:text-blue-600 transition-colors">{opt}</span>
 <div className="h-8 w-8 rounded-full border-4 border-[#E2E8F0] group-hover:border-blue-600 flex items-center justify-center shadow-inner" />
 </button>
 ))
 ) : (
 <textarea 
 placeholder="INJECT DESCRIPTIVE LOGIC HERE..."
 className="w-full h-80 px-10 py-10 bg-[#F1F5F9] border border-[#CBD5E1] rounded-[2.5rem] text-2xl font-black text-[#0F172A] placeholder:text-[#475569]/20 focus:outline-none focus:border-blue-600 focus:bg-white transition-all uppercase "
 />
 )}
 </div>

 <div className="flex items-center justify-between pt-12 border-t border-[#E2E8F0]">
 <div className="flex gap-4">
 {currentQuestionIndex > 0 && (
 <Button 
 onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
 className="h-20 px-12 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#0F172A] font-black uppercase text-xs tracking-widest border border-[#CBD5E1] rounded-2xl shadow-sm"
 > Back </Button>
 )}
 {currentQuestionIndex < activeExam.questions.length - 1 ? (
 <Button 
 onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
 className="premium-button !h-20 px-12 text-xs"
 > Next Node </Button>
 ) : (
 <Button 
 disabled={isSubmitting}
 onClick={handleSubmit}
 className="premium-button !h-20 px-16 text-xs bg-emerald-600 hover:bg-emerald-500 shadow-[0_10px_40px_rgba(16,185,129,0.2)]"
 >
 {isSubmitting ? <Loader2 className="h-6 w-6 animate-spin" /> : <Send className="h-7 w-7 mr-4" />}
 COMMIT RESPONSE
 </Button>
 )}
 </div>
 <Button 
 onClick={() => setActiveExam(null)}
 className="h-16 px-10 bg-rose-50 hover:bg-rose-100 text-rose-600 font-black uppercase text-[10px] tracking-[0.2em] transition-all rounded-xl border border-rose-100 shadow-sm"
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
