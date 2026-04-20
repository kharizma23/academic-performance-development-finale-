"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import {
  ArrowLeft,
  GraduationCap,
  Clock,
  Briefcase,
  ShieldCheck,
  BrainCircuit,
  MessageSquare,
  Save,
  CheckCircle2,
  X,
  AlertTriangle,
  TrendingUp
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar
} from 'recharts'

// Demo student profiles keyed by numeric id
const DEMO_STUDENTS: Record<string, any> = {
  "1": { id: "1", name: "KHARIZ",  roll_number: "737622AIML101", department: "AIML", year: 1, current_cgpa: 8.2, attendance_percentage: 85, risk_level: "Low",    coding_score: 82, aptitude_score: 88, communication_score: 78 },
  "2": { id: "2", name: "ARJUN",   roll_number: "737622AIML102", department: "AIML", year: 1, current_cgpa: 6.1, attendance_percentage: 65, risk_level: "High",   coding_score: 60, aptitude_score: 65, communication_score: 70 },
  "3": { id: "3", name: "PRIYA",   roll_number: "737622AIML103", department: "AIML", year: 1, current_cgpa: 7.5, attendance_percentage: 78, risk_level: "Medium", coding_score: 75, aptitude_score: 80, communication_score: 85 },
  "4": { id: "4", name: "SATHISH", roll_number: "737622AIML104", department: "AIML", year: 2, current_cgpa: 9.1, attendance_percentage: 95, risk_level: "Low",    coding_score: 92, aptitude_score: 90, communication_score: 88 },
  "5": { id: "5", name: "MEENA",   roll_number: "737622AIML105", department: "AIML", year: 2, current_cgpa: 5.8, attendance_percentage: 62, risk_level: "High",   coding_score: 55, aptitude_score: 60, communication_score: 65 },
}

