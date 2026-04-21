export const getApiUrl = (path: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";
  // Ensure the path starts with / if it doesn't
  const formattedPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${formattedPath}`;
};

export const getAuthHeaders = (): Record<string, string> => {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("token");
  if (!token) return {};
  return {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};
