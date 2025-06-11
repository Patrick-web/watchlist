import Box from "@/components/reusables/Box";
import { sHeight } from "@/constants/dimensions.constant";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import ThemedButton from "@/components/reusables/ThemedButton";
import ThemedActivityIndicator from "@/components/reusables/ThemedActivityIndicator";
import { addMovieToWatchList, isInWatchList } from "@/valitio.store";
import { Platform } from "react-native";
import FilmHeader from "@/components/FilmHeader";
import { MovieResult } from "@/types/tmdb.types";
import useMovieDetail from "@/hooks/useMovieDetail.hook";
import ThemedListItem from "@/components/reusables/ThemedListItem";
import ThemedErrorCard from "@/components/reusables/ThemedErrorCard";

export default function MovieDetails() {
  const { preview: previewString, id } = useLocalSearchParams<{
    preview: string;
    id: string;
  }>();

  const moviePreview = JSON.parse(previewString) as MovieResult;

  const { data: movie, isLoading, error } = useMovieDetail(id);

  const insets = useSafeAreaInsets();

  function addToWatchList() {
    if (!movie) return;
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
        <FilmHeader preview={moviePreview} />

        {isLoading && <ThemedActivityIndicator />}

        {error && <ThemedErrorCard error={error.message} />}

        {movie && (
          <>
            <Box block>
              <ThemedListItem label="Overview" value={movie.overview} />
              <ThemedListItem
                label="Rating"
                value={movie.popularity.toString().slice(0, 3)}
                varaint="horizontal"
              />
              <ThemedListItem
                label="Released"
                value={new Date(movie.release_date).toDateString()}
                varaint="horizontal"
              />
              <ThemedListItem
                label="Genres"
                value={movie.genres.map((gen) => gen.name).join(", ")}
                varaint="horizontal"
              />
            </Box>
          </>
        )}
      </Box>
      {movie && (
        <Box gap={20} direction="row" px={20} position="fixed" bottom={0}>
          <ThemedButton
            label={isInWatchList(movie.id) ? "Watching Later" : "Watch Later"}
            type={isInWatchList(movie.id) ? "primary" : "surface"}
            direction="column"
            size="sm"
            py={20}
            onPress={addToWatchList}
            flex={1}
          />
        </Box>
      )}
    </Box>
  );
}
