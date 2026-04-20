"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Library, Loader2, Play, FileText, 
  Zap, Bookmark, Search, Clock, 
  Sparkles, ArrowUpRight, CheckCircle2, 
  Target, Activity, GraduationCap, X,
  BrainCircuit
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function LearningHub() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [bookmarks, setBookmarks] = useState<string[]>([])
  
  // Analytics
  const [analytics, setAnalytics] = useState({
    hoursLearned: 42,
    coursesCompleted: 4,
    skillDelta: "+12%"
  })

  // Certificate Modal State
  const [showCert, setShowCert] = useState(false)
  const [certCourse, setCertCourse] = useState<any>(null)
  const [studentName, setStudentName] = useState("STUDENT NODE")

  // Mock static generation
  useEffect(() => {
    setStudentName(localStorage.getItem("studentName") || "STUDENT NODE")
    setTimeout(() => {
      const savedBookmarks = JSON.parse(localStorage.getItem('hub_bookmarks') || '[]')
      setBookmarks(savedBookmarks)

      // Weak skills logic simulation
      const weakSkills = ["DB Design", "Microservices"]
      const recommendations = weakSkills.includes("DB Design") ? ["PostgreSQL Mastery", "Data Modeling"] : ["React Advanced"]

      setData({
        personalized_resources: [
          { id: "c1", title: "FastAPIMasterclass", type: "Video", progress: 82, diff: "Advanced", time: "12h", skill: "Backend", status: "In Progress" },
          { id: "c2", title: "PostgreSQL Performance", type: "PDF", progress: 45, diff: "Intermediate", time: "8h", skill: "Database", status: "In Progress" },
          { id: "c3", title: "System Design Implementations", type: "Lab", progress: 100, diff: "Advanced", time: "20h", skill: "Architecture", status: "Completed" },
          { id: "c4", title: "Docker Orchestration", type: "Lab", progress: 0, diff: "Intermediate", time: "15h", skill: "DevOps", status: "Not Started" },
          { id: "c5", title: "React State Machines", type: "Video", progress: 15, diff: "Intermediate", time: "6h", skill: "Frontend", status: "In Progress" }
        ],
        weaknesses: weakSkills,
        ai_recommendations: recommendations
      })
      setLoading(false)
    }, 600)
  }, [])

  const toggleBookmark = (id: string) => {
    let newBookmarks = [...bookmarks]
    if (newBookmarks.includes(id)) {
      newBookmarks = newBookmarks.filter(b => b !== id)
    } else {
      newBookmarks.push(id)
    }
    setBookmarks(newBookmarks)
    localStorage.setItem('hub_bookmarks', JSON.stringify(newBookmarks))
  }

  const handleGenerateCert = (course: any) => {
    setCertCourse(course)
    setShowCert(true)
  }

  const getFilteredCourses = () => {
    if (!data?.personalized_resources) return []
    let res = data.personalized_resources
    if (filter !== "All") res = res.filter((c: any) => c.type.toUpperCase() === filter.toUpperCase())
    if (searchQuery) {
      res = res.filter((c: any) => 
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        c.skill.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    return res
  }

  if (loading) return (
    <div className="flex h-[40vh] items-center justify-center">
      <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
    </div>
  )

  const courses = getFilteredCourses()

  return (
    <div className="w-full space-y-8 pb-20 text-[#0F172A] font-sans selection:bg-blue-500/10">
      <div className="space-y-4">
        <div className="flex items-center gap-4 mb-2">
          <span className="p-2 bg-blue-100 rounded-xl text-blue-600 border border-blue-200 shadow-sm">
            <Library className="h-6 w-6" />
          </span>
          <h1 className="text-3xl md:text-4xl font-black uppercase leading-none text-[#0F172A]">
            Learning <span className="text-blue-600">Intelligence</span>
          </h1>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm relative overflow-hidden flex items-center gap-6">
          <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shadow-sm border border-blue-100 flex-shrink-0 animate-pulse">
            <Sparkles className="h-6 w-6" />
          </div>
          <p className="text-sm font-bold text-[#475569] uppercase leading-relaxed max-w-5xl">
            AI DETECTS WEAKNESS IN: <span className="text-rose-500">{data?.weaknesses.join(", ")}</span>. PRIORITY CURRICULUM UPDATED.
          </p>
        </div>
      </div>

      {/* Analytics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-[#E2E8F0] p-6 rounded-3xl shadow-sm flex items-center justify-between group hover:border-blue-600 transition-all">
          <div className="space-y-2">
            <p className="text-[10px] font-black tracking-widest uppercase text-[#475569]/60">Total Hours</p>
            <p className="text-3xl font-black text-[#0F172A]">{analytics.hoursLearned}<span className="text-sm ml-1 text-blue-600">h</span></p>
          </div>
          <Clock className="h-10 w-10 text-blue-100 group-hover:text-blue-600 transition-colors" />
        </div>
        <div className="bg-white border border-[#E2E8F0] p-6 rounded-3xl shadow-sm flex items-center justify-between group hover:border-emerald-600 transition-all">
          <div className="space-y-2">
            <p className="text-[10px] font-black tracking-widest uppercase text-[#475569]/60">Nodes Cleared</p>
            <p className="text-3xl font-black text-[#0F172A]">{analytics.coursesCompleted}</p>
          </div>
          <CheckCircle2 className="h-10 w-10 text-emerald-100 group-hover:text-emerald-600 transition-colors" />
        </div>
        <div className="bg-blue-600 border border-blue-600 p-6 rounded-3xl shadow-sm flex items-center justify-between text-white group">
          <div className="space-y-2">
            <p className="text-[10px] font-black tracking-widest uppercase text-white/60">Skill Delta</p>
            <p className="text-3xl font-black text-white">{analytics.skillDelta}</p>
          </div>
          <Activity className="h-10 w-10 text-white/20 group-hover:text-white transition-colors animate-pulse" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Resource Matrix */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-wrap items-center justify-between p-4 bg-white rounded-2xl border border-[#E2E8F0] shadow-sm gap-4">
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {["All", "Video", "PDF", "Lab"].map((f) => (
                <button 
                  key={f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    "px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all shadow-sm leading-none border",
                    filter === f ? "bg-blue-600 text-white border-blue-600 shadow-md" : "bg-white text-[#475569]/60 border-[#E2E8F0] hover:bg-slate-50 hover:text-blue-600"
                  )}
                > {f} </button>
              ))}
            </div>
            <div className="relative w-full md:w-56">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#475569]/40" />
              <input 
                placeholder="SEARCH SKILL..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 pl-9 pr-4 text-[9px] font-black bg-[#F1F5F9] border border-[#E2E8F0] text-[#0F172A] placeholder:text-[#475569]/40 uppercase tracking-widest rounded-lg w-full focus:outline-none focus:border-blue-600" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence>
              {courses.map((res: any, i: number) => (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} key={res.id} className="bg-white border border-[#E2E8F0] shadow-sm p-6 space-y-6 group hover:border-blue-600 hover:shadow-md transition-all flex flex-col justify-between rounded-3xl h-[320px]">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="h-10 w-10 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl flex items-center justify-center text-[#475569] group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                        {res.type === 'Video' ? <Play className="h-5 w-5" /> : (res.type === 'PDF' ? <FileText className="h-5 w-5" /> : <Zap className="h-5 w-5" />)}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={cn("px-2 py-1 rounded text-[8px] font-black uppercase border shadow-sm", res.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : res.status === 'In Progress' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-slate-50 text-slate-500 border-slate-200')}>{res.status}</span>
                        <button onClick={() => toggleBookmark(res.id)} className={cn("h-8 w-8 bg-white border border-[#E2E8F0] rounded-full flex items-center justify-center transition-all shadow-sm", bookmarks.includes(res.id) ? "text-blue-600 border-blue-200 bg-blue-50" : "text-[#475569]/40 hover:text-blue-500")}>
                          <Bookmark className={cn("h-4 w-4", bookmarks.includes(res.id) && "fill-blue-600")} />
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-black text-[#0F172A] uppercase leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors">{res.title}</h4>
                      <p className="text-[9px] font-black tracking-widest uppercase text-[#475569]/60 mt-2 flex items-center gap-2">
                        <span>{res.skill}</span> • <span>{res.diff}</span> • <span>{res.time}</span>
                      </p>
                    </div>

                    <div className="space-y-2 mt-auto">
                      <div className="flex justify-between items-end">
                        <p className="text-[9px] font-black text-[#475569]/60 uppercase tracking-widest leading-none">PROGRESS SYNC</p>
                        <span className={cn("text-sm font-black leading-none", res.progress === 100 ? "text-emerald-600" : "text-blue-600")}>{res.progress}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-[#F1F5F9] rounded-full overflow-hidden shadow-inner">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${res.progress}%` }}
                          transition={{ duration: 1, delay: 0.2 }}
                          className={cn("h-full shadow-sm", res.progress === 100 ? "bg-emerald-500" : "bg-blue-600")} 
                        />
                      </div>
                    </div>
                  </div>
                  
                  {res.progress === 100 ? (
                    <Button onClick={() => handleGenerateCert(res)} className="w-full h-10 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-sm active:scale-95 transition-all">
                      <GraduationCap className="h-4 w-4 mr-2" /> GENERATE CERTIFICATE
                    </Button>
                  ) : (
                    <Link href={`/student/course/${res.id}`} className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center rounded-xl text-[9px] font-black uppercase tracking-widest shadow-sm active:scale-95 transition-all">
                      {res.progress > 0 ? 'CONTINUE LEARNING' : 'START LEARNING'} <ArrowUpRight className="h-3 w-3 ml-2" />
                    </Link>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            {courses.length === 0 && (
              <div className="col-span-2 p-12 flex flex-col items-center justify-center text-center space-y-4 border-2 border-dashed border-[#E2E8F0] rounded-3xl opacity-50">
                <Search className="h-12 w-12 text-[#475569]" />
                <p className="text-xs font-black tracking-widest uppercase text-[#0F172A]">No resources found for query.</p>
              </div>
            )}
          </div>
        </div>

        {/* AI & Bookmarks Column */}
        <div className="space-y-6">
          <div className="bg-white border border-[#E2E8F0] shadow-sm p-6 rounded-[2rem] space-y-4 hover:shadow-md transition-all flex flex-col items-center">
            <h2 className="text-lg font-black uppercase text-[#0F172A] border-b border-rose-50 pb-3 w-full flex items-center gap-3 justify-center">
              <BrainCircuit className="h-5 w-5 text-rose-500 animate-pulse" /> AI-Remediation
            </h2>
            <div className="space-y-3 w-full">
              {data?.ai_recommendations?.map((topic: string, i: number) => (
                <div key={i} className="p-3 rounded-xl bg-rose-50 border border-rose-100 flex items-center gap-3 group hover:bg-rose-100 hover:border-rose-200 transition-all shadow-sm">
                  <div className="h-8 w-8 bg-white border border-rose-200 rounded-lg flex items-center justify-center text-rose-500 shadow-sm">
                    <Target className="h-4 w-4" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[8px] font-black text-rose-500 uppercase tracking-widest">Recommended Track</p>
                    <p className="text-xs font-black text-[#0F172A] uppercase leading-none">{topic}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#0F172A] border border-[#0F172A] shadow-md p-6 space-y-4 text-white rounded-[2rem] group overflow-hidden relative min-h-[300px]">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-125 transition-transform">
              <Bookmark className="h-10 w-10" />
            </div>
            <h2 className="text-lg font-black uppercase text-white flex items-center gap-3 border-b border-white/10 pb-3 relative z-10 w-full">
              <Bookmark className="h-5 w-5 text-blue-400" /> Hub Bookmarks
            </h2>
            <div className="space-y-2 relative z-10">
              {data?.personalized_resources?.filter((r:any) => bookmarks.includes(r.id)).length > 0 ? (
                 data?.personalized_resources?.filter((r:any) => bookmarks.includes(r.id)).map((bm: any, i: number) => (
                  <Link href={`/student/course/${bm.id}`} key={i} className="flex flex-col p-3 bg-white/5 border border-white/5 rounded-xl group/bm cursor-pointer hover:bg-white/10 transition-all border-l-[3px] border-l-blue-500">
                    <p className="text-[10px] font-black text-white group-hover/bm:text-blue-400 uppercase tracking-widest line-clamp-1 leading-none mb-2">{bm.title}</p>
                    <div className="flex items-center justify-between w-full">
                      <span className="text-[8px] uppercase tracking-widest opacity-60 font-black">{bm.type} • {bm.progress}%</span>
                      <ArrowUpRight className="h-3 w-3 text-white/40 group-hover/bm:text-white transition-all" />
                    </div>
                  </Link>
                ))
              ) : (
                <div className="py-10 text-center opacity-40">
                  <Bookmark className="h-8 w-8 mx-auto mb-2" />
                  <p className="text-[8px] font-black uppercase tracking-widest">No Bookmarks Saved.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showCert && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
             <div className="bg-white p-12 rounded-[2rem] shadow-2xl max-w-3xl w-full border border-[#E2E8F0] space-y-8 relative overflow-hidden text-center">
                <div className="absolute top-0 inset-x-0 h-4 bg-gradient-to-r from-blue-600 via-emerald-500 to-blue-600" />
                <button onClick={() => setShowCert(false)} className="absolute top-8 right-8 p-2 bg-slate-100 rounded-full hover:bg-rose-100 hover:text-rose-600 transition-colors"><X className="h-4 w-4" /></button>
                
                <div className="space-y-4">
                  <GraduationCap className="h-20 w-20 text-emerald-600 mx-auto" />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-emerald-600">Certificate of Completion</h3>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-black uppercase text-[#475569] tracking-widest">This verifies that</p>
                  <h2 className="text-5xl font-black uppercase text-[#0F172A] tracking-tight">{studentName}</h2>
                  <p className="text-xs font-black uppercase text-[#475569] tracking-widest">has successfully completed the institutional node</p>
                </div>
                
                <div className="inline-block p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl w-full max-w-lg mx-auto">
                   <h3 className="text-2xl font-black uppercase text-[#0F172A] leading-tight">{certCourse?.title}</h3>
                   <div className="flex items-center justify-center gap-4 mt-2">
                     <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600 border border-emerald-200 bg-emerald-50 px-2 py-0.5 rounded">100% Cleared</span>
                     <span className="text-[9px] font-black uppercase tracking-widest text-[#475569]">{certCourse?.skill} Specialization</span>
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
