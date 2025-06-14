import React from "react";
import Box from "./reusables/Box";
import { Image } from "expo-image";
import ThemedText from "./reusables/ThemedText";
import { TVShowDetailsResponse } from "@/types/tmdb.types";
import { buildImageUrl } from "@/utils/api.utils";

export default function Show({
  show,
  keepWhite,
  children,
}: {
  show: TVShowDetailsResponse;
  keepWhite?: boolean;
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
        source={buildImageUrl(show.poster_path)}
        style={{
          width: 100,
          height: "100%",
          borderRadius: 50,
        }}
      />
      <Box justify="center" align="flex-start" gap={5} height={"100%"} flex={1}>
        <ThemedText size={"lg"} color={keepWhite ? "white" : "text"}>
          {show.name}
        </ThemedText>
        <Box direction="row" opacity={0.6} gap={10}>
          <ThemedText size={"sm"} color={keepWhite ? "white" : "text"}>
            Season {show.last_episode_to_air.season_number}
          </ThemedText>
          <ThemedText size={"sm"} color={keepWhite ? "white" : "text"}>
            ⋅
          </ThemedText>
          <ThemedText size={"sm"} color={keepWhite ? "white" : "text"}>
            Episode {show.last_episode_to_air.episode_number}
          </ThemedText>
        </Box>
        {children}
      </Box>
    </Box>
  );
}
