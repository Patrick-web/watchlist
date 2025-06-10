// API utility functions for better error handling and request management

export interface ApiError extends Error {
  status?: number;
  statusText?: string;
  data?: any;
}

export class TMDBApiError extends Error implements ApiError {
  status?: number;
  statusText?: string;
  data?: any;

  constructor(
    message: string,
    status?: number,
    statusText?: string,
    data?: any,
  ) {
    super(message);
    this.name = "TMDBApiError";
    this.status = status;
    this.statusText = statusText;
    this.data = data;
  }
}

export const createApiError = (
  response: Response,
  errorData?: any,
): TMDBApiError => {
  const message =
    errorData?.status_message ||
    errorData?.message ||
    `HTTP ${response.status}: ${response.statusText}`;

  return new TMDBApiError(
    message,
    response.status,
    response.statusText,
    errorData,
  );
};

export const handleApiResponse = async <T>(response: Response): Promise<T> => {
  console.log("Handling api response");
  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = {};
    }
    throw createApiError(response, errorData);
  }

  const data = await response.json();
  console.log({ data });
  return data as T;
};

export const buildTMDBUrl = (
  endpoint: string,
  params: Record<string, string | number | boolean> = {},
): string => {
  const baseUrl = "https://api.themoviedb.org/3";
  const url = new URL(`${baseUrl}/${endpoint}`);

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, String(value));
  });

  return url.toString();
};

export const getTMDBHeaders = (apiKey: string): HeadersInit => ({
  Authorization: `Bearer ${apiKey}`,
  Accept: "application/json",
  "Content-Type": "application/json",
});

export const buildImageUrl = (
  path: string | null,
  size:
    | "w92"
    | "w154"
    | "w185"
    | "w342"
    | "w500"
    | "w780"
    | "original" = "w500",
): string => {
  if (!path) return "";
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

export const buildBackdropUrl = (
  path: string,
  size: "w300" | "w780" | "w1280" | "original" = "w1280",
): string => {
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

export const isNetworkError = (error: unknown): boolean => {
  return (
    error instanceof Error &&
    (error.message.includes("Network") ||
      error.message.includes("fetch") ||
      error.name === "TypeError")
  );
};

export const isClientError = (error: unknown): boolean => {
  return (
    error instanceof TMDBApiError &&
    error.status !== undefined &&
    error.status >= 400 &&
    error.status < 500
  );
};

export const isServerError = (error: unknown): boolean => {
  return (
    error instanceof TMDBApiError &&
    error.status !== undefined &&
    error.status >= 500
  );
};

export const shouldRetry = (error: unknown, failureCount: number): boolean => {
  // Don't retry client errors (4xx)
  if (isClientError(error)) {
    return false;
  }

  // Retry server errors and network errors up to 3 times
  if (isServerError(error) || isNetworkError(error)) {
    return failureCount < 3;
  }

  return false;
};

export const getRetryDelay = (failureCount: number): number => {
  // Exponential backoff: 1s, 2s, 4s
  return Math.min(1000 * Math.pow(2, failureCount), 4000);
};

// Rate limiting utilities
interface RateLimitConfig {
  requests: number;
  window: number; // in milliseconds
}

class RateLimiter {
  private requests: number[] = [];
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
  }

  canMakeRequest(): boolean {
    const now = Date.now();
    const windowStart = now - this.config.window;

    // Remove old requests outside the window
    this.requests = this.requests.filter((time) => time > windowStart);

    return this.requests.length < this.config.requests;
  }

  recordRequest(): void {
    this.requests.push(Date.now());
  }

  getWaitTime(): number {
    if (this.canMakeRequest()) return 0;

    const oldestRequest = Math.min(...this.requests);
    const waitTime = oldestRequest + this.config.window - Date.now();
    return Math.max(0, waitTime);
  }
}

// TMDB allows 40 requests per 10 seconds
export const tmdbRateLimiter = new RateLimiter({
  requests: 40,
  window: 10000, // 10 seconds
});

export const waitForRateLimit = async (): Promise<void> => {
  const waitTime = tmdbRateLimiter.getWaitTime();
  if (waitTime > 0) {
    await new Promise((resolve) => setTimeout(resolve, waitTime));
  }
};
