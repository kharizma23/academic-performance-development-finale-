import { cachedFetch } from "@/lib/cache";

const getApiUrl = (path: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || `http://127.0.0.1:8001`;
    return `${baseUrl}${path}`;
};

const authHeaders = (): Record<string, string> => {
    if (typeof window === "undefined") return {};
    const token = localStorage.getItem("token");
    if (!token) return {};
    return { Authorization: `Bearer ${token}` };
};

const MED = 60_000;
const SHORT = 30_000;

export const fetchStudentOverview = () => 
    cachedFetch(getApiUrl("/student/overview"), { headers: authHeaders() }, MED);

export const fetchStudentTodos = () =>
    cachedFetch(getApiUrl("/student/todos"), { headers: authHeaders() }, SHORT);

export const fetchStudentAcademic = () =>
    cachedFetch(getApiUrl("/student/academic"), { headers: authHeaders() }, MED);

export const fetchStudentAcademicTrend = () =>
    cachedFetch(getApiUrl("/student/academic/trend"), { headers: authHeaders() }, MED);

export const fetchStudentAcademicSubjects = () =>
    cachedFetch(getApiUrl("/student/academic/subjects"), { headers: authHeaders() }, MED);

export const fetchStudentAcademicInsight = () =>
    cachedFetch(getApiUrl("/student/academic/insight"), { headers: authHeaders() }, MED);
