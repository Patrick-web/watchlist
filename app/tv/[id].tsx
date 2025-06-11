import Box from "@/components/reusables/Box";
import { sHeight } from "@/constants/dimensions.constant";
import React from "react";
import { router, useLocalSearchParams } from "expo-router";
import ThemedButton from "@/components/reusables/ThemedButton";
import ThemedActivityIndicator from "@/components/reusables/ThemedActivityIndicator";
import { Platform, ScrollView } from "react-native";
import {
  addShowToWatchList,
  addSubscribedShow,
  isInWatchList,
  isSubscribed,
} from "@/valitio.store";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import FilmHeader from "@/components/FilmHeader";
import { TVShowDetailsResponse } from "@/types/tmdb.types";
import useTVShowDetail from "@/hooks/useTVShowDetail.hook";
import ThemedListItem from "@/components/reusables/ThemedListItem";
import ThemedErrorCard from "@/components/reusables/ThemedErrorCard";

function ShowDetails() {
  const { preview: previewString, id } = useLocalSearchParams<{
    preview: string;
    id: string;
  }>();

  const showPreview = JSON.parse(previewString) as TVShowDetailsResponse;

  const { data: tvShow, isLoading, error } = useTVShowDetail(id);

  function subscribe() {
    if (!tvShow) return;
    addSubscribedShow(tvShow);
    if (Platform.OS === "ios") {
      router.dismissTo("/(tabs)/shows");
    }
    router.replace("/(tabs)/shows");
  }

  function addToWatchList() {
    if (!tvShow) return;
    addShowToWatchList(tvShow);

    if (Platform.OS === "ios") {
      router.dismissTo("/(tabs)/watchlist");
    }
    router.replace("/(tabs)/watchlist");
  }

  const insets = useSafeAreaInsets();

  return (
    <>
      <Box
        height={Platform.OS === "android" ? "100%" : sHeight - insets.top}
        pb={insets.bottom + 20}
        justify="space-between"
        color={"background"}
        gap={10}
      >
        <Box gap={10}>
          <FilmHeader preview={showPreview} />

          {isLoading && <ThemedActivityIndicator style={{ margin: "auto" }} />}

          <ScrollView>
            {error && <ThemedErrorCard error={error.message} />}
            {tvShow && (
              <Box gap={10}>
                <Box block>
                  <ThemedListItem label="Overview" value={tvShow.overview} />
                  <ThemedListItem
                    label="Rating"
                    value={tvShow.popularity.toString().slice(0, 3)}
                    varaint="horizontal"
                  />
                  <ThemedListItem
                    label="Released"
                    value={new Date(tvShow.first_air_date).toDateString()}
                    varaint="horizontal"
                  />
                  <ThemedListItem
                    label="Genres"
                    value={tvShow.genres.map((gen) => gen.name).join(", ")}
                    varaint="horizontal"
                  />
                </Box>
              </Box>
            )}
          </ScrollView>
        </Box>
        {tvShow && (
          <Box gap={20} direction="row" px={20} position="fixed" bottom={0}>
            <ThemedButton
              label={isSubscribed(tvShow.id) ? "Subscribed" : "Subscribe"}
              type={isSubscribed(tvShow.id) ? "primary" : "surface"}
              direction="column"
              size="sm"
              py={10}
              onPress={subscribe}
              flex={1}
            />
            {isSubscribed(tvShow.id) === false && (
              <ThemedButton
                label={
                  isInWatchList(tvShow.id) ? "Watching Later" : "Watch Later"
                }
                type={isInWatchList(tvShow.id) ? "primary" : "surface"}
                direction="column"
                size="sm"
                py={10}
                onPress={addToWatchList}
                flex={1}
              />
            )}
          </Box>
        )}
      </Box>
    </>
  );
}

export default ShowDetails;
