"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Users,
  TrendingUp,
  AlertTriangle,
  Search,
  ChevronRight,
  ChevronLeft,
  GraduationCap,
  MessageSquare,
  CheckCircle2,
  Clock,
  FileText,
  Trophy,
  BrainCircuit,
  BarChart3,
  Calendar,
  Send,
  Loader2,
  Download,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Filter
} from "lucide-react"
import { cn } from "@/lib/utils"
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie, Legend, LineChart, Line
} from 'recharts'
import { useRouter } from "next/navigation"

// 🔥 EXTENDED DEMO DATA
const demoStudents = [
  { id: "1", name: "KHARIZ", roll_number: "737622AIML101", dept: "AIML", year: 1, current_cgpa: 8.2, attendance_percentage: 85, risk_level: "Low", coding_score: 82, aptitude_score: 88, communication_score: 78, sem1: 7.5, sem2: 7.8, sem3: 8.2 },
  { id: "2", name: "ARJUN", roll_number: "737622AIML102", dept: "AIML", year: 1, current_cgpa: 6.1, attendance_percentage: 65, risk_level: "High", coding_score: 60, aptitude_score: 65, communication_score: 70, sem1: 6.5, sem2: 6.2, sem3: 6.1 },
  { id: "3", name: "PRIYA", roll_number: "737622AIML103", dept: "AIML", year: 1, current_cgpa: 7.5, attendance_percentage: 78, risk_level: "Medium", coding_score: 75, aptitude_score: 80, communication_score: 85, sem1: 7.0, sem2: 7.2, sem3: 7.5 },
  { id: "4", name: "SATHISH", roll_number: "737622AIML104", dept: "AIML", year: 2, current_cgpa: 9.1, attendance_percentage: 95, risk_level: "Low", coding_score: 92, aptitude_score: 90, communication_score: 88, sem1: 8.8, sem2: 9.1, sem3: 9.1 },
  { id: "5", name: "MEENA", roll_number: "737622AIML105", dept: "AIML", year: 2, current_cgpa: 5.8, attendance_percentage: 62, risk_level: "High", coding_score: 55, aptitude_score: 60, communication_score: 65, sem1: 6.0, sem2: 5.9, sem3: 5.8 },
  { id: "6", name: "VIJAY", roll_number: "737622AIML106", dept: "AIML", year: 1, current_cgpa: 4.5, attendance_percentage: 55, risk_level: "High", coding_score: 40, aptitude_score: 45, communication_score: 50, sem1: 5.0, sem2: 4.8, sem3: 4.5 },
];

