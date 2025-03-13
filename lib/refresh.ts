import { addNewEpisode, PERSISTED_APP_STATE } from "@/valitio.store";
import { extractShowEpisodes, extractShowSeasons, F_HEADERS } from "./scrape";
import * as Notifications from "expo-notifications";
import { ShowInfo } from "@/types";

export async function fetchShowSeasons(showId: string) {
  console.log("Fetching seasons");
  const resp = await fetch(`https://fmovies.ps/ajax/season/list/${showId}`, {
    headers: F_HEADERS,
  });

  const html = await resp.text();

  const seasons = extractShowSeasons(html);
  console.log({ seasonsExtracted: seasons });

  return seasons;
}

export async function fetchShowEpisodes(seasonId: number) {
  console.log("Fetching episodes");
  const resp = await fetch(
    `https://fmovies.ps/ajax/season/episodes/${seasonId}`,
    {
      headers: F_HEADERS,
    },
  );

  const html = await resp.text();

  const episodes = extractShowEpisodes(html);

  return episodes;
}

async function checkNewEpisode(currentShow: ShowInfo) {
  const match = currentShow.url.match(/\d*$/);

  console.log({ match });

  if (!match) {
    console.error("Invalid show URL:", currentShow.url);
    return;
  }
  const showId = match[0];

  console.log({ showId });

  const seasons = await fetchShowSeasons(showId);
  console.log({ seasons });
  const latestSeason = seasons[seasons.length - 1];

  const episodes = await fetchShowEpisodes(latestSeason.id);
  console.log({ episodes });

  const latestEpisode = episodes[episodes.length - 1];

  console.log({
    latestEpisode,
    latestSeason,
  });

  console.log({
    currentEpisode: currentShow.episode,
    currentSeason: currentShow.season,
  });

  const updatedShow = {
    ...currentShow,
    season: latestSeason.seasonNumber,
    episode: latestEpisode.episode,
  };
  if (updatedShow) {
    if (
      updatedShow.season >= currentShow.season &&
      updatedShow.episode > currentShow.episode
    ) {
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
  console.log({ shows: PERSISTED_APP_STATE.subscribedShows });
  for (const show of PERSISTED_APP_STATE.subscribedShows) {
    await checkNewEpisode(show);
  }
}
