"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    ChevronLeft, Activity, GraduationCap, Award, TrendingUp,
    AlertTriangle, ShieldCheck, BookOpen, Mail, Phone, User,
    BarChart3, Target, Zap, Star, Brain, Clock, FileText,
    Key, MapPin, Users, Heart, ClipboardCheck, Briefcase,
    AlertCircle, Play, UserPlus, Bell, Download, RefreshCcw,
    Copy, Eye, EyeOff
} from "lucide-react";
import {
    ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip,
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
    LineChart, Line, CartesianGrid, PieChart, Pie, Cell, AreaChart, Area
} from "recharts";
import { getApiUrl } from "@/lib/api-admin";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function StudentIntelligencePage() {
    const { id } = useParams();
    const router = useRouter();
    const [student, setStudent] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showPass, setShowPass] = useState(false);

    useEffect(() => {
        async function fetchStudent() {
            setLoading(true);
            try {
                const token = localStorage.getItem("token");
                if (!token) { router.push("/login"); return; }
                const res = await fetch(getApiUrl(`/admin/students/${id}`), {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();
                setStudent(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchStudent();
    }, [id, router]);

    const copyToClipboard = (text: string, label: string) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        toast.success(`${label} copied to clipboard`);
    };

    if (loading) return (
        <div className="flex h-screen items-center justify-center bg-[#F8FAF5]">
            <div className="flex flex-col items-center gap-4">
                <Brain className="h-16 w-16 text-blue-600 animate-bounce" />
                <p className="text-sm font-bold text-blue-600 uppercase tracking-widest animate-pulse">Initializing Intelligence Node...</p>
            </div>
        </div>
    );

    if (error || !student) return (
        <div className="flex h-screen flex-col items-center justify-center bg-[#F8FAF5] gap-4">
            <AlertTriangle className="h-16 w-16 text-rose-500" />
            <p className="text-2xl font-black text-gray-800">{error || "Intelligence Node Offline"}</p>
            <Button onClick={() => router.back()} className="bg-blue-600">Reconnect to Directory</Button>
        </div>
    );

    const riskColor = 
        student.risk_level === "High" ? "bg-rose-50 text-rose-700 border-rose-100" :
        student.risk_level === "Medium" ? "bg-amber-50 text-amber-700 border-amber-100" :
        "bg-emerald-50 text-emerald-700 border-emerald-100";

    const trendData = student.cgpa_trend?.map((cgpa: number, i: number) => ({
        semester: `Sem ${i + 1}`,
        cgpa: cgpa
    })) || [];

    return (
        <div className="min-h-screen bg-[#F8FAF5] pb-20 font-sans selection:bg-blue-100 selection:text-blue-900 leading-relaxed">
            {/* Top Navigation Bar */}
            <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-blue-100 px-8 py-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-6">
                    <Button variant="ghost" size="sm" onClick={() => router.back()} className="rounded-xl border border-blue-100 hover:bg-blue-50">
                        <ChevronLeft className="h-4 w-4 mr-2" /> Back to Directory
                    </Button>
                    <div className="h-6 w-px bg-blue-100" />
                    <div>
                        <h1 className="text-lg font-black text-blue-900  uppercase leading-none">{student.name}</h1>
                        <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mt-1">Institutional ID: {student.roll_number} • {student.department}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Badge className={`${riskColor} px-4 py-1.5 rounded-lg font-bold border shadow-sm`}>
                        {student.risk_level?.toUpperCase()} RISK
                    </Badge>
                </div>
            </div>

            <div className="max-w-[1600px] mx-auto p-8 grid grid-cols-12 gap-8 mt-4">
                
                {/* --- SECTOR 1: BIO & CREDENTIALS --- */}
                <div className="col-span-12 lg:col-span-4 space-y-8">
                    {/* Basic Profile Card */}
                    <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white rounded-[2rem] overflow-hidden">
                        <div className="h-32 bg-gradient-to-br from-blue-600 to-blue-800 relative">
                            <div className="absolute -bottom-12 left-8 h-24 w-24 rounded-2xl bg-white p-1.5 shadow-xl">
                                <div className="h-full w-full bg-blue-100 rounded-xl flex items-center justify-center text-3xl font-black text-blue-700">
                                    {student.name?.charAt(0)}
                                </div>
                            </div>
                        </div>
                        <CardContent className="pt-16 pb-8 px-8">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-2xl font-black text-blue-900 ">{student.name}</h2>
                                    <p className="text-sm font-bold text-blue-500 uppercase tracking-widest">{student.department} • Year {student.year}</p>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 gap-4 mt-8 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                <div className="flex justify-between items-center group">
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Father Name</p>
                                        <p className="font-bold text-slate-700 text-sm">{student.father_name || "N/A"}</p>
                                    </div>
                                    <Users className="h-4 w-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
                                </div>
                                <div className="h-px bg-slate-200/50" />
                                <div className="flex justify-between items-center group">
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mother Name</p>
                                        <p className="font-bold text-slate-700 text-sm">{student.mother_name || "N/A"}</p>
                                    </div>
                                    <Heart className="h-4 w-4 text-slate-300 group-hover:text-rose-500 transition-colors" />
                                </div>
                                <div className="h-px bg-slate-200/50" />
                                <div className="flex justify-between items-center group">
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Location</p>
                                        <p className="font-bold text-slate-700 text-sm">{student.location || "N/A"}</p>
                                    </div>
                                    <MapPin className="h-4 w-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Logic & Security Card */}
                    <Card className="border-blue-200 bg-blue-50/50 rounded-[2rem] p-8 shadow-sm">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
                                <Key className="h-5 w-5" />
                            </div>
                            <h3 className="font-black text-blue-900 uppercase ">Login Credentials</h3>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-white p-4 rounded-2xl border border-blue-100 relative group">
                                <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-1">Personal Email</p>
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-slate-700 truncate mr-2">{student.personal_email || "Not Provided"}</span>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100" onClick={() => copyToClipboard(student.personal_email, "Email")}>
                                        <Copy className="h-3 w-3" />
                                    </Button>
                                </div>
                            </div>

                            <div className="bg-white p-4 rounded-2xl border border-blue-100 relative group border-l-4 border-l-blue-500">
                                <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-1">College Email (Institutional)</p>
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-blue-900 truncate mr-2 ">{student.user?.institutional_email || "Pending Generation..."}</span>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100" onClick={() => copyToClipboard(student.user?.institutional_email, "Internal Email")}>
                                        <Copy className="h-3 w-3" />
                                    </Button>
                                </div>
                            </div>

                            <div className="bg-slate-900 p-6 rounded-3xl relative shadow-2xl">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1">Temporary Password</p>
                                        <p className="font-mono text-xl font-black text-blue-400 tracking-[0.2em] mt-1">
                                            {showPass ? student.user?.plain_password : "••••••••"}
                                        </p>
                                    </div>
                                    <div className="flex gap-1">
                                        <Button variant="ghost" size="icon" className="h-10 w-10 text-white/50 hover:bg-white/10" onClick={() => setShowPass(!showPass)}>
                                            {showPass ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-10 w-10 text-white/50 hover:bg-white/10" onClick={() => copyToClipboard(student.user?.plain_password, "Password")}>
                                            <Copy className="h-5 w-5" />
                                        </Button>
                                    </div>
                                </div>
                                <Button className="w-full bg-blue-600 hover:bg-blue-500 text-xs font-black uppercase tracking-widest h-11 rounded-2xl shadow-lg shadow-blue-900/40 border border-blue-500/50">
                                    <RefreshCcw className="h-3 w-3 mr-2" /> Reset Access Token
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* --- SECTOR 2: ACADEMICS & TRENDS --- */}
                <div className="col-span-12 lg:col-span-8 space-y-8">
                    {/* Metrics Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { label: "Aggregate CGPA", value: student.current_cgpa, icon: Award, color: "text-blue-600", bg: "bg-blue-50" },
                            { label: "Attendance (%)", value: `${student.attendance_percentage}%`, icon: Clock, color: "text-emerald-600", bg: "bg-emerald-50" },
                            { label: "Scholastic DNA", value: `${student.academic_dna_score}%`, icon: Activity, color: "text-rose-600", bg: "bg-rose-50" },
                            { label: "Active Backlogs", value: student.backlog_details === "None" ? 0 : 1, icon: ClipboardCheck, color: "text-amber-600", bg: "bg-amber-50" },
                        ].map((metric, i) => (
                            <div key={i} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <metric.icon className="h-12 w-12" />
                                </div>
                                <div className={`${metric.bg} ${metric.color} h-10 w-10 rounded-xl flex items-center justify-center mb-4`}>
                                    <metric.icon className="h-5 w-5" />
                                </div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{metric.label}</p>
                                <p className="text-2xl font-black text-slate-900 mt-2 ">{metric.value}</p>
                                
                                {i === 3 && student.backlog_details !== "None" && (
                                    <p className="text-[9px] font-bold text-rose-500 mt-2 uppercase">{student.backlog_details}</p>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Main Analytics: Academic Chart */}
                    <Card className="border-none shadow-sm rounded-[2.5rem] p-10 bg-white">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4">
                            <div>
                                <h3 className="text-2xl font-black  text-slate-900 uppercase leading-none">Academic Trajectory</h3>
                                <p className="text-xs font-bold text-blue-500 uppercase tracking-widest mt-2">Semester-wise Intelligence Index</p>
                            </div>
                            <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-1">
                                <Button size="sm" variant="secondary" className="bg-white text-blue-700 shadow-sm rounded-xl px-6 h-9 text-[10px] font-black uppercase">Graph View</Button>
                                <Button size="sm" variant="ghost" className="text-slate-400 rounded-xl px-6 h-9 text-[10px] font-black uppercase">Detailed Table</Button>
                            </div>
                        </div>
                        <div className="h-[400px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={trendData}>
                                    <defs>
                                        <linearGradient id="colorCgpa" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#4D7C0F" stopOpacity={0.4}/>
                                            <stop offset="95%" stopColor="#4D7C0F" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="semester" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 'bold', fill: '#94a3b8' }} dy={10} />
                                    <YAxis domain={[0, 10]} axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 'bold', fill: '#94a3b8' }} />
                                    <Tooltip 
                                        contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }}
                                        labelStyle={{ fontWeight: 'black', marginBottom: '4px', textTransform: 'uppercase', color: '#4D7C0F' }}
                                    />
                                    <Area type="monotone" dataKey="cgpa" stroke="#4D7C0F" strokeWidth={5} fillOpacity={1} fill="url(#colorCgpa)" dot={{ r: 6, fill: '#4D7C0F', strokeWidth: 3, stroke: '#fff' }} activeDot={{ r: 8, strokeWidth: 0 }} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Skill Radar */}
                        <Card className="border-none shadow-sm rounded-[2rem] p-8 bg-white relative overflow-hidden">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                                    <Target className="h-5 w-5" />
                                </div>
                                <h3 className="font-black text-slate-800 uppercase ">Competency Radar</h3>
                            </div>
                            <div className="h-72">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart data={[
                                        { subject: 'Coding', A: student.coding_score || 70 },
                                        { subject: 'Aptitude', A: student.aptitude_score || 85 },
                                        { subject: 'Comm', A: student.communication_score || 80 },
                                        { subject: 'Project', A: 75 },
                                        { subject: 'Core', A: student.academic_dna_score || 90 },
                                    ]}>
                                        <PolarGrid stroke="#f1f5f9" />
                                        <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fontWeight: 'bold', fill: '#64748b' }} />
                                        <Radar name="Student DNA" dataKey="A" stroke="#2563eb" fill="#2563eb" fillOpacity={0.3} dot={{ r: 4 }} />
                                        <Tooltip contentStyle={{ borderRadius: '16px', border: '2px solid #E2E8F0', boxShadow: '0 10px 30px rgba(0,0,0,0.15)', backgroundColor: '#ffffff' }} itemStyle={{ fontSize: '13px', fontWeight: 900, color: '#2563eb' }} labelStyle={{ fontSize: '14px', fontWeight: 900, color: '#000000', marginBottom: '4px' }} />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>

                        {/* AI & Prediction */}
                        <Card className="border-none shadow-sm rounded-[2rem] p-8 bg-slate-900 text-white relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600 opacity-20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-600 transition-colors duration-1000" />
                            <div className="flex items-center gap-3 mb-10">
                                <div className="h-10 w-10 bg-blue-600/20 text-blue-400 rounded-2xl flex items-center justify-center">
                                    <Brain className="h-5 w-5" />
                                </div>
                                <h3 className="font-black uppercase  text-white/90">AI Predictive Forecast</h3>
                            </div>
                            
                            <div className="space-y-10 relative z-10">
                                <div className="flex justify-between items-end">
                                    <div className="bg-white/5 border border-white/10 p-5 rounded-3xl backdrop-blur-sm">
                                        <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Projected Degree GPA</p>
                                        <p className="text-4xl font-black text-blue-400 ">8.42</p>
                                    </div>
                                    <div className="text-right pb-2">
                                        <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Stability Threshold</p>
                                        <p className="text-2xl font-black text-emerald-400 uppercase">94.2%</p>
                                    </div>
                                </div>

                                <div className="bg-white p-5 rounded-3xl border-none text-slate-900 shadow-2xl relative">
                                    <div className="absolute -top-3 left-6 px-3 py-1 bg-amber-400 rounded-full text-[9px] font-black uppercase text-slate-900 shadow-sm border border-amber-500">Risk Assessment</div>
                                    <div className="flex items-start gap-4 mt-2">
                                        <div className="h-8 w-8 rounded-full bg-rose-50 flex items-center justify-center shrink-0">
                                            <AlertCircle className="h-4 w-4 text-rose-500" />
                                        </div>
                                        <p className="text-xs font-bold leading-relaxed text-slate-600">
                                            "{student.risk_reason || "Normal scholastic progression detected. Continue with current pedagogical workload."}"
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* AI Insight Box & Placement Readiness */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 bg-[#F0FDF4] border border-emerald-100 rounded-[2.5rem] p-10 flex flex-col justify-between shadow-[0_15px_60px_rgba(77,124,15,0.05)]">
                            <div>
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-2xl font-black text-emerald-900 uppercase ">AI Insight Synthesis</h3>
                                    <Zap className="h-8 w-8 text-emerald-400 fill-emerald-400/20" />
                                </div>
                                <p className="text-2xl font-bold text-emerald-800 leading-tight ">
                                    “{student.ai_suggestion}”
                                </p>
                            </div>
                            
                            <div className="mt-12 flex flex-wrap gap-3">
                                {student.eligible_companies?.map((co: string) => (
                                    <Badge key={co} className="bg-white text-emerald-700 border-none shadow-sm px-4 py-2 rounded-2xl font-black text-[10px] uppercase tracking-wider">
                                        <Briefcase className="h-3 w-3 mr-2 text-emerald-500" /> {co} Ready
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        <Card className="border-none shadow-sm rounded-[2.5rem] p-8 flex flex-col justify-between bg-white overflow-hidden relative">
                            <div className="absolute top-0 right-0 h-40 w-40 bg-indigo-50 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2" />
                            <div>
                                <h3 className="font-black text-slate-800 uppercase  flex items-center gap-3 mb-8">
                                    <FileText className="h-5 w-5 text-indigo-500" /> Portfolio Nodes
                                </h3>
                                <div className="space-y-4 relative z-10">
                                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-indigo-200 transition-all cursor-pointer">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-black text-[10px] shadow-lg shadow-indigo-200">RES</div>
                                            <div className="leading-none">
                                                <p className="text-xs font-black text-slate-900 uppercase ">Master_Resume.pdf</p>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">Uploaded 2d ago</p>
                                            </div>
                                        </div>
                                        <Download className="h-4 w-4 text-slate-400 group-hover:text-indigo-600" />
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 opacity-60">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center font-black text-[10px]">CERT</div>
                                            <div className="leading-none">
                                                <p className="text-xs font-black text-slate-900 uppercase ">Cloud_Practitioner.pdf</p>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">External Sync</p>
                                            </div>
                                        </div>
                                        <Download className="h-4 w-4 text-slate-400" />
                                    </div>
                                </div>
                            </div>
                            <Button className="w-full mt-10 bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-widest text-[10px] h-12 rounded-[1.25rem] shadow-xl shadow-slate-900/10">
                                Upload New Repository
                            </Button>
                        </Card>
                    </div>

                    {/* Quick Executive Actions */}
                    <Card className="border-none shadow-[0_20px_80px_rgb(0,0,0,0.06)] rounded-[3rem] bg-white p-8 overflow-hidden">
                        <div className="flex flex-wrap items-center justify-center gap-6">
                            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest text-xs px-10 h-16 rounded-3xl shadow-2xl shadow-indigo-600/30 transition-transform active:scale-95">
                                <Play className="h-5 w-5 mr-3" /> Start Bridge Program
                            </Button>
                            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-widest text-xs px-10 h-16 rounded-3xl shadow-2xl shadow-emerald-600/30 transition-transform active:scale-95">
                                <UserPlus className="h-5 w-5 mr-3" /> Deploy Expert Mentor
                            </Button>
                            <Button className="bg-rose-600 hover:bg-rose-700 text-white font-black uppercase tracking-widest text-xs px-10 h-16 rounded-3xl shadow-2xl shadow-rose-600/30 transition-transform active:scale-95">
                                <Bell className="h-5 w-5 mr-3" /> Transmit Emergency Alert
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
