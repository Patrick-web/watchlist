import React from "react";
import Box from "./reusables/Box";
import { Image } from "expo-image";
import ThemedText from "./reusables/ThemedText";
import { ShowInfo } from "@/lib/scrape";

export default function EpisodeCard({ episode }: { episode: ShowInfo }) {
  return (
    <Box direction="row" align="center" justify="space-between" height={150}>
      <Image
        source={episode.poster}
        style={{
          width: 100,
          height: "100%",
          borderRadius: 50,
        }}
      />
      <Box align="center" height={"100%"} width={"30%"} justify="center">
        <ThemedText size={"sm"} opacity={0.5}>
          Episode
        </ThemedText>
        <ThemedText size={80} fontWeight="bold">
          {episode.episode}
        </ThemedText>
      </Box>
      <Box justify="center" gap={5} height={"100%"} flex={1}>
        <ThemedText size={"lg"}>{episode.title}</ThemedText>
        <ThemedText size={"sm"} opacity={0.5}>
          Season {episode.season}
        </ThemedText>
      </Box>
    </Box>
  );
}
