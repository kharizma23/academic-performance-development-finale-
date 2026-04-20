"use client";

import React, { useState } from "react";
import AIAssistant from "@/components/admin/AIAssistant";
import AdminResults from "@/components/admin/AdminResults";
import { MessageSquare, BarChart3, Sparkles } from "lucide-react";

export default function AIAssistantPage() {
 const [activeTab, setActiveTab] = useState<"chat" | "results">("chat");

 return (
 <div className="flex bg-slate-950 min-h-screen font-sans">
 <div className="flex-1 p-8 md:p-12 overflow-x-hidden">
 <div className="w-full space-y-12">
 {/* Page Header */}
 <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
 <div className="space-y-2">
 <h1 className="text-5xl font-black text-white  flex items-center gap-4">
 AI Exam Center
 <div className="p-2 bg-emerald-500/20 rounded-xl relative group">
 <Sparkles className="w-6 h-6 text-emerald-400 animate-pulse" />
 <div className="absolute inset-0 bg-emerald-400/20 blur-xl rounded-full scale-150 opacity-20 group-hover:opacity-40 transition-opacity" />
 </div>
 </h1>
 <p className="text-slate-400 text-lg font-medium opacity-80 max-w-2xl">
 Deploy neural agents for automated test generation, dynamic student monitoring, and precision evaluation.
 </p>
 </div>

 {/* Tab Switcher */}
 <div className="bg-slate-900/50 p-2 rounded-3xl border border-white/5 backdrop-blur-xl flex gap-2">
 <button
 onClick={() => setActiveTab("chat")}
 className={`flex items-center gap-3 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
 activeTab === "chat" 
 ? "bg-emerald-600 text-white shadow-xl shadow-emerald-900/30" 
 : "text-slate-400 hover:text-white"
 }`}
 >
 <MessageSquare size={16} /> AI Assistant
 </button>
 <button
 onClick={() => setActiveTab("results")}
 className={`flex items-center gap-3 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
 activeTab === "results" 
 ? "bg-emerald-600 text-white shadow-xl shadow-emerald-900/30" 
 : "text-slate-400 hover:text-white"
 }`}
 >
 <BarChart3 size={16} /> Monitoring Node
 </button>
 </div>
 </div>

 {/* Dynamic Content */}
 <div className="transition-all duration-700 animate-in fade-in slide-in-from-bottom-8">
 {activeTab === "chat" ? (
 <AIAssistant />
 ) : (
 <AdminResults />
 )}
 </div>
 </div>
 </div>
 </div>
 );
}
