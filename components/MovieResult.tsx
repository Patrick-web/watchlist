import { MovieInfo } from "@/types";
import {
  addMovieToWatchList,
  isMovieInWatchList,
  PERSISTED_APP_STATE,
} from "@/valitio.store";
import React, { useState } from "react";
import { useSnapshot } from "valtio";
import ThemedButton from "./reusables/ThemedButton";
import { POSTER_RATIO } from "@/constants/dimensions.constant";
import { useTheme } from "@/hooks/useTheme.hook";
import { toast } from "sonner-native";
import Movie from "./Movie";
import ThemedIcon from "./reusables/ThemedIcon";
import Box from "./reusables/Box";
import { SUCCESS_ALERT } from "@/constants/common.constants";

const POSTER_WIDTH = 100;
const POSTER_HEIGHT = POSTER_RATIO * POSTER_WIDTH;

export default function MovieResult({ movie }: { movie: MovieInfo }) {
  const APP_STATE = useSnapshot(PERSISTED_APP_STATE);
  function addToWatchList() {
    addMovieToWatchList(movie);
  }

  const [showDetails, setShowDetails] = useState(true);

  const theme = useTheme();

  return (
    <Movie movie={movie}>
      <Box block align="flex-start">
        <ThemedButton
          onPress={addToWatchList}
          type={isMovieInWatchList(movie) ? "text" : "surface"}
          size="xs"
          label={isMovieInWatchList(movie) ? "Watching Later" : "Watch Later"}
          labelProps={{
            color: isMovieInWatchList(movie) ? theme.primary : theme.onSurface,
          }}
          icon={
            isMovieInWatchList(movie)
              ? {
                  name: "checkmark-circle",
                  source: "Ionicons",
                  color: theme.primary,
                }
              : undefined
          }
          disabled={isMovieInWatchList(movie) ? true : false}
          opacity={1}
          mt={10}
        />
      </Box>
    </Movie>
  );
}
