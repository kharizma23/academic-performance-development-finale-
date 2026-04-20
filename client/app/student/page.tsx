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

// DEMO DATA FALLBACKS
const demoOverview = {
  student: { name: "Institutional Node", current_cgpa: 8.42, streak_count: 12, xp_points: 2150 },
  roadmap: [
    { day: 1, topic: "Data Structures Foundations", status: "Completed", priority: "High", icon: "frontend" },
    { day: 2, topic: "Algorithmic Analysis", status: "Completed", priority: "High", icon: "backend" },
    { day: 3, topic: "Binary Search Trees", status: "Active", priority: "Medium", icon: "code" },
  ]
};

const demoTodos = [
  { id: "1", task_name: "Master React Hooks", priority: "High", difficulty: "Medium", status: "In Progress", start_time: new Date().toISOString() },
  { id: "2", task_name: "Optimize SQL Queries", priority: "Medium", difficulty: "High", status: "Not Started" },
];

export default function SmartOverview() {
  const getApiUrl = (path: string) => {
    const host = typeof window !== 'undefined' ? window.location.hostname : '127.0.0.1';
    return `http://${host}:8001${path}`;
  };

  const router = useRouter()
  const [data, setData] = useState<any>(null)
  const [todos, setTodos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [newTodo, setNewTodo] = useState("")
  const [activeTab, setActiveTab] = useState('roadmap')
  const [selectedDay, setSelectedDay] = useState<any>(null)
  const [isSyncing, setIsSyncing] = useState(false)
  const [syncSuccess, setSyncSuccess] = useState(false)
  const [violationAlert, setViolationAlert] = useState<{show: boolean, msg: string}>({show: false, msg: ""})

  useEffect(() => {
    fetchInitialData()
  }, [])

  const fetchInitialData = async () => {
    try {
      const [overview, todoList] = await Promise.all([
        fetchStudentOverview(),
        fetchStudentTodos()
      ])
      
      setData(overview || demoOverview)
      setTodos(todoList || demoTodos)
    } catch (error) {
      console.error("Neural fetch failure", error)
      setData(demoOverview)
      setTodos(demoTodos)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return (
    <div className="flex flex-col h-[70vh] items-center justify-center bg-white p-6">
      <div className="flex flex-col items-center gap-6">
        <div className="h-16 w-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-xl animate-bounce">
          <GraduationCap className="h-8 w-8" />
        </div>
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-black text-blue-950 uppercase">Neural Syncing</h1>
          <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Optimizing Node Proximity...</p>
        </div>
      </div>
    </div>
  )

  return (
    <div className="w-full space-y-8 pb-20 text-[#0F172A] font-sans selection:bg-blue-500/10">
      {/* Header: Compact */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 bg-emerald-500 rounded-full animate-ping" />
          <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-0.5 rounded-full border border-emerald-100">Sync: ACTIVE</p>
        </div>
        <h1 className="text-4xl lg:text-5xl font-black uppercase text-blue-950">
          Smart <span className="text-blue-600">Overview</span>
        </h1>
        <p className="text-xs font-black text-slate-400 uppercase flex items-center gap-2">
          <Minus className="h-4 w-4 text-blue-300" /> Authorized: <span className="text-[#0F172A]">{data?.student?.name || "Student Node"}</span>
        </p>
      </div>

      {/* Navigation Matrix: Compact */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-1.5 border border-white shadow-sm w-fit overflow-x-auto">
        {[
          { id: 'roadmap', label: 'ROADMAP', icon: Map },
          { id: 'journey', label: 'ACADEMIC', icon: GraduationCap },
          { id: 'skills', label: 'SKILLS', icon: Code2 },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-5 py-2 rounded-xl font-black uppercase text-[10px] transition-all flex items-center gap-2 border border-transparent",
              activeTab === tab.id ? "bg-white text-blue-600 shadow-md" : "text-slate-500 hover:text-blue-600"
            )}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'roadmap' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            {/* Global Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: 'Neural IQ', value: '142', icon: BrainCircuit, color: 'text-blue-600' },
                { label: 'Sync Rate', value: '98%', icon: Zap, color: 'text-yellow-600' },
                { label: 'Growth', value: '+12%', icon: TrendingUp, color: 'text-emerald-600' },
                { label: 'XP Points', value: data?.student?.xp_points || '2150', icon: Sparkles, color: 'text-purple-600' }
              ].map((stat, i) => (
                <div key={i} className="p-8 rounded-[2rem] bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-[200px]">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                      <p className="text-5xl font-black text-slate-900 leading-none">{stat.value}</p>
                    </div>
                    <stat.icon className={cn("h-8 w-8 opacity-20", stat.color)} />
                  </div>
                  <div className="pt-4 border-t border-slate-50">
                    <p className="text-[9px] font-black uppercase text-slate-400">Stable Protocol</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Functional Blocks */}
            <div className="grid lg:grid-cols-12 gap-8">
               {/* Daily List */}
               <div className="lg:col-span-12 xl:col-span-8 bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm space-y-6">
                  <div className="flex items-center justify-between border-b pb-6">
                    <h2 className="text-xl font-black uppercase flex items-center gap-3"><Zap className="h-6 w-6 text-blue-600" /> Execution Queue</h2>
                  </div>
                  <div className="space-y-4">
                     {todos.map(todo => (
                       <div key={todo.id} className="p-6 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between hover:border-blue-300 transition-all">
                          <div className="space-y-1">
                            <span className="text-[8px] font-black text-blue-500 uppercase tracking-widest">{todo.priority} PRIORITY</span>
                            <h4 className="text-base font-black uppercase text-slate-900">{todo.task_name}</h4>
                          </div>
                          <Button className="h-10 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black uppercase text-[10px] tracking-widest transition-all">START NODE</Button>
                       </div>
                     ))}
                  </div>
               </div>

               {/* Advisor Sidebar */}
               <div className="lg:col-span-12 xl:col-span-4 space-y-8">
                  <div className="bg-[#0F172A] p-10 rounded-[2.5rem] text-white space-y-6">
                     <h3 className="text-lg font-black uppercase tracking-widest text-blue-400 border-b border-white/10 pb-4">Neural Advisor</h3>
                     <p className="text-sm font-bold text-slate-300 leading-relaxed uppercase">"REMAINING CONSISTENT. YOUR DSA NODES ARE 84% COMPLETE. FOCUS ON RED BLACK TREES NEXT."</p>
                     <Button className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase text-[10px] tracking-widest rounded-xl transition-all">BOOST SYNC</Button>
                  </div>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
