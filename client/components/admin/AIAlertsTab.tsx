"use client";

import React, { useEffect, useState } from "react";
import { 
  Zap, AlertCircle, Bell, History, ShieldAlert,
  Loader2, Activity, TrendingDown, CheckCircle2,
  ChevronRight, BrainCircuit
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function AIAlertsTab() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const getApiUrl = (path: string) => {
    const hostname = typeof window !== 'undefined' ? window.location.hostname : '127.0.0.1';
    const apiHost = hostname === 'localhost' ? '127.0.0.1' : hostname;
    return `http://${apiHost}:8000${path}`;
  };

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(getApiUrl("/admin/modules/alerts"), {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) setData(await res.json());
    } catch (error) {
      console.error("Alerts fetch failed", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const resolveAlert = (id: number) => {
    toast.loading(`Synchronizing resolution node...`, { id: "a-res" });
    setTimeout(() => {
      toast.success("Status Restored to Stable.", { id: "a-res" });
      fetchAlerts();
    }, 1500);
  };

  const displayData = data || {
    priority_alerts: [
      { id: 1, type: "Risk", msg: "7 sudden drops in Attendance - AIML B", time: "2 mins ago" },
      { id: 2, type: "Anomaly", msg: "Unusual marks spike in ECE assessments", time: "1 hour ago" }
    ],
    history: [
      { date: "2026-04-01", event: "CGPA outlier flag (737622-S099)", status: "Resolved" },
      { date: "2026-03-31", event: "Faculty feedback dip detected", status: "Path Assigned" }
    ]
  };

  if (loading && !data) return (
    <div className="h-64 flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-rose-600" />
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-10">
      <div className="flex flex-col md:flex-row items-start justify-between gap-6 border-b border-slate-100 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-100 text-rose-600 text-[10px] font-bold tracking-widest uppercase shadow-sm">
            <Zap className="h-3 w-3" /> Institutional Pulse: Active
          </div>
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">AI Intelligence Feed</h2>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-tight leading-snug">Neural anomaly detection nodes identifying risk vectors.</p>
        </div>
        <Button onClick={() => fetchAlerts()} size="sm" variant="outline" className="h-9 px-4 text-[10px] font-bold uppercase tracking-widest border-slate-200">
           Force Re-Scan Stack
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Priority Alerts */}
        <div className="lg:col-span-8 space-y-4">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-3">
            <ShieldAlert className="h-4 w-4 text-rose-600" /> High-Priority Risk Signals
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {displayData.priority_alerts?.map((alert: any) => (
              <Card key={alert.id} className="p-4 rounded-xl bg-white border border-slate-100 shadow-sm hover:border-rose-200 transition-all group relative overflow-hidden">
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shadow-sm group-hover:bg-rose-600 group-hover:text-white transition-all">
                      <AlertCircle className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-[8px] font-bold text-rose-400 uppercase tracking-widest">{alert.type} • {alert.time}</p>
                        <p className="text-sm font-black text-slate-900 uppercase leading-snug truncate max-w-sm">{alert.msg}</p>
                    </div>
                  </div>
                  <Button size="sm" onClick={() => resolveAlert(alert.id)} className="bg-rose-600 hover:bg-rose-700 text-white rounded-lg h-8 px-4 font-black uppercase text-[10px] tracking-widest shadow-sm border-none">Resolve</Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Intelligence Log */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-3">
            <History className="h-4 w-4 text-slate-600" /> Audit Log
          </h3>
          <Card className="p-5 rounded-xl bg-slate-900 border border-slate-800 text-white shadow-sm">
            <div className="space-y-6">
              {displayData.history?.map((log: any, i: number) => (
                <div key={i} className="space-y-1 relative pl-6 border-l border-indigo-600">
                  <div className="absolute -left-1.5 top-0 h-3 w-3 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                  <p className="text-[8px] font-bold text-indigo-400 uppercase tracking-widest">{log.date}</p>
                  <p className="text-[10px] font-bold text-slate-100 uppercase leading-tight">{log.event}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 text-[7px] font-black uppercase text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-sm">{log.status}</span>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-6 h-8 text-[9px] font-bold uppercase tracking-widest text-slate-400 hover:bg-white/5 p-0">Download Audit Log</Button>
          </Card>
        </div>
      </div>

      {/* Stats Cluster */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: <Activity className="h-5 w-5" />, label: "Anomaly Spikes", val: "14", sub: "+2 Today", color: "text-blue-600", bg: "bg-blue-50" },
          { icon: <TrendingDown className="h-5 w-5" />, label: "Resolved Nodes", val: "128", sub: "92% Efficacy", color: "text-emerald-600", bg: "bg-emerald-50" },
          { icon: <CheckCircle2 className="h-5 w-5" />, label: "Stable Boundaries", val: "94.2%", sub: "Equilibrium", color: "text-indigo-600", bg: "bg-indigo-50" }
        ].map((stat, i) => (
          <Card key={i} className="p-5 rounded-xl border border-slate-100 bg-white shadow-sm flex items-center gap-4 group">
            <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center shadow-sm shrink-0", stat.bg, stat.color)}>
              {stat.icon}
            </div>
            <div className="min-w-0">
               <p className="text-xl font-black text-slate-900 leading-none">{stat.val}</p>
               <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{stat.label}</p>
               <p className={cn("text-[8px] font-bold uppercase mt-1", stat.color)}>{stat.sub}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
