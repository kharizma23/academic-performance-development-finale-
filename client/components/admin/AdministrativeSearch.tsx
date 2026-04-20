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
 isSearching: boolean;
 searchResults: any[];
 handleDeleteUser: (id: string) => void;
 setIsAddStudentOpen: (open: boolean) => void;
 setIsAddStaffOpen: (open: boolean) => void;
 pagination: { total: number, page: number, pages: number, limit: number };
 handlePageChange: (page: number) => void;
}

function CredentialCard({ user }: { user: any }) {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const email = user.user?.institutional_email || user.user?.email || "—";
  const password = user.user?.plain_password || "—";

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="bg-slate-900 rounded-lg p-3 space-y-2 border border-slate-800">
      <div className="flex items-center gap-2">
        <Key className="h-3 w-3 text-emerald-400" />
        <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Institutional Access</span>
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center justify-between bg-slate-950 rounded-lg px-2.5 py-1.5 border border-white/5">
          <span className="text-[10px] font-bold text-slate-400 truncate w-32">{email}</span>
          <button onClick={() => copy(email, "email")} className="text-slate-500 hover:text-white transition-all">
            {copied === "email" ? <CheckCheck className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
          </button>
        </div>
        <div className="flex items-center justify-between bg-slate-950 rounded-lg px-2.5 py-1.5 border border-white/5">
          <span className="text-[10px] font-bold text-slate-400">{visible ? password : "••••••••"}</span>
          <div className="flex items-center gap-2">
            <button onClick={() => setVisible(!visible)} className="text-slate-500 hover:text-white">
              {visible ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
            </button>
            <button onClick={() => copy(password, "pass")} className="text-slate-500 hover:text-white">
              {copied === "pass" ? <CheckCheck className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StudentAnalysisPanel({ user }: { user: any }) {
  const cgpa = user.current_cgpa || 0;
  const dna = user.academic_dna_score || 0;
  const readiness = user.career_readiness_score || 0;

  const radarData = [
    { subject: "CGPA", score: (cgpa / 10) * 100 },
    { subject: "DNA", score: dna },
    { subject: "Readiness", score: readiness },
    { subject: "Growth", score: Math.min((user.growth_index || 0) * 20, 100) },
    { subject: "Skill", score: readiness * 0.85 },
  ];

  return (
    <div className="mt-3 grid grid-cols-1 lg:grid-cols-3 gap-4 animate-in fade-in duration-300">
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: "CGPA", value: cgpa.toFixed(2), icon: "⭐" },
            { label: "Attn", value: `${(user.attendance_percentage || 85)}%`, icon: "⏱" },
            { label: "DNA", value: `${dna.toFixed(1)}%`, icon: "🧬" },
            { label: "XP", value: user.xp_points || 0, icon: "⚡" },
          ].map((m, i) => (
            <div key={i} className="bg-slate-900 rounded-lg p-2.5 border border-slate-800 text-center">
              <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mb-1">{m.label}</p>
              <p className="text-xs font-black text-white">{m.value}</p>
            </div>
          ))}
        </div>
        <Link href={`/admin/students/${user.id}`} className="block">
          <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg h-9 text-[10px] font-black uppercase tracking-widest border-none">
            Intelligence Report
          </Button>
        </Link>
      </div>

      <div className="bg-slate-900 rounded-xl p-3 border border-slate-800">
        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3 text-center">Capability Radar</p>
        <div className="h-28">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid stroke="#334155" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: "#64748B", fontSize: 8, fontWeight: 700 }} />
              <PolarRadiusAxis domain={[0, 100]} tick={false} />
              <Radar name="Score" dataKey="score" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="space-y-3 flex flex-col justify-between">
        <CredentialCard user={user} />
        <div className={cn(
          "px-3 py-2 rounded-lg border flex items-center justify-between",
          user.risk_level === 'High' ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
        )}>
          <span className="text-[9px] font-black uppercase tracking-widest">Risk Index</span>
          <span className="text-xs font-black uppercase">{user.risk_level || 'Stable'}</span>
        </div>
      </div>
    </div>
  );
}

