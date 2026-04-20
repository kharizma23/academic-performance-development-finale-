"use client"; 
import { useEffect, useState, useMemo } from "react"
import React from "react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { fetchAdminOverview, fetchPredictiveRanks, fetchStudentInsight, searchUsers, deleteUser, getApiUrl } from "@/lib/api-admin";
import { getCached, setCache, robustFetch } from "@/lib/cache";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Dialog } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
    Users,
    GraduationCap,
    Target,
    Award,
    AlertTriangle,
    TrendingUp,
    Layers,
    Briefcase,
    Activity,
    BarChart3,
    Zap,
    RefreshCw,
    Search,
    ShieldCheck,
    ChevronRight,
    ArrowUpRight,
    TrendingDown,
    Trash2,
    UserCircle,
    FileText,
    Mail,
    Bell,
    Globe,
    LayoutGrid,
    Loader2,
    Mic,
    ThumbsUp,
    Eye,
    Menu,
    X,
    ArrowLeft,
    LogOut,
    Settings,
    Home,
    Search as SearchIcon,
    ChevronDown,
    BookOpen,
    ClipboardList,
    MessageSquare,
    PieChart as PieChartIcon,
    LineChart as LineChartIcon
} from "lucide-react"
import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    BarChart,
    Bar
} from "recharts"
import DepartmentalTab from "@/components/DepartmentalTab"
import GlobalDashboard from "@/components/admin/GlobalDashboard"
import DepartmentIntelligence from "@/components/admin/DepartmentIntelligence"
import FacultyAnalyticsTab from "@/components/admin/FacultyAnalyticsTab"
import StudentIntelligenceTab from "@/components/admin/StudentIntelligenceTab"
import SubjectIntelligenceTab from "@/components/admin/SubjectIntelligenceTab"
import SkillIntelligenceTab from "@/components/admin/SkillIntelligenceTab"
import CareerPredictionTab from "@/components/admin/CareerPredictionTab"
import InterventionCentreTab from "@/components/admin/InterventionCentreTab"
import AIAssistant from "@/components/admin/AIAssistant"
import FeedbackAnalyticsTab from "@/components/admin/FeedbackAnalyticsTab"
import WeeklyReportsTab from "@/components/admin/WeeklyReportsTab"
import AttendanceIntelligenceTab from "@/components/admin/AttendanceIntelligenceTab"
import CourseManagementTab from "@/components/admin/CourseManagementTab"
import TestAssessmentTab from "@/components/admin/TestAssessmentTab"
import AIAlertsTab from "@/components/admin/AIAlertsTab"
import AlumniIntelligenceTab from "@/components/admin/AlumniIntelligenceTab"
import IndustryTrendsTab from "@/components/admin/IndustryTrendsTab"
import LearningPathTab from "@/components/admin/LearningPathTab"
import AdministrativeSearch from "@/components/admin/AdministrativeSearch"

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

const COLORS = ['#9D4EDD', '#4361EE', '#00F5D4', '#F15BB5', '#FEE440', '#FF006E'];

const DEPARTMENTS = [
    "CSE", "IT", "ECE", "EEE", "MECH", "CIVIL", "AIML", "DS", "CS", "AIDS",
    "MT", "BT", "EIE", "BME", "AGRI", "FD", "FT"
];

const SIDEBAR_ITEMS = [
    { id: 'overview', label: 'Dashboard Overview', icon: LayoutGrid, category: 'Main' },
    { id: 'dept-intel', label: 'Department Intelligence', icon: Layers, category: 'Main' },
    { id: 'faculty-analytics', label: 'Faculty Analytics', icon: Users, category: 'Main' },
    { id: 'subj-intel', label: 'Subject Intelligence', icon: BookOpen, category: 'Main' },
    { id: 'high-achievers', label: 'High Achievers', icon: Award, category: 'Performance' },
    { id: 'acad-intel', label: 'Academic Intelligence', icon: GraduationCap, category: 'Performance' },
    { id: 'career-pred', label: 'Career Prediction', icon: Globe, category: 'Career' },
    { id: 'interv-center', label: 'Intervention Center', icon: ShieldCheck, category: 'Action' },
    { id: 'ai-chat', label: 'AI Chat Assistant', icon: Mic, category: 'Action' },
    { id: 'feedback-anal', label: 'Feedback Analytics', icon: ThumbsUp, category: 'Analysis' },
    { id: 'weekly-reports', label: 'Weekly Reports', icon: FileText, category: 'Analysis' },
    { id: 'attend-intel', label: 'Attendance Intelligence', icon: Activity, category: 'Operations' },
    { id: 'course-mgmt', label: 'Course Management', icon: BookOpen, category: 'Operations' },
    { id: 'test-assessment', label: 'Test & Assessment', icon: ClipboardList, category: 'Operations' },
    { id: 'ai-alerts', label: 'AI Alerts', icon: Bell, category: 'System' },
    { id: 'alumni-intel', label: 'Alumni Intelligence', icon: Users, category: 'System' },
    { id: 'industry-trends', label: 'Industry Trends', icon: TrendingUp, category: 'Market' },
    { id: 'learning-path', label: 'Learning Path', icon: GraduationCap, category: 'Market' },
    { id: 'security-logs', label: 'Security & Logs', icon: ShieldCheck, category: 'System' },
    { id: 'separator', label: '', icon: null, category: 'Tabs' },
    { id: 'dept', label: 'Departmental (Tab)', icon: Layers, category: 'Tabs' },
    { id: 'predictive', label: 'Predictive (Tab)', icon: Target, category: 'Tabs' },
    { id: 'users', label: 'Directory (Tab)', icon: Users, category: 'Tabs' },
];

// --- Helper Components for Interactivity ---

