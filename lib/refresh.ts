import { addNewEpisode, PERSISTED_APP_STATE, getLastWatchedEpisode, markEpisodeAsWatched } from "@/valitio.store";
import * as Notifications from "expo-notifications";
import { TVShowDetailsResponse } from "@/types/tmdb.types";
import {
  buildTMDBUrl,
  getTMDBHeaders,
  handleApiResponse,
} from "@/utils/api.utils";

const TMDB_API_KEY = process.env.EXPO_PUBLIC_TMDB_API_KEY || "";

async function fetchTVShowDetails(showId: number): Promise<TVShowDetailsResponse> {
  if (!TMDB_API_KEY) {
    throw new Error(
      "TMDB API key is not configured. Please set EXPO_PUBLIC_TMDB_API_KEY in your environment variables.",
    );
  }

  const url = buildTMDBUrl(`tv/${showId}`, {
    language: "en-US",
  });

  const response = await fetch(url, {
    method: "GET",
    headers: getTMDBHeaders(TMDB_API_KEY),
  });

  const data = await handleApiResponse<TVShowDetailsResponse>(response);

  if (!data || typeof data.id !== "number") {
    throw new Error("Invalid response format from TMDB API");
  }

  return data;
}

async function checkNewEpisode(currentShow: TVShowDetailsResponse) {
  try {
    console.log(`Checking for new episodes for: ${currentShow.name}`);
    
    // Fetch fresh show details from TMDB
    const freshShowData = await fetchTVShowDetails(currentShow.id);
    
    // Get the last watched episode for this show
    const lastWatchedEpisode = getLastWatchedEpisode(currentShow.id);
    
    // Get the latest available episode from TMDB
    const latestAvailableEpisode = freshShowData.last_episode_to_air;
    
    // If there's no latest episode data, skip this show
    if (!latestAvailableEpisode) {
      console.log(`No episode data available for ${currentShow.name}`);
      return;
    }
    
    // Determine what episode to compare against
    let comparisonEpisode = lastWatchedEpisode;
    
    // If no episodes have been watched, we need to establish a baseline
    if (!lastWatchedEpisode) {
      // For new subscriptions, we don't want to flood with all existing episodes
      // Instead, we'll only show episodes that air after subscription
      const currentDate = new Date();
      const episodeAirDate = new Date(latestAvailableEpisode.air_date);
      
      // If the latest episode aired more than 7 days ago, consider it "watched"
      // This prevents showing old episodes as "new" when first subscribing
      const daysSinceAired = (currentDate.getTime() - episodeAirDate.getTime()) / (1000 * 60 * 60 * 24);
      
      if (daysSinceAired > 7) {
        console.log(`${currentShow.name}: Latest episode aired ${Math.floor(daysSinceAired)} days ago, marking as watched to prevent spam`);
        // Mark this episode as watched to establish baseline
        markEpisodeAsWatched(currentShow.id, latestAvailableEpisode.season_number, latestAvailableEpisode.episode_number);
        return;
      } else {
        // Recent episode, we can consider it new
        comparisonEpisode = {
          showId: currentShow.id,
          seasonNumber: latestAvailableEpisode.season_number,
          episodeNumber: latestAvailableEpisode.episode_number - 1,
          watchedAt: new Date().toISOString(),
        };
      }
    }
    
    // Check if the latest available episode is newer than what was last watched
    const hasNewEpisode = comparisonEpisode && (
      latestAvailableEpisode.season_number > comparisonEpisode.seasonNumber ||
      (latestAvailableEpisode.season_number === comparisonEpisode.seasonNumber &&
       latestAvailableEpisode.episode_number > comparisonEpisode.episodeNumber)
    );
    
    if (hasNewEpisode) {
      console.log(`New episode found for ${currentShow.name}:`, {
        season: latestAvailableEpisode.season_number,
        episode: latestAvailableEpisode.episode_number,
        name: latestAvailableEpisode.name,
        airDate: latestAvailableEpisode.air_date,
        lastWatched: lastWatchedEpisode ? `S${lastWatchedEpisode.seasonNumber}E${lastWatchedEpisode.episodeNumber}` : 'none',
      });
      
      // Add the new episode to the state
      await addNewEpisode({
        id: currentShow.id.toString(),
        title: currentShow.name,
        url: `https://www.themoviedb.org/tv/${currentShow.id}`,
        season: latestAvailableEpisode.season_number,
        episode: latestAvailableEpisode.episode_number,
        poster: currentShow.poster_path || "",
      });
    } else {
      console.log(`No new episodes for ${currentShow.name}`);
    }
    
  } catch (error) {
    console.error(`Error checking new episodes for ${currentShow.name}:`, error);
  }
}

export async function requestNotificationPermission() {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== "granted") {
    alert("Failed to get notification permission!");
    return;
  }
}

export async function scheduleNotification(
  args: Notifications.NotificationRequestInput,
) {
  await requestNotificationPermission();
  Notifications.scheduleNotificationAsync(args);
}

export async function findNewEpisodes() {
  console.log("Finding new episodes using TMDB API...");
  console.log({ subscribedShows: PERSISTED_APP_STATE.subscribedShows.length });
  
  if (PERSISTED_APP_STATE.subscribedShows.length === 0) {
    console.log("No subscribed shows to check");
    return;
  }
  
  // Check each subscribed show for new episodes
  const promises = PERSISTED_APP_STATE.subscribedShows.map(show => 
    checkNewEpisode(show)
  );
  
  // Wait for all checks to complete
  await Promise.allSettled(promises);
  
  console.log("Finished checking for new episodes");
}