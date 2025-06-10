import { SearchResponse } from "@/types/tmdb.types";
import { useQuery } from "@tanstack/react-query";
import {
  buildTMDBUrl,
  getTMDBHeaders,
  handleApiResponse,
  shouldRetry,
  getRetryDelay,
} from "@/utils/api.utils";

const TMDB_API_KEY = process.env.EXPO_PUBLIC_TMDB_API_KEY || "";

interface SearchOptions {
  type: "movie" | "tv";
  page: number;
  includeAdult: boolean;
}

const useSearch = (
  query: string,
  options: SearchOptions = {
    type: "movie",
    page: 1,
    includeAdult: false,
  },
) => {
  return useQuery({
    queryKey: [
      "search",
      query,
      options.type,
      options.page,
      options.includeAdult,
    ],
    queryFn: async (): Promise<SearchResponse> => {
      console.log("Searching...");
      // Check if API key is configured
      if (!TMDB_API_KEY) {
        throw new Error(
          "TMDB API key is not configured. Please set EXPO_PUBLIC_TMDB_API_KEY in your environment variables.",
        );
      }

      // Return empty results for empty queries
      if (!query || query.trim().length === 0) {
        return {
          page: 1,
          results: [],
          total_pages: 0,
          total_results: 0,
        };
      }

      // Build the API URL with proper encoding
      const url = buildTMDBUrl(`search/${options.type}`, {
        query: query.trim(),
        include_adult: options.includeAdult,
        language: "en-US",
        page: options.page,
      });

      console.log({ url });

      const response = await fetch(url, {
        method: "GET",
        headers: getTMDBHeaders(TMDB_API_KEY),
      });

      const data = await handleApiResponse<SearchResponse>(response);

      console.log({ data });

      // Validate the response structure
      if (
        !data ||
        typeof data.page !== "number" ||
        !Array.isArray(data.results)
      ) {
        throw new Error("Invalid response format from TMDB API");
      }

      return data;
    },
    enabled: !!query && query.trim().length > 0,
    retry: (failureCount, error) => shouldRetry(error, failureCount),
    retryDelay: getRetryDelay,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

export default useSearch;
