"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
 MessageSquare, Loader2, Send, Sparkles, 
 BrainCircuit, Zap, Target, BookOpen, 
 ArrowRight, LineChart, Star, RotateCcw
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export default function AIAssistant() {
 const [messages, setMessages] = useState<any[]>([
 { role: 'ai', content: "SCHOLAR-AI PROTOCOL INITIALIZED. I AM SYNCHRONIZED WITH YOUR ACADEMIC NODE. INJECT DOUBTS OR REQUEST SYNTHETIC STUDY PLANS." }
 ])
 const [input, setInput] = useState("")
 const [isTyping, setIsTyping] = useState(false)
 const scrollRef = useRef<HTMLDivElement>(null)

 useEffect(() => {
 if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
 }, [messages])

 const handleSend = async (e: React.FormEvent) => {
 e.preventDefault()
 if (!input.trim() || isTyping) return

 const userMsg = input
 setInput("")
 setMessages(prev => [...prev, { role: 'user', content: userMsg }])
 setIsTyping(true)

 // Mocking AI Response Node
 setTimeout(() => {
 const aiResponse = `NODE RESPONSE: "${userMsg}" HAS BEEN PROCESSED. DETECTING HIGH CONTEXTUAL DELTA IN THE CURRENT SEMANTIC SET. RECOMMENDING IMMEDIATE RECALIBRATION OF SUBJECT NODES.`
 setMessages(prev => [...prev, { role: 'ai', content: aiResponse }])
 setIsTyping(false)
 }, 1500)
 }

 return (
 <div className="w-full h-[calc(100vh-180px)] flex flex-col space-y-10 pb-40 text-[#0F172A] font-sans selection:bg-blue-500/10">
 <div className="space-y-6">
 <div className="flex items-center gap-6 mb-4">
 <span className="p-3 bg-blue-100 rounded-xl text-blue-600 border border-blue-200 shadow-sm">
 <MessageSquare className="h-8 w-8" />
 </span>
 <h1 className="text-4xl md:text-6xl font-black  uppercase leading-none text-[#0F172A] ">
 AI <span className="text-blue-600 underline decoration-[#E2E8F0] underline-offset-[16px]">Assistant</span>
 </h1>
 </div>

 <div className="p-10 rounded-[3rem] bg-white border border-[#E2E8F0] shadow-md relative overflow-hidden flex items-center gap-10 hover:shadow-xl transition-all duration-500">
 <div className="h-20 w-20 bg-blue-50 rounded-[2.5rem] flex items-center justify-center text-blue-600 shadow-sm border border-blue-100 flex-shrink-0 animate-pulse">
 <BrainCircuit className="h-10 w-10" />
 </div>
 <p className="text-xl md:text-2xl font-bold text-[#475569]  leading-relaxed w-full uppercase">
 GEMINI-INSTITUTIONAL CORE: ACTIVE & SYNCHRONIZED. INJECT NEURAL REQUESTS.
 </p>
 </div>
 </div>

 <div className="flex-1 flex flex-col lg:flex-row gap-12 overflow-hidden h-full">
 {/* Chat Container (LIGHT THEME) */}
 <div className="flex-1 flex flex-col bg-white border border-[#E2E8F0] shadow-md rounded-[3.5rem] overflow-hidden backdrop-blur-xl h-full">
 <div className="p-8 border-b-2 border-[#F1F5F9] flex items-center justify-between bg-[#F8FAFC]">
 <div className="flex items-center gap-6">
 <div className="h-10 w-10 bg-emerald-100 border-2 border-emerald-500 rounded-full animate-pulse shadow-sm" />
 <p className="text-[10px] font-black text-[#0F172A] uppercase tracking-[0.4em] underline underline-offset-8 decoration-emerald-500 shadow-sm leading-none">SCHOLAR.AI-DAEMON ONLINE</p>
 </div>
 <Button className="h-10 px-6 bg-white border border-[#E2E8F0] text-[#475569]/40 font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-slate-50 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm">
 <RotateCcw className="h-4 w-4 mr-2" /> REBOOT SYNC
 </Button>
 </div>

 <div ref={scrollRef} className="flex-1 overflow-y-auto p-12 space-y-12 custom-scrollbar scroll-smooth bg-pattern h-full">
 <AnimatePresence>
 {messages.map((m, i) => (
 <motion.div 
 key={i}
 initial={{ opacity: 0, x: m.role === 'ai' ? -20 : 20 }}
 animate={{ opacity: 1, x: 0 }}
 className={cn(
 "flex flex-col gap-4 max-w-[85%]",
 m.role === 'ai' ? "self-start items-start" : "self-end items-end"
 )}
 >
 <div className={cn(
 "p-10 rounded-[2.5rem] border transition-all shadow-md leading-relaxed text-2xl font-black uppercase ",
 m.role === 'ai' ? "bg-white border-[#E2E8F0] text-[#0F172A] hover:shadow-xl duration-500" : "bg-blue-600 border-blue-500 text-white not- shadow-lg"
 )}>
 "{m.content}"
 </div>
 <span className="text-[10px] font-black text-[#475569]/30 uppercase tracking-[.4em] ml-8">{m.role === 'ai' ? 'SCHOLAR NODE' : 'IDENTITY NODE'}</span>
 </motion.div>
 ))}
 </AnimatePresence>
 {isTyping && (
 <div className="self-start p-8 rounded-[3rem] bg-white border border-[#E2E8F0] shadow-sm flex items-center justify-center gap-3">
 <span className="h-2 w-2 rounded-full bg-blue-600 animate-bounce" />
 <span className="h-2 w-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.2s]" />
 <span className="h-2 w-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.4s]" />
 </div>
 )}
 </div>

 <form onSubmit={handleSend} className="p-10 border-t border-[#F1F5F9] bg-[#F8FAFC]">
 <div className="relative flex gap-6">
 <input 
 placeholder="INJECT YOUR QUERY NODE HERE..."
 className="input-glass flex-1 !h-20 text-xl font-black !bg-white border-2 border-[#CBD5E1] uppercase "
 value={input}
 onChange={(e) => setInput(e.target.value)}
 disabled={isTyping}
 />
 <Button disabled={!input.trim() || isTyping} type="submit" className="premium-button !h-20 !px-12 text-2xl font-black shadow-xl active:scale-95 transition-all">
 {isTyping ? <Loader2 className="h-8 w-8 animate-spin" /> : <Send className="h-9 w-9" />}
 </Button>
 </div>
 </form>
 </div>

 {/* Information Node (LIGHT THEME) */}
 <div className="w-full lg:w-96 flex flex-col gap-10 h-full">
 <div className="glass-card bg-white border border-[#E2E8F0] shadow-md p-10 space-y-12 hover:shadow-xl transition-all duration-500 h-fit">
 <h2 className="text-3xl font-black uppercase  text-[#0F172A] border-b-2 border-indigo-600 pb-6 shadow-sm flex items-center gap-6">
 <Zap className="h-9 w-9 text-indigo-600" /> Proto-Injections
 </h2>
 <div className="space-y-6">
 {[
 { title: "GENERATE MCQ NODE", icon: Target, desc: "DATA STRUCTURES" },
 { title: "EXPLAIN LOGIC", icon: BrainCircuit, desc: "HEAP REBALANCING" },
 { title: "STUDY PLAN SYNC", icon: LineChart, desc: "70-DAY MASTER" }
 ].map((proto, i) => (
 <div key={i} className="p-8 rounded-[2rem] bg-[#F8FAFC] border border-[#E2E8F0] group hover:bg-white hover:border-indigo-600 hover:shadow-md transition-all duration-300 cursor-pointer flex items-center gap-6">
 <div className="h-12 w-12 bg-white border border-[#E2E8F0] group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm rounded-2xl flex items-center justify-center text-[#475569]">
 <proto.icon className="h-6 w-6" />
 </div>
 <div className="space-y-1">
 <p className="text-xs font-black text-[#0F172A] uppercase leading-none group-hover:text-indigo-600 transition-colors">{proto.title}</p>
 <p className="text-[10px] font-black text-[#475569]/30 uppercase tracking-widest">{proto.desc}</p>
 </div>
 </div>
 ))}
 </div>
 </div>

 <div className="glass-card bg-white border border-[#E2E8F0] shadow-md p-10 space-y-10 flex-1 hover:shadow-xl transition-all duration-500 relative overflow-hidden group">
 <div className="absolute inset-0 bg-[#F1F5F9]/50 group-hover:bg-blue-50 transition-all duration-700 opacity-60" />
 <h2 className="text-3xl font-black uppercase  text-[#0F172A] border-b border-[#F1F5F9] pb-6 shadow-sm relative z-10 w-full mb-8">
 <Star className="h-9 w-9 text-blue-600" /> AI Insights
 </h2>
 <ul className="space-y-8 relative z-10">
 {[
 "DETECTED WEAKNESS IN GRAPHS NODE. SHOULD I GENERATE A REHABILITATION SYNC?",
 "YOUR CURRENT NEURAL VELOCITY IS PEAK. RECOMMENDING ADVANCED CLOUD ARCHITECTURE SETS."
 ].map((s, i) => (
 <li key={i} className="p-8 rounded-[2rem] bg-white text-xl font-black text-[#475569] leading-relaxed border-l-[12px] border-l-blue-600 shadow-md uppercase transition-all hover:scale-105">
 "{s}"
 </li>
 ))}
 </ul>
 </div>
 </div>
 </div>
 </div>
 )
}
