"use client"

import Link from "next/link"
import { 
 LayoutDashboard, GraduationCap, User, LogOut, ChevronRight, Bell, 
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
 { href: "/student/ai-assistant", icon: MessageSquare, label: "AI Assistant", active: pathname === "/student/ai-assistant" },
 { href: "/student/progress", icon: LineChart, label: "Progress Tracker", active: pathname === "/student/progress" },
 ]

 return (
 <div className="flex h-screen w-full bg-[#F8FAFC] text-[#0F172A] font-sans selection:bg-blue-500/10">
 {/* 1. FIXED WIDTH SIDEBAR (260px) */}
 <aside className="hidden h-full sm:flex w-[260px] flex-col border-r border-[#E2E8F0] bg-[#0F172A] shadow-2xl shrink-0 transition-all overflow-hidden text-white z-50">
 <div className="h-24 flex items-center px-6 border-b border-white/5 bg-white/[0.02]">
 <Link className="flex items-center gap-3 group" href="/student">
 <div className="h-10 w-10 shrink-0 bg-[#2563EB] flex items-center justify-center text-white rounded-xl shadow-lg border border-white/10 transition-transform">
 <GraduationCap className="h-6 w-6" />
 </div>
 <div className="flex flex-col min-w-0">
 <span className="font-black text-2xl  text-white uppercase leading-none truncate">Scholar</span>
 <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest mt-1 truncate">Institutional Node</span>
 </div>
 </Link>
 </div>

 <div className="flex-1 overflow-y-auto py-8 custom-scrollbar">
 <nav className="space-y-4 px-4">
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

 <div className="p-6 border-t border-white/5 bg-[#0F172A]/50">
 <Link
 href="/student/profile"
 className={cn(
 "group flex items-center gap-4 px-8 py-6 rounded-2xl transition-all border-2 border-transparent h-20",
 pathname === "/student/profile" ? "bg-[#2563EB] text-white font-black shadow-2xl border-white/20" : "text-white/60 hover:text-white hover:bg-white/5"
 )}
 >
 <User className="h-7 w-7" />
 <span className="text-lg font-[1000] uppercase tracking-[0.1em] leading-none ">Identity Matrix</span>
 </Link>

 <button 
 onClick={() => { localStorage.removeItem('token'); window.location.href='/login'; }}
 className="w-full mt-6 flex items-center justify-between px-8 py-6 rounded-2xl bg-white/5 hover:bg-rose-600 text-white transition-all group font-[1000] text-xs uppercase tracking-[0.2em] border-2 border-white/10 h-20"
 >
 <span>Terminate Access</span>
 <LogOut className="h-6 w-6 transition-transform" />
 </button>
 </div>
 </aside>

 {/* 2. FLEX-GROW MAIN CONTENT AREA */}
 <div className="flex flex-col flex-grow min-w-0 h-screen overflow-hidden">
 <header className="sticky top-0 z-40 flex h-32 items-center gap-6 border-b-2 border-[#E2E8F0] bg-white/80 backdrop-blur-2xl px-12 shadow-sm shrink-0">
 <div className="flex-1 flex items-center justify-between">
 <div className="flex items-center gap-12">
 <div className="hidden lg:flex items-center gap-6 px-8 py-4 bg-[#F8FAFC] border-2 border-[#E2E8F0] rounded-2xl shadow-inner">
 <span className="h-3 w-3 rounded-full bg-blue-600 animate-pulse shadow-[0_0_10px_rgba(37,99,235,0.6)]" />
 <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#475569]">System: AUTHORIZED-SYNCED</span>
 </div>
 </div>
 
 <div className="flex items-center gap-8">
 <button className="h-16 w-16 bg-white border-2 border-[#E2E8F0] rounded-2xl flex items-center justify-center text-[#475569] hover:bg-blue-50 group relative hover:border-[#2563EB] transition-all shadow-md">
 <Bell className="h-8 w-8" />
 <div className="absolute top-4 right-4 h-3 w-3 bg-rose-500 rounded-full border-4 border-white shadow-lg" />
 </button>
 <div className="h-12 w-[2px] bg-slate-100 mx-2 rounded-full" />
 <div className="flex items-center gap-8 pl-4">
 <Link href="/student/profile" className="h-20 w-20 bg-[#2563EB] rounded-2xl shadow-[0_15px_30px_rgba(37,99,235,0.3)] flex items-center justify-center text-white active:scale-95 transition-all cursor-pointer border-none group">
 <User className="h-10 w-10 group-hover:rotate-12 transition-transform" />
 </Link>
 </div>
 </div>
 </div>
 </header>

 <main className="flex-1 w-full bg-[#F8FAFC] overflow-y-auto overflow-x-hidden px-6 py-8 custom-scrollbar">
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
 "group flex items-center gap-6 px-8 py-6 rounded-2xl transition-all relative overflow-hidden h-20 border-2 border-transparent",
 active
 ? "text-white bg-[#2563EB] shadow-[0_20px_50px_rgba(37,99,235,0.5)] border-white/30"
 : "text-white/40 hover:text-white hover:bg-white/[0.1] hover:border-white/10"
 )}
 >
 <Icon className={cn("h-7 w-7 transition-all shrink-0", active ? "text-white" : "text-white/60 group-hover:text-white")} />
 <span className={cn("text-lg lg:text-xl uppercase tracking-[0.05em] font-[1000] leading-none whitespace-nowrap truncate", active ? "text-white" : "opacity-60")}>{label}</span>
 {active && <ChevronRight className="h-6 w-6 ml-auto text-white opacity-40 transition-transform" />}
 </Link>
 )
}
