"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
 Activity,
 CheckCircle2,
 Calendar,
 Clock,
 BrainCircuit,
 Sparkles,
 MessageSquare,
 ChevronRight,
 Loader2,
 Search,
 Trophy,
 UserCheck,
 RotateCcw,
 Play,
 Star,
 LayoutDashboard,
 AlertCircle,
 AlertTriangle,
 ArrowRight,
 Circle,
 CheckCircle,
 Code2,
 Cpu,
 Boxes,
 Map,
 Rocket,
 Target,
 TrendingUp,
 ArrowUpRight,
 BarChart3,
 Minus,
 FileText,
 Zap,
 Scale,
 GraduationCap,
 ShieldCheck
} from "lucide-react"
import { 
 fetchStudentOverview, 
 fetchStudentTodos, 
 fetchStudentAcademic, 
 fetchStudentAcademicTrend, 
 fetchStudentAcademicSubjects, 
 fetchStudentAcademicInsight 
} from "@/lib/api-student";
import { getCached } from "@/lib/cache";
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
 Bar
} from 'recharts'
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import AcademicJourney from "@/components/student/AcademicJourney"

export default function SmartOverview() {
 const getApiUrl = (path: string) => {
 const host = typeof window !== 'undefined' ? window.location.hostname : '127.0.0.1';
 return `http://${host}:8000${path}`;
 };

 const router = useRouter()
 
 // SWR Persistence Logic: Load from cache synchronously if available
 const [data, setData] = useState<any>(getCached(getApiUrl("/student/overview")))
 const [todos, setTodos] = useState<any[]>(getCached(getApiUrl("/student/todos")) || [])
 const [loading, setLoading] = useState(!data) // Don't show loader if we have cached data
 const [newTodo, setNewTodo] = useState("")
 const [activeTab, setActiveTab] = useState('roadmap')
 const [academicData, setAcademicData] = useState<any>(getCached(getApiUrl("/student/academic")))
 const [academicTrend, setAcademicTrend] = useState<any[]>(getCached(getApiUrl("/student/academic/trend")) || [])
 const [academicSubjects, setAcademicSubjects] = useState<any[]>(getCached(getApiUrl("/student/academic/subjects")) || [])
 const [academicInsight, setAcademicInsight] = useState<any>(getCached(getApiUrl("/student/academic/insight")))
 const [selectedDay, setSelectedDay] = useState<any>(null)
 const [isSyncing, setIsSyncing] = useState(false)
 const [syncSuccess, setSyncSuccess] = useState(false)
 const [highlightedDay, setHighlightedDay] = useState<number | null>(null)
 const [violationAlert, setViolationAlert] = useState<{show: boolean, msg: string}>({show: false, msg: ""})

 const getRequiredTime = (taskName: string) => {
 // Logic from backend unified engine
 const s = taskName.toLowerCase()
 if (s.includes("capstone") || s.includes("project")) return 360 // 6 Hours
 if (s.includes("dsa") || s.includes("system design") || s.includes("architecture")) return 180 // 3 Hours
 return 120 // 2 Hours
 }

 const calculateTimeSpent = (startTime: string | null) => {
 if (!startTime) return 0
 const start = new Date(startTime).getTime()
 const now = new Date().getTime()
 return Math.floor((now - start) / 60000) // minutes
 }

 const findMatchingDay = (taskName: string) => {
 const match = data?.roadmap?.find((r: any) => {
 const s = taskName.toLowerCase();
 const rt = r.topic.toLowerCase();
 return rt.includes(s.replace(/master|practice|review|solve|optimize|deep dive into/g, '').trim());
 });
 return match ? match.day : null;
 }

 const syncToRoadmap = async (day: any) => {
 setIsSyncing(true)
 const token = localStorage.getItem('token')
 
 // Optimistic Update Node
 const optimisticId = `sync-${Date.now()}`
 const optimisticTodo = {
 id: optimisticId,
 task_name: day.topic,
 priority: day.priority,
 difficulty: "High",
 status: "Not Started",
 is_completed: false,
 is_optimistic: true // for styling
 }
 setTodos(prev => [optimisticTodo, ...prev])

 try {
 const res = await fetch(getApiUrl("/student/todos"), {
 method: 'POST',
 headers: { 
 'Authorization': `Bearer ${token}`,
 'Content-Type': 'application/json'
 },
 body: JSON.stringify({
 task_name: day.topic,
 priority: day.priority,
 difficulty: "High"
 })
 })
 if (res.ok) {
 await fetchInitialData()
 setSyncSuccess(true)
 setTimeout(() => {
 setSyncSuccess(false)
 setSelectedDay(null)
 }, 1500)
 } else {
 // Rollback if failure
 setTodos(prev => prev.filter(t => t.id !== optimisticId))
 }
 } catch (error) {
 console.error("Failed to sync roadmap node", error)
 setTodos(prev => prev.filter(t => t.id !== optimisticId))
 } finally {
 setIsSyncing(false)
 }
 }

 useEffect(() => {
 fetchInitialData()
 }, [])

 const fetchInitialData = async () => {
 try {
 const [overview, todos, acad, trend, subj, insight] = await Promise.all([
 fetchStudentOverview(),
 fetchStudentTodos(),
 fetchStudentAcademic(),
 fetchStudentAcademicTrend(),
 fetchStudentAcademicSubjects(),
 fetchStudentAcademicInsight()
 ])
 
 if (overview) setData(overview)
 if (todos) setTodos(todos)
 if (acad) setAcademicData(acad)
 if (trend) setAcademicTrend(trend)
 if (subj) setAcademicSubjects(subj)
 if (insight) setAcademicInsight(insight)
 } catch (error) {
 console.error("Neural fetch failure", error)
 } finally {
 setLoading(false)
 }
 }

 const completeProtocol = async (todoId: string, todo: any) => {
 const required = getRequiredTime(todo.task_name)
 const spent = calculateTimeSpent(todo.start_time)
 
 // Violation Check Node
 if (findMatchingDay(todo.task_name) && spent < required) {
 setViolationAlert({
 show: true,
 msg: `U R VIOLATING THE COURSE DUE TIME! REQUIRED: ${required/60}HRS. SPENT: ${spent}MIN.`
 })
 return
 }

 const token = localStorage.getItem('token')
 try {
 const res = await fetch(getApiUrl(`/student/todos/${todoId}/complete`), {
 method: 'POST',
 headers: { 'Authorization': `Bearer ${token}` }
 })
 if (res.ok) fetchInitialData()
 } catch (error) {
 console.error("Failed to complete roadmap protocol", error)
 }
 }

 const toggleTodo = async (todoId: string) => {
 const token = localStorage.getItem('token')
 try {
 const res = await fetch(getApiUrl(`/student/todos/${todoId}`), {
 method: 'PATCH',
 headers: { 'Authorization': `Bearer ${token}` }
 })
 if (res.ok) fetchInitialData()
 } catch (error) {
 console.error("Failed to toggle task node", error)
 }
 }

 const startTodo = async (todoId: string) => {
 const token = localStorage.getItem('token')
 try {
 const res = await fetch(getApiUrl(`/student/todos/${todoId}/start`), {
 method: 'POST',
 headers: { 'Authorization': `Bearer ${token}` }
 })
 if (res.ok) fetchInitialData()
 } catch (error) {
 console.error("Failed to initialize task node", error)
 }
 }

 const addTodo = async (e: any) => {
 if (e.key !== 'Enter' || !newTodo.trim()) return
 const token = localStorage.getItem('token')
 try {
 const res = await fetch(getApiUrl("/student/todos"), {
 method: 'POST',
 headers: { 
 'Authorization': `Bearer ${token}`,
 'Content-Type': 'application/json'
 },
 body: JSON.stringify({
 task_name: newTodo,
 priority: "Medium",
 difficulty: "Medium"
 })
 })
 if (res.ok) {
 setNewTodo("")
 fetchInitialData()
 }
 } catch (error) {
 console.error("Failed to inject task node", error)
 }
 }

 if (loading) return (
 <div className="flex flex-col h-[70vh] items-center justify-center bg-white p-12 overflow-hidden">
 <div className="relative group">
 <div className="absolute inset-0 bg-blue-500 blur-[100px] opacity-10 animate-pulse" />
 <div className="relative flex flex-col items-center gap-12">
 <div className="h-24 w-24 rounded-[2rem] bg-blue-600 flex items-center justify-center text-white shadow-2xl animate-bounce border-4 border-blue-100">
 <GraduationCap className="h-12 w-12" />
 </div>
 <div className="text-center space-y-4">
 <h1 className="text-6xl font-[1000] text-blue-950  uppercase leading-none animate-pulse">Neural Node Warmup</h1>
 <p className="text-xs font-[1000] text-blue-400 uppercase tracking-[0.4em] animate-shimmer">Synchronizing Study Protocols...</p>
 </div>
 <div className="w-64 h-2 bg-slate-100 rounded-full overflow-hidden">
 <div className="h-full bg-blue-600 animate-shimmer w-[40%]" />
 </div>
 </div>
 </div>
 </div>
 )

 const stats = [
 { label: "Daily Streak", value: data?.student.streak_count || 1, icon: Trophy, color: "text-amber-500", detail: "CONSECUTIVE DAYS" },
 { label: "Productivity XP", value: data?.student.xp_points || 2150, icon: Sparkles, color: "text-blue-500", detail: "NEURAL GROWTH" },
 { label: "Growth Index", value: data?.student.growth_index || 2.4, icon: TrendingUp, color: "text-emerald-500", detail: "SKILL DELTA" },
 { label: "Global CGPA", value: data?.student.current_cgpa || 8.42, icon: Target, color: "text-indigo-500", detail: "ACADEMIC CORE" }
 ]

 return (
 <div className="w-full space-y-12 pb-40 text-[#0F172A] font-sans selection:bg-blue-500/10 overflow-hidden">
 {/* Header: Active Interface */}
 <div className="space-y-6">
 <div className="flex items-center gap-6">
 <div className="h-4 w-4 bg-emerald-500 rounded-full animate-ping" />
 <p className="text-sm font-black text-emerald-600 uppercase tracking-[0.6em] shadow-inner bg-emerald-50/50 px-6 py-2 rounded-full border border-emerald-100">Neural Node Sync: ACTIVE-AUTHORITY</p>
 </div>
 <h1 className="text-9xl lg:text-[10.5rem] font-[1000]  uppercase leading-[0.75] text-blue-950">
 Active <span className="text-blue-600 drop-shadow-2xl">Interface</span>
 </h1>
 <p className="text-3xl font-black text-[#475569]/40 uppercase  flex items-center gap-6 mt-8">
 <Minus className="h-10 w-10 text-blue-300" /> Synchronized with <span className="text-[#0F172A] border-b-8 border-blue-100 pb-2">{data?.student.name}</span> institutional node
 </p>
 </div>

 {/* Navigation Matrix */}
 <div className="flex bg-slate-100/50 p-6 rounded-[3rem] gap-6 border-4 border-white shadow-[inset_0_10px_40px_rgba(0,0,0,0.05)] w-fit mx-auto lg:mx-0 animate-in fade-in zoom-in duration-1000">
 {[
 { id: 'roadmap', label: 'STRATEGIC ROADMAP', icon: Map },
 { id: 'journey', label: 'ACADEMIC JOURNEY', icon: TrendingUp },
 { id: 'skills', label: 'NEURAL LAB (AI)', icon: Code2 },
 { id: 'career', label: 'PLACEMENT BOOSTER', icon: Rocket }
 ].map(tab => (
 <button
 key={tab.id}
 onClick={() => setActiveTab(tab.id)}
 className={cn(
 "px-10 py-5 rounded-[2rem] font-black uppercase text-base lg:text-xl  transition-all flex items-center gap-4 leading-none border-2 border-transparent",
 activeTab === tab.id 
 ? "bg-white text-blue-600 shadow-[0_20px_60px_rgba(37,99,235,0.2)] scale-105 z-10 border-blue-100" 
 : "text-slate-500 hover:text-blue-700 hover:bg-white/60"
 )}
 >
 <tab.icon className={cn("h-6 w-6 transition-transform duration-500", activeTab === tab.id && "scale-110")} />
 {tab.label}
 </button>
 ))}
 </div>

 <AnimatePresence mode="wait">
 {activeTab === 'roadmap' && (
 <motion.div 
 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
 key="roadmap-tab" className="space-y-12"
 >
 {/* Top Metrics Grid */}
 <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mt-12">
 {[
 { label: 'Neural IQ', value: '142', detail: 'Top 0.1% Globally', icon: BrainCircuit, color: 'text-blue-600' },
 { label: 'Sync Rate', value: '98%', detail: 'Real-time Authority', icon: Zap, color: 'text-yellow-600' },
 { label: 'Growth Index', value: '+12%', detail: 'Exponential Surge', icon: TrendingUp, color: 'text-emerald-600' },
 { label: 'Mastery Nodes', value: '42', detail: 'Completed Protocols', icon: Rocket, color: 'text-purple-600' }
 ].map((stat, i) => (
 <motion.div 
 key={i}
 initial={{ opacity: 0, scale: 0.9 }}
 animate={{ opacity: 1, scale: 1 }}
 transition={{ delay: i * 0.1, duration: 0.8 }}
 className="p-14 rounded-[3.5rem] bg-white border-2 border-slate-50 shadow-2xl hover:shadow-[0_60px_120px_rgba(0,0,0,0.12)] hover:border-blue-200 transition-all duration-700 group cursor-default relative overflow-hidden h-[420px] flex flex-col justify-between"
 >
 <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full -mr-32 -mt-32 opacity-0 group-hover:opacity-100 transition-all duration-1000 scale-0 group-hover:scale-100" />
 <div className="flex justify-between items-start relative z-10">
 <div className="space-y-6">
 <p className="text-sm lg:text-base font-black text-slate-400 uppercase tracking-[0.6em] opacity-50 flex items-center gap-4">
 <div className="h-3 w-3 rounded-full bg-slate-300" /> {stat.label}
 </p>
 <p className="text-[8.5rem] lg:text-[9.5rem] font-[1000]  text-[#0F172A] leading-none drop-shadow-sm">{stat.value}</p>
 </div>
 <stat.icon className={cn("h-14 w-14 lg:h-20 lg:w-20 opacity-10 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 transform group-hover:rotate-12", stat.color)} />
 </div>
 <div className="flex items-center gap-6 relative z-10 pt-8 border-t-4 border-slate-50">
 <div className="h-4 w-4 rounded-full bg-blue-500 animate-pulse shadow-[0_0_20px_rgba(59,130,246,0.5)]" />
 <p className="text-sm lg:text-base font-black uppercase tracking-[0.4em] text-slate-500 opacity-60 leading-none">{stat.detail}</p>
 </div>
 </motion.div>
 ))}
 </div>
 </motion.div>
 )}

 {activeTab === 'journey' && (
 <motion.div 
 initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
 key="journey-tab"
 >
 <AcademicJourney 
 data={academicData}
 trend={academicTrend}
 subjects={academicSubjects}
 insight={academicInsight}
 />
 </motion.div>
 )}
 </AnimatePresence>

 {/* Main Functional Matrix */}
 {activeTab === 'roadmap' && (
 <div className="flex flex-col xl:flex-row gap-12 h-fit">
 {/* Left: Daily Roadmap & Progress Hub */}
 <div className="flex-1 space-y-12">
 <div className="flex flex-col lg:flex-row gap-12">
 {/* Daily Roadmap (Todo List) */}
 <div className="flex-[1.8] glass-card bg-white border border-[#E2E8F0] shadow-md p-14 rounded-[4rem] flex flex-col space-y-10 group hover:shadow-2xl transition-all duration-500">
 <div className="flex items-center justify-between border-b-2 border-blue-600 pb-8">
 <h2 className="text-4xl font-black uppercase  text-[#0F172A] flex items-center gap-6 ">
 <Zap className="h-10 w-10 text-blue-600 shadow-sm" /> Daily Roadmap
 <span className="px-6 py-2 bg-blue-50 text-blue-600 rounded-full text-xs font-black not- ml-4 border border-blue-100 shadow-sm">ACTIVE SYNC</span>
 </h2>
 </div>

 {/* Task Search/Input */}
 <div className="flex gap-4">
 <div className="relative flex-1 group">
 <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-[#94A3B8] transition-colors group-hover:text-blue-600" />
 <input 
 placeholder="SEARCH NODES (E.G., PYTHON, JAVA, DSA)..."
 className="w-full !h-20 pl-16 pr-8 bg-[#F8FAFC] border-2 border-[#E2E8F0] rounded-3xl text-lg font-black uppercase  focus:border-blue-600 focus:bg-white outline-none transition-all shadow-inner"
 value={newTodo}
 onChange={(e) => setNewTodo(e.target.value)}
 onKeyDown={addTodo}
 />
 </div>
 <Button className="!h-20 !w-20 rounded-3xl bg-blue-600 shadow-lg shadow-blue-200 active:scale-95 transition-all">
 <Sparkles className="h-9 w-9 text-white" />
 </Button>
 </div>

 {/* Tasks Container */}
 <div className="space-y-6 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar">
 {[...todos]
 .filter(t => !t.is_completed) // Active Tasks Only
 .filter(t => {
 if (!newTodo.trim()) return true;
 return t.task_name.toLowerCase().includes(newTodo.toLowerCase());
 })
 .sort((a, b) => {
 if (a.status === 'In Progress' && b.status !== 'In Progress') return -1;
 if (a.status !== 'In Progress' && b.status === 'In Progress') return 1;
 if (a.is_optimistic && !b.is_optimistic) return -1;
 if (!a.is_optimistic && b.is_optimistic) return 1;
 if (a.created_at && b.created_at) return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
 return 0;
 })
 .slice(0, 200) // High-Density Scrolling Active
 .map((todo) => (
 <div 
 key={todo.id} 
 onClick={() => setHighlightedDay(findMatchingDay(todo.task_name))}
 className={cn(
 "p-8 rounded-[3rem] border group/task hover:bg-white hover:border-blue-600 transition-all shadow-sm flex items-center justify-between cursor-pointer",
 todo.is_optimistic ? "bg-blue-50/50 border-blue-200 animate-pulse" : "bg-[#F1F5F9] border-[#CBD5E1]"
 )}
 >
 <div className="flex items-center gap-8 flex-1">
 <div className="space-y-2">
 <div className="flex gap-4">
 <span className={cn(
 "px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
 todo.difficulty === 'High' ? "bg-rose-50 border-rose-100 text-rose-600" : "bg-blue-50 border-blue-100 text-blue-600"
 )}>{todo.difficulty || 'MEDIUM'}</span>
 
 <span className={cn(
 "px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm",
 findMatchingDay(todo.task_name)
 ? "bg-emerald-50 border-emerald-100 text-emerald-600" 
 : "bg-slate-100 border-slate-200 text-slate-500"
 )}>
 {findMatchingDay(todo.task_name) ? "IN-MAP PROTOCOL" : "OUT-OF-MAP TASK"}
 </span>
 </div>
 <h4 className="text-2xl font-black uppercase  leading-none text-[#0F172A]">{todo.task_name}</h4>
 </div>
 </div>
 <div className="flex items-center gap-4">
 {todo.status === 'Not Started' && (
 <Button 
 onClick={(e) => { e.stopPropagation(); startTodo(todo.id); }}
 className="h-18 px-10 bg-blue-600 hover:bg-blue-500 text-white rounded-[1.25rem] font-black uppercase text-xs tracking-widest shadow-xl active:scale-95 transition-all flex items-center gap-3 border-none"
 >
 <Play className="h-5 w-5 fill-white" /> START PROTOCOL
 </Button>
 )}
 {todo.status === 'In Progress' && (
 <div className="flex flex-col items-end gap-3">
 {findMatchingDay(todo.task_name) && (
 <div className="flex items-center gap-4 px-6 py-2 bg-rose-50 border border-rose-100 rounded-xl shadow-sm">
 <Clock className="h-5 w-5 text-rose-600 animate-pulse" />
 <span className="text-xs font-black uppercase text-rose-700 tracking-widest whitespace-nowrap">
 REQ: {getRequiredTime(todo.task_name)/60}H | SPENT: {calculateTimeSpent(todo.start_time)}M
 </span>
 </div>
 )}
 <Button 
 onClick={(e) => { e.stopPropagation(); completeProtocol(todo.id, todo); }}
 className="h-18 px-10 bg-emerald-600 hover:bg-emerald-500 text-white rounded-[1.25rem] font-black uppercase text-xs tracking-widest shadow-xl active:scale-95 transition-all flex items-center gap-3 border-none"
 >
 <CheckCircle2 className="h-6 w-6" /> COMPLETE SYNC
 </Button>
 </div>
 )}
 <Button 
 className="h-18 px-8 bg-white border-2 border-[#E2E8F0] text-[#475569] hover:border-blue-600 hover:text-blue-600 rounded-[1.25rem] font-black uppercase text-xs tracking-widest shadow-lg active:scale-95 transition-all"
 >
 RESCHEDULE
 </Button>
 </div>
 </div>
 ))}

 {/* Special Section: EXTRA COMPLETED TASKS */}
 {todos.some(t => t.is_completed && !findMatchingDay(t.task_name)) && (
 <div className="mt-12 space-y-6">
 <div className="flex items-center gap-4 opacity-50">
 <div className="h-[2px] flex-1 bg-slate-200" />
 <h3 className="text-sm font-black uppercase tracking-[0.3em] text-slate-500 ">EXTRA TASKS COMPLETED</h3>
 <div className="h-[2px] flex-1 bg-slate-200" />
 </div>
 {todos
 .filter(t => t.is_completed && !findMatchingDay(t.task_name))
 .filter(t => {
 if (!newTodo.trim()) return true;
 return t.task_name.toLowerCase().includes(newTodo.toLowerCase());
 })
 .slice(0, 10)
 .map((todo) => (
 <div key={todo.id} className="p-8 rounded-[3rem] bg-white border-2 border-slate-100 shadow-sm flex items-center justify-between opacity-70 hover:opacity-100 transition-all">
 <div className="flex items-center gap-8">
 <div className="h-14 w-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-sm border border-emerald-100">
 <Sparkles className="h-7 w-7" />
 </div>
 <div className="space-y-1">
 <span className="px-3 py-[2px] bg-slate-100 rounded-full text-[8px] font-black uppercase tracking-widest text-slate-500 border border-slate-200">OUT-OF-MAP ACHIEVEMENT</span>
 <h4 className="text-xl font-black uppercase  text-slate-700 line-through decoration-emerald-500/50">{todo.task_name}</h4>
 </div>
 </div>
 <Star className="h-6 w-6 text-yellow-400 fill-yellow-400" />
 </div>
 ))}
 </div>
 )}

 {/* Section: Completed Roadmap Protocols - Removed to prevent clutter as requested */}
 </div>
 </div>

 {/* Progress Map (Grid) */}
 <div className="lg:flex-[1.2] glass-card bg-white border border-[#E2E8F0] shadow-md p-14 rounded-[4rem] group hover:shadow-2xl transition-all duration-500 h-fit">
 <h2 className="text-4xl font-black uppercase  text-[#0F172A] flex items-center gap-6 border-b-2 border-blue-600 pb-8 mb-10">
 <Calendar className="h-10 w-10 text-blue-600 shadow-sm" /> Progress Map
 </h2>
 <div className="grid grid-cols-8 gap-5">
 {data?.roadmap.slice(0, 64).map((day: any, i: number) => (
 <div 
 key={i} 
 onClick={() => setSelectedDay(day)}
 className={cn(
 "h-16 w-16 lg:h-20 lg:w-20 rounded-2xl border-2 transition-all duration-300 flex items-center justify-center relative overflow-hidden group/node cursor-pointer shadow-sm",
 day.status === 'Completed' ? "bg-emerald-500 border-emerald-600 shadow-[0_5px_15px_rgba(16,185,129,0.3)]" : 
 highlightedDay === day.day ? "bg-orange-500 border-orange-600 shadow-[0_5px_15px_rgba(249,115,22,0.4)] scale-110 z-10" :
 day.status === 'Active' ? "bg-blue-600 border-blue-700 shadow-[0_5px_15px_rgba(37,99,235,0.3)] animate-pulse" : 
 selectedDay?.day === day.day ? "bg-blue-100 border-blue-400" : "bg-[#F1F5F9] border-[#CBD5E1] hover:border-blue-300"
 )}
 >
 <span className={cn(
 "text-lg lg:text-xl font-black z-10 ",
 day.status === 'Completed' || day.status === 'Active' ? "text-white" : "text-[#94A3B8]"
 )}>{day.day}</span>
 <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/node:opacity-100 transition-opacity" />
 </div>
 ))}
 </div>
 
 <AnimatePresence>
 {selectedDay && (
 <motion.div 
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, y: 20 }}
 className="mt-14 p-12 rounded-[3.5rem] bg-[#0F172A] text-white shadow-2xl relative overflow-hidden group border-4 border-blue-900/20"
 >
 <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:rotate-12 transition-transform duration-1000">
 <Zap className="h-32 w-32" />
 </div>
 <div className="relative z-10 space-y-8">
 <div className="flex justify-between items-center">
 <p className="text-xs font-black text-blue-400 uppercase tracking-[0.5em] leading-none shadow-sm">DAY {selectedDay.day} MISSION PROTOCOL</p>
 <Button 
 onClick={(e) => { e.stopPropagation(); setSelectedDay(null); }}
 className="h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 border-none p-0 text-white"
 >
 <RotateCcw className="h-6 w-6" />
 </Button>
 </div>
 <h4 className="text-5xl font-[1000] uppercase  leading-[0.9] text-white mb-4 drop-shadow-2xl">
 {selectedDay.topic}
 </h4>
 <div className="flex gap-6">
 <span className="px-8 py-3 bg-white/10 rounded-full text-xs font-black uppercase tracking-widest border border-white/10 shadow-sm">{selectedDay.status}</span>
 <span className="px-8 py-3 bg-blue-600/20 rounded-full text-xs font-black uppercase tracking-widest border border-blue-600/30 text-blue-400 shadow-sm">{selectedDay.priority} PRIORITY</span>
 </div>
 <Button 
 onClick={() => syncToRoadmap(selectedDay)}
 disabled={isSyncing || syncSuccess}
 className={cn(
 "w-full !h-24 font-[1000] uppercase text-xs lg:text-sm tracking-[0.4em] transition-all active:scale-95 rounded-[2rem] flex items-center justify-center gap-6 mt-10 shadow-2xl",
 syncSuccess ? "bg-emerald-500 text-white shadow-emerald-400/20" : "bg-blue-600 hover:bg-blue-50(255) text-white shadow-[0_20px_50px_rgba(37,99,235,0.4)]"
 )}
 >
 {syncSuccess ? <CheckCircle2 className="h-8 w-8" /> : (isSyncing ? <Loader2 className="h-8 w-8 animate-spin" /> : <Rocket className="h-8 w-8" />)}
 {syncSuccess ? "SYNC SUCCESSFUL" : (isSyncing ? "SYNCHRONIZING..." : "INITIALIZE MISSION PROTOCOL")}
 </Button>
 </div>
 </motion.div>
 )}
 </AnimatePresence>

 {!selectedDay && (
 <div className="mt-14 p-10 rounded-[3rem] bg-blue-50 border-4 border-blue-100 flex items-center gap-10 shadow-xl overflow-hidden relative group">
 <div className="h-20 w-20 bg-white rounded-3xl flex items-center justify-center text-blue-600 shadow-xl border-4 border-blue-100 group-hover:scale-110 transition-transform">
 <Map className="h-10 w-10" />
 </div>
 <div className="relative z-10">
 <p className="text-xs font-black text-blue-600 uppercase tracking-[0.4em] leading-none mb-3 ">NEXT STRATEGIC MILESTONE</p>
 <p className="text-2xl font-[1000] text-[#0F172A] uppercase leading-none  drop-shadow-sm">{data?.roadmap.find((d: any) => d.status === 'Pending')?.topic || 'Final Phase'}</p>
 </div>
 <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:rotate-12 transition-transform duration-1000">
 <Trophy className="h-24 w-24" />
 </div>
 </div>
 )}
 </div>
 </div>
 </div>

 {/* Right: Neural Engine Sidebar */}
 <div className="w-full xl:w-[450px] space-y-12">
 <div className="glass-card bg-[#0F172A] border border-[#0F172A] shadow-2xl p-14 rounded-[4.5rem] text-white space-y-10 group hover:shadow-[0_40px_100px_rgba(0,0,0,0.4)] transition-all duration-500 relative overflow-hidden h-fit">
 <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-125 transition-transform duration-1000">
 <BrainCircuit className="h-32 w-32" />
 </div>
 <div className="relative z-10 space-y-10">
 <h3 className="text-3xl font-black uppercase tracking-[0.3em] border-b border-white/10 pb-8 shadow-sm">Neural <span className="text-blue-400">Engine</span></h3>
 <div className="space-y-6">
 <p className="text-sm font-black text-blue-400 uppercase tracking-widest shadow-sm">AUTONOMOUS ADVISOR</p>
 <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 text-xl font-bold leading-relaxed shadow-inner">
 "Neural pulse stable. Career readiness is at 84%. Recommending immediate focus on System Design to breach the Senior-Node barrier."
 </div>
 </div>
 <div className="space-y-8">
 <p className="text-xs font-black text-white/30 uppercase tracking-[0.5em]">CAREER PATH</p>
 <div className="flex items-center gap-6 bg-white/10 p-8 rounded-3xl border border-white/5 shadow-sm">
 <Target className="h-8 w-8 text-blue-400" />
 <p className="text-2xl font-black uppercase  text-blue-100">Full-Stack Architect</p>
 </div>
 </div>
 <Button className="w-full !h-24 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase text-sm tracking-widest shadow-[0_20px_50px_rgba(37,99,235,0.4)] transition-all active:scale-95 rounded-2xl flex items-center justify-center gap-4 ">
 <Play className="h-6 w-6 fill-white" /> LAUNCH ADVISOR MODULE
 </Button>
 </div>
 </div>

 {/* Extra Nodes / Achievements */}
 </div>
 </div>
 )}
 {/* Violation Alert Modal */}
 <AnimatePresence>
 {violationAlert.show && (
 <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-md">
 <motion.div 
 initial={{ scale: 0.9, opacity: 0 }}
 animate={{ scale: 1, opacity: 1 }}
 exit={{ scale: 0.9, opacity: 0 }}
 className="bg-white p-12 rounded-[3.5rem] border-4 border-rose-500 shadow-2xl max-w-2xl text-center space-y-8"
 >
 <div className="h-28 w-28 bg-rose-50 rounded-full flex items-center justify-center mx-auto border-4 border-rose-100">
 <AlertTriangle className="h-16 w-16 text-rose-600" />
 </div>
 <div className="space-y-4">
 <h2 className="text-4xl font-black uppercase  text-rose-600 leading-tight">Institutional Alert</h2>
 <p className="text-xl font-black uppercase text-[#475569] leading-relaxed ">
 {violationAlert.msg}
 </p>
 </div>
 <p className="text-sm font-bold text-slate-400 uppercase tracking-widest ">MASTERY CANNOT BE RUSHED. RESPECT THE RESEARCH WINDOW.</p>
 <Button 
 onClick={() => setViolationAlert({show: false, msg: ""})}
 className="!h-16 w-full bg-[#0F172A] hover:bg-[#1E293B] text-white rounded-2xl font-black uppercase tracking-[0.2em] transition-all shadow-xl"
 >
 I WILL CONTINUE STUDYING
 </Button>
 </motion.div>
 </div>
 )}
 </AnimatePresence>
 </div>
 )
}
