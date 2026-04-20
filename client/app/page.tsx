"use client"

import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldCheck, Users, BookOpen, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Home() {
 return (
 <main className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 md:p-12 font-sans selection:bg-blue-100 selection:text-blue-900">
 {/* Hero Section */}
    <div className="w-full flex flex-col items-center text-center mb-12 md:mb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="space-y-4"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-100 rounded-full text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-4">
          <ShieldCheck className="h-3 w-3" /> Secure Gateway
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-[#0F172A] leading-tight uppercase tracking-tight">
          INSTITUTIONAL <span className="text-[#2563EB]">INTELLIGENCE</span>
        </h1>
        <p className="text-xs md:text-sm text-[#64748B] font-bold tracking-[0.4em] uppercase opacity-60">
          Advanced Academic Management Ecosystem
        </p>
      </motion.div>
    </div>

    {/* Role Cards Layout */}
    <div className="flex flex-col md:flex-row justify-center items-stretch gap-6 lg:gap-8 w-full max-w-6xl">
      <RoleCard
        href="/login?role=admin"
        title="Admin"
        description="Central command center for institutional management and system oversight."
        icon={ShieldCheck}
        delay={0.1}
      />

      <RoleCard
        href="/login?role=faculty"
        title="Faculty"
        description="Advanced academic suite for curriculum design and student performance analysis."
        icon={Users}
        delay={0.2}
      />

      <RoleCard
        href="/login?role=student"
        title="Student"
        description="Personalized mastery hub for real-time progress tracking and resource access."
        icon={BookOpen}
        delay={0.3}
      />
    </div>

    {/* Footer Branding */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8, duration: 1 }}
      className="mt-24 text-[#94A3B8] text-[10px] font-bold uppercase tracking-[0.6em] opacity-50"
    >
      Core Architecture v7.4.2_LTS
    </motion.div>
  </main>
);
}

function RoleCard({ href, title, description, icon: Icon, delay }: any) {
return (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="flex-1"
  >
    <Link href={href} className="group block h-full">
      <div className="relative bg-white h-full rounded-2xl p-8 md:p-12 flex flex-col items-center text-center justify-between border border-[#E2E8F0] shadow-sm transition-all duration-500 hover:shadow-xl hover:border-blue-400 group-hover:-translate-y-2">
        <div className="w-16 h-16 bg-[#F8FAFC] rounded-xl flex items-center justify-center mb-6 border border-[#F1F5F9] transition-all duration-500 group-hover:bg-[#DBEAFE] group-hover:border-[#BFDBFE]">
          <Icon className="w-8 h-8 text-[#2563EB]" strokeWidth={2} />
        </div>

        <div>
          <h2 className="text-xl md:text-2xl font-black text-[#0F172A] mb-4 uppercase tracking-tight group-hover:text-[#2563EB] transition-colors">
            {title}
          </h2>
          <p className="text-xs md:text-sm font-medium text-[#64748B] leading-relaxed opacity-80">
            {description}
          </p>
        </div>

        <div className="mt-8 flex items-center gap-2 text-[#2563EB] font-bold text-[10px] tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-all duration-500">
           Initialize Hub <ArrowRight className="w-4 h-4" strokeWidth={3} />
        </div>
      </div>
    </Link>
  </motion.div>
);
}
