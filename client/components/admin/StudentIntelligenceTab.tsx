"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Filter, GraduationCap, UserPlus, Search, TrendingUp, Award, UserCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { fetchStudents, getApiUrl } from "@/lib/api-admin";

const DEPARTMENTS = [
  "AIML", "AGRI", "EEE", "EIE", "ECE", "BT", "BME",
  "CIVIL", "IT", "MECH", "MECHATRONICS", "CSE", "FT", "FD", "AIDS"
];

const YEARS = [
  { id: 1, label: "1st Year", batch: "2025-2029" },
  { id: 2, label: "2nd Year", batch: "2024-2028" },
  { id: 3, label: "3rd Year", batch: "2023-2027" },
  { id: 4, label: "4th Year", batch: "2022-2026" },
];

export default function StudentIntelligenceTab() {
  const router = useRouter();
  const [selectedDept, setSelectedDept] = useState("AIML");
  const [selectedYear, setSelectedYear] = useState(3);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Institutional Node Refresh Sync
  const loadStudents = async () => {
    setLoading(true);
    try {
      const data = await fetchStudents(selectedDept, selectedYear);
      if (data && data.students) {
        setStudents(data.students);
      } else if (Array.isArray(data)) {
        setStudents(data);
      }
    } catch (error) {
      console.error("Student intelligence fetch failed", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, [selectedDept, selectedYear]);

  const handleNoteSave = async (id: string, note: string) => {
    try {
      const token = localStorage.getItem('token');
      // Using synchronized global bridge URL
      await fetch(getApiUrl(`/admin/students/${id}/notes?note=${encodeURIComponent(note)}`), {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      loadStudents(); // Refresh to sync
    } catch (e) { console.error("Note save failed", e); }
  };

  const filteredStudents = students.filter(s => 
    (s.user?.full_name || s.name || "").toLowerCase().includes(searchQuery.toLowerCase()) || 
    (s.roll_number || "").toString().toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-700 w-full mb-10 px-4">
      {/* Search & Header (Restored Full Visual Balance) */}
      <div className="flex flex-col xl:flex-row items-start justify-between gap-6 pb-6 border-b border-slate-100">
        <div className="space-y-2 max-w-5xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 shadow-sm text-blue-700 text-[10px] font-bold uppercase">
            <UserCircle className="h-3.5 w-3.5" /> Command Directory
          </div>
          <h2 className="text-2xl font-black text-slate-900 uppercase leading-none tracking-tight">Student Intelligence</h2>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-tight leading-snug">Tracking {students.length} behavioral vectors for <span className="text-blue-600">Institutional {selectedDept}</span>.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input 
              type="text"
              placeholder="Search UI..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-full pl-9 pr-3 rounded-lg border border-slate-200 bg-white shadow-sm outline-none text-xs font-bold text-slate-900 focus:border-blue-600 transition-all placeholder:text-slate-300 uppercase"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <Card className="md:col-span-4 p-5 rounded-xl border border-slate-200 bg-white shadow-sm hover:border-blue-200 transition-all">
          <div>
            <h3 className="text-[10px] font-bold text-slate-900 uppercase tracking-widest mb-4 border-l-2 border-blue-600 pl-3">Sector Selector</h3>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full h-8 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-bold text-slate-900 focus:border-blue-600 outline-none transition-all uppercase cursor-pointer"
            >
              {DEPARTMENTS.map(dept => <option key={dept} value={dept}>{dept}</option>)}
            </select>
          </div>
        </Card>

        <Card className="md:col-span-8 p-5 rounded-xl border border-slate-200 bg-white shadow-sm">
          <h3 className="text-[10px] font-bold text-slate-900 uppercase tracking-widest mb-4 border-l-2 border-blue-600 pl-3">Academic Tier</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {YEARS.map(year => (
              <button
                key={year.id}
                onClick={() => setSelectedYear(year.id)}
                className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all ${
                  selectedYear === year.id
                    ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                    : "border-slate-100 bg-white text-slate-400 hover:border-blue-200 hover:text-blue-600"
                }`}
              >
                <span className="text-[10px] font-bold uppercase">{year.label}</span>
                <span className="text-[8px] font-medium uppercase opacity-50">{year.batch}</span>
              </button>
            ))}
          </div>
        </Card>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-md">
              <GraduationCap size={16} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-950 uppercase leading-none">Intelligence Nodes</h3>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Active Synchronized Directory</p>
            </div>
          </div>
          <p className="text-[10px] font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            {filteredStudents.length} Found
          </p>
        </div>

        {loading ? (
          <div className="h-48 flex flex-col items-center justify-center gap-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <p className="text-[10px] font-bold text-slate-400 uppercase">Synchronizing...</p>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-xl border border-dashed border-slate-200">
             <GraduationCap className="h-10 w-10 text-slate-200 mx-auto mb-4 opacity-30" />
             <p className="text-xs font-bold text-slate-400 uppercase">Sector Node Offline</p>
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredStudents.map((s, i) => (
              <Card key={`${s.id}-${s.roll_number}-${i}`} className="group p-5 rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="h-10 w-10 bg-slate-100 text-blue-600 rounded-lg flex items-center justify-center text-xs font-black group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm border border-blue-50">
                      {(s.user?.full_name || s.name || "S").split(' ').map((n: any) => n[0]).join('').substring(0,2).toUpperCase()}
                    </div>
                    <div className="text-right">
                      <p className="text-[8px] font-bold text-slate-300 uppercase">Efficiency</p>
                      <p className="text-xl font-black text-slate-900 group-hover:text-blue-600">{(s.current_cgpa || 0).toFixed(2)}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase truncate mb-0.5">{s.user?.full_name || s.name}</h4>
                    <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">{s.roll_number}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pb-3">
                    <div className="p-2 bg-blue-50/50 rounded-lg border border-blue-100/50">
                      <p className="text-[8px] font-bold text-blue-400 uppercase mb-1">Attendance</p>
                      <p className="text-sm font-black text-slate-950">{(s.attendance_percentage || 0)}%</p>
                    </div>
                    <div className="p-2 bg-indigo-50/50 rounded-lg border border-indigo-100/50">
                      <p className="text-[8px] font-bold text-indigo-400 uppercase mb-1">Risk</p>
                      <p className={`text-sm font-black uppercase ${s.risk_level === 'High' ? 'text-red-500' : 'text-emerald-500'}`}>{s.risk_level || "LOW"}</p>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <p className="text-[8px] font-bold text-slate-400 uppercase mb-2">Admin Notes</p>
                    <textarea
                      defaultValue={s.admin_notes || ""}
                      onBlur={(e) => handleNoteSave(s.id, e.target.value)}
                      placeholder="..."
                      className="w-full bg-transparent border-none outline-none text-[10px] font-medium text-slate-700 placeholder:text-slate-200 min-h-[40px] resize-none"
                    />
                  </div>
                </div>

                <Link href={`/admin/students/${s.id}`} className="block w-full mt-4">
                  <Button size="sm" className="w-full h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold uppercase text-[10px] tracking-wider transition-all border-none shadow-sm shadow-blue-100">
                    Open Intelligence
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
