"use client";
import React, { useState } from "react";
import { Search, Filter, Star, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
 facultyList: any[];
 onSelectFaculty: (id: string) => void;
}

export default function FacultyTable({ facultyList, onSelectFaculty }: Props) {
 const [search, setSearch] = useState("");
 const [deptFilter, setDeptFilter] = useState("ALL");
 const [sortBy, setSortBy] = useState<"rating" | "impact" | "name">("impact");

 const depts = ["ALL", ...Array.from(new Set(facultyList.map(f => f.department).filter(Boolean)))];

 const filtered = facultyList
 .filter(f =>
 (deptFilter === "ALL" || f.department === deptFilter) &&
 (f.name?.toLowerCase().includes(search.toLowerCase()) || f.department?.toLowerCase().includes(search.toLowerCase()))
 )
 .sort((a, b) => {
  if (sortBy === "name") return (a.name || "").localeCompare(b.name || "");
  return ((b as any)[sortBy] ?? 0) > ((a as any)[sortBy] ?? 0) ? 1 : -1;
 });

 return (
 <div className="bg-white border border-slate-100 rounded-xl shadow-sm overflow-hidden">
  {/* Controls */}
  <div className="p-5 border-b border-slate-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50/50">
    <div className="space-y-1">
      <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight">Faculty Directory ({facultyList.length})</h2>
      <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Select record for analytical breakdown</p>
    </div>
    <div className="flex flex-wrap gap-2 w-full md:w-auto">
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
        <input
          type="text"
          placeholder="Query name..."
          className="pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-600 transition-all w-40 outline-none"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      <select
        className="px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-700 outline-none"
        value={deptFilter}
        onChange={e => setDeptFilter(e.target.value)}
      >
        {depts.map(d => <option key={d} value={d}>{d}</option>)}
      </select>
      <select
        className="px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-700 outline-none"
        value={sortBy}
        onChange={e => setSortBy(e.target.value as any)}
      >
        <option value="impact">Sort: Impact</option>
        <option value="rating">Sort: Rating</option>
        <option value="name">Sort: Name</option>
      </select>
    </div>
  </div>

  {/* Table */}
  <div className="overflow-x-auto overflow-y-auto max-h-[500px] scrollbar-hide">
    <table className="w-full text-left">
      <thead className="bg-slate-50 border-b border-slate-100 sticky top-0 z-10">
        <tr className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
          <th className="p-4">Faculty Profiling</th>
          <th className="p-4">Institutional Node</th>
          <th className="p-4">Key Specializations</th>
          <th className="p-4 text-center">Mean Rating</th>
          <th className="p-4">Impact Delta</th>
          <th className="p-4 text-center">Node Link</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-50">
        {filtered.length === 0 ? (
          <tr><td colSpan={6} className="p-8 text-center text-slate-400 font-bold text-xs uppercase tracking-widest">No nodes detected in consensus database.</td></tr>
        ) : filtered.map((f) => (
          <tr
            key={f.id}
            className="group hover:bg-emerald-50/30 transition-all cursor-pointer"
            onClick={() => onSelectFaculty(f.id)}
          >
            <td className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-slate-100 text-slate-600 rounded-lg flex items-center justify-center font-black text-xs border border-slate-200 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm">
                  {f.name?.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="font-black text-xs text-slate-900 group-hover:text-emerald-700 transition-colors uppercase truncate leading-tight">{f.name}</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{f.designation || "Faculty Node"}</p>
                </div>
              </div>
            </td>
            <td className="p-4">
              <span className="px-2 py-0.5 bg-slate-50 border border-slate-100 rounded text-[9px] font-black text-slate-600 uppercase tracking-widest">{f.department}</span>
            </td>
            <td className="p-4">
              <div className="flex flex-wrap gap-1.5">
                {(f.subjects ?? []).slice(0, 1).map((s: string, j: number) => (
                  <span key={j} className="text-[8px] font-black text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 uppercase">{s}</span>
                ))}
                {(f.subjects?.length ?? 0) > 1 && <span className="text-[8px] font-bold text-slate-400 uppercase">+{f.subjects.length - 1} Nodes</span>}
              </div>
            </td>
            <td className="p-4 text-center">
              <div className="flex items-center justify-center gap-1">
                <Star className="h-2.5 w-2.5 text-amber-500 fill-current" />
                <span className="font-black text-xs text-slate-900">{f.rating}</span>
              </div>
            </td>
            <td className="p-4">
              <div className="w-24">
                <div className="flex justify-between text-[7px] font-black uppercase text-slate-400 mb-1 tracking-widest">
                  <span>Delta</span><span>{f.impact}%</span>
                </div>
                <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                  <div className={cn("h-full transition-all duration-700", (f.impact ?? 0) > 85 ? "bg-emerald-500" : "bg-emerald-600")} style={{ width: `${Math.min(f.impact ?? 0, 100)}%` }} />
                </div>
              </div>
            </td>
            <td className="p-4 text-center">
              <button
                onClick={e => { e.stopPropagation(); onSelectFaculty(f.id); }}
                className="h-7 w-7 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all shadow-sm mx-auto"
              >
                <ChevronRight size={14} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
 </div>
 );
}
