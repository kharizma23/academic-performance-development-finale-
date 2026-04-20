"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { placementAPI } from "@/lib/api-placement";
import { motion, AnimatePresence } from "framer-motion";
import { Target, Award, Clock, ArrowLeft, Search, Filter, Briefcase, User, Calendar } from "lucide-react";

export default function InterviewTrackingPage() {
 const router = useRouter();
 const [data, setData] = useState<any>(null);
 const [loading, setLoading] = useState(true);
 const [search, setSearch] = useState("");
 const [activeFilter, setActiveFilter] = useState("All");

 useEffect(() => {
 const loadInterviews = async () => {
 try {
 const res = await placementAPI.getInterviewTracking();
 setData(res);
 } catch (error) {
 console.error("Error loading interviews:", error);
 } finally {
 setLoading(false);
 }
 };
 loadInterviews();
 }, []);

 const filteredInterviews = data?.interviews?.filter((i: any) => {
 const matchesSearch = i.student_name.toLowerCase().includes(search.toLowerCase()) || 
 i.company.toLowerCase().includes(search.toLowerCase());
 const matchesFilter = activeFilter === "All" || i.status === activeFilter;
 return matchesSearch && matchesFilter;
 }) || [];

 if (loading) {
 return (
 <div className="flex items-center justify-center min-h-screen bg-white">
 <div className="text-center">
 <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-6"></div>
 <p className="text-slate-500 font-black text-xl uppercase tracking-[0.2em]">Synchronizing Interview Nodes...</p>
 </div>
 </div>
 );
 }

 return (
 <div className="min-h-screen bg-[#f8fafc] p-6 md:p-12">
 <div className="w-full">
 {/* Header Section */}
 <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-16">
 <div className="space-y-6">
 <button 
 onClick={() => router.back()}
 className="flex items-center gap-3 px-8 py-3 rounded-full bg-white hover:bg-slate-50 text-slate-700 font-black transition-all border-2 border-slate-100 shadow-xl"
 >
 <ArrowLeft className="h-6 w-6" />
 Return to Intelligence Overview
 </button>
 <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
 <h1 className="text-7xl font-black text-slate-900 ">
 Recruitment Pipeline Tracker
 </h1>
 <p className="text-slate-500 font-black mt-4 ml-1 text-2xl flex items-center gap-4">
 <Target className="w-8 h-8 text-indigo-600" />
 Monitoring {data?.under_process + data?.offers_received} Global Interview Nodes
 </p>
 </motion.div>
 </div>

 <div className="flex items-center gap-8 p-6 bg-white rounded-[3rem] border-4 border-slate-50 shadow-2xl">
 <div className="flex items-center gap-6 pr-8 border-r-2 border-slate-100">
 <div className="h-20 w-20 bg-emerald-50 rounded-3xl flex items-center justify-center border-2 border-emerald-100">
 <Award className="h-10 w-10 text-emerald-600" />
 </div>
 <div>
 <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Offers Synced</p>
 <p className="text-5xl font-black text-emerald-600">{data?.offers_received}</p>
 </div>
 </div>
 <div className="flex items-center gap-6">
 <div className="h-20 w-20 bg-amber-50 rounded-3xl flex items-center justify-center border-2 border-amber-100">
 <Clock className="h-10 w-10 text-amber-600" />
 </div>
 <div>
 <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Active Processing</p>
 <p className="text-5xl font-black text-amber-600">{data?.under_process}</p>
 </div>
 </div>
 </div>
 </div>

 {/* Global Filter Matrix */}
 <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16">
 <div className="lg:col-span-8">
 <div className="relative group">
 <Search className="absolute left-8 top-1/2 -translate-y-1/2 h-8 w-8 text-slate-400 group-focus-within:text-indigo-600 transition-all font-black" />
 <input 
 type="text"
 placeholder="SEARCH BY CANDIDATE OR CORPORATE NODE..."
 value={search}
 onChange={(e) => setSearch(e.target.value)}
 className="w-full bg-white border-4 border-slate-100 rounded-full py-8 pl-24 pr-12 text-2xl font-black text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-indigo-200 focus:ring-4 focus:ring-indigo-100/50 shadow-2xl transition-all uppercase "
 />
 </div>
 </div>
 <div className="lg:col-span-4 flex items-center gap-4 bg-white p-4 rounded-full border-4 border-slate-50 shadow-2xl overflow-x-auto">
 {["All", "Offer Received", "Under Process"].map(filter => (
 <button
 key={filter}
 onClick={() => setActiveFilter(filter)}
 className={`whitespace-nowrap px-8 py-4 rounded-full font-black text-sm uppercase tracking-widest transition-all ${
 activeFilter === filter 
 ? 'bg-slate-900 text-white shadow-xl scale-105' 
 : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
 }`}
 >
 {filter}
 </button>
 ))}
 </div>
 </div>

 {/* Dynamic Interview Nodes */}
 <div className="grid grid-cols-1 gap-8">
 <AnimatePresence mode="popLayout">
 {filteredInterviews.map((interview: any, idx: number) => (
 <motion.div
 key={interview.id}
 layout
 initial={{ opacity: 0, scale: 0.95 }}
 animate={{ opacity: 1, scale: 1 }}
 exit={{ opacity: 0, scale: 0.95 }}
 transition={{ delay: idx * 0.05 }}
 className="bg-white border-4 border-slate-50 hover:border-indigo-100 rounded-[3.5rem] p-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10 transition-all hover:shadow-2xl hover:shadow-indigo-500/10 group overflow-hidden relative"
 >
 <div className="absolute top-0 left-0 w-3 h-full bg-slate-100 group-hover:bg-indigo-500 transition-all" />
 
 <div className="flex flex-col lg:flex-row items-start lg:items-center gap-10 flex-grow">
 <div className="h-24 w-24 bg-slate-50 rounded-3xl flex items-center justify-center border-2 border-slate-100 shrink-0 group-hover:bg-indigo-50 group-hover:border-indigo-200 transition-all">
 <User className="h-10 w-10 text-slate-400 group-hover:text-indigo-600 transition-all" />
 </div>
 
 <div className="space-y-3 min-w-[300px]">
 <h3 className="text-4xl font-black text-slate-900 ">{interview.student_name}</h3>
 <div className="flex items-center gap-4">
 <div className="px-5 py-2 bg-indigo-50 rounded-full text-indigo-700 font-black text-xs uppercase tracking-[0.2em] border border-indigo-100 flex items-center gap-2">
 <Briefcase className="h-4 w-4" />
 {interview.company}
 </div>
 <div className="px-5 py-2 bg-slate-100 rounded-full text-slate-500 font-black text-xs uppercase tracking-[0.2em] border border-slate-200">
 {interview.round}
 </div>
 </div>
 </div>
 </div>

 <div className="flex items-center gap-12 shrink-0">
 <div className="text-right space-y-2">
 <span className="text-xs font-black text-slate-400 uppercase tracking-widest block">Scheduled Node</span>
 <div className="flex items-center gap-3 justify-end">
 <Calendar className="h-5 w-5 text-indigo-500" />
 <span className="text-2xl font-black text-slate-800 ">{interview.date}</span>
 </div>
 </div>

 <div className={`px-10 py-5 rounded-[2rem] font-black text-xl uppercase tracking-widest border-4 ${
 interview.status === "Offer Received"
 ? "bg-emerald-50 text-emerald-600 border-emerald-100 shadow-xl shadow-emerald-500/10"
 : "bg-amber-50 text-amber-600 border-amber-100 shadow-xl shadow-amber-500/10"
 }`}>
 {interview.status}
 </div>
 </div>
 </motion.div>
 ))}
 </AnimatePresence>

 {filteredInterviews.length === 0 && (
 <div className="text-center py-40 bg-white rounded-[4rem] border-4 border-dashed border-slate-100">
 <Target className="h-32 w-32 border-slate-200 mx-auto mb-10 text-slate-100" />
 <p className="text-5xl font-black text-slate-200  uppercase">No Active Nodes Detected</p>
 </div>
 )}
 </div>
 </div>
 </div>
 );
}
