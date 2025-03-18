import Box from "@/components/reusables/Box";
import { POSTER_RATIO, sHeight } from "@/constants/dimensions.constant";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image, ImageBackground } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { extractFilmInfo, F_HEADERS } from "@/lib/scrape";
import { MovieInfo } from "@/types";
import ThemedButton from "@/components/reusables/ThemedButton";
import ThemedActivityIndicator from "@/components/reusables/ThemedActivityIndicator";
import ThemedText from "@/components/reusables/ThemedText";
import ThemedListItem from "@/components/reusables/ThemedListItem";
import { addMovieToWatchList, isInWatchList } from "@/valitio.store";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme, useThemeMode } from "@/hooks/useTheme.hook";
import { Platform } from "react-native";
import he from "he";
import FilmInfo from "@/components/FilmInfo";
import FilmHeader from "@/components/FilmHeader";

const POSTER_HEIGHT = 250;
const POSTER_WIDTH = POSTER_HEIGHT / POSTER_RATIO;

const Film = () => {
  const { film: filmString } = useLocalSearchParams<{ film: string }>();

  const movie = JSON.parse(filmString) as MovieInfo;

  const { data: filmInfo, isLoading } = useQuery({
    queryKey: ["movie", movie.url],
    queryFn: async () => {
      console.log({ film: movie });
      const resp = await fetch(`https://fmovies.ps/${movie.url}`, {
        method: "GET",
        headers: F_HEADERS,
      });
      const html = await resp.text();

      const movieInfo = extractFilmInfo(html);

      console.log({ movieInfo });

      return movieInfo;
    },
    enabled: !!movie,
  });

  const insets = useSafeAreaInsets();

  const theme = useTheme();
  const themeMode = useThemeMode();

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
