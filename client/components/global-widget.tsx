"use client"

import { useState, useEffect } from "react"
import { LogOut, Settings2, X, ShieldAlert, Maximize2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

export function GlobalWidget() {
 const [isOpen, setIsOpen] = useState(false)
 const router = useRouter()

 useEffect(() => {
 // Theme is now controlled by standard Next.js/Tailwind defaults (Light mode)
 const root = document.documentElement
 root.classList.remove('theme-invert')
 }, [])

 const handleExit = () => {
 localStorage.removeItem('token')
 router.push('/')
 }

 const toggleFullScreen = () => {
 if (!document.fullscreenElement) {
 document.documentElement.requestFullscreen().catch(err => {
 console.error(`Error attempting to enable full-screen mode: ${err.message}`);
 });
 } else {
 if (document.exitFullscreen) {
 document.exitFullscreen();
 }
 }
 }

 return (
 <div className="fixed bottom-6 right-6 z-[1000] flex flex-col items-end gap-6">
 {/* Viewport Glow Neutralization - Explicitly removed blue inset shadow */}
 <AnimatePresence>
 {isOpen && (
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, y: 20 }}
 className="flex flex-col gap-6"
 >
 {/* Terminal Control Panel */}
 <div className="bg-white/90 backdrop-blur-xl p-6 border-[4px] border-blue-200 rounded-[2.5rem] w-80 shadow-2xl relative overflow-hidden group">
 <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-600" />
 
 <p className="text-[14px] font-black uppercase text-blue-400 tracking-[0.3em] mb-6 text-center">
 System Terminal
 </p>

 <div className="flex flex-col gap-4">
 <div className="flex items-center gap-4 px-4 py-3 bg-blue-50 border border-blue-100 rounded-xl text-blue-900">
 <ShieldAlert className="h-5 w-5 shrink-0 text-blue-600" />
 <span className="text-sm font-black uppercase tracking-widest ">Active Node</span>
 </div>

 {/* Full Screen Toggle */}
 <button
 onClick={toggleFullScreen}
 className="flex items-center gap-4 px-4 py-3 bg-white border border-blue-200 rounded-xl hover:bg-blue-50 transition-all text-blue-900 group/fs shadow-sm"
 >
 <Maximize2 className="h-5 w-5 shrink-0 text-blue-600" />
 <span className="text-sm font-black uppercase tracking-widest">Full Screen</span>
 </button>
 </div>
 </div>

 {/* Security Exit */}
 <motion.button
 whileHover={{ scale: 1.02 }}
 whileTap={{ scale: 0.98 }}
 onClick={handleExit}
 className="flex items-center justify-center gap-4 bg-rose-50 text-rose-600 p-4 border-[3px] border-rose-200 rounded-2xl transition-all group shadow-xl"
 >
 <LogOut className="h-5 w-5 shrink-0 group-hover:-translate-x-1 transition-transform" />
 <span className="text-sm font-black uppercase tracking-widest">Terminate Session</span>
 </motion.button>
 </motion.div>
 )}
 </AnimatePresence>

 {/* Core Toggle */}
 <motion.button
 whileHover={{ scale: 1.1, rotate: 90 }}
 whileTap={{ scale: 0.9 }}
 onClick={() => setIsOpen(!isOpen)}
 className={cn(
 "h-16 w-16 flex items-center justify-center shadow-2xl transition-all duration-500 border-[4px] border-blue-200 z-10 rounded-2xl",
 isOpen ? "bg-white text-blue-900" : "bg-blue-600 text-white"
 )}
 >
 {isOpen ? <X className="h-6 w-6 shrink-0" /> : <Settings2 className="h-6 w-6 shrink-0" />}
 </motion.button>
 </div>
 )
}
