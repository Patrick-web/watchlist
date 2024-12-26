import {
  addNewEpisode,
  onEpisodeNotificationShown,
  PERSISTED_APP_STATE,
} from "@/valitio.store";
import { cleanTitle, extractShows, F_HEADERS } from "./scrape";
import * as Notifications from "expo-notifications";
import { AppState } from "react-native";
import { ShowInfo } from "@/types";

async function checkNewEpisode(currentShow: ShowInfo) {
  const APP_GROUND_STATE = AppState.currentState;

  const data = new URLSearchParams();

  console.log("Searching..." + cleanTitle(currentShow.title));

  data.append("keyword", cleanTitle(currentShow.title));

  const resp = await fetch("https://fmovies.ps/ajax/search", {
    method: "POST",
    body: data.toString(),
    headers: F_HEADERS,
  });

  const html = await resp.text();

  const foundShows = extractShows(html);

  const updatedShow = foundShows.find(
    (show) => show.title === currentShow.title,
  );
  if (updatedShow) {
    if (
      updatedShow.season >= currentShow.season &&
      updatedShow.episode > currentShow.episode
    ) {
      console.log({ APP_GROUND_STATE });
      if (APP_GROUND_STATE === "background") {
        scheduleNotification({
          content: {
            title: "🎬 New Episode Dropped",
            body: `Episode ${updatedShow.episode} of ${cleanTitle(updatedShow.title)} is out`,
            sound: "Default",
          },
          trigger: null,
        });
        onEpisodeNotificationShown(updatedShow);
      }
      addNewEpisode(updatedShow);
    }
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
    alert("Failed to get notifcation permission!");
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
  console.log("finding New Episodes...");
  for (const show of PERSISTED_APP_STATE.subscribedShows) {
    await checkNewEpisode(show);
  }
}