import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";
import { findNewEpisodes } from "./refresh";

export const CHECK_EPISODES_TASK = "check-episodes";

TaskManager.defineTask(CHECK_EPISODES_TASK, async () => {
  console.log("Background fetch...");
  findNewEpisodes();

  return BackgroundFetch.BackgroundFetchResult.NewData;
});

export async function registerBackgroundFetchAsync() {
  const isRegistered =
    await TaskManager.isTaskRegisteredAsync(CHECK_EPISODES_TASK);

  if (isRegistered) {
    console.log(__DEV__ ? "Background task already registered" : "");
    return;
  }

  return BackgroundFetch.registerTaskAsync(CHECK_EPISODES_TASK, {
    minimumInterval: 60 * 60,
    stopOnTerminate: false,
    startOnBoot: true,
  });
}

export async function unregisterBackgroundFetchAsync() {
  return BackgroundFetch.unregisterTaskAsync(CHECK_EPISODES_TASK);
}
