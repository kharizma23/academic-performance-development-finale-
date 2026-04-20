"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { placementAPI } from "@/lib/api-placement";
import { motion } from "framer-motion";
import { TrendingUp, Award, Users, ArrowLeft, Target, Briefcase, Star } from "lucide-react";

export default function PlacementAnalyticsPage() {
 const router = useRouter();
 const [loading, setLoading] = useState(true);
 const [overview, setOverview] = useState<any>(null);
 const [ranking, setRanking] = useState<any>([]);
 const [placed, setPlaced] = useState<any>([]);
 const [insights, setInsights] = useState<string[]>([]);

 useEffect(() => {
 const loadAnalytics = async () => {
 try {
 const [ov, rank, pc, ins] = await Promise.all([
 placementAPI.getOverview(),
 placementAPI.getPlacementRanking(),
 placementAPI.getPlacedStudents(),
 placementAPI.getPlacementInsights()
 ]);
 setOverview(ov);
 setRanking(rank.ranking || []);
 setPlaced(pc.placed_students || []);
 setInsights(ins.insights || []);
 } catch (error) {
 console.error("Error loading analytics:", error);
 } finally {
 setLoading(false);
 }
 };
 loadAnalytics();
 }, []);

 if (loading) {
 return (
 <div className="flex items-center justify-center min-h-screen bg-slate-50">
 <div className="w-8 h-8 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
 </div>
 );
 }

 return (
 <div className="min-h-screen bg-[#f1f5f9] p-4 md:p-8">
 <div className="max-w-6xl mx-auto space-y-6">
 {/* Compact Header */}
 <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
 <div className="space-y-1">
 <button 
 onClick={() => router.back()}
 className="text-[10px] font-black text-slate-400 hover:text-indigo-600 flex items-center gap-2 uppercase tracking-widest mb-2 transition-all"
 >
 <ArrowLeft className="h-3 w-3" /> Matrix Overview
 </button>
 <h1 className="text-3xl font-black text-slate-900  uppercase leading-none">Performance Index</h1>
 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mt-2">
 <TrendingUp className="h-4 w-4 text-emerald-600" /> Success Metrics & Predictive Analytics
 </p>
 </div>
 
 <div className="p-5 bg-slate-900 rounded-2xl border border-slate-800 flex items-center gap-6 shadow-xl">
 <div className="text-center">
 <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1.5">Success Pool</p>
 <p className="text-2xl font-black text-white leading-none">{overview?.placement_percentage.toFixed(1)}%</p>
 </div>
 <div className="h-8 w-px bg-white/10 rounded-full" />
 <div className="text-center">
 <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1.5">Confidence</p>
 <p className="text-xs font-black text-emerald-400 leading-none">OPTIMAL</p>
 </div>
 </div>
 </div>

 {/* Tactical Metric Cards */}
 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
 <MetricCard label="Candidate Portfolio" value={overview?.total_students || 0} icon={Users} color="text-indigo-600" bg="bg-white" />
 <MetricCard label="Acquisitions" value={overview?.placed_students || 0} icon={Briefcase} color="text-emerald-600" bg="bg-white" />
 <MetricCard label="Readiness Quota" value="8.4/10" icon={Target} color="text-amber-600" bg="bg-white" />
 </div>

 {/* Intelligence Grid */}
 <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
 {/* AI Insights */}
 <div className="lg:col-span-12">
 <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
 <h3 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-3 uppercase ">
 <Award className="h-5 w-5 text-indigo-600" /> Strategic Matrix
 </h3>
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
 {insights.map((insight, idx) => (
 <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs font-bold text-slate-600 uppercase  leading-relaxed shadow-inner">
 {insight}
 </div>
 ))}
 </div>
 </div>
 </div>

 {/* High-Performance Nodes */}
 <div className="lg:col-span-7">
 <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm h-full">
 <h3 className="text-xl font-black text-slate-900 mb-8  flex items-center gap-3 uppercase">
 <Star className="h-5 w-5 text-amber-500" /> High-Performance Nodes
 </h3>
 <div className="space-y-2">
 {ranking.map((student: any, idx: number) => (
 <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-indigo-200 transition-all group">
 <div className="flex items-center gap-4">
 <div className="h-8 w-8 bg-white rounded-lg flex items-center justify-center font-black text-xs text-slate-300 group-hover:text-amber-500 transition-all border border-slate-100 shadow-sm">#{student.rank}</div>
 <div>
 <p className="text-sm font-black text-slate-800 leading-none">{student.name}</p>
 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1.5">{student.dept} • Year {student.year}</p>
 </div>
 </div>
 <div className="text-right">
 <p className="text-lg font-black text-amber-600 leading-none">{student.readiness}%</p>
 <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">Readiness</p>
 </div>
 </div>
 ))}
 </div>
 </div>
 </div>

 {/* Acquisition Analytics */}
 <div className="lg:col-span-5 bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-xl space-y-8">
 <h3 className="text-xl font-black text-white  flex items-center gap-3 uppercase">
 <Briefcase className="h-5 w-5 text-emerald-400" /> Acquisition Stream
 </h3>
 <div className="space-y-4">
 {placed.map((item: any, idx: number) => (
 <div key={idx} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all group">
 <div className="space-y-1">
 <p className="text-sm font-black text-white leading-none">{item.name}</p>
 <p className="text-emerald-400 font-black text-[9px] uppercase tracking-widest">{item.company}</p>
 </div>
 <div className="text-right">
 <p className="text-lg font-black text-white leading-none">₹{(item.package / 100000).toFixed(1)}L</p>
 <p className="text-[8px] font-black text-white/30 uppercase tracking-widest mt-1">LPA</p>
 </div>
 </div>
 ))}
 </div>
 </div>
 </div>
 </div>
 </div>
 );
}

function MetricCard({ label, value, icon: Icon, color, bg }: any) {
 return (
 <div className={`p-6 rounded-2xl ${bg} border border-slate-200 shadow-sm transition-all hover:border-indigo-400 group`}>
 <div className="flex items-center justify-between mb-4">
 <div className="h-8 w-8 bg-slate-50 rounded-lg flex items-center justify-center shadow-sm">
 <Icon className={`h-4 w-4 ${color}`} />
 </div>
 <p className={`text-2xl font-black ${color}  leading-none`}>{value}</p>
 </div>
 <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{label}</p>
 </div>
 );
}
