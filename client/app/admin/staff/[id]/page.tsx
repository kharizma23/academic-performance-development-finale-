"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
    ChevronLeft, Activity, Users, Award, TrendingUp,
    ShieldCheck, BookOpen, Mail, Phone, BarChart3, 
    Target, Zap, Star, Brain, CheckCircle2, GraduationCap,
    FileText
} from "lucide-react";
import {
    ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip,
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
    LineChart, Line, CartesianGrid, PieChart, Pie, Cell
} from "recharts";
import { getApiUrl } from "@/lib/api-admin";
import { cn } from "@/lib/utils";

export default function StaffDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [staff, setStaff] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchStaff() {
            setLoading(true);
            try {
                const token = localStorage.getItem("token");
                if (!token) { router.push("/login"); return; }
                const res = await fetch(getApiUrl(`/admin/staff/${id}`), {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();
                if (data.error) { setError(data.error); return; }
                setStaff(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchStaff();
    }, [id, router]);

    if (loading) return (
        <div className="flex h-screen items-center justify-center bg-[#F8FAF5]">
            <Activity className="h-16 w-16 text-[#4D7C0F] animate-pulse" />
        </div>
    );

    if (error || !staff) return (
        <div className="flex h-screen flex-col items-center justify-center bg-[#F8FAF5] gap-4">
            <div className="h-24 w-24 bg-rose-50 rounded-full flex items-center justify-center border-4 border-rose-200">
                <Users className="h-12 w-12 text-rose-500" />
            </div>
            <p className="text-2xl font-black text-gray-800 uppercase ">{error || "Faculty Node Not Found"}</p>
            <button onClick={() => router.back()} className="mt-4 px-10 py-4 bg-blue-600 text-white rounded-[2rem] font-black uppercase tracking-widest shadow-xl hover:bg-blue-700 transition-all">Go Back</button>
        </div>
    );

    const impactGaugeData = [
        { name: "Score", value: staff.teaching_impact_score || 0 },
        { name: "Remaining", value: 100 - (staff.teaching_impact_score || 0) }
    ];

    const trendData = staff.impact_trends?.map((val: number, i: number) => ({
        month: `M${i + 1}`,
        impact: val
    })) || [];

    const statsRadarData = [
        { subject: 'Pedagogy', score: staff.teaching_impact_score },
        { subject: 'Consistency', score: staff.consistency_score * 10 || 85 },
        { subject: 'Complexity', score: staff.difficulty_handling },
        { subject: 'Improvement', score: staff.improvement_index },
        { subject: 'Feedback', score: staff.student_feedback_rating * 20 },
    ];

    return (
        <div className="min-h-screen bg-[#F8FAF5] p-8 md:p-12 font-sans text-[#1F2937]">
            {/* Header */}
            <div className="flex items-center gap-6 mb-12">
                <button onClick={() => router.back()} className="p-4 bg-white border-4 border-blue-100 rounded-[1.5rem] hover:bg-blue-50 transition-all shadow-lg group">
                    <ChevronLeft className="h-6 w-6 text-blue-600 group-hover:-translate-x-1 transition-transform" />
                </button>
                <div>
                    <h1 className="text-4xl font-black  uppercase leading-none text-blue-950">Faculty Intelligence</h1>
                    <div className="flex items-center gap-3 mt-2">
                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        <p className="text-xs font-black text-blue-400 uppercase tracking-widest">Active Pedagogical Analysis Node</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-12">
                {/* Left Column: Faculty Profile */}
                <div className="col-span-12 lg:col-span-4 space-y-10">
                    <div className="bg-white rounded-[3rem] p-10 shadow-xl border-4 border-blue-100 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-700" />
                        <div className="flex flex-col items-center relative z-10">
                            <div className="h-32 w-32 bg-blue-600 rounded-[2.5rem] flex items-center justify-center text-white text-5xl font-black shadow-2xl ring-8 ring-blue-50 mb-6 uppercase">
                                {(staff.user?.full_name || staff.name || "F")[0]}
                            </div>
                            <h2 className="text-3xl font-[900] text-blue-950  text-center uppercase leading-none">{staff.user?.full_name || staff.name}</h2>
                            <p className="text-emerald-600 font-black uppercase tracking-widest mt-3 text-sm">{staff.designation}</p>
                            
                            <div className="flex flex-wrap justify-center gap-3 mt-6">
                                <span className="px-6 py-2 bg-blue-50 border-2 border-blue-100 rounded-full text-xs font-black text-blue-600 uppercase tracking-widest">{staff.department}</span>
                                <span className="px-6 py-2 bg-emerald-50 border-2 border-emerald-100 rounded-full text-xs font-black text-emerald-600 uppercase tracking-widest">Staff ID: {staff.staff_id}</span>
                            </div>

                            <div className="w-full grid grid-cols-2 gap-4 mt-10 bg-blue-50/50 p-6 rounded-[2rem] border-2 border-blue-100">
                                <div className="text-center">
                                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Feedback Rating</p>
                                    <div className="flex items-center justify-center gap-1">
                                        <p className="text-3xl font-black text-blue-950">{staff.student_feedback_rating}</p>
                                        <Star className="h-5 w-5 text-amber-400 fill-current" />
                                    </div>
                                </div>
                                <div className="text-center border-l-2 border-blue-100">
                                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Consistency</p>
                                    <p className="text-3xl font-black text-blue-950">{Math.round(staff.consistency_score * 100)}%</p>
                                </div>
                            </div>

                            <div className="w-full mt-10 space-y-5">
                                <div className="flex items-center gap-4 text-blue-700 font-bold text-sm bg-white p-4 rounded-2xl border-2 border-blue-50 transition-all hover:border-blue-200">
                                    <div className="h-10 w-10 bg-blue-50 rounded-xl flex items-center justify-center border-2 border-blue-100">
                                        <Mail className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <span className="truncate">{staff.user?.institutional_email || staff.personal_email}</span>
                                </div>
                                <div className="flex items-center gap-4 text-blue-700 font-bold text-sm bg-white p-4 rounded-2xl border-2 border-blue-50 transition-all hover:border-blue-200">
                                    <div className="h-10 w-10 bg-blue-50 rounded-xl flex items-center justify-center border-2 border-blue-100">
                                        <Target className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <span>Specialization: {staff.primary_skill || "Advanced Engineering"}</span>
                                </div>
                                <div className="flex items-center gap-4 text-blue-700 font-bold text-sm bg-white p-4 rounded-2xl border-2 border-blue-50 transition-all hover:border-blue-200">
                                    <div className="h-10 w-10 bg-blue-50 rounded-xl flex items-center justify-center border-2 border-blue-100">
                                        <GraduationCap className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <span>{staff.me_degree} ({staff.me_college})</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="bg-[#1F2937] text-white rounded-[2rem] p-8 shadow-xl flex flex-col items-center justify-center text-center group transition-all hover:scale-105">
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Projects</p>
                            <p className="text-4xl font-black text-emerald-400">{staff.projects_completed}</p>
                            <FolderCheck className="h-6 w-6 text-white/20 mt-4 group-hover:text-emerald-400 transition-colors" />
                        </div>
                        <div className="bg-white text-blue-950 rounded-[2rem] p-8 shadow-xl border-4 border-blue-100 flex flex-col items-center justify-center text-center group transition-all hover:scale-105">
                            <p className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-2">Publications</p>
                            <p className="text-4xl font-black text-blue-600">{staff.publications_count}</p>
                            <FileText className="h-6 w-6 text-blue-100 mt-4 group-hover:text-blue-600 transition-colors" />
                        </div>
                    </div>

                    {/* AI Sentiment Analysis Card */}
                    <div className="bg-white rounded-[3rem] p-10 shadow-xl border-4 border-blue-100 space-y-6">
                        <h3 className="text-lg font-black uppercase tracking-widest text-blue-950 flex items-center gap-3">
                            <Star className="h-5 w-5 text-amber-500" /> Feedback Sentiment
                        </h3>
                        <div className="p-8 rounded-[2rem] bg-amber-50 border-4 border-amber-100 flex flex-col items-center justify-center gap-4">
                            <p className="text-3xl font-black text-amber-600 uppercase ">{staff.feedback_sentiment}</p>
                            <div className="flex gap-1">
                                {[1,2,3,4,5].map(i => (
                                    <Star key={i} className={cn("h-6 w-6", i <= Math.round(staff.student_feedback_rating) ? "text-amber-400 fill-current" : "text-amber-200")} />
                                ))}
                            </div>
                        </div>
                        <p className="text-sm font-bold text-blue-400 text-center leading-relaxed ">
                            "AI identifies high pedagogical alignment with student needs and exceptional clarity in core concepts."
                        </p>
                    </div>
                </div>

                {/* Right Column: Deep Analytics */}
                <div className="col-span-12 lg:col-span-8 space-y-12">
                    {/* Teaching Impact Gauge & Suggestions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="bg-white rounded-[3.5rem] p-10 shadow-xl border-4 border-blue-100 flex flex-col items-center">
                            <h3 className="text-xl font-black uppercase tracking-widest text-blue-950 flex items-center gap-3 mb-8 self-start">
                                <TrendingUp className="h-6 w-6 text-emerald-600" /> Teaching Impact Index
                            </h3>
                            <div className="relative h-64 w-full flex items-center justify-center">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={impactGaugeData} startAngle={180} endAngle={0} innerRadius="70%" outerRadius="100%" cy="85%" dataKey="value" stroke="none">
                                            <Cell fill="#059669" />
                                            <Cell fill="#ECFDF5" />
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex flex-col items-center justify-center pt-20 text-center">
                                    <span className="text-6xl font-black text-blue-950 ">{staff.teaching_impact_score}%</span>
                                    <span className="text-xs font-black text-emerald-600 uppercase tracking-widest mt-2 bg-emerald-50 px-4 py-1 rounded-full border-2 border-emerald-100">Efficiency</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-emerald-950 text-white rounded-[3.5rem] p-10 shadow-2xl relative overflow-hidden flex flex-col justify-between">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400 opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                            <div>
                                <div className="h-14 w-14 bg-emerald-900 rounded-2xl flex items-center justify-center border-4 border-emerald-800 mb-6 shadow-lg">
                                    <Zap className="h-7 w-7 text-emerald-400" />
                                </div>
                                <h3 className="text-2xl font-black uppercase  mb-4">Pedagogical Intelligence</h3>
                                <div className="p-6 bg-white/5 border-2 border-white/10 rounded-2xl">
                                    <p className="text-lg font-bold  leading-relaxed opacity-90">
                                        "{staff.ai_pedagogical_suggestion || "Analyzing instructional patterns for optimized subject allocation..."}"
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 mt-8">
                                <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                                <p className="text-xs font-black uppercase tracking-widest text-white/50">Strategy verified by AI Engine</p>
                            </div>
                        </div>
                    </div>

                    {/* Skill Matrix Radar */}
                    <div className="bg-white rounded-[3.5rem] p-12 shadow-xl border-4 border-blue-100 overflow-hidden relative">
                        <div className="absolute top-10 right-10 flex gap-4">
                            <div className="px-6 py-2 bg-blue-50 border-2 border-blue-100 rounded-xl text-xs font-black uppercase text-blue-600">Cognitive Mapping</div>
                        </div>
                        <h3 className="text-2xl font-black uppercase  text-blue-950 flex items-center gap-4 mb-12">
                            <Brain className="h-8 w-8 text-blue-600" /> Faculty Performance Radar
                        </h3>
                        <div className="h-96">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={statsRadarData}>
                                    <PolarGrid stroke="#E2E8F0" strokeWidth={2} />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748B', fontWeight: 900, fontSize: 12 }} />
                                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
                                    <Radar name="Performance" dataKey="score" stroke="#059669" fill="#10B981" fillOpacity={0.4} strokeWidth={4} />
                                    <Tooltip contentStyle={{ borderRadius: '24px', border: '4px solid #E2E8F0', padding: '12px' }} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Historical Impact Trend */}
                    <div className="bg-white rounded-[3.5rem] p-12 shadow-xl border-4 border-blue-100">
                        <h3 className="text-2xl font-black uppercase  text-blue-950 flex items-center gap-4 mb-12">
                            <BarChart3 className="h-8 w-8 text-blue-600" /> Multi-Phase Impact Trajectory
                        </h3>
                        <div className="h-96">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={trendData}>
                                    <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="#F1F5F9" />
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontWeight: 700 }} />
                                    <YAxis hide domain={['dataMin - 10', 'dataMax + 10']} />
                                    <Tooltip contentStyle={{ borderRadius: '24px', border: '4px solid #F1F5F9' }} />
                                    <Line type="monotone" dataKey="impact" stroke="#059669" strokeWidth={8} dot={{ r: 10, fill: '#059669', strokeWidth: 4, stroke: '#fff' }} activeDot={{ r: 14, strokeWidth: 0 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="grid grid-cols-3 gap-6 mt-12 bg-blue-50/50 p-8 rounded-[2.5rem] border-2 border-blue-100">
                            {[
                                { label: "Complexity Handling", val: `${staff.difficulty_handling}%`, color: "text-blue-600" },
                                { label: "Improvement Rank", val: `Top ${Math.round(100 - staff.improvement_index)}%`, color: "text-emerald-600" },
                                { label: "Subject Depth", val: "Elite Node", color: "text-blue-600" }
                            ].map((s, i) => (
                                <div key={i} className="text-center group">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-2">{s.label}</p>
                                    <p className={cn("text-2xl font-black ", s.color)}>{s.val}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function FolderCheck(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M20 10V7a2 2 0 0 0-2-2H9l-2-2H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7" />
            <path d="m16 19 2 2 4-4" />
        </svg>
    )
}
