"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { GraduationCap, Lock, Mail, Loader2, ArrowRight, ShieldCheck, UserPlus, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function RegisterPage() {
 const router = useRouter()

 const [email, setEmail] = useState("")
 const [password, setPassword] = useState("")
 const [confirmPassword, setConfirmPassword] = useState("")
 const [loading, setLoading] = useState(false)
 const [error, setError] = useState<string | null>(null)
 const [success, setSuccess] = useState(false)

 const getApiUrl = (path: string) => {
 return `http://127.0.0.1:8000${path}`;
 };

 const handleRegister = async (e: React.FormEvent) => {
 e.preventDefault()
 setLoading(true)
 setError(null)

 if (password !== confirmPassword) {
 setError("Passwords do not match.")
 setLoading(false)
 return
 }

 try {
 const response = await fetch(getApiUrl('/users/'), {
 method: 'POST',
 headers: {
 'Content-Type': 'application/json',
 },
 body: JSON.stringify({
 email: email,
 password: password,
 role: "student" // Backend will override this based on domain
 }),
 })

 const data = await response.json()

 if (response.ok) {
 setSuccess(true)
 setTimeout(() => {
 router.push("/login")
 }, 2000)
 } else {
 setError(data.detail || "Registration failed. Please try again.")
 }
 } catch (err) {
 console.error("Registration Error:", err)
 setError("Server unreachable. Please ensure the backend is running.")
 } finally {
 setLoading(false)
 }
 }

 if (success) {
 return (
 <div className="flex min-h-screen items-center justify-center bg-background p-4">
 <Card className="w-full max-w-md glass-card text-center p-8 space-y-6">
 <div className="mx-auto p-4 rounded-full bg-emerald-500/10 w-fit">
 <ShieldCheck className="h-12 w-12 text-emerald-500 shrink-0" />
 </div>
 <CardTitle className="text-5xl font-black  uppercase">Registration Successful!</CardTitle>
 <p className="text-lg text-muted-foreground uppercase tracking-widest mt-2 font-bold">Your account has been created. Redirecting to login...</p>
 <Loader2 className="h-8 w-8 mt-4 mx-auto animate-spin text-primary" />
 </Card>
 </div>
 )
 }

 return (
 <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-8 selection:bg-black/10 relative">
 <Link href="/" className="fixed top-8 left-20 z-50">
 <Button variant="outline" size="icon" className="h-32 w-32 shrink-0 border-4 border-black bg-white hover:bg-zinc-100 rounded-2xl transition-all group shadow-2xl">
 <ArrowLeft className="h-16 w-16 shrink-0 text-black group-hover:scale-110 transition-transform" />
 </Button>
 </Link>
 <Card className="w-full max-w-4xl z-10 bg-white border-[4px] border-black rounded-[3rem] shadow-[0_0_100px_rgba(0,0,0,0.1)] overflow-hidden">
 <CardHeader className="space-y-8 pb-12 text-center border-b-[4px] border-black pt-16">
 <div className="mx-auto p-6 bg-black rounded-[2rem] w-fit">
 <UserPlus className="h-16 w-16 shrink-0 text-white" />
 </div>
 <div>
 <CardTitle className="text-[6rem] md:text-5xl font-black tracking-normal uppercase mb-4 leading-none text-black">Create Account</CardTitle>
 <CardDescription className="text-2xl font-black uppercase tracking-[0.3em] mt-4 text-slate-500">
 Academic Intelligence Network
 </CardDescription>
 </div>
 </CardHeader>
 <CardContent className="pt-8 px-8">
 <form onSubmit={handleRegister} className="grid gap-6">
 {error && (
 <div className="bg-rose-50 border-2 border-rose-500 p-4 flex items-center gap-4 text-rose-600 font-bold text-lg uppercase ">
 <ShieldCheck className="h-5 w-5 shrink-0" />
 {error}
 </div>
 )}
 <div className="grid gap-4">
 <label className="text-xl font-black text-black uppercase tracking-widest ml-1">Academic Email</label>
 <div className="relative group">
 <Mail className="absolute left-6 top-1/2 -translate-y-1/2 h-8 w-8 text-slate-300 group-focus-within:text-black transition-colors shrink-0" />
 <input
 type="email"
 value={email}
 onChange={(e) => setEmail(e.target.value)}
 placeholder="yourid@university.edu"
 className="flex h-24 w-full border-[3px] border-black bg-white pl-20 pr-6 text-3xl font-black uppercase focus:outline-none focus:bg-zinc-50 transition-all placeholder:text-slate-200"
 required
 />
 </div>
 <p className="text-lg font-black text-slate-400 uppercase tracking-widest ml-1 mt-2">Use @faculty.com for staff access.</p>
 </div>
 <div className="grid gap-4">
 <label className="text-xl font-black text-black uppercase tracking-widest ml-1">Secure Pass-Key</label>
 <div className="relative group">
 <Lock className="absolute left-6 top-1/2 -translate-y-1/2 h-8 w-8 text-slate-300 group-focus-within:text-black transition-colors" />
 <input
 type="password"
 value={password}
 onChange={(e) => setPassword(e.target.value)}
 placeholder="••••••••"
 className="flex h-24 w-full border-[3px] border-black bg-white pl-20 pr-6 text-4xl font-black tracking-[1em] focus:outline-none focus:bg-zinc-50 transition-all placeholder:text-slate-200"
 required
 />
 </div>
 </div>
 <div className="grid gap-4">
 <label className="text-xl font-black text-black uppercase tracking-widest ml-1">Identity Confirmation</label>
 <div className="relative group">
 <Lock className="absolute left-6 top-1/2 -translate-y-1/2 h-8 w-8 text-slate-300 group-focus-within:text-black transition-colors" />
 <input
 type="password"
 value={confirmPassword}
 onChange={(e) => setConfirmPassword(e.target.value)}
 placeholder="••••••••"
 className="flex h-24 w-full border-[3px] border-black bg-white pl-20 pr-6 text-4xl font-black tracking-[1em] focus:outline-none focus:bg-zinc-50 transition-all placeholder:text-slate-200"
 required
 />
 </div>
 </div>
 <Button
 type="submit"
 className="w-full h-24 mt-8 bg-slate-600 text-white rounded-2xl text-3xl font-black uppercase tracking-[0.2em] hover:bg-slate-600 transition-all flex items-center justify-center gap-8 shadow-[0_20px_50px_rgba(0,0,0,0.1)]"
 disabled={loading}
 >
 {loading ? (
 <Loader2 className="h-10 w-10 animate-spin" />
 ) : (
 <>
 Establish Account
 <ArrowRight className="h-10 w-10 stroke-[4px]" />
 </>
 )}
 </Button>
 </form>
 </CardContent>
 <CardFooter className="flex flex-col gap-8 pb-16 pt-8">
 <div className="text-center text-xl font-black text-slate-500 uppercase tracking-widest">
 Already in network?{" "}
 <Link href="/login" className="text-black font-black hover:underline underline-offset-[12px] decoration-[4px] transition-all">
 Log In
 </Link>
 </div>
 </CardFooter>
 </Card>
 </div>
 )
}
