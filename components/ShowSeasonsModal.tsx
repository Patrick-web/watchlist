import React from "react";
import Box, { AnimatedBox } from "./reusables/Box";
import { Image } from "expo-image";
import ThemedText from "./reusables/ThemedText";
import ThemedButton from "./reusables/ThemedButton";
import { POSTER_RATIO, sHeight } from "@/constants/dimensions.constant";
import ThemedTrueSheet from "./reusables/TrueSheet";
import { TVShowDetailsResponse } from "@/types/tmdb.types";
import { buildBackdropUrl, buildImageUrl } from "@/utils/api.utils";
import FilmPosterBackground from "./FilmPosterBackground";
import Animated, { FadeInDown, useAnimatedRef } from "react-native-reanimated";
import { Platform } from "react-native";

const POSTER_WIDTH = 50;
const POSTER_HEIGHT = POSTER_WIDTH * POSTER_RATIO;
const POSTER_RADIUS = POSTER_WIDTH / 2;

interface ShowSeasonsModalProps {
  show: TVShowDetailsResponse;
  visible: boolean;
  onClose: () => void;
  selectSeason: (season: TVShowDetailsResponse["seasons"][0]) => void;
}

export default function ShowSeasonsModal({
  show,
  visible,
  onClose,
  selectSeason,
}: ShowSeasonsModalProps) {
  const scrollAnimatedRef = useAnimatedRef<Animated.ScrollView>();

  function handleShowEpisodes(season: TVShowDetailsResponse["seasons"][0]) {
    selectSeason(season);
  }

  return (
    <>
      <ThemedTrueSheet
        visible={visible}
        onDismiss={onClose}
        cornerRadius={Platform.OS === "ios" ? 60 : 0}
        blurTint={"dark"}
        grabber={false}
      >
        <Box
          block
          style={{
            position: "relative",
            height: sHeight / 1.05,
          }}
        >
          <FilmPosterBackground url={buildBackdropUrl(show.backdrop_path)} />

          <Box
            block
            justify="space-between"
            align="center"
            direction="row"
            px={20}
            pb={20}
            pt={20}
          >
            <Image
              source={buildImageUrl(show.poster_path)}
              style={{
                width: POSTER_WIDTH,
                height: POSTER_HEIGHT,
                borderRadius: POSTER_RADIUS,
              }}
            />
            <ThemedText color={"white"} size={"xl"} fontWeight="bold">
              Seasons
            </ThemedText>
            <ThemedButton
              icon={{ name: "chevron-down" }}
              color="rgba(0,0,0,0.3)"
              size="sm"
              onPress={onClose}
            />
          </Box>
          <Animated.ScrollView
            ref={scrollAnimatedRef}
            contentContainerStyle={{
              padding: 15,
              paddingTop: 0,
            }}
          >
            {visible &&
              show.seasons
                .filter(
                  (season) => season.season_number >= 0 && season.poster_path,
                )
                .sort((a, b) => a.season_number - b.season_number)
                .map((season, index) => (
                  <RenderSeason
                    key={season.id}
                    season={season}
                    showId={show.id}
                    index={index}
                    onPress={handleShowEpisodes}
                  />
                ))}
          </Animated.ScrollView>
        </Box>
      </ThemedTrueSheet>
    </>
  );
}

function RenderSeason({
  season,
  showId,
  index,
  onPress,
}: {
  season: TVShowDetailsResponse["seasons"][0];
  showId: number;
  index: number;
  onPress: (season: TVShowDetailsResponse["seasons"][0]) => void;
}) {
  const hasPoster = season.poster_path ? true : false;

  function handleSeasonPress() {
    onPress(season);
  }

  return (
    <AnimatedBox
      mb={20}
      radius={50}
      viewProps={{
        entering: FadeInDown.delay(index * 300)
          .duration(300)
          .springify(),
      }}
    >
      <ThemedButton
        type="surface"
        onPress={handleSeasonPress}
        radius={50}
        pa={0}
        overflow="hidden"
        color={"rgba(255,255,255,0.1)"}
      >
        <Box
          direction="row"
          gap={15}
          align="center"
          pa={15}
          position="relative"
          zIndex={2}
        >
          {hasPoster && (
            <Image
              source={buildImageUrl(season.poster_path)}
              style={{
                width: 70,
                height: 70 * POSTER_RATIO,
                borderRadius: 60,
              }}
            />
          )}
          <Box flex={1} gap={8} block>
            <Box direction="row" align="center" justify="space-between" block>
              <ThemedText fontWeight="bold" size="lg" color="white">
                {season.name || `Season ${season.season_number}`}
              </ThemedText>
              {season.episode_count > 0 && (
                <ThemedText size="sm" opacity={1} color="white">
                  {season.episode_count} episodes
                </ThemedText>
              )}
            </Box>
            {season.overview && (
              <ThemedText size="sm" opacity={0.9} color="white">
                {season.overview.length > 80
                  ? `${season.overview.substring(0, 80)}...`
                  : season.overview}
              </ThemedText>
            )}
          </Box>
        </Box>
      </ThemedButton>
    </AnimatedBox>
  );
}
