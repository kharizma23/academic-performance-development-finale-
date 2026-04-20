"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { 
  Timer, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert,
  BrainCircuit,
  Trophy,
  XCircle,
  HelpCircle,
  GraduationCap,
  Loader2
} from "lucide-react"
import { cn } from "@/lib/utils"

// Demo Test Data (matches the Registry in Faculty Dashboard for seamless demo)
const DEMO_TESTS: Record<string, any> = {
  "1": {
    id: "1",
    title: "UNIT 1: DATA STRUCTURES RE-TEST",
    subject: "DSA",
    duration: 30, // minutes
    questions: [
      { id: 1, question: "What is the time complexity of searching in a balanced Binary Search Tree?", options: ["O(n)", "O(log n)", "O(1)", "O(n log n)"], answer: "O(log n)" },
      { id: 2, question: "Which data structure follows the Last In First Out (LIFO) principle?", options: ["Queue", "Stack", "Linked List", "Tree"], answer: "Stack" },
      { id: 3, question: "In a min-heap, where is the minimum element located?", options: ["Root node", "Leaf node", "Middle node", "Random node"], answer: "Root node" },
      { id: 4, question: "What is the best case complexity of Quick Sort?", options: ["O(n)", "O(n log n)", "O(log n)", "O(n^2)"], answer: "O(n log n)" },
      { id: 5, question: "Which algorithm is used to find the shortest path in a weighted graph?", options: ["BFS", "DFS", "Dijkstra's", "Bubble Sort"], answer: "Dijkstra's" }
    ]
  },
  "2": {
    id: "2",
    title: "MOCK ASSESSMENT 2: DBMS",
    subject: "DBMS",
    duration: 45,
    questions: [
      { id: 1, question: "What does SQL stand for?", options: ["Standard Query Language", "Structured Query Language", "System Query Language", "Simple Query Language"], answer: "Structured Query Language" },
      { id: 2, question: "Which key is used to uniquely identify a record in a table?", options: ["Foreign Key", "Unique Key", "Primary Key", "Candidate Key"], answer: "Primary Key" }
    ]
  }
}

