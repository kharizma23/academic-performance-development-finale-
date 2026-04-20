"use client";

import React, { useState, useEffect } from "react";
import { BookOpen, Clock, CheckCircle, AlertCircle, Play, Send, ChevronRight, Brain, Sparkles } from "lucide-react";

interface Question {
 id: string | number;
 question: string;
 type: "MCQ" | "2-mark";
 options?: string[];
}

interface Test {
 submission_id: string;
 test_id: string;
 title: string;
 subject: string;
 questions_count: number;
 status: string;
 score?: number;
}

export default function StudentExam({ studentId }: { studentId: string }) {
 const [tests, setTests] = useState<Test[]>([]);
 const [activeTest, setActiveTest] = useState<any>(null);
 const [answers, setAnswers] = useState<Record<string, string>>({});
 const [isSubmitting, setIsSubmitting] = useState(false);
 const [view, setView] = useState<"list" | "exam" | "result">("list");
 const [loading, setLoading] = useState(true);

 const API_BASE = "http://localhost:5000/api";

 useEffect(() => {
 fetchTests();
 }, [studentId]);

 const fetchTests = async () => {
 try {
 const res = await fetch(`${API_BASE}/test/student/${studentId}`);
 const data = await res.json();
 setTests(data);
 } catch (err) {
 console.error(err);
 } finally {
 setLoading(false);
 }
 };

 const startTest = async (testId: string) => {
 setLoading(true);
 try {
 const res = await fetch(`${API_BASE}/test/details/${testId}`);
 const data = await res.json();
 setActiveTest(data);
 setView("exam");
 setAnswers({});
 } catch (err) {
 console.error(err);
 } finally {
 setLoading(false);
 }
 };

 const handleAnswerChange = (qId: string | number, value: string) => {
 setAnswers(prev => ({ ...prev, [String(qId)]: value }));
 };

 const submitTest = async () => {
 if (!activeTest) return;
 setIsSubmitting(true);
 try {
 const res = await fetch(`${API_BASE}/test/submit`, {
 method: "POST",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify({
 test_id: activeTest.id,
 student_id: studentId,
 answers: answers
 }),
 });
 const data = await res.json();
 if (data.submission_id) {
 setView("result");
 fetchTests(); // Refresh list
 }
 } catch (err) {
 console.error(err);
 alert("Submission failed.");
 } finally {
 setIsSubmitting(false);
 }
 };

 if (loading && view === "list") {
 return (
 <div className="flex items-center justify-center h-64">
 <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
 </div>
 );
 }

 if (view === "exam" && activeTest) {
 return (
 <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
 <div className="flex items-center justify-between bg-slate-900/50 p-6 rounded-3xl border border-white/5 backdrop-blur-xl">
 <div>
 <h2 className="text-2xl font-black text-white ">{activeTest.title}</h2>
 <p className="text-emerald-400 font-bold uppercase tracking-widest text-[10px]">{activeTest.subject}</p>
 </div>
 <div className="flex items-center gap-4">
 <div className="px-4 py-2 bg-white/5 rounded-2xl flex items-center gap-2 border border-white/5">
 <Clock size={16} className="text-slate-400" />
 <span className="text-white font-mono font-bold">45:00</span>
 </div>
 </div>
 </div>

 <div className="space-y-6">
 {activeTest.questions.map((q: any, idx: number) => (
 <div key={q.id} className="p-8 bg-slate-900/30 rounded-[2rem] border border-white/5 hover:border-emerald-500/20 transition-all group">
 <div className="flex gap-6">
 <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-black text-sm">
 {idx + 1}
 </div>
 <div className="flex-1 space-y-6">
 <p className="text-lg font-medium text-slate-100">{q.question}</p>
 
 {q.options ? (
 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
 {q.options.map((opt: string) => (
 <button
 key={opt}
 onClick={() => handleAnswerChange(q.id, opt)}
 className={`p-4 rounded-2xl text-left text-sm font-semibold transition-all border ${
 answers[String(q.id)] === opt 
 ? "bg-emerald-600 border-emerald-400 text-white shadow-lg shadow-emerald-500/20 scale-[1.02]" 
 : "bg-slate-950/50 border-white/5 text-slate-400 hover:border-white/20 hover:text-white"
 }`}
 >
 {opt}
 </button>
 ))}
 </div>
 ) : (
 <textarea
 className="w-full bg-slate-950/50 border border-white/5 rounded-2xl p-4 text-slate-100 focus:border-emerald-500 outline-none h-32 transition-all"
 placeholder="Write your explanation here..."
 value={answers[String(q.id)] || ""}
 onChange={(e) => handleAnswerChange(q.id, e.target.value)}
 />
 )}
 </div>
 </div>
 </div>
 ))}
 </div>

 <div className="flex justify-end pt-8">
 <button
 onClick={submitTest}
 disabled={isSubmitting}
 className="px-10 py-5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-3xl font-black uppercase tracking-widest text-[13px] shadow-2xl shadow-emerald-900/30 transition-all active:scale-95 flex items-center gap-3 disabled:opacity-50"
 >
 {isSubmitting ? "Uploading Answers..." : <><Send size={20} /> Finalize Submission</>}
 </button>
 </div>
 </div>
 );
 }

 if (view === "result") {
 return (
 <div className="max-w-2xl mx-auto text-center space-y-8 animate-in zoom-in-95 duration-700 py-12">
 <div className="w-24 h-24 bg-emerald-600/20 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-8 relative">
 <CheckCircle className="w-12 h-12 text-emerald-400" />
 <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full animate-pulse" />
 </div>
 <h2 className="text-4xl font-black text-white ">Test Completed!</h2>
 <p className="text-slate-400 text-lg">Your answers have been securely uploaded to the neural cloud. AI evaluation is in progress.</p>
 
 <div className="p-8 bg-slate-900/50 rounded-[2.5rem] border border-white/5 backdrop-blur-3xl space-y-4">
 <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Notification</p>
 <p className="text-white font-medium ">"Once evaluated by our AI Academic Assistant, your scores and personalized feedback will appear on your dashboard."</p>
 </div>

 <button
 onClick={() => setView("list")}
 className="px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 rounded-2xl text-white font-bold transition-all"
 >
 Return to Module List
 </button>
 </div>
 );
 }

 return (
 <div className="space-y-10">
 <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-10 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden group">
 <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[100px] group-hover:bg-emerald-500/10 transition-all" />
 <div className="flex items-center justify-between relative z-10">
 <div className="space-y-4">
 <div className="flex items-center gap-3">
 <div className="p-2 bg-emerald-500/20 rounded-xl">
 <Brain size={24} className="text-emerald-400" />
 </div>
 <h2 className="text-3xl font-black text-white  ">Neuro-Assessment Terminal</h2>
 </div>
 <p className="text-slate-400 max-w-md font-medium">Access your assigned AI-powered examinations and track your performance progression.</p>
 </div>
 <div className="flex flex-col items-end gap-2">
 <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Global Status</span>
 <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center gap-2">
 <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
 <span className="text-xs font-bold text-emerald-400">Exam Window Open</span>
 </div>
 </div>
 </div>
 </div>

 <div className="grid grid-cols-1 gap-6">
 {tests.length === 0 ? (
 <div className="p-20 text-center bg-slate-900/20 rounded-[3rem] border border-dashed border-white/10">
 <BookOpen className="w-16 h-16 text-slate-700 mx-auto mb-6" />
 <p className="text-slate-500 font-bold uppercase tracking-widest">No active assessments found in your neural queue.</p>
 </div>
 ) : (
 tests.map((test) => (
 <div key={test.test_id} className="group relative">
 <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 to-teal-600/10 opacity-0 group-hover:opacity-100 transition-all rounded-[2.5rem] blur-xl" />
 <div className={`p-8 bg-slate-900/40 rounded-[2.5rem] border border-white/5 flex items-center justify-between transition-all group-hover:shadow-2xl group-hover:bg-slate-900/60 relative z-10 ${test.status === "Evaluated" ? "border-emerald-500/30" : ""}`}>
 <div className="flex gap-8 items-center">
 <div className={`w-20 h-20 rounded-3xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 ${test.status === "Evaluated" ? "bg-emerald-600" : "bg-slate-800"}`}>
 <Sparkles size={32} className="text-white" />
 </div>
 <div className="space-y-2">
 <div className="flex items-center gap-3">
 <h3 className="text-xl font-black text-white ">{test.title}</h3>
 <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase  ${
 test.status === "Pending" ? "bg-blue-500/10 text-blue-400" : 
 test.status === "Submitted" ? "bg-amber-500/10 text-amber-400" : 
 "bg-emerald-500/10 text-emerald-400"
 }`}>
 {test.status}
 </span>
 </div>
 <div className="flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
 <span className="flex items-center gap-2"><Layers size={14} /> {test.subject}</span>
 <span className="w-1.5 h-1.5 bg-slate-700 rounded-full" />
 <span className="flex items-center gap-2"><Target size={14} /> {test.questions_count} Units</span>
 </div>
 </div>
 </div>

 <div className="flex flex-col items-end gap-3">
 {test.status === "Pending" ? (
 <button
 onClick={() => startTest(test.test_id)}
 className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl flex items-center gap-3 transition-all font-black uppercase tracking-widest text-[11px] shadow-lg shadow-emerald-500/20 active:scale-95"
 >
 <Play size={16} /> Activate Link
 </button>
 ) : test.status === "Evaluated" ? (
 <div className="text-right">
 <p className="text-slate-500 font-bold uppercase text-[10px] mb-1">Final Neuro-Score</p>
 <div className="text-4xl font-black text-emerald-400  shadow-emerald-400/20 drop-shadow-xl">{test.score}</div>
 </div>
 ) : (
 <div className="px-6 py-3 bg-white/5 rounded-2xl text-[10px] font-black text-slate-500 uppercase tracking-widest">
 Awaiting AI Node Processing
 </div>
 )}
 {test.status === "Evaluated" && (
 <button className="text-emerald-400/60 hover:text-emerald-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-colors">
 View Feedback Log <ChevronRight size={12} />
 </button>
 )}
 </div>
 </div>
 </div>
 ))
 )}
 </div>
 </div>
 );
}

// Sub-components as needed or icons
const Layers = ({ size, className }: { size: number, className?: string }) => <BookOpen size={size} className={className} />;
const Target = ({ size, className }: { size: number, className?: string }) => <AlertCircle size={size} className={className} />;
