"use client";

import React, { useState, useEffect } from "react";
import { Users, FileText, CheckCircle, Clock, Search, Brain, Download, ChevronRight, BarChart3, PieChart, Sparkles, Target } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Submission {
 student_name: string;
 department: string;
 score: number;
 status: string;
 submitted_at: string;
 accuracy: number;
 rank?: number;
}

interface TestStats {
 total_submitted: number;
 average_score: number;
 top_score: number;
}

export default function AdminResults() {
 const [tests, setTests] = useState<any[]>([]);
 const [selectedTest, setSelectedTest] = useState<string | null>(null);
 const [results, setResults] = useState<Submission[]>([]);
 const [stats, setStats] = useState<TestStats | null>(null);
 const [loading, setLoading] = useState(false);

 const getApiUrl = (path: string) => {
 const hostname = typeof window !== 'undefined' ? window.location.hostname : '127.0.0.1';
 return `http://${hostname}:8001/api${path}`;
 };

 const fetchTests = async () => {
 try {
 const token = localStorage.getItem('token');
 const res = await fetch(getApiUrl("/ai/tests"), {
 headers: { 'Authorization': `Bearer ${token}` }
 });
 const data = await res.json();
 if (Array.isArray(data)) setTests(data);
 } catch (err) {
 console.error("Neural Test Node Offline.", err);
 }
 };

 const fetchResults = async (testId: string) => {
 setLoading(true);
 setSelectedTest(testId);
 try {
 const token = localStorage.getItem('token');
 const res = await fetch(getApiUrl(`/test/results/${testId}`), {
 headers: { 'Authorization': `Bearer ${token}` }
 });
 const data = await res.json();
 if (data.results) {
 setResults(data.results);
 setStats(data.stats);
 }
 } catch (err) {
 console.error("Neural Result Node Offline.", err);
 } finally {
 setLoading(false);
 }
 };

 useEffect(() => { fetchTests(); }, []);

 const displayTests = tests.length > 0 ? tests : [
 { id: "T1", title: "Neural Systems Audit", subject: "AIML Node 1", year: "3rd", department: "CSE" },
 { id: "T2", title: "Cloud Security Evaluation", subject: "Cyber S4", year: "4th", department: "IT" }
 ];

 const displayResults = results.length > 0 ? results : [
 { student_name: "Rahul S", department: "AIML", score: 88, status: "Evaluated", submitted_at: "Mar 31", accuracy: 94, rank: 1 },
 { student_name: "Anita V", department: "ECE", score: 72, status: "Evaluated", submitted_at: "Mar 31", accuracy: 82, rank: 2 }
 ];

 const displayStats = stats || { total_submitted: 45, average_score: 74, top_score: 98 };

 const evaluateAll = async () => {
 if (!selectedTest) return;
 setLoading(true);
 setTimeout(() => fetchResults(selectedTest), 2000);
 };

 return (
 <div className="space-y-6 animate-in fade-in duration-700 pb-10">
  {/* Header Section */}
  <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
    <div className="flex items-center gap-4">
      <div className="p-2.5 bg-emerald-50 rounded-lg shadow-sm border border-emerald-100">
        <BarChart3 className="w-5 h-5 text-emerald-600" />
      </div>
      <div>
        <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
          Monitoring Node
          <span className="px-1.5 py-0.5 bg-emerald-50 rounded text-[9px] font-black text-emerald-600 uppercase tracking-widest border border-emerald-100">Live</span>
        </h2>
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Tracking AI assessments and student data.</p>
      </div>
    </div>
    <div className="flex gap-4">
      <div className="px-4 py-2 bg-slate-50 rounded-lg border border-slate-200 text-right w-32 shadow-sm">
        <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Global Index</p>
        <p className="text-xl font-black text-slate-900 leading-none">{displayTests.length}</p>
      </div>
    </div>
  </div>

  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
    {/* Sidebar */}
    <div className="lg:col-span-4 space-y-4">
      <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Active Protocols</h3>
      <div className="space-y-2">
        {displayTests.map(test => (
          <button
            key={test.id}
            onClick={() => fetchResults(test.id)}
            className={cn(
              "w-full p-4 text-left rounded-xl transition-all border group relative",
              selectedTest === test.id 
                ? "bg-indigo-600 border-indigo-500 shadow-md translate-x-1" 
                : "bg-white border-slate-200 hover:bg-slate-50"
            )}
          >
            <div className="flex items-start justify-between mb-2">
              <p className={cn("font-black text-xs uppercase truncate w-40", selectedTest === test.id ? "text-white" : "text-slate-900")}>{test.title}</p>
              {selectedTest === test.id && <Sparkles size={12} className="text-white animate-pulse" />}
            </div>
            <div className="flex items-center justify-between">
              <p className={cn("text-[8px] font-bold uppercase tracking-widest", selectedTest === test.id ? "text-indigo-200" : "text-slate-500")}>{test.subject}</p>
              <span className={cn("text-[9px] font-bold", selectedTest === test.id ? "text-indigo-200" : "text-slate-500")}>{test.year}yr • {test.department}</span>
            </div>
          </button>
        ))}
      </div>
    </div>

    {/* Main Content */}
    <div className="lg:col-span-8">
      {!selectedTest ? (
        <Card className="h-64 flex flex-col items-center justify-center bg-slate-50 border-dashed border-slate-200 rounded-xl shadow-none">
          <PieChart size={32} className="text-slate-300 mb-4" />
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Select a protocol for visualization</p>
        </Card>
      ) : (
        <div className="space-y-6 animate-in fade-in duration-500">
          {/* Stats Cluster */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Participants", value: displayStats.total_submitted, icon: Users },
              { label: "Mean Score", value: `${displayStats.average_score}%`, icon: Target },
              { label: "Top Node", value: `${displayStats.top_score}%`, icon: Sparkles, highlight: true }
            ].map((s, i) => (
              <Card key={i} className={cn(
                "p-4 rounded-xl border shadow-sm",
                s.highlight ? "bg-emerald-50 border-emerald-100" : "bg-white border-slate-200"
              )}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">{s.label}</p>
                  <s.icon className="h-3 w-3 text-emerald-600" />
                </div>
                <p className={cn("text-xl font-black", s.highlight ? "text-emerald-700" : "text-slate-900")}>{s.value}</p>
              </Card>
            ))}
          </div>

          {/* Table Container */}
          <Card className="bg-white border-slate-200 rounded-xl overflow-hidden overflow-x-auto shadow-sm">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight">Submission Matrix</h4>
                <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Neural Consensus Nodes</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={evaluateAll} className="h-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[9px] font-black uppercase tracking-widest px-4 border-none transition-all active:scale-95 shadow-sm">
                  Evaluate
                </Button>
              </div>
            </div>

            <table className="w-full text-left">
              <thead className="bg-slate-50/50 border-b border-slate-100">
                <tr className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                  <th className="p-4">Candidate</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Accuracy</th>
                  <th className="p-4">Rank</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {displayResults.map((r, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="p-4">
                      <p className="text-xs font-black text-slate-900 uppercase truncate w-32">{r.student_name}</p>
                      <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">{r.department}</p>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        <div className={cn("w-1 h-1 rounded-full", r.status === "Evaluated" ? "bg-emerald-500" : "bg-amber-500")} />
                        <span className={cn("text-[9px] font-black uppercase tracking-widest", r.status === "Evaluated" ? "text-emerald-600" : "text-amber-500")}>{r.status}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-100 h-1 rounded-full overflow-hidden shrink-0">
                          <div className="bg-emerald-500 h-full rounded-full" style={{width: `${r.accuracy}%`}}></div>
                        </div>
                        <span className="text-[10px] font-black text-slate-900">{r.score}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={cn(
                        "px-1.5 py-0.5 rounded text-[8px] font-black uppercase",
                        r.rank === 1 ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-500"
                      )}>
                        #{r.rank}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      )}
    </div>
  </div>
 </div>
 );
}