export default function StudentTestView() {
  const { id } = useParams()
  const router = useRouter()
  const [test, setTest] = useState<any>(null)
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [timeLeft, setTimeLeft] = useState(0)
  const [status, setStatus] = useState<"intro" | "testing" | "completed">("intro")
  const [violations, setViolations] = useState(0)
  const [showWarning, setShowWarning] = useState(false)
  const [score, setScore] = useState(0)

  // 🛡️ ANTI-CHEATING SYSTEM
  useEffect(() => {
    if (status !== "testing") return

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setViolations(prev => prev + 1)
        setShowWarning(true)
        setTimeout(() => setShowWarning(false), 3000)
      }
    }

    const preventContext = (e: any) => e.preventDefault()
    
    document.addEventListener("visibilitychange", handleVisibilityChange)
    document.addEventListener("contextmenu", preventContext)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      document.removeEventListener("contextmenu", preventContext)
    }
  }, [status])

  // ⏱️ TIMER SYSTEM
  useEffect(() => {
    if (status !== "testing" || timeLeft <= 0) {
      if (timeLeft === 0 && status === "testing") handleSubmit()
      return
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [status, timeLeft])

  useEffect(() => {
    const testId = Array.isArray(id) ? id[0] : (id as string)
    if (DEMO_TESTS[testId]) {
      setTest(DEMO_TESTS[testId])
      setTimeLeft(DEMO_TESTS[testId].duration * 60)
    }
  }, [id])

  const startTest = () => {
    // Request full screen (simulated with status)
    setStatus("testing")
  }

  const handleSubmit = useCallback(() => {
    let finalScore = 0
    test.questions.forEach((q: any) => {
      if (answers[q.id] === q.answer) finalScore += 1
    })
    setScore(finalScore)
    setStatus("completed")
  }, [test, answers])

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s < 10 ? '0' : ''}${s}`
  }

  if (!test) return (
     <div className="h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
     </div>
  )

  // 📝 INTRO SCREEN
  if (status === "intro") return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
      <Card className="max-w-xl w-full p-10 rounded-[3rem] border-none shadow-2xl bg-white text-center space-y-8">
         <div className="h-20 w-20 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-lg shadow-blue-100">
            <GraduationCap className="h-10 w-10" />
         </div>
         <div className="space-y-2">
            <h1 className="text-3xl font-[1000] uppercase tracking-tight text-slate-900">{test.title}</h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{test.subject} Assessment Sector</p>
         </div>
         <div className="grid grid-cols-2 gap-6">
            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 shadow-sm">
               <p className="text-[11px] font-[1000] text-slate-400 uppercase tracking-[0.2em] mb-2">Duration</p>
               <p className="text-3xl font-[1000] text-slate-900 tracking-tighter">{test.duration} MINS</p>
            </div>
            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 shadow-sm">
               <p className="text-[11px] font-[1000] text-slate-400 uppercase tracking-[0.2em] mb-2">Questions</p>
               <p className="text-3xl font-[1000] text-slate-900 tracking-tighter">{test.questions.length} MCQs</p>
            </div>
         </div>
         <div className="p-8 bg-amber-50 border border-amber-100 rounded-3xl text-left space-y-4">
            <p className="text-xs font-[1000] text-amber-700 uppercase tracking-widest flex items-center gap-3"><ShieldAlert className="h-5 w-5" /> Anti-Cheating Protocol Active</p>
            <ul className="text-xs font-black text-amber-900/60 uppercase space-y-2">
               <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                  TAB SWITCHING IS MONITORED
               </li>
               <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                  FULL SCREEN IS REQUIRED
               </li>
               <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                  AUTO-SUBMIT ON TIME EXPIRY
               </li>
            </ul>
         </div>
         <Button onClick={startTest} className="w-full h-20 bg-blue-600 hover:bg-blue-700 text-white font-[1000] text-xl uppercase tracking-[0.2em] rounded-3xl shadow-2xl shadow-blue-200 active:scale-95 transition-all">
            Initiate Examination
         </Button>
      </Card>
    </div>
  )

  // 📊 COMPLETED SCREEN
  if (status === "completed") return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
      <Card className="max-w-2xl w-full p-10 rounded-[3rem] border-none shadow-2xl bg-white text-center space-y-8">
         <div className="h-24 w-24 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto border-4 border-emerald-50">
            <Trophy className="h-12 w-12" />
         </div>
         <div className="space-y-2">
            <h2 className="text-3xl font-[1000] uppercase text-slate-900 tracking-tight">Assessment Completed</h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Neural Evaluation Synchronized</p>
         </div>
         <div className="flex items-center justify-center gap-8 py-6">
            <div className="text-center">
               <p className="text-5xl font-[1000] text-blue-600">{Math.round((score / test.questions.length) * 100)}%</p>
               <p className="text-[10px] font-black text-slate-400 uppercase mt-2">Final Accuracy</p>
            </div>
            <div className="h-12 w-[1px] bg-slate-200" />
            <div className="text-center">
               <p className="text-5xl font-[1000] text-slate-900">{score}/{test.questions.length}</p>
               <p className="text-[10px] font-black text-slate-400 uppercase mt-2">Questions Correct</p>
            </div>
         </div>
         <div className="space-y-3">
            {violations > 0 && (
               <div className="p-4 bg-rose-50 border border-rose-100 rounded-3xl flex items-center justify-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-rose-500" />
                  <p className="text-[10px] font-black text-rose-700 uppercase tracking-widest">{violations} Violations Tracked during Session</p>
               </div>
            )}
            <Button onClick={() => router.push('/')} className="w-full h-14 bg-slate-900 hover:bg-black text-white font-black uppercase text-xs tracking-widest rounded-2xl">
               Return to Dashboard
            </Button>
         </div>
      </Card>
    </div>
  )

  // 📝 TESTING INTERFACE
  const q = test.questions[currentIdx]
  const progress = ((currentIdx + 1) / test.questions.length) * 100

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col p-4 md:p-8 select-none">
      <div className="max-w-5xl mx-auto w-full flex-1 flex flex-col gap-6">
        
        {/* ── HEADER ─────────────────────────────────────── */}
        <div className="flex items-center justify-between bg-white p-6 rounded-3xl border border-slate-100 shadow-sm shrink-0">
          <div className="flex items-center gap-4">
             <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black">{(test.subject)[0]}</div>
             <div>
                <p className="text-sm font-black text-slate-900 uppercase leading-none">{test.title}</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Question {currentIdx + 1} of {test.questions.length}</p>
             </div>
          </div>
          <div className={cn("flex items-center gap-3 px-6 py-2.5 rounded-2xl border font-black transition-all", timeLeft < 60 ? "bg-rose-50 border-rose-200 text-rose-600" : "bg-slate-50 border-slate-200 text-slate-900")}>
             <Timer className={cn("h-5 w-5", timeLeft < 60 && "animate-pulse")} />
             <span className="text-xl tabular-nums tracking-tight">{formatTime(timeLeft)}</span>
          </div>
        </div>

        {/* ── QUESTION AREA ──────────────────────────────── */}
        <Card className="flex-1 rounded-[3rem] border-none shadow-sm bg-white p-8 md:p-12 flex flex-col justify-between overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-2 bg-slate-100">
             <div className="h-full bg-blue-600 transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>

          <div className="space-y-10">
             <div className="space-y-6">
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] flex items-center gap-2">
                   <HelpCircle className="h-4 w-4" /> Assessment Query {currentIdx + 1}
                </p>
                <h2 className="text-2xl md:text-3xl font-[1000] text-slate-900 uppercase leading-tight tracking-tight">
                   {q.question}
                </h2>
             </div>

             <div className="grid gap-4">
                {q.options.map((opt: string, i: number) => {
                  const isSelected = answers[q.id] === opt
                  return (
                    <button
                      key={i}
                      onClick={() => setAnswers(prev => ({ ...prev, [q.id]: opt }))}
                      className={cn(
                        "group flex items-center justify-between p-6 rounded-3xl border-2 transition-all text-left",
                        isSelected 
                          ? "bg-blue-600 border-blue-600 text-white shadow-xl scale-[1.02] -translate-y-1" 
                          : "bg-slate-50 border-slate-100 text-slate-700 hover:border-blue-400"
                      )}
                    >
                      <div className="flex items-center gap-4">
                         <span className={cn("h-10 w-10 rounded-xl flex items-center justify-center font-black transition-all", isSelected ? "bg-white/20" : "bg-white text-blue-600 shadow-sm")}>
                            {String.fromCharCode(65 + i)}
                         </span>
                         <span className="text-sm md:text-base font-black uppercase tracking-tight">{opt}</span>
                      </div>
                      {isSelected && <CheckCircle2 className="h-6 w-6 text-white" />}
                    </button>
                  )
                })}
             </div>
          </div>

          <div className="pt-10 flex items-center justify-between shrink-0">
             <Button 
               onClick={() => setCurrentIdx(prev => prev - 1)} 
               disabled={currentIdx === 0}
               variant="ghost" 
               className="h-14 px-8 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-all gap-2"
             >
                <ChevronLeft className="h-4 w-4" /> Prev Logic
             </Button>
             
             {currentIdx === test.questions.length - 1 ? (
               <Button 
                 onClick={handleSubmit} 
                 className="h-16 px-12 bg-emerald-600 hover:bg-emerald-700 text-white font-[1000] uppercase text-xs tracking-widest rounded-3xl shadow-xl shadow-emerald-200 flex items-center gap-2 active:scale-95 transition-all"
               >
                  Submit Assessment <CheckCircle2 className="h-5 w-5" />
               </Button>
             ) : (
               <Button 
                 onClick={() => setCurrentIdx(prev => prev + 1)} 
                 className="h-16 px-12 bg-blue-600 hover:bg-blue-700 text-white font-[1000] uppercase text-xs tracking-widest rounded-3xl shadow-xl shadow-blue-200 flex items-center gap-2 active:scale-95 transition-all"
               >
                  Next Question <ChevronRight className="h-5 w-5" />
               </Button>
             ) }
          </div>
        </Card>

        {/* ── WARNING OVERLAY ─────────────────────────── */}
        {showWarning && (
          <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[200] animate-in slide-in-from-top-10 fade-in duration-300">
            <div className="bg-rose-600 text-white px-8 py-4 rounded-3xl shadow-2xl flex items-center gap-4">
               <ShieldAlert className="h-6 w-6 animate-bounce" />
               <div className="text-left">
                  <p className="text-sm font-[1000] uppercase tracking-tight leading-none mb-1">Violation Detected!</p>
                  <p className="text-[9px] font-bold opacity-80 uppercase tracking-widest">Tab Switching is Prohibited during Session.</p>
               </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
