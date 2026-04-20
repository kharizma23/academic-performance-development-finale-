"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

function cn(...inputs: ClassValue[]) {
 return twMerge(clsx(inputs))
}

interface DialogProps {
 isOpen: boolean
 onClose: () => void
 children: React.ReactNode
 title?: string
 description?: string
 className?: string
}

export function Dialog({ isOpen, onClose, children, title, description, className }: DialogProps) {
 React.useEffect(() => {
 const handleEsc = (e: KeyboardEvent) => {
 if (e.key === "Escape") onClose()
 }
 if (isOpen) document.body.style.overflow = "hidden"
 else document.body.style.overflow = "unset"
 window.addEventListener("keydown", handleEsc)
 return () => window.removeEventListener("keydown", handleEsc)
 }, [isOpen, onClose])

 return (
 <AnimatePresence>
 {isOpen && (
 <div className="fixed inset-0 z-[100] flex items-center justify-center p-14">
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 onClick={onClose}
 className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm"
 />
 <motion.div
 initial={{ opacity: 0, scale: 0.95, y: 20 }}
 animate={{ opacity: 1, scale: 1, y: 0 }}
 exit={{ opacity: 0, scale: 0.95, y: 20 }}
 className={cn(
 "relative w-full max-w-none bg-white border-2 border-blue-200 rounded-3xl shadow-2xl shadow-blue-500/20 overflow-hidden",
 className
 )}
 >
 <div className="p-20">
 <div className="flex items-center justify-between mb-6 border-b border-blue-200 pb-4">
 <div>
 {title && <h2 className="text-4xl font-bold text-blue-900  leading-tight">{title}</h2>}
 {description && <p className="text-lg font-medium text-blue-700 mt-2">{description}</p>}
 </div>
 <button
 onClick={onClose}
 className="p-2 rounded-xl hover:bg-blue-100 text-blue-600 hover:text-blue-800 transition-colors"
 >
 <X className="h-16 w-16 shrink-0 shrink-0" />
 </button>
 </div>
 <div className="max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
 {children}
 </div>
 </div>
 </motion.div>
 </div>
 )}
 </AnimatePresence>
 )
}
