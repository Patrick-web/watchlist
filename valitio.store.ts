import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppState } from "react-native";
import { proxy, subscribe } from "valtio";
import { NewEpisode, ShowInfo } from "./types";
import { requestNotificationPermission } from "./lib/refresh";
import * as Notifications from "expo-notifications";
import {
  MovieDetailsResponse,
  TVShowDetailsResponse,
} from "./types/tmdb.types";

const APP_OS_STATE = AppState.currentState;

export interface WatchedEpisode {
  showId: number;
  seasonNumber: number;
  episodeNumber: number;
  watchedAt: string;
}

interface PersistedAppStateType {
  subscribedShows: TVShowDetailsResponse[];
  newEpisodes: NewEpisode[];
  watchedEpisodes: WatchedEpisode[];
  watchList: {
    shows: TVShowDetailsResponse[];
    movies: MovieDetailsResponse[];
  };
  history: {
    watchedMovies: MovieDetailsResponse[];
    watchedShows: TVShowDetailsResponse[];
  };
  settings: {
    newEpisodeNotification: boolean;
    reminderNotification: boolean;
    hapticFeedback: boolean;
  };
}

export const PERSISTED_APP_STATE = proxy<PersistedAppStateType>({
  subscribedShows: [],
  newEpisodes: [],
  watchedEpisodes: [],
  watchList: {
    shows: [],
    movies: [],
  },
  history: {
    watchedMovies: [],
    watchedShows: [],
  },
  settings: {
    newEpisodeNotification: true,
    reminderNotification: true,
    hapticFeedback: true,
  },
});

export const persistData = async () => {
  await AsyncStorage.setItem("APP_STATE", JSON.stringify(PERSISTED_APP_STATE));
};

export const loadPersistedData = async () => {
  const value = await AsyncStorage.getItem("APP_STATE");
  if (value) {
    const parsedState = JSON.parse(value) as PersistedAppStateType;
    for (const [key, value] of Object.entries(parsedState)) {
      PERSISTED_APP_STATE[key as keyof PersistedAppStateType] = value;
    }
  }
};

export function setupValtio() {
  loadPersistedData();

  const unsubscribe = subscribe(PERSISTED_APP_STATE, () => {
    persistData();
  });

  return unsubscribe;
}

// subscribed shows

export function addSubscribedShow(show: TVShowDetailsResponse) {
  const alreadyAdded = PERSISTED_APP_STATE.subscribedShows.find(
    ($show) => $show.id === show.id,
  );

  if (!alreadyAdded) {
    PERSISTED_APP_STATE.subscribedShows.unshift(show);
  } else {
    unsubscribeShow(show);
  }
}

export function updateShow(show: TVShowDetailsResponse) {
  const index = PERSISTED_APP_STATE.subscribedShows.findIndex(
    ($show) => $show.id === show.id,
  );

  if (index !== -1) {
    PERSISTED_APP_STATE.subscribedShows[index] = show;
  }
}

export function unsubscribeShow(show: TVShowDetailsResponse) {
  PERSISTED_APP_STATE.subscribedShows =
    PERSISTED_APP_STATE.subscribedShows.filter(($show) => $show.id !== show.id);

  // Remove related new episodes
  PERSISTED_APP_STATE.newEpisodes = PERSISTED_APP_STATE.newEpisodes.filter(
    episode => parseInt(episode.show.id) !== show.id
  );

  // Optionally clear watched episodes for the show
  // clearWatchedEpisodesForShow(show.id);
}

export const isSubscribed = (showId: number) =>
  PERSISTED_APP_STATE.subscribedShows.find((show) => show.id === showId)
    ? true
    : false;

export const isInWatchList = (id: number) => {
  const fullWatchlist = [
    ...PERSISTED_APP_STATE.watchList.shows,
    ...PERSISTED_APP_STATE.watchList.movies,
  ];

  return fullWatchlist.find((item) => item.id === id) ? true : false;
};

