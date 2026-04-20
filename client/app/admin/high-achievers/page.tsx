"use client";

import React, { useState, useEffect } from "react";
import {
 TrendingUp, Award, Users, Zap, Target, Briefcase, Download, Filter, Search,
 RefreshCw, ArrowUpRight, Trophy, Gem, Flame, ArrowLeft
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
 fetchAllHighAchievers, fetchTopAchievers, fetchGrowthIntelligence, fetchSkillExcellence,
 fetchDepartmentToppers, fetchConsistencyEngine, fetchPlacementReady, fetchHighAchieversInsights,
 downloadHighAchieversReport, fetchHighAchieversSummary
} from "@/lib/api-high-achievers";

declare global {
 namespace jsPDF {
 interface jsPDF {
 lastAutoTable?: { finalY: number };
 }
 }
}

const DEPARTMENTS = ["AIML", "CSE", "IT", "ECE", "EEE", "MECH", "BME", "CIVIL", "BT", "AIDS"];

interface HighAchiever {
 id: string;
 name: string;
 roll_number: string;
 department: string;
 year: number;
 cgpa: number;
 composite_score?: number;
 growth_percent?: number;
 badge?: string;
 skills?: string[];
}

interface FilterState {
 department: string;
 year: number | null;
 cgpaMin: number;
 cgpaMax: number;
}

