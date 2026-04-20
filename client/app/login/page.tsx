"use client"

import { Suspense, useState, useRef, useEffect, useCallback } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Lock, Mail, Loader2, ArrowRight, ShieldCheck, Mic, CheckCircle2, Volume2, ThumbsUp, Eye, EyeOff, Camera, ChevronLeft, Hexagon, GraduationCap, Lightbulb, Atom, Globe, BookOpen, Search, Smartphone, QrCode } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"

// ──────────────────────────────────────────────
// Educational Network Diagram Background
// ──────────────────────────────────────────────
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

 const connections = [
 { from: 1, to: 2 }, { from: 1, to: 3 }, { from: 4, to: 5 }, { from: 5, to: 6 }
 ]

 return (
 <div className="absolute inset-0 overflow-hidden pointer-events-none bg-[#FAFAF5]">
 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-5" />
 <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-50/50 rounded-full blur-[150px]" />
 <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-slate-100/50 rounded-full blur-[150px]" />

 <svg className="absolute inset-0 w-full h-full opacity-10">
 {connections.map((conn, i) => {
 const fromNode = nodes.find(n => n.id === conn.from)
 const toNode = nodes.find(n => n.id === conn.to)
 if (!fromNode || !toNode) return null
 return (
 <motion.line key={i} x1={`${fromNode.x}%`} y1={`${fromNode.y}%`} x2={`${toNode.x}%`} y2={`${toNode.y}%`} stroke="#556B2F" strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 3, repeat: Infinity }} />
 )
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

function isThumbsUp(landmarks: number[][]): boolean {
 if (!landmarks || landmarks.length < 21) return false
 const [thumbTip, indexTip, middleTip, ringTip, pinkyTip] = [landmarks[4], landmarks[8], landmarks[12], landmarks[16], landmarks[20]]
 const [indexBase, middleBase, ringBase, pinkyBase, wrist] = [landmarks[5], landmarks[9], landmarks[13], landmarks[17], landmarks[0]]
 return thumbTip[1] < wrist[1] - 30 && indexTip[1] > indexBase[1] && middleTip[1] > middleBase[1] && ringTip[1] > ringBase[1] && pinkyTip[1] > pinkyBase[1]
}

function eyeAR(pts: number[][]): number {
 const dist = (a: number[], b: number[]) => Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2))
 return (dist(pts[1], pts[5]) + dist(pts[2], pts[4])) / (2.0 * dist(pts[0], pts[3]))
}

const LEFT_EYE = [362, 385, 387, 263, 373, 380], RIGHT_EYE = [33, 160, 158, 133, 153, 144]
const EAR_CLOSE_THRESH = 0.20, BLINKS_NEEDED = 3

function loadScript(src: string): Promise<void> {
 return new Promise((resolve, reject) => {
 if (document.querySelector(`script[src="${src}"]`)) { resolve(); return }
 const s = document.createElement("script"); s.src = src; s.crossOrigin = "anonymous"; s.onload = () => resolve(); s.onerror = () => reject(new Error(`Failed ${src}`)); document.head.appendChild(s)
 })
}

