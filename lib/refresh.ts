import { addShowWithNewEpisode, PERSISTED_APP_STATE } from "@/valitio.store";
import { cleanTitle, extractShows, F_HEADERS, ShowInfo } from "./scrape";
import * as Notifications from "expo-notifications";
import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";
import { AppState } from "react-native";

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
        showNotification({
          content: {
            title: "🎬 New Episode Dropped",
            body: `Episode ${updatedShow.episode} of ${updatedShow.title} is out`,
          },
          trigger: null,
        });
      }
      addShowWithNewEpisode(updatedShow);
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

export async function showNotification(
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

const CHECK_EPISODES_TASK = "check-episodes";

TaskManager.defineTask(CHECK_EPISODES_TASK, async () => {
  findNewEpisodes();
  // Be sure to return the successful result type!
  return BackgroundFetch.BackgroundFetchResult.NewData;
});
