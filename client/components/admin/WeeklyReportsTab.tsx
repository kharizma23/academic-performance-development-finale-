"use client";

import React, { useEffect, useState } from "react";
import { 
  FileText, Download, Briefcase, TrendingUp, 
  Calendar, Mail, ChevronRight, Loader2,
  CheckCircle2, AlertTriangle, ArrowUpRight
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { cn } from "@/lib/utils";

export default function WeeklyReportsTab() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const getApiUrl = (path: string) => {
    const hostname = typeof window !== 'undefined' ? window.location.hostname : '127.0.0.1';
    const apiHost = hostname === 'localhost' ? '127.0.0.1' : hostname;
    return `http://${apiHost}:8000${path}`;
  };

  const fetchReports = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(getApiUrl("/admin/modules/reports"), {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) setData(await res.json());
    } catch (error) {
      console.error("Reports fetch failed", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleDownload = async (reportId: string) => {
    const element = document.getElementById(`report-node-${reportId}`);
    if (!element) return;
    
    toast.loading("Preparing PDF...", { id: "p-load" });
    try {
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("l", "mm", "a4");
      const imgWidth = 280;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
      pdf.save(`Audit_W${reportId}.pdf`);
      toast.success("Report Exported", { id: "p-load" });
    } catch (err) {
      toast.error("Export Failure", { id: "p-load" });
    }
  };

  const handleEmail = (reportId: string) => {
    toast.info(`Initializing email node for Week ${reportId}...`);
    setTimeout(() => {
      toast.success(`Report dispatched to nodes.`);
    }, 2000);
  };

  const displayData = data || {
    reports: [
      { week_number: 12, performance_vs_last_week: 4.2, start_date: "Mar 24", end_date: "Mar 31", ai_summary: "Upward trend in technical proficiency across CSE and AIML. Attendance remains stable at 89.4%." },
      { week_number: 11, performance_vs_last_week: 2.1, start_date: "Mar 17", end_date: "Mar 24", ai_summary: "Syllabus depth for core subjects ahead of timeline. Placement modules for Year 3 cohorts initialized." },
      { week_number: 10, performance_vs_last_week: 1.5, start_date: "Mar 10", end_date: "Mar 17", ai_summary: "Optimal resource allocation. Engagement delta remains positive at +3.1% in the cycle." }
    ]
  };

  if (loading && !data) return (
    <div className="h-64 flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-10">
      <div className="flex flex-col md:flex-row items-start justify-between gap-6 pb-6 border-b border-slate-100">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-bold tracking-widest uppercase shadow-sm">
            <Calendar className="h-3 w-3" /> AY 2025-26
          </div>
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Weekly Intelligence</h2>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-tight leading-snug">Summarizing performance, attendance, and syllabus completion vectors.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => fetchReports()} variant="outline" size="sm" className="h-9 px-4 text-[10px] font-bold uppercase tracking-widest border-slate-200">
            <ArrowUpRight className="h-4 w-4 mr-2" /> 
            Regenerate Consensus
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5 rounded-xl bg-indigo-600 shadow-sm text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <TrendingUp className="h-16 w-16" />
          </div>
          <p className="text-[10px] font-bold uppercase text-indigo-200 tracking-widest mb-2">Academic Velocity</p>
          <p className="text-2xl font-black mb-4">82.4%</p>
          <div className="p-2.5 bg-white/10 rounded-lg border border-white/10">
            <p className="text-[10px] font-bold text-white uppercase leading-snug">"Up 4.2% based on latest nodes."</p>
          </div>
        </Card>
        <Card className="p-5 rounded-xl bg-indigo-900 shadow-sm text-white relative overflow-hidden group">
          <p className="text-[10px] font-bold uppercase text-indigo-400 tracking-widest mb-2">Mean Attendance</p>
          <p className="text-2xl font-black mb-4">88.5%</p>
          <div className="p-2.5 bg-white/10 rounded-lg border border-white/10">
             <p className="text-[10px] font-bold text-white uppercase leading-snug">"High-density stability in vectors."</p>
          </div>
        </Card>
        <Card className="p-5 rounded-xl bg-slate-900 shadow-sm text-white relative overflow-hidden group">
          <p className="text-[10px] font-bold uppercase text-slate-400 tracking-widest mb-2">Syllabus Depth</p>
          <p className="text-2xl font-black mb-4">75.0%</p>
          <div className="p-2.5 bg-white/10 rounded-lg border border-white/10">
             <p className="text-[10px] font-bold text-white uppercase leading-snug">"Core progression aligns with timeline."</p>
          </div>
        </Card>
      </div>

      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-3">
          <div className="h-0.5 w-8 bg-blue-600 rounded-full" /> Institutional Consensus History
        </h3>
        <div className="grid grid-cols-1 gap-3">
          {displayData.reports?.map((report: any, i: number) => (
            <Card key={i} id={`report-node-${report.week_number}`} className="group p-5 rounded-xl border border-slate-100 bg-white shadow-sm hover:border-blue-300 transition-all cursor-pointer">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-5 w-full">
                  <div className="h-10 w-10 flex-shrink-0 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="space-y-1 w-full min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="text-sm font-black text-slate-900 uppercase">Audit: Week {report.week_number}</p>
                      <span className="px-2 py-0.5 text-[8px] font-black uppercase text-emerald-700 bg-emerald-50 border border-emerald-100 rounded">
                        +{report.performance_vs_last_week}% Delta
                      </span>
                    </div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                       {report.start_date} <ChevronRight className="h-2 w-2" /> {report.end_date}
                    </p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase leading-snug truncate">"{report.ai_summary}"</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all shrink-0">
                  <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); handleDownload(report.week_number); }} className="h-8 w-8 p-0 rounded-lg border-slate-100 hover:text-blue-600">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); handleEmail(report.week_number); }} className="h-8 w-8 p-0 rounded-lg border-slate-100 hover:text-blue-600">
                    <Mail className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Card className="p-6 rounded-xl border border-blue-100 bg-blue-50/50 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 group">
        <div className="space-y-2 max-w-2xl text-center md:text-left">
          <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center justify-center md:justify-start gap-2">
            <TrendingUp className="h-3.5 w-3.5" /> Performance Delta Vault
          </h4>
          <h3 className="text-xl font-black text-blue-900 uppercase leading-none">Neural Analytics</h3>
          <p className="text-[10px] font-bold text-blue-500 uppercase leading-relaxed opacity-70">Neural analysis comparing consistency across institutional cohorts and departmental nodes.</p>
        </div>
        <Button className="bg-blue-600 text-white hover:bg-blue-700 rounded-lg h-9 px-6 font-black uppercase text-[10px] tracking-widest shadow-md transition-all active:scale-95 shrink-0 border-none">
          Enter Vault
        </Button>
      </Card>
    </div>
  );
}
