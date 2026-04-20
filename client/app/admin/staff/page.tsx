"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShieldCheck, ArrowLeft, Filter, Users, Mail, Briefcase, UserPlus } from "lucide-react"
import Link from "next/link"

const departments = [
 "AIML", "AGRI", "EEE", "EIE", "ECE", "BT", "BME",
 "CIVIL", "IT", "MECH", "MECHATRONICS", "CSE", "FT", "FD", "AIDS"
]

export default function StaffPage() {
 const [selectedDept, setSelectedDept] = useState("AIML")
 const [staff, setStaff] = useState<any[]>([])
 const [loading, setLoading] = useState(false)

 const getApiUrl = (path: string) => {
 const hostname = typeof window !== 'undefined' ? window.location.hostname : '127.0.0.1';
 return `http://${hostname}:8000${path}`;
 };

 const fetchStaff = async () => {
 setLoading(true)
 const token = localStorage.getItem('token')
 try {
 const url = getApiUrl(`/admin/staff?department=${selectedDept}`)
 const response = await fetch(url, {
 headers: { 'Authorization': `Bearer ${token}` }
 })
 if (response.ok) {
 const data = await response.json()
 setStaff(Array.isArray(data) ? data : [])
 } else {
 setStaff([])
 }
 } catch (error) {
 console.error("Failed to fetch staff", error)
 setStaff([])
 } finally {
 setLoading(false)
 }
 }

 useEffect(() => {
 fetchStaff()
 }, [selectedDept])

 return (
 <div className="flex min-h-screen w-full flex-col bg-[#F8FAF5] selection:bg-blue-600/30 pb-32">
 {/* Mega Header */}
 <header className="sticky top-0 z-50 flex h-24 items-center gap-6 border-b-2 border-blue-100 bg-white/90 backdrop-blur-md px-12 shadow-sm rounded-b-[2rem]">
 <Link href="/admin">
 <Button variant="outline" size="icon" className="h-14 w-14 shrink-0 border-2 border-blue-100 bg-white hover:bg-blue-50 rounded-2xl transition-all shadow-sm">
 <ArrowLeft className="h-7 w-7 shrink-0 text-blue-600" />
 </Button>
 </Link>
 <div className="h-8 w-px bg-blue-100" />
 <div className="h-14 w-14 shrink-0 rounded-xl bg-blue-50 flex items-center justify-center border-2 border-blue-100 shadow-sm">
 <ShieldCheck className="h-8 w-8 shrink-0 text-blue-600 shrink-0" />
 </div>
 <h1 className="text-3xl font-black tracking-normal text-blue-900 uppercase leading-none">Institutional Control</h1>
 </header>

 <main className="flex-1 p-8 md:p-12 space-y-12 mx-auto w-full">
 <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
 <div className="space-y-4">
 <h2 className="text-6xl font-black tracking-normal text-blue-950 leading-none uppercase">Faculty Directory</h2>
 <p className="text-lg font-black text-blue-400 mt-2 uppercase tracking-[0.4em]">Institutional Professional Matrix Framework</p>
 </div>
 <Link href="/admin/staff/add">
 <Button className="h-16 bg-blue-600 hover:bg-blue-700 text-white font-bold px-10 rounded-2xl shadow-lg flex items-center gap-4 group transition-all text-lg uppercase tracking-widest border-none">
 <UserPlus className="h-10 w-10 shrink-0" />
 Onboard Faculty
 </Button>
 </Link>
 </div>

 {/* Filters */}
 <Card className="border-2 border-blue-100 bg-white rounded-3xl shadow-sm overflow-hidden group">
 <CardHeader className="bg-blue-50 border-b-2 border-blue-100 p-8">
 <CardTitle className="flex items-center gap-6 text-blue-900 text-3xl font-bold tracking-normal uppercase">
 <Filter className="h-8 w-8 shrink-0 text-blue-600" />
 Department Selection
 </CardTitle>
 </CardHeader>
 <CardContent className="p-8">
 <div className="flex flex-wrap gap-4">
 {departments.map(dept => (
 <button
 key={dept}
 onClick={() => setSelectedDept(dept)}
 className={`px-8 py-3 text-sm font-black uppercase tracking-[0.2em] transition-all rounded-xl border-2 ${selectedDept === dept
 ? "bg-blue-600 text-white border-blue-600 shadow-lg scale-105"
 : "bg-white text-blue-400 border-blue-100 hover:border-blue-300 hover:text-blue-600 shadow-sm"
 }`}
 >
 {dept}
 </button>
 ))}
 </div>
 </CardContent>
 </Card>

 {/* Staff List */}
 <div className="space-y-8">
 <div className="flex flex-col sm:flex-row items-baseline justify-between gap-6">
 <h3 className="text-4xl font-black tracking-normal flex items-center gap-6 text-blue-900 uppercase">
 <Users className="h-10 w-10 shrink-0 text-blue-600 shrink-0" />
 {selectedDept} Nodes
 </h3>
 <div className="px-6 py-2 bg-blue-50 border-2 border-blue-100 text-blue-600 text-sm font-black uppercase tracking-widest rounded-full shadow-sm">
 {staff.length} Identified
 </div>
 </div>

 {loading ? (
 <div className="grid gap-[40rem] md:grid-cols-2 lg:grid-cols-3">
 {[1, 2, 3, 4, 5, 6].map(i => (
 <div key={i} className="h-[400px] rounded-3xl bg-blue-50 animate-pulse border border-blue-100 shadow-sm" />
 ))}
 </div>
 ) : (
 <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
 {staff.map((member) => (
 <Link key={member.id} href={`/admin/staff/${member.id}`}>
 <Card className="border-2 border-blue-100 bg-white rounded-3xl shadow-sm hover:border-blue-400 transition-all cursor-pointer h-full group relative overflow-hidden">
 <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100/5 rounded-full blur-2xl -mr-10 -mt-10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
 <CardContent className="p-8 relative z-10">
 <div className="flex items-start justify-between mb-8">
 <div className="h-16 w-16 shrink-0 bg-blue-50 flex items-center justify-center text-blue-900 font-bold text-xl uppercase rounded-2xl border-2 border-blue-100 shadow-sm group-hover:scale-110 transition-transform">
 {(member.name || 'SF').split(' ').map((n: string) => n[0]).join('').substring(0, 2)}
 </div>
 <div className="px-3 py-1 bg-blue-50 border border-blue-200 text-xs font-black text-blue-400 uppercase tracking-widest rounded-lg">
 {member.staff_id}
 </div>
 </div>

 <h4 className="font-black text-3xl text-blue-900 mb-2 uppercase tracking-normal group-hover:text-blue-600 transition-colors leading-none">
 {member.name}
 </h4>
 <p className="text-sm font-black text-blue-400 uppercase tracking-widest mb-6 mt-3 flex items-center gap-4">
 <Briefcase className="h-5 w-5 shrink-0 text-blue-600 shrink-0" strokeWidth={3} /> {member.designation}
 </p>

 <div className="pt-6 border-t border-blue-100 space-y-4">
 <div className="flex items-center gap-4 text-blue-500">
 <Mail className="h-4 w-4 shrink-0 text-blue-400 shrink-0" />
 <span className="text-xs font-bold uppercase truncate">{member.user?.institutional_email || `${member.name.toLowerCase().replace(/\s+/g, '.')}@intel.ac.edu`}</span>
 </div>
 <div className="flex items-center justify-between mt-6 p-4 bg-blue-50 rounded-2xl border border-blue-100 group-hover:bg-white transition-all shadow-sm">
 <div className="flex flex-col">
 <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-300 mb-1">Expertise</span>
 <span className="text-sm font-bold uppercase text-blue-900 ">{member.primary_skill}</span>
 </div>
 <div className="h-10 w-10 shrink-0 bg-white rounded-xl flex items-center justify-center text-blue-600 border border-blue-100 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all">
 <ArrowLeft className="h-5 w-5 shrink-0 rotate-180" />
 </div>
 </div>
 </div>
 </CardContent>
 </Card>
 </Link>
 ))}
 </div>
 )}

 {!loading && staff.length === 0 && (
 <div className="text-center py-24 rounded-[2rem] border-4 border-dashed border-blue-100 bg-white shadow-sm">
 <Users className="h-48 w-48 text-blue-50 mx-auto mb-6 shrink-0" />
 <h3 className="text-4xl font-[1000] text-blue-200 tracking-normal uppercase">No Faculty Nodes Found</h3>
 <p className="text-xs font-bold text-blue-300 mt-2 uppercase tracking-[0.3em]">Institutional database returned null for this specialization</p>
 </div>
 )}
 </div>
 </main>
 </div>
 )
}
