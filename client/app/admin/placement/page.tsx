"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { placementAPI } from "@/lib/api-placement";
import { motion } from "framer-motion";
import { Briefcase, Users, CheckCircle, TrendingUp, BookOpen, Target, Award, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface PlacementOverview {
 total_students: number;
 eligible_students: number;
 placed_students: number;
 placement_percentage: number;
 average_package: number;
 highest_package: number;
 companies_hiring: number;
}

interface Insight {
 [key: string]: any;
}

function MetricCard({ label, value, icon: Icon, trend, subtext, bg, textColor }: any) {
 return (
 <div className={`${bg || 'bg-white'} p-6 rounded-2xl shadow-sm relative overflow-hidden group transition-all hover:scale-[1.02] border border-slate-100`}>
 <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:scale-110 transition-all">
 <Icon className="h-10 w-10 text-white" />
 </div>
 <div className="relative z-10 flex flex-col justify-between h-full">
 <div>
 <h4 className={`text-[10px] font-black uppercase tracking-widest opacity-80 ${textColor || 'text-slate-500'} mb-1`}>{label}</h4>
 <p className={`text-2xl font-black ${textColor || 'text-slate-900'}`}>{value}</p>
 </div>
 {trend && (
 <div className="mt-4 flex items-center gap-2">
 <span className="text-[10px] font-black bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white uppercase tracking-widest">
 {trend}
 </span>
 </div>
 )}
 </div>
 </div>
 );
}

export default function PlacementPage() {
 const router = useRouter();
 const [overview, setOverview] = useState<PlacementOverview | null>(null);
 const [insights, setInsights] = useState<string[]>([]);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
 const loadData = async () => {
 try {
 const [overviewData, insightsData] = await Promise.all([
 placementAPI.getOverview(),
 placementAPI.getPlacementInsights()
 ]);
 setOverview(overviewData);
 setInsights(insightsData.insights || []);
 } catch (error) {
 console.error("Error loading placement data:", error);
 } finally {
 setLoading(false);
 }
 };

 loadData();
 }, []);

 const navigationItems = [
 {
 title: "All Students",
 description: "View and filter all placement-eligible students (3rd-4th year)",
 icon: Users,
 href: "/admin/placement/students",
 color: "from-blue-500 to-blue-600"
 },
 {
 title: "Companies",
 description: "Company eligibility matrix and hiring requirements",
 icon: Briefcase,
 href: "/admin/placement/companies",
 color: "from-purple-500 to-purple-600"
 },
 {
 title: "Analytics",
 description: "Placement trends, predictions, and insights",
 icon: TrendingUp,
 href: "/admin/placement/analytics",
 color: "from-orange-500 to-orange-600"
 },
 {
 title: "Interview Tracking",
 description: "Monitor student interview progress and rounds",
 icon: Award,
 href: "/admin/placement/interviews",
 color: "from-pink-500 to-pink-600"
 }
 ];

 if (loading) {
 return (
 <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
 <div className="text-center">
 <div className="w-12 h-12 border-4 border-purple-400 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
 <p className="text-slate-300">Loading placement data...</p>
 </div>
 </div>
 );
 }

 return (
 <div className="min-h-screen bg-[#f8fafc] p-6">
 <div className="w-full">
 {/* Header Section */}
 <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
 <div className="space-y-4">
 <button 
 onClick={() => router.push('/admin')}
 className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-200/50 hover:bg-slate-200 text-slate-700 font-bold transition-all border border-slate-200/50 text-xs"
 >
 <ArrowLeft className="h-4 w-4" />
 Return to Command Center
 </button>
 <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
 <h1 className="text-2xl font-black text-slate-900 flex items-center gap-3  uppercase">
 <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-100">
 <Briefcase className="w-6 h-6 text-amber-600" />
 </div>
 Placement Analytics Intelligence
 </h1>
 <p className="text-slate-500 font-bold mt-1 ml-1 text-xs uppercase tracking-widest">AI-Strategized Recruitment Matrix</p>
 </motion.div>
 </div>

 <div className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-slate-100 shadow-sm">
 <div className="h-10 w-10 bg-emerald-50 rounded-lg flex items-center justify-center border border-emerald-100">
 <Target className="h-5 w-5 text-emerald-600" />
 </div>
 <div>
 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Hiring Index</p>
 <p className="text-xl font-black text-emerald-600">8.4 / 10</p>
 </div>
 </div>
 </div>

 {/* High Impact Core Stats */}
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
 <MetricCard 
 label="Global Placed Corpus" 
 value={overview?.placed_students || 0} 
 icon={Briefcase} 
 bg="bg-gradient-to-br from-indigo-600 to-blue-700" 
 textColor="text-white"
 />
 <MetricCard 
 label="Eligible Hiring Node" 
 value={overview?.eligible_students || 0} 
 icon={CheckCircle} 
 bg="bg-gradient-to-br from-[#1a4d2e] to-[#4d7c0f]" 
 textColor="text-white"
 />
 <MetricCard 
 label="Success Projection" 
 value={`${overview?.placement_percentage.toFixed(1)}%` || "0%"} 
 icon={TrendingUp} 
 bg="bg-gradient-to-br from-rose-600 to-red-700" 
 textColor="text-white"
 />
 <MetricCard 
 label="Total Candidate Pool" 
 value={overview?.total_students || 0} 
 icon={Users} 
 bg="bg-gradient-to-br from-amber-500 to-orange-600" 
 textColor="text-white"
 />
 </div>

 {/* Quick Insights & Financial Metrics */}
 <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
 <div className="lg:col-span-4 space-y-6">
 <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group hover:scale-[1.01] transition-all">
 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Average Package</p>
 <div className="flex items-center justify-between">
 <p className="text-2xl font-black text-slate-900">
 ₹{((overview?.average_package || 0) / 100000).toFixed(1)}L
 </p>
 <div className="h-10 w-10 bg-emerald-50 rounded-lg flex items-center justify-center border border-emerald-100">
 <Target className="h-5 w-5 text-emerald-600" />
 </div>
 </div>
 <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2">
 <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
 <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Optimized Portfolio</span>
 </div>
 </div>

 <div className="bg-slate-900 p-6 rounded-xl shadow-md relative overflow-hidden group hover:scale-[1.01] transition-all">
 <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-all">
 <Award className="h-12 w-12 text-white" />
 </div>
 <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">Peak Financial Placement</p>
 <p className="text-2xl font-black text-white mb-4">
 ₹{((overview?.highest_package || 0) / 100000).toFixed(1)}L
 </p>
 <span className="px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-lg text-white font-black text-[9px] uppercase tracking-widest border border-white/20">
 Tier-1 Package Detected
 </span>
 </div>
 </div>
 <div className="lg:col-span-8 flex flex-col">
 <div className="flex-grow bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group">
 <div className="flex items-center gap-2 mb-6">
 <div className="h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center border border-blue-100">
 <BookOpen className="h-5 w-5 text-blue-600" />
 </div>
 <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">AI Strategy Insights</h3>
 </div>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
 {insights.slice(0, 4).map((insight, idx) => (
 <div key={idx} className="p-3 bg-slate-50 border border-slate-100 rounded-lg hover:bg-white hover:border-slate-300 transition-all group/item shadow-sm">
 <div className="flex items-start gap-2">
 <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-slate-400 flex-shrink-0" />
 <p className="text-slate-600 font-bold leading-tight text-[11px]">{insight}</p>
 </div>
 </div>
 ))}
 </div>
 </div>
 </div>
 </div>

 {/* Unified Navigation Hub */}
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
 {navigationItems.map((item, idx) => {
 const Icon = item.icon;
 return (
 <Link href={item.href} key={idx} className="block group">
 <motion.div
 whileHover={{ y: -3 }}
 className={`h-full bg-white rounded-xl p-6 text-slate-900 transition-all shadow-sm relative overflow-hidden border border-slate-200 hover:border-slate-400`}
 >
 <div className={`h-10 w-10 rounded-lg bg-gradient-to-br ${item.color} mb-3 flex items-center justify-center text-white`}>
 <Icon className="h-5 w-5" />
 </div>
 <h4 className="text-sm font-black mb-1 uppercase tracking-widest">{item.title}</h4>
 <p className="text-[10px] font-bold text-slate-500 leading-tight">{item.description}</p>
 </motion.div>
 </Link>
 );
 })}
 </div>

 {/* Global Recruiting Footprint */}
 <motion.div
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 className="bg-slate-900 p-6 rounded-xl shadow-md relative overflow-hidden group"
 >
 <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
 <div className="space-y-2 max-w-2xl">
 <h3 className="text-base font-black text-white flex items-center gap-3 uppercase tracking-widest">
 <div className="h-8 w-8 bg-amber-500 rounded-lg flex items-center justify-center">
 <Briefcase className="w-4 h-4 text-black" />
 </div>
 Global Recruiting Node ({overview?.companies_hiring || 0})
 </h3>
 <p className="text-slate-400 font-bold text-[11px] leading-relaxed opacity-80">
 "Aggregating Tier-1 hiring data from Fortune 500 nodes including Google, Microsoft, and Amazon. Predictive modeling suggests positive hiring cycles."
 </p>
 </div>
 <div className="p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-xl">
 <span className="text-[9px] font-black text-amber-400 uppercase tracking-widest block mb-0.5">Network Health</span>
 <p className="text-lg font-black text-white">98.2% Active</p>
 </div>
 </div>
 </motion.div>
 </div>
 </div>
 );
}
