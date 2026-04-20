"use client"

import Link from "next/link"
import { 
 LayoutDashboard, GraduationCap, User, LogOut, ChevronRight, ChevronLeft, Bell, 
 BookOpen, Zap, ClipboardCheck, BarChart3, Map, Rocket, 
 AlertTriangle, Library, MessageSquare, LineChart 
} from "lucide-react"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"

export default function StudentLayout({
 children,
}: {
 children: React.ReactNode
}) {
 const pathname = usePathname()

 const navItems = [
 { href: "/student", icon: LayoutDashboard, label: "Smart Overview", active: pathname === "/student" },
 { href: "/student/academic", icon: GraduationCap, label: "Academic Journey", active: pathname === "/student/academic" },
 { href: "/student/roadmap", icon: Map, label: "Strategic Roadmap", active: pathname === "/student/roadmap" },
 { href: "/student/skills", icon: Zap, label: "Skill Lab (AI)", active: pathname === "/student/skills" },
 { href: "/student/exams", icon: ClipboardCheck, label: "My Exams", active: pathname === "/student/exams" },
 { href: "/student/results", icon: BarChart3, label: "Results Analytics", active: pathname === "/student/results" },
 { href: "/student/career", icon: Map, label: "Career Navigator", active: pathname === "/student/career" },
 { href: "/student/placement", icon: Rocket, label: "Placement Booster", active: pathname === "/student/placement" },
 { href: "/student/alerts", icon: AlertTriangle, label: "Alerts & Support", active: pathname === "/student/alerts" },
 { href: "/student/learning", icon: Library, label: "Learning Hub", active: pathname === "/student/learning" },
 { href: "/student/progress", icon: LineChart, label: "Progress Tracker", active: pathname === "/student/progress" },
 ]

 return (
 <div className="flex h-screen w-full bg-[#F8FAFC] text-[#0F172A] font-sans selection:bg-blue-500/10">
 {/* 1. FIXED WIDTH SIDEBAR (240px) */}
 <aside className="hidden h-full sm:flex w-[240px] flex-col border-r border-[#E2E8F0] bg-[#0F172A] shadow-2xl shrink-0 transition-all overflow-hidden text-white z-50">
 <div className="h-20 flex items-center px-5 border-b border-white/5 bg-white/[0.02]">
 <Link className="flex items-center gap-2 group" href="/student">
 <div className="h-8 w-8 shrink-0 bg-[#2563EB] flex items-center justify-center text-white rounded-lg shadow-lg border border-white/10 transition-transform">
 <GraduationCap className="h-5 w-5" />
 </div>
 <div className="flex flex-col min-w-0">
 <span className="font-black text-xl text-white uppercase leading-none truncate">Scholar</span>
 <span className="text-[8px] font-black text-blue-400 uppercase tracking-widest mt-0.5 truncate">Institutional Node</span>
 </div>
 </Link>
 </div>

 <div className="flex-1 overflow-y-auto py-6 custom-scrollbar">
 <nav className="space-y-1.5 px-3">
 {navItems.map((item, idx) => (
 <NavItem 
 key={idx}
 href={item.href} 
 icon={item.icon} 
 label={item.label} 
 active={item.active} 
 />
 ))}
 </nav>
 </div>

 <div className="p-4 border-t border-white/5 bg-[#0F172A]/50 space-y-3">
 <Link
 href="/student/profile"
 className={cn(
 "group flex items-center gap-3 px-5 rounded-xl transition-all border-2 border-transparent h-12",
 pathname === "/student/profile" ? "bg-[#2563EB] text-white font-black shadow-lg border-white/20" : "text-white/60 hover:text-white hover:bg-white/5"
 )}
 >
 <User className="h-5 w-5" />
 <span className="text-[10px] font-black uppercase tracking-widest leading-none ">Identity Matrix</span>
 </Link>

 <button 
 onClick={() => { localStorage.removeItem('token'); window.location.href='/login'; }}
 className="w-full flex items-center justify-between px-5 rounded-xl bg-white/5 hover:bg-rose-600 text-white transition-all group font-black text-[9px] uppercase tracking-widest border border-white/10 h-12"
 >
 <span>Terminate Access</span>
 <LogOut className="h-4 w-4 transition-transform group-hover:translate-x-1" />
 </button>
 </div>
 </aside>

 {/* 2. FLEX-GROW MAIN CONTENT AREA */}
 <div className="flex flex-col flex-grow min-w-0 h-screen overflow-hidden">
 <header className="sticky top-0 z-40 flex h-20 items-center gap-6 border-b border-[#E2E8F0] bg-white/80 backdrop-blur-2xl px-8 shadow-sm shrink-0">
 <div className="flex-1 flex items-center justify-between">
  <div className="flex items-center gap-4">
  <button onClick={() => window.history.back()} className="h-10 w-10 flex items-center justify-center bg-white border border-[#E2E8F0] rounded-xl text-[#64748B] hover:bg-slate-50 hover:text-[#0F172A] hover:border-blue-600 transition-all shadow-sm group">
  <ChevronLeft className="h-5 w-5 group-hover:-translate-x-0.5 transition-transform" />
  </button>
  <div className="h-6 w-px bg-slate-200 mx-2" />
  <div className="hidden lg:flex items-center gap-4 px-5 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl shadow-inner">
 <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
 <span className="text-[9px] font-black uppercase tracking-widest text-[#475569]">System: AUTHORIZED-SYNCED</span>
 </div>
 </div>
 
 <div className="flex items-center gap-6">
 <button className="h-10 w-10 bg-white border border-[#E2E8F0] rounded-xl flex items-center justify-center text-[#475569] hover:bg-blue-50 group relative hover:border-[#2563EB] transition-all shadow-sm">
 <Bell className="h-5 w-5" />
 <div className="absolute top-2 right-2 h-2.5 w-2.5 bg-rose-500 rounded-full border-2 border-white" />
 </button>
 <div className="h-8 w-px bg-slate-100" />
 <Link href="/student/profile" className="h-12 w-12 bg-[#2563EB] rounded-xl shadow-md flex items-center justify-center text-white active:scale-95 transition-all cursor-pointer border-none group">
 <User className="h-6 w-6 group-hover:rotate-12 transition-transform" />
 </Link>
 </div>
 </div>
 </header>

 <main className="flex-1 w-full bg-[#F8FAFC] overflow-y-auto overflow-x-hidden px-8 py-8 custom-scrollbar">
 {children}
 </main>
 </div>
 </div>
 )
}

function NavItem({ href, icon: Icon, label, active }: { href: string, icon: any, label: string, active?: boolean }) {
 return (
 <Link
 href={href}
 className={cn(
 "group flex items-center gap-4 px-5 rounded-xl transition-all relative overflow-hidden h-12 border border-transparent",
 active
 ? "text-white bg-[#2563EB] shadow-xl border-white/20"
 : "text-white/40 hover:text-white hover:bg-white/[0.05]"
 )}
 >
 <Icon className={cn("h-5 w-5 transition-all shrink-0", active ? "text-white" : "text-white/60 group-hover:text-white")} />
 <span className={cn("text-[10px] uppercase tracking-widest font-black leading-none whitespace-nowrap truncate", active ? "text-white" : "opacity-60")}>{label}</span>
 {active && <ChevronRight className="h-4 w-4 ml-auto text-white opacity-40 transition-transform" />}
 </Link>
 )
}
