import { proxy, subscribe } from "valtio";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NewEpisode, ShowInfo } from "./types";

interface PersistedAppStateType {
  subscribedShows: ShowInfo[];
  newEpisodes: NewEpisode[];
}

export const PERSISTED_APP_STATE = proxy<PersistedAppStateType>({
  subscribedShows: [],
  newEpisodes: [],
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
    console.log({ parsedState });
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
  const alreadyAdded = PERSISTED_APP_STATE.subscribedShows.find(
    ($show) => $show.title === show.title,
  );

  if (!alreadyAdded) {
    PERSISTED_APP_STATE.subscribedShows.push(show);
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
}

export function addNewEpisode(show: ShowInfo) {
  console.log("Adding New Episode");
  const newEpisode: NewEpisode = {
    id: `${show.title}-${show.episode}`,
    show,
    notifiedUser: false,
    reminder: null,
  };
  const alreadyAdded = PERSISTED_APP_STATE.newEpisodes.find(
    (episode) => episode.show.title === newEpisode.show.title,
  );

  console.log({ alreadyAdded });

  if (!alreadyAdded) {
    PERSISTED_APP_STATE.newEpisodes.push(newEpisode);
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
