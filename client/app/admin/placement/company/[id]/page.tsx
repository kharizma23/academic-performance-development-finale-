"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { placementAPI } from "@/lib/api-placement";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Briefcase, Search, TrendingUp, User } from "lucide-react";

interface CompanyStudent {
  id: string;
  name: string;
  roll_number: string;
  department: string;
  cgpa: number;
  readiness_score: number;
  match_percentage: number;
  placement_probability: number;
}

interface CompanyData {
  company: string;
  total_eligible: number;
  students: CompanyStudent[];
  company_details: {
    min_cgpa: number;
    required_skills: string[];
    min_readiness: number;
  };
}

export default function CompanyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const companyName = decodeURIComponent(params.id as string);

  const [company, setCompany] = useState<CompanyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeDept, setActiveDept] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const loadCompany = async () => {
      try {
        const data = await placementAPI.getCompanyEligible(companyName);
        setCompany(data);
      } catch (error) {
        console.error("Error loading company:", error);
      } finally {
        setLoading(false);
      }
    };
    loadCompany();
  }, [companyName]);

  const departments = ["All", ...Array.from(new Set(company?.students.map(s => s.department) || []))];

  const filteredStudents = (company?.students || []).filter(s => {
    const matchesDept = activeDept === "All" || s.department === activeDept;
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.roll_number.toLowerCase().includes(search.toLowerCase());
    return matchesDept && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!company) return null;

  return (
    <div className="min-h-screen bg-[#f1f5f9] p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Compact Header */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <button
            onClick={() => router.back()}
            className="text-xs font-bold text-slate-500 hover:text-indigo-600 flex items-center gap-2 mb-4 uppercase tracking-wider"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Matrix
          </button>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-black text-slate-900  flex items-center gap-3">
                <Briefcase className="h-8 w-8 text-indigo-600" />
                {company.company}
              </h1>
              <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest">
                {company.total_eligible} Candidates eligible for recruitment
              </p>
            </div>

            <div className="flex gap-4">
              <StatItem label="Min CGPA" value={company.company_details.min_cgpa.toFixed(1)} />
              <StatItem label="Readiness" value={company.company_details.min_readiness.toFixed(1)} />
              <StatItem label="Node" value="ACTIVE" color="text-indigo-600" />
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Filter by name or roll number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm font-bold text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-xl border border-slate-200 overflow-x-auto no-scrollbar">
            {departments.map(dept => (
              <button
                key={dept}
                onClick={() => setActiveDept(dept)}
                className={`whitespace-nowrap px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${activeDept === dept ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-400 hover:bg-slate-50'
                  }`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>

        {/* Candidate List */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredStudents.map((student, idx) => (
              <motion.div
                key={student.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => router.push(`/admin/placement/student/${student.id}`)}
                className="bg-white border border-slate-200 hover:border-indigo-400 rounded-xl p-5 cursor-pointer transition-all hover:shadow-lg flex flex-col md:flex-row items-center justify-between gap-6 group"
              >
                <div className="flex items-center gap-5 flex-grow w-full">
                  <div className="h-10 w-10 bg-slate-50 rounded-lg flex items-center justify-center border border-slate-200 shrink-0 group-hover:bg-indigo-50 group-hover:border-indigo-200 transition-colors">
                    <span className="text-xs font-black text-slate-400 group-hover:text-indigo-600">#{idx + 1}</span>
                  </div>

                  <div className="space-y-1 flex-grow">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-black text-slate-900 group-hover:text-indigo-600 transition truncate">{student.name}</h3>
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded uppercase">{student.roll_number}</span>
                    </div>
                    <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <span className="text-indigo-600">{student.department}</span>
                      <span>CGPA: <span className="text-slate-900">{student.cgpa.toFixed(2)}</span></span>
                      <span>Readiness: <span className="text-slate-900">{student.readiness_score.toFixed(1)}/10</span></span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 shrink-0 bg-slate-50 px-4 py-3 rounded-lg border border-slate-100 w-full md:w-auto justify-around">
                  <div className="text-center">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-0.5">Match</p>
                    <p className="text-lg font-black text-indigo-600 leading-none">{student.match_percentage}%</p>
                  </div>
                  <div className="w-px h-6 bg-slate-200" />
                  <div className="text-center">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-0.5">Prob.</p>
                    <p className="text-lg font-black text-orange-600 leading-none">{student.placement_probability.toFixed(0)}%</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function StatItem({ label, value, color = "text-slate-900" }: any) {
  return (
    <div className="text-center px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
      <p className={`text-base font-black ${color} leading-none`}>{value}</p>
    </div>
  );
}
