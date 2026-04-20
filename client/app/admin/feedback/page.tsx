"use client";

import React from "react";
import FeedbackAnalyticsTab from "@/components/admin/FeedbackAnalyticsTab";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function FeedbackAnalyticsTabPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="w-full space-y-12 animate-in fade-in slide-in-from-bottom-10 duration-1000">
        <div className="flex items-center gap-8">
          <button 
            onClick={() => router.back()} 
            className="p-6 bg-white border-4 border-gray-100 rounded-[2rem] hover:bg-gray-50 transition-all shadow-2xl hover:scale-110 active:scale-90 group"
          >
            <ChevronLeft className="h-10 w-10 text-gray-900 group-hover:text-blue-600" strokeWidth={4} />
          </button>
          <h1 className="text-5xl font-[1000] uppercase tracking-tighter text-gray-900 border-l-[12px] border-blue-600 pl-8 py-3 italic">
            Feedback Analytics
          </h1>
        </div>

        <div className="p-4 bg-white rounded-[4rem] shadow-[0_50px_100px_rgba(0,0,0,0.05)] border-4 border-white">
          <FeedbackAnalyticsTab />
        </div>
      </div>
    </div>
  );
}
