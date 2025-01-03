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

export default function Show({
  show,
  children,
}: {
  show: ShowInfo;
  children?: React.ReactNode;
}) {
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
        <Box direction="row" opacity={0.6} gap={10}>
          <ThemedText size={"sm"}>Season {show.season}</ThemedText>
          <ThemedText size={"sm"}>⋅</ThemedText>
          <ThemedText size={"sm"}>Episode {show.episode}</ThemedText>
        </Box>
        {children}
      </Box>
    </Box>
  );
}
