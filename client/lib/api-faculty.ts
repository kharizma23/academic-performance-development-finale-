import { cachedFetch } from "@/lib/cache";

const getFlaskUrl = () => {
    const envUrl = process.env.NEXT_PUBLIC_API_URL;
    if (envUrl) return `${envUrl}/api`;
    
    if (typeof window === "undefined") return "http://127.0.0.1:8001/api";
    const hostname = window.location.hostname;
    const isLocal = hostname === "localhost" || hostname === "127.0.0.1";
    const host = isLocal ? "127.0.0.1" : hostname;
    return `http://${host}:8001/api`;
};

const FLASK = getFlaskUrl();

// TTLs
const LONG = 120_000;  // 2 min — low-volatility data
const MED  = 60_000;   // 1 min — medium-volatility
const SHORT = 20_000;  // 20 s  — live alerts

export const fetchFacultyOverview     = () => cachedFetch(`${FLASK}/faculty/overview`, undefined, LONG);
export const fetchFacultyList         = () => cachedFetch(`${FLASK}/faculty`, undefined, LONG);
export const fetchFacultyLeaderboard  = () => cachedFetch(`${FLASK}/faculty/leaderboard`, undefined, LONG);
export const fetchFacultyInsights     = () => cachedFetch(`${FLASK}/faculty/insights`, undefined, MED);
export const fetchFacultyPerformance  = () => cachedFetch(`${FLASK}/faculty/performance`, undefined, MED);
export const fetchFacultyFeedback     = () => cachedFetch(`${FLASK}/faculty/feedback`, undefined, MED);
export const fetchFacultyAlerts       = () => cachedFetch(`${FLASK}/faculty/alerts`, undefined, SHORT);
export const fetchFacultyRiskContribution = () => cachedFetch(`${FLASK}/faculty/risk-contribution`, undefined, MED);
export const fetchFacultyDetail       = (id: string) => cachedFetch(`${FLASK}/faculty/${id}`, undefined, MED);
export const fetchAllInterventions    = () => cachedFetch(`${FLASK}/faculty/interventions`, undefined, SHORT);

export const fetchFacultyComparison = (id1: string, id2: string) =>
    cachedFetch(`${FLASK}/faculty/compare?id1=${id1}&id2=${id2}`, undefined, MED);

export async function assignIntervention(data: { faculty_id: string; type: string; description: string }) {
    const res = await fetch(`${FLASK}/faculty/intervention`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to assign intervention");
    return res.json();
}