export default function StudentDetailView() {
  const { id } = useParams()
  const router = useRouter()
  const [student, setStudent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)
  const [feedbackData, setFeedbackData] = useState<any>({
    detailed_remarks: "",
    ...Object.fromEntries(Array.from({ length: 25 }, (_, i) => [`q${i + 1}`, 5]))
  })

  const getApiUrl = (path: string) => {
    const hostname = typeof window !== 'undefined' ? window.location.hostname : '127.0.0.1'
    return `http://${hostname}:8001${path}`
  }

  useEffect(() => { fetchStudentDetail() }, [id])

  const fetchStudentDetail = async () => {
    setLoading(true)
    const studentId = Array.isArray(id) ? id[0] : (id as string)

    // Immediate demo data for numeric IDs
    if (DEMO_STUDENTS[studentId]) {
      setStudent(DEMO_STUDENTS[studentId])
      setLoading(false)
      return
    }

    const token = localStorage.getItem('token')
    try {
      const res = await fetch(getApiUrl(`/staff/student/${studentId}`), {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        // Ensure name always populated (server sends it, but double-check)
        data.name = data.name || data.user?.full_name || "Unknown Student"
        data.department = data.department || "AIML"
        setStudent(data)
      } else {
        // Fallback shell – still shows the ID so faculty can identify the node
        setStudent({ id: studentId, name: "Unknown Student", roll_number: studentId, department: "—", year: 1, current_cgpa: 0, attendance_percentage: 0, risk_level: "Low", coding_score: 0, aptitude_score: 0, communication_score: 0 })
      }
    } catch (e) {
      setStudent({ id: studentId, name: "Unknown Student", roll_number: studentId, department: "—", year: 1, current_cgpa: 0, attendance_percentage: 0, risk_level: "Low", coding_score: 0, aptitude_score: 0, communication_score: 0 })
    } finally {
      setLoading(false)
    }
  }

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    const studentId = Array.isArray(id) ? id[0] : (id as string)
    const metricNames = [
      "technical_clarity", "problem_solving", "code_efficiency", "algorithm_knowledge", "debugging_skills",
      "concept_application", "mathematical_aptitude", "system_design", "documentation_quality", "test_coverage_awareness",
      "presentation_skills", "collaborative_spirit", "adaptability", "curiosity_level", "deadline_discipline",
      "resourcefulness", "critical_thinking", "puncuality", "peer_mentoring", "leadership_potential",
      "ethical_awareness", "feedback_receptivity", "passion_for_field", "originality_of_ideas", "consistency_index"
    ]
    const payload: any = { student_id: studentId, detailed_remarks: feedbackData.detailed_remarks }
    metricNames.forEach((name, i) => { payload[`q${i + 1}_${name}`] = feedbackData[`q${i + 1}`] })
    try {
      const res = await fetch(getApiUrl("/staff/feedback"), {
        method: "POST",
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (res.ok) { alert("Assessment Published Successfully"); setShowFeedbackModal(false) }
    } catch (e) {}
  }

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-3">
        <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fetching Profile...</p>
      </div>
    </div>
  )

  if (!student) return null

  const metrics = [
    "Technical Clarity", "Problem Solving", "Code Efficiency", "Algorithm Knowledge", "Debugging Skills",
    "Concept Application", "Mathematical Aptitude", "System Design", "Documentation Quality", "Test Coverage Awareness",
    "Presentation Skills", "Collaborative Spirit", "Adaptability", "Curiosity Level", "Deadline Discipline",
    "Resourcefulness", "Critical Thinking", "Punctuality", "Peer Mentoring", "Leadership Potential",
    "Ethical Awareness", "Feedback Receptivity", "Passion for Field", "Originality of Ideas", "Consistency Index"
  ]

  const radarData = [
    { subject: "Tech",  A: student.coding_score      || 70 },
    { subject: "Apt",   A: student.aptitude_score     || 85 },
    { subject: "Comm",  A: student.communication_score|| 80 },
    { subject: "Design",A: 75 },
    { subject: "Logic", A: 90 },
  ]

  const isHighRisk = student.risk_level === "High"
  const isLowAttendance = (student.attendance_percentage || 0) < 75

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 animate-in fade-in duration-500">
      <div className="max-w-[1400px] mx-auto space-y-6">

        {/* ── TOP BAR ─────────────────────────────────────── */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              onClick={() => router.back()}
              variant="ghost"
              className="h-10 px-4 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-white border border-transparent hover:border-slate-200 transition-all group text-[10px] font-black uppercase tracking-widest"
            >
              <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Return to Console
            </Button>
            <Button
              onClick={() => { localStorage.removeItem('token'); router.push('/'); }}
              variant="outline"
              className="h-8 px-4 rounded-xl text-[9px] font-black uppercase border-rose-100 text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition-all"
            >
              Back to Login
            </Button>
          </div>
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
            <ShieldCheck className="h-4 w-4 text-blue-600" />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
              {student.department} Department
            </span>
          </div>
        </div>

        {/* ── HERO: COMPACT ───────────────────────────────── */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Avatar */}
          <div className="h-20 w-20 rounded-2xl bg-blue-50 border-2 border-blue-100 flex items-center justify-center shrink-0 shadow-md">
            <span className="text-3xl font-[1000] text-blue-600 uppercase">{(student.name || "S")[0]}</span>
          </div>

          {/* Identity block */}
          <div className="flex-1 space-y-3 text-center md:text-left">
            <div className="flex items-center gap-3 justify-center md:justify-start flex-wrap">
              <span className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                isHighRisk ? "bg-rose-50 text-rose-600 border-rose-100" : "bg-emerald-50 text-emerald-600 border-emerald-100"
              )}>
                {isHighRisk ? <AlertTriangle className="h-3 w-3" /> : <CheckCircle2 className="h-3 w-3" />}
                {student.risk_level} Risk
              </span>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full">Year {student.year}</span>
              <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-100">{student.department}</span>
            </div>

            {/* ← THE FIX: show real name, never "Student Node" */}
            <h1 className="text-3xl md:text-4xl font-[1000] text-slate-900 uppercase tracking-tight leading-none">
              {student.name}
            </h1>

            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <span className="text-[10px] font-bold text-slate-500 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100 uppercase tracking-widest">
                ID: {student.roll_number}
              </span>
              <span className="text-[10px] font-bold text-slate-500 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100 uppercase tracking-widest">
                CGPA: {student.current_cgpa}
              </span>
              <span className={cn("text-[10px] font-bold px-3 py-1 rounded-lg border uppercase tracking-widest",
                isLowAttendance ? "text-rose-600 bg-rose-50 border-rose-100" : "text-emerald-600 bg-emerald-50 border-emerald-100"
              )}>
                Attendance: {student.attendance_percentage}%
              </span>
            </div>
          </div>

          {/* CTA */}
          <Button
            onClick={() => setShowFeedbackModal(true)}
            className="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-lg shadow-blue-200 self-center shrink-0"
          >
            Assess Student
          </Button>
        </div>

        {/* ── ANALYTICS GRID ──────────────────────────────── */}
        <div className="grid lg:grid-cols-12 gap-6">

          {/* CGPA Trajectory */}
          <Card className="lg:col-span-8 p-6 rounded-3xl border border-slate-200 shadow-sm bg-white">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-base font-black text-slate-900 uppercase tracking-tight mb-1">Performance Trajectory</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">CGPA Delta Index</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-[1000] text-blue-600">{student.current_cgpa}</p>
                <p className="text-[9px] font-black text-slate-300 uppercase">Current GPA</p>
              </div>
            </div>
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={[
                  { name: 'Sem 1', gpa: Math.max(0, (student.current_cgpa || 7) - 0.8) },
                  { name: 'Sem 2', gpa: Math.max(0, (student.current_cgpa || 7) - 0.5) },
                  { name: 'Sem 3', gpa: Math.max(0, (student.current_cgpa || 7) - 0.2) },
                  { name: 'Sem 4', gpa: Math.max(0, (student.current_cgpa || 7) - 0.4) },
                  { name: 'Sem 5', gpa: Math.max(0, (student.current_cgpa || 7) + 0.1) },
                  { name: 'Now',   gpa: student.current_cgpa || 7 },
                ]}>
                  <defs>
                    <linearGradient id="gpaFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}   />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 9, fontWeight: 900 }} />
                  <YAxis domain={[0, 10]} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 9, fontWeight: 900 }} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 16px rgba(0,0,0,0.1)', fontWeight: 900 }} />
                  <Area type="monotone" dataKey="gpa" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#gpaFill)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Capability Radar */}
          <Card className="lg:col-span-4 p-6 rounded-3xl border border-slate-200 bg-slate-900 text-white flex flex-col justify-between">
            <div>
              <h3 className="text-base font-black uppercase tracking-tight">Capability Radar</h3>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">{student.name} — {student.department}</p>
            </div>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 9, fontWeight: 900 }} />
                  <Radar name="Score" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.4} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Attendance */}
          <Card className="lg:col-span-6 p-6 rounded-3xl border border-slate-200 bg-white">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="h-5 w-5 text-amber-500" />
              <h3 className="text-sm font-black uppercase">Attendance | {student.name}</h3>
            </div>
            <div className="flex items-center gap-8">
              <div className="text-center">
                <p className={cn("text-5xl font-[1000]", isLowAttendance ? "text-rose-600" : "text-emerald-600")}>
                  {student.attendance_percentage}%
                </p>
                <p className="text-[9px] font-black text-slate-400 uppercase mt-1">Overall</p>
              </div>
              <div className="flex-1 space-y-4">
                {[
                  { label: "Lab Sessions", val: Math.min(100, (student.attendance_percentage || 0) + 8) },
                  { label: "Lectures", val: student.attendance_percentage || 0 },
                  { label: "Seminars", val: Math.max(0, (student.attendance_percentage || 0) - 6) },
                ].map(row => (
                  <div key={row.label} className="space-y-1">
                    <div className="flex justify-between text-[10px] font-black uppercase text-slate-500">
                      <span>{row.label}</span><span>{row.val}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className={cn("h-full rounded-full", row.val < 75 ? "bg-rose-500" : "bg-emerald-500")} style={{ width: `${row.val}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Career / AI Summary */}
          <Card className="lg:col-span-6 p-6 rounded-3xl bg-gradient-to-br from-blue-700 to-indigo-900 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10"><BrainCircuit className="h-32 w-32" /></div>
            <div className="flex items-center gap-3 mb-4 relative z-10">
              <Briefcase className="h-5 w-5" />
              <h3 className="text-sm font-black uppercase">{student.name} — Career Matrix</h3>
            </div>
            <div className="space-y-4 relative z-10">
              <div className="flex flex-wrap gap-2">
                {["Full Stack Architect", "AI Researcher", "System Engineer"].map(role => (
                  <span key={role} className="bg-white/10 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase border border-white/10">{role}</span>
                ))}
              </div>
              <div className="p-4 bg-black/20 rounded-2xl border border-white/10">
                <p className="text-[9px] font-black text-blue-300 uppercase mb-2">AI Readiness</p>
                <p className="text-[11px] font-bold uppercase leading-relaxed">
                  {student.name} shows {student.current_cgpa >= 7.5 ? "strong" : "developing"} academic velocity (GPA: {student.current_cgpa}).
                  Attendance compliance is {isLowAttendance ? "critical — below threshold." : "within institutional targets."}
                </p>
              </div>
            </div>
          </Card>

        </div>

        {/* ── ASSESSMENT MODAL ─────────────────────────── */}
        {showFeedbackModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <Card className="max-w-5xl w-full max-h-[90vh] flex flex-col rounded-3xl bg-white shadow-2xl overflow-hidden">
              <CardHeader className="p-6 bg-slate-50 border-b flex flex-row items-center justify-between shrink-0">
                <div>
                  <CardTitle className="text-xl font-black uppercase">Assessment Matrix</CardTitle>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{student.name} | {student.roll_number} | {student.department}</p>
                </div>
                <button onClick={() => setShowFeedbackModal(false)} className="h-10 w-10 rounded-xl bg-white hover:bg-rose-50 hover:text-rose-600 flex items-center justify-center border border-slate-200 transition-all">
                  <X className="h-5 w-5" />
                </button>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
                <form onSubmit={handleFeedbackSubmit} className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {metrics.map((metric, index) => (
                      <div key={index} className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 hover:border-blue-300 transition-all">
                        <div className="flex items-center justify-between">
                          <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Q{index + 1}. {metric}</label>
                          <span className="text-base font-black text-blue-600 bg-white px-2.5 py-0.5 rounded-lg border border-blue-50 shadow-sm">{feedbackData[`q${index + 1}`]}</span>
                        </div>
                        <input
                          type="range" min="1" max="10" step="1"
                          className="h-1.5 w-full accent-blue-600 cursor-pointer"
                          value={feedbackData[`q${index + 1}`]}
                          onChange={e => setFeedbackData({ ...feedbackData, [`q${index + 1}`]: parseInt(e.target.value) })}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="pt-4 border-t space-y-3">
                    <label className="text-xs font-black uppercase text-slate-500 flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-blue-600" /> Detailed Remarks
                    </label>
                    <Textarea
                      required
                      className="min-h-[100px] rounded-2xl border-slate-200 bg-slate-50 text-sm font-bold resize-none"
                      placeholder="Describe student performance and areas to improve..."
                      value={feedbackData.detailed_remarks}
                      onChange={e => setFeedbackData({ ...feedbackData, detailed_remarks: e.target.value })}
                    />
                  </div>
                  <Button type="submit" className="w-full h-12 bg-slate-900 hover:bg-black text-white font-black uppercase tracking-widest rounded-2xl">
                    <Save className="h-4 w-4 mr-2" /> Publish Assessment
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

      </div>
    </div>
  )
}
