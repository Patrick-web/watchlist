import React from "react";
import Box from "./reusables/Box";
import { Image } from "expo-image";
import ThemedText from "./reusables/ThemedText";
import { cleanTitle } from "@/lib/scrape";
import ThemedButton from "./reusables/ThemedButton";
import { useSnapshot } from "valtio";
import {
  addMovieToWatchList,
  addShowToWatchList,
  addSubscribedShow,
  isShowInWatchList,
  isSubscribed,
  PERSISTED_APP_STATE,
} from "@/valitio.store";
import { ShowInfo } from "@/types";
import Show from "./Show";
import { useLocalSearchParams } from "expo-router";
import { useTheme } from "@/hooks/useTheme.hook";

export default function ShowResult({ show }: { show: ShowInfo }) {
  const APP_STATE = useSnapshot(PERSISTED_APP_STATE);

  const params = useLocalSearchParams<{ mode: "movies" | "shows" | "all" }>();

  function subscribe() {
    let $show = show;
    if (__DEV__) {
      $show = {
        ...show,
        episode: show.episode !== 1 ? show.episode - 1 : show.episode,
      };
    }
    addSubscribedShow($show);
  }

  function addToWatchList() {
    addShowToWatchList(show);
  }

  const theme = useTheme();

  return (
    <Show show={show}>
      <Box direction="row" mt={10} gap={10}>
        <ThemedButton
          type={isSubscribed(show) ? "primary" : "surface"}
          size="xs"
          label={isSubscribed(show) ? "Subscribed" : "Subscribe"}
          icon={isSubscribed(show) ? { name: "check" } : undefined}
          onPress={subscribe}
        />
        {params.mode === "all" && (
          <ThemedButton
            type={isShowInWatchList(show) ? "text" : "surface"}
            size="xs"
            label={isShowInWatchList(show) ? "Watching later" : "Watch Later"}
            labelProps={{
              color: isShowInWatchList(show) ? theme.primary : theme.onSurface,
            }}
            icon={
              isShowInWatchList(show)
                ? {
                    name: "checkmark-circle",
                    source: "Ionicons",
                    color: theme.primary,
                  }
                : undefined
            }
            onPress={addToWatchList}
            alignSelf={isShowInWatchList(show) ? "center" : undefined}
          />
        )}
      </Box>
    </Show>
  );
}
