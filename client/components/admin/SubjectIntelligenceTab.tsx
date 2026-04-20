"use client"

import React, { useState, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Target, BookOpen, Users, TrendingUp, AlertTriangle, 
  ArrowLeft, Search, GraduationCap, Zap, 
  Activity, ChevronRight, Hash, Filter, Layers, PlayCircle
} from "lucide-react"
import { 
  ResponsiveContainer, XAxis, YAxis, 
  CartesianGrid, Tooltip, BarChart, Bar, Cell, AreaChart, Area
} from "recharts"
import { cn } from "@/lib/utils"

const subjects = [
  // SEM 1
  { id: 1, name: "Engineering Mathematics I", code: "MA101", semester: 1, avg: 75, pass: 90, difficulty: "Medium", faculty: "Dr. Ramanujan S" },
  { id: 2, name: "Engineering Physics", code: "PH101", semester: 1, avg: 70, pass: 85, difficulty: "Medium", faculty: "Dr. Bose J.C." },
  { id: 3, name: "Basic Electrical Engineering", code: "EE101", semester: 1, avg: 68, pass: 80, difficulty: "High", faculty: "Dr. Tesla N" },
  // SEM 2
  { id: 4, name: "Engineering Mathematics II", code: "MA102", semester: 2, avg: 72, pass: 88, difficulty: "Medium", faculty: "Dr. Ramanujan S" },
  { id: 5, name: "Engineering Chemistry", code: "CY101", semester: 2, avg: 74, pass: 89, difficulty: "Low", faculty: "Dr. Ray P.C." },
  { id: 6, name: "Programming in C", code: "CS101", semester: 2, avg: 78, pass: 92, difficulty: "Medium", faculty: "Dr. Ritchie D" },
  // SEM 3
  { id: 7, name: "Data Structures", code: "CS201", semester: 3, avg: 76, pass: 85, difficulty: "Medium", faculty: "Dr. Knuth D" },
  { id: 8, name: "Digital Logic Design", code: "EC201", semester: 3, avg: 69, pass: 80, difficulty: "High", faculty: "Dr. Boolean G" },
  { id: 9, name: "Object Oriented Programming", code: "CS202", semester: 3, avg: 74, pass: 87, difficulty: "Medium", faculty: "Dr. Stroustrup B" },
  // SEM 4
  { id: 10, name: "Operating Systems", code: "CS301", semester: 4, avg: 68, pass: 78, difficulty: "High", faculty: "Dr. Tanenbaum A" },
  { id: 11, name: "Database Management Systems", code: "CS302", semester: 4, avg: 73, pass: 84, difficulty: "Medium", faculty: "Dr. Codd E" },
  { id: 12, name: "Computer Networks", code: "CS303", semester: 4, avg: 70, pass: 82, difficulty: "Medium", faculty: "Dr. Cerf V" },
  // SEM 5
  { id: 13, name: "Software Engineering", code: "CS401", semester: 5, avg: 77, pass: 88, difficulty: "Low", faculty: "Dr. Royce W" },
  { id: 14, name: "Theory of Computation", code: "CS402", semester: 5, avg: 65, pass: 75, difficulty: "High", faculty: "Dr. Turing A" },
  { id: 15, name: "Web Technologies", code: "CS403", semester: 5, avg: 80, pass: 90, difficulty: "Low", faculty: "Dr. Berners-Lee T" },
  // SEM 6
  { id: 16, name: "Machine Learning", code: "CS501", semester: 6, avg: 72, pass: 83, difficulty: "High", faculty: "Dr. Ng A" },
  { id: 17, name: "Cloud Computing", code: "CS502", semester: 6, avg: 75, pass: 86, difficulty: "Medium", faculty: "Dr. Jassy A" },
  { id: 18, name: "Compiler Design", code: "CS503", semester: 6, avg: 66, pass: 78, difficulty: "High", faculty: "Dr. Aho A" },
  // SEM 7
  { id: 19, name: "Artificial Intelligence", code: "CS601", semester: 7, avg: 78, pass: 89, difficulty: "Medium", faculty: "Dr. Hinton G" },
  { id: 20, name: "Big Data Analytics", code: "CS602", semester: 7, avg: 74, pass: 85, difficulty: "Medium", faculty: "Dr. Dean J" },
  { id: 21, name: "Cyber Security", code: "CS603", semester: 7, avg: 71, pass: 82, difficulty: "Medium", faculty: "Dr. Mitnick K" },
  // SEM 8
  { id: 22, name: "Project Work", code: "CS701", semester: 8, avg: 85, pass: 95, difficulty: "Low", faculty: "Dr. Coordinator C" },
  { id: 23, name: "Internship", code: "CS702", semester: 8, avg: 88, pass: 96, difficulty: "Low", faculty: "Dr. Industry I" }
];