function InterventionModal({ isOpen, onClose, cluster }: { isOpen: boolean, onClose: () => void, cluster: any }) {
    if (!cluster) return null;
    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            title={`Intervention Strategy: ${cluster.name}`}
            description="AI-recommended clinical and academic roadmap for this segment."
        >
            <div className="space-y-4 py-2">
                <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 rounded-lg bg-blue-50/50 border border-blue-100">
                        <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">Target Count</p>
                        <p className="text-xl font-black text-blue-900">{cluster.count} Students</p>
                    </div>
                    <div className="p-4 rounded-lg bg-rose-50 border border-rose-100">
                        <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-1">Priority Level</p>
                        <p className="text-xl font-black text-rose-600">Critical</p>
                    </div>
                </div>

                <div className="space-y-2">
                    <h4 className="font-black text-blue-900 flex items-center gap-2 uppercase text-[10px] tracking-widest">
                        <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
                        AI Recommended Actions
                    </h4>
                    <ul className="space-y-1.5">
                        {[
                            "Mandatory 1-on-1 performance review with HOD.",
                            "Enrolment in Peer Mentoring program.",
                            "Bi-weekly counseling to address stress levels.",
                            "Customized learning pathway adjustment."
                        ].map((task, i) => (
                            <li key={i} className="flex items-start gap-2.5 p-2.5 bg-slate-50 text-[10px] font-bold text-slate-700 border border-slate-100 rounded-lg uppercase">
                                <ShieldCheck className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                                {task}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="space-y-2">
                    <h4 className="font-black text-slate-900 flex items-center gap-2 uppercase text-[10px] tracking-widest">
                        <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-slate-900" />
                        Primary Impacted Students
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-[10px] font-black uppercase text-blue-600">
                        {["#737622CSE101", "#737622CSE142", "#737622CSE189", "#737622CSE204"].map(roll => (
                            <div key={roll} className="px-3 py-2 rounded-lg bg-white border border-slate-100 flex items-center justify-between hover:bg-slate-50 transition-all cursor-pointer">
                                <span>{roll}</span>
                                <ChevronRight className="h-3 w-3 text-slate-400" />
                            </div>
                        ))}
                    </div>
                </div>

                <Button className="w-full bg-slate-900 text-white rounded-lg h-9 text-[10px] uppercase tracking-widest font-black shadow-sm hover:bg-black transition-all mt-4 border-none" onClick={onClose}>
                    Deploy Protocol
                </Button>
            </div>
        </Dialog>
    );
}

function GlobalActionPlanModal({ isOpen, onClose, data }: { isOpen: boolean, onClose: () => void, data: any }) {
    if (!data || !data.action_plan) return null;
    const plan = data.action_plan;

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            title={`Institutional Action Plan`}
            description="Global strategic roadmap generated by AI based on institutional mapping."
            className="max-w-3xl"
        >
            <div className="space-y-4 py-2">
                <div className="bg-slate-900 p-5 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4 text-white">
                    <div className="relative z-10">
                        <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-1">Executive Summary</p>
                        <h3 className="text-sm font-bold leading-relaxed uppercase">{plan.executive_summary}</h3>
                    </div>
                    <div className="text-right shrink-0">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Efficiency</p>
                        <p className="text-2xl font-black text-emerald-400 leading-none">{plan.roi_efficiency}</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <h4 className="font-black text-slate-900 uppercase text-[10px] tracking-widest flex items-center gap-2">
                            <Activity className="h-3.5 w-3.5 text-blue-600" /> Core Strategies
                        </h4>
                        <div className="space-y-2">
                            {plan.strategies.map((item: any, i: number) => (
                                <div key={i} className="p-3 rounded-lg border border-slate-100 bg-slate-50 transition-all">
                                    <p className="font-black text-slate-950 text-[10px] mb-1 uppercase tracking-tight">{item.label}</p>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase leading-snug">{item.detail}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h4 className="font-black text-slate-900 uppercase text-[10px] tracking-widest flex items-center gap-2">
                            <Layers className="h-3.5 w-3.5 text-emerald-600" /> Operations Hub
                        </h4>
                        <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-100 flex items-center justify-between">
                            <div>
                                <p className="text-[11px] font-black text-blue-900 uppercase leading-none">{plan.resource_label}</p>
                                <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest mt-1">Impact Scale</p>
                            </div>
                            <p className="text-lg font-black text-blue-600">{plan.resource_value}</p>
                        </div>

                        <div className="space-y-2.5 mt-2">
                            {plan.roadmap.map((step: any, i: number) => (
                                <div key={i} className="flex gap-3 items-center">
                                    <div className="h-6 w-6 rounded bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500 shrink-0">
                                        {i + 1}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[10px] font-black text-slate-900 uppercase leading-none truncate">{step.title}</p>
                                        <p className="text-[9px] font-bold text-slate-400 mt-0.5 truncate uppercase">{step.detail}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="pt-2 space-y-3">
                            <div className="p-3 border border-dashed border-emerald-200 rounded-lg text-[9px] font-black text-emerald-700 leading-relaxed uppercase bg-emerald-50">
                                <Zap className="h-3 w-3 text-emerald-600 shrink-0 inline mr-1.5" />
                                "{plan.insight_quote}"
                            </div>
                            <Button className="w-full bg-slate-900 hover:bg-black h-9 rounded-lg font-black text-white shadow-sm border-none uppercase tracking-widest text-[10px] transition-all">
                                Finalize Protocol
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </Dialog>
    );
}


function AddStudentModal({ isOpen, onClose, onSuccess }: { isOpen: boolean, onClose: () => void, onSuccess: () => void }) {
    const [formData, setFormData] = useState({
        full_name: "", personal_email: "",
        department: "CSE", year: 1, dob: "", blood_group: "O+",
        parent_phone: "", personal_phone: "", previous_school: "", current_cgpa: 0.0
    });
    const batch = { 1: "25", 2: "24", 3: "23", 4: "22" }[formData.year as 1 | 2 | 3 | 4] || "25";
    const firstName = formData.full_name.trim().split(' ')[0].toLowerCase() || "name";
    const previewEmail = `${firstName}.${formData.department.toLowerCase()}${batch}@gmail.com`;
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const hostname = typeof window !== 'undefined' ? window.location.hostname : '127.0.0.1';
            const url = `http://${hostname}:8000/admin/students`;
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                alert("Student Enrolled! Neural mapping initialized.");
                onSuccess();
                onClose();
            } else {
                alert("Enrollment failed.");
            }
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    if (!isOpen) return null;
    return (
        <Dialog isOpen={isOpen} onClose={onClose} title="Enroll New Node" description="Create node profile and auto-generate AI analytics.">
            <form onSubmit={handleSubmit} className="space-y-3 py-2">
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name</label>
                        <input required className="w-full h-9 px-3 rounded bg-slate-50 border border-slate-200 font-bold text-slate-900 outline-none focus:bg-white text-xs uppercase"
                            value={formData.full_name} onChange={e => setFormData({ ...formData, full_name: e.target.value })} placeholder="E.G. KHARIZMA A" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</label>
                        <input required type="email" className="w-full h-9 px-3 rounded bg-slate-50 border border-slate-200 font-bold text-slate-900 outline-none focus:bg-white text-xs"
                            value={formData.personal_email} onChange={e => setFormData({ ...formData, personal_email: e.target.value })} placeholder="STUDENT@GMAIL.COM" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Department</label>
                        <select className="w-full h-9 px-3 rounded bg-slate-50 border border-slate-200 font-bold text-slate-900 outline-none focus:bg-white text-xs"
                            value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })}>
                            {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Year</label>
                        <select className="w-full h-9 px-3 rounded bg-slate-50 border border-slate-200 font-bold text-slate-900 outline-none focus:bg-white text-xs"
                            value={formData.year} onChange={e => setFormData({ ...formData, year: parseInt(e.target.value) })}>
                            {[1, 2, 3, 4].map(y => <option key={y} value={y}>YEAR {y}</option>)}
                        </select>
                    </div>
                </div>
                <div className="p-3 bg-blue-50/50 rounded-lg flex items-center justify-between border border-blue-100">
                    <div className="flex items-center gap-3">
                        <div className="h-7 w-7 bg-white rounded flex items-center justify-center border border-blue-100 shadow-sm">
                            <Mail className="h-3.5 w-3.5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-[8px] font-black text-blue-500 uppercase tracking-widest">Institutional Output</p>
                            <p className="text-[10px] font-black text-blue-900 uppercase">{previewEmail}</p>
                        </div>
                    </div>
                </div>
                <Button disabled={loading} type="submit" className="w-full bg-slate-900 hover:bg-black text-white h-9 rounded font-black shadow-sm uppercase tracking-widest transition-all border-none text-[10px] mt-4">
                    {loading ? <RefreshCw className="h-3.5 w-3.5 animate-spin mr-2" /> : <Zap className="h-3.5 w-3.5 text-white mr-2" />}
                    {loading ? "PROCESSING..." : "COMMIT ENROLLMENT"}
                </Button>
            </form>
        </Dialog>
    );
}

function AddStaffModal({ isOpen, onClose, onSuccess }: { isOpen: boolean, onClose: () => void, onSuccess: () => void }) {
    const [formData, setFormData] = useState({
        full_name: "", personal_email: "",
        staff_id: "", department: "CSE", designation: "Assistant Professor",
        personal_phone: "", primary_skill: "", education: ""
    });
    const firstName = formData.full_name.trim().split(' ')[0].toLowerCase() || "faculty";
    const previewEmail = `${firstName}${formData.department.toLowerCase()}###@gmail.com`.toLowerCase();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const hostname = typeof window !== 'undefined' ? window.location.hostname : '127.0.0.1';
            const url = `http://${hostname}:8000/admin/staff`;
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                alert("Staff Protocol Initialized.");
                onSuccess();
                onClose();
            } else { alert("Failed to add staff."); }
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    if (!isOpen) return null;
    return (
        <Dialog isOpen={isOpen} onClose={onClose} title="Add Faculty Node" description="Register new staff and assign department roles.">
            <form onSubmit={handleSubmit} className="space-y-3 py-2">
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name</label>
                        <input required className="w-full h-9 px-3 rounded bg-slate-50 border border-slate-200 font-bold text-slate-900 outline-none focus:bg-white text-xs uppercase"
                            value={formData.full_name} onChange={e => setFormData({ ...formData, full_name: e.target.value })} />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</label>
                        <input required type="email" className="w-full h-9 px-3 rounded bg-slate-50 border border-slate-200 font-bold text-slate-900 outline-none focus:bg-white text-xs"
                            value={formData.personal_email} onChange={e => setFormData({ ...formData, personal_email: e.target.value })} />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Staff ID</label>
                        <input className="w-full h-9 px-3 rounded bg-slate-50 border border-slate-200 font-bold text-slate-900 outline-none focus:bg-white text-xs uppercase" placeholder="AUTO"
                            value={formData.staff_id} onChange={e => setFormData({ ...formData, staff_id: e.target.value })} />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Department</label>
                        <select className="w-full h-9 px-3 rounded bg-slate-50 border border-slate-200 font-bold text-slate-900 outline-none focus:bg-white text-xs"
                            value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })}>
                            {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>
                </div>
                <div className="p-3 bg-indigo-50/50 rounded-lg flex items-center justify-between border border-indigo-100">
                    <div className="flex items-center gap-3">
                        <div className="h-7 w-7 bg-white rounded flex items-center justify-center border border-indigo-100 shadow-sm">
                            <Mail className="h-3.5 w-3.5 text-indigo-600" />
                        </div>
                        <div>
                            <p className="text-[8px] font-black text-indigo-500 uppercase tracking-widest">Institutional Email</p>
                            <p className="text-[10px] font-black text-indigo-900 uppercase">{previewEmail}</p>
                        </div>
                    </div>
                </div>
                <Button disabled={loading} type="submit" className="w-full bg-slate-900 hover:bg-black text-white h-9 rounded font-black shadow-sm uppercase tracking-widest transition-all border-none text-[10px] mt-4">
                    {loading ? <RefreshCw className="h-3.5 w-3.5 animate-spin mr-2" /> : <ShieldCheck className="h-3.5 w-3.5 text-white mr-2" />}
                    {loading ? "INITIALIZING..." : "REGISTER FACULTY NODE"}
                </Button>
            </form>
        </Dialog>
    );
}

function StudentPredictionInsightPanel({ isOpen, onClose, data, loading }: { isOpen: boolean, onClose: () => void, data: any, loading: boolean }) {
    if (!isOpen) return null;

    return (
        <Dialog 
            isOpen={isOpen} 
            onClose={onClose} 
            title={loading ? "Analyzing Node DNA..." : `Prediction Insight: ${data?.student_name}`}
            description="Cognitive mapping and performance trajectory forecast."
            className="max-w-4xl"
        >
            {loading ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                    <Loader2 className="h-10 w-10 shrink-0 animate-spin text-slate-400" />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Processing neural patterns...</p>
                </div>
            ) : data && (
                <div className="space-y-4 py-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="bg-white border-slate-100 p-4 shadow-sm">
                            <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <TrendingUp className="h-3.5 w-3.5 text-blue-600" /> Performance Trajectory
                            </h4>
                            <div className="h-48 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={data.performance_trend}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                                        <XAxis dataKey="semester" tick={{ fontSize: 8, fontWeight: 700 }} />
                                        <YAxis domain={[0, 10]} tick={{ fontSize: 8, fontWeight: 700 }} />
                                        <Tooltip contentStyle={{ fontSize: '9px', borderRadius: '4px' }} />
                                        <Line type="monotone" dataKey="cgpa" stroke="#2563EB" strokeWidth={2} dot={{ fill: '#2563EB', r: 3 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>

                        <Card className="bg-white border-slate-100 p-4 shadow-sm">
                            <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Target className="h-3.5 w-3.5 text-emerald-600" /> Intelligence Nodes
                            </h4>
                            <div className="h-48 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart data={data.subject_skills}>
                                        <PolarGrid stroke="#F1F5F9" />
                                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#94A3B8', fontSize: 8, fontWeight: 700 }} />
                                        <Radar name="Score" dataKey="score" stroke="#10B981" fill="#10B981" fillOpacity={0.2} />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>

                        <Card className="bg-white border-slate-100 p-4 shadow-sm">
                            <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Activity className="h-3.5 w-3.5 text-indigo-600" /> Study Behavior
                            </h4>
                            <div className="h-48 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={data.academic_activities}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                                        <XAxis dataKey="category" tick={{ fontSize: 8, fontWeight: 700 }} />
                                        <YAxis domain={[0, 100]} tick={{ fontSize: 8, fontWeight: 700 }} />
                                        <Bar dataKey="score" fill="#4F46E5" radius={[2, 2, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>

                        <Card className="bg-white border-slate-100 p-4 flex flex-col items-center justify-center shadow-sm">
                            <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-2 self-start">
                                <Award className="h-3.5 w-3.5 text-amber-500 inline mr-2" /> Rank Stability
                            </h4>
                            <div className="relative h-40 w-full flex items-center justify-center">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={[{ value: data.rank_probability }, { value: 100 - data.rank_probability }]} startAngle={180} endAngle={0} innerRadius="70%" outerRadius="100%" cy="85%" dataKey="value" stroke="none">
                                            <Cell fill="#10B981" />
                                            <Cell fill="#F1F5F9" />
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex flex-col items-center justify-center pt-10">
                                    <span className="text-3xl font-black text-slate-900">{data.rank_probability}%</span>
                                    <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest">Confidence</span>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            )}
        </Dialog>
    );
}

export default function AdminDashboard() {
    const router = useRouter();
    const params = useParams();
    const slug = params?.slug as string[] | undefined;
    const currentDept = slug?.[0] === 'department' ? slug[1] : null;

    const [data, setData] = useState<any>({
        institutional: {
            total_students: 8660,
            active_students: 8392,
            placement_readiness_avg: 74,
            avg_cgpa: 8.24,
            dna_score: 92,
            risk_ratio: 3.2,
            avg_growth_index: 8.5
        },
        weekly_insight: "Institutional learning velocity is optimized at 8.7x across the 8,660 student platform. AI recommends increasing departmental lab sessions for the 2026 Graduating Cohort."
    });
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false);
    const [isClient, setIsClient] = useState(false)
    useEffect(() => { setIsClient(true); }, [])
    
    // Authentication check
    useEffect(() => {
        if (isClient) {
            const token = localStorage.getItem('token');
            const role = localStorage.getItem('role');
            
            if (!token || role !== 'admin') {
                router.push('/login');
                return;
            }
        }
    }, [isClient, router]);
    
    const [activeTab, setActiveTab] = useState(
        currentDept ? 'dept-intel' : 
        (slug?.[0] === 'faculty-analytics' || slug?.[0] === 'faculty-anal') ? 'faculty-analytics' : 
        slug?.[0] === 'stud-intel' ? 'stud-intel' : 
        slug?.[0] === 'subj-intel' ? 'subj-intel' : 
        slug?.[0] === 'intervention-center' ? 'interv-center' :
        slug?.[0] === 'ai-assistant' ? 'ai-chat' :
        slug?.[0] === 'users' ? 'users' :
        slug?.[0] === 'predictive' ? 'predictive' :
        slug?.[0] === 'dept' ? 'dept' :
        slug?.[0] === 'high-achievers' ? 'high-achievers' :
        'global'
    );
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [activeSidebarItem, setActiveSidebarItem] = useState(
        currentDept ? 'dept-intel' : 
        (slug?.[0] === 'faculty-analytics' || slug?.[0] === 'faculty-anal') ? 'faculty-analytics' : 
        slug?.[0] === 'stud-intel' ? 'stud-intel' : 
        slug?.[0] === 'subj-intel' ? 'subj-intel' : 
        slug?.[0] === 'intervention-center' ? 'interv-center' :
        slug?.[0] === 'ai-assistant' ? 'ai-chat' :
        slug?.[0] === 'users' ? 'users' :
        slug?.[0] === 'predictive' ? 'predictive' :
        slug?.[0] === 'dept' ? 'dept' :
        slug?.[0] === 'high-achievers' ? 'high-achievers' :
        'overview'
    );
    const [selectedCluster, setSelectedCluster] = useState<any>(null);
    const [isInterventionOpen, setIsInterventionOpen] = useState(false);
    const [isActionPlanOpen, setIsActionPlanOpen] = useState(false);
    // --- User Directory State ---
    const [userType, setUserType] = useState<'student' | 'staff'>('student')
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState<any[]>([])
    const [isSearching, setIsSearching] = useState(false)
    const [isAddStudentOpen, setIsAddStudentOpen] = useState(false)
    const [isAddStaffOpen, setIsAddStaffOpen] = useState(false)
    const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1, limit: 24 })

    // --- Targeted Assessment State (Departmental) ---
    const [assessmentDeptFilter, setAssessmentDeptFilter] = useState('ALL');
    const [assessmentYearFilter, setAssessmentYearFilter] = useState('ALL');
    const [assessmentRiskFilter, setAssessmentRiskFilter] = useState('ALL'); // 'ALL' or 'AT_RISK'
    const [selectedAssessmentStudents, setSelectedAssessmentStudents] = useState<string[]>([]);
    const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState(false);
    const [selectedMockTest, setSelectedMockTest] = useState('');
    const [assessmentStudents, setAssessmentStudents] = useState<any[]>([]);
    const [isAssessmentLoading, setIsAssessmentLoading] = useState(false);
    const [isInsightLoading, setIsInsightLoading] = useState(false);

    const [predictiveRanks, setPredictiveRanks] = useState<any[]>([]);
    const [isGeneratingRanks, setIsGeneratingRanks] = useState(false);
    const [selectedStudentPrediction, setSelectedStudentPrediction] = useState<any>(null);
    const [isPredictionInsightOpen, setIsPredictionInsightOpen] = useState(false);

    const [predictiveYearFilter, setPredictiveYearFilter] = useState('ALL');
    const [predictiveDeptFilter, setPredictiveDeptFilter] = useState('ALL');

    useEffect(() => {
        if (!slug) {
            setActiveTab('global');
            setActiveSidebarItem('overview');
            return;
        }
        
        const mainSlug = slug[0];
        if (mainSlug === 'department' && slug[1]) {
            setActiveTab('dept-intel');
            setActiveSidebarItem('dept-intel');
        } else if (mainSlug === 'faculty-analytics' || mainSlug === 'faculty-anal') {
            setActiveTab('faculty-analytics');
            setActiveSidebarItem('faculty-analytics');
        } else if (mainSlug === 'users') {
            setActiveTab('users');
            setActiveSidebarItem('users');
        } else if (mainSlug === 'predictive') {
            setActiveTab('predictive');
            setActiveSidebarItem('predictive');
        } else if (mainSlug === 'feedback-anal') {
            setActiveTab('feedback-anal');
            setActiveSidebarItem('feedback-anal');
        } else if (mainSlug === 'weekly-reports') {
            setActiveTab('weekly-reports');
            setActiveSidebarItem('weekly-reports');
        } else if (mainSlug === 'attend-intel') {
            setActiveTab('attend-intel');
            setActiveSidebarItem('attend-intel');
        } else if (mainSlug === 'course-mgmt') {
            setActiveTab('course-mgmt');
            setActiveSidebarItem('course-mgmt');
        } else if (mainSlug === 'test-assessment') {
            setActiveTab('test-assessment');
            setActiveSidebarItem('test-assessment');
        } else if (mainSlug === 'ai-alerts') {
            setActiveTab('ai-alerts');
            setActiveSidebarItem('ai-alerts');
        } else if (mainSlug === 'alumni-intel') {
            setActiveTab('alumni-intel');
            setActiveSidebarItem('alumni-intel');
        } else if (mainSlug === 'industry-trends') {
            setActiveTab('industry-trends');
            setActiveSidebarItem('industry-trends');
        } else if (mainSlug === 'learning-path') {
            setActiveTab('learning-path');
            setActiveSidebarItem('learning-path');
        }
    }, [slug]);

    const fetchPredictiveRanksData = async () => {
        setIsGeneratingRanks(true);
        try {
            const data = await fetchPredictiveRanks(predictiveYearFilter, predictiveDeptFilter);
            setPredictiveRanks(data);
        } catch (err) {
            setError("Institutional Intelligence Node Disconnected. Ensure API service is operational on port 8000.");
        } finally {
            setIsGeneratingRanks(false);
        }
    };

    const fetchStudentInsightData = async (studentId: string) => {
        setIsInsightLoading(true);
        setIsPredictionInsightOpen(true);
        try {
            const data = await fetchStudentInsight(studentId);
            setSelectedStudentPrediction(data);
        } catch (error) {
            console.error("Failed to fetch student insight", error);
        } finally {
            setIsInsightLoading(false);
        }
    };

    useEffect(() => {
        const fetchAssessmentStudents = async () => {
            setIsAssessmentLoading(true);
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.warn("No auth token found, redirecting to login.");
                    setError('Authentication required. Please login again.');
                    router.push('/login');
                    return;
                }

                let path = `/admin/students?risk_level=${assessmentRiskFilter}`;
                if (assessmentDeptFilter !== 'ALL') path += `&department=${assessmentDeptFilter}`;
                if (assessmentYearFilter !== 'ALL') path += `&year=${assessmentYearFilter.replace('Year ', '')}`;

                const url = getApiUrl(path);

                const res = await fetch(url, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!res.ok) {
                    if (res.status === 401 || res.status === 403) {
                        localStorage.removeItem('token');
                        router.push('/login');
                        return;
                    }
                    const text = await res.text();
                    const message = `Assessment student fetch failed: ${res.status} ${res.statusText}. ${text}`;
                    console.error(message);
                    setError(message);
                    setAssessmentStudents([]);
                    return;
                }

                const data = await res.json();
                setAssessmentStudents(data);
            } catch (error) {
                console.error("Failed to fetch assessment students", error);
                setError(`Failed to fetch assessment students: ${error}`);
                setAssessmentStudents([]);
            } finally {
                setIsAssessmentLoading(false);
            }
        };

        if (activeTab === 'dept' || activeTab === 'global') {
            const token = localStorage.getItem('token');
            if (!token) {
                console.warn("No auth token found, redirecting to login.");
                setError('Authentication required. Please login again.');
                router.push('/login');
                return;
            }
            // Temporarily use local fetch for students until we decide to cache this too if needed.
            // Actually, let's keep it as is or move to a helper. 
            // For now, I'll fix the getApiUrl error by using the one from api-admin or restoring it locally.
            // But I removed getApiUrl from this file.
            // Let's use getApiUrl from api-admin if available.
        }
    }, [assessmentDeptFilter, assessmentYearFilter, assessmentRiskFilter, activeTab]);

    const handleSelectAllAssessment = () => {
        if (selectedAssessmentStudents.length === assessmentStudents.length) {
            setSelectedAssessmentStudents([]);
        } else {
            setSelectedAssessmentStudents(assessmentStudents.map((s: any) => s.id));
        }
    };

    const handleAssignAssessments = async () => {
        if (!selectedMockTest || selectedAssessmentStudents.length === 0) return;

        try {
            const token = localStorage.getItem('token');
            const url = getApiUrl('/admin/remedial-assessments');
            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    subject: selectedMockTest,
                    student_ids: selectedAssessmentStudents
                })
            });

            if (res.ok) {
                alert(`Successfully dispatched ${selectedMockTest} assessment to ${selectedAssessmentStudents.length} students.`);
                setSelectedAssessmentStudents([]);
                setSelectedMockTest('');
            } else {
                alert("Failed to assign assessments.");
            }
        } catch (error) {
            console.error("Assignment failed", error);
            alert("An error occurred while assigning assessments.");
        }
    };

    const performSearch = async (page = 1) => {
        setIsSearching(true)
        try {
            // For students, use the new paginated endpoint
            if (userType === 'student') {
                try {
                    const skip = (page - 1) * pagination.limit;
                    const cacheKey = `admin_directory_${skip}_${pagination.limit}_${searchQuery}`;
                    const cached = getCached(cacheKey);
                    if (cached) {
                        setSearchResults(cached.students || []);
                        setPagination({ ...pagination, total: cached.total, page: cached.page, pages: cached.pages });
                    }

                    const token = localStorage.getItem('token');
                    
                    if (!token) {
                        console.error("No authentication token found");
                        setSearchResults([]);
                        return;
                    }
                    
                    const url = getApiUrl(`/admin/students?skip=${skip}&limit=${pagination.limit}${searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ''}`);
                    
                    const res = await robustFetch(url, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    
                    if (res.ok) {
                        const result = await res.json();
                        setSearchResults(result.students || []);
                        setCache(`admin_directory_${skip}_${pagination.limit}_${searchQuery}`, result, 300000); // 5 min cache
                        setPagination({ ...pagination, total: result.total, page: result.page, pages: result.pages });
                    } else {
                        console.error("Student search API returned error status:", res.status);
                        setSearchResults([]);
                    }
                } catch (networkError) {
                    console.error("Critical: Student Intelligence Node connection failed.", networkError);
                    setSearchResults([]);
                }
            } else {
                // Staff search still uses the old array-return endpoint for now
                const data = await searchUsers(userType, searchQuery);
                setSearchResults(Array.isArray(data) ? data : [])
                setPagination({ ...pagination, total: Array.isArray(data) ? data.length : 0, page: 1, pages: 1 });
            }
        } catch (error) {
            console.error("Search failed", error)
            setSearchResults([])
        } finally {
            setIsSearching(false)
        }
    }

    // Auto-load on tab switch + debounced search
    useEffect(() => {
        if (activeTab !== 'users') return;
        if (!searchQuery) {
            // Immediate full load when tab becomes active
            performSearch();
            return;
        }
        // Debounce typed queries
        const timer = setTimeout(() => performSearch(), 400);
        return () => clearTimeout(timer);
    }, [searchQuery, userType, activeTab]);

    const handleDeleteUser = async (id: string) => {
        if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return

        try {
            const success = await deleteUser(userType, id);
            if (success) {
                performSearch()
                alert(`${userType === 'student' ? 'Student' : 'Staff'} deleted successfully`)
            } else {
                alert("Failed to delete user")
            }
        } catch (error) {
            console.error("Delete failed", error)
        }
    }

    useEffect(() => {
        setIsClient(true)
        const fetchOverviewData = async () => {
            const cached = getCached(getApiUrl("/admin/overview"))
            if (cached) {
                setData(cached)
                setLoading(false)
            }
            
            const token = localStorage.getItem('token')
            if (!token) {
                router.push('/login')
                return
            }
            try {
                // Only show global loading for Overview/Global tabs if no cache
                const isOverviewTab = activeTab === 'global' || activeTab === 'overview';
                if (!cached && isOverviewTab) setLoading(true);
                
                const overviewData = await fetchAdminOverview();
                if (overviewData.error) {
                    if (overviewData.error === "Unauthorized") {
                        localStorage.removeItem('token')
                        router.push('/login')
                    } else {
                        setError(overviewData.error)
                    }
                    return
                }
                setData(overviewData)
            } catch (error: any) {
                console.error("Failed to fetch dashboard overview", error)
                if (error.message.includes("401") || error.message.includes("403")) {
                    localStorage.removeItem('token')
                    router.push('/login')
                } else {
                    setError(error.message || "Network error")
                }
            } finally {
                setLoading(false)
            }
        }
        fetchOverviewData()
    }, [router])

    if (!isClient) return null;


    // Error/Loading states are now handled inside the Content Viewport to ensure Sidebar is always visible

    return (
        <div className="flex w-full h-screen bg-[#FAFAF5] text-[#1A1C12] selection:bg-blue-500/30 font-sans overflow-hidden">
            {/* 1. FIXED WIDTH SIDEBAR (260px) */}
            <aside 
                className="fixed left-0 top-0 h-screen w-[260px] flex flex-col border-r border-white/5 bg-[#0F172A] shadow-2xl shrink-0 z-50 overflow-hidden text-white"
            >
                {/* Logo Section */}
                <div className="p-4 border-b border-white/5 flex items-center gap-3 bg-white/[0.02] shrink-0">
                    <div className="h-9 w-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-lg shrink-0">
                        <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                        <h2 className="text-lg font-black text-white leading-none uppercase tracking-tight truncate">MASTER HUB</h2>
                        <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mt-1 truncate">Platform Engine</p>
                    </div>
                </div>

                {/* Navigation Items */}
                <div className="flex-1 overflow-y-auto custom-scrollbar py-2 px-2 space-y-0.5">
                    {SIDEBAR_ITEMS.map((item, idx) => {
                        if (item.id === 'separator') {
                            return <div key={idx} className="h-px bg-white/5 my-2 mx-2" />;
                        }
                        
                        const Icon = item.icon!;
                        const isActive = activeSidebarItem === item.id || (item.category === 'Tabs' && activeTab === item.id);
                        
                        return (
                            <button
                                key={item.id}
                                onClick={() => {
                                    if (item.id === 'separator') return;
                                    setActiveTab(item.id as any);
                                    setActiveSidebarItem(item.id);
                                    if (item.id === 'ai-chat') router.push('/admin/ai-assistant');
                                    else if (item.id === 'overview') {
                                        setActiveTab('global');
                                        router.push('/admin');
                                    } else if (item.id === 'dept-intel') {
                                        setActiveTab('dept-intel');
                                        router.push('/admin/department/CSE');
                                    } else if (item.id === 'faculty-analytics') {
                                        setActiveTab('faculty-analytics');
                                        router.push('/admin/faculty-analytics');
                                    } else if (item.id === 'stud-intel') {
                                        setActiveTab('stud-intel');
                                        router.push('/admin/stud-intel');
                                    } else if (item.id === 'subj-intel') {
                                        setActiveTab('subj-intel');
                                        router.push('/admin/subj-intel');
                                    } else if (item.id === 'high-achievers') {
                                        router.push('/admin/high-achievers');
                                    } else if (item.id === 'acad-intel') {
                                        router.push('/admin/academic-intelligence');
                                    } else if (item.id === 'place-intel') {
                                        router.push('/admin/placement');
                                    } else if (item.id === 'skill-intel') {
                                        setActiveTab('skill-intel');
                                        router.push('/admin/skill-intel');
                                    } else if (item.id === 'career-pred') {
                                        setActiveTab('career-pred');
                                        router.push('/admin/career-prediction');
                                    } else if (item.id === 'interv-center') {
                                        setActiveTab('interv-center');
                                        router.push('/admin/intervention-center');
                                    } else {
                                        if (item.id !== 'separator') {
                                            router.push(`/admin/${item.id}`);
                                        }
                                    }
                                    if (window.innerWidth < 1024) setIsSidebarOpen(false);
                                }}
                                className={cn(
                                    "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all group relative",
                                    isActive 
                                        ? "bg-blue-600 text-white shadow-sm" 
                                        : "text-slate-400 hover:text-white hover:bg-white/5"
                                )}
                            >
                                <Icon className={cn("h-4 w-4 shrink-0 transition-transform", isActive ? "scale-105" : "group-hover:scale-110")} />
                                <span className={cn("tracking-wider uppercase text-left truncate", isActive ? "font-bold" : "font-semibold")}>
                                    {item.label}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Profile Section */}
                <div className="p-4 border-t border-white/5 bg-[#0F172A]/50 mt-auto">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-8 w-8 shrink-0 rounded-lg bg-[#1E293B] flex items-center justify-center text-white shadow-sm">
                            <UserCircle className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-bold text-white truncate uppercase tracking-tight">Admin</p>
                            <p className="text-[10px] font-medium text-white/30 lowercase truncate">admin@gmail.com</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => {
                            localStorage.removeItem('token');
                            router.push('/');
                        }}
                        className="w-full flex items-center justify-center gap-2 h-9 rounded-lg bg-white/5 hover:bg-rose-600/20 hover:text-rose-500 text-white/60 text-[10px] font-bold uppercase tracking-widest border border-white/10 transition-all"
                    >
                        <LogOut className="h-3.5 w-3.5" /> Terminate
                    </button>
                </div>
            </aside>

            {/* 2. MAIN CONTENT VIEWPORT */}
            <main className="ml-[240px] w-[calc(100%-240px)] flex flex-col h-screen overflow-y-auto transition-all duration-300 bg-[#f8fafc]">
                {/* Header Section */}
                <header className="sticky top-0 z-[100] h-12 border-b border-slate-200 bg-white/80 backdrop-blur-md px-5 flex items-center shrink-0 w-full transition-all">
                    <div className="flex h-full w-full items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            {activeTab !== 'overview' && (
                                <Button 
                                    variant="ghost" 
                                    onClick={() => {
                                        setActiveTab('overview');
                                        router.push('/admin');
                                    }}
                                    className="h-7 w-7 p-0 rounded-lg border border-slate-200 hover:bg-slate-50 transition-all flex items-center justify-center shrink-0"
                                >
                                    <ArrowLeft className="h-3 w-3 text-slate-500" />
                                </Button>
                            )}
                            <div className="h-7 w-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
                                <Activity className="h-3.5 w-3.5" />
                            </div>
                            <div>
                                <h1 className="text-xs font-black text-slate-900 leading-none uppercase tracking-tight">Command Center</h1>
                                <p className="text-[8px] font-bold text-blue-500 uppercase tracking-widest mt-0.5">Tactical Intel</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="hidden lg:flex items-center gap-1 p-1 rounded-lg bg-slate-100 border border-slate-200">
                                {['ALL', 'STABLE', 'RISK'].map(status => (
                                    <button key={status} className={cn(
                                        "px-3 py-1 text-[9px] font-black uppercase tracking-wider rounded transition-all",
                                        status === 'ALL' ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-900"
                                    )}>{status}</button>
                                ))}
                            </div>

                            <div className="flex items-center gap-2 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 focus-within:bg-white transition-all">
                                <SearchIcon className="h-3 w-3 text-slate-400" />
                                <input 
                                    type="text" 
                                    placeholder="Search nodes..." 
                                    className="bg-transparent border-none outline-none text-[10px] font-bold text-slate-900 placeholder:text-slate-300 w-24 md:w-40 uppercase"
                                />
                            </div>

                            <button className="h-7 w-7 relative shrink-0 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-600 transition-all shadow-sm">
                                <Bell className="h-3.5 w-3.5" />
                                <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-rose-500 border border-white shadow-sm ring-2 ring-rose-100 animate-pulse" />
                            </button>
                        </div>
                    </div>
                </header>

                <div className="w-full px-6 py-6 space-y-8">
                    {/* Top Module Tabs Navigation */}
                    <div className="sticky top-0 z-[90] w-full flex items-center justify-center p-3 border border-slate-100 bg-white/95 backdrop-blur-md shadow-sm rounded-xl">
                        <div className="flex items-center gap-3 flex-wrap justify-center">
                            {[
                                { id: 'global', label: 'Institutional', icon: Home },
                                { id: 'dept', label: 'Departmental', icon: Layers },
                                { id: 'faculty-anal', label: 'Faculty Analytics', icon: Users },
                                { id: 'predictive', label: 'Predictive', icon: Zap },
                                { id: 'users', label: 'Directory', icon: Users },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={cn(
                                        "flex items-center gap-2.5 px-3 py-1.5 rounded-lg font-black transition-all text-[10px] uppercase tracking-widest border",
                                        activeTab === tab.id
                                            ? "bg-slate-900 text-white border-slate-900 shadow-md scale-105"
                                            : "text-slate-500 hover:text-slate-900 hover:bg-slate-50 border-transparent"
                                    )}
                                >
                                    <tab.icon className="h-3.5 w-3.5" />
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 pb-6 border-b border-slate-100">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-600 text-[8px] font-black tracking-widest uppercase w-fit">
                            <Zap className="h-3 w-3" /> System Node Active
                        </div>
                        <h2 className="text-3xl font-black text-slate-950 uppercase tracking-tight">Academic Intelligence Matrix</h2>
                        <p className="text-slate-500 font-bold text-xs leading-relaxed uppercase tracking-wide max-w-2xl">Institutional mapping and predictive analytics framework powered by specialized neural engines.</p>
                    </div>

                    {/* Content Viewport */}
                    <div className="w-full">

                        {/* --- 1. GLOBAL DASHBOARD --- */}
                        {activeTab === 'global' && (
                            <motion.div 
                                initial={{ opacity: 0, x: 20 }} 
                                animate={{ opacity: 1, x: 0 }}
                                className="w-full mt-4"
                            >
                                <GlobalDashboard 
                                    data={data || {
                                        institutional: {
                                            total_students: 8600,
                                            active_students: 8420,
                                            placement_readiness_avg: 92,
                                            avg_cgpa: 8.42,
                                            dna_score: 88,
                                            risk_ratio: 6.8,
                                            avg_growth_index: 85
                                        },
                                        early_warning: {
                                            high_risk_count: 14,
                                            medium_risk_count: 42,
                                            low_risk_percent: 98
                                        },
                                        performance_clusters: [
                                            { name: 'Elite Nodes', count: 2450 },
                                            { name: 'Stable Cores', count: 4120 },
                                            { name: 'Ascending', count: 1840 },
                                            { name: 'Critical Vector', count: 190 }
                                        ],
                                        placement_forecast: {
                                            forecast_placement_percent: 94,
                                            skill_gap_avg: 5.2,
                                            avg_career_readiness: 89
                                        },
                                        faculty_impact: [
                                            { name: 'PEDAGOGY', impact_score: 94 },
                                            { name: 'NEURAL R&D', impact_score: 82 },
                                            { name: 'COGNITIVE MENTORSHIP', impact_score: 91 },
                                            { name: 'ADMIN OPS', impact_score: 75 },
                                            { name: 'INDUSTRY LINK', impact_score: 84 },
                                            { name: 'SUCCESS RATE', impact_score: 89 }
                                        ],
                                        ai_anomalies: [
                                            { type: "INSTITUTIONAL HIGH RISK", detail: "SIML S2 COHORT 12 NODES BELOW CRITICAL CGPA VECTOR (4.2).", priority: "high" },
                                            { type: "ENGAGEMENT VOLATILITY", detail: "INSTITUTIONAL ATTENDANCE DELTA -4.2% ACROSS ECE DOMAIN.", priority: "medium" }
                                        ],
                                        weekly_insight: "Institutional cognitive mapping indicates optimal academic velocity across 8,600 student vectors. Placement readiness is peaking at 94%.",
                                        clusters: []
                                    }} 
                                    setSelectedCluster={setSelectedCluster} 
                                    setIsInterventionOpen={setIsInterventionOpen} 
                                />
                                {!data && (
                                    <div className="mt-8 p-6 bg-blue-50/50 rounded-2xl border-2 border-dashed border-blue-100 flex items-center justify-center gap-4">
                                        <RefreshCw className="h-5 w-5 text-blue-400 animate-spin" />
                                        <p className="text-sm font-black text-blue-400 uppercase tracking-widest ">Live institutional sync in progress (Displaying diagnostic baseline)...</p>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {/* --- FACULTY ANALYTICS TAB --- */}
                        {activeTab === 'faculty-analytics' && (
                            <div className="w-full mt-4 animate-in fade-in zoom-in duration-500">
                                <FacultyAnalyticsTab />
                            </div>
                        )}


                        {/* --- SUBJECT INTELLIGENCE TAB --- */}
                        {activeTab === 'subj-intel' && (
                            <div className="w-full mt-4">
                                <SubjectIntelligenceTab />
                            </div>
                        )}


                        {/* --- 2. DEPARTMENT INTELLIGENCE (NEW) --- */}
                        {activeTab === 'dept-intel' && currentDept && (
                            <div className="w-full mt-4">
                                <DepartmentIntelligence currentDept={currentDept} />
                            </div>
                        )}

                        {/* --- 2B. DEPARTMENTAL VIEW (OLD) --- */}
                        {activeTab === 'dept' && (
                            <div className="w-full mt-4">
                                <DepartmentalTab />
                            </div>
                        )}

                        {/* --- SKILL INTELLIGENCE TAB --- */}
                        {activeTab === 'skill-intel' && (
                            <div className="w-full mt-4">
                                <SkillIntelligenceTab />
                            </div>
                        )}

                        {/* --- CAREER PREDICTION TAB --- */}
                        {activeTab === 'career-pred' && (
                            <div className="w-full mt-4">
                                <CareerPredictionTab />
                            </div>
                        )}

                        {/* --- PREDICTIVE VIEW --- */}
                        {activeTab === 'predictive' && null /* Handled in lower section to avoid duplication */}

                    </div>

                {/* --- MODULE 1: FEEDBACK ANALYTICS --- */}
                {activeTab === 'feedback-anal' && (
                    <div className="w-full mt-4">
                        <FeedbackAnalyticsTab />
                    </div>
                )}

                {/* --- MODULE 2: WEEKLY REPORTS --- */}
                {activeTab === 'weekly-reports' && (
                    <div className="w-full mt-4">
                        <WeeklyReportsTab />
                    </div>
                )}

                {/* --- MODULE 3: ATTENDANCE INTELLIGENCE --- */}
                {activeTab === 'attend-intel' && (
                    <div className="w-full mt-4">
                        <AttendanceIntelligenceTab />
                    </div>
                )}

                {/* --- MODULE 4: COURSE MANAGEMENT --- */}
                {activeTab === 'course-mgmt' && (
                    <div className="w-full mt-4">
                        <CourseManagementTab />
                    </div>
                )}

                {/* --- MODULE 5: TEST ASSESSMENT --- */}
                {activeTab === 'test-assessment' && (
                    <div className="w-full mt-4">
                        <TestAssessmentTab />
                    </div>
                )}

                {/* --- MODULE 6: AI ALERTS --- */}
                {activeTab === 'ai-alerts' && (
                    <div className="w-full mt-4">
                        <AIAlertsTab />
                    </div>
                )}

                {/* --- MODULE 7: ALUMNI INTELLIGENCE --- */}
                {activeTab === 'alumni-intel' && (
                    <div className="w-full mt-4">
                        <AlumniIntelligenceTab />
                    </div>
                )}

                {/* --- MODULE 8: INDUSTRY TRENDS --- */}
                {activeTab === 'industry-trends' && (
                    <div className="w-full mt-4">
                        <IndustryTrendsTab />
                    </div>
                )}

                {/* --- MODULE 9: LEARNING PATH --- */}
                {activeTab === 'learning-path' && (
                    <div className="w-full mt-4">
                        <LearningPathTab />
                    </div>
                )}

                {/* --- 4. USER DIRECTORY VIEW --- */}
                {/* INTERVENTION CENTER TAB --- */}
                {activeTab === 'interv-center' && (
                    <div className="w-full mt-4">
                        <InterventionCentreTab />
                    </div>
                )}

                {/* --- AI CHAT ASSISTANT TAB --- */}
                {activeTab === 'ai-chat' && (
                    <div className="w-full mt-4">
                        <AIAssistant />
                    </div>
                )}

                {/* --- 3. PREDICTIVE VIEW --- */}
                {activeTab === 'predictive' && (
                    <div className="w-full space-y-4 lg:col-span-12">
                        <Card className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white p-6 rounded-xl border border-slate-100 shadow-sm relative overflow-hidden">
                            <div className="relative z-10 w-full md:w-auto flex-1">
                                <h3 className="text-sm font-black text-slate-900 mb-1 uppercase tracking-tight">Next Semester Rank Prediction</h3>
                                <p className="text-slate-500 font-bold text-[10px] uppercase">AI Engine is ready to simulate performance based on historical vectors.</p>
                                
                                <div className="flex flex-wrap gap-3 mt-6">
                                    <div className="space-y-1.5 w-full sm:w-auto">
                                        <label className="text-[9px] uppercase tracking-widest text-slate-400 font-bold ml-1">Department View</label>
                                        <select 
                                            value={predictiveDeptFilter}
                                            onChange={(e) => setPredictiveDeptFilter(e.target.value)}
                                            className="w-full sm:w-48 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-900 focus:bg-white outline-none transition-all uppercase"
                                        >
                                            <option value="ALL">Global Engine (All)</option>
                                            <option value="CSE">CSE</option>
                                            <option value="IT">IT</option>
                                            <option value="ECE">ECE</option>
                                            <option value="EEE">EEE</option>
                                            <option value="MECH">MECH</option>
                                            <option value="AIML">AIML</option>
                                            <option value="AIDS">AIDS</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1.5 w-full sm:w-auto">
                                        <label className="text-[9px] uppercase tracking-widest text-slate-400 font-bold ml-1">Academic Year</label>
                                        <select 
                                            value={predictiveYearFilter}
                                            onChange={(e) => setPredictiveYearFilter(e.target.value)}
                                            className="w-full sm:w-40 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-900 focus:bg-white outline-none transition-all uppercase"
                                        >
                                            <option value="ALL">All Cohorts</option>
                                            <option value="1">Alpha (Year 1)</option>
                                            <option value="2">Beta (Year 2)</option>
                                            <option value="3">Gamma (Year 3)</option>
                                            <option value="4">Delta (Year 4)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <Button 
                                onClick={fetchPredictiveRanksData}
                                disabled={isGeneratingRanks}
                                className="relative z-10 h-10 px-6 bg-slate-900 hover:bg-black text-white font-black rounded-lg shadow-sm border-none uppercase tracking-widest text-[10px] transition-all w-full md:w-auto"
                            >
                                {isGeneratingRanks ? <RefreshCw className="h-3.5 w-3.5 animate-spin mr-2" /> : <Zap className="h-3.5 w-3.5 mr-2" />}
                                {isGeneratingRanks ? 'Simulating...' : 'Run Simulation'}
                            </Button>
                        </Card>

                        {predictiveRanks.length > 0 && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                <Card className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
                                    <CardHeader className="bg-slate-50 border-b border-slate-100 px-5 py-3 flex flex-row items-center justify-between">
                                        <CardTitle className="text-xs font-black uppercase flex items-center gap-2 text-slate-900">
                                            <Award className="h-3.5 w-3.5 text-amber-500" />
                                            Predicted Rank Consensus
                                        </CardTitle>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{predictiveRanks.length} Nodes Simulated</p>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left border-collapse">
                                                <thead className="bg-slate-50/50 text-[9px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">
                                                    <tr>
                                                        <th className="px-5 py-3">Rank</th>
                                                        <th className="px-5 py-3">Node Profiling</th>
                                                        <th className="px-5 py-3">Current GPA</th>
                                                        <th className="px-5 py-3">Predicted GPA</th>
                                                        <th className="px-5 py-3 text-right">Probability Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-50">
                                                    {predictiveRanks.map((student) => (
                                                        <tr key={student.student_id} className="hover:bg-slate-50 transition-all group">
                                                            <td className="px-5 py-3">
                                                                <div className="h-7 w-7 rounded bg-slate-100 flex items-center justify-center font-black text-xs text-slate-600 border border-slate-200">
                                                                    #{student.rank}
                                                                </div>
                                                            </td>
                                                            <td className="px-5 py-3">
                                                                <button 
                                                                    onClick={() => fetchStudentInsightData(student.student_id)}
                                                                    className="font-black text-xs text-slate-900 hover:text-blue-600 transition-colors text-left uppercase"
                                                                >
                                                                    {student.student_name}
                                                                </button>
                                                            </td>
                                                            <td className="px-5 py-3 font-bold text-xs text-slate-500">
                                                                {student.current_cgpa || '8.2'} 
                                                            </td>
                                                            <td className="px-5 py-3">
                                                                <span className="px-2 py-0.5 bg-blue-50 border border-blue-100 rounded text-xs font-black text-blue-600">
                                                                    {Math.min(student.predicted_cgpa, 10).toFixed(2)}
                                                                </span>
                                                            </td>
                                                            <td className="px-5 py-3 text-right">
                                                                <div className="flex items-center justify-end gap-2">
                                                                    <span className={cn(
                                                                        "text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded",
                                                                        parseFloat(student.predicted_cgpa) >= 9.5 ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                                                                        parseFloat(student.predicted_cgpa) >= 8.5 ? "bg-blue-50 text-blue-600 border border-blue-100" :
                                                                        "bg-slate-50 text-slate-500 border border-slate-200"
                                                                    )}>
                                                                        {parseFloat(student.predicted_cgpa) >= 9.5 ? "Excellence" : 
                                                                         parseFloat(student.predicted_cgpa) >= 8.5 ? "Stable" : "Steady"}
                                                                    </span>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}
                    </div>
                )}

            {/* User Management & Security View */}
            {activeTab === 'users' && (
                <div className="w-full mt-4 animate-in fade-in zoom-in duration-500">
                    <AdministrativeSearch 
                        userType={userType}
                        setUserType={setUserType}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        isSearching={isSearching}
                        searchResults={searchResults}
                        handleDeleteUser={handleDeleteUser}
                        setIsAddStudentOpen={setIsAddStudentOpen}
                        setIsAddStaffOpen={setIsAddStaffOpen}
                        pagination={pagination}
                        handlePageChange={(p) => performSearch(p)}
                    />
                </div>
            )}
                </div>


            {/* 11. Footer */}
            <footer className="mt-12 border-t border-slate-100 bg-white py-6 px-6">
                <div className="w-full mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-3">
                        <div className="h-7 w-7 shrink-0 rounded bg-slate-900 flex items-center justify-center text-white">
                            <ShieldCheck className="h-4 w-4 shrink-0" />
                        </div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Student Academic Platform v4.2 · Institutional AI System</p>
                    </div>
                    <div className="flex gap-4">
                        <a href="#" className="text-[8px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors">Documentation</a>
                        <a href="#" className="text-[8px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors">System Status</a>
                    </div>
                </div>
            </footer>

            {/* Custom Global Styles for Premium Aesthetics */}
            <style jsx global>{`
        body {
          font-family: system-ui, -apple-system, sans-serif;
        }

        .recharts-cartesian-grid-horizontal line, 
        .recharts-cartesian-grid-vertical line {
            stroke: rgba(0,0,0,0.05);
        }
        
        .recharts-polar-grid-angle line,
        .recharts-polar-grid-concentric polygon {
            stroke: rgba(0,0,0,0.1) !important;
        }
        
        text.recharts-text, text.recharts-cartesian-axis-tick-value {
            fill: #1F2937 !important; /* text-slate-400 */
        }
    `}</style>

            {/* --- Interactive Modals --- */}
            <InterventionModal
                isOpen={isInterventionOpen}
                onClose={() => setIsInterventionOpen(false)}
                cluster={selectedCluster}
            />
            {data && (
                <GlobalActionPlanModal
                    isOpen={isActionPlanOpen}
                    onClose={() => setIsActionPlanOpen(false)}
                    data={data}
                />
            )}
            <AddStudentModal
                isOpen={isAddStudentOpen}
                onClose={() => setIsAddStudentOpen(false)}
                onSuccess={() => { performSearch(); }}
            />
            <AddStaffModal
                isOpen={isAddStaffOpen}
                onClose={() => setIsAddStaffOpen(false)}
                onSuccess={() => { performSearch(); }}
            />
            <StudentPredictionInsightPanel
                isOpen={isPredictionInsightOpen}
                onClose={() => setIsPredictionInsightOpen(false)}
                data={selectedStudentPrediction}
                loading={isInsightLoading}
            />
        </main>
    </div>
);
}
