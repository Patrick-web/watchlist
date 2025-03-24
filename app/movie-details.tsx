import Box from "@/components/reusables/Box";
import { sHeight } from "@/constants/dimensions.constant";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { extractFilmInfo, F_HEADERS } from "@/lib/scrape";
import { MovieInfo } from "@/types";
import ThemedButton from "@/components/reusables/ThemedButton";
import ThemedActivityIndicator from "@/components/reusables/ThemedActivityIndicator";
import { addMovieToWatchList, isInWatchList } from "@/valitio.store";
import { Platform } from "react-native";
import FilmInfo from "@/components/FilmInfo";
import FilmHeader from "@/components/FilmHeader";

const Film = () => {
  const { film: filmString } = useLocalSearchParams<{ film: string }>();

  const movie = JSON.parse(filmString) as MovieInfo;

  const { data: filmInfo, isLoading } = useQuery({
    queryKey: ["movie", movie.url],
    queryFn: async () => {
      const resp = await fetch(`https://fmovies.ps/${movie.url}`, {
        method: "GET",
        headers: F_HEADERS,
      });
      const html = await resp.text();

      const movieInfo = extractFilmInfo(html);

      return movieInfo;
    },
    enabled: !!movie,
  });

  const insets = useSafeAreaInsets();

  function addToWatchList() {
    addMovieToWatchList(movie);
    if (Platform.OS === "ios") {
      router.dismissTo("/(tabs)/watchlist");
    }
    router.replace("/(tabs)/watchlist");
  }
  return (
    <Box
      height={sHeight - insets.bottom - insets.top}
      justify="space-between"
      color={"background"}
      gap={10}
    >
      <Box>
        <FilmHeader film={movie} />
        {isLoading ? (
          <ThemedActivityIndicator />
        ) : (
          filmInfo !== undefined && <FilmInfo filmInfo={filmInfo} />
        )}
      </Box>
      <Box gap={20} direction="row" px={20}>
        <ThemedButton
          label={isInWatchList(movie.url) ? "Watching Later" : "Watch Later"}
          type={isInWatchList(movie.url) ? "primary" : "surface"}
          direction="column"
          size="sm"
          py={10}
          onPress={addToWatchList}
          flex={1}
        />
      </Box>
    </Box>
  );
};

export default Film;