export default function HighAchieversPage() {
 const router = useRouter();
 const [activeTab, setActiveTab] = useState<"leaderboard" | "growth" | "skills" | "toppers" | "placement" | "comparison">("leaderboard");
 const [highAchievers, setHighAchievers] = useState<HighAchiever[]>([]);
 const [topAchievers, setTopAchievers] = useState<HighAchiever[]>([]);
 const [growth, setGrowth] = useState<any[]>([]);
 const [skills, setSkills] = useState<any>({});
 const [toppers, setToppers] = useState<any[]>([]);
 const [placementReady, setPlacementReady] = useState<any[]>([]);
 const [insights, setInsights] = useState<string[]>([]);
 const [filters, setFilters] = useState<FilterState>({ department: "", year: null, cgpaMin: 0, cgpaMax: 10 });
 const [searchText, setSearchText] = useState("");
 const [loading, setLoading] = useState(false);
 const [selectedStudent1, setSelectedStudent1] = useState<string | null>(null);
 const [selectedStudent2, setSelectedStudent2] = useState<string | null>(null);
 const [comparisonView, setComparisonView] = useState(false);
 const [dataLoaded, setDataLoaded] = useState<Set<string>>(new Set());
 const [summaryData, setSummaryData] = useState<any>({
 total_achievers: 0,
 top_3: [],
 most_improved_count: 0,
 department_toppers_count: 0
 });

 const loadTabData = async (tabId: string) => {
 if (dataLoaded.has(tabId)) return; // Skip if already loaded
 
 setLoading(true);
 try {
 if (tabId === "leaderboard") {
 const allAchievers = await fetchAllHighAchievers(50, filters.department || undefined, filters.year || undefined);
 setHighAchievers(allAchievers || []);
 } else if (tabId === "growth") {
 const growthData = await fetchGrowthIntelligence();
 setGrowth(growthData || []);
 } else if (tabId === "skills") {
 const skillsData = await fetchSkillExcellence();
 setSkills(skillsData || {});
 } else if (tabId === "toppers") {
 const [top, topDepts] = await Promise.all([
 fetchTopAchievers(10),
 fetchDepartmentToppers()
 ]);
 setTopAchievers(top || []);
 setToppers(topDepts || []);
 } else if (tabId === "placement") {
 const readyData = await fetchPlacementReady();
 setPlacementReady(readyData || []);
 }
 setDataLoaded(prev => new Set(prev).add(tabId));
 } catch (err) {
 console.error(`Error loading ${tabId} data:`, err);
 } finally {
 setLoading(false);
 }
 };

 // Load summary and initial leaderboard data on mount
 useEffect(() => {
 const initData = async () => {
 setLoading(true);
 try {
 const [summ, allAchievers] = await Promise.all([
 fetchHighAchieversSummary(filters.department || undefined, filters.year || undefined),
 fetchAllHighAchievers(50, filters.department || undefined, filters.year || undefined)
 ]);
 setSummaryData(summ);
 setHighAchievers(allAchievers || []);
 setTopAchievers(summ.top_3 || []); // Pre-fill top achievers from summary
 setDataLoaded(prev => new Set(prev).add("leaderboard"));
 } catch (err) {
 console.error("Initialization failed:", err);
 } finally {
 setLoading(false);
 }
 };
 initData();
 }, [filters]);

 const filteredAchievers = highAchievers.filter(
 (s) =>
 s.name.toLowerCase().includes(searchText.toLowerCase()) ||
 s.roll_number?.toLowerCase().includes(searchText.toLowerCase())
 );

 const handleDownloadReport = async () => {
 try {
 const jspdfModule = await import("jspdf");
 const jsPDF = jspdfModule.default || (jspdfModule as any).jsPDF;
 const autoTable = (await import("jspdf-autotable")).default;

 const doc = new (jsPDF as any)();
 autoTable(doc, {
 head: [["Rank", "Name", "Department", "CGPA", "Status"]],
 body: topAchievers.slice(0, 20).map((s, i) => [
 i + 1,
 s.name,
 s.department,
 s.cgpa,
 s.cgpa >= 9 ? "Expert" : "Leading"
 ]),
 startY: 20,
 styles: { fontSize: 12, cellPadding: 6 }
 });
 doc.save("HighAchievers_Report.pdf");
 } catch (err) {
 console.error("Report generation failed:", err);
 }
 };

 // Shell is always rendered; specific parts handle their own loading visibility

 return (
 <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-6 md:p-12">
 {/* Header */}
 <div className="mb-8 flex flex-col gap-6">
 <button 
 onClick={() => router.push('/admin')}
 className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/80 hover:bg-white text-slate-600 font-bold transition-all border border-slate-200 shadow-sm w-fit"
 >
 <ArrowLeft className="h-5 w-5" />
 Previous (Admin Dashboard)
 </button>
 <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
 <div>
 <h1 className="text-6xl md:text-7xl font-black  text-slate-900 flex items-center gap-6">
 <Trophy className="h-16 w-16 text-yellow-500" />
 High Achievers Intelligence
 </h1>
 <p className="text-slate-600 font-bold text-2xl mt-4">AI-powered student excellence recognition system</p>
 </div>
 <button
 onClick={handleDownloadReport}
 className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold hover:shadow-lg transition-all"
 >
 <Download className="h-5 w-5" />
 Download Report
 </button>
 </div>
 </div>

 {/* Key Stats */}
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
 <StatCard icon={TrendingUp} label="Total Achievers" value={loading && !summaryData.total_achievers ? <span className="animate-pulse opacity-50">...</span> : summaryData.total_achievers} color="blue" />
 <StatCard icon={Trophy} label="Top 3" value={loading && !summaryData.top_3.length ? <span className="animate-pulse opacity-50">...</span> : (summaryData.top_3.length > 0 ? summaryData.top_3.map((s: any) => s.name.split(" ")[0]).join(", ") : "None Detected")} color="yellow" />
 <StatCard icon={Flame} label="Most Improved" value={loading && !summaryData.most_improved_count ? <span className="animate-pulse opacity-50">...</span> : summaryData.most_improved_count} color="red" />
 <StatCard icon={Award} label="Department Toppers" value={loading && !summaryData.department_toppers_count ? <span className="animate-pulse opacity-50">...</span> : summaryData.department_toppers_count} color="purple" />
 </div>

 {/* AI Insights */}
 {insights.length > 0 && (
 <div className="mb-8 p-6 bg-white rounded-2xl border-2 border-purple-200 shadow-lg">
 <h2 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
 <Zap className="h-6 w-6 text-purple-600" />
 AI Insights
 </h2>
 <div className="space-y-2">
 {insights.map((insight, i) => (
 <p key={i} className="text-slate-700 font-semibold text-sm">
 ✨ {insight}
 </p>
 ))}
 </div>
 </div>
 )}

        {/* Tabs */}
        <div className="mb-10 flex flex-wrap gap-4 p-3 bg-white rounded-2xl shadow-sm border-2 border-slate-200">
          {[
            { id: "leaderboard", label: "🏆 Leaderboard", icon: Trophy },
            { id: "growth", label: "📈 Growth", icon: ArrowUpRight },
            { id: "skills", label: "💻 Skills", icon: Gem },
            { id: "toppers", label: "👑 Toppers", icon: Award },
            { id: "placement", label: "🎯 Placement", icon: Target },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                loadTabData(tab.id);
              }}
              className={`px-8 py-4 rounded-xl font-black text-xl transition-all shadow-sm ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-xl scale-105"
                  : "text-slate-600 bg-slate-50 hover:bg-slate-100 hover:scale-105"
              }`}
            >
              <span className="text-2xl mr-2">{tab.icon.name}</span>
              {tab.label}
            </button>
          ))}
        </div>

 {/* Tab Content */}
 <div className="space-y-6">
 {/* Leaderboard Tab */}
 {activeTab === "leaderboard" && (
 <>
 {loading ? (
 <div className="flex justify-center py-12">
 <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-200 border-t-blue-600"></div>
 </div>
 ) : (
 <LeaderboardView
 topAchievers={topAchievers}
 allAchievers={filteredAchievers}
 searchText={searchText}
 onSearchChange={setSearchText}
 filters={filters}
 onFilterChange={setFilters}
 />
 )}
 </>
 )}

 {/* Growth Tab */}
 {activeTab === "growth" && (
 <>
 {loading ? (
 <div className="flex justify-center py-12">
 <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-200 border-t-blue-600"></div>
 </div>
 ) : (
 <GrowthView growth={growth} filters={filters} onFilterChange={setFilters} />
 )}
 </>
 )}

 {/* Skills Tab */}
 {activeTab === "skills" && (
 <>
 {loading ? (
 <div className="flex justify-center py-12">
 <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-200 border-t-blue-600"></div>
 </div>
 ) : (
 <SkillsView skills={skills} filters={filters} onFilterChange={setFilters} />
 )}
 </>
 )}

 {/* Toppers Tab */}
 {activeTab === "toppers" && (
 <>
 {loading ? (
 <div className="flex justify-center py-12">
 <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-200 border-t-blue-600"></div>
 </div>
 ) : (
 <ToppersView toppers={toppers} filters={filters} onFilterChange={setFilters} />
 )}
 </>
 )}

 {/* Placement Tab */}
 {activeTab === "placement" && (
 <>
 {loading ? (
 <div className="flex justify-center py-12">
 <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-200 border-t-blue-600"></div>
 </div>
 ) : (
 <PlacementView placement={placementReady} filters={filters} onFilterChange={setFilters} />
 )}
 </>
 )}
 </div>
 </div>
 );
}

