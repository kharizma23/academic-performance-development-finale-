"use client";
import React from "react";
import { ShieldAlert, Users, TrendingDown } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from "recharts";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface Props {
 riskData: any[];
 onSelectFaculty: (id: string) => void;
}

export default function RiskContribution({ riskData, onSelectFaculty }: Props) {
 const maxRisk = Math.max(...riskData.map(r => r.risk_students), 1);

 return (
 <div className="space-y-4 animate-in fade-in duration-700">
  {/* Summary Bar */}
  <Card className="bg-slate-900 border-none p-5 rounded-xl flex flex-col md:flex-row justify-between items-center gap-4 text-white shadow-md">
    <div className="flex items-center gap-3">
      <ShieldAlert className="h-5 w-5 text-rose-500" />
      <div>
        <h2 className="text-sm font-black uppercase tracking-tight">Risk Contribution Analysis</h2>
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Faculty mapping by at-risk student count</p>
      </div>
    </div>
    <div className="flex gap-4">
      <div className="text-center px-4 py-1.5 bg-rose-500 text-white rounded-lg">
        <p className="text-sm font-black leading-none">{riskData.reduce((acc, r) => acc + r.risk_students, 0)}</p>
        <p className="text-[7px] font-bold uppercase tracking-tighter">Total Priority</p>
      </div>
      <div className="text-center px-4 py-1.5 bg-slate-800 border border-slate-700 rounded-lg">
        <p className="text-sm font-black leading-none text-white">{riskData.length}</p>
        <p className="text-[7px] font-bold uppercase text-slate-400 tracking-tighter">Nodes</p>
      </div>
    </div>
  </Card>

  <div className="grid grid-cols-12 gap-4">
    {/* Bar Chart */}
    <Card className="col-span-12 lg:col-span-7 bg-white border border-slate-100 rounded-xl p-5 shadow-sm">
      <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-900 mb-6 flex items-center gap-2">
        <TrendingDown className="h-4 w-4 text-rose-500" /> At-Risk Volume Hub
      </h3>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={riskData} layout="vertical" margin={{ left: 40, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
            <XAxis type="number" tick={{ fontSize: 9, fontWeight: "bold", fill: "#94A3B8" }} axisLine={false} tickLine={false} />
            <YAxis
              type="category" dataKey="shortName"
              tick={{ fontSize: 9, fontWeight: "bold", fill: "#334155" }}
              width={40}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{ borderRadius: "8px", border: "1px solid #F1F5F9", fontSize: 10, fontWeight: 'bold' }}
              formatter={(val: any) => [`${val} students`, "Risk"]}
            />
            <Bar dataKey="risk_students" radius={[0, 4, 4, 0]} barSize={20}>
              {riskData.map((r, i) => (
                <Cell key={i} fill={i === 0 ? "#EF4444" : i < 3 ? "#F59E0B" : "#94A3B8"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>

    {/* Risk Leaderboard */}
    <Card className="col-span-12 lg:col-span-5 bg-white border border-slate-100 rounded-xl p-5 shadow-sm overflow-hidden">
      <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-900 mb-4 flex items-center gap-2">
        <Users className="h-4 w-4 text-slate-400" /> Priority Leaderboard
      </h3>
      <div className="space-y-2 max-h-[300px] overflow-y-auto no-scrollbar pr-1">
        {riskData.map((r, i) => {
          const riskPct = ((r.risk_students / maxRisk) * 100);
          const color = i === 0 ? "bg-rose-500" : i < 3 ? "bg-amber-500" : "bg-slate-300";
          const textColor = i === 0 ? "text-rose-600" : i < 3 ? "text-amber-600" : "text-slate-500";
          return (
            <div
              key={r.id}
              className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-lg hover:bg-rose-50/50 cursor-pointer transition-all group border border-slate-100 hover:border-rose-200"
              onClick={() => onSelectFaculty(r.id)}
            >
              <div className={cn("h-6 w-6 rounded-lg flex items-center justify-center text-[10px] font-black text-white shrink-0", color)}>
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-black text-slate-900 text-[10px] uppercase truncate leading-tight group-hover:text-rose-600 transition-colors">{r.name}</p>
                <div className="w-full h-1 bg-slate-200 rounded-full mt-1.5 overflow-hidden">
                  <div className={cn("h-full transition-all duration-700", color)} style={{ width: `${riskPct}%` }} />
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className={cn("text-xs font-black", textColor)}>{r.risk_students}</p>
                <p className="text-[7px] text-slate-400 font-bold uppercase tracking-tighter">{r.risk_percentage}%</p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  </div>
 </div>
 );
}
