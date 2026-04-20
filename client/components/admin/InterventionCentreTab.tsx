"use client";

import React, { useState, useEffect } from "react";
import { 
 ShieldAlert, Activity, Users, 
 MessageSquare, Zap, Target, TrendingUp,
 AlertTriangle, CheckCircle2, Clock, 
 Search, Filter, Plus, ArrowUpRight, GraduationCap,
 Briefcase, LayoutGrid, Calendar, Send, UserPlus,
 BarChart3, Binary, Rocket
} from "lucide-react";
import { 
 ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
 CartesianGrid, Tooltip, BarChart, Bar, Cell, PieChart, Pie
} from "recharts";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function InterventionCentreTab() {
 const [loading, setLoading] = useState(false);
 const [interventions, setInterventions] = useState<any[]>([
  { id: 1, student_name: "Rahul S", student_id: "STU492", issue: "CGPA volatility (4.2).", risk_level: "HIGH", status: "ACTIVE", progress: 32, created_at: "Mar 31" },
  { id: 2, student_name: "Anita V", student_id: "STU501", issue: "Engagement gap (68%).", risk_level: "MEDIUM", status: "PENDING", progress: 15, created_at: "Apr 01" },
  { id: 3, student_name: "Karthik M", student_id: "STU508", issue: "Behavior drift Section B.", risk_level: "LOW", status: "PENDING", progress: 0, created_at: "Apr 01" }
 ]);
 const [stats, setStats] = useState<any>({
  active: 12,
  completed: 45,
  risk_reduction_pct: 12.4,
  success_rate: 94
 });
 const [selectedIntervention, setSelectedIntervention] = useState<any>(null);
 const [isActionPanelOpen, setIsActionPanelOpen] = useState(false);

 const fetchData = async () => {}; // Simulated
 useEffect(() => { fetchData(); }, []);

 const handleTakeAction = async (interventionId: number, action: string) => {
  setIsActionPanelOpen(false);
 };

 return (
 <div className="space-y-6 pb-10 animate-in fade-in duration-500">
  {/* Header & Quick Stats */}
  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
    <div className="md:col-span-8 bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-100 text-rose-600 text-[10px] font-bold tracking-widest uppercase mb-4">
          <Activity className="h-3 w-3" /> Institutional Risk Center
        </div>
        <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Intervention Command</h1>
        <p className="text-slate-500 font-semibold text-xs mt-1 max-w-xl uppercase">Refining underperformance vectors through corrective nodes.</p>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {[
          { label: 'Active', value: stats.active, color: 'text-rose-600', icon: AlertTriangle },
          { label: 'Recovered', value: stats.completed, color: 'text-emerald-600', icon: CheckCircle2 },
          { label: 'Reduction', value: `${stats.risk_reduction_pct}%`, color: 'text-blue-600', icon: TrendingUp },
          { label: 'Success', value: `${stats.success_rate}%`, color: 'text-indigo-600', icon: Target }
          ].map((stat, i) => (
          <div key={i} className="space-y-1">
            <div className="flex items-center gap-2 mb-1">
              <stat.icon className={cn("h-3 w-3", stat.color)} />
              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none">{stat.label}</p>
            </div>
            <p className="text-xl font-black text-slate-900 leading-none">{stat.value}</p>
          </div>
          ))}
        </div>
      </div>
    </div>

    <Card className="md:col-span-4 p-5 border border-indigo-200 shadow-lg bg-indigo-600 text-white relative overflow-hidden">
      <h2 className="text-[10px] font-black text-blue-400 uppercase tracking-widest relative z-10">Neural Risk Matrix</h2>
      <div className="flex items-end justify-between gap-1.5 mt-6 relative z-10 h-16">
        {[30, 50, 40, 65, 25, 55, 75].map((h, i) => (
          <div key={i} className="flex-1 space-y-1">
            <div className={cn("w-full rounded-t transition-all duration-1000", h > 60 ? 'bg-rose-500' : 'bg-blue-600')} style={{height: `${h}%`}} />
          </div>
        ))}
      </div>
      <p className="text-[10px] font-bold text-slate-400 mt-6 relative z-10 uppercase tracking-widest">
        Risk reduction forecasted at <span className="text-white underline">12.4%</span>.
      </p>
    </Card>
  </div>

  {/* Intervention Matrix */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {interventions.map((item) => (
      <Card key={item.id} className="p-0 border border-slate-100 shadow-sm overflow-hidden group hover:shadow-md transition-all bg-white flex flex-col justify-between">
        <div>
          <div className="px-4 py-2 flex justify-between items-center border-b border-slate-50 bg-slate-50/50">
            <div className="flex items-center gap-2">
              <span className={cn("h-1.5 w-1.5 rounded-full", item.risk_level === 'HIGH' ? 'bg-rose-600 animate-pulse' : 'bg-blue-600')} />
              <span className={cn("text-[9px] font-black uppercase tracking-widest", item.risk_level === 'HIGH' ? 'text-rose-600' : 'text-blue-600')}>
                {item.risk_level} Priority
              </span>
            </div>
            <span className="text-[8px] font-bold text-slate-400 uppercase">{item.created_at}</span>
          </div>
          <div className="p-4">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase truncate w-40">{item.student_name}</h3>
                <p className="text-[8px] font-bold text-slate-400 uppercase mt-0.5 tracking-widest">{item.student_id}</p>
              </div>
              <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-all cursor-pointer shadow-sm border border-slate-100">
                <ArrowUpRight className="h-4 w-4" />
              </div>
            </div>
            
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 mb-4 h-16">
              <div className="flex items-center gap-2 mb-1.5">
                <AlertTriangle className="h-3 w-3 text-rose-500" />
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Vector Drift</p>
              </div>
              <p className="text-[10px] font-black text-slate-700 leading-tight uppercase">{item.issue}</p>
            </div>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[10px] font-black uppercase">
                  <span className="text-slate-400">Recovery</span>
                  <span className="text-blue-600">{item.progress}%</span>
                </div>
                <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                  <div className="h-full bg-blue-600 rounded-full transition-all" style={{width: `${item.progress}%`}} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 pt-0">
          <div className="flex items-center justify-between pt-4 border-t border-slate-50">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                <Rocket className="h-3.5 w-3.5" />
              </div>
              <p className="text-[10px] font-black text-slate-800 uppercase">{item.status}</p>
            </div>
            <Button 
              size="sm"
              onClick={() => { setSelectedIntervention(item); setIsActionPanelOpen(true); }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-lg text-[9px] uppercase tracking-widest h-8 px-4 border-none shadow-sm shadow-indigo-100"
            >
              Action
            </Button>
          </div>
        </div>
      </Card>
    ))}
  </div>

  {/* Action Panel Overlay */}
  {isActionPanelOpen && (
  <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
    <Card className="w-full max-w-md bg-white rounded-xl overflow-hidden shadow-2xl relative">
      <Button 
        variant="ghost" 
        onClick={() => setIsActionPanelOpen(false)}
        className="absolute top-3 right-3 h-8 w-8 p-0 rounded-full text-slate-400 hover:bg-slate-50"
      >
        <Plus className="rotate-45 h-4 w-4" />
      </Button>
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-10 w-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-lg">
            <Target className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Strategy Protocol</p>
            <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">Assign Corrective Node</h2>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <h4 className="text-xs font-black text-slate-900 uppercase">{selectedIntervention?.student_name}</h4>
            <p className="text-[10px] font-bold text-rose-600 mt-1 uppercase leading-snug">{selectedIntervention?.issue}</p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {[
            { id: 'Mentor', label: 'Mentor', icon: Users, desc: '1-on-1 focus' },
            { id: 'Bridge', label: 'Bridge', icon: Rocket, desc: 'Skill reboot' },
            { id: 'Session', label: 'Session', icon: MessageSquare, desc: 'Workshop' },
            { id: 'Alert', label: 'Alert', icon: Send, desc: 'Direct notify' }
            ].map((action) => (
            <button 
              key={action.id}
              onClick={() => handleTakeAction(selectedIntervention.id, action.id)}
              className="p-3 bg-white border border-slate-100 rounded-lg shadow-sm hover:border-slate-900 transition-all text-left group"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <action.icon className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-900" />
                <h5 className="text-[10px] font-black uppercase text-slate-900">{action.label}</h5>
              </div>
              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{action.desc}</p>
            </button>
            ))}
          </div>

          <div className="p-4 bg-indigo-50 border border-dashed border-indigo-200 rounded-lg flex items-start gap-3">
             <Zap className="h-4 w-4 text-indigo-600 mt-0.5" />
             <p className="text-[10px] font-bold text-indigo-900 leading-relaxed uppercase">
               AI Suggestion: <span className="underline">{selectedIntervention?.issue.includes('CGPA') ? 'Bridge Program' : 'Mentor'}</span> optimal match.
             </p>
          </div>
        </div>
      </div>
    </Card>
  </div>
  )}
 </div>
 );
}
