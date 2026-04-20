"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
 ArrowLeft,
 UserPlus,
 Save,
 Mail,
 Phone,
 Calendar,
 Droplets,
 School,
 CheckCircle2
} from "lucide-react"
import Link from "next/link"

const departments = [
 "AIML", "AGRI", "EEE", "EIE", "ECE", "BT", "BME",
 "CIVIL", "IT", "MECH", "MECHATRONICS", "CSE", "FT", "FD", "AIDS"
]

export default function AddStudentPage() {
 const router = useRouter()
 const [loading, setLoading] = useState(false)
 const [success, setSuccess] = useState(false)

 const getApiUrl = (path: string) => {
 const hostname = typeof window !== 'undefined' ? window.location.hostname : '127.0.0.1';
 return `http://${hostname}:8000${path}`;
 };

 const [formData, setFormData] = useState({
 full_name: "",
 department: "AIML",
 year: 1,
 dob: "",
 blood_group: "O+",
 parent_phone: "",
 personal_phone: "",
 personal_email: "",
 previous_school: ""
 })

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault()
 setLoading(true)
 const token = localStorage.getItem('token')
 try {
 const response = await fetch(getApiUrl("/admin/students"), {
 method: "POST",
 headers: {
 "Content-Type": "application/json",
 "Authorization": `Bearer ${token}`
 },
 body: JSON.stringify(formData)
 })
 if (response.ok) {
 setSuccess(true)
 setTimeout(() => {
 router.push("/admin/students")
 }, 2000)
 }
 } catch (error) {
 console.error("Failed to add student", error)
 } finally {
 setLoading(false)
 }
 }

 // Auto-generate email preview logic
 const batch = { 1: "25", 2: "24", 3: "23", 4: "22" }[formData.year as 1 | 2 | 3 | 4] || "25"
 const firstName = formData.full_name.trim().split(' ')[0].toLowerCase() || "name"
 const previewEmail = `${firstName}.${formData.department.toLowerCase()}${batch}@gmail.com`

 if (success) {
 return (
 <div className="flex min-h-screen w-full items-center justify-center bg-[#F8FAF5] p-6">
 <Card className="max-w-md w-full border border-blue-200 bg-white rounded-3xl p-12 text-center space-y-8 shadow-xl">
 <div className="h-24 w-24 shrink-0 bg-blue-100 text-blue-600 flex items-center justify-center mx-auto rounded-2xl border border-blue-200">
 <CheckCircle2 className="h-12 w-12 shrink-0" />
 </div>
 <div>
 <h2 className="text-4xl font-black text-blue-900 uppercase tracking-normal">Enrolled</h2>
 <p className="text-blue-500 font-black uppercase text-xs tracking-widest mt-4">Record added to {formData.department} directory.</p>
 </div>
 <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100 flex items-center gap-4 justify-center">
 <Mail className="h-6 w-6 shrink-0 text-blue-600" />
 <span className="text-sm font-black text-blue-700 uppercase tracking-widest">{previewEmail}</span>
 </div>
 </Card>
 </div>
 )
 }

 return (
 <div className="flex min-h-screen w-full flex-col bg-[#F8FAF5]">
 {/* Header */}
 <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-blue-100 bg-white/80 backdrop-blur-md px-8">
 <div className="flex items-center gap-6">
 <Link href="/admin/students">
 <Button variant="ghost" size="icon" className="rounded-xl border border-blue-100 h-12 w-12 hover:bg-blue-50 text-blue-600">
 <ArrowLeft className="h-6 w-6 shrink-0" />
 </Button>
 </Link>
 <div className="flex items-center gap-4">
 <div className="h-10 w-10 shrink-0 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-900/20">
 <UserPlus className="h-5 w-5 shrink-0 text-white" />
 </div>
 <h1 className="text-2xl font-black tracking-normal text-blue-900 uppercase">Manual Enrollment</h1>
 </div>
 </div>
 </header>

 <main className="flex-1 p-8 md:p-12 max-w-5xl mx-auto w-full">
 <form onSubmit={handleSubmit} className="space-y-8">
 <div className="space-y-2 mb-12">
 <h2 className="text-6xl font-black tracking-normal text-blue-900 uppercase leading-none">Student Identity</h2>
 <p className="text-sm font-black text-blue-400 mt-2 uppercase tracking-[0.3em]">Institutional Intelligence Node Registry</p>
 </div>

 <Card className="bg-white border border-blue-200 rounded-3xl shadow-sm overflow-hidden">
 <CardContent className="p-8 md:p-12 grid gap-12 md:grid-cols-2">
 {/* Personal Info */}
 <div className="space-y-8">
 <h3 className="text-xs font-black text-blue-400 uppercase tracking-[0.2em] border-b border-blue-100 pb-4">Personal Profile</h3>
 <div className="space-y-6">
 <div className="space-y-3">
 <Label className="text-[10px] font-black uppercase tracking-widest text-blue-500 ml-1">Full Name</Label>
 <Input
 required
 className="rounded-2xl border-blue-200 focus:border-blue-400 focus:ring-blue-100 h-14 text-xl font-bold uppercase placeholder:text-blue-200 bg-blue-50/30"
 placeholder="Ex: Ashwin Kumar"
 value={formData.full_name}
 onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
 />
 </div>
 <div className="space-y-3">
 <Label className="text-[10px] font-black uppercase tracking-widest text-blue-500 ml-1">Personal Email</Label>
 <Input
 required
 type="email"
 className="rounded-2xl border-blue-200 focus:border-blue-400 focus:ring-blue-100 h-14 text-xl font-bold uppercase placeholder:text-blue-200 bg-blue-50/30"
 placeholder="personal@gmail.com"
 value={formData.personal_email}
 onChange={(e) => setFormData({ ...formData, personal_email: e.target.value })}
 />
 </div>
 <div className="grid grid-cols-2 gap-6">
 <div className="space-y-3">
 <Label className="text-[10px] font-black uppercase tracking-widest text-blue-500 ml-1">Date of Birth</Label>
 <div className="relative">
 <Calendar className="absolute left-4 top-4 h-5 w-5 text-blue-400" />
 <Input
 required
 type="date"
 className="pl-12 rounded-2xl border-blue-200 h-14 text-sm font-black uppercase bg-blue-50/30"
 value={formData.dob}
 onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
 />
 </div>
 </div>
 <div className="space-y-3">
 <Label className="text-[10px] font-black uppercase tracking-widest text-blue-500 ml-1">Blood Group</Label>
 <div className="relative">
 <Droplets className="absolute left-4 top-4 h-5 w-5 text-blue-400" />
 <select
 className="w-full pl-12 h-14 border border-blue-200 bg-blue-50/30 text-sm font-black uppercase focus:ring-blue-400 rounded-2xl outline-none appearance-none"
 value={formData.blood_group}
 onChange={(e) => setFormData({ ...formData, blood_group: e.target.value })}
 >
 {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(bg => (
 <option key={bg} value={bg}>{bg}</option>
 ))}
 </select>
 </div>
 </div>
 </div>
 </div>
 </div>

 {/* Academic & Contact */}
 <div className="space-y-8">
 <h3 className="text-xs font-black text-blue-400 uppercase tracking-[0.2em] border-b border-blue-100 pb-4">Academic & Contact</h3>
 <div className="space-y-6">
 <div className="grid grid-cols-2 gap-6">
 <div className="space-y-3">
 <Label className="text-[10px] font-black uppercase tracking-widest text-blue-500 ml-1">Department</Label>
 <select
 className="w-full h-14 rounded-2xl border border-blue-200 bg-blue-50/30 text-sm font-black uppercase focus:ring-blue-400 outline-none px-4 appearance-none"
 value={formData.department}
 onChange={(e) => setFormData({ ...formData, department: e.target.value })}
 >
 {departments.map(d => (
 <option key={d} value={d}>{d}</option>
 ))}
 </select>
 </div>
 <div className="space-y-3">
 <Label className="text-[10px] font-black uppercase tracking-widest text-blue-500 ml-1">Year</Label>
 <select
 className="w-full h-14 rounded-2xl border border-blue-200 bg-blue-50/30 text-sm font-black uppercase focus:ring-blue-400 outline-none px-4 appearance-none"
 value={formData.year}
 onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
 >
 {[1, 2, 3, 4].map(y => (
 <option key={y} value={y}>{y} Year</option>
 ))}
 </select>
 </div>
 </div>
 <div className="space-y-3">
 <Label className="text-[10px] font-black uppercase tracking-widest text-blue-500 ml-1">Previous School</Label>
 <div className="relative">
 <School className="absolute left-4 top-4 h-5 w-5 text-blue-400" />
 <Input
 className="pl-12 rounded-2xl border-blue-200 h-14 text-sm font-black uppercase bg-blue-50/30"
 placeholder="Ex: KVS Matriculation"
 value={formData.previous_school}
 onChange={(e) => setFormData({ ...formData, previous_school: e.target.value })}
 />
 </div>
 </div>
 <div className="grid grid-cols-2 gap-6">
 <div className="space-y-3">
 <Label className="text-[10px] font-black uppercase tracking-widest text-blue-500 ml-1">Student Phone</Label>
 <div className="relative">
 <Phone className="absolute left-4 top-4 h-5 w-5 text-blue-400" />
 <Input
 required
 maxLength={10}
 pattern="[0-9]{10}"
 className="pl-12 rounded-2xl border-blue-200 h-14 text-sm font-black uppercase bg-blue-50/30"
 placeholder="10-digit number"
 value={formData.personal_phone}
 onChange={(e) => setFormData({ ...formData, personal_phone: e.target.value })}
 />
 </div>
 </div>
 <div className="space-y-3">
 <Label className="text-[10px] font-black uppercase tracking-widest text-blue-500 ml-1">Parent Phone</Label>
 <div className="relative">
 <Phone className="absolute left-4 top-4 h-5 w-5 text-blue-400" />
 <Input
 required
 maxLength={10}
 pattern="[0-9]{10}"
 className="pl-12 rounded-2xl border-blue-200 h-14 text-sm font-black uppercase bg-blue-50/30"
 placeholder="10-digit number"
 value={formData.parent_phone}
 onChange={(e) => setFormData({ ...formData, parent_phone: e.target.value })}
 />
 </div>
 </div>
 </div>
 </div>
 </div>
 </CardContent>
 </Card>

 {/* Email Preview & Action */}
 <Card className="bg-white border border-blue-200 flex flex-col md:flex-row items-center justify-between p-8 gap-8 rounded-3xl shadow-sm">
 <div className="flex items-center gap-6">
 <div className="h-16 w-16 shrink-0 bg-blue-100 rounded-2xl flex items-center justify-center border border-blue-200">
 <Mail className="h-8 w-8 shrink-0 text-blue-600" />
 </div>
 <div>
 <p className="text-[10px] font-black uppercase tracking-widest text-blue-400">Institutional Email Identity</p>
 <p className="text-2xl font-black tracking-normal uppercase text-blue-900">{previewEmail}</p>
 </div>
 </div>
 <Button
 disabled={loading || !formData.full_name}
 className="bg-blue-600 hover:bg-blue-700 text-white font-black h-16 px-12 rounded-2xl shadow-lg shadow-blue-900/20 transition-all flex items-center gap-4 group text-xl uppercase tracking-widest outline-none border-none"
 >
 {loading ? (
 <div className="h-6 w-6 shrink-0 border-4 border-white/20 border-t-white rounded-full animate-spin" />
 ) : (
 <Save className="h-6 w-6 shrink-0 group-hover:scale-110 transition-transform" />
 )}
 Enroll Student
 </Button>
 </Card>
 </form>
 </main>
 </div>
 )
}
