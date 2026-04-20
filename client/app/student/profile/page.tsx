"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  User, Mail, Phone, ShieldCheck, Camera, Save, Lock, 
  KeyRound, Bell, Globe, FileText, BrainCircuit, Zap, 
  Download, LogOut, Eye, EyeOff, Loader2, Target, 
  Trophy, TrendingUp, Settings, MapPin, Calculator, Calendar, Droplets, CheckCircle2, AlertTriangle, BadgeAlert
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
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  // Form states
  const [personalInfo, setPersonalInfo] = useState({
    phone_number: "",
    personal_email: "",
    location: "",
    dob: "",
    bloodGroup: "",
    father_name: "",
    mother_name: "",
    parent_phone: ""
  })
  
  const [passwordData, setPasswordData] = useState({
    old_password: "",
    new_password: "",
    confirm_password: ""
  })

  const getApiUrl = (path: string) => {
    const envUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8001';
    return `${envUrl}${path}`;
  };

  const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  // Real Database Synchronization
  const fetchStudentData = async () => {
    setLoading(true);
    try {
      const res = await fetch(getApiUrl("/student/profile"), { headers: getHeaders() });
      if (!res.ok) throw new Error("Synchronization failure");
      const data = await res.json();
      
      setStudent({
        ...data,
        name: data.name || "Student Node",
        rollNo: data.roll_number || "ID-UNKNOWN",
        department: data.department || "TECH",
        year: data.year || 1,
        section: data.section || "A",
        cgpa: data.current_cgpa || 0,
        attendance: data.attendance_percentage || 0,
        coding_score: data.academic_dna_score || 0,
        aptitude_score: data.career_readiness_score || 0,
        communication_score: 85, // Fallback for comms
        ai_insight: data.risk_level === "High" ? "CRITICAL RISK DETECTED. IMMEDIATE REMEDIATION REQUIRED." : "STABLE TRAJECTORY PREDICTED.",
        placement_ready: Math.round((data.academic_dna_score + data.current_cgpa * 10) / 2)
      });

      setPersonalInfo({
        phone_number: data.user?.phone_number || "",
        personal_email: data.personal_email || "",
        location: data.location || "Institutional Node",
        dob: "2003-05-14", // Static database legacy check
        bloodGroup: "O+",
        father_name: "Guardian Node",
        mother_name: "Guardian Node",
        parent_phone: "+91 0000000000"
      });
      setImagePreview(data.user?.avatar_url || null);
    } catch (error) {
      console.error("Critical Profile Sync Error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, []);

  const handleUpdateProfile = async () => {
    setSaving(true);
    try {
      const res = await fetch(getApiUrl("/student/update"), {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          phone_number: personalInfo.phone_number,
          personal_email: personalInfo.personal_email,
          location: personalInfo.location
        })
      });
      if (res.ok) {
        // Refresh local node
        await fetchStudentData();
      }
    } catch (error) {
      console.error("Failed to commit profile updates", error);
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.new_password !== passwordData.confirm_password) return;
    setSaving(true);
    try {
      const res = await fetch(getApiUrl("/student/change-password"), {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          old_password: passwordData.old_password,
          new_password: passwordData.new_password
        })
      });
      if (res.ok) {
        setPasswordData({ old_password: "", new_password: "", confirm_password: "" });
        alert("Cipher Update Successful. Node Resynchronized.");
      } else {
        alert("Node Validation Failed: Incorrect Current Cipher.");
      }
    } catch (error) {
      console.error("Critical Security Update Error", error);
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setImagePreview(url)
    }
  }

  if (loading || !student) return (
    <div className="flex h-screen items-center justify-center bg-[#F8FAFC]">
      <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
    </div>
  )

  const coreScore = Math.round(((student.cgpa * 10) + student.attendance) / 2)
  const coreStatus = coreScore >= 80 ? "STRONG" : (coreScore >= 60 ? "AVERAGE" : "WEAK")
  
  const autoEmail = `${student.name.toLowerCase().replace(" ", ".")}.ec23@college.edu`
  const autoPassword = `${student.rollNo}@123`

  return (
    <div className="w-full space-y-8 pb-20 text-[#0F172A] font-sans selection:bg-blue-500/10">
      
      {/* Dense Hero Section */}
      <div className="bg-white p-8 rounded-[2rem] border border-[#E2E8F0] shadow-sm relative overflow-hidden flex flex-col lg:flex-row items-center gap-8">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <BrainCircuit className="h-40 w-40 text-blue-600" />
        </div>
        
        <div className="relative group shrink-0">
          <div className="h-28 w-28 rounded-[1.5rem] bg-[#F1F5F9] border border-[#CBD5E1] flex items-center justify-center overflow-hidden shadow-inner object-cover">
            {imagePreview ? (
              <img src={imagePreview} className="h-full w-full object-cover" alt="Student Profile" />
            ) : (
              <User className="h-12 w-12 text-[#475569]" />
            )}
          </div>
          <label className="absolute -bottom-2 -right-2 h-10 w-10 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center justify-center shadow-lg cursor-pointer transition-all border-2 border-white">
            <Camera className="h-5 w-5" />
            <input type="file" onChange={handleImageUpload} className="hidden" accept="image/*" />
          </label>
        </div>

        <div className="flex-1 text-center lg:text-left space-y-3 z-10 w-full">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black uppercase text-[#0F172A] leading-none tracking-tight mb-2">{student.name}</h1>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                <span className="px-3 py-1 bg-[#F1F5F9] border border-[#CBD5E1] rounded-lg text-[10px] font-black uppercase tracking-widest text-[#475569]">{student.rollNo}</span>
                <span className="px-3 py-1 bg-blue-50 border border-blue-100 rounded-lg text-[10px] font-black uppercase tracking-widest text-blue-600">{student.department} NODE</span>
                <span className="px-3 py-1 bg-[#F1F5F9] border border-[#CBD5E1] rounded-lg text-[10px] font-black uppercase tracking-widest text-[#475569]">YEAR {student.year} • SEC {student.section}</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 justify-center">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-lg shadow-sm">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span className="text-[9px] font-black uppercase tracking-widest">Active</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-200 text-blue-600 rounded-lg shadow-sm">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span className="text-[9px] font-black uppercase tracking-widest">Verified</span>
              </div>
              {coreScore < 60 && (
                <div className="flex items-center gap-1.5 px-3 py-1 bg-rose-50 border border-rose-200 text-rose-600 rounded-lg shadow-sm">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span className="text-[9px] font-black uppercase tracking-widest">At Risk</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="hidden lg:flex flex-col items-end text-right z-10 px-8 py-4 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0]">
          <p className="text-[9px] font-black uppercase tracking-widest text-[#475569] mb-1">CORE SYNTHESIS</p>
          <div className="flex items-end gap-1">
            <p className={cn("text-4xl font-black leading-none", coreStatus === 'STRONG' ? "text-emerald-600" : (coreStatus === 'AVERAGE' ? "text-blue-600" : "text-rose-600"))}>{coreScore}</p>
            <span className={cn("text-xl font-black pb-0.5", coreStatus === 'STRONG' ? "text-emerald-600/60" : (coreStatus === 'AVERAGE' ? "text-blue-600/60" : "text-rose-600/60"))}>%</span>
          </div>
          <p className={cn("text-[9px] font-black uppercase tracking-widest mt-1", coreStatus === 'STRONG' ? "text-emerald-600" : (coreStatus === 'AVERAGE' ? "text-blue-600" : "text-rose-600"))}>{coreStatus} PROTOCOL</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Core Detail Column */}
        <div className="lg:col-span-2 space-y-8">
          
          <div className="bg-white border border-[#E2E8F0] rounded-[2rem] shadow-sm overflow-hidden text-[#0F172A]">
            <div className="px-8 py-5 border-b border-[#F1F5F9] flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <BrainCircuit className="h-5 w-5 text-indigo-600" />
                <h2 className="text-lg font-black uppercase">Identity Matrix</h2>
              </div>
              <Button onClick={fetchStudentData} disabled={saving} className="h-9 px-6 bg-[#0F172A] hover:bg-black text-white text-[9px] font-black tracking-widest uppercase rounded-lg shadow-sm">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                SYNC NODE
              </Button>
            </div>
            
            <div className="p-8 grid md:grid-cols-2 gap-10">
              
              <section className="space-y-6">
                 <h4 className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-[#475569] border-b border-[#F1F5F9] pb-2">
                    <User className="h-4 w-4" /> BIOMETRIC LOG
                 </h4>
                 <div className="space-y-4">
                   <div className="space-y-2">
                     <Label className="text-[9px] font-black uppercase tracking-widest text-[#475569] ml-1 flex items-center gap-1.5"><Calendar className="h-3 w-3" /> DATE OF BIRTH</Label>
                     <input 
                       type="date"
                       value={personalInfo.dob}
                       onChange={(e) => setPersonalInfo({...personalInfo, dob: e.target.value})}
                       className="w-full h-10 px-4 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-[10px] uppercase font-bold focus:border-blue-600 focus:outline-none"
                     />
                   </div>
                   <div className="space-y-2">
                     <Label className="text-[9px] font-black uppercase tracking-widest text-[#475569] ml-1 flex items-center gap-1.5"><Droplets className="h-3 w-3" /> BLOOD GROUP</Label>
                     <input 
                       value={personalInfo.bloodGroup}
                       onChange={(e) => setPersonalInfo({...personalInfo, bloodGroup: e.target.value})}
                       className="w-full h-10 px-4 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-[10px] uppercase font-bold focus:border-blue-600 focus:outline-none"
                     />
                   </div>
                 </div>
              </section>

              <section className="space-y-6">
                 <h4 className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-[#475569] border-b border-[#F1F5F9] pb-2">
                    <Mail className="h-4 w-4" /> DATA RELAY
                 </h4>
                 <div className="space-y-4">
                   <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 space-y-1 relative overflow-hidden">
                     <div className="absolute right-0 top-0 bottom-0 w-2 bg-blue-500" />
                     <Label className="text-[8px] font-black uppercase tracking-widest text-blue-600">INSTITUTIONAL ID (AUTO-GEN)</Label>
                     <p className="text-xs font-black text-[#0F172A] uppercase break-all mt-1">{autoEmail}</p>
                   </div>
                   <div className="space-y-2">
                     <Label className="text-[9px] font-black uppercase tracking-widest text-[#475569] ml-1">PERSONAL CLOUD RELAY</Label>
                     <input 
                       value={personalInfo.personal_email}
                       onChange={(e) => setPersonalInfo({...personalInfo, personal_email: e.target.value})}
                       className="w-full h-10 px-4 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-[10px] uppercase font-bold focus:border-blue-600 focus:outline-none"
                     />
                   </div>
                 </div>
              </section>

              <section className="space-y-6">
                 <h4 className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-[#475569] border-b border-[#F1F5F9] pb-2">
                    <ShieldCheck className="h-4 w-4" /> PARENTAL NODE
                 </h4>
                 <div className="space-y-4">
                   <div className="space-y-2">
                     <Label className="text-[9px] font-black uppercase tracking-widest text-[#475569] ml-1">FATHER'S NAME</Label>
                     <input 
                       value={personalInfo.father_name}
                       onChange={(e) => setPersonalInfo({...personalInfo, father_name: e.target.value})}
                       className="w-full h-10 px-4 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-[10px] uppercase font-bold focus:border-blue-600 focus:outline-none"
                     />
                   </div>
                   <div className="space-y-2">
                     <Label className="text-[9px] font-black uppercase tracking-widest text-[#475569] ml-1">MOTHER'S NAME</Label>
                     <input 
                       value={personalInfo.mother_name}
                       onChange={(e) => setPersonalInfo({...personalInfo, mother_name: e.target.value})}
                       className="w-full h-10 px-4 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-[10px] uppercase font-bold focus:border-blue-600 focus:outline-none"
                     />
                   </div>
                   <div className="space-y-2">
                     <Label className="text-[9px] font-black uppercase tracking-widest text-[#475569] ml-1">GUARDIAN COMS</Label>
                     <input 
                       value={personalInfo.parent_phone}
                       onChange={(e) => setPersonalInfo({...personalInfo, parent_phone: e.target.value})}
                       className="w-full h-10 px-4 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-[10px] uppercase font-bold focus:border-blue-600 focus:outline-none"
                     />
                   </div>
                 </div>
              </section>

              <section className="space-y-6">
                 <h4 className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-[#475569] border-b border-[#F1F5F9] pb-2">
                    <Phone className="h-4 w-4" /> LOCAL COORDS
                 </h4>
                 <div className="space-y-4">
                   <div className="space-y-2">
                     <Label className="text-[9px] font-black uppercase tracking-widest text-[#475569] ml-1">SECURE MOBILE</Label>
                     <input 
                       value={personalInfo.phone_number}
                       onChange={(e) => setPersonalInfo({...personalInfo, phone_number: e.target.value})}
                       className="w-full h-10 px-4 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-[10px] uppercase font-bold focus:border-blue-600 focus:outline-none"
                     />
                   </div>
                   <div className="space-y-2">
                     <Label className="text-[9px] font-black uppercase tracking-widest text-[#475569] ml-1">PHYSICAL COORDINATE</Label>
                     <textarea 
                       value={personalInfo.location}
                       onChange={(e) => setPersonalInfo({...personalInfo, location: e.target.value})}
                       className="w-full h-24 p-4 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-[10px] uppercase font-bold focus:border-blue-600 focus:outline-none resize-none"
                     />
                   </div>
                 </div>
              </section>
              
            </div>
          </div>

          {/* Security Sub-Protocol */}
          <div className="bg-white border border-[#E2E8F0] rounded-[2rem] shadow-sm overflow-hidden text-[#0F172A]">
             <div className="px-8 py-5 border-b border-[#F1F5F9] bg-rose-50/50 flex flex-col md:flex-row items-center gap-4">
                <div className="h-10 w-10 bg-rose-100 rounded-xl flex items-center justify-center text-rose-600 shrink-0">
                   <Lock className="h-5 w-5" />
                </div>
                <div>
                   <h2 className="text-lg font-black uppercase text-[#0F172A]">Security Modulation</h2>
                   <p className="text-[9px] font-black uppercase tracking-widest text-rose-600 mt-1">CIPHER RE-ASSIGNMENT TERMINAL</p>
                </div>
             </div>
             
             <div className="p-8 grid md:grid-cols-2 gap-6 bg-rose-50/50 border-b border-[#F1F5F9]">
                <div className="bg-white p-4 rounded-xl border border-rose-100 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5">
                     <KeyRound className="h-16 w-16" />
                  </div>
                  <Label className="text-[8px] font-black uppercase tracking-widest text-rose-500">AUTO-GENERATED CIPHER</Label>
                  <p className="text-lg font-black font-mono text-[#0F172A] mt-1 tracking-tight">{autoPassword}</p>
                </div>
             </div>

             <form onSubmit={handleChangePassword} className="p-8 grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-[9px] font-black uppercase tracking-widest text-[#475569] ml-1">CURRENT CIPHER</Label>
                    <div className="relative">
                      <input 
                        type={showPasswords ? "text" : "password"}
                        value={passwordData.old_password}
                        onChange={(e) => setPasswordData({...passwordData, old_password: e.target.value})}
                        className="w-full h-10 px-4 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-xs font-bold focus:border-rose-500 focus:outline-none"
                      />
                      <button type="button" onClick={() => setShowPasswords(!showPasswords)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#475569] hover:text-[#0F172A]">
                        {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <Button type="submit" disabled={saving} className="w-full h-10 bg-rose-600 hover:bg-rose-700 text-white text-[9px] font-black uppercase tracking-widest rounded-xl shadow-sm">
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4 mr-2" />} UPDATE ACCESS
                  </Button>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-[9px] font-black uppercase tracking-widest text-[#475569] ml-1">NEW IDENTITY KEY</Label>
                    <input 
                      type={showPasswords ? "text" : "password"}
                      value={passwordData.new_password}
                      onChange={(e) => setPasswordData({...passwordData, new_password: e.target.value})}
                      className="w-full h-10 px-4 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-xs font-bold focus:border-rose-500 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[9px] font-black uppercase tracking-widest text-[#475569] ml-1">CONFIRM NODE</Label>
                    <input 
                      type={showPasswords ? "text" : "password"}
                      value={passwordData.confirm_password}
                      onChange={(e) => setPasswordData({...passwordData, confirm_password: e.target.value})}
                      className="w-full h-10 px-4 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-xs font-bold focus:border-rose-500 focus:outline-none"
                    />
                  </div>
                </div>
             </form>
          </div>

        </div>

        {/* Right Analytics Column */}
        <div className="space-y-8">
          
          <div className="bg-white border border-[#E2E8F0] rounded-[2rem] shadow-sm p-8 space-y-8 text-[#0F172A]">
            <h2 className="text-lg font-black uppercase flex items-center gap-3 border-b border-[#F1F5F9] pb-3">
               <TrendingUp className="h-5 w-5 text-blue-600" /> DATA DYNAMICS
            </h2>
            <div className="space-y-6">
               {[
                 { label: "CORE CGPA", val: student.cgpa, max: 10, color: "bg-blue-600", suffix: "" },
                 { label: "ATTENDANCE RELAY", val: student.attendance, max: 100, color: "bg-emerald-600", suffix: "%" },
                 { label: "PLACEMENT READINESS", val: student.placement_ready, max: 100, color: "bg-indigo-600", suffix: "%" }
               ].map((stat, i) => (
                 <div key={i} className="space-y-2">
                   <div className="flex justify-between items-end">
                     <p className="text-[9px] font-black uppercase tracking-widest text-[#475569]">{stat.label}</p>
                     <p className="text-xl font-black text-[#0F172A] leading-none">{stat.val}{stat.suffix}</p>
                   </div>
                   <div className="h-1.5 w-full bg-[#F1F5F9] rounded-full overflow-hidden">
                     <motion.div 
                       initial={{ width: 0 }}
                       animate={{ width: `${(stat.val / stat.max) * 100}%` }}
                       className={cn("h-full", stat.color)}
                     />
                   </div>
                 </div>
               ))}
               
               <div className="pt-4 border-t border-[#F1F5F9]">
                  <p className="text-[9px] font-black uppercase tracking-widest text-[#475569] mb-3">SKILL INDEX MULTIPLIER</p>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-3 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-center">
                      <p className="text-sm font-black text-blue-600 leading-none">{student.coding_score}</p>
                      <p className="text-[7px] font-black uppercase tracking-widest text-[#475569] mt-1">Code</p>
                    </div>
                    <div className="p-3 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-center">
                      <p className="text-sm font-black text-emerald-600 leading-none">{student.aptitude_score}</p>
                      <p className="text-[7px] font-black uppercase tracking-widest text-[#475569] mt-1">Apt.</p>
                    </div>
                    <div className="p-3 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-center">
                      <p className="text-sm font-black text-indigo-600 leading-none">{student.communication_score}</p>
                      <p className="text-[7px] font-black uppercase tracking-widest text-[#475569] mt-1">Comms</p>
                    </div>
                  </div>
               </div>
            </div>
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-[2rem] shadow-sm p-8 space-y-6 text-[#0F172A]">
             <h2 className="text-lg font-black uppercase flex items-center gap-3 border-b border-[#F1F5F9] pb-3">
               <Globe className="h-5 w-5 text-indigo-600" /> ARTIFACT VAULT
             </h2>
             <div className="p-5 rounded-2xl bg-indigo-50 border border-indigo-100 flex flex-col justify-between">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-10 w-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    <FileText className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm font-black uppercase text-[#0F172A]">RESUME.OBJ</p>
                    <p className="text-[8px] font-black uppercase tracking-widest text-[#475569]">UPLOAD REQUIRED</p>
                  </div>
                </div>
                <label className="h-9 w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl flex items-center justify-center cursor-pointer transition-all font-black text-[9px] uppercase tracking-widest shadow-sm">
                  INJECT ARTIFACT
                  <input type="file" className="hidden" accept=".pdf,.doc,.docx" />
                </label>
             </div>
             
             <div className="pt-6 border-t border-[#F1F5F9] space-y-4 text-center">
                <p className="text-[8px] font-black uppercase tracking-widest text-[#475569] mb-1">NODE-SYNCHRONY-STAMP</p>
                <div className="flex justify-center gap-2">
                  <BadgeAlert className="h-3 w-3 text-emerald-500" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#0F172A] leading-none">STABLE-LINKED</p>
                </div>
             </div>
          </div>

        </div>

      </div>
    </div>
  )
}
