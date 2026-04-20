"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Users, Mail, Phone, BookOpen, award, Shield, 
  ChevronLeft, BarChart3, Globe, ExternalLink, 
  Copy, CheckCheck, Eye, EyeOff, Trash2, Edit3,
  Book, PieChart, TrendingUp
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from 'next/link';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area
} from 'recharts';

export default function StaffProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const [staff, setStaff] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    // Mock retrieval since we might be in demo mode
    const demoStaff = [
      {
        id: "demo-staff-1",
        name: "Varun Das",
        staff_id: "STF90374",
        department: "ECE",
        designation: "Professor",
        personal_phone: "9876543210",
        personal_email: "varun@gmail.com",
        handled_subjects: ["DBMS", "Operating Systems", "Microprocessors"],
        primary_skill: "AI/ML",
        publications_count: 12,
        experience_years: 15,
        status: "Active",
        location: "Block C - Room 402",
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
        handled_subjects: ["DSA", "Python", "Web Architecture"],
        primary_skill: "Data Science",
        publications_count: 8,
        experience_years: 7,
        status: "On Campus",
        location: "Block A - Room 201",
        user: {
          institutional_email: "anita.cse@college.com",
          plain_password: "Ani@1234",
          role: "faculty"
        }
      }
    ];

    const found = demoStaff.find(s => s.id === id);
    if (found) {
      setStaff(found);
    } else {
      // Fallback for random IDs during testing
      setStaff({
        ...demoStaff[0],
        id: id,
        name: "Institutional Faculty",
        staff_id: `STF-${(id as string).slice(0, 5).toUpperCase()}`
      });
    }
    setLoading(false);
  }, [id]);

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  if (loading) return <div className="p-12 text-center font-black uppercase text-slate-400">Synchronizing Faculty Data...</div>;
  if (!staff) return <div className="p-12 text-center font-black uppercase text-rose-500">Node not found in local or remote registries.</div>;

  const pubData = [
    { year: '2021', count: 2 },
    { year: '2022', count: Math.ceil(staff.publications_count * 0.3) },
    { year: '2023', count: Math.ceil(staff.publications_count * 0.4) },
    { year: '2024', count: Math.ceil(staff.publications_count * 0.5) },
    { year: '2025', count: staff.publications_count },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Navigation */}
        <div className="flex items-center justify-between">
          <Link href="/admin/staff" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors group">
            <div className="bg-white p-2 rounded-xl border border-slate-200 group-hover:bg-slate-900 group-hover:text-white transition-all">
              <ChevronLeft size={16} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest">Back to Directory</span>
          </Link>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" className="rounded-xl border-slate-200 text-[10px] font-black uppercase h-10 px-4">
              <Edit3 className="mr-2 h-3.5 w-3.5" /> Edit Profile
            </Button>
            <Button variant="destructive" className="rounded-xl bg-rose-600 hover:bg-rose-700 text-[10px] font-black uppercase h-10 px-4">
              <Trash2 className="mr-2 h-3.5 w-3.5" /> Decommission Node
            </Button>
          </div>
        </div>

        {/* Profile Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column - Essential Identity */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="rounded-[2.5rem] border-none shadow-2xl shadow-indigo-500/5 bg-white p-8 text-center overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-rose-500"></div>
              
              <div className="mx-auto h-24 w-24 rounded-[2rem] bg-slate-900 flex items-center justify-center text-white text-3xl font-black mb-6 shadow-xl shadow-indigo-500/10">
                {(staff.name || "S")[0]}
              </div>
              
              <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-1">{staff.name || "Anonymous Faculty"}</h1>
              <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-[0.2em] mb-4">{staff.designation}</p>
              
              <div className="inline-flex items-center px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[9px] font-black uppercase tracking-widest mb-6">
                {staff.status}
              </div>

              <div className="grid grid-cols-2 gap-3 pt-6 border-t border-slate-100">
                <div className="text-left bg-slate-50/50 rounded-2xl p-4 border border-slate-100/50">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Staff ID</p>
                  <p className="text-sm font-black text-slate-900">{staff.staff_id}</p>
                </div>
                <div className="text-left bg-slate-50/50 rounded-2xl p-4 border border-slate-100/50">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Dept</p>
                  <p className="text-sm font-black text-slate-900 uppercase">{staff.department}</p>
                </div>
              </div>
            </Card>

            <Card className="rounded-[2rem] border-none shadow-xl shadow-slate-200/50 bg-white p-6">
               <div className="flex items-center justify-between mb-6">
                 <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                   <Shield className="h-4 w-4 text-indigo-600" /> Institutional Credentials
                 </h3>
               </div>
               
               <div className="space-y-4">
                 <div className="space-y-1.5">
                   <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Official Email</p>
                   <div className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
                     <span className="text-[11px] font-bold text-slate-900">{staff.user?.institutional_email}</span>
                     <button onClick={() => copy(staff.user?.institutional_email, "off")} className="text-slate-400 hover:text-slate-900">
                       {copied === "off" ? <CheckCheck className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                     </button>
                   </div>
                 </div>

                 <div className="space-y-1.5">
                   <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Access Key (Password)</p>
                   <div className="flex items-center justify-between bg-slate-900 rounded-xl px-4 py-3 border border-slate-800">
                     <span className="text-xs font-mono font-bold text-white tracking-widest">{visible ? staff.user?.plain_password : "••••••••••••"}</span>
                     <div className="flex items-center gap-3">
                       <button onClick={() => setVisible(!visible)} className="text-slate-500 hover:text-white">
                         {visible ? <EyeOff size={14} /> : <Eye size={14} />}
                       </button>
                       <button onClick={() => copy(staff.user?.plain_password || "", "pass")} className="text-slate-500 hover:text-white">
                         {copied === "pass" ? <CheckCheck size={14} className="text-emerald-500" /> : <Copy size={14} />}
                       </button>
                     </div>
                   </div>
                 </div>
               </div>
            </Card>
          </div>

          {/* Right Column - Deep Intelligence */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* KPI Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Experience", value: `${staff.experience_years}Y`, icon: <TrendingUp />, color: "bg-indigo-50 text-indigo-600" },
                { label: "Publications", value: staff.publications_count, icon: <Book />, color: "bg-emerald-50 text-emerald-600" },
                { label: "Handled Units", value: staff.handled_subjects.length, icon: <BookOpen />, color: "bg-amber-50 text-amber-600" },
                { label: "SDR Score", value: "94.2", icon: <TrendingUp />, color: "bg-rose-50 text-rose-600" }
              ].map((m, i) => (
                <Card key={i} className="p-5 border-none shadow-sm rounded-2xl flex flex-col items-center justify-center text-center">
                  <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center mb-3", m.color)}>
                    {React.cloneElement(m.icon as React.ReactElement, { size: 18 })}
                  </div>
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">{m.label}</p>
                  <p className="text-xl font-black text-slate-900">{m.value}</p>
                </Card>
              ))}
            </div>

            {/* Academic Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <Card className="p-6 border-none shadow-sm rounded-[2rem] bg-white">
                  <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-indigo-500" /> Specialization & Expertise
                  </h3>
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      <div className="bg-indigo-900 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">
                        {staff.primary_skill}
                      </div>
                      <div className="bg-slate-100 text-slate-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">
                        RESEARCH NODE
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-slate-50">
                      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-3">Handled Subjects</p>
                      <div className="space-y-2">
                        {staff.handled_subjects.map((sub: string, i: number) => (
                          <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                            <span className="text-[11px] font-black text-slate-700 uppercase">{sub}</span>
                            <div className="h-1.5 w-1.5 rounded-full bg-indigo-500"></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
               </Card>

               <Card className="p-6 border-none shadow-sm rounded-[2rem] bg-slate-900 text-white">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-emerald-400" /> Impact Analysis
                  </h3>
                  <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={pubData}>
                        <defs>
                          <linearGradient id="pubColor" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="count" stroke="#10b981" fillOpacity={1} fill="url(#pubColor)" strokeWidth={3} />
                        <Tooltip 
                          contentStyle={{ background: '#0f172a', border: 'none', borderRadius: '12px', fontSize: '10px' }}
                          labelStyle={{ color: '#94a3b8' }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-center">
                    <div>
                      <p className="text-[7px] font-black text-slate-400 uppercase">Consistency</p>
                      <p className="text-sm font-black text-emerald-400">92%</p>
                    </div>
                    <div>
                      <p className="text-[7px] font-black text-slate-400 uppercase">Growth</p>
                      <p className="text-sm font-black text-indigo-400">+1.2Y</p>
                    </div>
                    <div>
                      <p className="text-[7px] font-black text-slate-400 uppercase">Volatility</p>
                      <p className="text-sm font-black text-rose-400">Low</p>
                    </div>
                  </div>
               </Card>
            </div>

            {/* Personal Metadata */}
            <Card className="p-8 border-none shadow-sm rounded-[2.5rem] bg-white">
               <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-8 flex items-center gap-2">
                 <Globe className="h-4 w-4 text-purple-500" /> Contact & Connectivity Registry
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                 <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-slate-100 p-3 rounded-xl text-slate-600">
                        <Mail size={18} />
                      </div>
                      <div>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Personal Communication</p>
                        <p className="text-sm font-black text-slate-900">{staff.personal_email}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="bg-slate-100 p-3 rounded-xl text-slate-600">
                        <Phone size={18} />
                      </div>
                      <div>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Direct Liaison Line</p>
                        <p className="text-sm font-black text-slate-900">{staff.personal_phone}</p>
                      </div>
                    </div>
                 </div>
                 <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-slate-100 p-3 rounded-xl text-slate-600">
                        <Globe size={18} />
                      </div>
                      <div>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Node Physical Address</p>
                        <p className="text-sm font-black text-slate-900 uppercase font-mono">{staff.location}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="bg-slate-100 p-3 rounded-xl text-slate-600">
                        <BarChart3 size={18} />
                      </div>
                      <div>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Institutional Tenure</p>
                        <p className="text-sm font-black text-slate-900 uppercase">{staff.experience_years} Active Cycles</p>
                      </div>
                    </div>
                 </div>
               </div>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
}
