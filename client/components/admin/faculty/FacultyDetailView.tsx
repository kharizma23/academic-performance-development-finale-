"use client";
import React, { useState } from "react";
import {
 ChevronLeft, Mail, BookOpen, Award, AlertTriangle, Activity,
 TrendingUp, MessageSquare, ThumbsUp, ThumbsDown, Clock, Star
} from "lucide-react";
import {
 ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell,
 PieChart, Pie, LineChart, Line, CartesianGrid, Legend
} from "recharts";
import { fetchFacultyDetail, assignIntervention } from "@/lib/api-faculty";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Props {
 facultyId: string;
 onBack: () => void;
}

export default function FacultyDetailView({ facultyId, onBack }: Props) {
 const [faculty, setFaculty] = React.useState<any>(null);
 const [loading, setLoading] = React.useState(true);
 const [showModal, setShowModal] = React.useState(false);
 const [intType, setIntType] = React.useState("Training");
 const [description, setDescription] = React.useState("");

 useEffect(() => {
 setLoading(true);
 fetchFacultyDetail(facultyId).then(d => { setFaculty(d); setLoading(false); }).catch(() => setLoading(false));
 }, [facultyId]);

 const handleAssign = async () => {
 try {
 await assignIntervention({ faculty_id: facultyId, type: intType, description });
 setShowModal(false);
 setDescription("");
 alert("Intervention Assigned Successfully!");
 } catch { alert("Failed to assign."); }
 };

 if (loading) return <div className="flex h-[50vh] items-center justify-center"><Activity className="h-8 w-8 text-emerald-600 animate-pulse" /></div>;
 if (!faculty) return <div className="p-8 text-center text-slate-500 font-bold uppercase tracking-widest">Faculty Node Offline.</div>;

 const sentimentData = [
  { name: "Positive", value: faculty.feedback_analytics?.sentiment_distribution?.Positive ?? 0, color: "#10B981" },
  { name: "Negative", value: faculty.feedback_analytics?.sentiment_distribution?.Negative ?? 0, color: "#EF4444" },
  { name: "Neutral", value: faculty.feedback_analytics?.sentiment_distribution?.Neutral ?? 0, color: "#F59E0B" },
 ];

 const perfData = [
  { name: "Baseline", value: (faculty.performance?.pass_rate ?? 70) - 10 },
  { name: "Current", value: faculty.performance?.pass_rate ?? 80 },
 ];

 return (
 <div className="space-y-6 animate-in fade-in duration-700">
  {/* Header Section */}
  <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
    <Button variant="outline" size="sm" onClick={onBack} className="h-8 w-8 p-0 rounded-lg shrink-0">
      <ChevronLeft className="h-4 w-4" />
    </Button>
    <div className="space-y-0.5 min-w-0">
       <h1 className="text-xl font-black text-slate-900 uppercase tracking-tight truncate">Faculty Profiling: {faculty.name}</h1>
       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{faculty.department} Institutional Node</p>
    </div>
  </div>

  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
    {/* Sidebar Bio */}
    <div className="lg:col-span-4 space-y-6">
      <Card className="p-6 rounded-xl border border-slate-100 shadow-sm relative overflow-hidden bg-white">
        <div className="flex flex-col items-center text-center">
          <div className="h-20 w-20 bg-emerald-600 text-white rounded-xl flex items-center justify-center text-3xl font-black shadow-lg mb-4 ring-4 ring-emerald-50">
            {faculty.name?.charAt(0)}
          </div>
          <h2 className="text-lg font-black text-slate-900 leading-tight uppercase ">{faculty.name}</h2>
          <p className="text-emerald-600 font-black uppercase tracking-widest text-[9px] mt-1 bg-emerald-50 px-3 py-1 rounded-full">{faculty.designation}</p>
          
          <div className="w-full grid grid-cols-2 gap-4 mt-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div className="text-center">
              <p className="text-[7px] font-bold text-slate-500 uppercase tracking-widest mb-1">Index Score</p>
              <p className="text-xl font-black text-emerald-600">{faculty.rating}<span className="text-[10px] opacity-30 text-slate-400">/5</span></p>
            </div>
            <div className="text-center border-l border-slate-200 pl-4">
              <p className="text-[7px] font-bold text-slate-500 uppercase tracking-widest mb-1">Impact Factor</p>
              <p className="text-xl font-black text-slate-900">{faculty.impact}<span className="text-[10px] opacity-30 text-slate-400">%</span></p>
            </div>
          </div>

          <div className="w-full mt-6 space-y-2">
            {[
              { icon: Mail, label: faculty.email || `${facultyId}@college.edu` },
              { icon: BookOpen, label: `Expertise: ${faculty.primary_skill || "Eng"}` },
              { icon: Award, label: `Proj: ${faculty.projects_completed} | Pub: ${faculty.publications_count}` }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2.5 text-slate-600 font-bold text-[9px] bg-slate-50/50 p-2.5 rounded-lg border border-transparent hover:border-slate-100 truncate">
                <item.icon className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span className="truncate uppercase">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Workload */}
      <Card className="bg-slate-900 p-6 rounded-xl shadow-md text-white border-none">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-3.5 w-3.5 text-emerald-500" />
          <h3 className="text-[10px] font-black uppercase tracking-widest">Workload Analysis</h3>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Lectures/wk", value: faculty.workload?.classes_per_week ?? 0 },
            { label: "Sub Nodes", value: faculty.workload?.total_subjects ?? 3 },
            { label: "Students", value: faculty.workload?.active_students ?? 0 },
          ].map((w, i) => (
            <div key={i} className="bg-white/5 border border-white/5 p-3 rounded-lg text-center">
              <p className="text-lg font-black text-emerald-500 leading-none">{w.value}</p>
              <p className="text-[7px] font-bold text-slate-400 uppercase mt-1.5 tracking-tighter leading-none">{w.label}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Surgical Protocol */}
      <div className="bg-rose-600 rounded-xl p-6 text-white shadow-lg text-center border-none relative overflow-hidden group">
        <div className="relative z-10">
          <AlertTriangle size={32} className="mx-auto mb-3 opacity-50" />
          <h3 className="text-xs font-black uppercase tracking-widest mb-1.5">Surgical Protocol</h3>
          <p className="text-[9px] font-bold opacity-80 mb-4 px-2 leading-snug uppercase">Initialize corrective neural alignment or mandatory mentoring pathway hub.</p>
          <Button size="sm" onClick={() => setShowModal(true)} className="w-full bg-white text-rose-600 hover:bg-slate-50 rounded-lg h-9 font-black uppercase text-[10px] transition-all border-none">Deploy Intervention</Button>
        </div>
      </div>
    </div>

    {/* Main Content Areas */}
    <div className="lg:col-span-8 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="p-5 rounded-xl border border-slate-100 bg-white">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-50">
            <h3 className="text-[9px] font-black uppercase tracking-widest flex items-center gap-2 text-slate-900"><TrendingUp className="text-emerald-600" size={14} /> Velocity</h3>
            <span className="text-[8px] font-black bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded uppercase tracking-widest">Node Stabilized</span>
          </div>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={perfData}>
                <XAxis dataKey="name" hide />
                <Tooltip cursor={{ fill: '#F8FAF5' }} contentStyle={{ borderRadius: "8px", border: "1px solid #F1F5F9", fontSize: '10px' }} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40}>
                  {perfData.map((_, i) => <Cell key={i} fill={i === 0 ? "#E5E7EB" : "#10B981"} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5 rounded-xl border border-slate-100 bg-white">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-50">
            <h3 className="text-[9px] font-black uppercase tracking-widest flex items-center gap-2 text-slate-900"><Activity className="text-emerald-600" size={14} /> Efficiency</h3>
            <span className="text-xs font-black text-emerald-600 leading-none">{faculty.performance?.pass_rate}% Mean</span>
          </div>
          <div className="space-y-4">
            {[
              { label: "Pass Rate", val: faculty.performance?.pass_rate ?? 0, color: "bg-emerald-500" },
              { label: "Fail Metric", val: faculty.performance?.fail_rate ?? 0, color: "bg-rose-500" },
              { label: "Sync Index", val: (faculty.performance?.attendance_correlation ?? 0) * 100, color: "bg-blue-500" },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between text-[8px] font-black text-slate-500 uppercase mb-1 tracking-widest"><span>{item.label}</span><span className="text-slate-900">{Math.round(item.val)}%</span></div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-100">
                  <div className={cn("h-full transition-all duration-1000", item.color)} style={{ width: `${Math.min(item.val, 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-6 rounded-xl border border-slate-100 bg-white">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-900 mb-6 flex items-center gap-2"><BookOpen size={16} className="text-emerald-600" /> Subject Synchronicity Hub</h3>
        <div className="space-y-4">
          {(faculty.subjects ?? []).map((sub: any, i: number) => (
            <div key={i} className="bg-slate-50 rounded-lg p-4 border border-slate-100 transition-all hover:bg-emerald-50/20">
              <div className="flex justify-between items-center mb-3">
                <p className="font-black text-[10px] text-slate-800 uppercase leading-none">{sub.name}</p>
                <div className="flex gap-3 text-[8px] font-black uppercase">
                  <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">Pass: {sub.pass_rate}%</span>
                  <span className="text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-100">Fail: {sub.fail_rate}%</span>
                </div>
              </div>
              <div className="flex h-1.5 bg-slate-200 rounded-full overflow-hidden border border-white">
                <div className="bg-emerald-500 transition-all" style={{ width: `${sub.pass_rate}%` }} />
                <div className="bg-rose-500 transition-all" style={{ width: `${sub.fail_rate}%` }} />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 rounded-xl border border-slate-100 bg-white shadow-sm">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-900 mb-6 flex items-center gap-2"><Activity size={16} className="text-emerald-600" /> Attendance Impact Vectors</h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={faculty.attendance_data ?? []}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 9, fontWeight: "700", fill: "#94A3B8" }} />
              <YAxis domain={['auto', 'auto']} tick={{ fontSize: 9, fontWeight: "700", fill: "#94A3B8" }} />
              <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #F1F5F9", fontSize: "10px" }} />
              <Line type="monotone" dataKey="faculty_attendance" stroke="#10B981" strokeWidth={2} dot={{ r: 3, fill: "#10B981" }} name="Faculty" />
              <Line type="monotone" dataKey="student_attendance" stroke="#3B82F6" strokeWidth={2} dot={{ r: 3, fill: "#3B82F6" }} name="Students" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-6 rounded-xl border border-slate-100 bg-white">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-50">
          <div className="space-y-1">
            <h2 className="text-[11px] font-black uppercase text-slate-900">Neural Sentiment Feed</h2>
            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Institutional Stream Processor</p>
          </div>
          <div className="bg-slate-900 text-white px-4 py-2 rounded-lg flex items-center gap-2.5 shadow-sm">
            <MessageSquare size={14} className="text-emerald-500" />
            <span className="text-[10px] font-black uppercase">{faculty.feedback_analytics?.total_reviews ?? 0} NODES</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          <div className="xl:col-span-4 flex flex-col items-center border-r border-slate-50 pr-4">
            <div className="w-full aspect-square max-w-[150px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={sentimentData} innerRadius="65%" outerRadius="90%" paddingAngle={5} dataKey="value" stroke="none">
                    {sentimentData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-black text-slate-900 leading-none">{faculty.feedback_analytics?.total_reviews ?? 0}</span>
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">Total</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 w-full mt-6">
              {sentimentData.map((s, i) => (
                <div key={i} className="text-center">
                  <p className="text-[7px] font-black uppercase text-slate-400 mb-1">{s.name}</p>
                  <p className="text-xs font-black" style={{ color: s.color }}>{s.value}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="xl:col-span-8 space-y-3 max-h-[400px] overflow-y-auto pr-2 no-scrollbar">
            {faculty.feedback_analytics?.recent_comments?.map((c: any, i: number) => (
              <div key={i} className="bg-slate-50 border border-slate-100 p-4 rounded-lg hover:border-emerald-600/20 transition-all">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className={cn("p-1.5 rounded-lg", c.sentiment === "Positive" ? "bg-emerald-100 text-emerald-600" : c.sentiment === "Negative" ? "bg-rose-100 text-rose-600" : "bg-amber-100 text-amber-600")}>
                    {c.sentiment === "Positive" ? <ThumbsUp size={12} /> : c.sentiment === "Negative" ? <ThumbsDown size={12} /> : <Activity size={12} />}
                  </div>
                  <span className={cn("text-[9px] font-black uppercase tracking-widest", c.sentiment === "Positive" ? "text-emerald-700" : c.sentiment === "Negative" ? "text-rose-800" : "text-amber-700")}>{c.sentiment} Node</span>
                  {c.rating && <span className="text-[10px] font-black text-slate-900 ml-auto bg-white px-2 py-0.5 rounded border border-slate-100">★ {Number(c.rating).toFixed(1)}</span>}
                </div>
                <p className="text-[10px] font-bold text-slate-700 leading-snug uppercase">"{c.text || "Standard pedagogical contribution."}"</p>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  </div>

  {/* Intervention Modal */}
  {showModal && (
    <div className="fixed inset-0 bg-slate-900/80 flex items-center justify-center p-6 z-[200] backdrop-blur-sm">
      <Card className="p-6 rounded-xl w-full max-w-sm shadow-2xl border border-slate-800 bg-slate-900 text-white animate-in zoom-in-95">
        <h2 className="text-sm font-black uppercase text-white mb-1.5 text-center">Institutional Intervention</h2>
        <p className="text-[9px] font-bold text-slate-400 mb-6 text-center uppercase tracking-widest">Faculty: {faculty.name}</p>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {["Training", "Mentoring"].map(t => (
              <button key={t} onClick={() => setIntType(t)}
                className={cn(
                  "py-2.5 rounded-lg font-black text-[10px] uppercase border transition-all",
                  intType === t ? "bg-emerald-600 text-white border-emerald-600" : "bg-slate-950 border-white/5 text-slate-400"
                )}>
                {t}
              </button>
            ))}
          </div>
          <textarea
            className="w-full bg-slate-950 border border-white/5 rounded-lg p-3 text-xs font-semibold min-h-[100px] outline-none focus:border-emerald-500 transition-all text-white"
            placeholder="Analytical description..."
            value={description} onChange={e => setDescription(e.target.value)}
          />
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => setShowModal(false)} className="flex-1 h-9 rounded-lg text-slate-400 text-[10px] font-black uppercase">Cancel</Button>
            <Button size="sm" onClick={handleAssign} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white h-9 rounded-lg text-[10px] font-black uppercase border-none">Execute</Button>
          </div>
        </div>
      </Card>
    </div>
  )}
 </div>
 );
}
