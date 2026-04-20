"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
 Users,
 TrendingUp,
 AlertTriangle,
 Search,
 Filter,
 ChevronRight,
 GraduationCap,
 MessageSquare,
 Save,
 CheckCircle2,
 X
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function FacultyDashboard() {
 const [error, setError] = useState<string | null>(null)

 const getApiUrl = (path: string) => {
 const hostname = typeof window !== 'undefined' ? window.location.hostname : '127.0.0.1';
 return `http://${hostname}:8000${path}`;
 };

 const [staff, setStaff] = useState<any>(null)
 const [students, setStudents] = useState<any[]>([])
 const [selectedYear, setSelectedYear] = useState(1)
 const [loading, setLoading] = useState(true)
 const [showFeedbackModal, setShowFeedbackModal] = useState(false)
 const [selectedStudent, setSelectedStudent] = useState<any>(null)
 const [evaluatedStudentIds, setEvaluatedStudentIds] = useState<string[]>([])
 const [feedbackData, setFeedbackData] = useState<any>({
 detailed_remarks: "",
 ...Object.fromEntries(Array.from({ length: 25 }, (_, i) => [`q${i + 1}`, 5]))
 })

 useEffect(() => {
 fetchStaffProfile()
 }, [])

 useEffect(() => {
 if (staff) {
 fetchStudents()
 }
 }, [staff, selectedYear])

 const fetchStaffProfile = async () => {
 const token = localStorage.getItem('token')
 try {
 const response = await fetch(getApiUrl("/staff/my-profile"), {
 headers: { 'Authorization': `Bearer ${token}` }
 })
 if (response.ok) {
 setStaff(await response.json())
 }
 } catch (error) {
 console.error("Failed to fetch staff profile", error)
 }
 }

 const fetchStudents = async () => {
 setLoading(true)
 const token = localStorage.getItem('token')
 try {
 const response = await fetch(getApiUrl(`/staff/students?year=${selectedYear}`), {
 headers: { 'Authorization': `Bearer ${token}` }
 })
 if (response.ok) {
 setStudents(await response.json())
 }

 const evaluatedResponse = await fetch(getApiUrl(`/staff/evaluated-students?year=${selectedYear}`), {
 headers: { 'Authorization': `Bearer ${token}` }
 })
 if (evaluatedResponse.ok) {
 setEvaluatedStudentIds(await evaluatedResponse.json())
 }
 } catch (error) {
 console.error("Failed to fetch students or evaluated list", error)
 } finally {
 setLoading(false)
 }
 }

 const handleFeedbackSubmit = async (e: React.FormEvent) => {
 e.preventDefault()
 const token = localStorage.getItem('token')

 // Map q1 to q1_technical_clarity etc in the backend format
 const metricNames = [
 "technical_clarity", "problem_solving", "code_efficiency", "algorithm_knowledge", "debugging_skills",
 "concept_application", "mathematical_aptitude", "system_design", "documentation_quality", "test_coverage_awareness",
 "presentation_skills", "collaborative_spirit", "adaptability", "curiosity_level", "deadline_discipline",
 "resourcefulness", "critical_thinking", "puncuality", "peer_mentoring", "leadership_potential",
 "ethical_awareness", "feedback_receptivity", "passion_for_field", "originality_of_ideas", "consistency_index"
 ]

 const payload: any = {
 student_id: selectedStudent.id,
 detailed_remarks: feedbackData.detailed_remarks
 }

 metricNames.forEach((name, i) => {
 payload[`q${i + 1}_${name}`] = feedbackData[`q${i + 1}`]
 })

 try {
 const response = await fetch(getApiUrl("/staff/feedback"), {
 method: "POST",
 headers: {
 'Authorization': `Bearer ${token}`,
 'Content-Type': 'application/json'
 },
 body: JSON.stringify(payload)
 })
 if (response.ok) {
 setShowFeedbackModal(false)
 setEvaluatedStudentIds([...evaluatedStudentIds, selectedStudent.id])
 setSelectedStudent(null)
 // Reset form
 setFeedbackData({
 detailed_remarks: "",
 ...Object.fromEntries(Array.from({ length: 25 }, (_, i) => [`q${i + 1}`, 5]))
 })
 }
 } catch (error) {
 console.error("Feedback submission failed", error)
 }
 }

 const metrics = [
 "Technical Clarity", "Problem Solving", "Code Efficiency", "Algorithm Knowledge", "Debugging Skills",
 "Concept Application", "Mathematical Aptitude", "System Design", "Documentation Quality", "Test Coverage Awareness",
 "Presentation Skills", "Collaborative Spirit", "Adaptability", "Curiosity Level", "Deadline Discipline",
 "Resourcefulness", "Critical Thinking", "Punctuality", "Peer Mentoring", "Leadership Potential",
 "Ethical Awareness", "Feedback Receptivity", "Passion for Field", "Originality of Ideas", "Consistency Index"
 ]

 return (
 <div className="flex flex-col gap-8 animate-in pb-20 w-full max-w-none mx-auto p-6 md:p-8 min-h-screen">
 {/* Header Section */}
 <div className="flex flex-col md:flex-row md:items-end justify-between gap-16 pb-12 border-b-8 border-blue-50/50 group">
 <div className="space-y-6">
 <div className="inline-flex items-center gap-4 px-6 py-2 rounded-full bg-blue-50 border-2 border-blue-100 text-blue-700 text-xs font-black tracking-[0.3em] uppercase shadow-inner">
 <GraduationCap className="h-5 w-5" /> Institutional Command Node
 </div>
 <h1 className="text-9xl lg:text-[10rem] font-[1000]  text-blue-950 uppercase leading-[0.8] drop-shadow-2xl">
 Faculty <span className="text-blue-600">Console</span>
 </h1>
 <div className="flex items-center gap-10 mt-12 bg-white/50 p-8 rounded-[3rem] border-4 border-slate-50 shadow-inner w-fit">
 <p className="text-blue-700 font-[1000] text-3xl flex items-center gap-10 ">
 <span className="bg-blue-600 text-white px-12 py-5 rounded-2xl font-[1000] text-lg uppercase tracking-[0.3em] shadow-2xl">Sector: {staff?.department}</span>
 <span className="bg-slate-900 text-slate-100 px-12 py-5 rounded-2xl font-[1000] text-lg uppercase tracking-[0.3em] shadow-2xl">{students.length} Records SYNCED</span>
 </p>
 </div>
 </div>
 <div className="flex bg-slate-100 p-4 rounded-[3rem] gap-6 border-4 border-white shadow-[inset_0_5px_15px_rgba(0,0,0,0.05)] mb-10">
 {[1, 2, 3, 4].map((year) => (
 <button
 key={year}
 onClick={() => setSelectedYear(year)}
 className={cn(
 "px-12 py-6 text-2xl font-[1000] rounded-[1.5rem] transition-all uppercase ",
 selectedYear === year ? "bg-white text-blue-600 shadow-2xl scale-110 border-2 border-blue-50" : "text-slate-400 hover:text-blue-900"
 )}
 >
 Tier {year}
 </button>
 ))}
 </div>
 </div>

 {/* Quick Stats */}
 <div className="grid gap-12 md:grid-cols-3 mt-8">
 <StatCard
 title="Total Scoped Students"
 value={students.length}
 icon={Users}
 subValue={`ACTIVE NEURAL COHORT: ${staff?.department}`}
 iconColor="text-blue-600"
 />
 <StatCard
 title="Avg Dept Performance"
 value="7.82"
 icon={TrendingUp}
 subValue="UPWARD TRAJECTORY: +0.12 SEM-DELTA"
 color="text-blue-950"
 iconColor="text-emerald-600"
 />
 <StatCard
 title="Pending Assessments"
 value={Math.max(0, students.length - evaluatedStudentIds.length)}
 icon={AlertTriangle}
 subValue="CRITICAL: EVALUATIONS REQUIRED"
 color="text-rose-600"
 iconColor="text-amber-600"
 />
 </div>

 {/* Student Directory Table-like View */}
 <Card className="neon-card overflow-hidden border border-blue-200 rounded-[2rem] bg-white shadow-sm">
 <CardHeader className="p-6 lg:p-8 border-b border-blue-100 bg-blue-50">
 <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
 <div className="space-y-2">
 <CardTitle className="text-4xl font-[1000] tracking-normal text-blue-900 uppercase ">Student Registry</CardTitle>
 <CardDescription className="text-lg font-black text-blue-400 uppercase tracking-[0.3em] ">Multidimensional Performance Assessment Matrix</CardDescription>
 </div>
 <div className="relative w-full lg:w-[300px]">
 <div className="relative flex items-center bg-white border border-blue-200 rounded-xl px-4 h-10 w-full shadow-sm focus-within:border-blue-400 transition-all">
 <Search className="h-4 w-4 shrink-0 text-blue-400 mr-2" />
 <Input placeholder="Filter records..." className="bg-transparent border-none text-sm font-bold text-blue-900 placeholder:text-blue-200 focus-visible:ring-0 p-0 h-full w-full uppercase " />
 </div>
 </div>
 </div>
 </CardHeader>
 <CardContent className="p-0">
 <div className="divide-y divide-blue-100">
 {loading ? (
 <div className="p-8 text-center">
 <div className="h-16 w-16 shrink-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
 <p className="text-blue-500 font-bold uppercase tracking-widest text-xs">Fetching Directory...</p>
 </div>
 ) : (
 students.map((student) => (
 <div
 key={student.id}
 className="p-8 hover:bg-blue-50/50 transition-all flex flex-col md:flex-row md:items-center justify-between group"
 >
 <div className="flex items-center gap-8">
 <div className="h-12 w-12 shrink-0 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-700 font-black text-xl border border-blue-200 shadow-sm">
 {student.name.charAt(0)}
 </div>
 <div className="space-y-1">
 <p className="text-xl font-black text-blue-900  uppercase">{student.name}</p>
 <div className="flex items-center gap-6">
 <span className="text-xs font-black text-blue-500 bg-blue-50 px-4 py-2 rounded-xl border-2 border-blue-100 uppercase tracking-widest">
 ID: {student.roll_number}
 </span>
 <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl border-2 border-emerald-100 uppercase tracking-widest">
 GPA: {student.current_cgpa}
 </span>
 </div>
 </div>
 </div>
 <div className="flex items-center gap-6 mt-6 md:mt-0">
 <div className="hidden lg:block text-right">
 <p className={cn(
 "text-[10px] font-black px-3 py-1 rounded-lg border uppercase tracking-widest",
 student.risk_level === "High" ? "bg-rose-50 text-rose-600 border-rose-100" : "bg-blue-50 text-blue-600 border-blue-100"
 )}>
 Risk: {student.risk_level}
 </p>
 </div>
 {evaluatedStudentIds.includes(student.id) ? (
 <Button
 disabled
 className="h-12 px-6 bg-emerald-50 text-emerald-600 font-black text-sm uppercase tracking-widest rounded-2xl border border-emerald-100"
 >
 <CheckCircle2 className="mr-2 h-5 w-5" />
 Evaluated
 </Button>
 ) : (
 <Button
 onClick={() => {
 setSelectedStudent(student)
 setShowFeedbackModal(true)
 }}
 className="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm uppercase tracking-widest rounded-2xl transition-all border-none shadow-lg shadow-blue-900/10"
 >
 Assess Node
 <ChevronRight className="ml-2 h-5 w-5 shrink-0" />
 </Button>
 )}
 </div>
 </div>
 ))
 )}
 {!loading && students.length === 0 && (
 <div className="p-6 text-center space-y-4">
 <div className="h-16 w-16 shrink-0 rounded-2xl bg-blue-100 border border-blue-200 flex items-center justify-center mx-auto">
 <Users className="h-8 w-8 shrink-0 text-blue-300" />
 </div>
 <p className="text-sm font-black text-blue-400 uppercase tracking-widest">No Student Nodes Found</p>
 </div>
 )}
 </div>
 </CardContent>
 </Card>

 {/* Feedback Modal (25 Questions) */}
 {showFeedbackModal && selectedStudent && (
 <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-900/40 backdrop-blur-md p-6">
 <Card className="max-w-6xl w-full max-h-[90vh] flex flex-col border border-blue-200 rounded-[3rem] bg-white shadow-2xl overflow-hidden">
 <CardHeader className="p-8 bg-blue-50 border-b border-blue-100 flex flex-row items-center justify-between shrink-0">
 <div className="flex items-center gap-6">
 <div className="h-16 w-16 shrink-0 rounded-2xl bg-white flex items-center justify-center border border-blue-200 shadow-sm">
 <GraduationCap className="h-8 w-8 shrink-0 text-blue-600" />
 </div>
 <div className="space-y-1">
 <CardTitle className="text-3xl font-black tracking-normal text-blue-900 uppercase">Assessment Matrix</CardTitle>
 <CardDescription className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">{selectedStudent.name} | {selectedStudent.roll_number}</CardDescription>
 </div>
 </div>
 <button onClick={() => setShowFeedbackModal(false)} className="h-12 w-12 shrink-0 rounded-xl bg-white hover:bg-rose-50 hover:text-rose-600 flex items-center justify-center transition-all border border-blue-200">
 <X className="h-6 w-6 shrink-0" />
 </button>
 </CardHeader>
 <CardContent className="flex-1 overflow-y-auto p-8 space-y-8 bg-white custom-scrollbar">
 <form onSubmit={handleFeedbackSubmit} className="space-y-8">
 <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
 {metrics.map((metric, index) => (
 <div key={index} className="space-y-4 bg-blue-50/50 p-6 rounded-3xl border border-blue-100 hover:border-blue-300 transition-all group">
 <div className="flex items-center justify-between">
 <label className="text-[10px] font-black uppercase tracking-widest text-blue-500">
 Q{index + 1}. {metric}
 </label>
 <span className="text-xl font-black text-blue-900 bg-white px-3 py-1 rounded-lg border border-blue-200 shadow-sm">{feedbackData[`q${index + 1}`]}</span>
 </div>
 <input
 type="range"
 min="1"
 max="10"
 step="1"
 className="h-1.5 w-full appearance-none bg-blue-200 rounded-full outline-none accent-blue-600 cursor-pointer"
 value={feedbackData[`q${index + 1}`]}
 onChange={(e) => setFeedbackData({ ...feedbackData, [`q${index + 1}`]: parseInt(e.target.value) })}
 />
 </div>
 ))}
 </div>

 <div className="space-y-4 pt-8 border-t border-blue-100">
 <label className="text-xs font-black text-blue-900 uppercase tracking-[0.2em] flex items-center gap-3">
 <MessageSquare className="h-4 w-4 shrink-0 text-blue-600" />
 Detailed Remarks / AI Training Data
 </label>
 <Textarea
 required
 className="border-blue-200 bg-blue-50/30 p-6 min-h-[120px] focus:ring-blue-100 focus:border-blue-400 text-lg font-bold text-blue-900 placeholder:text-blue-200 rounded-3xl resize-none transition-all outline-none"
 placeholder="Discuss primary vectors..."
 value={feedbackData.detailed_remarks}
 onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFeedbackData({ ...feedbackData, detailed_remarks: e.target.value })}
 />
 </div>

 <div className="p-8 rounded-[2.5rem] bg-blue-900 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
 <div className="text-left space-y-1">
 <p className="text-xl font-black uppercase tracking-normal">System Impact</p>
 <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Instant Insight synchronization.</p>
 </div>
 <Button type="submit" className="h-16 px-12 bg-white hover:bg-blue-50 text-blue-900 font-black text-lg uppercase tracking-widest rounded-2xl transition-all border-none shadow-lg w-full md:w-auto">
 <Save className="h-6 w-6 shrink-0 mr-3" />
 Publish Evaluation
 </Button>
 </div>
 </form>
 </CardContent>
 </Card>
 </div>
 )}
 </div>
 )
}

