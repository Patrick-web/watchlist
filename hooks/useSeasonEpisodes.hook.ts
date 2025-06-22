import { SeasonDetailsResponse } from "@/types/tmdb.types";
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

interface SeasonEpisodesOptions {
  language?: string;
  enabled?: boolean;
}

const useSeasonEpisodes = (
  tvShowId: number | string,
  seasonNumber: number,
  options: SeasonEpisodesOptions = {
    language: "en-US",
  },
) => {
  return useQuery({
    queryKey: ["seasonEpisodes", tvShowId, seasonNumber, options.language],
    queryFn: async (): Promise<SeasonDetailsResponse> => {
      console.log("UseSeasonEpisodes");
      console.log({ tvShowId, seasonNumber });
      // Check if API key is configured
      if (!TMDB_API_KEY) {
        throw new Error(
          "TMDB API key is not configured. Please set EXPO_PUBLIC_TMDB_API_KEY in your environment variables.",
        );
      }

      // Validate required parameters
      if (!tvShowId) {
        throw new Error("TV Show ID is required");
      }

      if (
        seasonNumber === undefined ||
        seasonNumber === null ||
        seasonNumber < 0
      ) {
        throw new Error("Valid season number is required");
      }

      // Build the API URL
      const queryParams: Record<string, any> = {
        language: options.language || "en-US",
      };

      const url = buildTMDBUrl(
        `tv/${tvShowId}/season/${seasonNumber}`,
        queryParams,
      );

      console.log("Fetching episodes...", url);
      const response = await fetch(url, {
        method: "GET",
        headers: getTMDBHeaders(TMDB_API_KEY),
      });

      const data = await handleApiResponse<SeasonDetailsResponse>(response);

      // Validate the response structure
      if (
        !data ||
        typeof data.id !== "number" ||
        !Array.isArray(data.episodes)
      ) {
        throw new Error("Invalid response format from TMDB API");
      }

      return data;
    },
    enabled:
      !!tvShowId &&
      seasonNumber !== undefined &&
      seasonNumber !== null &&
      options.enabled !== false,
    retry: (failureCount, error) => shouldRetry(error, failureCount),
    retryDelay: getRetryDelay,
    staleTime: 15 * 60 * 1000, // 15 minutes (episodes don't change often)
    gcTime: 60 * 60 * 1000, // 1 hour
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

export default useSeasonEpisodes;