export default function SubjectIntelligenceTab() {
  const [selectedSem, setSelectedSem] = useState<number | 'ALL'>('ALL')
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSubject, setSelectedSubject] = useState<any | null>(null)

  const filteredSubjects = useMemo(() => {
    return subjects.filter(s => {
      const semMatch = selectedSem === 'ALL' || s.semester === selectedSem
      const searchMatch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.code.toLowerCase().includes(searchQuery.toLowerCase())
      return semMatch && searchMatch
    })
  }, [selectedSem, searchQuery])

  const getAIInsight = (avg: number) => {
    if (avg < 70) return { label: "Needs Intervention", style: "bg-rose-600", detail: "High Risk Subject: Core concepts require tactical remediation." }
    if (avg > 80) return { label: "Excellent", style: "bg-emerald-600", detail: "Strong Subject: Cognitive velocity is significantly higher." }
    return { label: "Stable", style: "bg-blue-600", detail: "Consistent learning curve detected within standard deviation." }
  }

  if (selectedSubject) {
    const insight = getAIInsight(selectedSubject.avg)
    return (
      <div className="space-y-6 animate-in fade-in duration-700 pb-10">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 bg-white p-6 rounded-xl border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="flex items-center gap-6 relative z-10">
            <Button variant="outline" size="sm" onClick={() => setSelectedSubject(null)} className="h-8 w-8 p-0 rounded-lg">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="px-2 py-0.5 bg-blue-600 text-white text-[10px] font-bold rounded uppercase tracking-tighter">
                  {selectedSubject.code}
                </span>
                <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded border border-blue-100 uppercase tracking-tighter">
                  Sem {selectedSubject.semester}
                </span>
              </div>
              <h2 className="text-xl font-black text-slate-900 uppercase leading-none tracking-tight">
                {selectedSubject.name}
              </h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                Faculty: {selectedSubject.faculty}
              </p>
            </div>
          </div>
          <div className={cn("px-4 py-2 rounded-lg text-white shadow-sm flex items-center gap-3", insight.style)}>
            <Zap className="h-4 w-4 animate-pulse" />
            <div className="text-right">
              <p className="text-[8px] font-bold uppercase tracking-widest leading-none opacity-80 mb-1">Diagnostic</p>
              <p className="text-sm font-black uppercase leading-none">{insight.label}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <Card className="lg:col-span-8 border border-slate-200 bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-xs font-bold text-slate-900 uppercase mb-4">Performance Metrics</h3>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { name: 'AVERAGE', value: selectedSubject.avg, color: '#2563EB' },
                  { name: 'PASS %', value: selectedSubject.pass, color: '#10B981' },
                  { name: 'DIFFICULTY', value: selectedSubject.difficulty === 'High' ? 85 : selectedSubject.difficulty === 'Medium' ? 50 : 25, color: '#F59E0B' }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }} dy={10} />
                  <YAxis hide domain={[0, 100]} />
                  <Tooltip contentStyle={{ fontSize: '10px', borderRadius: '8px' }} cursor={{ fill: '#f8fafc' }} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={60}>
                    {[1,2,3].map((_, index) => <Cell key={index} fill={['#2563EB', '#10B981', '#F59E0B'][index]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="lg:col-span-4 bg-slate-900 text-white rounded-xl p-6 shadow-md relative overflow-hidden">
            <div className="relative z-10 space-y-6">
              <div className="h-10 w-10 rounded-lg bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center">
                <Target className="h-5 w-5 text-blue-200" />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-tight">Strategic Insight</h3>
              <p className="text-[10px] font-semibold text-slate-300 uppercase leading-relaxed">
                {insight.detail}
              </p>
              <div className="pt-6 border-t border-white/10">
                <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mb-3">Resources</p>
                <div className="p-3 bg-white/5 rounded-lg flex items-center gap-3 hover:bg-white/10 cursor-pointer transition-all border border-white/5">
                  <PlayCircle className="h-5 w-5 text-blue-400" />
                  <p className="text-[10px] font-bold text-white uppercase italic">Topic Masterclass</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-10">
      <div className="flex flex-col sm:flex-row items-stretch gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input 
            type="text"
            placeholder="Search Subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-lg bg-white border border-slate-200 outline-none focus:border-blue-600 text-xs font-bold text-slate-900 placeholder:text-slate-300 uppercase"
          />
        </div>
        <div className="flex items-center gap-2 bg-white px-3 h-10 rounded-lg border border-slate-200">
          <Filter className="h-3.5 w-3.5 text-slate-400" />
          <select 
            value={selectedSem}
            onChange={(e) => setSelectedSem(e.target.value === 'ALL' ? 'ALL' : parseInt(e.target.value))}
            className="bg-transparent border-none outline-none text-[10px] font-bold text-slate-900 uppercase tracking-widest cursor-pointer"
          >
            <option value="ALL">All Semesters</option>
            {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Sem {s}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Matrix Width", val: subjects.length, icon: Layers, sub: "Total Subjects" },
          { label: "Performance", val: "73.2%", icon: Activity, sub: "Institutional Avg" },
          { label: "Risk Nodes", val: subjects.filter(s => s.avg < 70).length, icon: AlertTriangle, sub: "Immediate Action" },
          { label: "Grad Forecast", val: "94%", icon: GraduationCap, sub: "Estimated Completion" }
        ].map((kpi, i) => (
          <Card key={i} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between hover:border-blue-200 transition-all">
            <div>
              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1">{kpi.label}</p>
              <p className="text-xl font-black text-slate-900 uppercase leading-none">{kpi.val}</p>
              <p className="text-[8px] font-bold text-slate-300 uppercase tracking-tight mt-1 truncate">{kpi.sub}</p>
            </div>
            <div className="h-9 w-9 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
              <kpi.icon className="h-5 w-5" />
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSubjects.map((s) => (
          <Card 
            key={s.id} 
            onClick={() => setSelectedSubject(s)}
            className="p-5 rounded-xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-9 w-9 rounded-lg bg-slate-900 text-white flex items-center justify-center font-black text-xs">
                  {s.code.substring(0, 2)}
                </div>
                <div className="text-right">
                   <p className="text-[8px] font-bold text-slate-300 uppercase mb-0.5">Sem {s.semester}</p>
                   <p className="text-[8px] font-black text-slate-900 uppercase bg-slate-100 px-2 py-0.5 rounded tracking-tighter">{s.code}</p>
                </div>
              </div>
              <h4 className="text-sm font-black text-slate-900 uppercase truncate leading-tight">
                {s.name}
              </h4>
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-50">
                <div>
                  <p className="text-[8px] font-bold text-slate-400 uppercase mb-0.5">Aggregate</p>
                  <p className="text-lg font-black text-slate-900 leading-none">{s.avg}%</p>
                </div>
                <div>
                  <p className="text-[8px] font-bold text-slate-400 uppercase mb-0.5">Pass Index</p>
                  <p className="text-lg font-black text-emerald-600 leading-none">{s.pass}%</p>
                </div>
              </div>
            </div>
            <Button size="sm" variant="ghost" className="w-full mt-4 h-8 text-[10px] font-bold uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all">
              Hub <ChevronRight className="h-3 w-3 ml-2" />
            </Button>
          </Card>
        ))}
      </div>
    </div>
  )
}
