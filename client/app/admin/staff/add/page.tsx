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
 Briefcase,
 GraduationCap,
 Brain,
 CheckCircle2
} from "lucide-react"
import Link from "next/link"

const departments = [
 "AIML", "AGRI", "EEE", "EIE", "ECE", "BT", "BME",
 "CIVIL", "IT", "MECH", "MECHATRONICS", "CSE", "FT", "FD", "AIDS"
]

const designations = [
 "Assistant Professor", "Associate Professor", "Professor", "Head of Department"
]

export default function AddStaffPage() {
 const router = useRouter()
 const [loading, setLoading] = useState(false)

 const getApiUrl = (path: string) => {
 const hostname = typeof window !== 'undefined' ? window.location.hostname : '127.0.0.1';
 return `http://${hostname}:8000${path}`;
 };

 const [success, setSuccess] = useState(false)
 const [formData, setFormData] = useState({
 full_name: "",
 department: "AIML",
 designation: "Assistant Professor",
 be_degree: "",
 be_college: "",
 me_degree: "",
 me_college: "",
 primary_skill: "",
 personal_email: "",
 personal_phone: ""
 })

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault()
 setLoading(true)
 const token = localStorage.getItem('token')
 try {
 const response = await fetch(getApiUrl("/admin/staff"), {
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
 router.push("/admin/staff")
 }, 2000)
 }
 } catch (error) {
 console.error("Failed to add staff", error)
 } finally {
 setLoading(false)
 }
 }

 const firstName = formData.full_name.split(' ')[0] || "name"
 const previewEmail = `${firstName.toLowerCase()}${formData.department.toLowerCase()}777@gmail.com`

 if (success) {
 return (
 <div className="flex min-h-screen w-full items-center justify-center bg-[#F8FAF5] p-6">
 <Card className="max-w-md w-full border border-blue-200 bg-white rounded-3xl p-12 text-center space-y-8 shadow-xl">
 <div className="h-24 w-24 shrink-0 bg-blue-100 text-blue-600 flex items-center justify-center mx-auto rounded-2xl border border-blue-200">
 <CheckCircle2 className="h-12 w-12 shrink-0" />
 </div>
 <div>
 <h2 className="text-4xl font-black text-blue-900 uppercase tracking-normal">Success</h2>
 <p className="text-blue-500 font-black uppercase text-xs tracking-widest mt-4">Professional profile added to the registry.</p>
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
 <Link href="/admin/staff">
 <Button variant="ghost" size="icon" className="rounded-xl border border-blue-100 h-12 w-12 hover:bg-blue-50 text-blue-600">
 <ArrowLeft className="h-6 w-6 shrink-0" />
 </Button>
 </Link>
 <div className="flex items-center gap-4">
 <div className="h-10 w-10 shrink-0 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-900/20">
 <Briefcase className="h-5 w-5 shrink-0 text-white" />
 </div>
 <h1 className="text-2xl font-black tracking-normal text-blue-900 uppercase">Faculty Onboarding</h1>
 </div>
 </div>
 </header>

 <main className="flex-1 p-8 md:p-12 max-w-6xl mx-auto w-full">
 <form onSubmit={handleSubmit} className="space-y-8">
 <div className="space-y-2 mb-12">
 <h2 className="text-6xl font-black tracking-normal text-blue-900 uppercase leading-none">Professional Profile</h2>
 <p className="text-sm font-black text-blue-400 mt-2 uppercase tracking-[0.3em]">Institutional Faculty Matrix Entry Node</p>
 </div>

 <div className="grid gap-8 md:grid-cols-2">
 {/* Column 1: Identity & Contact */}
 <Card className="bg-white border border-blue-200 rounded-3xl shadow-sm p-8 flex flex-col h-full">
 <div className="space-y-8 flex-1">
 <h3 className="text-xs font-black text-blue-400 uppercase tracking-[0.2em] border-b border-blue-100 pb-4">Core Identity</h3>
 <div className="space-y-6">
 <div className="space-y-3 pt-4">
 <Label className="text-[10px] font-black uppercase tracking-widest text-blue-500 ml-1">Full Name</Label>
 <Input
 required
 className="rounded-2xl border-blue-200 focus:border-blue-400 focus:ring-blue-100 h-14 text-xl font-bold uppercase placeholder:text-blue-200 bg-blue-50/30"
 placeholder="Dr. Ashwin Kumar"
 value={formData.full_name}
 onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
 />
 </div>
 <div className="grid grid-cols-2 gap-6">
 <div className="space-y-3">
 <Label className="text-[10px] font-black uppercase tracking-widest text-blue-500 ml-1">Department</Label>
 <select
 className="w-full h-14 border border-blue-200 bg-blue-50/30 text-sm font-black uppercase focus:ring-blue-400 rounded-2xl outline-none px-4 appearance-none"
 value={formData.department}
 onChange={(e) => setFormData({ ...formData, department: e.target.value })}
 >
 {departments.map(d => (
 <option key={d} value={d}>{d}</option>
 ))}
 </select>
 </div>
 <div className="space-y-3">
 <Label className="text-[10px] font-black uppercase tracking-widest text-blue-500 ml-1">Designation</Label>
 <select
 className="w-full h-14 border border-blue-200 bg-blue-50/30 text-sm font-black uppercase focus:ring-blue-400 rounded-2xl outline-none px-4 appearance-none"
 value={formData.designation}
 onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
 >
 {designations.map(d => (
 <option key={d} value={d}>{d}</option>
 ))}
 </select>
 </div>
 </div>
 <div className="space-y-3">
 <Label className="text-[10px] font-black uppercase tracking-widest text-blue-500 ml-1">Personal Email</Label>
 <Input
 required
 type="email"
 className="rounded-2xl border-blue-200 h-14 text-sm font-black uppercase bg-blue-50/30"
 placeholder="ashwin@gmail.com"
 value={formData.personal_email}
 onChange={(e) => setFormData({ ...formData, personal_email: e.target.value })}
 />
 </div>
 <div className="space-y-3">
 <Label className="text-[10px] font-black uppercase tracking-widest text-blue-500 ml-1">Phone Number</Label>
 <div className="relative">
 <Phone className="absolute left-4 top-4 h-5 w-5 text-blue-400" />
 <Input
 className="pl-12 rounded-2xl border-blue-200 h-14 text-sm font-black uppercase bg-blue-50/30"
 placeholder="+91 98765 43210"
 value={formData.personal_phone}
 onChange={(e) => setFormData({ ...formData, personal_phone: e.target.value })}
 />
 </div>
 </div>
 </div>
 </div>
 </Card>

 {/* Column 2: Education & Skills */}
 <div className="flex flex-col gap-8 h-full">
 <Card className="bg-white border border-blue-200 rounded-3xl shadow-sm p-8 flex-1">
 <h3 className="text-xs font-black text-blue-400 uppercase tracking-[0.2em] border-b border-blue-100 pb-4 mb-8">Expertise & Education</h3>
 <div className="space-y-6">
 <div className="space-y-3">
 <Label className="text-[10px] font-black uppercase tracking-widest text-blue-500 ml-1">Primary Skill / Research Field</Label>
 <div className="relative">
 <Brain className="absolute left-4 top-4 h-5 w-5 text-blue-400" />
 <Input
 className="pl-12 rounded-2xl border-blue-200 h-14 text-sm font-black uppercase bg-blue-50/30"
 placeholder="Ex: Neural Networks"
 value={formData.primary_skill}
 onChange={(e) => setFormData({ ...formData, primary_skill: e.target.value })}
 />
 </div>
 </div>
 <div className="grid grid-cols-2 gap-6">
 <div className="space-y-3">
 <Label className="text-[10px] font-black uppercase tracking-widest text-blue-500 ml-1">B.E. Degree</Label>
 <Input
 className="rounded-2xl border-blue-200 h-14 text-sm font-black uppercase bg-blue-50/30"
 placeholder="Ex: B.E. CSE"
 value={formData.be_degree}
 onChange={(e) => setFormData({ ...formData, be_degree: e.target.value })}
 />
 </div>
 <div className="space-y-3">
 <Label className="text-[10px] font-black uppercase tracking-widest text-blue-500 ml-1">Undergrad College</Label>
 <Input
 className="rounded-2xl border-blue-200 h-14 text-sm font-black uppercase bg-blue-50/30"
 placeholder="IIT Madras"
 value={formData.be_college}
 onChange={(e) => setFormData({ ...formData, be_college: e.target.value })}
 />
 </div>
 </div>
 <div className="grid grid-cols-2 gap-6">
 <div className="space-y-3">
 <Label className="text-[10px] font-black uppercase tracking-widest text-blue-500 ml-1">M.E. / PhD Degree</Label>
 <Input
 className="rounded-2xl border-blue-200 h-14 text-sm font-black uppercase bg-blue-50/30"
 placeholder="Ex: M.E. AI"
 value={formData.me_degree}
 onChange={(e) => setFormData({ ...formData, me_degree: e.target.value })}
 />
 </div>
 <div className="space-y-3">
 <Label className="text-[10px] font-black uppercase tracking-widest text-blue-500 ml-1">Grad School</Label>
 <Input
 className="rounded-2xl border-blue-200 h-14 text-sm font-black uppercase bg-blue-50/30"
 placeholder="Stanford University"
 value={formData.me_college}
 onChange={(e) => setFormData({ ...formData, me_college: e.target.value })}
 />
 </div>
 </div>
 </div>
 </Card>

 <Card className="bg-blue-900 border border-blue-800 text-white p-8 flex flex-col md:flex-row items-center justify-between gap-8 rounded-3xl shadow-xl">
 <div className="flex items-center gap-6">
 <div className="h-16 w-16 shrink-0 bg-blue-800 rounded-2xl flex items-center justify-center border border-blue-700">
 <Mail className="h-8 w-8 shrink-0 text-blue-100" />
 </div>
 <div>
 <p className="text-[10px] font-black uppercase tracking-widest text-blue-400">Institutional Identity</p>
 <p className="text-2xl font-black tracking-normal uppercase">{previewEmail}</p>
 </div>
 </div>
 <Button
 disabled={loading || !formData.full_name}
 className="bg-white hover:bg-blue-50 text-blue-900 font-black h-16 px-12 rounded-2xl shadow-lg transition-all flex items-center gap-4 group text-xl uppercase tracking-widest border-none"
 >
 {loading ? (
 <div className="h-6 w-6 shrink-0 border-4 border-blue-900/20 border-t-blue-900 rounded-full animate-spin" />
 ) : (
 <Save className="h-6 w-6 shrink-0 group-hover:scale-110 transition-transform" />
 )}
 Enroll Faculty
 </Button>
 </Card>
 </div>
 </div>
 </form>
 </main>
 </div>
 )
}
