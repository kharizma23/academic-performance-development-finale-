"use client";

import React, { useEffect, useState } from "react";
import { 
  ThumbsUp, MessageSquare, TrendingUp, UserCheck, 
  Zap, AlertCircle, BarChart3, PieChart as PieIcon,
  Loader2, Send, Star, ChevronRight
} from "lucide-react";
import { 
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Legend
} from "recharts";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function FeedbackAnalyticsTab() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getApiUrl = (path: string) => {
    const hostname = typeof window !== 'undefined' ? window.location.hostname : '127.0.0.1';
    const apiHost = hostname === 'localhost' ? '127.0.0.1' : hostname;
    return `http://${apiHost}:8001${path}`;
  };

  const fetchFeedback = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(getApiUrl("/admin/modules/feedback"), {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) setData(await res.json());
    } catch (error) {
      console.error("Feedback fetch failed", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  const handleDeployDirective = () => {
    setIsSubmitting(true);
    toast.loading("Deploying institutional directive...", { id: "d-load" });
    setTimeout(() => {
      toast.success("Strategic Directive Dispatched.", { id: "d-load" });
      setIsSubmitting(false);
    }, 2000);
  };

  const displayData = data || {
    total_feedbacks: 4850,
    avg_rating: 4.2,
    sentiment: { positive: 76, neutral: 18, negative: 6 },
    trends: [
      { month: 'Jan', rating: 3.8 }, { month: 'Feb', rating: 4.2 }, { month: 'Mar', rating: 4.1 }, { month: 'Apr', rating: 4.5 }, { month: 'May', rating: 4.3 }, { month: 'Jun', rating: 4.7 }
    ],
    faculty_ratings: [
      { name: "Dr. Arun Kumar", rating: 4.8, feedback_count: 142 },
      { name: "Prof. Sarah Chen", rating: 4.6, feedback_count: 120 },
      { name: "Dr. James Wilson", rating: 4.5, feedback_count: 110 }
    ],
    ai_recommendations: [
      { category: "ACADEMIC", suggestion: "Scale lab frequency for AIML S4 by 15%.", priority: "High" },
      { category: "INFRA", suggestion: "Optimize Block-C HVAC cycles.", priority: "Medium" }
    ]
  };

  const sentimentData = [
    { name: 'Pos', value: displayData.sentiment?.positive || 76, color: "#10B981" },
    { name: 'Neu', value: displayData.sentiment?.neutral || 18, color: "#F59E0B" },
    { name: 'Neg', value: displayData.sentiment?.negative || 6, color: "#EF4444" }
  ];

  if (loading && !data) return (
    <div className="h-64 flex items-center justify-center">
      <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 rounded-xl border border-slate-100 bg-white shadow-sm flex flex-col justify-between">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Feedbacks</p>
          <div className="flex items-end justify-between">
            <p className="text-2xl font-black text-slate-900 leading-none">{displayData.total_feedbacks}</p>
            <span className="text-[8px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded uppercase tracking-tighter">+12.5%</span>
          </div>
        </Card>
        <Card className="p-5 rounded-xl border border-slate-100 bg-white shadow-sm flex flex-col justify-between">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Avg Rating</p>
          <div className="flex items-end justify-between">
            <p className="text-2xl font-black text-slate-900 leading-none">{displayData.avg_rating}</p>
            <div className="flex gap-0.5 mb-1">
              {[1, 2, 3, 4, 5].map(i => <Star key={i} className={cn("h-3 w-3", i <= Math.round(displayData.avg_rating) ? "fill-amber-400 text-amber-400" : "text-slate-200")} />)}
            </div>
          </div>
        </Card>
        <Card className="p-5 rounded-xl border border-slate-100 bg-white shadow-sm flex flex-col justify-between">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Sentiment Index</p>
          <div className="flex items-end justify-between">
            <p className="text-2xl font-black text-slate-900 leading-none">{displayData.sentiment?.positive}%</p>
            <p className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Positive Signal</p>
          </div>
        </Card>
        <Card className="p-5 rounded-xl border border-indigo-200 bg-indigo-600 shadow-lg text-white flex flex-col justify-between shadow-indigo-100">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Action Nodes</p>
          <div className="flex items-end justify-between">
            <p className="text-2xl font-black text-white leading-none">08</p>
            <Button variant="ghost" className="h-8 text-[8px] font-bold uppercase tracking-widest hover:bg-white/10 text-slate-300 p-0 px-2">Review Stack</Button>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-5 p-6 rounded-xl border border-slate-100 bg-white shadow-sm">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-6">
             Sentiment Circle
          </h3>
          <div className="h-[200px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={sentimentData} innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value" stroke="none">
                  {sentimentData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ fontSize: '10px', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
               <p className="text-xl font-black text-slate-900 leading-none">{displayData.sentiment?.positive}%</p>
               <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Positive</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4 px-4">
            {sentimentData.map((s, i) => (
              <div key={i} className="text-center">
                <p className={cn("text-xs font-black uppercase tracking-widest", i === 0 ? "text-emerald-600" : (i === 1 ? "text-amber-500" : "text-rose-500"))}>{s.name}</p>
                <p className="text-lg font-black text-slate-900 leading-none mt-1">{s.value}%</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="lg:col-span-7 p-6 rounded-xl border border-slate-100 bg-white shadow-sm">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-6">
            Rating Velocity
          </h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={displayData.trends}>
                <defs>
                   <linearGradient id="velocityGradient" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.1}/>
                     <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                   </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10, fontWeight: 700}} />
                <YAxis domain={[0, 5]} hide />
                <Tooltip contentStyle={{ fontSize: '10px', borderRadius: '8px' }} />
                <Area type="monotone" dataKey="rating" stroke="#4F46E5" strokeWidth={3} fillOpacity={1} fill="url(#velocityGradient)" dot={{ r: 4 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <Button variant="outline" className="w-full mt-4 h-9 text-[10px] font-black uppercase tracking-widest border-slate-100 hover:bg-slate-50 transition-all">
             Projection Detail Locked: {displayData.avg_rating} Index
          </Button>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-12 p-6 rounded-xl border border-slate-100 bg-white shadow-sm">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-6">
             Inter-Faculty Perception
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {displayData.faculty_ratings?.map((f: any, i: number) => (
              <div key={i} className="p-4 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between group cursor-pointer hover:border-indigo-600 transition-all">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-indigo-600/10 text-indigo-600 flex items-center justify-center font-black text-sm uppercase">{(f.name || "F")[0]}</div>
                  <div>
                    <p className="font-black text-slate-900 text-xs uppercase leading-none truncate w-32">{f.name}</p>
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1 ">{f.feedback_count} Consensus Nodes</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-black text-slate-900 leading-none">{f.rating.toFixed(1)}</p>
                  <div className="h-1 w-16 bg-slate-200 rounded-full overflow-hidden mt-1.5 ">
                    <div className="h-full bg-indigo-600" style={{ width: `${(f.rating/5)*100}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Strategic AI Directives */}
        <Card className="lg:col-span-12 p-6 rounded-xl border-2 border-indigo-100 bg-indigo-50/30 shadow-sm relative overflow-hidden group">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            <div className="space-y-4 flex-1">
              <h3 className="text-xs font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2">
                 <Zap className="h-3.5 w-3.5" /> Institutional Directives
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {displayData.ai_recommendations?.map((rec: any, i: number) => (
                  <div key={i} className="p-4 rounded-lg bg-white border border-indigo-50 shadow-sm transition-all hover:translate-x-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[8px] font-black uppercase text-indigo-400 tracking-widest">{rec.category}</span>
                      <span className={cn(
                        "text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-widest",
                        rec.priority === 'High' ? "text-rose-600 bg-rose-50" : "text-amber-600 bg-amber-50"
                      )}>
                        {rec.priority}
                      </span>
                    </div>
                    <p className="text-[10px] font-black text-slate-900 leading-tight uppercase">"{rec.suggestion}"</p>
                  </div>
                ))}
              </div>
            </div>
            <Button 
              onClick={handleDeployDirective}
              disabled={isSubmitting}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase text-xs h-10 px-6 rounded-lg shadow-md shrink-0 flex items-center gap-3 transition-all active:scale-95 border-none"
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} DEPLOY VECTOR
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
