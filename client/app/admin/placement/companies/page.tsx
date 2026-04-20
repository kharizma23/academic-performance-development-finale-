"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { placementAPI } from "@/lib/api-placement";
import { motion } from "framer-motion";
import { Briefcase, Users, TrendingUp, ArrowRight, ArrowLeft } from "lucide-react";

interface Company {
 name: string;
 min_cgpa: number;
 min_readiness: number;
 required_skills: string[];
 eligible_students: number;
 average_package: number;
 category?: string;
}

export default function PlacementCompaniesPage() {
 const router = useRouter();
 const [companies, setCompanies] = useState<Company[]>([]);
 const [loading, setLoading] = useState(true);
 const [activeCategory, setActiveCategory] = useState("All");

 useEffect(() => {
 const loadCompanies = async () => {
 try {
 const data = await placementAPI.getCompaniesList();
 setCompanies(data || []);
 } catch (error) {
 console.error("Error loading companies:", error);
 } finally {
 setLoading(false);
 }
 };
 loadCompanies();
 }, []);

 const categories = ["All", ...Array.from(new Set(companies.map(c => c.category).filter(Boolean))) as string[]];
 const filteredCompanies = activeCategory === "All" 
 ? companies 
 : companies.filter(c => c.category === activeCategory);

 if (loading) {
 return (
 <div className="flex items-center justify-center min-h-screen bg-slate-50">
 <div className="w-8 h-8 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
 </div>
 );
 }

 return (
 <div className="min-h-screen bg-[#f1f5f9] p-4 md:p-8">
 <div className="max-w-6xl mx-auto space-y-8">
 {/* Compact Header */}
 <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
 <div className="space-y-4">
 <button 
 onClick={() => router.back()}
 className="text-[10px] font-black text-slate-400 hover:text-indigo-600 flex items-center gap-2 uppercase tracking-widest transition-all"
 >
 <ArrowLeft className="h-3 w-3" /> Previous Matrix
 </button>
 <div className="space-y-1">
 <h1 className="text-3xl font-black text-slate-900  uppercase">Hiring Matrix</h1>
 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
 <Briefcase className="h-4 w-4 text-indigo-600" />
 Monitoring {companies.length} Tier-1 Strategic Partners
 </p>
 </div>
 </div>
 
 <div className="flex flex-wrap gap-1.5 p-1 bg-slate-50 rounded-xl border border-slate-200">
 {categories.map(cat => (
 <button
 key={cat}
 onClick={() => setActiveCategory(cat)}
 className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
 activeCategory === cat ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-400 hover:bg-white'
 }`}
 >
 {cat}
 </button>
 ))}
 </div>
 </div>

 {/* Global Recruiting Footprint */}
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
 {filteredCompanies.map((company, idx) => (
 <motion.div
 key={idx}
 initial={{ opacity: 0, scale: 0.95 }}
 animate={{ opacity: 1, scale: 1 }}
 transition={{ delay: idx * 0.05 }}
 onClick={() => router.push(`/admin/placement/company/${encodeURIComponent(company.name)}`)}
 className="bg-white border border-slate-200 hover:border-indigo-400 rounded-2xl p-6 cursor-pointer transition-all hover:shadow-lg flex flex-col group h-full"
 >
 <div className="mb-6 flex justify-between items-start">
 <span className="px-3 py-1 bg-slate-100 rounded-lg text-[9px] font-black text-slate-500 uppercase tracking-widest border border-slate-200">
 {(company as any).category || 'General'}
 </span>
 <Briefcase className="h-5 w-5 text-slate-300 group-hover:text-indigo-600" />
 </div>

 <div className="mb-6">
 <h3 className="text-xl font-black text-slate-900 mb-1  group-hover:text-indigo-600 transition truncate uppercase">
 {company.name}
 </h3>
 <div className="flex items-center gap-1.5">
 <div className="h-2 w-2 rounded-full bg-emerald-500" />
 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Active Recruiting</p>
 </div>
 </div>

 <div className="grid grid-cols-2 gap-4 mb-6 border-y border-slate-50 py-4">
 <div>
 <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Min CGPA</p>
 <p className="text-lg font-black text-emerald-600 leading-none">{(company.min_cgpa ?? 0).toFixed(1)}</p>
 </div>
 <div className="text-right">
 <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Readiness</p>
 <p className="text-lg font-black text-orange-500 leading-none">{(company.min_readiness ?? 0).toFixed(1)}</p>
 </div>
 </div>

 <div className="p-4 bg-slate-50 rounded-xl mb-6 group-hover:bg-indigo-50 transition-all text-center flex-grow flex flex-col justify-center border border-slate-100">
 <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Package Index</p>
 <p className="text-2xl font-black text-slate-900 group-hover:text-indigo-700 transition leading-none">
 ₹{((company.average_package ?? 0) / 100000).toFixed(1)}L
 </p>
 </div>

 <div className="flex items-center justify-between text-indigo-600 font-black text-[9px] uppercase tracking-widest pt-4 border-t border-slate-50">
 <span>View Full Matrix</span>
 <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-all" />
 </div>
 </motion.div>
 ))}
 </div>
 </div>
 </div>
 );
}
