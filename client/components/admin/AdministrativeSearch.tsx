"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
 Search, RefreshCw, ArrowUpRight, Trash2, Loader2,
 ChevronDown, ChevronUp, Mail, Phone, GraduationCap,
 TrendingUp, Shield, Zap, Star, BookOpen, BarChart3,
 Key, Eye, EyeOff, Copy, CheckCheck, X, Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
 ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis,
 PolarRadiusAxis, Radar, Tooltip, PieChart, Pie, Cell,
 BarChart, Bar, XAxis, YAxis, CartesianGrid
} from "recharts";
import { cn } from "@/lib/utils";

interface AdministrativeSearchProps {
 userType: 'student' | 'staff';
 setUserType: (type: 'student' | 'staff') => void;
 searchQuery: string;
 setSearchQuery: (query: string) => void;
 isSearching?: boolean;
 searchResults: any[];
 handleDeleteUser: (id: string) => void;
 setIsAddStudentOpen: (open: boolean) => void;
 setIsAddStaffOpen: (open: boolean) => void;
 pagination: { total: number, page: number, pages: number, limit: number };
 handlePageChange: (page: number) => void;
 deptFilter: string;
 setDeptFilter: (dept: string) => void;
 yearFilter: string;
 setYearFilter: (year: string) => void;
 handleResetFilters: () => void;
}

const demoStaff = [
  {
    id: "demo-staff-1",
    name: "Varun Das",
    staff_id: "STF90374",
    department: "ECE",
    designation: "Professor",
    personal_phone: "9876543210",
    personal_email: "varun@gmail.com",
    handled_subjects: ["DBMS", "Operating Systems"],
    primary_skill: "AI/ML",
    publications_count: 12,
    experience_years: 8,
    status: "Active",
    user: {
      institutional_email: "varun.ece@college.com",
      plain_password: "Var@1234",
      role: "faculty"
    }
  },
  {
    id: "demo-staff-2",
    name: "Anita Sharma",
    staff_id: "STF90375",
    department: "CSE",
    designation: "Assistant Professor",
    personal_phone: "9876543211",
    personal_email: "anita@gmail.com",
    handled_subjects: ["DSA", "Python"],
    primary_skill: "Data Science",
    publications_count: 8,
    experience_years: 5,
    status: "On Campus",
    user: {
      institutional_email: "anita.cse@college.com",
      plain_password: "Ani@1234",
      role: "faculty"
    }
  }
];

