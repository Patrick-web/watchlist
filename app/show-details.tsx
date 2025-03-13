import Box from "@/components/reusables/Box";
import { POSTER_RATIO } from "@/constants/dimensions.constant";
import React, { useRef, useState } from "react";
import { Image, ImageBackground } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { useQueries, useQuery } from "@tanstack/react-query";
import { extractFilmInfo, F_HEADERS } from "@/lib/scrape";
import { Season, ShowInfo, FilmResult } from "@/types";
import ThemedButton from "@/components/reusables/ThemedButton";
import ThemedActivityIndicator from "@/components/reusables/ThemedActivityIndicator";
import ThemedText from "@/components/reusables/ThemedText";
import ThemedListItem from "@/components/reusables/ThemedListItem";
import { fetchShowEpisodes, fetchShowSeasons } from "@/lib/refresh";
import { Platform, ScrollView } from "react-native";
import { addShowToWatchList, addSubscribedShow } from "@/valitio.store";
import { useTheme, useThemeMode } from "@/hooks/useTheme.hook";
import { LinearGradient } from "expo-linear-gradient";
import { ScreenRoot } from "@/components/PlatformScreenRoot";

const POSTER_HEIGHT = 250;
const POSTER_WIDTH = POSTER_HEIGHT / POSTER_RATIO;

const Film = () => {
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

  const theme = useTheme();
  const themeMode = useThemeMode();

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

  return (
    <ScreenRoot>
      <Box gap={10}>
        <ImageBackground
          source={show.poster}
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
              top={10}
              left={10}
              onPress={router.back}
            />
          )}
          <Box block align="center" color={"rgba(0,0,0,0.3)"} pt={20}>
            <Image
              source={show.poster}
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
                <ThemedText
                  size={"xxl"}
                  align="center"
                  fontWeight="bold"
                  color={"white"}
                >
                  {show.title}
                </ThemedText>
              </Box>
            </LinearGradient>
          </Box>
        </ImageBackground>
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
      {fullShow && fullShow.episode && fullShow.season && (
        <Box gap={20} direction="row" px={20}>
          <ThemedButton
            label={"Subscribe"}
            type="surface"
            direction="column"
            size="sm"
            py={10}
            onPress={subscribe}
            flex={1}
          />
          <ThemedButton
            label={"Watch Later"}
            type="surface"
            direction="column"
            size="sm"
            py={10}
            onPress={addToWatchList}
            flex={1}
          />
        </Box>
      )}
    </ScreenRoot>
  );
};

export default Film;
