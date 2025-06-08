import { Image } from "expo-image";
import React from "react";
import Box from "./reusables/Box";
import ThemedText from "./reusables/ThemedText";
import { POSTER_RATIO } from "@/constants/dimensions.constant";
import { useTheme } from "@/hooks/useTheme.hook";
import { MovieDetailsResponse } from "@/types/tmdb.types";
import { buildImageUrl } from "@/utils/api.utils";

const POSTER_WIDTH = 100;
const POSTER_HEIGHT = POSTER_RATIO * POSTER_WIDTH;

export default function Movie({
  movie,
  children,
}: {
  movie: MovieDetailsResponse;
  children?: React.ReactNode;
}) {
  const theme = useTheme();

  return (
    <>
      <Box
        direction="row"
        align="center"
        justify="space-between"
        width="100%"
        height={POSTER_HEIGHT}
        gap={20}
      >
        <Image
          source={buildImageUrl(movie.poster_path)}
          style={{
            width: POSTER_WIDTH,
            height: POSTER_HEIGHT,
            borderRadius: 50,
          }}
        />
        <Box justify="center" gap={5} height={"100%"} flex={1}>
          <ThemedText size={"lg"}>{movie.title}</ThemedText>
          <Box direction="row" gap={10}>
            <ThemedText size={"sm"} opacity={0.8}>
              {new Date(movie.release_date).getFullYear()}
            </ThemedText>
            <ThemedText size={"sm"} opacity={0.8}>
              ⋅
            </ThemedText>
            <ThemedText size={"sm"} opacity={0.8}>
              {movie.runtime}m
            </ThemedText>
          </Box>
          {children}
        </Box>
      </Box>
    </>
  );
}
