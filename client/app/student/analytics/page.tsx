"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SkillRadar } from "@/components/SkillRadar"
import { Brain, TrendingUp, AlertTriangle, CheckCircle2, Info, Sparkles, LayoutGrid } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AnalyticsPage() {
 return (
 <div className="flex flex-col gap-12 animate-in p-6 lg:p-12">
 <div className="flex flex-col gap-4">
 <div className="flex items-center gap-6">
 <div className="h-20 w-20 shrink-0 rounded-3xl bg-blue-100 flex items-center justify-center border-2 border-blue-200 shadow-sm">
 <Brain className="h-10 w-10 shrink-0 text-blue-600" />
 </div>
 <h1 className="text-5xl lg:text-7xl font-black tracking-normal text-blue-900 uppercase leading-none">AI Analytics</h1>
 </div>
 <p className="text-sm font-black text-blue-400 uppercase tracking-[0.4em] ml-2">Deep Neural Academic Intelligence Matrix</p>
 </div>

 <div className="grid gap-12 lg:grid-cols-2 mt-8">
 <Card className="bg-white border-[4px] border-blue-200 rounded-[3rem] shadow-sm overflow-hidden">
 <CardHeader className="bg-blue-50 border-b-[4px] border-blue-200 p-8 lg:p-10">
 <div className="flex items-center justify-between">
 <div>
 <CardTitle className="text-4xl font-black flex items-center gap-4 tracking-normal uppercase text-blue-900">
 Skill Gap Analysis
 <Sparkles className="h-8 w-8 shrink-0 text-amber-500 animate-pulse" />
 </CardTitle>
 <CardDescription className="text-xs font-black uppercase tracking-widest text-blue-400 mt-2">
 Current skills vs. &quot;AI Engineer&quot; Industry Benchmarks.
 </CardDescription>
 </div>
 <Button variant="ghost" size="icon" className="rounded-2xl h-12 w-12 bg-white border border-blue-200 text-blue-600">
 <Info className="h-6 w-6 shrink-0" />
 </Button>
 </div>
 </CardHeader>
 <CardContent className="flex justify-center items-center p-8 bg-white">
 <div className="w-full max-w-2xl aspect-square bg-blue-50/50 rounded-full flex items-center justify-center border border-blue-100">
 <SkillRadar />
 </div>
 </CardContent>
 </Card>

 <div className="flex flex-col gap-12">
 <Card className="bg-white border-[4px] border-blue-200 rounded-[3rem] shadow-sm overflow-hidden group relative">
 <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
 <TrendingUp className="h-48 w-48 shrink-0 text-blue-600" />
 </div>
 <CardHeader className="p-8 border-b-2 border-blue-100">
 <CardTitle className="text-3xl font-black tracking-normal uppercase text-blue-900">Performance Stability</CardTitle>
 <CardDescription className="text-[10px] font-black uppercase tracking-widest text-blue-400 mt-1">AI Trend Consistency Matrix</CardDescription>
 </CardHeader>
 <CardContent className="p-8">
 <div className="space-y-6 relative z-10">
 <AnalyticsMetric
 label="Consistency Index"
 value="8.5/10"
 subText="Top 5% of your department"
 icon={LayoutGrid}
 />
 <AnalyticsMetric
 label="Predicted CGPA Drift"
 value="±0.2"
 subText="Stable trajectory confirmed"
 icon={TrendingUp}
 positive
 />
 <div className="p-6 rounded-[2rem] bg-emerald-50 border-2 border-emerald-100 flex gap-6 items-center shadow-sm">
 <div className="p-4 rounded-xl bg-white border border-emerald-200">
 <CheckCircle2 className="h-8 w-8 shrink-0 text-emerald-600" strokeWidth={3} />
 </div>
 <p className="text-sm font-black text-emerald-900 uppercase  leading-tight">
 &quot;Neural Analysis confirms <span className="text-emerald-600">high stability</span>. Risk: <span className="text-emerald-700">Negligible</span>.&quot;
 </p>
 </div>
 </div>
 </CardContent>
 </Card>

 <Card className="bg-white border-[4px] border-amber-200 rounded-[3rem] shadow-sm overflow-hidden border-l-[16px] border-l-amber-500">
 <CardHeader className="p-8">
 <CardTitle className="text-2xl font-black flex items-center gap-4 text-amber-900 uppercase">
 <AlertTriangle className="h-8 w-8 shrink-0 text-amber-500" />
 Risk Prediction
 </CardTitle>
 <CardDescription className="text-[10px] font-black text-amber-700/60 uppercase tracking-widest">Probability of academic challenges</CardDescription>
 </CardHeader>
 <CardContent className="p-8 pt-0">
 <div className="flex items-center gap-8 p-6 bg-amber-50 rounded-2xl border border-amber-100">
 <div className="flex flex-col">
 <div className="text-6xl font-black text-amber-600 tracking-normal leading-none">12%</div>
 <div className="text-[10px] font-black text-amber-700/40 uppercase tracking-[0.2em] mt-2">Total Risk</div>
 </div>
 <div className="flex-1 space-y-4">
 <div className="h-3 w-full bg-amber-100 rounded-full overflow-hidden">
 <div className="h-full bg-amber-500 rounded-full w-[12%] animate-pulse" />
 </div>
 <p className="text-xs font-bold text-amber-800 leading-snug">&quot;Risk factor based on attendance drift detected in week 8.&quot;</p>
 </div>
 </div>
 </CardContent>
 </Card>
 </div>
 </div>
 </div>
 )
}

function AnalyticsMetric({ label, value, subText, icon: Icon, positive }: any) {
 return (
 <div className="flex items-center justify-between group/metric p-4 hover:bg-blue-50 rounded-2xl transition-colors">
 <div className="flex items-center gap-6">
 <div className="p-3 rounded-xl bg-blue-100 group-hover/metric:bg-blue-200 transition-colors border border-blue-200">
 <Icon className="h-6 w-6 shrink-0 text-blue-600" />
 </div>
 <div>
 <div className="text-sm font-black uppercase tracking-widest text-blue-900">{label}</div>
 <div className="text-[10px] font-black text-blue-400 uppercase mt-0.5 tracking-wider">{subText}</div>
 </div>
 </div>
 <div className={`text-3xl font-black tracking-normal ${positive ? 'text-emerald-600' : 'text-blue-900'}`}>
 {value}
 </div>
 </div>
 )
}
