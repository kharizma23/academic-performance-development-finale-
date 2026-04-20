const getApiUrl = (path: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || `http://127.0.0.1:8001`;
    return `${baseUrl}${path}`;
};

const authHeaders = (): Record<string, string> => {
    if (typeof window === "undefined") return {};
    const token = localStorage.getItem("token");
    return token ? { "Authorization": `Bearer ${token}` } : {};
};

export const fetchAllHighAchievers = async (limit = 50, department?: string, year?: number) => {
    const params = new URLSearchParams({ limit: limit.toString() });
    if (department) params.append("department", department);
    if (year) params.append("year", year.toString());
    
    const res = await fetch(getApiUrl(`/api/high-achievers?${params.toString()}`), { headers: authHeaders() });
    if (!res.ok) throw new Error("Failed to fetch high achievers");
    return res.json();
};

export const fetchTopAchievers = async (count = 10) => {
    const res = await fetch(getApiUrl(`/api/high-achievers/top?count=${count}`), { headers: authHeaders() });
    if (!res.ok) throw new Error("Failed to fetch top achievers");
    return res.json();
};

export const fetchGrowthIntelligence = async () => {
    const res = await fetch(getApiUrl(`/api/high-achievers/growth`), { headers: authHeaders(), cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch growth data");
    return res.json();
};

export const fetchSkillExcellence = async () => {
    const res = await fetch(getApiUrl(`/api/high-achievers/skills`), { headers: authHeaders(), cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch skill data");
    return res.json();
};

export const fetchDepartmentToppers = async () => {
    const res = await fetch(getApiUrl(`/api/high-achievers/department-toppers`), { headers: authHeaders(), cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch department toppers");
    return res.json();
};

export const fetchConsistencyEngine = async () => {
    const res = await fetch(getApiUrl(`/api/high-achievers/consistency`), { headers: authHeaders() });
    if (!res.ok) throw new Error("Failed to fetch consistency data");
    return res.json();
};

export const fetchPlacementReady = async () => {
    const res = await fetch(getApiUrl(`/api/high-achievers/placement-ready`), { headers: authHeaders(), cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch placement ready data");
    return res.json();
};

export const fetchHighAchieversInsights = async () => {
    const res = await fetch(getApiUrl(`/api/high-achievers/insights`), { headers: authHeaders() });
    if (!res.ok) throw new Error("Failed to fetch insights");
    return res.json();
};

export const compareHighAchievers = async (id1: string, id2: string) => {
    const res = await fetch(getApiUrl(`/api/high-achievers/compare?id1=${id1}&id2=${id2}`), { headers: authHeaders() });
    if (!res.ok) throw new Error("Failed to compare students");
    return res.json();
};

export const downloadHighAchieversReport = async () => {
    const res = await fetch(getApiUrl(`/api/high-achievers/download-report`), { headers: authHeaders() });
    if (!res.ok) throw new Error("Failed to download report");
    return res.json();
};

export const fetchHighAchieversSummary = async (department?: string, year?: number) => {
    let url = getApiUrl(`/api/high-achievers/summary`);
    const params = new URLSearchParams();
    if (department) params.append("department", department);
    if (year) params.append("year", year.toString());
    if (params.toString()) url += `?${params.toString()}`;

    const res = await fetch(url, { headers: authHeaders() });
    if (!res.ok) throw new Error("Failed to fetch high achievers summary");
    return res.json();
};