function StaffAnalysisPanel({ user }: { user: any }) {
  const rating = user.student_feedback_rating || 0;

  return (
    <div className="mt-3 grid grid-cols-1 lg:grid-cols-12 gap-4 animate-in fade-in duration-300">
      <div className="lg:col-span-12">
        <CredentialCard user={user} />
      </div>
      <div className="lg:col-span-12 grid grid-cols-1 sm:grid-cols-3 gap-2">
         <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
            <p className="text-[10px] font-bold text-white uppercase">{user.primary_skill || "Core Engineering"}</p>
            <p className="text-[8px] font-bold text-slate-500 uppercase mt-1 tracking-widest">Global Expertise</p>
         </div>
         <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
            <p className="text-[10px] font-bold text-white uppercase">{user.designation}</p>
            <p className="text-[8px] font-bold text-slate-500 uppercase mt-1 tracking-widest">Institutional Designation</p>
         </div>
         <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-between">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map(i => <Star key={i} className={cn("h-3 w-3", i <= Math.round(rating) ? "text-amber-400 fill-current" : "text-slate-800")} />)}
            </div>
            <p className="text-[10px] font-black text-amber-400 leading-none">{rating.toFixed(1)}</p>
         </div>
      </div>
    </div>
  );
}

const AdministrativeSearch: React.FC<AdministrativeSearchProps> = ({
 userType, setUserType, searchQuery, setSearchQuery,
 isSearching, searchResults, handleDeleteUser,
 setIsAddStudentOpen, setIsAddStaffOpen, pagination, handlePageChange
}) => {
 const [expandedId, setExpandedId] = useState<string | null>(null);

 return (
 <div className="lg:col-span-12">
  <Card className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
    <div className="border-b border-slate-100 bg-slate-50/50 p-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-xl font-black text-slate-950 uppercase tracking-tight">Administrative Directory</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            {isSearching ? "Fetching records..." : `${searchResults.length} Records Detected`}
          </p>
        </div>

        <div className="flex items-center gap-3">
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
          <Button
            size="sm"
            onClick={() => userType === 'student' ? setIsAddStudentOpen(true) : setIsAddStaffOpen(true)}
            className="bg-slate-900 hover:bg-slate-800 text-white h-9 px-4 rounded-lg font-black uppercase text-[10px] tracking-widest border-none transition-all active:scale-95"
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
        <div className="text-center py-16 opacity-50">
          <Loader2 className="h-8 w-8 text-slate-950 animate-spin mx-auto mb-2" />
          <p className="font-bold text-[10px] uppercase tracking-widest">Accessing Node Database...</p>
        </div>
      ) : searchResults.length > 0 ? (
        searchResults.map((user) => {
          const isExpanded = expandedId === user.id;
          const name = user.name || user.user?.full_name || "Unknown";
          const idLabel = userType === 'student' ? (user.roll_number || "—") : (user.staff_id || "—");

          return (
            <div key={user.id} className={cn(
              "rounded-xl border transition-all duration-300 overflow-hidden",
              isExpanded ? "border-slate-800 bg-slate-950 shadow-lg mb-2" : "border-slate-100 bg-white hover:border-slate-300"
            )}>
              <div 
                className={cn("flex items-center justify-between p-3 cursor-pointer", isExpanded ? "bg-slate-900/50" : "hover:bg-slate-50/50")}
                onClick={() => setExpandedId(isExpanded ? null : user.id)}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className={cn(
                    "h-9 w-9 shrink-0 rounded-lg flex items-center justify-center font-black text-xs uppercase shadow-sm",
                    isExpanded ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-600"
                  )}>
                    {name[0]}
                  </div>
                  <div className="min-w-0">
                    <p className={cn("text-xs font-black uppercase truncate leading-tight", isExpanded ? "text-white" : "text-slate-900")}>{name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                       <span className={cn("text-[9px] font-black uppercase tracking-widest", isExpanded ? "text-emerald-400" : "text-blue-600")}>{idLabel}</span>
                       <span className={cn("text-[9px] font-bold uppercase tracking-widest", isExpanded ? "text-slate-400" : "text-slate-400")}>{user.department}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="hidden sm:flex items-center gap-2 mr-2">
                    {userType === 'student' && (
                      <>
                        <span className={cn("text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-tighter", isExpanded ? "bg-white/10 text-white" : "bg-slate-50 text-slate-900")}>GPA {user.current_cgpa?.toFixed(2)}</span>
                        <div className={cn("px-1.5 py-0.5 rounded text-[8px] font-black", user.risk_level === 'High' ? "bg-rose-500/20 text-rose-500" : "bg-emerald-500/20 text-emerald-500")}>{user.risk_level || 'STABLE'}</div>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Link href={`/admin/${userType}s/${user.id}`} onClick={e => e.stopPropagation()}>
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
        <div className="text-center py-16 opacity-30">
          <p className="text-[11px] font-black uppercase tracking-widest">No Node Detected</p>
        </div>
      )}
    </div>
  </Card>
 </div>
 );
};

export default AdministrativeSearch;
