import React from "react";
import Box from "./reusables/Box";
import { Image } from "expo-image";
import ThemedText from "./reusables/ThemedText";
import { cleanTitle, ShowInfo } from "@/lib/scrape";
import ThemedButton from "./reusables/ThemedButton";
import { useSnapshot } from "valtio";
import {
  addSubscribedShow,
  isSubscribed,
  PERSISTED_APP_STATE,
} from "@/valitio.store";

export default function ShowCard({ show }: { show: ShowInfo }) {
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
    <Box
      direction="row"
      align="center"
      justify="space-between"
      gap={20}
      height={150}
    >
      <Image
        source={show.poster}
        style={{
          width: 100,
          height: "100%",
          borderRadius: 50,
        }}
      />
      <Box justify="center" align="flex-start" gap={5} height={"100%"} flex={1}>
        <ThemedText size={"lg"}>{cleanTitle(show.title)}</ThemedText>
        <Box direction="row" opacity={0.5} gap={10}>
          <ThemedText size={"sm"}>Season {show.season}</ThemedText>
          <ThemedText size={"sm"}>⋅</ThemedText>
          <ThemedText size={"sm"}>Episode {show.episode}</ThemedText>
        </Box>
        <ThemedButton
          type={isSubscribed(show) ? "primary" : "surface"}
          size="xs"
          label={isSubscribed(show) ? "Subscribed" : "Subscribe"}
          icon={{ name: isSubscribed(show) ? "check" : "plus" }}
          mt={10}
          onPress={subscribe}
        />
      </Box>
    </Box>
  );
}
