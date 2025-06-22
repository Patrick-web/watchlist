import React from "react";
import Box, { AnimatedBox } from "./reusables/Box";
import { Image } from "expo-image";
import ThemedText from "./reusables/ThemedText";
import ThemedButton from "./reusables/ThemedButton";
import { POSTER_RATIO, sHeight } from "@/constants/dimensions.constant";
import ThemedTrueSheet from "./reusables/TrueSheet";
import { useThemeMode } from "@/hooks/useTheme.hook";
import { TVShowDetailsResponse } from "@/types/tmdb.types";
import { buildBackdropUrl, buildImageUrl } from "@/utils/api.utils";
import FilmPosterBackground from "./FilmPosterBackground";
import Animated, { FadeInDown, useAnimatedRef } from "react-native-reanimated";
import useSeasonEpisodes from "@/hooks/useSeasonEpisodes.hook";
import ThemedErrorCard from "./reusables/ThemedErrorCard";
import ThemedCard from "./reusables/ThemedCard";
import ThemedActivityIndicator from "./reusables/ThemedActivityIndicator";
import { Platform } from "react-native";

const POSTER_WIDTH = 50;
const POSTER_HEIGHT = POSTER_WIDTH * POSTER_RATIO;
const POSTER_RADIUS = POSTER_WIDTH / 2;

interface ShowEpisodesModalProps {
  show: TVShowDetailsResponse;
  season: TVShowDetailsResponse["seasons"][0] | null;
  visible: boolean;
  onClose: () => void;
}

export default function ShowEpisodesModal({
  show,
  season,
  visible,
  onClose,
}: ShowEpisodesModalProps) {
  const themeMode = useThemeMode();
  const scrollAnimatedRef = useAnimatedRef<Animated.ScrollView>();

  const {
    data: seasonDetails,
    isLoading,
    error,
  } = useSeasonEpisodes(show.id, season?.season_number || 0, {
    enabled: visible && season !== null,
  });

  return (
    <ThemedTrueSheet
      visible={visible}
      onDismiss={onClose}
      cornerRadius={Platform.OS === "ios" ? 60 : 0}
      blurTint={themeMode}
      grabber={false}
    >
      <Box
        block
        style={{
          height: sHeight / 1.1,
          position: "relative",
        }}
      >
        {season ? (
          <>
            <FilmPosterBackground url={buildBackdropUrl(show.backdrop_path)} />

            <Box
              block
              justify="space-between"
              align="center"
              direction="row"
              px={20}
              pb={20}
              pt={20}
              gap={20}
            >
              <Image
                source={buildImageUrl(show.poster_path)}
                style={{
                  width: POSTER_WIDTH,
                  height: POSTER_HEIGHT,
                  borderRadius: POSTER_RADIUS,
                }}
              />
              <Box flex={1}>
                <ThemedText color={"white"} size={"xl"} fontWeight="bold">
                  {season.name || `Season ${season.season_number}`}
                </ThemedText>
                <ThemedText color={"white"} size={"sm"} opacity={0.8}>
                  {show.name}
                </ThemedText>
              </Box>
              <ThemedButton
                icon={{ name: "chevron-down" }}
                color="rgba(255,255,255,0.1)"
                size="sm"
                onPress={onClose}
              />
            </Box>

            {season.overview && (
              <Box px={20} pb={20}>
                <ThemedText size="sm" color="white" opacity={0.9}>
                  {season.overview}
                </ThemedText>
              </Box>
            )}

            <Box flex={1}>
              {isLoading && (
                <ThemedCard
                  align="center"
                  color={"rgba(255,255,255,0.1)"}
                  ma={20}
                  radius={80}
                >
                  <ThemedActivityIndicator color={"white"} />
                  <ThemedText size="sm" color="white">
                    Loading episodes...
                  </ThemedText>
                </ThemedCard>
              )}

              {error && (
                <Box px={20}>
                  <ThemedErrorCard
                    title="Failed to load episodes"
                    error={error.message}
                  />
                </Box>
              )}

              {seasonDetails?.episodes && (
                <Animated.ScrollView
                  ref={scrollAnimatedRef}
                  contentContainerStyle={{
                    padding: 20,
                    paddingBottom: 40,
                    paddingHorizontal: 10,
                    paddingTop: 0,
                  }}
                >
                  <Box gap={1} overflow="hidden" radius={40}>
                    {seasonDetails.episodes.map((episode, index) => (
                      <AnimatedBox
                        key={episode.id}
                        color="rgba(255,255,255,0.05)"
                        pa={20}
                        radius={0}
                        gap={5}
                        viewProps={{
                          entering: FadeInDown.delay(index * 100)
                            .duration(300)
                            .springify(),
                        }}
                      >
                        <ThemedText fontWeight="medium" color="white" mb={4}>
                          {episode.episode_number}. {episode.name}
                        </ThemedText>
                        {episode.overview && (
                          <ThemedText size="sm" color="white">
                            {episode.overview}
                          </ThemedText>
                        )}
                        {episode.air_date && (
                          <ThemedText
                            size="xs"
                            color="white"
                            opacity={0.8}
                            mt={4}
                          >
                            {new Date(episode.air_date).toDateString()}
                          </ThemedText>
                        )}
                      </AnimatedBox>
                    ))}
                  </Box>
                </Animated.ScrollView>
              )}
            </Box>
          </>
        ) : (
          <Box block align="center" justify="center" px={20}>
            <ThemedCard
              align="center"
              color={"rgba(255,255,255,0.3)"}
              ma={20}
              radius={80}
            >
              <ThemedText size="lg" color="white" fontWeight="bold" mb={10}>
                No Season Selected
              </ThemedText>
              <ThemedText size="sm" color="white" opacity={0.8}>
                Please select a season to view episodes
              </ThemedText>
            </ThemedCard>
            <ThemedButton
              icon={{ name: "chevron-down" }}
              color="rgba(0,0,0,0.3)"
              size="sm"
              onPress={onClose}
              style={{ marginTop: 20 }}
            />
          </Box>
        )}
      </Box>
    </ThemedTrueSheet>
  );
}
