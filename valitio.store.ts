import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppState } from "react-native";
import { proxy, subscribe } from "valtio";
import { cleanTitle } from "./lib/scrape";
import { MovieInfo, NewEpisode, ShowInfo } from "./types";
import { requestNotificationPermission } from "./lib/refresh";
import * as Notifications from "expo-notifications";

const APP_OS_STATE = AppState.currentState;

interface PersistedAppStateType {
  subscribedShows: ShowInfo[];
  newEpisodes: NewEpisode[];
  watchList: {
    shows: ShowInfo[];
    movies: MovieInfo[];
  };
  history: {
    watchedEpisodes: NewEpisode[];
    watchedMovies: MovieInfo[];
    watchedShows: ShowInfo[];
  };
}

export const PERSISTED_APP_STATE = proxy<PersistedAppStateType>({
  subscribedShows: [],
  newEpisodes: [],
  watchList: {
    shows: [],
    movies: [],
  },
  history: {
    watchedEpisodes: [],
    watchedMovies: [],
    watchedShows: [],
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

export function addSubscribedShow(show: ShowInfo) {
  const alreadyAdded = PERSISTED_APP_STATE.subscribedShows.find(
    ($show) => $show.title === show.title,
  );

  if (!alreadyAdded) {
    PERSISTED_APP_STATE.subscribedShows.unshift(show);
  } else {
    unsubscribeShow(show);
  }
}

export function unsubscribeShow(show: ShowInfo) {
  PERSISTED_APP_STATE.subscribedShows =
    PERSISTED_APP_STATE.subscribedShows.filter(
      ($show) => $show.title !== show.title,
    );

  PERSISTED_APP_STATE.newEpisodes.map((episode) => {
    if (episode.show.title === show.title) {
      deleteNewEpisode(episode);
    }
  });
}

export const isSubscribed = (searchShow: ShowInfo) =>
  PERSISTED_APP_STATE.subscribedShows.find(
    (show) => show.title === searchShow.title,
  )
    ? true
    : false;

export function onEpisodeWatched(target: NewEpisode) {
  const indexOfShow = PERSISTED_APP_STATE.subscribedShows.findIndex(
    (show) => show.title === target.show.title,
  );

  PERSISTED_APP_STATE.subscribedShows[indexOfShow].episode =
    target.show.episode;

  deleteNewEpisode(target);

  PERSISTED_APP_STATE.history.watchedEpisodes.push(target);
}

export async function addNewEpisode(show: ShowInfo) {
  const newEpisode: NewEpisode = {
    id: `${show.title}-${show.episode}`,
    show,
    notifiedUser: false,
    reminder: null,
  };
  const alreadyAdded = PERSISTED_APP_STATE.newEpisodes.find(
    (episode) => episode.show.title === newEpisode.show.title,
  );

  if (!alreadyAdded) {
    PERSISTED_APP_STATE.newEpisodes.push(newEpisode);
    if (APP_OS_STATE === "background") {
      await scheduleNotification({
        content: {
          title: "🎬 New Episode Dropped",
          body: `Episode ${newEpisode.show.episode} of ${cleanTitle(
            newEpisode.show.title,
          )} is out`,
          sound: "Default",
        },
        trigger: null,
      });
    }
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

export function onEpisodeNotificationShown(show: ShowInfo) {
  const index = PERSISTED_APP_STATE.newEpisodes.findIndex(
    (episode) => episode.show.title === show.title,
  );

  PERSISTED_APP_STATE.newEpisodes[index].notifiedUser = true;
}

// toWatch

export function addShowToWatchList(show: ShowInfo) {
  PERSISTED_APP_STATE.watchList.shows.unshift(show);
}

export function addMovieToWatchList(movie: MovieInfo) {
  const alreadyAdded = PERSISTED_APP_STATE.watchList.movies.find(
    ($movie) => $movie.title === movie.title,
  );

  if (!alreadyAdded) {
    PERSISTED_APP_STATE.watchList.movies.unshift(movie);
  }
}

export function removeShowFromWatchList(show: ShowInfo) {
  PERSISTED_APP_STATE.watchList.shows =
    PERSISTED_APP_STATE.watchList.shows.filter(
      (item) => item.title !== show.title,
    );
}

export function removeMovieFromWatchList(movie: MovieInfo) {
  PERSISTED_APP_STATE.watchList.movies =
    PERSISTED_APP_STATE.watchList.movies.filter(
      (item) => item.title !== movie.title,
    );
}

export function isShowInWatchList(show: ShowInfo) {
  return PERSISTED_APP_STATE.watchList.shows.find(
    (item) => item.title === show.title,
  );
}

export function isMovieInWatchList(movie: MovieInfo) {
  return PERSISTED_APP_STATE.watchList.movies.find(
    (item) => item.title === movie.title,
  );
}

export function onShowWatched(show: ShowInfo) {
  PERSISTED_APP_STATE.history.watchedShows.push(show);
  removeShowFromWatchList(show);
}

export function onMovieWatched(movie: MovieInfo) {
  PERSISTED_APP_STATE.history.watchedMovies.push(movie);
  removeMovieFromWatchList(movie);
}

// temporary function that decreases the episode number in the subscribed shows
export function decreaseEpisode() {
  PERSISTED_APP_STATE.subscribedShows = PERSISTED_APP_STATE.subscribedShows.map(
    (show) => {
      return {
        ...show,
        episode: show.episode !== 1 ? show.episode - 1 : show.episode,
      };
    },
  );
}

export async function scheduleNotification(
  args: Notifications.NotificationRequestInput,
) {
  await requestNotificationPermission();
  Notifications.scheduleNotificationAsync(args);
}
