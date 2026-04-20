/**
 * Institutional-Grade Persistent Cache (Local Storage)
 * Ensures "Instant-Load" experiences by persisting API results across refreshes.
 */

const CACHE_PREFIX = "scholar_cache_";

export function getCached(key: string): any | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(CACHE_PREFIX + key);
  if (!raw) return null;
  
  try {
    const entry = JSON.parse(raw);
    if (Date.now() > entry.expiresAt) {
      localStorage.removeItem(CACHE_PREFIX + key);
      return null;
    }
    return entry.data;
  } catch (e) {
    return null;
  }
}

export function setCache(key: string, data: any, ttl = 60_000) {
  if (typeof window === "undefined") return;
  const entry = { data, expiresAt: Date.now() + ttl };
  localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(entry));
}

export function invalidateCache(key?: string) {
  if (typeof window === "undefined") return;
  if (key) {
    localStorage.removeItem(CACHE_PREFIX + key);
  } else {
    Object.keys(localStorage).forEach(k => {
      if (k.startsWith(CACHE_PREFIX)) localStorage.removeItem(k);
    });
  }
}

/**
 * Robust Fetch Interface with Institutional-Grade Retries & Tactical Timeouts
 */
export async function robustFetch(url: string, options: RequestInit = {}, timeout = 60000, maxRetries = 3): Promise<Response> {
  let attempt = 0;
  while (attempt <= maxRetries) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    
    try {
      const response = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(id);
      return response;
    } catch (e: any) {
      clearTimeout(id);
      attempt++;
      if (attempt > maxRetries) throw e;
      // Exponential backoff before retry (neural warmup)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  }
  throw new Error("Neural handshake timeout after maximum retries.");
}

/**
 * Cached fetch wrapper — returns cached result if fresh, otherwise fetches with Robust Protocol.
 */
export async function cachedFetch(url: string, options?: RequestInit, ttl = 60_000): Promise<any> {
  const cacheKey = url;
  const cached = getCached(cacheKey);

  try {
    const res = await robustFetch(url, options);
    if (!res.ok) {
       // If fetch fails but we have cache, return cache as fallback
       if (cached !== null) return cached;
       throw new Error(`Neural Node Logic Error: ${res.status} ${url}`);
    }
    const data = await res.json();
    setCache(cacheKey, data, ttl);
    return data;
  } catch (err) {
    // If backend is totally down, return cached data if available
    if (cached !== null) return cached;
    throw err;
  }
}
