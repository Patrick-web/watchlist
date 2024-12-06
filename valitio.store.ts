import { proxy, subscribe, useSnapshot } from "valtio";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ShowInfo } from "./lib/scrape";

interface PersistedAppStateType {
  subscribedShows: ShowInfo[];
  showsWithNewEpisodes: ShowInfo[];
}

export const PERSISTED_APP_STATE = proxy<PersistedAppStateType>({
  subscribedShows: [],
  showsWithNewEpisodes: [],
});

export const persistData = async () => {
  console.log("persisting data...");
  await AsyncStorage.setItem("APP_STATE", JSON.stringify(PERSISTED_APP_STATE));
};

export const loadPersistedData = async () => {
  console.log("loading persisted data...");
  const value = await AsyncStorage.getItem("APP_STATE");
  console.log({ value });
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
    console.log("state has changed to", PERSISTED_APP_STATE);
    persistData();
  });

  return unsubscribe;
}

export function addSubscribedShow(show: ShowInfo) {
  console.log("Adding show");
  const alreadyAdded = PERSISTED_APP_STATE.subscribedShows.find(
    ($show) => $show.title === show.title,
  );

  if (!alreadyAdded) {
    PERSISTED_APP_STATE.subscribedShows.push(show);
  } else {
    console.log("Already added");
  }
}

export function removeSubscribedShow(show: ShowInfo) {
  PERSISTED_APP_STATE.subscribedShows =
    PERSISTED_APP_STATE.subscribedShows.filter(
      ($show) => $show.title !== show.title,
    );

  removeShowWithNewEpisode(show);
}

export const isSubscribed = (searchShow: ShowInfo) =>
  PERSISTED_APP_STATE.subscribedShows.find(
    (show) => show.title === searchShow.title,
  )
    ? true
    : false;

export function addShowWithNewEpisode(show: ShowInfo) {
  const alreadyAdded = PERSISTED_APP_STATE.showsWithNewEpisodes.find(
    ($show) => $show.title === show.title,
  );

  if (!alreadyAdded) {
    PERSISTED_APP_STATE.showsWithNewEpisodes.push(show);
  }
}

export function removeShowWithNewEpisode(show: ShowInfo) {
  PERSISTED_APP_STATE.showsWithNewEpisodes =
    PERSISTED_APP_STATE.showsWithNewEpisodes.filter(
      ($show) => $show.title !== show.title,
    );
}

export function markEpisodeWatched(updatedShow: ShowInfo) {
  const indexOfShow = PERSISTED_APP_STATE.subscribedShows.findIndex(
    ($show) => $show.title === updatedShow.title,
  );

  PERSISTED_APP_STATE.subscribedShows[indexOfShow].episode =
    updatedShow.episode;

  removeShowWithNewEpisode(updatedShow);
}