export function onEpisodeWatched(target: NewEpisode) {
  // Add to watched episodes
  const watchedEpisode: WatchedEpisode = {
    showId: parseInt(target.show.id),
    seasonNumber: target.show.season,
    episodeNumber: target.show.episode,
    watchedAt: new Date().toISOString(),
  };

  // Check if already marked as watched
  const alreadyWatched = PERSISTED_APP_STATE.watchedEpisodes.find(
    (ep) => ep.showId === watchedEpisode.showId && 
           ep.seasonNumber === watchedEpisode.seasonNumber && 
           ep.episodeNumber === watchedEpisode.episodeNumber
  );

  if (!alreadyWatched) {
    PERSISTED_APP_STATE.watchedEpisodes.push(watchedEpisode);
  }

  deleteNewEpisode(target);
}

export async function addNewEpisode(show: ShowInfo) {
  console.log("Adding new episode");
  const newEpisode: NewEpisode = {
    id: `${show.id}-S${show.season}E${show.episode}`,
    show,
    notifiedUser: false,
    reminder: null,
  };
  
  // Check if this exact episode is already in new episodes
  const alreadyAdded = PERSISTED_APP_STATE.newEpisodes.find(
    (episode) => episode.show.id === newEpisode.show.id && 
    episode.show.season === newEpisode.show.season &&
    episode.show.episode === newEpisode.show.episode,
  );

  // Also check if this episode was already watched
  const alreadyWatched = isEpisodeWatched(
    parseInt(show.id), 
    show.season, 
    show.episode
  );

  if (!alreadyAdded && !alreadyWatched) {
    PERSISTED_APP_STATE.newEpisodes.push(newEpisode);
    if (
      APP_OS_STATE === "background" &&
      PERSISTED_APP_STATE.settings.newEpisodeNotification
    ) {
      await scheduleNotification({
        content: {
          title: "🎬 New Episode Dropped",
          body: `S${newEpisode.show.season}E${newEpisode.show.episode} of ${newEpisode.show.title} is out`,
          sound: "Default",
        },
        trigger: null,
      });
    }
  } else if (alreadyWatched) {
    console.log(`Episode S${show.season}E${show.episode} of ${show.title} was already watched, not adding as new`);
  }
}

export function deleteNewEpisode(target: NewEpisode) {
  PERSISTED_APP_STATE.newEpisodes = PERSISTED_APP_STATE.newEpisodes.filter(
    (episode) => episode.id !== target.id,
  );
}

export function onEpisodeReminderSet(
  target: NewEpisode,
  reminder: NewEpisode["reminder"],
) {
  const index = PERSISTED_APP_STATE.newEpisodes.findIndex(
    (episode) => episode.id === target.id,
  );

  PERSISTED_APP_STATE.newEpisodes[index].reminder = reminder;
}

export function onEpisodeNotificationShown(showId: string) {
  const index = PERSISTED_APP_STATE.newEpisodes.findIndex(
    (episode) => episode.show.id === showId,
  );

  if (index !== -1) {
    PERSISTED_APP_STATE.newEpisodes[index].notifiedUser = true;
  }
}

// toWatch

export function addShowToWatchList(show: TVShowDetailsResponse) {
  PERSISTED_APP_STATE.watchList.shows.unshift(show);
}

export function addMovieToWatchList(movie: MovieDetailsResponse) {
  const alreadyAdded = PERSISTED_APP_STATE.watchList.movies.find(
    ($movie) => $movie.id === movie.id,
  );

  if (!alreadyAdded) {
    PERSISTED_APP_STATE.watchList.movies.unshift(movie);
  }
}

export function removeShowFromWatchList(show: TVShowDetailsResponse) {
  PERSISTED_APP_STATE.watchList.shows =
    PERSISTED_APP_STATE.watchList.shows.filter((item) => item.id !== show.id);
}

export function removeMovieFromWatchList(movie: MovieDetailsResponse) {
  PERSISTED_APP_STATE.watchList.movies =
    PERSISTED_APP_STATE.watchList.movies.filter((item) => item.id !== movie.id);
}

export function isShowInWatchList(show: TVShowDetailsResponse) {
  return PERSISTED_APP_STATE.watchList.shows.find(
    (item) => item.id === show.id,
  );
}