function StatCard({ title, value, subValue, icon: Icon, color = "text-blue-950", iconColor = "text-blue-600" }: any) {
 return (
 <Card className="neon-card relative overflow-hidden group border-4 border-slate-50 rounded-[3.5rem] bg-white shadow-2xl transition-all duration-700 hover:shadow-[0_60px_120px_rgba(0,0,0,0.12)] hover:-translate-y-4 hover:border-blue-200 h-[400px] flex flex-col justify-between">
 <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-8 pt-12 px-12 relative z-10">
 <CardTitle className="text-xs font-black tracking-[0.4em] text-slate-400 uppercase opacity-60 flex items-center gap-4">
 <div className="h-2 w-2 rounded-full bg-slate-300" /> {title}
 </CardTitle>
 <div className="h-20 w-20 shrink-0 rounded-[1.5rem] bg-slate-50 border-2 border-slate-100 flex items-center justify-center shadow-2xl group-hover:bg-white transition-all duration-700 group-hover:rotate-12 transform">
 <Icon className={cn("h-10 w-10", iconColor)} />
 </div>
 </CardHeader>
 <CardContent className="px-12 pb-12 relative z-10">
 <div className={cn("text-[8rem] lg:text-[9rem] font-[1000]  mb-4 uppercase drop-shadow-2xl", color)}>{value}</div>
 {subValue && (
 <div className="flex items-center gap-4">
 <div className="h-2 w-12 bg-blue-100 rounded-full overflow-hidden">
 <div className="h-full bg-blue-600 animate-shimmer" style={{width: '60%'}} />
 </div>
 <p className="text-[10px] text-blue-500 font-black uppercase tracking-[0.3em] ">{subValue}</p>
 </div>
 )}
 </CardContent>
 </Card>
 )
}
