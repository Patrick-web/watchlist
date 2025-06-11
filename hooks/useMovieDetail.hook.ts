import { MovieDetailsResponse } from "@/types/tmdb.types";
import { useQuery } from "@tanstack/react-query";
import {
  buildTMDBUrl,
  getTMDBHeaders,
  handleApiResponse,
  shouldRetry,
  getRetryDelay,
} from "@/utils/api.utils";

// Add this constant at the top - you'll need to set your TMDB API key
const TMDB_API_KEY = process.env.EXPO_PUBLIC_TMDB_API_KEY || "";

interface MovieDetailOptions {
  language?: string;
  appendToResponse?: string;
}

const useMovieDetail = (
  movieId: number | string,
  options: MovieDetailOptions = {
    language: "en-US",
  },
) => {
  return useQuery({
    queryKey: [
      "movieDetail",
      movieId,
      options.language,
      options.appendToResponse,
    ],
    queryFn: async (): Promise<MovieDetailsResponse> => {
      // Check if API key is configured
      if (!TMDB_API_KEY) {
        throw new Error(
          "TMDB API key is not configured. Please set EXPO_PUBLIC_TMDB_API_KEY in your environment variables.",
        );
      }

      // Validate movieId
      if (!movieId) {
        throw new Error("Movie ID is required");
      }



      // Build the API URL
      const queryParams: Record<string, any> = {
        language: options.language || "en-US",
      };

      if (options.appendToResponse) {
        queryParams.append_to_response = options.appendToResponse;
      }

      const url = buildTMDBUrl(`movie/${movieId}`, queryParams);

      const response = await fetch(url, {
        method: "GET",
        headers: getTMDBHeaders(TMDB_API_KEY),
      });

      const data = await handleApiResponse<MovieDetailsResponse>(response);

      // Validate the response structure
      if (!data || typeof data.id !== "number") {
        throw new Error("Invalid response format from TMDB API");
      }

      return data;
    },
    enabled: !!movieId,
    retry: (failureCount, error) => shouldRetry(error, failureCount),
    retryDelay: getRetryDelay,
    staleTime: 10 * 60 * 1000, // 10 minutes (movie details don't change often)
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

export default useMovieDetail;