type Method = "voice" | "thumbsup" | "eyes" | "otp" | "authenticator"

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
 const [chosenMethod, setChosenMethod] = useState<Method | null>(null); 
 const [pendingToken, setPendingToken] = useState<string | null>(null)
 const [status, setStatus] = useState<"idle" | "loading" | "scanning" | "verified" | "error">("idle"); 
 const [statusMsg, setStatusMsg] = useState("")
 const [progress, setProgress] = useState(0); 
 const [isEnrolling, setIsEnrolling] = useState(false)
 const [hasVoice, setHasVoice] = useState(false)
 const [otpCode, setOtpCode] = useState("")
 const [otpSent, setOtpSent] = useState(false)
 const [qrCode, setQrCode] = useState("")
 const [hasTotp, setHasTotp] = useState(false)

 const recognitionRef = useRef<any>(null); 
 const videoRef = useRef<HTMLVideoElement>(null); 
 const streamRef = useRef<MediaStream | null>(null); 
 const mpRef = useRef<any>(null); 
 const mpCamRef = useRef<any>(null); 
 const countRef = useRef(0); 
 const blinkRef = useRef(0); 
 const eyeOpen = useRef(true)

  const getApiUrl = useCallback((p: string) => {
    const envUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8001';
    return `${envUrl}${p}`;
  }, [])

 useEffect(() => {
 if (show2FA && email) {
 fetch(getApiUrl(`/api/voice/verify?identifier=${email}&pcm_data=[]`)).then(r => setHasVoice(r.status !== 404)).catch(() => {})
 fetch(getApiUrl(`/api/totp/check?identifier=${email}`)).then(r => r.json()).then(d => setHasTotp(d.has_totp)).catch(() => {})
 }
 }, [show2FA, email, getApiUrl])
 const stopCamera = () => { if (mpCamRef.current) try { mpCamRef.current.stop() } catch (_) { }; mpCamRef.current = null; if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null } }
 const stopVoice = () => { if (recognitionRef.current) try { recognitionRef.current.stop() } catch (_) { }; recognitionRef.current = null }
 useEffect(() => () => { stopCamera(); stopVoice() }, [])

 const completeLogin = useCallback(() => { stopCamera(); stopVoice(); localStorage.setItem('token', pendingToken!); localStorage.setItem('role', 'admin'); router.push('/admin') }, [pendingToken, router])

 const handleLogin = async (e: React.FormEvent) => {
 e.preventDefault(); setLoading(true); setError(null)
 
 // Institutional Silent Synchronization Node (90s tactical window)
 const fetchWithTimeout = async (url: string, options: RequestInit, timeout = 90000) => {
 const controller = new AbortController();
 const id = setTimeout(() => controller.abort(), timeout);
 try {
 const response = await fetch(url, { ...options, signal: controller.signal });
 clearTimeout(id);
 return response;
 } catch (e: any) {
 clearTimeout(id);
 throw e;
 }
 };

 const tryAuth = async (url: string) => {
 return await fetchWithTimeout(url, { 
 method: 'POST', 
 headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, 
 body: new URLSearchParams({ username: email, password }) 
 }, 90000)
 }

 try {
 // Institutional Silent Warmup Bridge
 try {
 await fetchWithTimeout(getApiUrl('/health'), { method: 'GET' }, 3000);
 } catch (e) { /* Background Warmup: Silently orienting institutional nodes */ }

 let res;
 try {
 res = await tryAuth(getApiUrl('/auth/token'))
 } catch (err: any) {
 // Cascading Loopback Nodes: Direct Neural Handshake (Corrected to 8001)
 try {
 res = await tryAuth(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8001'}/auth/token`)
 } catch (err2) {
 res = await tryAuth(`http://127.0.0.1:8001/auth/token`)
 }
 }
 
 if (!res) {
 // Quiet Persistence Mode: Sustaining the link without error alerts
 setLoading(false);
 return;
 }
 
 if (res.ok) {
 const data = await res.json()
 const meRes = await fetch(getApiUrl('/users/me'), { headers: { Authorization: `Bearer ${data.access_token}` } })
 const meData = meRes.ok ? await meRes.json() : { role }
 localStorage.setItem('token', data.access_token); 
 localStorage.setItem('role', meData.role); 
 router.push(`/${meData.role}`)
 } else {
 const data = await res.json();
 const errorDetail = data.detail;
 const errorMsg = typeof errorDetail === 'string' 
 ? errorDetail 
 : (Array.isArray(errorDetail) ? errorDetail[0]?.msg : JSON.stringify(errorDetail));
 setError(errorMsg || "Identity Conflict — Internal Synchronization Error");
 }
 } catch (err: any) { 
 // Silent Recovery Mode: Preventing informative technical alerts as requested
 console.error("Institutional Link Interrupted.", err);
 } finally { setLoading(false) }
 }

 const startVoice = useCallback(async (enrolling: boolean = false) => {
 setIsEnrolling(enrolling);
 setStatus("loading"); setStatusMsg(enrolling ? "Enrolling Your Voice Profile..." : "Activating Voice Biometrics...");
 setProgress(0);
 
 try {
 const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
 const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
 await audioContext.resume();
 
 const source = audioContext.createMediaStreamSource(stream);
 const processor = audioContext.createScriptProcessor(4096, 1, 1);
 
 let pcmBuffer: number[] = [];
 let isFinalizing = false;

 processor.onaudioprocess = (e) => {
 const input = e.inputBuffer.getChannelData(0);
 for (let i = 0; i < input.length; i++) pcmBuffer.push(input[i]);
 const percent = Math.min(100, (pcmBuffer.length / (16000 * 3)) * 100);
 setProgress(percent);
 if (pcmBuffer.length > 16000 * 3 && !isFinalizing) { // 3 seconds
 isFinalizing = true;
 stopAndVerify();
 }
 };

 const stopAndVerify = async () => {
 source.disconnect(); processor.disconnect();
 stream.getTracks().forEach(t => t.stop());
 setStatus("loading"); setStatusMsg("Analyzing Vocal Identity...");

 try {
 const endpoint = enrolling ? '/api/voice/register' : '/api/voice/verify';
 let res = await fetch(getApiUrl(endpoint), {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({ identifier: email, pcm_data: pcmBuffer })
 });
 
 if (res.ok) {
 const data = await res.json();
 if (enrolling || data.verified) {
 setStatus("verified"); setStatusMsg(enrolling ? "Enrollment Successful!" : "Identity Verified!");
 setHasVoice(true);
 setTimeout(completeLogin, enrolling ? 1500 : 800);
 } else {
 setStatus("error"); setStatusMsg("Voice Signature Mismatch.");
 setProgress(0);
 }
 } else {
 const data = await res.json().catch(() => ({}));
 setStatus("error"); setStatusMsg(data.detail || "Authentication Failure");
 }
 } catch (err) {
 setStatus("error"); setStatusMsg("Neural Link Error");
 }
 };

 source.connect(processor); processor.connect(audioContext.destination);
 setStatus("scanning"); setStatusMsg(`SAY: "OPEN THE DASHBOARD"`);
 } catch (err) {
 setStatus("error"); setStatusMsg("Mic Hardware Error");
 }
 }, [email, completeLogin, getApiUrl]);

 const startWebcam = async () => {
 try { const s = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } }); streamRef.current = s; if (videoRef.current) { videoRef.current.srcObject = s; await videoRef.current.play() } return true }
 catch { setStatus("error"); setStatusMsg("Camera denied."); return false }
 }

 const startThumbsUp = useCallback(async () => {
 setStatus("loading"); setStatusMsg("Loading..."); if (!await startWebcam()) return
 try { await loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js"); await loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js") } catch { setStatus("error"); return }
 const Hands = (window as any).Hands; const Camera = (window as any).Camera; if (!Hands || !Camera) return
 const hands = new Hands({ locateFile: (f: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${f}` }); hands.setOptions({ maxNumHands: 1, modelComplexity: 0, minDetectionConfidence: 0.7 })
 hands.onResults((res: any) => {
 if (res.multiHandLandmarks?.length) {
 const pts = res.multiHandLandmarks[0].map((lm: any) => [lm.x * 640, lm.y * 480]); if (isThumbsUp(pts)) { countRef.current++; if (countRef.current >= 15) { setStatus("verified"); setStatusMsg("Verified!"); stopCamera(); setTimeout(completeLogin, 800) } }
 }
 setProgress(Math.min(100, (countRef.current / 15) * 100))
 }); mpCamRef.current = new Camera(videoRef.current, { onFrame: async () => { if (videoRef.current && hands) await hands.send({ image: videoRef.current }) }, width: 640, height: 480 }); mpCamRef.current.start(); setStatus("scanning")
 }, [completeLogin])

 const startEyes = useCallback(async () => {
 setStatus("loading"); setStatusMsg("Loading..."); if (!await startWebcam()) return
 try { await loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js"); await loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh.js") } catch { setStatus("error"); return }
 const FaceMesh = (window as any).FaceMesh; const Camera = (window as any).Camera; if (!FaceMesh || !Camera) return
 const mesh = new FaceMesh({ locateFile: (f: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${f}` }); mesh.setOptions({ maxNumFaces: 1, refineLandmarks: true, minDetectionConfidence: 0.7 })
 mesh.onResults((res: any) => {
 if (!res.multiFaceLandmarks?.length) return; const lms = res.multiFaceLandmarks[0]; const getP = (idx: number) => [lms[idx].x * 640, lms[idx].y * 480]
 const ear = (eyeAR(LEFT_EYE.map(getP)) + eyeAR(RIGHT_EYE.map(getP))) / 2
 if (ear < EAR_CLOSE_THRESH && eyeOpen.current) eyeOpen.current = false
 else if (ear >= EAR_CLOSE_THRESH && !eyeOpen.current) { eyeOpen.current = true; blinkRef.current++; setStatusMsg(`Blinks: ${blinkRef.current}/3`); if (blinkRef.current >= 3) { setStatus("verified"); setStatusMsg("Verified!"); stopCamera(); setTimeout(completeLogin, 800) } }
 }); mpCamRef.current = new Camera(videoRef.current, { onFrame: async () => { if (videoRef.current && mesh) await mesh.send({ image: videoRef.current }) }, width: 640, height: 480 }); mpCamRef.current.start(); setStatus("scanning")
 }, [completeLogin])

 const startOTP = useCallback(async () => {
 setStatus("loading"); setStatusMsg("Requesting Encrypted OTP...");
 try {
 const res = await fetch(getApiUrl(`/api/otp/send?identifier=${email}&phone=SYNCED_DEVICE`), { method: 'POST' });
 if (res.ok) {
 setOtpSent(true); setStatus("scanning"); setStatusMsg("Enter 6-Digit Sync Code");
 } else {
 setStatus("error"); setStatusMsg("Mobile Network Timeout");
 }
 } catch { setStatus("error"); setStatusMsg("Protocol Bridge Failure"); }
 }, [email, getApiUrl]);

 const handleOtpVerify = async (code: string) => {
 if (code.length !== 6) return;
 setStatus("loading"); setStatusMsg("Verifying Sync Chain...");
 try {
 const res = await fetch(getApiUrl(`/api/otp/verify?identifier=${email}&code=${code}`), { method: 'POST' });
 if (res.ok) {
 setStatus("verified"); setStatusMsg("Sync Complete!");
 setTimeout(completeLogin, 800);
 } else {
 setStatus("error"); setStatusMsg("Invalid Sync Code");
 }
 } catch { setStatus("error"); setStatusMsg("Verification Error"); }
 };

 const startTotp = useCallback(async () => {
 setStatus("loading"); setStatusMsg("Initializing Neural Key...");
 try {
 const res = await fetch(getApiUrl(`/api/totp/setup?identifier=${email}`));
 const data = await res.json();
 if (res.ok) {
 setQrCode(data.qr_code);
 setStatus("scanning");
 setStatusMsg(hasTotp ? "Enter 6-Digit Authenticator Code" : "Scan QR with Google Authenticator");
 } else {
 setStatus("error"); setStatusMsg("Neural Interface Failure");
 }
 } catch { setStatus("error"); setStatusMsg("Protocol Bridge Failure"); }
 }, [email, getApiUrl, hasTotp]);

 const handleTotpVerify = async (code: string) => {
 if (code.length !== 6) return;
 setStatus("loading"); setStatusMsg("Verifying Identity Key...");
 try {
 const res = await fetch(getApiUrl(`/api/totp/verify?identifier=${email}&code=${code}`), { 
 method: 'POST', 
 headers: { 'Content-Type': 'application/json' },
 });
 if (res.ok) {
 setStatus("verified"); setStatusMsg("Identity Confirmed!");
 setTimeout(completeLogin, 800);
 } else {
 setStatus("error"); setStatusMsg("Invalid Authenticator Code");
 }
 } catch { setStatus("error"); setStatusMsg("Verification Error"); }
 };

 const launchMethod = (m: Method) => { setChosenMethod(m); setStatus("idle"); setProgress(0); setOtpCode(""); setOtpSent(false); setQrCode(""); countRef.current = 0; blinkRef.current = 0; eyeOpen.current = true; stopCamera(); stopVoice(); setTimeout(() => { if (m === "voice") startVoice(false); if (m === "otp") startOTP(); if (m === "authenticator") startTotp(); if (m === "thumbsup") startThumbsUp(); if (m === "eyes") startEyes() }, 100) }
 const goBackToChooser = () => { stopCamera(); stopVoice(); setChosenMethod(null); setStatus("idle") }
 const cancel2FA = () => { stopCamera(); stopVoice(); setShow2FA(false); setChosenMethod(null); setPendingToken(null) }
 const needsCamera = chosenMethod === "thumbsup" || chosenMethod === "eyes"

 return (
 <div className="min-h-screen flex items-center justify-center bg-[#FAFAF5] p-6 font-sans relative overflow-hidden">
 <AnimatedBackground />
 
 <Link href="/" className="absolute top-6 left-6 z-50 flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-all bg-blue-50 p-4 rounded-2xl border border-blue-100 backdrop-blur-md">
 <ChevronLeft className="h-6 w-6" strokeWidth={3} />
 <span className="text-sm font-black uppercase tracking-widest hidden sm:block">Back</span>
 </Link>

 <div className="relative w-full max-w-4xl lg:max-w-5xl z-10 py-12 lg:py-24 animate-in fade-in zoom-in duration-1000">
 <AnimatePresence mode="wait">
 {!show2FA ? (
 <motion.div key="creds" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="bg-white/95 backdrop-blur-3xl p-8 lg:p-12 rounded-3xl border border-blue-100 shadow-xl space-y-8 transition-all max-w-md mx-auto">
 <div className="text-center mb-6">
 <div className="h-12 w-12 mx-auto bg-blue-50 rounded-xl flex items-center justify-center mb-4 border border-blue-100 shadow-sm">
 <ShieldCheck className="h-6 w-6 text-blue-600" />
 </div>
 <h1 className="text-xl lg:text-2xl font-black text-blue-900 uppercase tracking-tight mb-2">Access <span className="text-blue-600">Node</span></h1>
 <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest opacity-60">{role} authentication protocol</p>
 </div>

 <form onSubmit={handleLogin} className="space-y-6">
 {error && <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl text-rose-600 text-xs font-bold uppercase text-center shadow-sm">{error}</div>}
 <div className="space-y-2">
 <label className="text-[10px] font-bold text-blue-700 uppercase tracking-widest ml-1 flex items-center gap-2 opacity-60"> <Mail className="h-3 w-3" /> Identity Endpoint</label>
 <input 
 type="email" 
 value={email} 
 onChange={e => setEmail(e.target.value.toLowerCase())} 
 autoCapitalize="none"
 autoCorrect="off"
 className="w-full h-12 bg-gray-50 border border-gray-200 text-blue-900 placeholder-gray-300 text-sm font-bold rounded-xl px-4 focus:border-blue-500 focus:bg-white outline-none transition-all shadow-sm tracking-wider" 
 placeholder="user@academic.edu" 
 required 
 />
 </div>
 <div className="space-y-2">
 <div className="flex justify-between px-1"><label className="text-[10px] font-bold text-blue-700 uppercase tracking-widest flex items-center gap-2 opacity-60"> <Lock className="h-3 w-3" /> Pin-Key</label></div>
 <div className="relative">
 <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} className="w-full h-12 bg-gray-50 border border-gray-200 text-blue-900 placeholder-gray-300 text-sm font-bold rounded-xl px-4 focus:border-blue-500 focus:bg-white outline-none transition-all shadow-sm uppercase tracking-wider" placeholder="••••••••" required />
 <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-all">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
 </div>
 </div>
 <Button type="submit" disabled={loading} className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition-all uppercase tracking-widest mt-2 group border-none">
 {loading ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : <div className="flex items-center justify-center gap-2">Sync Session <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" strokeWidth={3} /></div>}
 </Button>
 </form>
 </motion.div>
 ) : !chosenMethod ? (
 <motion.div key="chooser" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="bg-white/95 backdrop-blur-3xl p-8 lg:p-12 rounded-[2.5rem] border border-blue-50 shadow-xl space-y-8 max-w-lg mx-auto">
 <div className="text-center space-y-2">
 <div className="h-12 w-12 mx-auto bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center shadow-sm"><ShieldCheck className="h-6 w-6 text-blue-600" /></div>
 <h2 className="text-xl lg:text-3xl font-black text-blue-900 uppercase tracking-tight">2FA REQUIRED</h2>
 <p className="text-[10px] text-blue-400 uppercase tracking-widest font-bold opacity-60">Select verification protocol</p>
 </div>
 <div className="grid grid-cols-1 gap-3">
 {[
 { m: "voice" as Method, icon: Mic, label: "Voice Logic", desc: hasVoice ? 'Node Active' : 'Enroll Required' },
 { m: "authenticator" as Method, icon: QrCode, label: "Authenticator Key", desc: hasTotp ? "Synced" : "Pending Sync" },
 { m: "otp" as Method, icon: Smartphone, label: "Mobile Sync Link", desc: "6-Digit Encryption Code" },
 { m: "thumbsup" as Method, icon: ThumbsUp, label: "Biometric Gesture", desc: "Neural Hand Scan" },
 { m: "eyes" as Method, icon: Eye, label: "Retinal Blink Protocol", desc: "Vision Scan Alignment" },
 ].map(({ m, icon: Icon, label, desc }) => (
 <button key={m} onClick={() => m === 'voice' ? startVoice(!hasVoice) : launchMethod(m)} className="w-full flex items-center gap-4 p-4 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:border-blue-600 transition-all text-left group shadow-sm">
 <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-white border border-gray-100 text-blue-600 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all"><Icon className="h-5 w-5" /></div>
 <div className="flex-1">
 <p className="text-sm font-bold text-blue-900 uppercase group-hover:text-blue-600 transition-colors">{label}</p>
 <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest opacity-70">{desc}</p>
 </div>
 <ArrowRight className="h-4 w-4 text-blue-200 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" strokeWidth={3} />
 </button>
 ))}
 </div>
 <Button onClick={cancel2FA} variant="ghost" className="w-full h-10 text-blue-600 hover:text-rose-600 hover:bg-rose-50 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all border-none">Abort Access</Button>
 </motion.div>
 ) : (
 <motion.div key="verifying" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="bg-white/95 backdrop-blur-3xl p-14 lg:p-24 rounded-[5rem] border-4 border-blue-50 shadow-2xl space-y-16">
 <div className="flex items-center gap-8">
 <button onClick={goBackToChooser} className="h-16 w-16 lg:h-20 lg:w-20 rounded-[1.5rem] bg-blue-50 border-4 border-blue-100 flex items-center justify-center text-blue-600 hover:text-blue-700 transition-all shadow-sm"><ChevronLeft className="h-8 w-8 lg:h-10 lg:w-10" strokeWidth={3} /></button>
 <div><h2 className="text-3xl lg:text-5xl font-black text-blue-900 uppercase  ">{chosenMethod} sync</h2><p className="text-sm lg:text-xl font-black text-blue-400 uppercase tracking-[0.8em] mt-2 opacity-60">Active Verification protocol</p></div>
 </div>
 {needsCamera && (
 <div className="relative rounded-[3rem] overflow-hidden bg-slate-900 aspect-video border-8 border-blue-50 shadow-2xl group">
 <video ref={videoRef} className="w-full h-full object-cover scale-x-[-1]" />
 {status === "loading" && <div className="absolute inset-0 bg-[#0F172A]/90 flex flex-col items-center justify-center gap-8"><Loader2 className="h-20 w-20 text-blue-500 animate-spin" /><p className="text-xl font-black uppercase text-white tracking-[1em] animate-pulse">Initializing Neural Node...</p></div>}
 {status === "verified" && <div className="absolute inset-0 bg-emerald-600/90 flex items-center justify-center animate-in zoom-in duration-500"><CheckCircle2 className="h-40 w-40 text-white" /></div>}
 <div className="absolute top-8 right-8 px-6 py-2 bg-rose-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full animate-pulse shadow-lg">LIVE SYNC</div>
 </div>
 )}
 {chosenMethod === "voice" && (
 <div className="h-48 lg:h-72 flex items-center justify-center">
 {(status === "scanning" || status === "loading") ? (
 <div className="relative flex items-center justify-center">
 <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.1, 0.3] }} transition={{ duration: 2, repeat: Infinity }} className="absolute h-48 w-48 lg:h-64 lg:w-64 border-8 border-blue-600 rounded-full" />
 <div className="h-32 w-32 lg:h-40 lg:w-40 bg-blue-600 rounded-full flex items-center justify-center shadow-[0_20px_50px_rgba(37,99,235,0.5)] text-white relative z-10">
 <Mic className="h-16 w-16 lg:h-20 lg:w-20" />
 </div>
 </div>
 ) : status === "verified" && <CheckCircle2 className="h-40 w-40 text-emerald-500 animate-in zoom-in" />}
 </div>
 )}
 {chosenMethod === "authenticator" && (
 <div className="flex flex-col items-center gap-12 mb-10">
 {!hasTotp && qrCode && status === "scanning" && (
 <div className="p-10 bg-white rounded-[3.5rem] border-8 border-blue-50 shadow-2xl animate-in fade-in slide-in-from-bottom-10 duration-700">
 <img src={qrCode} alt="TOTP QR" className="w-56 h-56 lg:w-80 lg:h-80" />
 </div>
 )}
 {status === "scanning" && (
 <div className="flex gap-4 lg:gap-6">
 {[0,1,2,3,4,5].map(i => (
 <input 
 key={i}
 type="text"
 maxLength={1}
 className="w-14 h-20 lg:w-24 lg:h-32 border-4 border-blue-50 rounded-[2rem] bg-[#F8FAFC] text-center text-4xl lg:text-6xl font-black text-blue-900 focus:border-blue-600 focus:bg-white outline-none transition-all shadow-inner uppercase"
 onChange={(e) => {
 const val = e.target.value;
 if (val) {
 const next = (e.target as HTMLInputElement).nextElementSibling as HTMLInputElement;
 if (next) next.focus();
 const newCode = otpCode.split("");
 newCode[i] = val;
 const final = newCode.join("");
 setOtpCode(final);
 if (final.length === 6) handleTotpVerify(final);
 }
 }}
 />
 ))}
 </div>
 )}
 {status === "verified" && <CheckCircle2 className="h-40 w-40 text-emerald-500 animate-in zoom-in" />}
 </div>
 )}
 {chosenMethod === "otp" && (
 <div className="h-48 lg:h-72 flex items-center justify-center">
 {status === "scanning" ? (
 <div className="flex gap-4 lg:gap-6">
 {[0,1,2,3,4,5].map(i => (
 <input 
 key={i}
 type="text"
 maxLength={1}
 className="w-14 h-20 lg:w-24 lg:h-32 border-4 border-blue-50 rounded-[2rem] bg-[#F8FAFC] text-center text-4xl lg:text-6xl font-black text-blue-900 focus:border-blue-600 focus:bg-white outline-none transition-all shadow-inner"
 onChange={(e) => {
 const val = e.target.value;
 if (val) {
 const next = (e.target as HTMLInputElement).nextElementSibling as HTMLInputElement;
 if (next) next.focus();
 const newCode = otpCode.split("");
 newCode[i] = val;
 const final = newCode.join("");
 setOtpCode(final);
 if (final.length === 6) handleOtpVerify(final);
 }
 }}
 />
 ))}
 </div>
 ) : status === "verified" && <CheckCircle2 className="h-40 w-40 text-emerald-500 animate-in zoom-in" />}
 </div>
 )}
 <div className="bg-[#F8FAFC] border-4 border-blue-50 p-10 lg:p-14 rounded-[3.5rem] text-center space-y-8">
 <p className="text-sm lg:text-2xl font-black text-blue-900 uppercase tracking-[0.8em] leading-tight">
 {status === "verified" ? "ACCESS GRANTED" : (statusMsg || status.toUpperCase())}
 </p>
 <div className="h-4 lg:h-6 w-full bg-blue-100 rounded-full overflow-hidden shadow-inner">
 <motion.div 
 className={cn("h-full", status === "error" ? "bg-rose-600" : "bg-blue-600")} 
 initial={{ width: 0 }} 
 animate={{ width: status === "verified" ? "100%" : `${progress}%` }} 
 transition={{ duration: 0.5 }}
 />
 </div>
 {status === "scanning" && (
 <p className="text-[10px] lg:text-sm font-black text-blue-400 uppercase tracking-[1em] opacity-40 animate-pulse">Neural Handshake Active</p>
 )}
 </div>
 </motion.div>
 )}
 </AnimatePresence>
 </div>
 </div>
 )
}

export default function LoginPage() { return <Suspense fallback={<div className="h-screen bg-[#FAFAF5] flex items-center justify-center text-blue-600 font-black uppercase tracking-widest">Loading...</div>}><LoginContent /></Suspense> }
