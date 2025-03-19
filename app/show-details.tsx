import Box from "@/components/reusables/Box";
import { sHeight } from "@/constants/dimensions.constant";
import React, { useRef, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { useQueries, useQuery } from "@tanstack/react-query";
import { extractFilmInfo, F_HEADERS } from "@/lib/scrape";
import { Season, ShowInfo, FilmResult } from "@/types";
import ThemedButton from "@/components/reusables/ThemedButton";
import ThemedActivityIndicator from "@/components/reusables/ThemedActivityIndicator";
import ThemedText from "@/components/reusables/ThemedText";
import { fetchShowEpisodes, fetchShowSeasons } from "@/lib/refresh";
import { Platform, ScrollView } from "react-native";
import {
  addShowToWatchList,
  addSubscribedShow,
  isInWatchList,
  isSubscribed,
} from "@/valitio.store";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import FilmInfo from "@/components/FilmInfo";
import FilmHeader from "@/components/FilmHeader";

function ShowDetails() {
  const { film: filmString } = useLocalSearchParams<{ film: string }>();

  const show = JSON.parse(filmString) as FilmResult;

  const [fullShow, setFullShow] = useState<ShowInfo>();

  const filmId = show.url.match(/\d*$/g)?.[0];

  const [currentSeason, setCurrentSeason] = useState<Season | null>();

  const filmQueries = useQueries({
    queries: [
      {
        queryKey: ["film", show.url],
        queryFn: async () => {
          console.log({ film: show });
          const resp = await fetch(`https://fmovies.ps/${show.url}`, {
            method: "GET",
            headers: F_HEADERS,
          });
          const html = await resp.text();

          const filmInfo = extractFilmInfo(html);

          console.log({ filmInfo });

          return filmInfo;
        },
        enabled: !!show,
      },
      {
        queryKey: ["show", "seasons", filmId],
        queryFn: async () => {
          if (!filmId) {
            throw new Error("No film ID found");
          }
          const seasons = await fetchShowSeasons(filmId);
          console.log({ seasons });
          const lastSeason = seasons[seasons.length - 1];
          setCurrentSeason(lastSeason);
          return seasons;
        },
        enabled: !!filmId,
      },
    ],
  });

  const filmInfo = filmQueries[0].data;
  const seasons = filmQueries[1].data;

  const episodesScrollRef = useRef<ScrollView>(null);

  const { data: currentEpisodes, isLoading: loadingEpisodes } = useQuery({
    queryKey: ["show", "season", "episodes", filmId, currentSeason?.id],
    queryFn: async () => {
      if (!currentSeason) {
        throw new Error("No season ID found");
      }
      const season = currentSeason;
      const episodes = await fetchShowEpisodes(currentSeason.id);
      console.log({ episodes });

      episodesScrollRef.current?.scrollToEnd({ animated: true });

      const lastEpisode = episodes[episodes.length - 1];
      const lastSeason = seasons![seasons!.length - 1];

      console.log({ lastSeason, lastEpisode });

      if (currentSeason.id === currentSeason.id) {
        const fullShow: ShowInfo = {
          ...show,
          episode: lastEpisode.episode,
          season: lastSeason.seasonNumber,
        };
        console.log({ fullShow });
        setFullShow(fullShow);
      }

      return {
        season,
        episodes,
      };
    },
    enabled: !!currentSeason,
  });

  function subscribe() {
    let $show = fullShow;

    if (!fullShow) {
      console.error("No Full Show");
      return;
    }

    if (__DEV__) {
      $show = {
        ...fullShow,
        episode:
          fullShow.episode !== 1 ? fullShow.episode! - 1 : fullShow.episode,
      };
    }

    console.log({ $show });
    if ($show === undefined) return;

    addSubscribedShow($show);
    if (Platform.OS === "ios") {
      router.dismissTo("/(tabs)/shows");
    }
    router.replace("/(tabs)/shows");
  }

  function addToWatchList() {
    if (fullShow === undefined) return;
    addShowToWatchList(fullShow);

    if (Platform.OS === "ios") {
      router.dismissTo("/(tabs)/watchlist");
    }
    router.replace("/(tabs)/watchlist");
  }

  const insets = useSafeAreaInsets();
  return (
    <Box
      height={Platform.OS === "android" ? "100%" : sHeight - insets.top}
      pb={insets.bottom + 20}
      justify="space-between"
      color={"background"}
      gap={10}
    >
      <Box gap={10}>
        <FilmHeader film={show} />
        <Box align="flex-start" px={10} gap={0}>
          <Box direction="row" gap={5}>
            {seasons !== undefined &&
              seasons.map((season) => (
                <ThemedButton
                  key={season.id}
                  size="xs"
                  label={season.title ?? ""}
                  type="text"
                  color={
                    currentSeason?.id === season.id
                      ? "lightBackground"
                      : "transparent"
                  }
                  radiusTop={15}
                  radiusBottom={0}
                  onPress={() => setCurrentSeason(season)}
                  labelProps={{ color: "text" }}
                />
              ))}
          </Box>
          <Box
            radiusBottom={10}
            borderTopRightRadius={10}
            borderTopLeftRadius={currentSeason?.seasonNumber !== 1 ? 10 : 0}
            color={"lightBackground"}
            py={10}
            block
          >
            <ScrollView
              ref={episodesScrollRef}
              horizontal
              showsHorizontalScrollIndicator={false}
            >
              <Box direction="row" gap={1}>
                {loadingEpisodes && <ThemedActivityIndicator />}
                {currentEpisodes !== undefined &&
                  currentEpisodes.episodes.map((eps) => (
                    <Box
                      key={eps.title}
                      px={8}
                      py={2}
                      borderRightWidth={0.5}
                      borderRightColor={"background"}
                    >
                      <ThemedText size={"xs"}>{eps.title}</ThemedText>
                    </Box>
                  ))}
              </Box>
            </ScrollView>
          </Box>
        </Box>
        {filmQueries[0].isLoading ? (
          <ThemedActivityIndicator />
        ) : (
          filmInfo !== undefined && <FilmInfo filmInfo={filmInfo} />
        )}
      </Box>
      {fullShow && fullShow.episode && fullShow.season && (
        <Box gap={20} direction="row" px={20}>
          <ThemedButton
            label={isSubscribed(fullShow.url) ? "Subscribed" : "Subscribe"}
            type={isSubscribed(fullShow.url) ? "primary" : "surface"}
            direction="column"
            size="sm"
            py={10}
            onPress={subscribe}
            flex={1}
          />
          {isSubscribed(fullShow.url) === false && (
            <ThemedButton
              label={
                isInWatchList(fullShow.url) ? "Watching Later" : "Watch Later"
              }
              type={isInWatchList(fullShow.url) ? "primary" : "surface"}
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
  );
}

export default ShowDetails;
