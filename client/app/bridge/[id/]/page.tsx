"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
    Zap, Rocket, Target, ShieldCheck, CheckCircle2, 
    Clock, ArrowLeft, Download, BookOpen, ExternalLink,
    Activity, Binary, AlertTriangle, RefreshCw
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function BridgeProgramPage() {
    const params = useParams();
    const router = useRouter();
    const [program, setProgram] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetchProgram = async () => {
        try {
            const res = await fetch(`http://127.0.0.1:8000/api/bridge/${params.id}`);
            setProgram(await res.json());
        } catch (err) {
            console.error("Neural Bridge Offline.", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchProgram(); }, [params.id]);

    const handleTaskUpdate = async (taskId: string, currentStatus: string) => {
        try {
            const res = await fetch(`http://127.0.0.1:8000/api/bridge/update-task`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    programId: params.id,
                    taskId,
                    status: currentStatus === 'Completed' ? 'Pending' : 'Completed'
                })
            });
            const data = await res.json();
            setProgram((prev: any) => ({ ...prev, progress: data.new_progress }));
        } catch (err) {
            console.error("Recalibration Link Failure.");
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 p-6 lg:p-12 animate-in fade-in duration-700">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex items-center gap-6">
                        <Button 
                            variant="outline" 
                            onClick={() => router.back()}
                            className="h-12 w-12 p-0 rounded-2xl border-slate-200 hover:bg-white shadow-sm"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-black tracking-widest uppercase mb-2">
                                <Zap className="h-3.5 w-3.5" /> Institutional Intervention Active
                            </div>
                            <h1 className="text-3xl font-black text-slate-950 uppercase ">Bridge Program: {program?.domainTitle}</h1>
                            <p className="text-slate-500 font-bold text-sm uppercase tracking-widest mt-1">ID: {program?.programId} • Student: {program?.studentName}</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <Button className="h-14 px-8 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-2xl uppercase tracking-widest text-[10px] border-none shadow-xl">
                            <Download className="h-4 w-4 mr-3" /> Export Roadmap
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-12 gap-8">
                    {/* Progress Sidebar */}
                    <div className="col-span-12 lg:col-span-4 space-y-6">
                        <Card className="p-8 border border-slate-200 shadow-xl bg-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-5">
                                <Rocket className="h-32 w-32" />
                            </div>
                            <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-10">Institutional Completion</h2>
                            <div className="relative h-48 w-48 mx-auto mb-8">
                                <svg className="h-full w-full" viewBox="0 0 100 100">
                                    <circle className="text-slate-100 stroke-current" strokeWidth="8" fill="transparent" r="40" cx="50" cy="50" />
                                    <circle 
                                        className="text-blue-600 stroke-current transition-all duration-1000" 
                                        strokeWidth="8" 
                                        strokeLinecap="round" 
                                        fill="transparent" 
                                        r="40" cx="50" cy="50" 
                                        strokeDasharray={`${2 * Math.PI * 40}`}
                                        strokeDashoffset={`${2 * Math.PI * 40 * (1 - program.progress / 100)}`}
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-4xl font-black text-slate-950 leading-none">{program.progress}%</span>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Operational</span>
                                </div>
                            </div>
                            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-4">
                                <div className="p-2 bg-white rounded-xl text-emerald-600 shadow-sm">
                                    <ShieldCheck className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-emerald-900 uppercase">Status: Improving</p>
                                    <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">DNA Convergence In-Progress</p>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6 border border-slate-200 bg-rose-50 border-rose-100 shadow-sm">
                            <h3 className="text-[10px] font-black text-rose-600 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4" />
                                Neural Guidance
                            </h3>
                            <p className="text-sm font-black text-slate-950 leading-relaxed ">
                                "{program?.ai_suggestion}"
                            </p>
                        </Card>
                    </div>

                    {/* Main Roadmap */}
                    <Card className="col-span-12 lg:col-span-8 p-0 border border-slate-200 overflow-hidden shadow-xl bg-white">
                        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h2 className="text-lg font-black text-slate-950 uppercase  flex items-center gap-3">
                                <Binary className="h-5 w-5 text-blue-600" />
                                Weekly Institutional Roadmap
                            </h2>
                            <span className="px-4 py-1.5 rounded-full bg-white border border-slate-200 text-[10px] font-black uppercase text-slate-400">
                                4 Active Nodes
                            </span>
                        </div>
                        <div className="p-8 space-y-12 bg-white">
                            {program?.roadmap.map((week: any, idx: number) => (
                                <div key={week.week} className="relative pl-12">
                                    {idx !== program.roadmap.length - 1 && (
                                        <div className="absolute left-6 top-10 bottom-[-2.5rem] w-0.5 bg-slate-100 border-l border-dashed border-slate-200" />
                                    )}
                                    <div className={`absolute left-0 top-0 h-12 w-12 rounded-2xl flex items-center justify-center font-black transition-all ${
                                        week.status === 'Completed' ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-50 border-2 border-slate-200 text-slate-400'
                                    }`}>
                                        {week.week}
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-xl font-black text-slate-950 uppercase ">{week.topic} Phase</h3>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Foundational Competency Node</p>
                                            </div>
                                            <Button variant="ghost" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 text-[10px] font-black uppercase tracking-widest">
                                                <ExternalLink className="h-4 w-4 mr-2" /> Learning Resources
                                            </Button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {week.tasks.map((task: any) => (
                                                <div 
                                                    key={task.id}
                                                    onClick={() => handleTaskUpdate(task.id, task.status)}
                                                    className="p-5 bg-slate-50 border border-slate-200 rounded-3xl flex items-center justify-between group cursor-pointer hover:border-blue-400 hover:bg-white transition-all shadow-sm active:scale-95"
                                                >
                                                    <div className="flex items-center gap-4">
                                                         <div className={`h-6 w-6 rounded-lg flex items-center justify-center border-2 transition-all ${
                                                            task.status === 'Completed' ? 'bg-blue-600 border-blue-500 text-white' : 'border-slate-200 group-hover:border-blue-400 shadow-inner'
                                                         }`}>
                                                            {task.status === 'Completed' && <CheckCircle2 className="h-4 w-4" />}
                                                         </div>
                                                         <span className={`text-[11px] font-black uppercase transition-all ${
                                                            task.status === 'Completed' ? 'text-slate-400 line-through' : 'text-slate-700'
                                                         }`}>
                                                            {task.label}
                                                         </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
