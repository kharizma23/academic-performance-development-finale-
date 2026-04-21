"use client"

import { useState, useEffect, use } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Play, FileText, CheckCircle2, ChevronLeft, 
  Loader2, Zap, BrainCircuit, MessageSquare, 
  Send, Maximize2, Award, X
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function CoursePlayer({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const courseId = resolvedParams.id

  const [course, setCourse] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTopicIndex, setActiveTopicIndex] = useState(0)
  const [completedTopics, setCompletedTopics] = useState<number[]>([])

  // AI Assistant State
  const [aiInput, setAiInput] = useState("")
  const [aiChat, setAiChat] = useState<{role: string, text: string}[]>([])
  const [aiIsTyping, setAiIsTyping] = useState(false)

  // Certificate Modal State
  const [showCert, setShowCert] = useState(false)
  const [studentName, setStudentName] = useState("STUDENT NODE")

  useEffect(() => {
    setStudentName(localStorage.getItem("studentName") || "STUDENT NODE")

    // Simulated fetching for the course data
    setTimeout(() => {
      // Mock db response
      const mockCourse = {
        id: courseId,
        title: courseId === "c1" ? "FastAPI Masterclass" : (courseId === "c2" ? "PostgreSQL Performance" : "System Design Implementations"),
        type: courseId === "c2" ? "PDF" : "Video",
        topics: [
          { title: "Introduction & Architecture", duration: "12m" },
          { title: "Dependency Injection Systems", duration: "25m" },
          { title: "Scalable Routing Protocols", duration: "18m" },
          { title: "Database Middleware Integration", duration: "30m" },
          { title: "Production Deployment Strategies", duration: "45m" }
        ]
      }
      setCourse(mockCourse)

      // Restore saved progress
      const savedProgress = JSON.parse(localStorage.getItem(`course_prog_${courseId}`) || '[]')
      setCompletedTopics(savedProgress)

      // Restore last active topic to continue learning
      const lastActive = parseInt(localStorage.getItem(`course_last_${courseId}`) || '0')
      setActiveTopicIndex(lastActive)

      setLoading(false)
    }, 500)
  }, [courseId])

  const markCompleted = (index: number) => {
    let newCompleted = [...completedTopics]
    if (!newCompleted.includes(index)) {
      newCompleted.push(index)
      setCompletedTopics(newCompleted)
      localStorage.setItem(`course_prog_${course.id}`, JSON.stringify(newCompleted))
    }
    // Auto advance
    if (index + 1 < course.topics.length) {
      handleTopicChange(index + 1)
    }
  }

  const handleTopicChange = (index: number) => {
    setActiveTopicIndex(index)
    localStorage.setItem(`course_last_${course?.id}`, index.toString())
  }

  const handleAiChat = (e: React.FormEvent) => {
    e.preventDefault()
    if (!aiInput.trim()) return

    const userText = aiInput
    setAiInput("")
    setAiChat(prev => [...prev, { role: "user", text: userText }])
    setAiIsTyping(true)

    setTimeout(() => {
      setAiChat(prev => [...prev, { role: "ai", text: `Analyzing "${course.topics[activeTopicIndex].title}"... To understand this concept, focus on how decoupling enables horizontal scaling. Need more detail?` }])
      setAiIsTyping(false)
    }, 1200)
  }

  if (loading || !course) return (
    <div className="flex h-screen items-center justify-center bg-[#F8FAFC]">
      <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
    </div>
  )

  const progressPercent = Math.round((completedTopics.length / course.topics.length) * 100)

  return (
    <div className="flex h-screen w-full bg-[#F8FAFC] text-[#0F172A] font-sans selection:bg-blue-500/10 overflow-hidden relative">
      
      {/* LEFT CONTENT AREA: Player & Data */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto custom-scrollbar">
        {/* Header */}
        <header className="h-20 shrink-0 bg-white border-b border-[#E2E8F0] px-8 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-6">
            <Link href="/student/learning" className="h-10 w-10 bg-[#F1F5F9] hover:bg-rose-50 hover:text-rose-600 border border-[#CBD5E1] rounded-xl flex items-center justify-center transition-all">
              <ChevronLeft className="h-5 w-5" />
            </Link>
            <div className="space-y-1 mt-1">
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 rounded uppercase tracking-widest text-[8px] font-black bg-blue-50 text-blue-600 border border-blue-100">{course.type}</span>
                <p className="text-[10px] font-black tracking-widest text-[#475569]/60 uppercase">ACTIVE NODE: {activeTopicIndex + 1} OF {course.topics.length}</p>
              </div>
              <h1 className="text-2xl font-black uppercase tracking-tight text-[#0F172A] leading-none mb-1">{course.title}</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="flex flex-col items-end mr-4">
               <span className="text-[9px] font-black uppercase tracking-widest text-[#475569] mb-1">Module Progress</span>
               <div className="flex items-center gap-3">
                 <div className="w-32 h-2 bg-[#F1F5F9] rounded-full overflow-hidden border border-[#E2E8F0]">
                   <div className="h-full bg-blue-600 transition-all duration-700 w-full" style={{ width: `${progressPercent}%` }} />
                 </div>
                 <span className="text-sm font-black text-blue-600 w-8">{progressPercent}%</span>
               </div>
             </div>
             {progressPercent === 100 && (
               <Button onClick={() => setShowCert(true)} className="h-10 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[9px] uppercase tracking-widest rounded-xl shadow-md">
                 <Award className="h-4 w-4 mr-2" /> Certify
               </Button>
             )}
          </div>
        </header>

        {/* Player Viewport */}
        <div className="p-8 pb-4">
          <div className="w-full bg-[#0F172A] aspect-video rounded-3xl relative overflow-hidden shadow-xl flex items-center justify-center group">
             {course.type === 'Video' ? (
                <video 
                  key={activeTopicIndex}
                  controls 
                  autoPlay
                  className="absolute inset-0 w-full h-full object-cover"
                  src={course.topics[activeTopicIndex]?.videoUrl || "https://www.w3schools.com/html/mov_bbb.mp4"}
                />
             ) : (
                <div className="relative flex flex-col items-center justify-center z-10">
                  <FileText className="h-20 w-20 text-white/20 mb-4" />
                  <p className="text-white/40 font-black uppercase tracking-widest text-xs">PDF VIEWER INITIALIZATION...</p>
                </div>
             )}

             <div className="absolute inset-x-0 bottom-0 p-6 pt-24 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex items-end justify-between opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
               <div className="space-y-1 text-white">
                 <p className="font-black uppercase text-xl">{course.topics[activeTopicIndex].title}</p>
                 <p className="text-xs uppercase tracking-widest text-emerald-400 font-bold">{course.topics[activeTopicIndex].duration}</p>
               </div>
               <button className="h-10 w-10 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center text-white transition-colors pointer-events-auto shadow-lg backdrop-saturate-150">
                 <Maximize2 className="h-5 w-5" />
               </button>
             </div>
          </div>
        </div>

        {/* Action Controls & Info */}
        <div className="px-8 pb-12 flex items-center justify-between mt-4">
           <div>
             <h2 className="text-lg font-black uppercase text-[#0F172A]">{course.topics[activeTopicIndex].title}</h2>
             <p className="text-xs font-bold text-[#475569] uppercase mt-1">Instructor: Dr. Aruna Kumar • Released 2026</p>
           </div>
           
           {!completedTopics.includes(activeTopicIndex) ? (
             <Button onClick={() => markCompleted(activeTopicIndex)} className="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white font-black text-[10px] uppercase tracking-widest rounded-xl shadow-md">
                <CheckCircle2 className="h-4 w-4 mr-2" /> Mark as Completed
             </Button>
           ) : (
             <Button disabled className="h-12 px-8 bg-emerald-50 text-emerald-600 border border-emerald-200 font-black text-[10px] uppercase tracking-widest rounded-xl shadow-sm">
                <CheckCircle2 className="h-4 w-4 mr-2" /> Node Cleared
             </Button>
           )}
        </div>
      </div>

      {/* RIGHT SIDEBAR: Topics & AI Chat */}
      <div className="w-[380px] bg-white border-l border-[#E2E8F0] shrink-0 flex flex-col h-full">
         
         <div className="flex-1 flex flex-col overflow-hidden">
            <div className="p-6 border-b border-[#F1F5F9] shrink-0 bg-[#F8FAFC]">
              <h3 className="text-sm font-black uppercase text-[#0F172A] flex items-center gap-3 mb-1">
                <FileText className="h-4 w-4 text-blue-600" /> Syllabus Nodes
              </h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {course.topics.map((t: any, i: number) => {
                const isActive = activeTopicIndex === i;
                const isCompleted = completedTopics.includes(i);
                
                return (
                  <div 
                    key={i} 
                    onClick={() => handleTopicChange(i)}
                    className={cn(
                      "p-4 rounded-xl border flex flex-col gap-2 cursor-pointer transition-all shadow-sm group",
                      isActive ? "bg-blue-600 border-blue-600 text-white shadow-md relative" : "bg-white border-[#E2E8F0] hover:border-blue-300"
                    )}
                  >
                    {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-l-xl opacity-50" />}
                    
                    <div className="flex items-start justify-between gap-3">
                      <div className="h-6 w-6 mt-0.5 rounded-lg border flex items-center justify-center shrink-0 transition-colors font-black text-[10px] bg-white/10"
                           style={{ 
                             borderColor: isActive ? 'rgba(255,255,255,0.4)' : (isCompleted ? '#10b981' : '#E2E8F0'),
                             color: isActive ? 'white' : (isCompleted ? '#10b981' : '#94a3b8'),
                             backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : (isCompleted ? '#ecfdf5' : 'white')
                           }}>
                        {isCompleted ? <CheckCircle2 className="h-3 w-3" /> : (i + 1)}
                      </div>
                      <p className={cn("text-xs font-black uppercase leading-snug flex-1", isActive ? "text-white" : "text-[#475569] group-hover:text-blue-600")}>
                        {t.title}
                      </p>
                    </div>
                    <div className="flex justify-end pl-9">
                      <span className={cn("text-[9px] font-black uppercase tracking-widest", isActive ? "text-blue-200" : "text-[#94a3b8]")}>{course.type === 'Video' ? t.duration : 'PDF'}</span>
                    </div>
                  </div>
                )
              })}
            </div>
         </div>

         {/* AI Learning Assistant */}
         <div className="h-[300px] border-t border-[#E2E8F0] bg-[#F8FAFC] flex flex-col">
            <div className="p-4 border-b border-[#E2E8F0] bg-white flex items-center gap-3">
               <BrainCircuit className="h-5 w-5 text-indigo-600 animate-pulse" />
               <div>
                  <h3 className="text-xs font-black uppercase text-[#0F172A] leading-none">Scholar-AI Helper</h3>
                  <p className="text-[8px] font-black uppercase text-[#475569]/60 tracking-widest mt-1">Contextual to Active Module</p>
               </div>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-4 custom-scrollbar">
               <div className="self-start items-start flex flex-col gap-1 w-[90%]">
                 <div className="p-3 rounded-xl rounded-tl-none bg-white border border-[#E2E8F0] text-[#0F172A] text-[10px] font-bold uppercase shadow-sm">
                   "Clarification requested? Ask about '{course.topics[activeTopicIndex].title}'."
                 </div>
               </div>
               
               {aiChat.map((msg, i) => (
                 <div key={i} className={cn("flex flex-col gap-1", msg.role === 'ai' ? "self-start items-start w-[90%]" : "self-end items-end w-[90%] ml-auto")}>
                   <div className={cn(
                     "p-3 rounded-xl text-[10px] font-bold uppercase shadow-sm",
                     msg.role === 'ai' ? "bg-white border border-[#E2E8F0] text-[#0F172A] rounded-tl-none" : "bg-indigo-600 text-white rounded-tr-none"
                   )}>
                     {msg.text}
                   </div>
                 </div>
               ))}
               
               {aiIsTyping && (
                 <div className="self-start items-start w-[90%]">
                   <div className="p-3 rounded-xl rounded-tl-none bg-white border border-[#E2E8F0] shadow-sm flex items-center gap-1 w-fit">
                     <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 animate-bounce" />
                     <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.2s]" />
                     <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.4s]" />
                   </div>
                 </div>
               )}
            </div>

            <form onSubmit={handleAiChat} className="p-3 bg-white border-t border-[#E2E8F0] flex gap-2">
              <input 
                 value={aiInput}
                 onChange={(e) => setAiInput(e.target.value)}
                 disabled={aiIsTyping}
                 placeholder="INJECT CONTEXT QUESTION..."
                 className="flex-1 h-10 px-3 bg-[#F1F5F9] border border-[#E2E8F0] rounded-xl text-[9px] font-bold uppercase focus:border-indigo-600 focus:outline-none placeholder:text-[#475569]/40"
              />
              <Button disabled={!aiInput.trim() || aiIsTyping} type="submit" className="h-10 w-10 p-0 shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm">
                 <Send className="h-4 w-4" />
              </Button>
            </form>
         </div>

      </div>

      <AnimatePresence>
        {showCert && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
             <div className="bg-white p-12 rounded-[2rem] shadow-2xl max-w-3xl w-full border border-[#E2E8F0] space-y-8 relative overflow-hidden text-center mx-auto">
                <div className="absolute top-0 inset-x-0 h-4 bg-gradient-to-r from-blue-600 via-emerald-500 to-blue-600" />
                <button onClick={() => setShowCert(false)} className="absolute top-8 right-8 p-2 bg-slate-100 rounded-full hover:bg-rose-100 hover:text-rose-600 transition-colors"><X className="h-4 w-4" /></button>
                
                <div className="space-y-4">
                  <Award className="h-20 w-20 text-emerald-600 mx-auto" />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-emerald-600">Certificate of Completion</h3>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-black uppercase text-[#475569] tracking-widest">This verifies that</p>
                  <h2 className="text-5xl font-black uppercase text-[#0F172A] tracking-tight">{studentName}</h2>
                  <p className="text-xs font-black uppercase text-[#475569] tracking-widest">has successfully completed the institutional node</p>
                </div>
                
                <div className="inline-block p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl w-full max-w-lg mx-auto">
                   <h3 className="text-2xl font-black uppercase text-[#0F172A] leading-tight">{course?.title}</h3>
                   <div className="flex items-center justify-center gap-4 mt-2">
                     <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600 border border-emerald-200 bg-emerald-50 px-2 py-0.5 rounded">100% Cleared</span>
                     <span className="text-[9px] font-black uppercase tracking-widest text-[#475569]">System Specialization</span>
                   </div>
                </div>

                <div className="flex justify-between items-end max-w-lg mx-auto mt-12 border-t border-[#E2E8F0] pt-6">
                   <div className="text-left space-y-1">
                     <p className="text-[9px] font-black tracking-widest text-[#475569]">AUTHORIZED BY</p>
                     <p className="text-xs font-black uppercase text-[#0F172A]">Dr. Aruna Kumar</p>
                   </div>
                   <div className="text-right space-y-1">
                     <p className="text-[9px] font-black tracking-widest text-[#475569]">DATE ISSUED</p>
                     <p className="text-xs font-black uppercase text-[#0F172A]">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                   </div>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