function CredentialCard({ user }: { user: any }) {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const officialEmail = user.user?.institutional_email || user.user?.email || "—";
  const personalEmail = user.personal_email || "—";
  const password = user.user?.plain_password || "—";

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="bg-white rounded-xl p-3 space-y-3 border border-slate-100 shadow-sm">
      <div className="flex items-center gap-2">
        <Shield className="h-3 w-3 text-indigo-600" />
        <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Institutional Credentials</span>
      </div>
      
      <div className="space-y-2">
        {/* Official Email */}
        <div className="space-y-1">
          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest px-1">Official ID</p>
          <div className="flex items-center justify-between bg-slate-50 rounded-lg px-2 py-1.5 border border-slate-200">
            <span className="text-[10px] font-bold text-slate-700 break-all">{officialEmail}</span>
            <button onClick={() => copy(officialEmail, "off")} className="text-slate-400 hover:text-slate-900">
              {copied === "off" ? <CheckCheck className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
            </button>
          </div>
        </div>

        {/* Personal Email */}
        <div className="space-y-1">
          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest px-1">Personal Contact</p>
          <div className="flex items-center justify-between bg-slate-50 rounded-lg px-2 py-1.5 border border-slate-200">
            <span className="text-[10px] font-bold text-slate-700 break-all">{personalEmail}</span>
            <button onClick={() => copy(personalEmail, "pers")} className="text-slate-400 hover:text-slate-900">
              {copied === "pers" ? <CheckCheck className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
            </button>
          </div>
        </div>

        {/* Access Code */}
        <div className="space-y-1">
          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest px-1">Security Token (Password)</p>
          <div className="flex items-center justify-between bg-slate-900 rounded-lg px-2 py-1.5 border border-slate-800">
            <span className="text-[10px] font-mono font-bold text-white tracking-widest">{visible ? password : "••••••••"}</span>
            <div className="flex items-center gap-2">
              <button onClick={() => setVisible(!visible)} className="text-slate-500 hover:text-white">
                {visible ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
              </button>
              <button onClick={() => copy(password, "pass")} className="text-slate-500 hover:text-white">
                {copied === "pass" ? <CheckCheck className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StaffAnalysisPanel({ user }: { user: any }) {
  return (
    <div className="mt-3 grid grid-cols-1 lg:grid-cols-12 gap-4 animate-in fade-in duration-500">
      <div className="lg:col-span-3 space-y-3">
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: "Experience", value: `${user.experience_years || 5} Years`, icon: "⌛", color: "text-amber-500" },
            { label: "Rating", value: `${(user.student_feedback_rating || 4.5).toFixed(1)}/5`, icon: "⭐", color: "text-blue-500" },
            { label: "Publications", value: user.publications_count || 3, icon: "📚", color: "text-emerald-500" },
            { label: "Skills", value: user.primary_skill || "Core", icon: "🛠", color: "text-rose-500" },
          ].map((m, i) => (
            <div key={i} className="bg-slate-50/50 rounded-xl p-3 border border-slate-100 flex flex-col items-center justify-center text-center group hover:bg-white hover:shadow-sm transition-all">
              <span className={cn("text-lg mb-1", m.color)}>{m.icon}</span>
              <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest">{m.label}</p>
              <p className="text-sm font-black text-slate-900">{m.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="lg:col-span-5 space-y-3">
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm h-full flex flex-col">
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Users className="h-3 w-3" /> Faculty Metadata
          </p>
          <div className="grid grid-cols-2 gap-x-6 gap-y-4 flex-1">
             <div>
               <p className="text-[8px] font-bold text-slate-400 uppercase">Department</p>
               <p className="text-[11px] font-black text-slate-900 uppercase">{user.department || user.dept || "General"}</p>
             </div>
             <div>
               <p className="text-[8px] font-bold text-slate-400 uppercase">Designation</p>
               <p className="text-[11px] font-black text-slate-900 uppercase">{user.designation || "Lecturer"}</p>
             </div>
             <div>
               <p className="text-[8px] font-bold text-slate-400 uppercase">Expertise</p>
               <p className="text-[11px] font-black text-slate-900 uppercase font-mono">{user.primary_skill || user.expertise || "Core"}</p>
             </div>
             <div>
               <p className="text-[8px] font-bold text-slate-400 uppercase">Staff ID</p>
               <p className="text-[11px] font-black text-slate-900 uppercase">{user.staff_id || "—"}</p>
             </div>
             <div>
               <p className="text-[8px] font-bold text-slate-400 uppercase">Phone</p>
               <p className="text-[11px] font-black text-slate-900">{user.personal_phone || user.phone || "—"}</p>
             </div>
             <div>
               <p className="text-[8px] font-bold text-slate-400 uppercase">Office Location</p>
               <p className="text-[11px] font-black text-slate-900 uppercase">Academic Block 1</p>
             </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-4 flex flex-col justify-between gap-3">
        <CredentialCard user={user} />
        <Link href={`/admin/staff/${user.id}`} className="block">
          <Button size="sm" className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl h-12 text-[10px] font-black uppercase tracking-widest border-none">
            Open Full Faculty Profile
          </Button>
        </Link>
      </div>
    </div>
  );
}

function StudentAnalysisPanel({ user }: { user: any }) {
  const cgpa = user.current_cgpa || 0;
  const dna = user.academic_dna_score || 0;
  const readiness = user.career_readiness_score || 0;

  const radarData = [
    { subject: "GPA", score: (cgpa / 10) * 100 },
    { subject: "DNA", score: dna },
    { subject: "Readiness", score: readiness },
    { subject: "Growth", score: Math.min((user.growth_index || 0) * 20, 100) },
    { subject: "Attendance", score: user.attendance_percentage || 85 },
  ];

  return (
    <div className="mt-3 grid grid-cols-1 lg:grid-cols-12 gap-4 animate-in fade-in duration-500">
      {/* 1. Core Intelligence & Risk */}
      <div className="lg:col-span-3 space-y-3">
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: "CGPA", value: cgpa.toFixed(2), icon: "⭐", color: "text-amber-500" },
            { label: "Attendance", value: `${(user.attendance_percentage || 85)}%`, icon: "⏱", color: "text-blue-500" },
            { label: "DNA Index", value: `${dna.toFixed(1)}%`, icon: "🧬", color: "text-emerald-500" },
            { label: "Career Ready", value: `${readiness.toFixed(1)}%`, icon: "⚡", color: "text-rose-500" },
          ].map((m, i) => (
            <div key={i} className="bg-slate-50/50 rounded-xl p-3 border border-slate-100 flex flex-col items-center justify-center text-center group hover:bg-white hover:shadow-sm transition-all">
              <span className={cn("text-lg mb-1", m.color)}>{m.icon}</span>
              <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest">{m.label}</p>
              <p className="text-sm font-black text-slate-900">{m.value}</p>
            </div>
          ))}
        </div>
        <div className={cn(
          "px-4 py-3 rounded-xl border flex flex-col gap-1 shadow-sm",
          user.risk_level === 'High' ? 'bg-rose-50 border-rose-100' : 'bg-emerald-50 border-emerald-100'
        )}>
          <div className="flex justify-between items-center">
            <span className={cn("text-[8px] font-black uppercase tracking-widest", user.risk_level === 'High' ? "text-rose-400" : "text-emerald-400")}>Survival Node Status</span>
            <div className={cn("h-1.5 w-1.5 rounded-full animate-pulse", user.risk_level === 'High' ? "bg-rose-500" : "bg-emerald-500")}></div>
          </div>
          <span className={cn("text-base font-black uppercase", user.risk_level === 'High' ? "text-rose-600" : "text-emerald-600")}>{user.risk_level || 'System Optimized'}</span>
        </div>
      </div>

      {/* 2. Institutional Metadata (NEW - ALL DATA) */}
      <div className="lg:col-span-5 space-y-3">
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm h-full flex flex-col">
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Users className="h-3 w-3" /> Node Profile Metadata
          </p>
          <div className="grid grid-cols-2 gap-x-6 gap-y-4 flex-1">
             <div>
               <p className="text-[8px] font-bold text-slate-400 uppercase">Department / Section</p>
               <p className="text-[11px] font-black text-slate-900 uppercase">{user.department || "—"} / {user.section || "A"}</p>
             </div>
             <div>
               <p className="text-[8px] font-bold text-slate-400 uppercase">Academic Year</p>
               <p className="text-[11px] font-black text-slate-900 uppercase">Year {user.year || "—"}</p>
             </div>
             <div>
               <p className="text-[8px] font-bold text-slate-400 uppercase">Birth Projection (DOB)</p>
               <p className="text-[11px] font-black text-slate-900 uppercase">{user.dob || "—"}</p>
             </div>
             <div>
               <p className="text-[8px] font-bold text-slate-400 uppercase">Blood Vector</p>
               <p className="text-[11px] font-black text-slate-900 uppercase">{user.blood_group || "—"}</p>
             </div>
             <div>
               <p className="text-[8px] font-bold text-slate-400 uppercase">Personal contact</p>
               <p className="text-[11px] font-black text-slate-900">{user.personal_phone || user.user?.phone_number || "—"}</p>
             </div>
             <div>
               <p className="text-[8px] font-bold text-slate-400 uppercase">Parental contact</p>
               <p className="text-[11px] font-black text-slate-900">{user.parent_phone || "—"}</p>
             </div>
             <div className="col-span-2 pt-1">
               <p className="text-[8px] font-bold text-slate-400 uppercase mb-2">Kinship Data (Parents)</p>
               <div className="flex gap-4">
                 <div className="flex-1 bg-slate-50 rounded-lg p-2 border border-slate-100">
                   <p className="text-[7px] font-black text-slate-400 uppercase mb-0.5">Father</p>
                   <p className="text-[9px] font-black text-slate-900 uppercase">{user.father_name || "—"}</p>
                 </div>
                 <div className="flex-1 bg-slate-50 rounded-lg p-2 border border-slate-100">
                   <p className="text-[7px] font-black text-slate-400 uppercase mb-0.5">Mother</p>
                   <p className="text-[9px] font-black text-slate-900 uppercase">{user.mother_name || "—"}</p>
                 </div>
               </div>
             </div>
          </div>
        </div>
      </div>

      {/* 3. Credentials & Intelligence Report */}
      <div className="lg:col-span-4 flex flex-col justify-between gap-3">
        <CredentialCard user={user} />
        <Link href={`/admin/student/${user.id}`} className="block">
          <Button size="sm" className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl h-12 text-[10px] font-black uppercase tracking-widest border-none shadow-indigo-100 shadow-lg">
            Open Advanced Intelligence Report
          </Button>
        </Link>
      </div>
    </div>
    );
}

const AdministrativeSearch: React.FC<AdministrativeSearchProps> = ({
 userType, setUserType, searchQuery, setSearchQuery,
 isSearching, searchResults, handleDeleteUser,
 setIsAddStudentOpen, setIsAddStaffOpen, pagination, handlePageChange,
 deptFilter, setDeptFilter, yearFilter, setYearFilter, handleResetFilters
}) => {
 const [expandedId, setExpandedId] = useState<string | null>(null);
 const displayData = searchResults.length > 0 ? searchResults : (userType === 'staff' ? demoStaff : []);

 return (
 <div className="lg:col-span-12">
  <Card className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
    <div className="border-b border-slate-100 bg-slate-50/50 p-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-xl font-black text-slate-950 uppercase tracking-tight">Administrative Directory</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            {isSearching ? "Fetching records..." : `${displayData.length} Records Detected`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* User Type Switcher */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
            {(['student', 'staff'] as const).map(t => (
              <button
                key={t}
                onClick={() => { setUserType(t); setExpandedId(null); }}
                className={cn(
                  "px-3 py-1.5 text-[10px] font-bold rounded flex items-center gap-1.5 uppercase transition-all",
                  userType === t ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                )}
              >
                {t === 'student' ? <GraduationCap size={12} /> : <Users size={12} />}
                {t}s
              </button>
            ))}
          </div>

          {userType === 'student' && (
            <div className="flex items-center gap-2">
              <select 
                value={deptFilter} 
                onChange={(e) => setDeptFilter(e.target.value)}
                className="bg-white border border-slate-200 text-[10px] font-bold uppercase rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-slate-900/5 transition-all shadow-sm"
              >
                <option value="ALL">All Depts</option>
                {['AIML', 'AGRI', 'EEE', 'EIE', 'ECE', 'BT', 'BME', 'CIVIL', 'IT', 'MECH', 'CSE'].map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>

              <select 
                value={yearFilter} 
                onChange={(e) => setYearFilter(e.target.value)}
                className="bg-white border border-slate-200 text-[10px] font-bold uppercase rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-slate-900/5 transition-all shadow-sm"
              >
                <option value="ALL">All Years</option>
                {[1, 2, 3, 4].map(y => (
                  <option key={y} value={y}>Year {y}</option>
                ))}
              </select>

              <Button 
                variant="default" 
                size="sm" 
                onClick={() => {}} // Auto-triggers on filter change, but keeping button for UX 
                className="h-9 px-4 rounded-lg text-[10px] font-black uppercase tracking-widest bg-slate-900 hover:bg-slate-800 text-white shadow-sm"
              >
                Apply Filter
              </Button>

              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleResetFilters}
                className="h-9 px-4 rounded-lg text-[10px] font-black uppercase tracking-widest border-slate-200 hover:bg-slate-50 transition-all shadow-sm"
              >
                Reset Filter
              </Button>
            </div>
          )}

          <Button
            size="sm"
            onClick={() => userType === 'student' ? setIsAddStudentOpen(true) : setIsAddStaffOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white h-9 px-4 rounded-lg font-black uppercase text-[10px] tracking-widest border-none transition-all active:scale-95 shadow-sm shadow-indigo-200"
          >
            + Add {userType}
          </Button>
        </div>
      </div>

      <div className="mt-6 flex items-center bg-white border border-slate-200 rounded-lg px-3 h-10 shadow-sm focus-within:ring-2 focus-within:ring-slate-900/5 focus-within:border-slate-900 transition-all">
        <Search className="h-4 w-4 text-slate-400 shrink-0" />
        <input
          type="text"
          placeholder={`Deploy query for ${userType}s...`}
          className="w-full h-full bg-transparent pl-3 border-none font-bold text-slate-900 text-xs placeholder:text-slate-300 outline-none"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {isSearching ? <RefreshCw className="h-3.5 w-3.5 text-slate-400 animate-spin shrink-0" /> : searchQuery && <button onClick={() => setSearchQuery("")}><X className="h-3.5 w-3.5 text-slate-400" /></button>}
      </div>
    </div>

    <div className="p-4 space-y-2 max-h-[600px] overflow-y-auto scrollbar-hide">
      {isSearching ? (
        <div key="searching-state" className="text-center py-16 opacity-50">
          <Loader2 className="h-8 w-8 text-slate-950 animate-spin mx-auto mb-2" />
          <p className="font-bold text-[10px] uppercase tracking-widest">Accessing Node Database...</p>
        </div>
      ) : displayData.length > 0 ? (
        displayData.map((user, index) => {
          const isExpanded = expandedId === user.id;
          const name = user.full_name || user.name || user.user?.full_name || (userType === 'staff' ? "Faculty" : "Student");
          const idLabel = userType === 'student' ? (user.roll_number || "—") : (user.staff_id || "—");

          return (
            <div key={user.id || `user-row-${index}`} className={cn(
              "rounded-xl border transition-all duration-300 overflow-hidden",
              isExpanded ? "border-indigo-200 bg-white shadow-lg mb-2 ring-1 ring-indigo-500/10" : "border-slate-100 bg-white hover:border-slate-300"
            )}>
              <div 
                className={cn("flex items-center justify-between p-3 cursor-pointer", isExpanded ? "bg-indigo-50/50" : "hover:bg-slate-50/50")}
                onClick={() => setExpandedId(isExpanded ? null : user.id)}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className={cn(
                    "h-9 w-9 shrink-0 rounded-lg flex items-center justify-center font-black text-xs uppercase shadow-sm",
                    isExpanded ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600"
                  )}>
                    {(name || "N")[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn("text-sm font-black uppercase truncate leading-tight tracking-tight", isExpanded ? "text-indigo-950" : "text-slate-900")}>{name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-[10px] font-bold text-slate-400 tracking-tight">{idLabel}</p>
                      <span className="text-[10px] text-slate-300">•</span>
                      <p className="text-[10px] font-bold text-indigo-500 uppercase">{user.department || user.dept || "General"}</p>
                      {user.year && <><span className="text-[10px] text-slate-300">•</span><p className="text-[10px] font-bold text-slate-500 uppercase">Year {user.year}</p></>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="hidden sm:flex items-center gap-2 mr-2">
                    {userType === 'student' ? (
                      <>
                        <span className={cn("text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-tighter", isExpanded ? "bg-white text-indigo-600" : "bg-slate-50 text-slate-900")}>GPA {(user.current_cgpa || user.cgpa || 0).toFixed(2)}</span>
                        <div className={cn("px-1.5 py-0.5 rounded text-[8px] font-black uppercase", (user.risk_level === 'High' || user.status === 'Risk') ? "bg-rose-500/20 text-rose-500" : "bg-emerald-500/20 text-emerald-500")}>{user.risk_level || user.status || 'STABLE'}</div>
                      </>
                    ) : (
                      <>
                        <div className="flex flex-col items-end mr-2">
                           <span className="text-[9px] font-black text-slate-900 uppercase leading-none mb-1">{user.designation || "Faculty"}</span>
                           <span className="text-[7px] font-bold text-indigo-500 uppercase tracking-widest">{user.primary_skill || user.expertise || "CORE"}</span>
                        </div>
                        <div className={cn("px-1.5 py-0.5 rounded text-[8px] font-black uppercase bg-emerald-500/20 text-emerald-500")}>{user.status || 'ACTIVE'}</div>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Link href={userType === 'student' ? `/admin/student/${user.id}` : `/admin/staff/${user.id}`} onClick={e => e.stopPropagation()}>
                       <Button variant="ghost" className="h-7 w-7 p-0 rounded-lg text-slate-400 hover:text-slate-900">
                         <ArrowUpRight size={14} />
                       </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      onClick={(e) => { e.stopPropagation(); handleDeleteUser(user.id); }}
                      className="h-7 w-7 p-0 rounded-lg text-slate-400 hover:text-rose-500"
                    >
                      <Trash2 size={14} />
                    </Button>
                    <div className="ml-1 text-slate-300">
                       {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </div>
                </div>
              </div>

              {isExpanded && (
                <div className="px-3 pb-3">
                  {userType === 'student' ? <StudentAnalysisPanel user={user} /> : <StaffAnalysisPanel user={user} />}
                </div>
              )}
            </div>
          );
        })
      ) : (
        <div key="no-results-state" className="text-center py-16 opacity-30">
          <p className="text-[11px] font-black uppercase tracking-widest">No Node Detected</p>
        </div>
      )}
    </div>
  </Card>
 </div>
 );
};

export default AdministrativeSearch;
