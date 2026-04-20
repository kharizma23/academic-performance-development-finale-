"use client";

import React, { useState, useEffect } from "react";
import { 
  BookOpen, Calendar, AlertTriangle, UserCheck, BarChart3, 
  Upload, Sparkles, LayoutGrid, Clock, CheckCircle2, FileText,
  Activity, ArrowRight, Download, RefreshCw, Zap, Users,
  BookMarked, Map, Layers, Network, BrainCircuit, ChevronRight
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, AreaChart, Area, ScatterChart, Scatter, ZAxis, Cell, Legend
} from "recharts";
import { cn } from "@/lib/utils";

// Simulated Data for Intelligent Course Management
const MOCK_COURSES = [
  { id: "C101", name: "Advanced Data Structures", faculty: "Dr. Arun Kumar", totalTopics: 24, completedTopics: 18, plannedTopics: 20, delayDays: 4, resources: { notes: 12, videos: 8, assignments: 5, missing: "2 Video Lectures" }, understanding: 72, avgScore: 68, status: "Delayed" },
  { id: "C102", name: "Cloud Architecture", faculty: "Dr. James Wilson", totalTopics: 30, completedTopics: 28, plannedTopics: 26, delayDays: 0, resources: { notes: 25, videos: 30, assignments: 10, missing: "None" }, understanding: 88, avgScore: 85, status: "On Track" },
  { id: "C103", name: "Quantum Computing", faculty: "Prof. Sarah Chen", totalTopics: 15, completedTopics: 5, plannedTopics: 10, delayDays: 14, resources: { notes: 5, videos: 0, assignments: 2, missing: "Video Lectures, Problem Sets" }, understanding: 45, avgScore: 50, status: "Critical" },
  { id: "C104", name: "Neural Networks", faculty: "Dr. Priya V", totalTopics: 20, completedTopics: 19, plannedTopics: 19, delayDays: 0, resources: { notes: 20, videos: 20, assignments: 8, missing: "None" }, understanding: 92, avgScore: 89, status: "On Track" },
  { id: "C105", name: "System Design", faculty: "Prof. Michael T", totalTopics: 25, completedTopics: 10, plannedTopics: 15, delayDays: 8, resources: { notes: 10, videos: 5, assignments: 3, missing: "Case Studies" }, understanding: 60, avgScore: 55, status: "Delayed" },
];

const FACULTY_ANALYTICS = [
  { name: "Dr. Arun", efficiency: 82, engagement: 78, subject: "Data Structures", load: 85 },
  { name: "Dr. James", efficiency: 95, engagement: 92, subject: "Cloud Arch", load: 70 },
  { name: "Prof. Sarah", efficiency: 65, engagement: 60, subject: "Quantum Computing", load: 95 },
  { name: "Dr. Priya", efficiency: 98, engagement: 95, subject: "Neural Networks", load: 80 }
];

const PERFORMANCE_VS_COMPLETION = MOCK_COURSES.map(c => ({
  name: c.name,
  completion: Math.round((c.completedTopics / c.totalTopics) * 100),
  performance: c.avgScore,
  students: 450
}));

