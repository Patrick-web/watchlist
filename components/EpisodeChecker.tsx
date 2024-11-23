import React, { useEffect } from "react";
import { useAtom } from "jotai";
import {
  showsWithNewEpisodesAtom,
  subscribedShowsAtom,
} from "@/stores/atoms/subs.atom";
import { extractShows, F_HEADERS, ShowInfo } from "@/lib/scrape";
import { View } from "react-native";
import Box from "./reusables/Box";

export default function EpisodeChecker() {
  const [subscriptions] = useAtom(subscribedShowsAtom);
  const [withNewEpisode, setWithNewEpisode] = useAtom(showsWithNewEpisodesAtom);

  async function checkNewEpisode(currentShow: ShowInfo) {
    const data = new URLSearchParams();
    console.log("Searching...");
    console.log(currentShow.title);
    data.append("keyword", currentShow.title);
    const resp = await fetch("https://fmovies.ps/ajax/search", {
      method: "POST",
      body: data.toString(),
      headers: F_HEADERS,
    });
    const html = await resp.text();
    const foundShows = extractShows(html);
    console.log({ foundShows });
    console.log({ currentShow });
    const updatedShow = foundShows.find(
      (show) => show.title === currentShow.title,
    );
    if (updatedShow) {
      console.log("Show found");
      console.log({ updatedShow });
      if (
        updatedShow.season >= currentShow.season &&
        updatedShow.episode > currentShow.episode
      ) {
        console.log("New Episode being added...");
        setWithNewEpisode([updatedShow, ...withNewEpisode]);
      } else {
        console.log("No new Episode");
      }
    }
  }

  async function refreshShows() {
    console.log("Refreshing shows...");
    for (const show of subscriptions) {
      await checkNewEpisode(show);
    }
  }

  useEffect(() => {
    refreshShows();
  }, []);

  return <Box />;
}
