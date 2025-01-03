import React from "react";
import Box from "./reusables/Box";
import { Image } from "expo-image";
import ThemedText from "./reusables/ThemedText";
import { cleanTitle } from "@/lib/scrape";
import ThemedButton from "./reusables/ThemedButton";
import { useSnapshot } from "valtio";
import {
  addSubscribedShow,
  isSubscribed,
  PERSISTED_APP_STATE,
} from "@/valitio.store";
import { ShowInfo } from "@/types";
import Show from "./Show";

export default function ShowResult({ show }: { show: ShowInfo }) {
  const APP_STATE = useSnapshot(PERSISTED_APP_STATE);

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

  return (
    <Show show={show}>
      <ThemedButton
        type={isSubscribed(show) ? "primary" : "surface"}
        size="sm"
        label={isSubscribed(show) ? "Subscribed" : "Subscribe"}
        icon={isSubscribed(show) ? { name: "check" } : undefined}
        mt={10}
        onPress={subscribe}
      />
    </Show>
  );
}
