import { cachedFetch } from "@/lib/cache";

export const getApiUrl = (path: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8001";
    return `${baseUrl}${path}`;
};

const authHeaders = (): Record<string, string> => {
    if (typeof window === "undefined") return {};
    const token = localStorage.getItem("token");
    if (!token) return {};
    return { Authorization: `Bearer ${token}` };
};

// Subject Intelligence API Functions
export const fetchSubjectOverview = () => 
    cachedFetch(getApiUrl("/api/subjects/overview"), { headers: authHeaders() }, MED);

export const fetchSubjectList = () =>
    cachedFetch(getApiUrl("/api/subjects/list"), { headers: authHeaders() }, MED);

export const fetchSubjectDetail = (id: string) =>
    cachedFetch(getApiUrl(`/api/subjects/${id}`), { headers: authHeaders() }, MED);

export const fetchSubjectPerformance = (id: string) =>
    cachedFetch(getApiUrl(`/api/subjects/${id}/performance`), { headers: authHeaders() }, MED);

export const fetchSubjectStudents = (id: string) =>
    cachedFetch(getApiUrl(`/api/subjects/${id}/students`), { headers: authHeaders() }, MED);

const LONG = 120_000;
const MED  = 60_000;
const SHORT = 30_000;

export const fetchAdminOverview = () =>
    cachedFetch(getApiUrl("/admin/overview"), { headers: authHeaders() }, LONG);

export const fetchDepartmentInsights = (dept: string) =>
    cachedFetch(getApiUrl(`/admin/department-insights?department=${dept}`), { headers: authHeaders() }, MED);

export const fetchDepartmentReportData = (dept: string) =>
    cachedFetch(getApiUrl(`/admin/department-report-data?department=${dept}`), { headers: authHeaders() }, SHORT);

export const fetchStudents = (dept: string, year: number | string) =>
    cachedFetch(getApiUrl(`/admin/students?department=${dept}&year=${year}`), { headers: authHeaders() }, MED);

export const fetchPredictiveRanks = (year: string, dept: string) => {
    const params = new URLSearchParams();
    if (year !== "ALL") params.append("year", year);
    if (dept !== "ALL") params.append("department", dept);
    const url = getApiUrl(`/admin/predictive/ranks${params.toString() ? "?" + params : ""}`);
    return cachedFetch(url, { headers: authHeaders() }, MED);
};

export const fetchStudentInsight = (studentId: string) =>
    cachedFetch(getApiUrl(`/admin/predictive/student-insight/${studentId}`), { headers: authHeaders() }, MED);

export const searchUsers = async (type: "student" | "staff", query: string) => {
    const endpoint = type === "student" ? "students" : "staff";
    // Use the list endpoint with ?search= param (avoids path conflict with /{id} routes)
    const searchParam = query.trim() ? `?search=${encodeURIComponent(query)}` : "";
    const url = getApiUrl(`/admin/${endpoint}${searchParam}`);
    const res = await fetch(url, { headers: authHeaders() });
    if (!res.ok) return [];
    return res.json();
};

export const deleteUser = async (type: "student" | "staff", id: string) => {
    const endpoint = type === "student" ? "students" : "staff";
    const res = await fetch(getApiUrl(`/admin/${endpoint}/${id}`), {
        method: "DELETE",
        headers: authHeaders(),
    });
    return res.ok;
};
