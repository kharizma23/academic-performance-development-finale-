"use client";

import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, Send, Bot, User, Sparkles, PlusCircle, CheckCircle, Brain, BookOpen, Layers, Target, Users, Loader2 } from "lucide-react";
import { robustFetch } from "@/lib/cache";
import { cn } from "@/lib/utils";

interface Message {
 role: "user" | "ai";
 content: string;
 intent?: "question_generation" | "data_retrieval" | "general_chat";
 data?: any;
 suggestions?: string[];
}

export default function AIAssistant() {
 const [messages, setMessages] = useState<Message[]>([
 { role: "ai", content: "Hello Admin! I'm your AI Academic Assistant. I can help you generate question papers, fetch student rankings, and evaluate submissions. How can I help you today?" }
 ]);
 const [input, setInput] = useState("");
 const [loading, setLoading] = useState(false);
 
 // Test Creation State
 const [testConfig, setTestConfig] = useState<any>(null);
 const [isAssigning, setIsAssigning] = useState(false);
 
 const chatEndRef = useRef<HTMLDivElement>(null);
 const API_BASE = "http://127.0.0.1:8000/api";

 const [sessionId, setSessionId] = useState("");

 useEffect(() => {
 setSessionId(Math.random().toString(36).substring(7).toUpperCase());
 }, []);

 const scrollToBottom = () => {
 chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
 };

 useEffect(() => {
 scrollToBottom();
 }, [messages]);

 const handleSend = async (forcedMsg?: string) => {
 const messageToSend = forcedMsg || input;
 if (!messageToSend.trim()) return;

 const userMsg: Message = { role: "user", content: messageToSend };
 setMessages((prev) => [...prev, userMsg]);
 if (!forcedMsg) setInput("");
 setLoading(true);

 try {
 const res = await robustFetch(`${API_BASE}/ai/chat`, {
 method: "POST",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify({ message: messageToSend }),
 });
 const data = await res.json();
 
 if (res.status !== 200) {
 setMessages((prev) => [...prev, { role: "ai", content: `Neural Node Error: ${data.message || "Failed"}` }]);
 setLoading(false);
 return;
 }

 const aiResponse = data.message || "No signal received.";
 const aiIntent = data.intent || "general_chat";

 const newAiMsg: Message = { 
 role: "ai", 
 content: aiResponse, 
 intent: aiIntent, 
 data: data.data,
 suggestions: data.suggestions || []
 };
 
 setMessages((prev) => [...prev, newAiMsg]);

 if (aiIntent === "question_generation" && data.data?.questions) {
 setTestConfig({
 subject: data.data.subject,
 topic: data.data.topic,
 questions: data.data.questions,
 department: "CSE",
 year: 3,
 title: `${data.data.subject} AI Generated Quiz`
 });
 }
 } catch (err) {
 console.error(err);
 setMessages((prev) => [...prev, { role: "ai", content: "Sorry, I'm having trouble connecting to the neural brain." }]);
 } finally {
 setLoading(false);
 }
 };

 const handleCreateAndAssign = async () => {
 if (!testConfig) return;
 setIsAssigning(true);

 try {
 const token = localStorage.getItem('token');
 const res = await fetch(`${API_BASE}/ai/save-generated-test`, {
 method: 'POST',
 headers: {
 'Content-Type': 'application/json',
 'Authorization': `Bearer ${token}`
 },
 body: JSON.stringify({
 title: testConfig.title,
 subject: testConfig.subject,
 topic: testConfig.topic,
 questions: testConfig.questions
 })
 });
 
 if (res.ok) {
 setMessages(prev => [...prev, { 
 role: "ai", 
 content: `✅ Test Node Executed. "${testConfig.title}" has been successfully committed to the institutional archive.` 
 }]);
 setTestConfig(null);
 } else {
 const data = await res.json();
 alert(data.detail || "Neural handshake failure.");
 }
 } catch (err) {
 console.error(err);
 alert("Failed to create and assign test.");
 } finally {
 setIsAssigning(false);
 }
 };

 return (
 <div className="flex flex-col h-full max-h-[calc(100vh-160px)] bg-slate-900 text-slate-100 rounded-xl border border-slate-800 shadow-xl overflow-hidden font-sans relative">
  {/* Header Section */}
  <div className="px-6 py-4 bg-slate-900 border-b border-white/5 flex items-center justify-between">
    <div className="flex items-center gap-4">
      <button 
        onClick={() => window.location.href = '/admin'}
        className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-all border border-white/5 group"
      >
        <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:text-emerald-400" />
      </button>
      <div>
        <h1 className="text-sm font-black uppercase flex items-center gap-2">
          Exam Center <Sparkles size={12} className="text-emerald-500 animate-pulse" />
        </h1>
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">Autonomous Assessment Protocol</p>
      </div>
    </div>
    <div className="hidden sm:flex gap-2">
      <div className="px-2.5 py-1 bg-emerald-600/10 text-emerald-400 border border-emerald-500/10 rounded text-[8px] font-black uppercase tracking-widest">
        Neural Link: Active
      </div>
    </div>
  </div>

  {/* Messages */}
  <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
    {messages.map((msg, i) => (
      <div key={i} className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start animate-in fade-in duration-300")}>
        <div className={cn("flex gap-4 max-w-[85%]", msg.role === "user" ? "flex-row-reverse" : "flex-row")}>
          <div className={cn(
            "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center shadow-md",
            msg.role === "user" ? "bg-slate-800 border border-slate-700" : "bg-emerald-600 shadow-emerald-900/20"
          )}>
            {msg.role === "user" ? <User size={16} className="text-slate-300" /> : <Bot size={16} className="text-white" />}
          </div>
          <div className="space-y-3">
            <div className={cn(
              "p-4 rounded-xl",
              msg.role === "user" ? "bg-slate-800 text-slate-100 rounded-tr-none border border-slate-700/50" : "bg-white/5 border border-white/5 rounded-tl-none text-slate-200"
            )}>
              <p className="text-xs font-semibold leading-relaxed whitespace-pre-wrap">{msg.content}</p>
            </div>

            {/* Question Generation View */}
            {msg.intent === "question_generation" && testConfig && i === messages.length - 1 && (
              <div className="p-4 bg-slate-900 border border-emerald-500/20 rounded-xl space-y-4 shadow-xl animate-in zoom-in-95 duration-300">
                <div className="flex items-center justify-between pb-2 border-b border-white/5">
                  <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Test Configuration</h4>
                  <span className="px-2 py-0.5 bg-emerald-500/10 rounded text-[8px] font-black text-emerald-400 uppercase">{testConfig.questions.length} Items</span>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <div className="space-y-1">
                    <label className="text-[8px] font-bold text-slate-500 uppercase">Title</label>
                    <input 
                      type="text" 
                      className="w-full bg-slate-950 border border-white/5 rounded-lg px-3 py-2 text-xs font-semibold focus:border-emerald-500 transition-all outline-none"
                      value={testConfig.title}
                      onChange={(e) => setTestConfig({...testConfig, title: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[8px] font-bold text-slate-500 uppercase">Department</label>
                    <select 
                      className="w-full bg-slate-950 border border-white/5 rounded-lg px-3 py-2 text-xs font-semibold focus:border-emerald-500 transition-all outline-none"
                      value={testConfig.department}
                      onChange={(e) => setTestConfig({...testConfig, department: e.target.value})}
                    >
                      <option value="CSE">Computer Science</option>
                      <option value="ECE">Electronics (ECE)</option>
                      <option value="IT">Info Tech</option>
                    </select>
                  </div>
                </div>

                <Button 
                  onClick={handleCreateAndAssign}
                  disabled={isAssigning}
                  className="w-full h-9 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all font-black uppercase tracking-widest text-[9px] shadow-lg shadow-emerald-900/20 disabled:opacity-50 border-none"
                >
                  {isAssigning ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Target className="w-3.5 h-3.5" />}
                  Execute Live Assignment
                </Button>
              </div>
            )}

            {/* Suggestions */}
            {msg.role === "ai" && msg.suggestions && msg.suggestions.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {msg.suggestions.map((s, idx) => (
                  <button 
                    key={idx}
                    onClick={() => handleSend(s)}
                    className="px-3 py-1 bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/10 rounded-full text-[9px] font-black text-emerald-400 transition-all active:scale-95"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    ))}
    {loading && (
      <div className="flex justify-start">
        <div className="flex gap-3 items-center pl-1">
          <div className="w-8 h-8 rounded-lg bg-emerald-950/40 border border-emerald-500/10 flex items-center justify-center animate-pulse">
            <Brain size={16} className="text-emerald-500/40" />
          </div>
          <div className="flex gap-1">
            {[0, 1, 2].map(i => (
              <div key={i} className={`w-1 h-1 bg-emerald-500 rounded-full animate-bounce [animation-delay:${-0.3 + i * 0.15}s]`} />
            ))}
          </div>
        </div>
      </div>
    )}
    <div ref={chatEndRef} />
  </div>

  {/* Input Area */}
  <div className="p-6 bg-slate-900/60 border-t border-white/5 space-y-4">
    <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
      {[
        "10 MCQs on DBMS",
        "ECE 3rd Year rankings",
        "Python Loops test",
        "Evaluate pending",
        "Attendance CSE vs IT"
      ].map((s, i) => (
        <button 
          key={i} 
          onClick={() => handleSend(s)}
          className="whitespace-nowrap px-3 py-1.5 bg-slate-950/50 border border-white/5 rounded-lg text-[9px] font-bold text-slate-400 hover:text-white hover:border-white/10 transition-all uppercase"
        >
          {s}
        </button>
      ))}
    </div>

    <div className="flex items-center gap-3 bg-slate-950 rounded-xl border border-white/5 focus-within:border-emerald-500/50 p-1.5 pl-4 transition-all shadow-inner">
      <input
        type="text"
        className="flex-1 bg-transparent border-none focus:outline-none text-xs font-semibold text-slate-100 placeholder:text-slate-600"
        placeholder="Deploy agent... (e.g., '10 MCQ for Java')"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
      />
      <button 
        onClick={() => handleSend()}
        className="w-8 h-8 bg-emerald-600 hover:bg-emerald-50 text-emerald-900 hover:text-emerald-900 rounded-lg flex items-center justify-center transition-all bg-emerald-600 text-white"
      >
        <Send size={16} />
      </button>
    </div>
  </div>
 </div>
 );
}
