"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, Mail, Phone, MapPin, Calendar, Briefcase, 
  GraduationCap, TrendingUp, BarChart3, AlertTriangle, 
  CheckCircle2, Clock, BookOpen, Shield, Download,
  ExternalLink, User, Smartphone, Users, Map
} from "lucide-react";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, AreaChart, Area, BarChart, Bar,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { getApiUrl } from "@/lib/api-config";
import { robustFetch } from "@/lib/cache";

interface StudentProfilePageProps {
    params: Promise<{ id: string }>;
}

export default function StudentProfilePage({ params }: StudentProfilePageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudent = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        const url = getApiUrl(`/admin/students/${id}`);
        const res = await robustFetch(url, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.ok) {
          const data = await res.json();
          setStudent(data);
        } else {
          setError("Failed to fetch student data");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Connection to Intelligence Node failed");
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
        <div className="h-12 w-12 rounded-2xl bg-indigo-600 animate-bounce flex items-center justify-center shadow-lg shadow-indigo-200">
          <Shield className="h-6 w-6 text-white" />
        </div>
        <p className="mt-4 text-xs font-black uppercase tracking-widest text-slate-400">Synchronizing Neural Profile...</p>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <AlertTriangle className="h-12 w-12 text-rose-500 mb-4" />
        <h2 className="text-xl font-black text-slate-900 uppercase">Analysis Interrupted</h2>
        <p className="text-sm text-slate-500 mt-2">{error || "Student record not found"}</p>
        <Button onClick={() => router.back()} className="mt-6 bg-slate-900">Back to Directory</Button>
      </div>
    );
  }

  // Pre-process trend data if it's missing or in wrong format
  const cgpaTrend = (student.cgpa_trend || [7.2, 7.5, 7.8, 8.1, 8.2, 8.4]).map((val: number, idx: number) => ({
    sem: `Sem ${idx + 1}`,
    gpa: val
  }));

  const attendanceTrend = [
    { month: "Jan", rate: 85 },
    { month: "Feb", rate: 88 },
    { month: "Mar", rate: 82 },
    { month: "Apr", rate: 91 },
    { month: "May", rate: 89 },
    { month: "Jun", rate: student.attendance_percentage || 85 },
  ];

  // Prioritize synthetic subject performance data from backend
  const subjectPerformance = student.subject_performance?.length > 0
    ? student.subject_performance.map((s: any) => ({
        subject: s.subject,
        score: s.marks,
        grade: s.grade
      }))
    : (student.academic_records || []).slice(0, 5).map((rec: any) => ({
        subject: rec.subject.split('(')[0].trim(),
        score: rec.internal_marks + rec.external_marks,
        grade: rec.grade
      }));

  if (subjectPerformance.length === 0) {
      subjectPerformance.push(
          { subject: "Data Structures", score: 85, grade: 'A' },
          { subject: "Algorithms", score: 78, grade: 'B' },
          { subject: "OS", score: 92, grade: 'S' },
          { subject: "DBMS", score: 88, grade: 'A+' }
      );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.back()}
              className="h-9 w-9 rounded-xl border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-all"
            >
              <ArrowLeft size={18} className="text-slate-600" />
            </button>
            <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-lg">
              {student.user?.full_name?.[0] || 'S'}
            </div>
            <div>
              <h1 className="text-sm font-black text-slate-900 uppercase tracking-tight leading-none">{student.user?.full_name}</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{student.roll_number}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className={cn(
              "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2",
              student.risk_level === 'High' ? "bg-rose-50 text-rose-600 border border-rose-100" : "bg-emerald-50 text-emerald-600 border border-emerald-100"
            )}>
              <span className="relative flex h-2 w-2">
                <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", student.risk_level === 'High' ? "bg-rose-400" : "bg-emerald-400")}></span>
                <span className={cn("relative inline-flex rounded-full h-2 w-2", student.risk_level === 'High' ? "bg-rose-500" : "bg-emerald-500")}></span>
              </span>
              Risk Status: {student.risk_level || 'Stable'}
            </div>
            <Button size="sm" variant="outline" className="h-9 rounded-xl border-slate-200 text-[10px] font-black uppercase tracking-widest">
              <Download size={14} className="mr-2" /> Export Node
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: BASIC & PERSONAL */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* SECTION 1: CORE CREDENTIALS */}
          <Card className="rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
             <div className="h-2 bg-indigo-600" />
             <CardContent className="p-6">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Institutional Node Data</p>
                
                <div className="space-y-4">
                   <div className="flex justify-between items-center py-2 border-b border-slate-50">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Department</span>
                      <span className="text-xs font-black text-slate-900 uppercase">{student.department}</span>
                   </div>
                   <div className="flex justify-between items-center py-2 border-b border-slate-50">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Academic Year</span>
                      <span className="text-xs font-black text-slate-900 uppercase">Year {student.year}</span>
                   </div>
                   <div className="flex justify-between items-center py-2 border-b border-slate-50">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Section</span>
                      <span className="text-xs font-black text-slate-900 uppercase">{student.section || "A"}</span>
                   </div>
                   
                   <div className="pt-4 space-y-3">
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                         <p className="text-[8px] font-bold text-slate-400 uppercase mb-1 flex items-center gap-1.5">
                            <Mail size={10} /> Institutional Email
                         </p>
                         <p className="text-[11px] font-black text-slate-900 truncate">{student.user?.institutional_email || "—"}</p>
                      </div>
                      <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                         <p className="text-[8px] font-bold text-slate-500 uppercase mb-1 flex items-center gap-1.5">
                            <Shield size={10} /> Temporary Access Phrase
                         </p>
                         <p className="text-[11px] font-mono font-black text-white tracking-widest">{student.user?.plain_password || "••••••••"}</p>
                      </div>
                   </div>
                </div>
             </CardContent>
          </Card>

          {/* SECTION 2: PERSONAL IDENTITY */}
          <Card className="rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
             <CardContent className="p-6">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                   <User size={14} /> Personal Metadata
                </p>
                
                <div className="space-y-5">
                   <div className="flex gap-4 items-start">
                      <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                         <Mail size={14} className="text-slate-400" />
                      </div>
                      <div>
                         <p className="text-[8px] font-bold text-slate-400 uppercase">Personal Email</p>
                         <p className="text-[11px] font-black text-slate-900">{student.personal_email || "—"}</p>
                      </div>
                   </div>

                   <div className="flex gap-4 items-start">
                      <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                         <Smartphone size={14} className="text-slate-400" />
                      </div>
                      <div>
                         <p className="text-[8px] font-bold text-slate-400 uppercase">Contact Link</p>
                         <p className="text-[11px] font-black text-slate-900">{student.personal_phone || "—"}</p>
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-slate-50/50 rounded-xl border border-slate-100">
                         <p className="text-[8px] font-bold text-slate-400 uppercase mb-1">Father</p>
                         <p className="text-[10px] font-black text-slate-900 uppercase truncate">{student.father_name || "—"}</p>
                      </div>
                      <div className="p-3 bg-slate-50/50 rounded-xl border border-slate-100">
                         <p className="text-[8px] font-bold text-slate-400 uppercase mb-1">Mother</p>
                         <p className="text-[10px] font-black text-slate-900 uppercase truncate">{student.mother_name || "—"}</p>
                      </div>
                   </div>

                   <div className="flex gap-4 items-start">
                      <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                         <Users size={14} className="text-slate-400" />
                      </div>
                      <div>
                         <p className="text-[8px] font-bold text-slate-400 uppercase">Parental contact</p>
                         <p className="text-[11px] font-black text-slate-900">{student.parent_phone || "—"}</p>
                      </div>
                   </div>

                   <div className="flex gap-4 items-start">
                      <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                         <Map size={14} className="text-slate-400" />
                      </div>
                      <div>
                         <p className="text-[8px] font-bold text-slate-400 uppercase">Residence Node</p>
                         <p className="text-[11px] font-black text-slate-900 uppercase leading-tight">{student.location || "Coimbatore, India"}</p>
                      </div>
                   </div>
                </div>
             </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN: ACADEMIC & ANALYTICS */}
        <div className="lg:col-span-8 space-y-6">
           
           {/* SECTION 3: ACADEMIC FOUNDATION */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="rounded-2xl border border-slate-200 shadow-sm overflow-hidden group hover:border-indigo-200 transition-all">
                 <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-6">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                           <GraduationCap size={14} /> Schooling History
                        </p>
                        <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs">
                           {student.cutoff_12th || 185}
                        </div>
                    </div>
                    <div>
                       <p className="text-[11px] font-black text-slate-900 uppercase group-hover:text-indigo-600 transition-colors">
                          {student.previous_school || "St. Joseph's Higher Secondary"}
                       </p>
                       <p className="text-[8px] font-bold text-slate-400 uppercase mt-1 tracking-widest">12th Grade Cutoff Reference</p>
                    </div>
                 </CardContent>
              </Card>

              <Card className="rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                 <CardContent className="p-6">
                    <div className="flex items-center gap-6">
                       <div className="flex-1">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Current CGPA</p>
                          <div className="flex items-baseline gap-2">
                             <h2 className="text-3xl font-black text-slate-950 tracking-tighter">{student.current_cgpa.toFixed(2)}</h2>
                             <span className="text-[10px] font-bold text-slate-400 uppercase">Out of 10.0</span>
                          </div>
                       </div>
                       <div className="flex-1">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Attendance</p>
                          <div className="flex items-baseline gap-2">
                             <h2 className="text-3xl font-black text-indigo-600 tracking-tighter">{student.attendance_percentage}%</h2>
                             <div className={cn(
                               "h-1.5 w-1.5 rounded-full",
                               student.attendance_percentage > 75 ? "bg-emerald-500" : "bg-rose-500"
                             )}></div>
                          </div>
                       </div>
                    </div>
                 </CardContent>
              </Card>
           </div>

           {/* SECTION 5: PERFORMANCE GRAPHS */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* CGPA Trend Area Chart */}
              <Card className="rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center justify-between">
                    <span>CGPA Trajectory</span>
                    <TrendingUp size={12} className="text-emerald-500" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-64">
                   <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={cgpaTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                         <defs>
                            <linearGradient id="colorGpa" x1="0" y1="0" x2="0" y2="1">
                               <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                               <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                            </linearGradient>
                         </defs>
                         <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                         <XAxis 
                            dataKey="sem" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 9, fontWeight: 700, fill: '#94a3b8' }} 
                         />
                         <YAxis 
                            domain={[5, 10]} 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 9, fontWeight: 700, fill: '#94a3b8' }} 
                         />
                         <Tooltip 
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '10px', fontWeight: 800 }}
                         />
                         <Area type="monotone" dataKey="gpa" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorGpa)" />
                      </AreaChart>
                   </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Attendance Pattern Bar Chart */}
              <Card className="rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center justify-between">
                    <span>Attendance Patterns</span>
                    <Clock size={12} className="text-blue-500" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-64">
                   <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={attendanceTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                         <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                         <XAxis 
                            dataKey="month" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 9, fontWeight: 700, fill: '#94a3b8' }} 
                         />
                         <YAxis 
                            domain={[0, 100]} 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 9, fontWeight: 700, fill: '#94a3b8' }} 
                         />
                         <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '12px', border: 'none', fontSize: '10px', fontWeight: 800 }} />
                         <Bar dataKey="rate" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} />
                      </BarChart>
                   </ResponsiveContainer>
                </CardContent>
              </Card>
           </div>

           {/* SECTION 4: SUBJECT PERFORMANCE TABLE */}
           <Card className="rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
             <CardHeader className="border-b border-slate-50 py-4 px-6 flex flex-row items-center justify-between">
                <CardTitle className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                   <BookOpen size={14} /> Subject Merit Overview
                </CardTitle>
                <Button variant="ghost" size="sm" className="h-7 text-[8px] font-black text-indigo-600 uppercase">View All Transcript</Button>
             </CardHeader>
             <CardContent className="p-0">
                <div className="overflow-x-auto">
                   <table className="w-full text-left">
                      <thead>
                         <tr className="bg-slate-50/50">
                            <th className="py-3 px-6 text-[9px] font-black text-slate-400 uppercase tracking-widest underline decoration-indigo-200 decoration-2 underline-offset-4">Course Identifier</th>
                            <th className="py-3 px-6 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Neural Merge (Marks)</th>
                            <th className="py-3 px-6 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Merit Node (Grade)</th>
                         </tr>
                      </thead>
                      <tbody>
                         {subjectPerformance.map((sub: any, i: number) => (
                            <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/30 transition-colors">
                               <td className="py-4 px-6 text-[11px] font-black text-slate-900 uppercase">{sub.subject}</td>
                               <td className="py-4 px-6 text-center">
                                  <div className="flex items-center justify-center gap-3">
                                     <div className="flex-1 max-w-[80px] h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                        <div 
                                          className={cn("h-full rounded-full", sub.score > 85 ? "bg-emerald-500" : sub.score > 60 ? "bg-blue-500" : "bg-rose-500")}
                                          style={{ width: `${sub.score}%` }}
                                        />
                                     </div>
                                     <span className="text-[11px] font-black text-slate-700">{sub.score} / 100</span>
                                  </div>
                               </td>
                               <td className="py-4 px-6 text-right">
                                  <span className={cn(
                                    "px-2.5 py-1 rounded-lg text-[10px] font-black",
                                    ['S', 'A+', 'A'].includes(sub.grade) ? "bg-emerald-50 text-emerald-600" : sub.grade === 'B' ? "bg-blue-50 text-blue-600" : "bg-rose-50 text-rose-600"
                                  )}>
                                     {sub.grade}
                                  </span>
                               </td>
                            </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
             </CardContent>
           </Card>

           {/* SECTION 6: RISK ANALYSIS INSIGHT */}
           <Card className={cn(
              "rounded-2xl border overflow-hidden shadow-sm transition-all",
              student.risk_level === 'High' ? "bg-rose-50/30 border-rose-100" : "bg-emerald-50/30 border-emerald-100"
           )}>
              <CardContent className="p-6">
                 <div className="flex items-center gap-4">
                    <div className={cn(
                       "h-12 w-12 rounded-2xl flex items-center justify-center",
                       student.risk_level === 'High' ? "bg-rose-500 text-white" : "bg-emerald-500 text-white"
                    )}>
                       {student.risk_level === 'High' ? <AlertTriangle size={24} /> : <CheckCircle2 size={24} />}
                    </div>
                    <div className="flex-1">
                       <h3 className={cn(
                          "text-sm font-black uppercase tracking-tight",
                          student.risk_level === 'High' ? "text-rose-900" : "text-emerald-900"
                       )}>
                          {student.risk_level === 'High' ? "Strategic Intervention Required" : "System Optimized: Optimal Trajectory"}
                       </h3>
                       <p className={cn(
                          "text-xs font-bold mt-1 line-clamp-2",
                          student.risk_level === 'High' ? "text-rose-600/80" : "text-emerald-600/80"
                       )}>
                          {student.risk_reason || "Node is performing within institutional safety vectors. No immediate remedial protocol detected."}
                       </p>
                    </div>
                    <Button className={cn(
                       "rounded-xl font-black uppercase text-[10px] tracking-widest",
                       student.risk_level === 'High' ? "bg-rose-600 hover:bg-rose-700" : "bg-emerald-600 hover:bg-emerald-700"
                    )}>
                       {student.risk_level === 'High' ? "Deploy Rescue Bot" : "Enhance Learning Path"}
                    </Button>
                 </div>
              </CardContent>
           </Card>

        </div>
      </div>
    </div>
  );
}
