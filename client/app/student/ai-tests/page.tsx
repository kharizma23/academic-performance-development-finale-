"use client";

import React from "react";
import StudentExam from "@/components/student/StudentExam";

export default function StudentAITestsPage() {
 // In a real app, this would come from an auth context or session
 const mockStudentId = "student_1"; 

 return (
 <div className="min-h-screen bg-slate-950 p-8 md:p-12 font-sans overflow-x-hidden transition-all duration-700">
 <div className="w-full space-y-12">
 <div className="flex flex-col gap-2">
 <h1 className="text-5xl font-black text-white  ">AI Assessment Matrix</h1>
 <p className="text-slate-400 text-lg font-medium opacity-80">Synchronize with the neural layer to complete your academic evaluations.</p>
 </div>
 
 <StudentExam studentId={mockStudentId} />
 </div>
 </div>
 );
}
