"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { placementAPI } from "@/lib/api-placement";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Briefcase, BookOpen, BarChart3, Trophy, Zap, Star, Target, TrendingUp, Cpu, User } from "lucide-react";

interface StudentProfile {
  name: string;
  roll_number: string;
  department: string;
  year: number;
  email: string;
  readiness: {
    cgpa: number;
    career_readiness: number;
    readiness_score: number;
    status: string;
  };
  eligible_companies: Array<{
    company: string;
    matchPercentage: number;
    requiredSkills: string[];
    placementProbability: number;
  }>;
  skills_proficiency: Record<string, number>;
  skill_gaps: string[];
  mock_test_score: {
    aptitude: number;
    coding: number;
    communication: number;
  };
  interview_rounds_cleared: number;
  offers_received: number;
  training_recommendations: string[];
}

export default function StudentPlacementDetailPage() {
  const params = useParams();
  const router = useRouter();
  const studentId = params.id as string;
  
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("analysis");

  useEffect(() => {
    const loadStudent = async () => {
      try {
        const data = await placementAPI.getStudentProfile(studentId);
        setStudent(data);
      } catch (error) {
        console.error("Error loading student:", error);
      } finally {
        setLoading(false);
      }
    };
    loadStudent();
  }, [studentId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!student) return null;

  return (
    <div className="min-h-screen bg-[#f1f5f9] p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Compact Header */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-4">
            <button 
                onClick={() => router.back()}
                className="text-xs font-black text-slate-500 hover:text-indigo-600 transition-all flex items-center gap-2 uppercase tracking-widest mb-4"
            >
                <ArrowLeft className="h-4 w-4" /> Return to Matrix
            </button>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <h1 className="text-3xl font-black text-slate-900  uppercase leading-none">
                    {student.name}
                </h1>
                <div className="flex flex-wrap items-center gap-2 mt-4">
                    <span className="px-3 py-1 bg-slate-900 rounded-lg text-[9px] font-black text-white uppercase tracking-widest">
                        {student.roll_number}
                    </span>
                    <span className="px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-lg text-[9px] font-black text-indigo-700 uppercase tracking-widest">
                        {student.department}
                    </span>
                </div>
            </motion.div>
          </div>

          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-8 shadow-inner">
              <div className="text-center">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Impact score</p>
                  <p className="text-3xl font-black text-indigo-600 leading-none">{student.readiness.readiness_score.toFixed(1)}</p>
              </div>
              <div className="w-px h-10 bg-slate-200 rounded-full" />
              <div className="text-center">
                  <div className={`px-3 py-1 rounded text-[9px] font-black uppercase tracking-wider mb-1 ${
                      student.readiness.readiness_score >= 8 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                      {student.readiness.status}
                  </div>
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Status Hub</p>
              </div>
          </div>
        </div>

        {/* Dynamic Metric Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricBox label="Academic Merit" value={student.readiness.cgpa.toFixed(2)} icon={Star} color="text-emerald-600" />
            <MetricBox label="Technical Node" value={`${student.readiness.career_readiness.toFixed(1)}/10`} icon={Cpu} color="text-blue-600" />
            <MetricBox label="Success Stream" value={student.offers_received} icon={Trophy} color="text-amber-600" />
            <MetricBox label="Cleared Nodes" value={`${student.interview_rounds_cleared}/4`} icon={Target} color="text-rose-600" />
        </div>

        {/* Strategic Panel */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex gap-2 mb-8 border-b border-slate-100 pb-6 overflow-x-auto no-scrollbar">
                {[
                    { id: "analysis", label: "Analysis", icon: BarChart3 },
                    { id: "eligibility", label: "Eligibility", icon: Briefcase },
                    { id: "skill_map", label: "Skill Map", icon: BookOpen }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`whitespace-nowrap flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-wider transition-all ${
                            activeTab === tab.id ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-400 hover:bg-slate-50'
                        }`}
                    >
                        <tab.icon className="h-3.5 w-3.5" />
                        {tab.label}
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                {activeTab === "analysis" && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        <div className="lg:col-span-8 space-y-4">
                            <h3 className="text-xl font-black text-slate-800 flex items-center gap-3 uppercase ">
                                <Zap className="h-5 w-5 text-amber-500" /> AI Insights
                            </h3>
                            {student.training_recommendations.map((rec, idx) => (
                                <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-4 text-xs font-bold text-slate-600 group hover:border-indigo-200 transition-colors">
                                    <div className="h-8 w-8 bg-white rounded-lg flex items-center justify-center font-black text-xs text-indigo-500 border border-slate-100 shrink-0 shadow-sm">{idx + 1}</div>
                                    <p className="uppercase  leading-relaxed">{rec}</p>
                                </div>
                            ))}
                        </div>
                        <div className="lg:col-span-4 bg-slate-900 p-6 rounded-2xl shadow-xl space-y-6">
                            <h3 className="text-[10px] font-black text-white/50 text-center uppercase tracking-widest">Mock Thresholds</h3>
                            <ProgressBar label="Aptitude" value={student.mock_test_score.aptitude} color="bg-blue-400" />
                            <ProgressBar label="Coding" value={student.mock_test_score.coding} color="bg-purple-400" />
                            <ProgressBar label="Comm." value={student.mock_test_score.communication} color="bg-emerald-400" />
                        </div>
                    </motion.div>
                )}

                {activeTab === "eligibility" && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {student.eligible_companies.map((comp, idx) => (
                            <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-100 hover:border-indigo-200 transition-all flex flex-col justify-between">
                                <div className="flex justify-between items-start mb-4">
                                    <p className="text-sm font-black text-slate-800 uppercase ">{comp.company}</p>
                                    <Briefcase className="h-4 w-4 text-slate-300" />
                                </div>
                                <div className="flex justify-between text-center pb-4 border-b border-slate-200 mb-4">
                                    <div>
                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Match</p>
                                        <p className="text-lg font-black text-emerald-600 leading-none">{comp.matchPercentage}%</p>
                                    </div>
                                    <div>
                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Prob.</p>
                                        <p className="text-lg font-black text-orange-500 leading-none">{comp.placementProbability}%</p>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-1">
                                    {comp.requiredSkills.slice(0, 3).map((sk, i) => (
                                        <span key={i} className="px-2 py-0.5 bg-white rounded text-[8px] font-black text-slate-500 uppercase tracking-widest border border-slate-100">{sk}</span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </motion.div>
                )}

                {activeTab === "skill_map" && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Object.entries(student.skills_proficiency).map(([skill, score], i) => (
                            <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <div className="flex justify-between items-center mb-2">
                                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{skill}</p>
                                    <p className="text-xs font-black text-indigo-600">{score.toFixed(1)}/10</p>
                                </div>
                                <div className="h-1.5 bg-white rounded-full overflow-hidden border border-slate-200 shadow-inner">
                                    <div className="h-full bg-indigo-500" style={{ width: `${score * 10}%` }} />
                                </div>
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function MetricBox({ label, value, icon: Icon, color }: any) {
    return (
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="h-8 w-8 bg-slate-50 rounded-lg flex items-center justify-center border border-slate-100 shadow-sm">
                <Icon className={`h-4 w-4 ${color}`} />
            </div>
            <div>
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
                <p className={`text-base font-black ${color}  leading-none`}>{value}</p>
            </div>
        </div>
    );
}

function ProgressBar({ label, value, color }: any) {
    return (
        <div className="space-y-1.5">
            <div className="flex justify-between items-center">
                <p className="text-[9px] font-black text-white/50 uppercase tracking-widest">{label}</p>
                <p className="text-sm font-black text-white leading-none">{value.toFixed(0)}%</p>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden shadow-inner">
                <div className={`h-full ${color}`} style={{ width: `${value}%` }} />
            </div>
        </div>
    );
}
