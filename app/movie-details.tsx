import Box from "@/components/reusables/Box";
import { POSTER_RATIO } from "@/constants/dimensions.constant";
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
import { addMovieToWatchList } from "@/valitio.store";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme, useThemeMode } from "@/hooks/useTheme.hook";
import { Platform } from "react-native";
import { ScreenRoot } from "@/components/PlatformScreenRoot";

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
    <ScreenRoot>
      <Box>
        <ImageBackground
          source={movie.poster}
          blurRadius={100}
          style={{
            width: "100%",
          }}
        >
          {Platform.OS !== "ios" && (
            <ThemedButton
              icon={{ name: "arrow-left", color: "white" }}
              type="surface"
              position="absolute"
              color={"rgba(0,0,0,0.2)"}
              top={insets.top}
              left={10}
              onPress={router.back}
              zIndex={40}
            />
          )}
          <Box
            block
            align="center"
            color={"rgba(0,0,0,0.3)"}
            pt={Platform.OS === "ios" ? 20 : insets.top}
          >
            <Image
              source={movie.poster}
              style={{
                width: POSTER_WIDTH,
                height: POSTER_HEIGHT,
                borderRadius: POSTER_WIDTH / 2,
              }}
            />

            <LinearGradient
              colors={[
                themeMode === "dark"
                  ? "rgba(32,32,32,0)"
                  : "rgba(255,255,255,0)",
                theme.background,
              ]}
              style={{ width: "100%" }}
            >
              <Box px={20} py={10}>
                <ThemedText size={"xxl"} align="center" fontWeight="bold">
                  {movie.title}
                </ThemedText>
              </Box>
            </LinearGradient>
          </Box>
        </ImageBackground>
        {isLoading ? (
          <ThemedActivityIndicator />
        ) : (
          filmInfo !== undefined && (
            <Box block>
              <ThemedListItem
                label="Duration"
                value={filmInfo.duration}
                varaint="horizontal"
              />
              <ThemedListItem
                label="Released"
                value={filmInfo.releaseDate}
                varaint="horizontal"
              />
              <ThemedListItem
                label="Rating"
                value={filmInfo.rating}
                varaint="horizontal"
              />
              <ThemedListItem label="Genre" value={filmInfo.genre} />
              <ThemedListItem label="Cast" value={filmInfo.casts.join(", ")} />
            </Box>
          )
        )}
      </Box>
      <Box gap={20} direction="row" px={20}>
        <ThemedButton
          label={"Add to Watchlist"}
          type="surface"
          direction="column"
          size="sm"
          py={10}
          onPress={addToWatchList}
          flex={1}
        />
      </Box>
    </ScreenRoot>
  );
};

export default Film;
