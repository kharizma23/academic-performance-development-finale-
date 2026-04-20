"use client"

import { Suspense, useState, useRef, useEffect, useCallback } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Lock, Mail, Loader2, ArrowRight, ShieldCheck, Mic, CheckCircle2, Volume2, ThumbsUp, Eye, EyeOff, Camera, ChevronLeft, Hexagon, GraduationCap, Lightbulb, Atom, Globe, BookOpen, Search, Smartphone, QrCode } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"

function AnimatedBackground() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null
  const nodes = [
    { id: 1, Icon: GraduationCap, x: 60, y: 15, size: 120 },
    { id: 2, Icon: Lightbulb, x: 90, y: 20, size: 80 },
    { id: 3, Icon: Atom, x: 80, y: 40, size: 90 },
    { id: 4, Icon: Globe, x: 10, y: 65, size: 100 },
    { id: 5, Icon: BookOpen, x: 18, y: 88, size: 130 },
    { id: 6, Icon: Search, x: 50, y: 95, size: 110 },
  ]
  const connections = [ { from: 1, to: 2 }, { from: 1, to: 3 }, { from: 4, to: 5 }, { from: 5, to: 6 } ]

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none bg-[#FAFAF5]">
      <svg className="absolute inset-0 w-full h-full opacity-10">
        {connections.map((conn, i) => {
          const fromNode = nodes.find(n => n.id === conn.from); const toNode = nodes.find(n => n.id === conn.to)
          if (!fromNode || !toNode) return null
          return <motion.line key={i} x1={`${fromNode.x}%`} y1={`${fromNode.y}%`} x2={`${toNode.x}%`} y2={`${toNode.y}%`} stroke="#556B2F" strokeWidth="2" />
        })}
      </svg>
      {nodes.map((node) => (
        <motion.div key={node.id} className="absolute flex items-center justify-center rounded-full border border-blue-200 bg-blue-50/60 backdrop-blur-sm" style={{ width: node.size, height: node.size, left: `${node.x}%`, top: `${node.y}%` }} animate={{ y: [-10, 10, -10] }} transition={{ duration: 5, repeat: Infinity }}>
          {node.Icon && <node.Icon className="text-blue-600 opacity-60" style={{ width: '40%', height: '40%' }} />}
        </motion.div>
      ))}
    </div>
  )
}

function LoginContent() {
  const searchParams = useSearchParams(); 
  const role = searchParams.get("role") || "student"; 
  const router = useRouter()
  
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState(""); 
  const [showPassword, setShowPassword] = useState(false); 
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState<string | null>(null)
  const [show2FA, setShow2FA] = useState(false); 
  const [chosenMethod, setChosenMethod] = useState<any>(null); 

  const getApiUrl = useCallback((p: string) => {
    const envUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8001';
    return `${envUrl}${p}`;
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setLoading(true); 
    setError(null);
    const lowerEmail = email.toLowerCase();
    
    // REMOVED CLIENT-SIDE HARDCODED BYPASS TO FORCE REAL JWT GENERATION
    
    try {

      const res = await fetch(getApiUrl('/auth/token'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ username: email.toLowerCase(), password })
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('token', data.access_token);
        const meRes = await fetch(getApiUrl('/users/me'), { headers: { Authorization: `Bearer ${data.access_token}` } });
        const meData = meRes.ok ? await meRes.json() : { role };
        // Normalize role to lowercase to avoid redirection or lookup failures
        const normalizedRole = meData.role.toLowerCase();
        localStorage.setItem('role', normalizedRole);
        router.push(`/${normalizedRole}`);
      } else {
        setError("IDENTITY NOT RECOGNIZED");
      }
    } catch (err) {
      setError("SERVER UNREACHABLE");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAF5] p-6 relative overflow-hidden">
      <AnimatedBackground />
      <div className="relative w-full max-w-md z-10 animate-in fade-in zoom-in duration-1000">
        <div className="bg-white/95 backdrop-blur-3xl p-8 lg:p-12 rounded-3xl border border-blue-100 shadow-xl space-y-8">
          <div className="text-center">
            <div className="h-12 w-12 mx-auto bg-blue-50 rounded-xl flex items-center justify-center mb-4 border border-blue-100 shadow-sm">
              <GraduationCap className="h-6 w-6 text-blue-600" />
            </div>
            <h1 className="text-2xl font-black text-blue-900 uppercase">Scholar <span className="text-blue-600">Sync</span></h1>
            <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest opacity-60">Authorized Entry Node</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl text-rose-600 text-[10px] font-black uppercase text-center">{error}</div>}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-blue-700 uppercase tracking-widest ml-1 opacity-60 flex items-center gap-2"><Mail className="h-3 w-3" /> Identity</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full h-12 bg-gray-50 border border-gray-200 text-blue-900 text-sm font-bold rounded-xl px-4 focus:border-blue-500 outline-none transition-all" placeholder="user@college.edu" required />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-blue-700 uppercase tracking-widest ml-1 opacity-60 flex items-center gap-2"><Lock className="h-3 w-3" /> Pin-Key</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} className="w-full h-12 bg-gray-50 border border-gray-200 text-blue-900 text-sm font-bold rounded-xl px-4 focus:border-blue-500 outline-none transition-all" placeholder="••••••••" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
              </div>
            </div>
            <Button type="submit" disabled={loading} className="w-full h-14 bg-blue-600 hover:bg-black text-white text-xs font-black uppercase tracking-widest rounded-xl shadow-lg group border-none">
              {loading ? <Loader2 className="h-5 w-5 animate-spin mx-auto text-white" /> : <div className="flex items-center justify-center gap-2">Initialize Session <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" strokeWidth={3} /></div>}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() { return <Suspense fallback={<div className="h-screen bg-[#FAFAF5] flex items-center justify-center">Loading...</div>}><LoginContent /></Suspense> }
