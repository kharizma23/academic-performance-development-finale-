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
    <div className="w-full h-[calc(100vh-100px)] flex flex-col space-y-6 pb-6 text-[#0F172A] font-sans selection:bg-blue-500/10">
      <div className="space-y-4">
        <div className="flex items-center gap-4 mb-2">
          <span className="p-2 bg-blue-100 rounded-xl text-blue-600 border border-blue-200 shadow-sm">
            <MessageSquare className="h-6 w-6" />
          </span>
          <h1 className="text-3xl md:text-4xl font-black uppercase leading-none text-[#0F172A]">
            AI <span className="text-blue-600">Assistant</span>
          </h1>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm relative overflow-hidden flex items-center gap-6">
          <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shadow-sm border border-blue-100 flex-shrink-0 animate-pulse">
            <BrainCircuit className="h-6 w-6" />
          </div>
          <p className="text-sm font-bold text-[#475569] leading-relaxed w-full uppercase">
            GEMINI-INSTITUTIONAL CORE: ACTIVE & SYNCHRONIZED. INJECT NEURAL REQUESTS.
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden h-full">
        {/* Chat Container (LIGHT THEME) */}
        <div className="flex-1 flex flex-col bg-white border border-[#E2E8F0] shadow-sm rounded-3xl overflow-hidden h-full">
          <div className="p-4 border-b border-[#F1F5F9] flex items-center justify-between bg-[#F8FAFC]">
            <div className="flex items-center gap-4">
              <div className="h-6 w-6 bg-emerald-100 border border-emerald-500 rounded-full animate-pulse shadow-sm" />
              <p className="text-[9px] font-black text-[#0F172A] uppercase tracking-[0.2em] underline underline-offset-4 decoration-emerald-500 shadow-sm leading-none">SCHOLAR.AI-DAEMON ONLINE</p>
            </div>
            <Button className="h-8 px-4 bg-white border border-[#E2E8F0] text-[#475569]/60 font-black uppercase text-[9px] tracking-widest rounded-lg hover:bg-slate-50 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm">
              <RotateCcw className="h-3 w-3 mr-2" /> REBOOT SYNC
            </Button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar scroll-smooth">
            <AnimatePresence>
              {messages.map((m, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: m.role === 'ai' ? -10 : 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={cn(
                    "flex flex-col gap-2 max-w-[85%]",
                    m.role === 'ai' ? "self-start items-start" : "self-end items-end"
                  )}
                >
                  <div className={cn(
                    "p-4 rounded-2xl border transition-all shadow-sm leading-relaxed text-sm font-bold uppercase",
                    m.role === 'ai' ? "bg-[#F8FAFC] border-[#E2E8F0] text-[#0F172A]" : "bg-blue-600 border-blue-500 text-white"
                  )}>
                    "{m.content}"
                  </div>
                  <span className="text-[9px] font-black text-[#475569]/40 uppercase tracking-[.2em] ml-2">{m.role === 'ai' ? 'SCHOLAR NODE' : 'IDENTITY NODE'}</span>
                </motion.div>
              ))}
            </AnimatePresence>
            {isTyping && (
              <div className="self-start p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] shadow-sm flex items-center justify-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-bounce" />
                <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-bounce [animation-delay:0.2s]" />
                <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-bounce [animation-delay:0.4s]" />
              </div>
            )}
          </div>

          <form onSubmit={handleSend} className="p-4 border-t border-[#E2E8F0] bg-[#F8FAFC]">
            <div className="relative flex gap-4">
              <input 
                placeholder="INJECT YOUR QUERY NODE HERE..."
                className="flex-1 h-12 px-4 rounded-xl text-xs font-bold bg-white border border-[#E2E8F0] uppercase focus:outline-none focus:border-blue-600 transition-all shadow-sm"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isTyping}
              />
              <Button disabled={!input.trim() || isTyping} type="submit" className="h-12 px-6 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase text-[9px] tracking-widest rounded-xl shadow-md transition-all active:scale-95">
                {isTyping ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
          </form>
        </div>

        {/* Information Node (LIGHT THEME) */}
        <div className="w-full lg:w-80 flex flex-col gap-6 h-full">
          <div className="bg-white border border-[#E2E8F0] shadow-sm p-6 rounded-3xl space-y-6 h-fit">
            <h2 className="text-xl font-black uppercase text-[#0F172A] border-b border-indigo-50 pb-3 flex items-center gap-3">
              <Zap className="h-5 w-5 text-indigo-600" /> Proto-Injections
            </h2>
            <div className="space-y-3">
              {[
                { title: "GENERATE MCQ NODE", icon: Target, desc: "DATA STRUCTURES" },
                { title: "EXPLAIN LOGIC", icon: BrainCircuit, desc: "HEAP REBALANCING" },
                { title: "STUDY PLAN SYNC", icon: LineChart, desc: "70-DAY MASTER" }
              ].map((proto, i) => (
                <div key={i} className="p-3 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] group hover:bg-white hover:border-indigo-600 hover:shadow-sm transition-all cursor-pointer flex items-center gap-4">
                  <div className="h-10 w-10 bg-white border border-[#E2E8F0] group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm rounded-xl flex items-center justify-center text-[#475569]">
                    <proto.icon className="h-4 w-4" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-[#0F172A] uppercase leading-none group-hover:text-indigo-600 transition-colors">{proto.title}</p>
                    <p className="text-[9px] font-bold text-[#475569]/60 uppercase tracking-widest">{proto.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-[#E2E8F0] shadow-sm p-6 space-y-6 flex-1 rounded-3xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-[#F1F5F9]/30 group-hover:bg-blue-50 transition-all duration-700 opacity-60" />
            <h2 className="text-xl font-black uppercase text-[#0F172A] border-b border-[#F1F5F9] pb-3 relative z-10 w-full mb-4 flex items-center gap-3">
              <Star className="h-5 w-5 text-blue-600" /> AI Insights
            </h2>
            <ul className="space-y-4 relative z-10">
              {[
                "DETECTED WEAKNESS IN GRAPHS NODE. SHOULD I GENERATE A REHABILITATION SYNC?",
                "YOUR CURRENT NEURAL VELOCITY IS PEAK. RECOMMENDING ADVANCED CLOUD ARCHITECTURE SETS."
              ].map((s, i) => (
                <li key={i} className="p-4 rounded-2xl bg-white text-[10px] font-black text-[#475569]/80 leading-relaxed border-l-4 border-l-blue-600 shadow-sm uppercase transition-all hover:border-l-indigo-600">
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