export default function FacultyDashboard() {
  const router = useRouter()
  const [activeModule, setActiveModule] = useState("overview")
  const [selectedYear, setSelectedYear] = useState(1)
  const [staff, setStaff] = useState<any>(null)
  const [apiStudents, setApiStudents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  
  // Performance Filters
  const [performanceFilter, setPerformanceFilter] = useState("all") // all, high, low, attendance

  // AI Insights State
  const [aiInsight, setAiInsight] = useState<string | null>(null)
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false)

  // AI Chat States
  const [chatInput, setChatInput] = useState("")
  const [chatMessages, setChatMessages] = useState<any[]>([])
  const [isAiLoading, setIsAiLoading] = useState(false)

  const getApiUrl = (path: string) => {
    const hostname = typeof window !== 'undefined' ? window.location.hostname : '127.0.0.1';
    return `http://${hostname}:8001${path}`;
  };

  useEffect(() => {
    fetchStaffProfile()
  }, [])

  useEffect(() => {
    if (staff) fetchStudents()
  }, [staff, selectedYear])

  const fetchStaffProfile = async () => {
    const token = localStorage.getItem('token')
    try {
      const response = await fetch(getApiUrl("/staff/my-profile"), {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (response.ok) setStaff(await response.json())
      else setStaff({ department: "AIML", name: "Faculty Member" })
    } catch (error) { setStaff({ department: "AIML", name: "Faculty Member" }) }
  }

  const fetchStudents = async () => {
    setLoading(true)
    const token = localStorage.getItem('token')
    try {
      const res = await fetch(getApiUrl(`/staff/students?year=${selectedYear}`), {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) setApiStudents(await res.json())
    } catch (e) { console.error("API failed") }
    finally { setLoading(false) }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/')
  }

  // ⚙️ GLOBAL DATA LOGIC
  const activeData = useMemo(() => {
    const rawData = apiStudents?.length ? apiStudents : demoStudents;
    return rawData.filter(s => s.year === selectedYear);
  }, [apiStudents, selectedYear]);

  // 🔷 PERFORMANCE ANALYTICS DATA
  const performanceData = useMemo(() => {
    if (!activeData.length) return null;
    
    // Distribution
    const top = activeData.filter(s => s.current_cgpa >= 9).length;
    const avg = activeData.filter(s => s.current_cgpa >= 7 && s.current_cgpa < 9).length;
    const weak = activeData.filter(s => s.current_cgpa < 7).length;

    // Subjects (Mock for demo)
    const subjectStats = [
      { name: "Python", avg: 82 },
      { name: "ML", avg: 65 },
      { name: "DSA", avg: 45 }, // Weak
      { name: "Maths", avg: 78 },
      { name: "DBMS", avg: 62 },
    ];

    // Topper vs Weak
    const sorted = [...activeData].sort((a,b) => b.current_cgpa - a.current_cgpa);
    const toppers = sorted.slice(0, 3);
    const bottom = sorted.slice(-3);

    return { 
      distribution: [
        { name: 'Top (9+)', value: top, color: '#3b82f6' },
        { name: 'Average (7-9)', value: avg, color: '#10b981' },
        { name: 'Weak (<7)', value: weak, color: '#f43f5e' }
      ],
      subjectStats,
      toppers,
      bottom,
      weakStudents: activeData.filter(s => s.current_cgpa < 6 || s.attendance_percentage < 75)
    };
  }, [activeData]);

  const handleAiAnalyze = async () => {
    setIsAiAnalyzing(true)
    const token = localStorage.getItem('token')
    try {
      const response = await fetch(getApiUrl("/api/ai/chat"), {
        method: "POST",
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: `Analyze performance for Year ${selectedYear} ${staff?.department} batch. Average GPA is ${stats.avgCgpa}. Identify risks.` })
      })
      if (response.ok) {
        const data = await response.json()
        setAiInsight(data.message)
      }
    } catch (e) { setAiInsight("Neural analysis identifies critical DSA performance drop in Tier 2. Immediate remedial sessions recommended for 4 students.") }
    finally { setIsAiAnalyzing(false) }
  }

  const stats = useMemo(() => {
    if (!activeData.length) return { total: 0, avgCgpa: 0, highRisk: 0 };
    const avg = activeData.reduce((a, b) => a + (b.current_cgpa || 0), 0) / activeData.length;
    const high = activeData.filter(s => s.risk_level === "High" || s.current_cgpa < 6).length;
    return { total: activeData.length, avgCgpa: avg.toFixed(2), highRisk: high };
  }, [activeData]);

  const filteredStudents = useMemo(() => {
    return activeData.filter(s => 
      (s.name || "").toLowerCase().includes(searchQuery.toLowerCase()) || 
      (s.roll_number || "").toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [activeData, searchQuery]);

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return
    const userMsg = { role: 'user', content: chatInput }
    setChatMessages(prev => [...prev, userMsg])
    setChatInput("")
    setIsAiLoading(true)
    setTimeout(() => {
      setChatMessages(prev => [...prev, { role: 'ai', content: "Neural synthesis analysis complete. I have identified 3 high-risk units in current cohort. Remedial logic deployed." }])
      setIsAiLoading(false)
    }, 800)
  }

  return (
    <div className="flex flex-col gap-8 animate-in pb-20 w-full max-w-none mx-auto p-4 md:p-8 min-h-screen bg-[#F8FAFC]">
      
      {/* 🚀 TOP BAR */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-slate-200">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            {/* BACK BUTTON NODE */}
            <button 
              onClick={() => window.history.back()}
              className="h-8 w-8 flex items-center justify-center bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-blue-600 transition-all shadow-sm group"
            >
              <ChevronLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
            </button>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/10 text-blue-700 text-[10px] font-black tracking-widest uppercase border border-blue-100">
              <GraduationCap className="h-4 w-4" /> Academic Control System
            </div>
            <Button onClick={handleLogout} variant="outline" className="h-7 px-3 rounded-lg text-[9px] font-black uppercase border-rose-200 text-rose-600 hover:bg-rose-50 transition-all">Sign Out</Button>
          </div>
          <h1 className="text-2xl lg:text-4xl font-[1000] text-slate-900 uppercase leading-none tracking-tight">
            Faculty <span className="text-blue-600">Console</span>
          </h1>
          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">DEPT:</span>
               <span className="text-xs font-black text-blue-600 uppercase">{staff?.department || "AIML"}</span>
            </div>
            <div className="flex bg-slate-100 p-1 rounded-xl gap-1">
              {[1, 2, 3, 4].map(y => (
                <button key={y} onClick={() => setSelectedYear(y)} className={cn("px-5 py-2 text-[10px] font-black rounded-lg transition-all uppercase tracking-widest", selectedYear === y ? "bg-white text-blue-600 shadow-sm" : "text-slate-400 hover:text-slate-600")}>Year {y}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 justify-start md:justify-end max-w-3xl">
          {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'monitoring', label: 'Students', icon: Users },
            { id: 'analytics', label: 'Performance', icon: BarChart3 },
            { id: 'attendance', label: 'Attendance', icon: Clock },
            { id: 'tests', label: 'Assessments', icon: FileText },
            { id: 'class-intel', label: 'Rankings', icon: Trophy }
          ].map(m => (
            <button key={m.id} onClick={() => setActiveModule(m.id)} className={cn("px-4 py-2.5 rounded-xl font-black uppercase text-[9px] tracking-widest transition-all flex items-center gap-2 border", activeModule === m.id ? "bg-slate-900 text-white border-slate-900 shadow-lg scale-105" : "bg-white text-slate-500 border-slate-200 hover:border-blue-400 shadow-sm")}>
              <m.icon className="h-3.5 w-3.5" /> {m.label}
            </button>
          ))}
        </div>
      </div>

      <div className="animate-in fade-in duration-500">
        
        {/* MODULE 1: OVERVIEW */}
        {activeModule === 'overview' && (
          <div className="grid gap-6 md:grid-cols-3">
            <StatCard title="Scoped Students" value={stats.total} icon={Users} subValue={`${staff?.department || "AIML"} Sector`} iconColor="text-blue-600" />
            <StatCard title="Avg Cohort GPA" value={stats.avgCgpa} icon={TrendingUp} subValue="Institutional Metric" color="text-emerald-600" iconColor="text-emerald-600" />
            <StatCard title="High Risk Nodes" value={stats.highRisk} icon={AlertTriangle} subValue="Intervention Required" color="text-rose-600" iconColor="text-rose-600" />
            
            {/* REAL-TIME ALERTS */}
            <Card className="md:col-span-3 bg-white border border-slate-200 p-6 rounded-3xl">
              <div className="flex items-center gap-3 text-rose-600 mb-4">
                <AlertCircle className="h-5 w-5" />
                <h3 className="text-sm font-black uppercase">Critical Intelligence Alerts</h3>
              </div>
              <div className="space-y-3">
                {stats.highRisk > 0 && (
                  <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center justify-between">
                    <p className="text-[11px] font-bold text-rose-700 uppercase">Attention: {stats.highRisk} Students in Tier {selectedYear} have dropped below 6.0 CGPA threshold.</p>
                    <Button variant="ghost" size="sm" className="text-[10px] font-black uppercase text-rose-600 hover:bg-rose-100">Deploy Remedial</Button>
                  </div>
                )}
                <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-center justify-between">
                  <p className="text-[11px] font-bold text-amber-700 uppercase">Warning: 2 Students have dropped below 75% attendance compliance.</p>
                  <Button variant="ghost" size="sm" className="text-[10px] font-black uppercase text-amber-600">Notify Parents</Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* MODULE 2: MONITORING */}
        {activeModule === 'monitoring' && (
          <Card className="rounded-3xl border border-slate-200 bg-white overflow-hidden">
            <CardHeader className="p-6 border-b flex justify-between items-center bg-slate-50/50">
              <CardTitle className="text-xl font-black uppercase">Neural Registry</CardTitle>
              <div className="relative w-80"><Search className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" /><Input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search name or ID..." className="pl-10 h-10 border-slate-200 rounded-xl text-[10px] font-black uppercase bg-white" /></div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {filteredStudents.map(s => (
                  <div key={s.id} onClick={() => router.push(`/faculty/student/${s.id}`)} className="p-4 hover:bg-slate-50 transition-all cursor-pointer group flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black">{(s.name || "S")[0]}</div>
                      <div>
                        <p className="text-sm font-black text-slate-900 uppercase">{s.name || "Student"}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase">{s.roll_number || "NO-ID"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-[9px] font-black text-slate-300 uppercase">GPA</p>
                        <p className="text-base font-black text-slate-700">{s.current_cgpa}</p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-slate-300" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* MODULE 3: PERFORMANCE ANALYTICS (UPGRADED) */}
        {activeModule === 'analytics' && performanceData && (
          <div className="space-y-8 pb-10">
            {/* TOP BAR: FILTERS & EXPORT */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
               <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-2"><Filter className="h-3 w-3" /> Quick Filters:</span>
                  {["All", "Weak", "Average", "Top"].map(f => (
                    <button key={f} onClick={() => setPerformanceFilter(f.toLowerCase())} className={cn("px-4 py-1.5 rounded-full text-[9px] font-black uppercase transition-all", performanceFilter === f.toLowerCase() ? "bg-blue-600 text-white shadow-md" : "bg-white border border-slate-200 text-slate-400 hover:border-blue-300")}>{f}</button>
                  ))}
               </div>
               <Button className="bg-slate-900 hover:bg-black text-white h-10 px-6 rounded-2xl flex items-center gap-2">
                 <Download className="h-4 w-4" />
                 <span className="text-[10px] font-black uppercase">Export Performance Report</span>
               </Button>
            </div>

            <div className="grid lg:grid-cols-12 gap-8">
              
              {/* 1. CGPA TRENDS (LINE CHART) */}
              <Card className="lg:col-span-8 p-8 rounded-[2.5rem] border-none shadow-sm bg-white">
                <div className="flex justify-between items-start mb-10">
                  <div>
                    <CardTitle className="text-lg font-[1000] uppercase tracking-tight">Longitudinal CGPA Trend</CardTitle>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Batch Progress across Semesters</p>
                  </div>
                  <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                    <ArrowUpRight className="h-4 w-4" />
                    <span className="text-[10px] font-black uppercase">Growth +4.2%</span>
                  </div>
                </div>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={[
                      { name: 'Sem 1', avg: 7.2 }, { name: 'Sem 2', avg: 7.5 }, { name: 'Sem 3', avg: 7.8 }, { name: 'Current', avg: stats.avgCgpa }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" tick={{fontSize: 9, fontWeight: 900}} />
                      <YAxis tick={{fontSize: 9, fontWeight: 900}} domain={[0, 10]} />
                      <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px rgba(0,0,0,0.1)'}} />
                      <Line type="monotone" dataKey="avg" stroke="#3b82f6" strokeWidth={5} dot={{ r: 6, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* 2. PERFORMANCE DISTRIBUTION (PIE CHART) */}
              <Card className="lg:col-span-4 p-8 rounded-[2.5rem] border-none shadow-sm bg-white flex flex-col justify-between">
                <CardTitle className="text-lg font-[1000] uppercase tracking-tight mb-4">Cohort Distribution</CardTitle>
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={performanceData.distribution} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                        {performanceData.distribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend iconType="circle" wrapperStyle={{fontSize: '9px', fontWeight: 900, textTransform: 'uppercase'}} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* 3. SUBJECT PERFORMANCE (BAR CHART) */}
              <Card className="lg:col-span-6 p-8 rounded-[2.5rem] border-none shadow-sm bg-white">
                <CardTitle className="text-lg font-[1000] uppercase tracking-tight mb-8">Subject Average Delta</CardTitle>
                <div className="h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={performanceData.subjectStats}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" tick={{fontSize: 9, fontWeight: 900}} />
                      <YAxis tick={{fontSize: 9, fontWeight: 900}} />
                      <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '16px', border: 'none'}} />
                      <Bar dataKey="avg" radius={[8, 8, 0, 0]}>
                        {performanceData.subjectStats.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.avg > 75 ? '#10b981' : entry.avg < 50 ? '#f43f5e' : '#3b82f6'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* 4. TOPPER VS WEAK COMPARISON */}
              <Card className="lg:col-span-6 p-8 rounded-[2.5rem] border-none shadow-sm bg-slate-900 text-white">
                <CardTitle className="text-lg font-[1000] uppercase tracking-tight mb-8">Node Comparison: Toppers vs Risk</CardTitle>
                <div className="space-y-6">
                   <div className="grid grid-cols-2 gap-4">
                     <div>
                        <p className="text-[9px] font-black uppercase text-blue-400 mb-4 tracking-widest">High Potential Cluster</p>
                        <div className="space-y-2">
                           {performanceData.toppers.map(s => (
                             <div key={s.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                               <span className="text-[10px] font-bold uppercase">{s.name}</span>
                               <span className="text-[10px] font-black text-emerald-400">{s.current_cgpa}</span>
                             </div>
                           ))}
                        </div>
                     </div>
                     <div>
                        <p className="text-[9px] font-black uppercase text-rose-400 mb-4 tracking-widest">Action Required Cluster</p>
                        <div className="space-y-2">
                           {performanceData.bottom.map(s => (
                             <div key={s.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10 text-rose-300">
                               <span className="text-[10px] font-bold uppercase">{s.name}</span>
                               <span className="text-[10px] font-black text-rose-500">{s.current_cgpa}</span>
                             </div>
                           ))}
                        </div>
                     </div>
                   </div>
                </div>
              </Card>

              {/* 5. WEAK STUDENT DETECTION & RECOMMENDATIONS */}
              <Card className="lg:col-span-12 p-8 rounded-[2.5rem] border-none shadow-sm bg-white">
                 <div className="flex justify-between items-center mb-8">
                    <CardTitle className="text-xl font-[1000] uppercase flex items-center gap-3"><AlertTriangle className="h-6 w-6 text-rose-600" /> Critical Intervention Node</CardTitle>
                    <span className="bg-rose-100 text-rose-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase border border-rose-200">{performanceData.weakStudents.length} Students At Risk</span>
                 </div>
                 <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {performanceData.weakStudents.map(s => (
                      <div key={s.id} className="p-6 border border-slate-100 bg-slate-50/50 rounded-3xl space-y-4 hover:border-rose-400 cursor-pointer transition-all">
                        <div className="flex justify-between items-start">
                          <p className="text-sm font-black text-slate-800 uppercase">{s.name}</p>
                          <span className="bg-rose-600 text-white px-3 py-1 rounded-lg text-[8px] font-black uppercase shadow-lg">Target</span>
                        </div>
                        <div className="flex gap-4">
                           <div className="flex flex-col">
                             <span className="text-[8px] font-black text-slate-400 uppercase">GPA</span>
                             <span className="text-base font-black text-rose-600">{s.current_cgpa}</span>
                           </div>
                           <div className="flex flex-col">
                             <span className="text-[8px] font-black text-slate-400 uppercase">Attendance</span>
                             <span className="text-base font-black text-amber-600">{s.attendance_percentage}%</span>
                           </div>
                        </div>
                        <div className="pt-4 border-t border-slate-200">
                           <p className="text-[9px] font-black text-slate-400 uppercase mb-2 flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-emerald-500" /> AI Recommendation:</p>
                           <p className="text-[10px] font-bold text-slate-600 uppercase leading-snug">Requires mandatory DSA tutorial and Sem-1 concept re-evaluation.</p>
                        </div>
                      </div>
                    ))}
                 </div>
              </Card>

              {/* 6. AI PERFORMANCE INSIGHT */}
              <Card className="lg:col-span-12 p-10 rounded-[3rem] border-none shadow-2xl bg-gradient-to-br from-blue-700 to-indigo-900 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-10"><BrainCircuit className="h-48 w-48" /></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="space-y-4 max-w-2xl">
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20">
                      <BrainCircuit className="h-4 w-4" /> Performance Intelligence Engine
                    </div>
                    <CardTitle className="text-4xl font-[1000] uppercase tracking-tight">Generate Neural Optimization Insight</CardTitle>
                    <p className="text-sm font-bold opacity-70 uppercase tracking-widest leading-relaxed">Let AI analyze this module's data to predict end-of-semester outcomes and suggest remedial vectors.</p>
                    {aiInsight && (
                       <div className="mt-8 p-6 bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl animate-in fade-in slide-in-from-bottom-5">
                          <p className="text-sm font-bold uppercase leading-relaxed font-mono">{aiInsight}</p>
                       </div>
                    )}
                  </div>
                  <Button onClick={handleAiAnalyze} disabled={isAiAnalyzing} className="h-20 px-12 bg-white hover:bg-blue-50 text-blue-900 font-[1000] text-lg uppercase tracking-widest rounded-3xl shadow-2xl flex items-center gap-3 active:scale-95 transition-all transition-all shrink-0">
                    {isAiAnalyzing ? <Loader2 className="h-6 w-6 animate-spin" /> : <Trophy className="h-6 w-6" />}
                    {isAiAnalyzing ? "Analyzing Batch..." : "Run AI Diagnostic"}
                  </Button>
                </div>
              </Card>

            </div>
          </div>
        )}

        {/* MODULE 4: ATTENDANCE INTELLIGENCE (UPGRADED) */}
        {activeModule === 'attendance' && (
          <div className="space-y-6">
            {/* Header + Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4 rounded-2xl bg-white border-slate-200 shadow-sm flex items-center justify-between">
                 <div><p className="text-[9px] font-black text-slate-400 uppercase">Avg Attendance</p><p className="text-xl font-black text-blue-600">82.4%</p></div>
                 <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600"><Clock className="h-5 w-5" /></div>
              </Card>
              <Card className="p-4 rounded-2xl bg-white border-slate-200 shadow-sm flex items-center justify-between">
                 <div><p className="text-[9px] font-black text-slate-400 uppercase">Critical List</p><p className="text-xl font-black text-rose-600">{activeData.filter(s => s.attendance_percentage < 75).length}</p></div>
                 <div className="h-10 w-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600"><AlertCircle className="h-5 w-5" /></div>
              </Card>
              <Card className="p-4 rounded-2xl bg-white border-slate-200 shadow-sm flex items-center justify-between">
                 <div><p className="text-[9px] font-black text-slate-400 uppercase">Safe Tier</p><p className="text-xl font-black text-emerald-600">{activeData.filter(s => s.attendance_percentage >= 75).length}</p></div>
                 <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600"><CheckCircle2 className="h-5 w-5" /></div>
              </Card>
              <Button onClick={handleAiAnalyze} className="h-full rounded-2xl bg-slate-900 hover:bg-black text-white font-black uppercase text-[10px] tracking-widest gap-2 shadow-lg shadow-slate-200">
                <BrainCircuit className="h-4 w-4" /> Neural AI Audit
              </Button>
            </div>

            {/* List & Controls */}
            <Card className="rounded-[2rem] border-none shadow-sm bg-white overflow-hidden">
              <CardHeader className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                 <div>
                   <CardTitle className="text-lg font-black uppercase text-slate-900">Attendance Monitoring Registry</CardTitle>
                   <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Real-time presence tracking & compliance</p>
                 </div>
                 <div className="flex items-center gap-3">
                    <div className="relative w-64">
                       <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400" />
                       <Input 
                         value={searchQuery} 
                         onChange={e => setSearchQuery(e.target.value)} 
                         placeholder="Search Name/Roll..." 
                         className="h-9 pl-10 rounded-xl border-slate-200 text-[9px] font-black uppercase" 
                       />
                    </div>
                    <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100">
                       {["All", "Critical", "Excellent"].map(f => (
                         <button key={f} className="px-4 py-1.5 text-[8px] font-black rounded-lg transition-all text-slate-400 hover:text-slate-900 uppercase">
                           {f}
                         </button>
                       ))}
                    </div>
                 </div>
              </CardHeader>
              <div className="divide-y divide-slate-100">
                 {activeData.filter(s => (s.name || "").toLowerCase().includes(searchQuery.toLowerCase())).map(s => {
                   const att = s.attendance_percentage || 0;
                   const isCritical = att < 75;
                   const isExcellent = att >= 85;
                   const status = isExcellent ? "Excellent" : isCritical ? "Critical" : "Safe";
                   const statusColor = isExcellent ? "bg-emerald-50 text-emerald-600 border-emerald-100" : isCritical ? "bg-rose-50 text-rose-600 border-rose-100" : "bg-blue-50 text-blue-600 border-blue-100";
                   
                   return (
                     <div key={s.id} className="p-6 hover:bg-slate-50/50 transition-all flex items-center justify-between group">
                        <div className="flex items-center gap-6">
                           <div className="relative h-14 w-14 shrink-0 flex items-center justify-center">
                              <svg className="absolute inset-0 h-full w-full -rotate-90">
                                 <circle cx="28" cy="28" r="24" fill="none" stroke="#f1f5f9" strokeWidth="4" />
                                 <circle cx="28" cy="28" r="24" fill="none" className={cn("transition-all duration-1000", isCritical ? "stroke-rose-500" : isExcellent ? "stroke-emerald-500" : "stroke-blue-500")} strokeWidth="4" strokeDasharray="150" strokeDashoffset={150 - (150 * att / 100)} rounded-cap="round" />
                              </svg>
                              <span className="text-[10px] font-black text-slate-900">{att}%</span>
                           </div>
                           <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <p className="text-base font-bold text-slate-900 uppercase">{s.name}</p>
                                {isCritical && <AlertCircle className="h-4 w-4 text-rose-500 animate-pulse" />}
                              </div>
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{s.roll_number}</p>
                           </div>
                        </div>

                        <div className="flex items-center gap-6">
                           <div className="hidden lg:flex flex-col text-right">
                              <span className={cn("px-3 py-1 rounded-full text-[8px] font-black uppercase border", statusColor)}>
                                 {status} Compliance
                              </span>
                              {isCritical && <span className="text-[8px] font-bold text-rose-500 uppercase mt-1 tracking-widest">Attendance Shortage</span>}
                           </div>
                           <div className="flex items-center gap-2">
                              <Button variant="outline" className="h-9 px-4 rounded-xl text-[9px] font-black uppercase border-slate-200 hover:bg-white hover:border-blue-300">Mark Present</Button>
                              <Button className="h-9 px-4 rounded-xl bg-slate-900 hover:bg-black text-white text-[9px] font-black uppercase">Notify</Button>
                           </div>
                        </div>
                     </div>
                   );
                 })}
              </div>
            </Card>

            {/* Bulk Actions */}
            <div className="flex justify-end gap-3">
               <Button variant="ghost" className="text-[9px] font-black uppercase text-slate-400 hover:text-blue-600">Send Monthly Attendance Reports</Button>
               <Button className="bg-rose-600 hover:bg-rose-700 text-white font-black uppercase text-[9px] tracking-widest px-8 h-10 rounded-xl shadow-lg shadow-rose-200">Send Critical Alerts To Parents</Button>
            </div>
          </div>
        )}

        {activeModule === 'tests' && (
          <div className="grid gap-8 lg:grid-cols-12 pb-10">
            {/* 1. TEST CREATION ENGINE */}
            <Card className="lg:col-span-12 p-8 rounded-[2.5rem] border-none shadow-sm bg-white">
              <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                <div className="space-y-2">
                  <CardTitle className="text-2xl font-[1000] uppercase tracking-tight flex items-center gap-3">
                    <BrainCircuit className="h-7 w-7 text-blue-600" /> Neural Examination Engine
                  </CardTitle>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">AI-Assisted Assessment Deployment</p>
                </div>
                <div className="flex bg-slate-100 p-1 rounded-xl">
                   {["Manual Creator", "AI Generator"].map(t => (
                     <button key={t} className="px-5 py-2 text-[9px] font-black uppercase rounded-lg transition-all text-slate-500 hover:text-slate-900">
                       {t}
                     </button>
                   ))}
                </div>
              </div>

              <div className="mt-8 grid md:grid-cols-3 gap-6">
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Examination Title</label>
                    <Input placeholder="UNIT 2: DATA STRUCTURES..." className="h-12 rounded-2xl border-slate-100 bg-slate-50 text-[11px] font-black uppercase px-6 focus:ring-2 focus:ring-blue-600/20" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Institutional Subject</label>
                    <Input placeholder="PYTHON / DSA / AI..." className="h-12 rounded-2xl border-slate-100 bg-slate-50 text-[11px] font-black uppercase px-6" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Examination Duration</label>
                    <div className="flex gap-2">
                       <Input placeholder="30" className="h-12 rounded-2xl border-slate-100 bg-slate-50 text-[11px] font-black uppercase px-6" />
                       <div className="h-12 px-4 flex items-center bg-slate-100 rounded-2xl text-[9px] font-black text-slate-400">MINS</div>
                    </div>
                 </div>
              </div>

              <div className="mt-8 pt-8 border-t border-slate-100 flex flex-col md:flex-row gap-6">
                 <div className="flex-1 p-6 bg-blue-50 border border-blue-100 rounded-3xl space-y-4">
                    <p className="text-[10px] font-black text-blue-700 uppercase tracking-widest flex items-center gap-2"><BrainCircuit className="h-4 w-4" /> Assessment Logic</p>
                    <p className="text-xs font-bold text-blue-900/70 uppercase leading-relaxed">Let AI synthesize optimized MCQs based on your subject choice. High-fidelity questions with auto-evaluation nodes. </p>
                    <Button onClick={handleAiAnalyze} className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-[1000] uppercase text-[10px] tracking-widest rounded-2xl shadow-lg shadow-blue-200">Generate AI Test Suite</Button>
                 </div>
                 <div className="flex-1 p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-4">
                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-2"><Users className="h-4 w-4" /> Deployment Sector</p>
                    <div className="grid grid-cols-2 gap-3">
                       <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-white"><p className="text-[8px] font-black text-slate-500 uppercase">Target Year</p><p className="text-sm font-black">Year {selectedYear}</p></div>
                       <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-white"><p className="text-[8px] font-black text-slate-500 uppercase">Department</p><p className="text-sm font-black uppercase">{staff?.department || "AIML"}</p></div>
                    </div>
                    <Button className="w-full h-12 bg-white text-slate-900 font-[1000] uppercase text-[10px] tracking-widest rounded-2xl hover:bg-blue-50">Assign Assessment</Button>
                 </div>
              </div>
            </Card>

            {/* 2. DEPLOYMENT REGISTRY (HISTORY) */}
            <Card className="lg:col-span-7 p-8 rounded-[2.5rem] border-none shadow-sm bg-white">
               <CardTitle className="text-lg font-black uppercase mb-8 flex items-center gap-3"><Clock className="h-5 w-5 text-slate-400" /> Active Examination Registry</CardTitle>
               <div className="space-y-4">
                  {[
                    { id: 1, title: "UNIT 1: RE-TEST", subject: "DSA", students: 12, status: "Active", time: "25m" },
                    { id: 2, title: "MOCK ASSESSMENT 2", subject: "DBMS", students: 45, status: "Assigned", time: "45m" },
                    { id: 3, title: "SEM-2 NEURAL LOGIC", subject: "MATHS", students: 38, status: "Completed", time: "60m" }
                  ].map(t => (
                    <div key={t.id} onClick={() => router.push(`/student/test/${t.id}`)} className="p-5 border border-slate-100 bg-slate-50/50 rounded-3xl flex items-center justify-between group hover:border-blue-400 cursor-pointer transition-all">
                       <div className="flex items-center gap-5">
                          <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center font-black", t.status === 'Completed' ? "bg-slate-200 text-slate-500" : "bg-blue-100 text-blue-600")}>{(t.subject)[0]}</div>
                          <div>
                             <p className="text-base font-black text-slate-900 uppercase leading-none mb-2">{t.title}</p>
                             <div className="flex items-center gap-3">
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{t.subject} Sector</span>
                                <div className="h-1 w-1 rounded-full bg-slate-300" />
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{t.time} Duration</span>
                             </div>
                          </div>
                       </div>
                       <div className="flex items-center gap-6">
                          <div className="text-right">
                             <p className="text-[10px] font-black text-slate-900 uppercase">{t.students} Candidates</p>
                             <span className={cn("px-3 py-1 rounded-full text-[8px] font-black uppercase border mt-1 inline-block", t.status === 'Active' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-slate-100 text-slate-500 border-slate-200")}>{t.status}</span>
                          </div>
                          <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-blue-500" />
                       </div>
                    </div>
                  ))}
               </div>
            </Card>

            {/* 3. EXAMINATION ANALYTICS */}
            <Card className="lg:col-span-5 p-8 rounded-[2.5rem] bg-slate-900 border-none text-white flex flex-col justify-between h-full">
               <div>
                  <CardTitle className="text-lg font-black uppercase mb-8 flex items-center gap-3"><BarChart3 className="h-5 w-5 text-blue-400" /> Exam Intelligence</CardTitle>
                  <div className="space-y-6">
                     <div className="space-y-2">
                        <div className="flex justify-between items-end"><p className="text-[9px] font-black uppercase text-slate-500">Global Pass Rate</p><p className="text-2xl font-[1000]">82.4%</p></div>
                        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-emerald-500" style={{width: '82.4%'}} /></div>
                     </div>
                     <div className="space-y-2">
                        <div className="flex justify-between items-end"><p className="text-[9px] font-black uppercase text-slate-500">Average Node Score</p><p className="text-2xl font-[1000]">74.5</p></div>
                        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-blue-500" style={{width: '74.5%'}} /></div>
                     </div>
                  </div>
               </div>
               
               <div className="mt-10 p-6 bg-white/5 rounded-3xl border border-white/10 flex items-center gap-6">
                  <div className="h-14 w-14 rounded-2xl bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/20"><Trophy className="h-8 w-8 text-white" /></div>
                  <div><p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Topper Prediction</p><p className="text-lg font-black uppercase leading-tight">SYST: HIGHER IN SEM-2 SECTOR</p></div>
               </div>
            </Card>
          </div>
        )}

        {activeModule === 'class-intel' && (
          <Card className="p-8 rounded-3xl border border-slate-200 shadow-sm bg-white">
             <CardHeader className="p-0 border-none mb-6"><CardTitle className="text-lg font-black uppercase flex items-center gap-3"><Trophy className="h-5 w-5 text-yellow-500" /> Tier {selectedYear} Top Performers</CardTitle></CardHeader>
             <div className="space-y-0">
               {activeData.sort((a,b) => b.current_cgpa - a.current_cgpa).slice(0,5).map((s, i) => (
                  <div key={s.id} onClick={() => router.push(`/faculty/student/${s.id}`)} className="p-4 hover:bg-slate-50 transition-all cursor-pointer group flex items-center justify-between border-b border-slate-100 last:border-0">
                    <div className="flex items-center gap-4">
                      <span className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black shadow-lg">#{i + 1}</span>
                      <div className="flex flex-col">
                        <span className="text-sm font-[1000] text-slate-800 uppercase tracking-tight">{s.name || s.full_name || "Student Node"}</span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.roll_number || "Institutional ID"}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-[10px] font-black text-slate-400 uppercase">Current GPA</p>
                        <p className="text-lg font-black text-blue-600">{s.current_cgpa}</p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-blue-600 transition-colors" />
                    </div>
                  </div>
               ))}
             </div>
          </Card>
        )}

      </div>
    </div>
  )
}

function StatCard({ title, value, subValue, icon: Icon, color = "text-slate-900", iconColor = "text-blue-600" }: any) {
  return (
    <Card className="relative overflow-hidden group border border-slate-200 rounded-3xl bg-white shadow-sm h-[180px] flex flex-col justify-between p-6">
      <div className="flex justify-between items-start"><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{title}</p><div className={cn("h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center shadow-sm", iconColor)}><Icon className="h-5 w-5" /></div></div>
      <div className="space-y-1"><div className={cn("text-5xl font-black uppercase tracking-tighter", color)}>{value}</div>{subValue && <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{subValue}</p>}</div>
    </Card>
  )
}