export default function CourseManagementTab() {
  const [courses, setCourses] = useState(MOCK_COURSES);
  const [activeView, setActiveView] = useState("board"); // board, analytics, map
  const [isExporting, setIsExporting] = useState(false);

  // 12. Export Report Feature
  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
    }, 1500);
  };

  const handleFixSchedule = (courseId: string) => {
    setCourses(courses.map(c => {
      if (c.id === courseId) {
        return { ...c, delayDays: 0, status: "On Track", plannedTopics: c.completedTopics };
      }
      return c;
    }));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-10">
      
      {/* HEADER & DASHBOARD NAV */}
      <div className="flex flex-col md:flex-row items-start justify-between gap-6 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-sm border border-indigo-500">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Course Engine</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Syllabus Tracking & Resource Optimization</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-slate-50 p-1 rounded-lg flex gap-1 border border-slate-100">
            {["board", "analytics", "map"].map((v) => (
              <button 
                key={v}
                onClick={() => setActiveView(v)} 
                className={cn(
                  "px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all",
                  activeView === v ? "bg-slate-900 text-white shadow-sm" : "text-slate-500 hover:bg-white"
                )}
              >
                {v === "board" ? "Live Board" : v === "analytics" ? "AI Analytics" : "Dependency"}
              </button>
            ))}
          </div>
          <Button size="sm" onClick={handleExport} disabled={isExporting} className="h-8 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg px-4 font-bold uppercase tracking-widest text-[10px] shadow-sm">
            {isExporting ? <RefreshCw className="h-3.5 w-3.5 animate-spin mr-2" /> : <Download className="h-3.5 w-3.5 mr-2" />} Export
          </Button>
        </div>
      </div>

      {activeView === "board" && (
      <div className="space-y-4">
        {courses.some(c => c.status === "Critical") && (
          <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 flex items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 bg-rose-600 rounded-lg flex items-center justify-center animate-pulse text-white">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xs font-black text-rose-800 uppercase tracking-tight">Critical Warning</h3>
                <p className="text-[10px] text-rose-600 font-bold uppercase tracking-tight">Module syllabus delay exceeding 10-day threshold.</p>
              </div>
            </div>
            <Button size="sm" className="bg-rose-600 hover:bg-rose-700 text-white rounded-lg h-8 px-4 font-bold uppercase text-[10px]">
               Recovery Protocol
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => {
            const progress = Math.round((course.completedTopics / course.totalTopics) * 100);
            const plannedProgress = Math.round((course.plannedTopics / course.totalTopics) * 100);

            return (
              <Card key={course.id} className="p-5 rounded-xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="min-w-0">
                       <p className="text-[8px] font-bold text-indigo-600 uppercase tracking-widest">{course.id}</p>
                       <h3 className="text-sm font-black text-slate-900 uppercase truncate mt-0.5">{course.name}</h3>
                    </div>
                    <span className={cn(
                      "px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest border",
                      course.status === 'On Track' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                      course.status === 'Delayed' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                      'bg-rose-50 text-rose-700 border-rose-100'
                    )}>
                      {course.status}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-end">
                      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Syllabus Completion</span>
                      <span className="text-sm font-black text-indigo-600 leading-none">{progress}%</span>
                    </div>
                    <div className="relative h-1.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-50">
                      <div className="absolute top-0 bottom-0 left-0 bg-amber-400 opacity-20" style={{ width: `${plannedProgress}%` }}></div>
                      <div className={cn(
                        "h-full rounded-full transition-all",
                        course.status === "Critical" ? "bg-rose-500" : course.status === "Delayed" ? "bg-amber-500" : "bg-emerald-500"
                      )} style={{ width: `${progress}%` }}></div>
                    </div>
                    <div className="flex justify-between text-[8px] font-bold text-slate-400 uppercase tracking-tighter">
                      <span>{course.completedTopics}/{course.totalTopics} Topics</span>
                      <span className="text-amber-500">Planned: {course.plannedTopics}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex-1 bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <p className="text-[7px] font-bold text-slate-400 uppercase tracking-widest mb-1 leading-none">Class Score</p>
                      <p className={cn("text-lg font-black leading-none", course.understanding < 60 ? 'text-rose-600' : 'text-slate-900')}>{course.understanding}%</p>
                    </div>
                    <div className="flex-1 bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <p className="text-[7px] font-bold text-slate-400 uppercase tracking-widest mb-1 leading-none">Resources</p>
                      <p className="text-lg font-black text-slate-900 leading-none">{course.resources.notes + course.resources.videos}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-4 border-t border-slate-50">
                  <Button variant="outline" size="sm" className="flex-1 h-8 rounded-lg text-[9px] font-bold uppercase tracking-wider">Detail</Button>
                  {course.delayDays > 0 && (
                    <Button size="sm" onClick={() => handleFixSchedule(course.id)} className="bg-amber-500 hover:bg-amber-600 text-white h-8 w-8 p-0 rounded-lg">
                      <RefreshCw className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
      )}

      {activeView === "analytics" && (
      <div className="space-y-6">
        <Card className="p-6 bg-slate-900 text-white rounded-xl border border-slate-800 shadow-sm relative overflow-hidden">
          <div className="relative z-10 space-y-4 max-w-4xl">
             <h3 className="text-sm font-black text-amber-400 uppercase tracking-widest flex items-center gap-2">
               <Zap className="h-4 w-4" /> Curriculum Intelligence
             </h3>
             <p className="text-lg font-black leading-tight uppercase tracking-tight">Node optimization has evaluated syllabus flow.</p>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                   <p className="text-[10px] font-bold leading-relaxed uppercase"><span className="text-amber-400">Optimization:</span> Re-order "Graph Algorithms" before "DP" in DS. Improving retention by 14%.</p>
                </div>
                <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                   <p className="text-[10px] font-bold leading-relaxed uppercase"><span className="text-amber-400">Optimization:</span> Merge "Regex" and "Automata" into a combined module. Saving 4 session days.</p>
                </div>
             </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 rounded-xl border border-slate-200 shadow-sm bg-white">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-6">Faculty Efficiency Matrix</h3>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={FACULTY_ANALYTICS} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} strokeOpacity={0.1} />
                  <XAxis type="number" domain={[0, 100]} hide />
                  <YAxis type="category" dataKey="name" width={60} axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 10, fontWeight: 700}} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', fontSize: '10px' }} />
                  <Bar dataKey="efficiency" fill="#4F46E5" name="Delivery" barSize={10} radius={[0, 4, 4, 0]} />
                  <Bar dataKey="engagement" fill="#10B981" name="Engage" barSize={10} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6 rounded-xl border border-slate-200 shadow-sm bg-white">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-6">Coverage vs Impact</h3>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                  <XAxis type="number" dataKey="completion" name="Syllabus %" domain={[0, 100]} hide />
                  <YAxis type="number" dataKey="performance" name="Score" domain={[0, 100]} hide />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', fontSize: '10px' }} />
                  <Scatter name="Courses" data={PERFORMANCE_VS_COMPLETION}>
                    {PERFORMANCE_VS_COMPLETION.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.completion < 50 ? "#EF4444" : "#10B981"} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
      )}

      {activeView === "map" && (
      <Card className="p-8 rounded-xl border border-slate-200 bg-white shadow-sm flex flex-col items-center justify-center min-h-[400px]">
         <div className="w-full max-w-4xl mx-auto">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest text-center flex items-center justify-center gap-2 mb-12">
               <Network className="h-4 w-4 text-indigo-600" /> Prerequisite Neural Map
            </h3>
            <div className="flex flex-col items-center gap-6">
               <div className="flex justify-center gap-6 w-full">
                  <div className="p-4 bg-slate-900 text-white rounded-lg shadow-sm w-44 text-center border-b-2 border-emerald-500">
                     <p className="font-black text-xs uppercase">Math I</p>
                     <p className="text-[8px] uppercase mt-1 text-emerald-400 font-bold">100% Cleared</p>
                  </div>
                  <div className="p-4 bg-slate-900 text-white rounded-lg shadow-sm w-44 text-center border-b-2 border-emerald-500">
                     <p className="font-black text-xs uppercase">Prog In C</p>
                     <p className="text-[8px] uppercase mt-1 text-emerald-400 font-bold">98% Cleared</p>
                  </div>
               </div>
               <div className="w-1 h-8 bg-slate-100" />
               <div className="flex justify-center gap-6 w-full">
                  <div className="p-4 bg-white text-slate-800 rounded-lg shadow-sm w-44 text-center border-b-2 border-indigo-500 border-x border-t border-slate-100">
                     <p className="font-black text-xs uppercase">DS & Algo</p>
                     <p className="text-[8px] uppercase mt-1 text-indigo-600 font-bold">Active</p>
                  </div>
                  <div className="p-4 bg-white text-slate-800 rounded-lg shadow-sm w-44 text-center border-b-2 border-amber-500 border-x border-t border-slate-100">
                     <p className="font-black text-xs uppercase">Discrete Math</p>
                     <p className="text-[8px] uppercase mt-1 text-amber-600 font-bold">Delayed</p>
                  </div>
               </div>
            </div>
         </div>
      </Card>
      )}
    </div>
  );
}
