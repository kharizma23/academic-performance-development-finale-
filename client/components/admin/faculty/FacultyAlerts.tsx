"use client";
import React, { useState } from "react";
import { AlertTriangle, Bell, ShieldAlert, TrendingDown, UserCheck, X } from "lucide-react";
import { assignIntervention } from "@/lib/api-faculty";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Alert {
 id: string;
 type: string;
 severity: string;
 faculty_id: string;
 faculty_name: string;
 department: string;
 message: string;
 metric: string;
 value: any;
 timestamp: string;
}

interface Props {
 alerts: Alert[];
 onSelectFaculty: (id: string) => void;
}

const severityConfig: Record<string, { bg: string; border: string; badge: string; icon: any }> = {
 critical: { bg: "bg-rose-50", border: "border-rose-100", badge: "bg-rose-600 text-white", icon: ShieldAlert },
 warning: { bg: "bg-amber-50", border: "border-amber-100", badge: "bg-amber-500 text-white", icon: AlertTriangle },
 low: { bg: "bg-blue-50", border: "border-blue-100", badge: "bg-blue-500 text-white", icon: Bell },
};

const typeLabel: Record<string, string> = {
 "Performance Risk": "Pedagogical Risk",
 "Operational Anomaly": "Node Inconsistency",
 "Syllabus Latency": "Curriculum Lag",
};

export default function FacultyAlerts({ alerts, onSelectFaculty }: Props) {
 const [dismissed, setDismissed] = useState<Set<string>>(new Set());
 const [intervening, setIntervening] = useState<string | null>(null);
 const [description, setDescription] = useState("");
 const [intType, setIntType] = useState("Training");
 const [success, setSuccess] = useState<string | null>(null);

 const visible = alerts.filter(a => !dismissed.has(`${a.id}-${a.type}`));
 const highCount = visible.filter(a => a.severity === "critical").length;
 const medCount = visible.filter(a => a.severity === "warning").length;

 const handleIntervene = async (alert: Alert) => {
 try {
 await assignIntervention({ faculty_id: alert.faculty_id, type: intType, description: description || `Auto-assigned due to: ${alert.message}` });
 setSuccess(`Intervention assigned for ${alert.faculty_name}`);
 setIntervening(null);
 setTimeout(() => setSuccess(null), 3000);
 } catch {
 alert2("Failed to assign intervention.");
 }
 };

 function alert2(msg: string) { window.alert(msg); }

 return (
 <div className="space-y-4 animate-in fade-in duration-700">
  {/* Summary Bar */}
  <Card className="bg-slate-900 border-none p-5 rounded-xl flex flex-col md:flex-row justify-between items-center gap-4 text-white shadow-md">
    <div className="flex items-center gap-3">
      <Bell className="h-5 w-5 text-emerald-500" />
      <div>
        <h2 className="text-sm font-black uppercase tracking-tight">Faculty Alert Center</h2>
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">{visible.length} Active Alerts Detected</p>
      </div>
    </div>
    <div className="flex gap-2">
      <div className="text-center px-4 py-1.5 bg-rose-500/10 border border-rose-500/20 rounded-lg">
        <p className="text-sm font-black text-rose-500 leading-none">{highCount}</p>
        <p className="text-[7px] font-bold uppercase text-rose-500 tracking-tighter">Critical</p>
      </div>
      <div className="text-center px-4 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-lg">
        <p className="text-sm font-black text-amber-500 leading-none">{medCount}</p>
        <p className="text-[7px] font-bold uppercase text-amber-500 tracking-tighter">Warning</p>
      </div>
    </div>
  </Card>

  {success && (
    <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3 flex items-center gap-2.5 animate-in slide-in-from-top-2">
      <UserCheck className="h-4 w-4 text-emerald-600 shrink-0" />
      <span className="text-[10px] font-black uppercase text-emerald-700">{success}</span>
    </div>
  )}

  {/* Alert List */}
  {visible.length === 0 ? (
    <Card className="p-12 text-center border-slate-100 bg-white rounded-xl">
      <UserCheck className="h-8 w-8 text-emerald-500 mx-auto mb-3" />
      <p className="text-xs font-black uppercase text-slate-900">No Nodes At Risk</p>
      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">All members performing within accepted thresholds.</p>
    </Card>
  ) : (
    <div className="space-y-2">
      {visible.map((alert, i) => {
        const cfg = severityConfig[alert.severity] ?? severityConfig.low;
        const Icon = cfg.icon;
        return (
          <div key={i} className={cn(
            "border rounded-xl p-4 flex flex-col transition-all hover:shadow-sm",
            cfg.bg, cfg.border
          )}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-3">
                <div className={cn("p-2 rounded-lg shrink-0", cfg.badge)}><Icon size={14} /></div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <p className="text-xs font-black text-slate-900 uppercase truncate max-w-[150px]">{alert.faculty_name}</p>
                    <span className={cn("text-[7px] px-1.5 py-0.5 rounded font-black uppercase", cfg.badge)}>{alert.severity}</span>
                    <span className="text-[7px] px-1.5 py-0.5 rounded font-black uppercase bg-white/50 border border-black/5 text-slate-600">{typeLabel[alert.type] ?? alert.type}</span>
                  </div>
                  <p className="text-[10px] font-bold text-slate-700 uppercase leading-snug truncate max-w-lg">{alert.message}</p>
                  <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">{alert.department} · {alert.metric}: <span className="text-slate-900 font-black">{alert.value}</span></p>
                </div>
              </div>
              <div className="flex gap-1.5 shrink-0 w-full md:w-auto">
                <Button size="sm" variant="outline" onClick={() => onSelectFaculty(alert.faculty_id)} className="h-7 px-3 text-[8px] font-black uppercase tracking-widest border-slate-200">View</Button>
                <Button size="sm" onClick={() => { setIntervening(alert.faculty_id); setDescription(""); }} className="h-7 px-3 text-[8px] font-black uppercase tracking-widest bg-emerald-700 hover:bg-emerald-800 text-white border-none">Intervene</Button>
                <Button variant="ghost" size="sm" onClick={() => setDismissed(prev => new Set([...prev, `${alert.faculty_id}-${alert.type}`]))} className="h-7 w-7 p-0 text-slate-400 hover:text-rose-600">
                  <X size={14} />
                </Button>
              </div>
            </div>

            {/* Intervention inline form */}
            {intervening === alert.faculty_id && (
              <div className="mt-4 pt-4 border-t border-black/5 space-y-3 animate-in fade-in slide-in-from-top-2">
                <div className="flex gap-2">
                  {["Training", "Mentoring"].map(t => (
                    <button key={t} onClick={() => setIntType(t)}
                      className={cn(
                        "flex-1 py-1.5 rounded-lg text-[9px] font-black uppercase border transition-all",
                        intType === t ? "bg-rose-600 text-white border-rose-600" : "bg-white border-slate-200 text-slate-500"
                      )}
                    >{t}</button>
                  ))}
                </div>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Plan description..."
                  className="w-full bg-white/50 border border-slate-200 rounded-lg p-3 text-[10px] font-bold min-h-[60px] outline-none focus:border-emerald-600 transition-all text-slate-900"
                />
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setIntervening(null)} className="flex-1 h-8 text-[9px] font-black uppercase text-slate-400">Cancel</Button>
                  <Button size="sm" onClick={() => handleIntervene(alert)} className="flex-1 h-8 text-[9px] font-black uppercase bg-slate-900 hover:bg-black text-white border-none">Deploy Protocol</Button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  )}
 </div>
 );
}
