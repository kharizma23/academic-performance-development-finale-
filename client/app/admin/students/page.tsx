"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShieldCheck, ArrowLeft, Filter, Search, GraduationCap, UserPlus, LogOut } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

const departments = [
 "AIML", "AGRI", "EEE", "EIE", "ECE", "BT", "BME",
 "CIVIL", "IT", "MECH", "MECHATRONICS", "CSE", "FT", "FD", "AIDS"
]

const years = [
 { id: 1, label: "1st Year", batch: "2025-2029" },
 { id: 2, label: "2nd Year", batch: "2024-2028" },
 { id: 3, label: "3rd Year", batch: "2023-2027" },
 { id: 4, label: "4th Year", batch: "2022-2026" },
]

export default function StudentsPage() {
 const router = useRouter()
 const [selectedDept, setSelectedDept] = useState("AIML")
 const [selectedYear, setSelectedYear] = useState(1)
 const [students, setStudents] = useState<any[]>([])
 const [loading, setLoading] = useState(false)

 const getApiUrl = (path: string) => {
 const hostname = typeof window !== 'undefined' ? window.location.hostname : '127.0.0.1';
 return `http://${hostname}:8000${path}`;
 };

 const fetchStudents = async () => {
 setLoading(true)
 const token = localStorage.getItem('token')
 try {
 const url = getApiUrl(`/admin/students?department=${selectedDept}&year=${selectedYear}`)
 const response = await fetch(url, {
 headers: { 'Authorization': `Bearer ${token}` }
 })
 if (response.ok) {
 const data = await response.json()
 setStudents(data)
 }
 } catch (error) {
 console.error("Failed to fetch students", error)
 } finally {
 setLoading(false)
 }
 }

 useEffect(() => {
 fetchStudents()
 }, [selectedDept, selectedYear])

 return (
 <div className="flex min-h-screen w-full flex-col bg-[#F8FAF5] selection:bg-blue-600/30 pb-32">
 {/* Header */}
 <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b-2 border-blue-100 bg-white/90 backdrop-blur-md px-6 shadow-sm rounded-b-[1.5rem]">
 <div className="flex items-center gap-6">
 <Link href="/admin">
 <Button variant="outline" size="icon" className="h-10 w-10 shrink-0 border-2 border-blue-100 bg-white hover:bg-blue-50 rounded-xl transition-all shadow-sm">
 <ArrowLeft className="h-5 w-5 shrink-0 text-blue-600" />
 </Button>
 </Link>
 <div className="h-10 w-10 shrink-0 rounded-xl bg-blue-50 flex items-center justify-center border-2 border-blue-100 shadow-sm">
 <GraduationCap className="h-6 w-6 shrink-0 text-blue-600" />
 </div>
 <h1 className="text-xl font-black tracking-normal text-blue-900 uppercase leading-none">Student Management</h1>
 </div>
 <Button
 onClick={() => {
 localStorage.removeItem('token')
 router.push('/')
 }}
 variant="outline"
 className="h-10 border-rose-500/20 bg-rose-500/10 hover:bg-rose-500/20 transition-all text-rose-400 px-4 rounded-xl font-bold uppercase tracking-widest text-xs"
 >
 <LogOut className="h-4 w-4 shrink-0 mr-2" />
 Terminate Session
 </Button>
 </header>

 <main className="flex-1 p-8 md:p-12 space-y-12 mx-auto w-full">
 <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
 <div className="space-y-2">
 <h2 className="text-4xl font-black tracking-normal text-blue-950 uppercase leading-none">Student Management</h2>
 <p className="text-sm font-black text-blue-400 mt-1 uppercase tracking-[0.4em]">Institutional Academic Record Matrix Framework</p>
 </div>
 <Link href="/admin/students/add">
 <Button className="h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 rounded-xl shadow-lg flex items-center gap-3 transition-all uppercase tracking-widest text-sm border-none">
 <UserPlus className="h-5 w-5 shrink-0" />
 Enroll Student
 </Button>
 </Link>
 </div>

 {/* Filters */}
 <Card className="border-2 border-blue-100 bg-white rounded-3xl shadow-sm overflow-hidden group">
 <div className="bg-blue-50 border-b-2 border-blue-100 p-8 flex items-center gap-6">
 <div className="h-14 w-14 shrink-0 rounded-2xl bg-white flex items-center justify-center text-blue-600 border-2 border-blue-100 shadow-sm">
 <Filter className="h-8 w-8 shrink-0" />
 </div>
 <CardTitle className="text-3xl font-black text-blue-900 tracking-normal uppercase">Selection Filter System</CardTitle>
 </div>
 <CardContent className="p-8 grid gap-8 md:grid-cols-2">
 <div className="space-y-4">
 <label className="text-xs font-bold uppercase tracking-widest text-blue-500">Department Node</label>
 <select
 value={selectedDept}
 onChange={(e) => setSelectedDept(e.target.value)}
 className="w-full flex h-14 rounded-2xl border-2 border-blue-100 bg-white px-8 text-xl font-black text-blue-900 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all uppercase shadow-sm cursor-pointer"
 >
 {departments.map(dept => (
 <option key={dept} value={dept}>{dept}</option>
 ))}
 </select>
 </div>
 <div className="space-y-4">
 <label className="text-xs font-bold uppercase tracking-widest text-blue-500">Academic Hierarchy</label>
 <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
 {years.map(year => (
 <button
 key={year.id}
 onClick={() => setSelectedYear(year.id)}
 className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all duration-300 ${selectedYear === year.id
 ? "border-blue-600 bg-blue-600 text-white shadow-lg"
 : "border-blue-100 bg-white text-blue-400 hover:border-blue-300 hover:text-blue-600 shadow-sm"
 }`}
 >
 <span className="text-[14px] font-[1000] uppercase">{year.label}</span>
 <span className="text-[12px] font-bold opacity-70 mt-1">{year.batch}</span>
 </button>
 ))}
 </div>
 </div>
 </CardContent>
 </Card>

 {/* Student List */}
 <div className="space-y-8">
 <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
 <h3 className="text-2xl font-black tracking-normal flex items-center gap-4 text-blue-900 uppercase">
 <div className="h-10 w-10 shrink-0 rounded-xl bg-white flex items-center justify-center text-blue-600 border-2 border-blue-100 shadow-sm">
 <GraduationCap className="h-5 w-5 shrink-0" />
 </div>
 {selectedDept} Nodes <span className="text-blue-200 text-xl tracking-[0.2em] font-light">/</span> {years.find(y => y.id === selectedYear)?.label}
 </h3>
 <div className="px-6 py-2 bg-blue-50 border-2 border-blue-100 text-blue-600 text-sm font-black uppercase tracking-[0.2em] rounded-full shadow-sm">
 {students.length} Records Identified
 </div>
 </div>

 {loading ? (
 <div className="grid gap-28 md:grid-cols-2 lg:grid-cols-3">
 {[1, 2, 3, 4, 5, 6].map(i => (
 <div key={i} className="h-80 rounded-3xl bg-blue-50 animate-pulse border border-blue-100" />
 ))}
 </div>
 ) : (
 <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
 {students.map((student) => (
 <Link key={student.id} href={`/admin/students/${student.id}`}>
 <Card className="border-2 border-blue-100 bg-white rounded-3xl shadow-sm hover:border-blue-400 transition-all cursor-pointer group h-full relative overflow-hidden">
 <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl -mr-10 -mt-10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
 <CardContent className="p-8 relative z-10 flex flex-col h-full">
 <div className="flex items-start justify-between mb-8">
 <div className="h-16 w-16 shrink-0 bg-blue-50 flex items-center justify-center font-bold text-xl text-blue-900 rounded-2xl border-2 border-blue-100 shadow-sm group-hover:scale-110 transition-transform">
 {(student.name || 'ST').split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
 </div>
 <div className="text-right flex flex-col items-end">
 <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Avg CGPA</div>
 <div className="text-2xl font-[1000] text-blue-900 tracking-normal leading-none group-hover:text-blue-600 transition-colors">{(student.current_cgpa || 0).toFixed(2)}</div>
 </div>
 </div>

 <div className="mt-auto pt-6 border-t border-blue-100 space-y-6">
 <h4 className="font-black text-xl text-blue-900 uppercase tracking-normal truncate w-full leading-none group-hover:text-blue-600 transition-colors">{student.name}</h4>
 <div className="flex flex-wrap items-center gap-4">
 <span className="px-3 py-1.5 bg-blue-50 text-xs font-black text-blue-500 tracking-widest uppercase rounded-lg border border-blue-100 shadow-sm">
 #{student.roll_number}
 </span>
 <span className="px-3 py-1.5 bg-emerald-50 border border-emerald-100 text-xs font-black text-emerald-600 uppercase tracking-widest rounded-lg shadow-sm">
 {student.department}
 </span>
 </div>
 </div>
 </CardContent>
 </Card>
 </Link>
 ))}
 </div>
 )}

 {!loading && students.length === 0 && (
 <div className="text-center py-24 rounded-[2rem] border-4 border-dashed border-blue-100 bg-white shadow-sm">
 <GraduationCap className="h-48 w-48 shrink-0 text-blue-100 mx-auto mb-6" />
 <h3 className="text-4xl font-[1000] text-blue-300 tracking-normal uppercase">No Intelligence Nodes Found</h3>
 <p className="text-xs font-bold text-blue-400 mt-2 uppercase tracking-[0.3em]">Institutional database returned null for this sector</p>
 </div>
 )}
 </div>
 </main>
 </div>
 )
}