export function isMovieInWatchList(movie: MovieDetailsResponse) {
  return PERSISTED_APP_STATE.watchList.movies.find(
    (item) => item.id === movie.id,
  );
}

export function onShowWatched(show: TVShowDetailsResponse) {
  PERSISTED_APP_STATE.history.watchedShows.push(show);
  removeShowFromWatchList(show);
}

export function onMovieWatched(movie: MovieDetailsResponse) {
  PERSISTED_APP_STATE.history.watchedMovies.push(movie);
  removeMovieFromWatchList(movie);
}

// Helper functions for watched episodes
export function markEpisodeAsWatched(showId: number, seasonNumber: number, episodeNumber: number) {
  const watchedEpisode: WatchedEpisode = {
    showId,
    seasonNumber,
    episodeNumber,
    watchedAt: new Date().toISOString(),
  };

  const alreadyWatched = PERSISTED_APP_STATE.watchedEpisodes.find(
    (ep) => ep.showId === showId && 
           ep.seasonNumber === seasonNumber && 
           ep.episodeNumber === episodeNumber
  );

  if (!alreadyWatched) {
    PERSISTED_APP_STATE.watchedEpisodes.push(watchedEpisode);
  }
}

export function isEpisodeWatched(showId: number, seasonNumber: number, episodeNumber: number): boolean {
  return PERSISTED_APP_STATE.watchedEpisodes.some(
    (ep) => ep.showId === showId && 
           ep.seasonNumber === seasonNumber && 
           ep.episodeNumber === episodeNumber
  );
}

export function getLastWatchedEpisode(showId: number): WatchedEpisode | null {
  const watchedEpisodes = PERSISTED_APP_STATE.watchedEpisodes
    .filter(ep => ep.showId === showId)
    .sort((a, b) => {
      if (a.seasonNumber !== b.seasonNumber) {
        return b.seasonNumber - a.seasonNumber;
      }
      return b.episodeNumber - a.episodeNumber;
    });

  return watchedEpisodes[0] || null;
}

export function getWatchedEpisodesForShow(showId: number): WatchedEpisode[] {
  return PERSISTED_APP_STATE.watchedEpisodes
    .filter(ep => ep.showId === showId)
    .sort((a, b) => {
      if (a.seasonNumber !== b.seasonNumber) {
        return a.seasonNumber - b.seasonNumber;
      }
      return a.episodeNumber - b.episodeNumber;
    });
}

export function getWatchedEpisodesCount(showId: number): number {
  return PERSISTED_APP_STATE.watchedEpisodes.filter(ep => ep.showId === showId).length;
}

export function removeWatchedEpisode(showId: number, seasonNumber: number, episodeNumber: number) {
  PERSISTED_APP_STATE.watchedEpisodes = PERSISTED_APP_STATE.watchedEpisodes.filter(
    ep => !(ep.showId === showId && 
           ep.seasonNumber === seasonNumber && 
           ep.episodeNumber === episodeNumber)
  );
}

export function clearWatchedEpisodesForShow(showId: number) {
  PERSISTED_APP_STATE.watchedEpisodes = PERSISTED_APP_STATE.watchedEpisodes.filter(
    ep => ep.showId !== showId
  );
}

// temporary function that decreases the episode number in the subscribed shows
export function decreaseEpisode() {
  // Remove the last watched episode for each show
  PERSISTED_APP_STATE.subscribedShows.forEach(show => {
    const lastWatched = getLastWatchedEpisode(show.id);
    if (lastWatched) {
      PERSISTED_APP_STATE.watchedEpisodes = PERSISTED_APP_STATE.watchedEpisodes.filter(
        ep => !(ep.showId === show.id && 
               ep.seasonNumber === lastWatched.seasonNumber && 
               ep.episodeNumber === lastWatched.episodeNumber)
      );
    }
  });
}

export function setSetting(
  setting: keyof PersistedAppStateType["settings"],
  value: boolean,
) {
  PERSISTED_APP_STATE.settings[setting] = value;
}

export async function scheduleNotification(
  args: Notifications.NotificationRequestInput,
) {
  await requestNotificationPermission();
  Notifications.scheduleNotificationAsync(args);
}
