"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
 User,
 Mail,
 Phone,
 ShieldCheck,
 Camera,
 Save,
 Lock,
 KeyRound,
 Bell,
 Globe,
 FileText,
 BrainCircuit,
 Zap,
 Download,
 LogOut,
 Eye,
 EyeOff,
 Loader2,
 Target,
 Trophy,
 TrendingUp,
 Settings
} from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

export default function StudentProfilePage() {
 const router = useRouter()
 const [student, setStudent] = useState<any>(null)
 const [loading, setLoading] = useState(true)
 const [saving, setSaving] = useState(false)
 const [showPasswords, setShowPasswords] = useState(false)

 // Form states
 const [personalInfo, setPersonalInfo] = useState({
 phone_number: "",
 personal_email: "",
 alternate_email: "",
 location: ""
 })
 const [passwordData, setPasswordData] = useState({
 old_password: "",
 new_password: "",
 confirm_password: ""
 })
 const [notifications, setNotifications] = useState({
 notifications_test: true,
 notifications_placement: true,
 notifications_ai: true
 })

 const getApiUrl = (path: string) => {
 const hostname = typeof window !== 'undefined' ? window.location.hostname : '127.0.0.1';
 return `http://${hostname}:8000${path}`;
 };

 useEffect(() => {
 fetchProfile()
 }, [])

 const fetchProfile = async () => {
 const token = localStorage.getItem('token')
 const headers = { 'Authorization': `Bearer ${token}` }

 try {
 const res = await fetch(getApiUrl("/student/profile"), { headers })
 if (res.ok) {
 const data = await res.json()
 setStudent(data)
 setPersonalInfo({
 phone_number: data.user.phone_number || "",
 personal_email: data.personal_email || "",
 alternate_email: data.alternate_email || "",
 location: data.location || ""
 })
 setNotifications({
 notifications_test: data.notifications_test,
 notifications_placement: data.notifications_placement,
 notifications_ai: data.notifications_ai
 })
 } else if (res.status === 401) {
 router.push("/login")
 }
 } catch (error) {
 console.error("Failed to fetch profile", error)
 } finally {
 setLoading(false)
 }
 }

 const handleUpdateProfile = async () => {
 setSaving(true)
 const token = localStorage.getItem('token')
 const headers = { 
 'Authorization': `Bearer ${token}`,
 'Content-Type': 'application/json'
 }

 try {
 const res = await fetch(getApiUrl("/student/update"), {
 method: "POST",
 headers,
 body: JSON.stringify({
 ...personalInfo,
 ...notifications
 })
 })
 if (res.ok) {
 const updated = await res.json()
 setStudent(updated)
 alert("Profile successfully synchronized with the institutional node.")
 }
 } catch (error) {
 console.error("Update failed", error)
 } finally {
 setSaving(false)
 }
 }

 const handleChangePassword = async (e: React.FormEvent) => {
 e.preventDefault()
 if (passwordData.new_password !== passwordData.confirm_password) {
 alert("Passwords mismatch in confirmation node.")
 return
 }

 setSaving(true)
 const token = localStorage.getItem('token')
 const headers = { 
 'Authorization': `Bearer ${token}`,
 'Content-Type': 'application/json'
 }

 try {
 const res = await fetch(getApiUrl("/student/change-password"), {
 method: "POST",
 headers,
 body: JSON.stringify({
 old_password: passwordData.old_password,
 new_password: passwordData.new_password
 })
 })
 if (res.ok) {
 alert("Security credentials updated. Re-authentication may be required.")
 setPasswordData({ old_password: "", new_password: "", confirm_password: "" })
 } else {
 const err = await res.json()
 alert(`Security Violation: ${err.detail}`)
 }
 } catch (error) {
 console.error("Password change failed", error)
 } finally {
 setSaving(false)
 }
 }

 const handleFileUpload = async (type: 'photo' | 'resume', file: File) => {
 const formData = new FormData()
 formData.append("file", file)
 
 const token = localStorage.getItem('token')
 try {
 const res = await fetch(getApiUrl(`/student/upload?file_type=${type}`), {
 method: "POST",
 headers: { 'Authorization': `Bearer ${token}` },
 body: formData
 })
 if (res.ok) {
 fetchProfile() // Refresh
 alert(`${type.toUpperCase()} successfully uploaded to institutional cloud.`)
 }
 } catch (error) {
 console.error("Upload failed", error)
 }
 }

 if (loading) return (
 <div className="flex h-[80vh] items-center justify-center">
 <Loader2 className="h-24 w-24 animate-spin text-white" />
 </div>
 )

 return (
 <div className="w-full space-y-16 pb-40 text-white selection:bg-blue-500/30">
 {/* Header Hero Section (AMPLIFIED LEGIBILITY) */}
 <motion.div 
 initial={{ opacity: 0, y: 30 }}
 animate={{ opacity: 1, y: 0 }}
 className="relative overflow-hidden rounded-[4rem] bg-black/40 p-16 md:p-24 border-2 border-white/20 shadow-2xl"
 >
 <div className="absolute top-0 right-0 p-12 opacity-5">
 <BrainCircuit className="h-80 w-80 text-white" />
 </div>
 
 <div className="flex flex-col md:flex-row items-center gap-16 relative z-10">
 <div className="relative group">
 <div className={cn(
 "h-56 w-56 rounded-[3.5rem] border-8 flex items-center justify-center overflow-hidden transition-transform",
 student?.gender === "Female" 
 ? "border-rose-500 bg-black/60 shadow-xl" 
 : "border-blue-600 bg-black/60 shadow-xl"
 )}>
 {student?.user.avatar_url ? (
 <img src={`http://127.0.0.1:8000${student.user.avatar_url}`} alt="Profile" className="h-full w-full object-cover" />
 ) : (
 student?.gender === "Female" ? (
 <div className="flex flex-col items-center">
 <User className="h-32 w-32 text-white" />
 <div className="h-2 w-16 bg-rose-500 rounded-full mt-3 shadow-[0_0_15px_rgba(244,63,94,0.6)]" />
 </div>
 ) : (
 <User className="h-32 w-32 text-white" />
 )
 )}
 </div>
 <label className="absolute -bottom-4 -right-4 h-20 w-20 bg-blue-600 hover:bg-white hover:text-blue-600 text-white rounded-3xl flex items-center justify-center shadow-2xl cursor-pointer transition-all border-[8px] border-black/40">
 <Camera className="h-10 w-10" />
 <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFileUpload('photo', e.target.files[0])} />
 </label>
 </div>

 <div className="flex-1 text-center md:text-left space-y-8">
 <h1 className="text-7xl md:text-9xl font-black  uppercase leading-none text-white drop-shadow-2xl">{student?.name}</h1>
 <div className="flex flex-wrap items-center justify-center md:justify-start gap-6">
 <span className="px-8 py-3 bg-black/60 rounded-2xl text-xl font-black uppercase tracking-widest border-2 border-white/20 text-white">ID-NODE: {student?.roll_number}</span>
 <span className="px-8 py-3 bg-blue-600 rounded-2xl text-xl font-black uppercase tracking-widest text-white shadow-xl">{student?.department} NODE</span>
 <span className="px-8 py-3 bg-black/60 text-white rounded-2xl text-xl font-black uppercase tracking-widest border-2 border-white/20">YEAR-0{student?.year} :: SEC-{student?.section || 'A'}</span>
 </div>
 </div>

 <div className="hidden lg:flex flex-col items-end gap-4 pr-12 text-right">
 <p className="text-sm font-black uppercase tracking-[0.4em] text-white">CORE SCORE</p>
 <p className="text-9xl font-black text-white leading-none shadow-[0_0_50px_rgba(255,255,255,0.2)]">{(student?.career_readiness_score || 0).toFixed(0)}<span className="text-4xl ml-2 font-black">%</span></p>
 </div>
 </div>
 </motion.div>

 <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
 {/* Detail Sections (BOLD-WHITE AMPLIFIED) */}
 <div className="lg:col-span-2 space-y-16">
 {/* Identity Matrix */}
 <div className="glass-card overflow-hidden !bg-black/40 !border-white/20">
 <div className="p-16 border-b-2 border-white/10 flex items-center justify-between bg-white/[0.02]">
 <div className="space-y-3">
 <h2 className="text-4xl font-black uppercase  text-white ">Identity Matrix</h2>
 <div className="flex items-center gap-4 text-sm font-black text-white uppercase tracking-[0.3em]">
 <ShieldCheck className="h-6 w-6 text-emerald-500" /> SECURE-ACCESS-STABLE
 </div>
 </div>
 <Button onClick={handleUpdateProfile} disabled={saving} className="premium-button !h-20 !px-12 text-lg !bg-white !text-black hover:!bg-white/90">
 {saving ? <Loader2 className="h-6 w-6 animate-spin" /> : <Save className="h-7 w-7 mr-3" />}
 SYNC NODE
 </Button>
 </div>
 <div className="p-16 grid gap-20 md:grid-cols-2">
 <div className="space-y-16">
 <section className="space-y-8">
 <h4 className="text-base font-black text-white uppercase tracking-[0.4em] flex items-center gap-5 border-b-2 border-blue-600/50 pb-2">
 <User className="h-6 w-6" /> PARENTAL LOG
 </h4>
 <div className="grid gap-8">
 <div className="space-y-4 p-8 rounded-[2.5rem] bg-black/60 border-2 border-white/20 transition-all">
 <div className="flex items-center justify-between">
 <Label className="text-xs uppercase font-black text-white tracking-[0.2em]">FATHER</Label>
 <span className="text-xs font-black text-blue-500">{student?.father_phone || "ABSENT"}</span>
 </div>
 <p className="text-2xl font-black text-white uppercase leading-none">{student?.father_name || "N/A"}</p>
 </div>
 <div className="space-y-4 p-8 rounded-[2.5rem] bg-black/60 border-2 border-white/20 transition-all">
 <div className="flex items-center justify-between">
 <Label className="text-xs uppercase font-black text-white tracking-[0.2em]">MOTHER</Label>
 <span className="text-xs font-black text-blue-500">{student?.mother_phone || "ABSENT"}</span>
 </div>
 <p className="text-2xl font-black text-white uppercase leading-none">{student?.mother_name || "N/A"}</p>
 </div>
 </div>
 </section>

 <section className="space-y-8">
 <h4 className="text-base font-black text-white uppercase tracking-[0.4em] flex items-center gap-5 border-b-2 border-blue-600/50 pb-2">
 <Mail className="h-6 w-6" /> DATA RELAY
 </h4>
 <div className="grid gap-10">
 <div className="space-y-4 p-8 rounded-[2.5rem] bg-blue-600 text-white border-4 border-white/20 shadow-2xl">
 <Label className="text-xs uppercase font-black text-white tracking-[0.2em] opacity-80">INSTITUTIONAL ID</Label>
 <p className="text-xl font-black select-all leading-none">{student?.user.institutional_email}</p>
 </div>
 <div className="space-y-4">
 <Label className="text-sm uppercase font-black text-white tracking-widest ml-2">PERSONAL CLOUD RELAY</Label>
 <input 
 value={personalInfo.personal_email}
 onChange={(e) => setPersonalInfo({...personalInfo, personal_email: e.target.value})}
 className="input-glass w-full !h-20 text-xl font-black !bg-black/60 border-4 border-white/20"
 />
 </div>
 </div>
 </section>
 </div>

 <div className="space-y-16">
 <section className="space-y-8">
 <h4 className="text-base font-black text-white uppercase tracking-[0.4em] flex items-center gap-5 border-b-2 border-blue-600/50 pb-2">
 <Phone className="h-6 w-6" /> COORDS & SYNC
 </h4>
 <div className="grid gap-10">
 <div className="space-y-4">
 <Label className="text-sm uppercase font-black text-white tracking-widest ml-2">SECURE MOBILE</Label>
 <input 
 value={personalInfo.phone_number}
 onChange={(e) => setPersonalInfo({...personalInfo, phone_number: e.target.value})}
 className="input-glass w-full !h-20 text-xl font-black !bg-black/60 border-4 border-white/20"
 />
 </div>
 <div className="space-y-4">
 <Label className="text-sm uppercase font-black text-white tracking-widest ml-2">PHYSICAL COORDINATE</Label>
 <textarea 
 value={personalInfo.location}
 onChange={(e) => setPersonalInfo({...personalInfo, location: e.target.value})}
 className="input-glass w-full !h-40 text-xl font-black !bg-black/60 border-4 border-white/20 py-8"
 />
 </div>
 </div>
 </section>

 <section className="space-y-8">
 <h4 className="text-base font-black text-white uppercase tracking-[0.4em] flex items-center gap-5 border-b-2 border-blue-600/50 pb-2">
 <Globe className="h-6 w-6" /> EXTERNAL ARTIFACTS
 </h4>
 <div className="p-10 rounded-[3rem] bg-indigo-600 text-white border-4 border-white/20 space-y-10 shadow-2xl">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-6">
 <div className="h-16 w-16 bg-white/10 rounded-2xl flex items-center justify-center border-2 border-white/20">
 <FileText className="h-9 w-9 text-white" />
 </div>
 <p className="text-2xl font-black uppercase ">RESUME.OBJ</p>
 </div>
 <label className="h-16 px-10 bg-white text-black hover:bg-white/90 rounded-2xl flex items-center justify-center cursor-pointer transition-all font-black text-sm uppercase tracking-widest shadow-xl">
 {student?.resume_url ? "RESYNC" : "INJECT"}
 <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={(e) => e.target.files?.[0] && handleFileUpload('resume', e.target.files[0])} />
 </label>
 </div>
 {student?.resume_url && (
 <Button variant="outline" size="lg" className="w-full bg-black/40 border-2 border-white/40 text-white font-black text-sm uppercase tracking-widest h-16 hover:bg-black/60 transition-all">
 <Download className="h-5 w-5 mr-4" /> RECALL ARTIFACT
 </Button>
 )}
 </div>
 </section>
 </div>
 </div>
 </div>

 {/* Security Protocol (BOLD WHITE) */}
 <div className="glass-card overflow-hidden !bg-black/60 !border-rose-600/30">
 <div className="p-16 border-b-2 border-white/10 bg-rose-600/10">
 <div className="flex items-center gap-8">
 <div className="h-16 w-16 bg-rose-600 rounded-3xl flex items-center justify-center text-white border-2 border-white/20">
 <Lock className="h-9 w-9" />
 </div>
 <div className="space-y-1">
 <h2 className="text-4xl font-black uppercase  text-white leading-tight">Security Modulation</h2>
 <p className="text-xs font-black text-rose-500 uppercase tracking-[0.5em]">CIPHER-CONTROL-TERMINAL</p>
 </div>
 </div>
 </div>
 <div className="p-16">
 <form onSubmit={handleChangePassword} className="grid md:grid-cols-3 gap-10">
 <div className="space-y-4">
 <Label className="text-sm font-black text-white uppercase tracking-widest ml-1">OLD CIPHER</Label>
 <div className="relative">
 <input 
 type={showPasswords ? "text" : "password"}
 value={passwordData.old_password}
 onChange={(e) => setPasswordData({...passwordData, old_password: e.target.value})}
 className="input-glass w-full !h-20 text-xl font-black !bg-black/60 border-4 border-white/20"
 />
 <button type="button" onClick={() => setShowPasswords(!showPasswords)} className="absolute right-6 top-1/2 -translate-y-1/2 text-white hover:scale-110 transition-transform">
 {showPasswords ? <EyeOff className="h-6 w-6" /> : <Eye className="h-6 w-6" />}
 </button>
 </div>
 </div>
 <div className="space-y-4">
 <Label className="text-sm font-black text-white uppercase tracking-widest ml-1">NEW IDENTITY KEY</Label>
 <input 
 type={showPasswords ? "text" : "password"}
 value={passwordData.new_password}
 onChange={(e) => setPasswordData({...passwordData, new_password: e.target.value})}
 className="input-glass w-full !h-20 text-xl font-black !bg-black/60 border-4 border-white/20"
 />
 </div>
 <div className="flex items-end">
 <Button 
 type="submit"
 disabled={saving} 
 className="w-full bg-rose-600 hover:bg-rose-500 text-white font-black uppercase tracking-widest h-20 rounded-3xl shadow-2xl transition-all active:scale-95 text-lg border-2 border-white/20"
 >
 {saving ? <Loader2 className="h-6 w-6 animate-spin" /> : <KeyRound className="h-7 w-7 mr-4" />}
 INITIALIZE
 </Button>
 </div>
 <div className="md:col-span-2">
 <div className="space-y-4">
 <Label className="text-sm font-black text-white uppercase tracking-widest ml-1">CONFIRM NODE</Label>
 <input 
 type={showPasswords ? "text" : "password"}
 value={passwordData.confirm_password}
 onChange={(e) => setPasswordData({...passwordData, confirm_password: e.target.value})}
 className="input-glass w-full !h-20 text-xl font-black !bg-black/60 border-4 border-white/20"
 />
 </div>
 </div>
 </form>
 </div>
 </div>
 </div>

 {/* Right Analytics (THICK BOLD WHITE) */}
 <div className="space-y-16">
 {/* Performance Cards */}
 <div className="glass-card p-12 space-y-12 !bg-black/60 !border-white/20">
 <h2 className="text-3xl font-black uppercase  text-white flex items-center gap-5 border-b-2 border-blue-600 pb-2">
 <TrendingUp className="h-8 w-8 text-blue-500" /> DATA-DYNAMICS
 </h2>
 
 <div className="space-y-12">
 {[
 { label: "CORE CGPA LOG", value: student?.current_cgpa, max: 10, color: "bg-blue-600" },
 { label: "ATTENDANCE RELAY", value: student?.attendance_percentage, max: 100, color: "bg-emerald-600" },
 { label: "CAREER READINESS", value: student?.career_readiness_score, max: 100, color: "bg-indigo-600" }
 ].map((stat, idx) => (
 <div key={idx} className="space-y-5">
 <div className="flex justify-between items-end">
 <p className="text-xs font-black uppercase tracking-[0.3em] text-white underline underline-offset-8 decoration-blue-600">{stat.label}</p>
 <p className="text-5xl font-black text-white  drop-shadow-lg">{(stat.value || 0).toFixed(2)}</p>
 </div>
 <div className="h-4 w-full bg-black/80 rounded-full border-2 border-white/20 p-1 shadow-inner">
 <motion.div 
 initial={{ width: 0 }}
 animate={{ width: `${(stat.value! / stat.max) * 100}%` }}
 transition={{ duration: 1.5, delay: idx * 0.2 }}
 className={cn("h-full rounded-full transition-all duration-1000 border-r-2 border-white/30", stat.color)}
 />
 </div>
 </div>
 ))}
 </div>

 <div className="pt-12 border-t-2 border-white/10 space-y-8">
 <p className="text-xs font-black text-blue-500 uppercase tracking-[0.4em]">AI-INSIGHT-NODE</p>
 <div className="p-10 rounded-[3rem] bg-black/60 border-2 border-white/20 text-xl font-bold leading-relaxed text-white text-center shadow-inner">
 "{student?.ai_insight || 'SYSTEM IS COMPILING NEURAL TRAJECTORY. STAND BY.'}"
 </div>
 </div>
 </div>

 {/* Skill Delta System */}
 <div className="glass-card p-12 space-y-12 !bg-black/60 !border-white/20">
 <h2 className="text-3xl font-black uppercase  text-white flex items-center gap-5 border-b-2 border-blue-600 pb-2">
 <Target className="h-8 w-8 text-blue-500" /> SKILL DELTA
 </h2>
 
 <div className="space-y-12">
 {[
 { label: 'COMPUTATIONAL', val: student?.coding_score || 72, icon: Zap, color: 'bg-blue-600' },
 { label: 'ANALYTICAL', val: student?.aptitude_score || 65, icon: Target, color: 'bg-emerald-600' },
 { label: 'INSTITUTIONAL', val: student?.communication_score || 88, icon: Trophy, color: 'bg-indigo-600' }
 ].map((skill, i) => (
 <div key={i} className="space-y-5">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-5">
 <skill.icon className="h-7 w-7 text-white shadow-xl" />
 <span className="text-xs font-black text-white uppercase tracking-widest">{skill.label} NODE</span>
 </div>
 <span className="text-2xl font-black text-white underline decoration-white/20 underline-offset-4">{skill.val}%</span>
 </div>
 <div className="h-3 bg-black/80 rounded-full border-2 border-white/20 p-[2px]">
 <motion.div 
 initial={{ width: 0 }}
 animate={{ width: `${skill.val}%` }}
 transition={{ duration: 1.5, delay: i * 0.2 }}
 className={cn("h-full rounded-full border-r-2 border-white/20", skill.color)}
 />
 </div>
 </div>
 ))}
 </div>
 </div>

 {/* Preferences Protocol */}
 <div className="glass-card p-12 space-y-10 !bg-black/60 !border-white/20">
 <h2 className="text-3xl font-black uppercase  text-white flex items-center gap-5 border-b-2 border-blue-600 pb-2">
 <Settings className="h-8 w-8 text-blue-500" /> SYNC PREFS
 </h2>
 
 <div className="space-y-6">
 {[
 { label: "ALERTS RELAY", key: 'notifications_test' },
 { label: "PLACEMENT SYNC", key: 'notifications_placement' },
 { label: "AI MODULATION", key: 'notifications_ai' }
 ].map((item, idx) => (
 <div key={idx} className="flex items-center justify-between p-8 rounded-[2.5rem] bg-black/40 border-2 border-white/10 hover:border-blue-600 transition-all">
 <p className="text-xs font-black text-white uppercase tracking-widest leading-none">{item.label}</p>
 <Switch 
 checked={notifications[item.key as keyof typeof notifications] || false}
 onCheckedChange={(val) => setNotifications({...notifications, [item.key]: val})}
 className="scale-150 data-[state=checked]:bg-blue-600"
 />
 </div>
 ))}
 </div>

 <div className="pt-12 border-t-2 border-white/10 space-y-8">
 <Button 
 onClick={() => { localStorage.removeItem('token'); router.push('/login'); }}
 className="w-full h-20 bg-rose-600 hover:bg-rose-500 text-white font-black uppercase tracking-[0.3em] rounded-3xl transition-all text-sm border-2 border-white/20"
 >
 <LogOut className="h-6 w-6 mr-5" />
 TERMINATE ACCESS
 </Button>
 
 <div className="p-8 rounded-[2.5rem] bg-indigo-600 text-center border-2 border-white/20 shadow-xl">
 <p className="text-[11px] font-black text-white underline uppercase tracking-[0.4em] mb-3 leading-none underline-offset-4">NODE-SYNCHRONY-STAMP</p>
 <p className="text-base font-black text-white uppercase tracking-widest">
 {student?.last_login ? new Date(student.last_login).toLocaleTimeString() : 'STABLE-LINKED'}
 </p>
 </div>
 </div>
 </div>
 </div>
 </div>
 </div>
 )
}