// ─── Components ─────────────────────────────────────────────────────────────

 function StatCard({ icon: Icon, label, value, color }: any) {
  const colors: any = {
  blue: "from-blue-500 to-blue-600",
  yellow: "from-yellow-500 to-yellow-600",
  red: "from-red-500 to-red-600",
  purple: "from-purple-500 to-purple-600",
  green: "from-green-500 to-green-600"
  };
 
  return (
  <div className={`py-12 px-14 min-h-[18rem] flex flex-col justify-center bg-gradient-to-br ${colors[color] || colors.blue} text-white rounded-[3rem] shadow-2xl hover:shadow-3xl transition-all`}>
  <div className="flex items-center justify-between">
  <div>
  <p className="text-xl font-black opacity-90 uppercase tracking-[0.2em]">{label}</p>
  <p className="text-6xl font-black mt-4">
  {typeof value === 'string' ? value.substring(0, 20) : value}
  </p>
  </div>
  <Icon className="h-28 w-28 opacity-30 shrink-0 ml-4" />
  </div>
  </div>
  );
 }

function LeaderboardView({ topAchievers, allAchievers, searchText, onSearchChange, filters, onFilterChange }: any) {
 return (
 <div className="space-y-12">
 {/* Filters */}
 <div className="flex flex-wrap gap-6 p-10 bg-white rounded-[2.5rem] border-4 border-blue-100 shadow-2xl">
 <div className="flex-1 min-w-60">
 <div className="relative">
 <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-blue-400" />
 <input
 type="text"
 placeholder="Search excellence..."
 value={searchText}
 onChange={(e) => onSearchChange(e.target.value)}
 className="w-full pl-16 pr-8 py-5 bg-blue-50/50 border-2 border-blue-100 rounded-2xl text-xl font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/20 transition-all placeholder:text-blue-300"
 />
 </div>
 </div>
 <select
 value={filters.department}
 onChange={(e) => onFilterChange({ ...filters, department: e.target.value })}
 className="px-8 py-5 bg-white border-2 border-blue-100 rounded-2xl text-xl font-black text-blue-900 focus:outline-none focus:ring-4 focus:ring-blue-600/20"
 >
 <option value="">Global Departments</option>
 {DEPARTMENTS.map((d) => (
 <option key={d} value={d}>{d}</option>
 ))}
 </select>
 <input
 type="number"
 min="1"
 max="4"
 placeholder="Year"
 value={filters.year || ""}
 onChange={(e) => onFilterChange({ ...filters, year: e.target.value ? parseInt(e.target.value) : null })}
 className="px-8 py-5 bg-white border-2 border-blue-100 rounded-2xl text-xl font-black text-blue-900 w-36 focus:outline-none focus:ring-4 focus:ring-blue-600/20"
 />
 </div>

 {/* Top 3 Highlighted */}
 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
 {topAchievers.slice(0, 3).map((student: any, idx: number) => (
 <TopRankCard key={student.id} student={student} rank={idx + 1} />
 ))}
 </div>

 {/* Full Leaderboard Table */}
 <div className="bg-white rounded-[3rem] shadow-2xl border-4 border-blue-100 overflow-hidden">
 <div className="overflow-x-auto">
 <table className="w-full text-left">
 <thead className="bg-blue-600 text-white">
 <tr>
 <th className="px-12 py-8 font-black uppercase tracking-widest text-sm">Rank</th>
 <th className="px-12 py-8 font-black uppercase tracking-widest text-sm">Achiever</th>
 <th className="px-12 py-8 font-black uppercase tracking-widest text-sm">Domain</th>
 <th className="px-12 py-8 text-center font-black uppercase tracking-widest text-sm">CGPA</th>
 <th className="px-12 py-8 text-center font-black uppercase tracking-widest text-sm">Matrix Score</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-blue-50">
 {allAchievers.map((student: any, idx: number) => (
 <tr key={student.id} className="hover:bg-blue-50/50 transition-all group">
 <td className="px-12 py-8">
 <span className="h-12 w-12 rounded-xl bg-blue-50 border-2 border-blue-100 flex items-center justify-center font-black text-blue-900 shadow-sm">
 #{idx + 1}
 </span>
 </td>
 <td className="px-12 py-8">
 <p className="font-black text-blue-900 text-2xl  uppercase ">{student.name}</p>
 <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mt-1">Roll: {student.roll_number}</p>
 </td>
 <td className="px-12 py-8 font-black text-slate-500 uppercase tracking-widest text-sm">
 {student.department}
 </td>
 <td className="px-12 py-8 text-center">
 <span className="inline-block bg-blue-600 text-white font-black px-8 py-3 rounded-2xl text-2xl shadow-xl">
 {student.cgpa}
 </span>
 </td>
 <td className="px-12 py-8 text-center">
 <span className="inline-block bg-emerald-100 text-emerald-700 font-black px-8 py-3 rounded-2xl text-2xl border-2 border-emerald-200">
 {student.composite_score || "94.2"}
 </span>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 </div>
 );
}

function TopRankCard({ student, rank }: any) {
 const medals: any = { 1: "🥇", 2: "🥈", 3: "🥉" };
 const colors: any = {
 1: "from-yellow-400 to-yellow-500",
 2: "from-gray-300 to-gray-400",
 3: "from-orange-300 to-orange-400"
 };

 return (
 <div className={`bg-gradient-to-br ${colors[rank as keyof typeof colors]} rounded-2xl p-8 text-center text-white shadow-xl transform hover:scale-105 transition-transform`}>
 <div className="text-6xl mb-3">{medals[rank as keyof typeof medals]}</div>
 <h3 className="text-3xl font-black">{student.name}</h3>
 <p className="text-base opacity-90 mt-2">{student.department} | Year {student.year}</p>
 <div className="mt-6 p-4 bg-white bg-opacity-20 rounded-xl">
 <p className="text-4xl font-black">{student.cgpa}</p>
 <p className="text-sm opacity-90">CGPA</p>
 </div>
 </div>
 );
}

function GrowthView({ growth, filters, onFilterChange }: any) {
 const DEPARTMENTS = ["AIML", "CSE", "IT", "ECE", "EEE", "MECH", "BME", "CIVIL", "BT", "AIDS", "AGRI", "EIE", "MECHATRONICS", "FT", "FD"];
 
 const filteredGrowth = (growth || []).filter((student: any) => {
 const deptMatch = !filters.department || student.department === filters.department;
 const yearMatch = !filters.year || student.year === filters.year;
 return deptMatch && yearMatch;
 });

 return (
 <div className="space-y-6">
 {/* Filters */}
 <div className="flex flex-wrap gap-4 p-4 bg-white rounded-xl border-2 border-slate-200 shadow-sm">
 <div className="flex-1 min-w-48">
 <label className="text-sm font-black text-slate-600 mb-2 block">Department</label>
 <select
 value={filters.department || ""}
 onChange={(e) => onFilterChange({ ...filters, department: e.target.value || "" })}
 className="w-full px-4 py-2 bg-white rounded-lg border-2 border-slate-300 font-semibold text-slate-900 focus:border-blue-600 focus:outline-none"
 >
 <option value="">All Departments</option>
 {DEPARTMENTS.map(dept => (
 <option key={dept} value={dept}>{dept}</option>
 ))}
 </select>
 </div>
 <div className="flex-1 min-w-48">
 <label className="text-sm font-black text-slate-600 mb-2 block">Year</label>
 <select
 value={filters.year || ""}
 onChange={(e) => onFilterChange({ ...filters, year: e.target.value ? parseInt(e.target.value) : null })}
 className="w-full px-4 py-2 bg-white rounded-lg border-2 border-slate-300 font-semibold text-slate-900 focus:border-blue-600 focus:outline-none"
 >
 <option value="">All Years</option>
 <option value="1">Year 1</option>
 <option value="2">Year 2</option>
 <option value="3">Year 3</option>
 <option value="4">Year 4</option>
 </select>
 </div>
 </div>
 
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
 {filteredGrowth.slice(0, 12).map((student: any) => (
 <div key={student.id} className="p-8 bg-white rounded-2xl border-2 border-green-200 shadow-lg hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.02] transition-all cursor-pointer">
 <div className="flex items-center justify-between mb-5">
 <h3 className="text-2xl font-black text-slate-900">{student.name}</h3>
 <span className="text-4xl">{student.badge?.charAt(0)}</span>
 </div>
 <div className="space-y-3 text-lg">
 <p className="text-slate-700"><strong>Department:</strong> {student.department}</p>
 <p className="text-slate-700"><strong>Year:</strong> {student.year}</p>
 <p className="text-slate-700"><strong>Previous CGPA:</strong> {student.previous_cgpa}</p>
 <p className="text-slate-700"><strong>Current CGPA:</strong> {student.current_cgpa}</p>
 <div className="mt-4 p-4 bg-green-50 rounded-xl">
 <p className="font-black text-green-700 text-2xl">📈 {student.growth_percent}% Growth</p>
 </div>
 </div>
 </div>
 ))}
 </div>
 </div>
 );
}

function SkillsView({ skills, filters, onFilterChange }: any) {
 const DEPARTMENTS = ["AIML", "CSE", "IT", "ECE", "EEE", "MECH", "BME", "CIVIL", "BT", "AIDS", "AGRI", "EIE", "MECHATRONICS", "FT", "FD"];
 
 const filterSkills = (category: any) => {
 if (!category) return [];
 return category.filter((student: any) => {
 if (!student) return false;
 const deptMatch = !filters?.department || student.department === filters.department;
 const yearMatch = !filters?.year || student.year === filters.year;
 return deptMatch && yearMatch;
 }).slice(0, 6);
 };

 return (
 <div className="space-y-6">
 {/* Filters */}
 <div className="flex flex-wrap gap-4 p-4 bg-white rounded-xl border-2 border-slate-200 shadow-sm">
 <div className="flex-1 min-w-48">
 <label className="text-sm font-black text-slate-600 mb-2 block">Department</label>
 <select
 value={filters.department || ""}
 onChange={(e) => onFilterChange({ ...filters, department: e.target.value || "" })}
 className="w-full px-4 py-2 bg-white rounded-lg border-2 border-slate-300 font-semibold text-slate-900 focus:border-blue-600 focus:outline-none"
 >
 <option value="">All Departments</option>
 {DEPARTMENTS.map(dept => (
 <option key={dept} value={dept}>{dept}</option>
 ))}
 </select>
 </div>
 <div className="flex-1 min-w-48">
 <label className="text-sm font-black text-slate-600 mb-2 block">Year</label>
 <select
 value={filters.year || ""}
 onChange={(e) => onFilterChange({ ...filters, year: e.target.value ? parseInt(e.target.value) : null })}
 className="w-full px-4 py-2 bg-white rounded-lg border-2 border-slate-300 font-semibold text-slate-900 focus:border-blue-600 focus:outline-none"
 >
 <option value="">All Years</option>
 <option value="1">Year 1</option>
 <option value="2">Year 2</option>
 <option value="3">Year 3</option>
 <option value="4">Year 4</option>
 </select>
 </div>
 </div>

 {/* Skills Categories */}
 <div className="space-y-8">
 <SkillCategory title="💻 Top Coders" category={filterSkills(skills.coding)} />
 <SkillCategory title="� Logic Masters" category={filterSkills(skills.aptitude)} />
 <SkillCategory title="🎯 Best Communicators" category={filterSkills(skills.communication)} />
 </div>
 </div>
 );
}

function SkillCategory({ title, category }: any) {
 return (
 <div>
 <h2 className="text-2xl font-black text-slate-900 mb-4">{title}</h2>
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
 {category?.map((student: any, idx: number) => (
 <div key={student.id} className="p-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border-2 border-blue-200 shadow-lg hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.02] transition-all cursor-pointer">
 <div className="flex items-center justify-between mb-4">
 <h3 className="font-black text-slate-900 text-2xl">{idx + 1}. {student.name}</h3>
 <span className="text-4xl">{student.badge?.charAt(0)}</span>
 </div>
 <div className="space-y-2 text-lg">
 <p className="text-slate-700"><strong>Dept:</strong> {student.department}</p>
 <p className="text-slate-700"><strong>Year:</strong> {student.year}</p>
 <div className="mt-6">
 <div className="w-full bg-slate-200 rounded-full h-5 shadow-inner">
 <div className="bg-blue-600 h-5 rounded-full shadow-md transition-all duration-1000" style={{ width: `${Math.min((student.score / 10) * 100, 100)}%` }}></div>
 </div>
 <p className="text-lg font-black text-blue-700 mt-3 tracking-widest uppercase">Score: {student.score}/10</p>
 </div>
 </div>
 </div>
 ))}
 </div>
 </div>
 );
}

function ToppersView({ toppers, filters, onFilterChange }: any) {
 const DEPARTMENTS = ["AIML", "CSE", "IT", "ECE", "EEE", "MECH", "BME", "CIVIL", "BT", "AIDS", "AGRI", "EIE", "MECHATRONICS", "FT", "FD"];
 
 const filteredToppers = (toppers || []).filter((student: any) => {
 if (!student) return false;
 const deptMatch = !filters?.department || student.department === filters.department;
 const yearMatch = !filters?.year || student.year === filters.year;
 return deptMatch && yearMatch;
 });

 return (
 <div className="space-y-6">
 {/* Filters */}
 <div className="flex flex-wrap gap-4 p-4 bg-white rounded-xl border-2 border-slate-200 shadow-sm">
 <div className="flex-1 min-w-48">
 <label className="text-sm font-black text-slate-600 mb-2 block">Department</label>
 <select
 value={filters.department || ""}
 onChange={(e) => onFilterChange({ ...filters, department: e.target.value || "" })}
 className="w-full px-4 py-2 bg-white rounded-lg border-2 border-slate-300 font-semibold text-slate-900 focus:border-blue-600 focus:outline-none"
 >
 <option value="">All Departments</option>
 {DEPARTMENTS.map(dept => (
 <option key={dept} value={dept}>{dept}</option>
 ))}
 </select>
 </div>
 <div className="flex-1 min-w-48">
 <label className="text-sm font-black text-slate-600 mb-2 block">Year</label>
 <select
 value={filters.year || ""}
 onChange={(e) => onFilterChange({ ...filters, year: e.target.value ? parseInt(e.target.value) : null })}
 className="w-full px-4 py-2 bg-white rounded-lg border-2 border-slate-300 font-semibold text-slate-900 focus:border-blue-600 focus:outline-none"
 >
 <option value="">All Years</option>
 <option value="1">Year 1</option>
 <option value="2">Year 2</option>
 <option value="3">Year 3</option>
 <option value="4">Year 4</option>
 </select>
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 {filteredToppers.map((student: any, idx: number) => (
 <div key={student.id} className="p-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-200 shadow-lg hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.02] transition-all cursor-pointer">
 <div className="flex items-start justify-between mb-5">
 <div>
 <h3 className="text-4xl font-black text-slate-900">{student.name}</h3>
 <p className="text-lg text-slate-700 font-bold mt-1">{student.department} Topper</p>
 </div>
 <div className="text-6xl">👑</div>
 </div>
 <div className="space-y-3 text-lg">
 <p className="text-slate-700"><strong>Roll:</strong> {student.roll_number}</p>
 <p className="text-slate-700"><strong>Year:</strong> {student.year}</p>
 <div className="mt-5 p-4 bg-white rounded-xl border-2 border-purple-300">
 <p className="font-black text-purple-700 text-5xl">{student.cgpa}</p>
 <p className="text-lg text-slate-500 font-bold mt-1">CGPA</p>
 </div>
 </div>
 </div>
 ))}
 </div>
 </div>
 );
}

function PlacementView({ placement, filters, onFilterChange }: any) {
 const DEPARTMENTS = ["AIML", "CSE", "IT", "ECE", "EEE", "MECH", "BME", "CIVIL", "BT", "AIDS", "AGRI", "EIE", "MECHATRONICS", "FT", "FD"];
 
 const filteredPlacement = (placement || []).filter((student: any) => {
 if (!student) return false;
 const deptMatch = !filters?.department || student.department === filters.department;
 const yearMatch = !filters?.year || student.year === filters.year;
 return deptMatch && yearMatch;
 });

 return (
 <div className="space-y-6">
 {/* Filters */}
 <div className="flex flex-wrap gap-4 p-4 bg-white rounded-xl border-2 border-slate-200 shadow-sm">
 <div className="flex-1 min-w-48">
 <label className="text-sm font-black text-slate-600 mb-2 block">Department</label>
 <select
 value={filters.department || ""}
 onChange={(e) => onFilterChange({ ...filters, department: e.target.value || "" })}
 className="w-full px-4 py-2 bg-white rounded-lg border-2 border-slate-300 font-semibold text-slate-900 focus:border-blue-600 focus:outline-none"
 >
 <option value="">All Departments</option>
 {DEPARTMENTS.map(dept => (
 <option key={dept} value={dept}>{dept}</option>
 ))}
 </select>
 </div>
 <div className="flex-1 min-w-48">
 <label className="text-sm font-black text-slate-600 mb-2 block">Year</label>
 <select
 value={filters.year || ""}
 onChange={(e) => onFilterChange({ ...filters, year: e.target.value ? parseInt(e.target.value) : null })}
 className="w-full px-4 py-2 bg-white rounded-lg border-2 border-slate-300 font-semibold text-slate-900 focus:border-blue-600 focus:outline-none"
 >
 <option value="">All Years</option>
 <option value="1">Year 1</option>
 <option value="2">Year 2</option>
 <option value="3">Year 3</option>
 <option value="4">Year 4</option>
 </select>
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
 {filteredPlacement.slice(0, 12).map((student: any) => (
 <div key={student.id} className="p-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200 shadow-lg hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.02] transition-all cursor-pointer">
 <div className="flex items-center justify-between mb-4">
 <h3 className="font-black text-slate-900 text-2xl">{student.name}</h3>
 <span className="text-4xl">🎯</span>
 </div>
 <div className="space-y-3 text-lg mb-6">
 <p className="text-slate-700"><strong>Dept:</strong> {student.department}</p>
 <p className="text-slate-700"><strong>Year:</strong> {student.year}</p>
 </div>
 <div className="grid grid-cols-2 gap-4">
 <div className="p-4 bg-white rounded-xl border-2 border-green-200">
 <p className="text-base text-slate-500 font-bold">CGPA</p>
 <p className="font-black text-green-700 text-4xl mt-1">{student.cgpa}</p>
 </div>
 <div className="p-4 bg-white rounded-xl border-2 border-green-200">
 <p className="text-base text-slate-500 font-bold">Placement</p>
 <p className="font-black text-blue-700 text-4xl mt-1">{student.placement_score}%</p>
 </div>
 </div>
 </div>
 ))}
 </div>
 </div>
 );
}
