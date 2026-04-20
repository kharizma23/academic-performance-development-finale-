"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { placementAPI } from "@/lib/api-placement";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Users, TrendingUp, ArrowRight, User } from "lucide-react";

interface PlacementStudent {
 id: string;
 name: string;
 roll_number: string;
 department: string;
 year: number;
 cgpa: number;
 readiness_score: number;
 eligible_companies: number;
 top_match: string;
 placement_probability: number;
 status: string;
}

export default function PlacementStudentsPage() {
 const router = useRouter();
 const [students, setStudents] = useState<PlacementStudent[]>([]);
 const [filteredStudents, setFilteredStudents] = useState<PlacementStudent[]>([]);
 const [loading, setLoading] = useState(true);
 const [searchTerm, setSearchTerm] = useState("");
 const [departmentFilter, setDepartmentFilter] = useState("All");
 const [yearFilter, setYearFilter] = useState("All");
 const [statusFilter, setStatusFilter] = useState("All");

 const DEPARTMENTS = ["All", "AIML", "CSE", "IT", "ECE", "EEE", "MECH", "BME", "CIVIL", "BT", "AIDS", "AGRI", "EIE", "MECHATRONICS", "FT", "FD"];
 const YEARS = ["All", "3", "4"];
 const STATUSES = ["All", "Ready", "In Progress", "Needs Improvement"];

 useEffect(() => {
 const loadStudents = async () => {
 try {
 const data = await placementAPI.getAllPlacementStudents();
 setStudents(data.students || []);
 setFilteredStudents(data.students || []);
 } catch (error) {
 console.error("Error loading students:", error);
 } finally {
 setLoading(false);
 }
 };
 loadStudents();
 }, []);

 useEffect(() => {
 let filtered = [...students];
 if (searchTerm) {
 filtered = filtered.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.roll_number.toLowerCase().includes(searchTerm.toLowerCase()));
 }
 if (departmentFilter !== "All") filtered = filtered.filter(s => s.department === departmentFilter);
 if (yearFilter !== "All") filtered = filtered.filter(s => s.year.toString() === yearFilter);
 if (statusFilter !== "All") filtered = filtered.filter(s => s.status === statusFilter);
 setFilteredStudents(filtered);
 }, [searchTerm, departmentFilter, yearFilter, statusFilter, students]);

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
 <h1 className="text-3xl font-black text-slate-900  uppercase">Candidate Matrix</h1>
 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
 <Users className="h-4 w-4 text-indigo-600" />
 Monitoring {students.length} Tier-1 Strategic Assets
 </p>
 </div>
 
 <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
 <StatItem label="Global Active" value={filteredStudents.length} />
 <div className="w-px h-6 bg-slate-200" />
 <StatItem label="Status" value="ACTIVE" color="text-indigo-600" />
 </div>
 </div>

 {/* Global Controls */}
 <div className="grid grid-cols-1 gap-4">
 <div className="relative">
 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
 <input 
 type="text"
 placeholder="Search candidate identity..."
 value={searchTerm}
 onChange={(e) => setSearchTerm(e.target.value)}
 className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm font-bold text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
 />
 </div>
 
 <div className="flex flex-wrap items-center gap-2 bg-white p-2 rounded-xl border border-slate-200 shadow-sm overflow-x-auto no-scrollbar">
 <FilterGroup label="Dept" options={DEPARTMENTS} value={departmentFilter} onChange={setDepartmentFilter} />
 <div className="w-px h-8 bg-slate-100 hidden lg:block mx-2" />
 <FilterGroup label="Year" options={YEARS} value={yearFilter} onChange={setYearFilter} />
 <div className="w-px h-8 bg-slate-100 hidden lg:block mx-2" />
 <FilterGroup label="Status" options={STATUSES} value={statusFilter} onChange={setStatusFilter} />
 </div>
 </div>

 {/* Candidate Success Stream */}
 <div className="space-y-4">
 <AnimatePresence mode="popLayout">
 {filteredStudents.map((student, idx) => (
 <motion.div
 key={student.id}
 layout
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, scale: 0.95 }}
 onClick={() => router.push(`/admin/placement/student/${student.id}`)}
 className="bg-white border border-slate-200 hover:border-indigo-400 rounded-xl p-5 cursor-pointer transition-all hover:shadow-lg flex flex-col xl:flex-row items-center justify-between gap-6 group relative overflow-hidden"
 >
 <div className="absolute top-0 left-0 w-1 h-full bg-slate-100 group-hover:bg-indigo-600 transition-colors" />
 
 <div className="flex items-center gap-5 flex-grow w-full">
 <div className="h-10 w-10 bg-slate-50 rounded-lg flex items-center justify-center border border-slate-200 group-hover:bg-indigo-50 shrink-0 transition-colors">
 <User className="h-4 h-4 text-slate-300 group-hover:text-indigo-600 transition" />
 </div>
 
 <div className="space-y-1 flex-grow">
 <div className="flex items-center gap-3">
 <h3 className="text-lg font-black text-slate-900 group-hover:text-indigo-600 transition truncate">{student.name}</h3>
 <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
 student.status === "Ready" ? 'bg-emerald-100 text-emerald-700' : 
 student.status === "In Progress" ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
 }`}>
 {student.status}
 </div>
 </div>
 <div className="flex items-center gap-4 flex-wrap text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
 <span className="text-slate-900 uppercase">{student.roll_number}</span>
 <span className="text-indigo-600">{student.department}</span>
 <span>CGPA: <span className="text-slate-900">{student.cgpa.toFixed(2)}</span></span>
 <span>Readiness: <span className="text-orange-600">{student.readiness_score.toFixed(2)}/10</span></span>
 </div>
 </div>
 </div>

 <div className="flex items-center gap-8 shrink-0 bg-slate-50 px-4 py-3 rounded-lg border border-slate-100 w-full xl:w-auto justify-around">
 <div className="text-center">
 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Eligibility</p>
 <p className="text-lg font-black text-indigo-700 leading-none">{student.eligible_companies}</p>
 </div>
 <div className="w-px h-6 bg-slate-200" />
 <div className="text-center">
 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Probability</p>
 <p className="text-lg font-black text-orange-600 leading-none">{student.placement_probability.toFixed(0)}%</p>
 </div>
 </div>
 </motion.div>
 ))}
 </AnimatePresence>
 </div>
 </div>
 </div>
 );
}

function StatItem({ label, value, color = "text-slate-900" }: any) {
 return (
 <div className="text-center px-4">
 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
 <p className={`text-xl font-black ${color} leading-none `}>{value}</p>
 </div>
 );
}

function FilterGroup({ label, options, value, onChange }: any) {
 return (
 <div className="flex flex-col gap-1.5 min-w-[200px]">
 <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</span>
 <div className="flex flex-wrap gap-1">
 {options.map((opt: string) => (
 <button
 key={opt}
 onClick={() => onChange(opt)}
 className={`px-3 py-1 rounded-md font-black text-[8px] uppercase tracking-wider transition-all ${
 value === opt ? 'bg-slate-900 text-white shadow-sm font-bold' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
 }`}
 >
 {opt}
 </button>
 ))}
 </div>
 </div>
 );
}
