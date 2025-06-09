import React, { useState } from "react";
import Box, { AnimatedBox } from "./reusables/Box";
import { Image } from "expo-image";
import ThemedText from "./reusables/ThemedText";
import ThemedButton from "./reusables/ThemedButton";
import { POSTER_RATIO, sHeight, sWidth } from "@/constants/dimensions.constant";
import { unsubscribeShow } from "@/valitio.store";
import Haptics from "expo-haptics";
import ThemedTrueSheet from "./reusables/TrueSheet";
import { useTheme, useThemeMode } from "@/hooks/useTheme.hook";
import { TVShowDetailsResponse } from "@/types/tmdb.types";
import { buildImageUrl } from "@/utils/api.utils";
import FilmPosterBackground from "./FilmPosterBackground";
import SeasonsModal from "./SeasonsModal";
import ThemedIcon from "./reusables/ThemedIcon";
import { FlatList, ScrollView } from "react-native";

const POSTER_WIDTH = sWidth / 2 - 40;

interface ShowDetailsModalProps {
  show: TVShowDetailsResponse;
  visible: boolean;
  onClose: () => void;
}

export default function ShowDetailsModal({
  show,
  visible,
  onClose,
}: ShowDetailsModalProps) {
  const themeMode = useThemeMode();
  const [showSeasons, setShowSeasons] = useState(false);

  function unSubscribe() {
    unsubscribeShow(show);
    Haptics?.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    onClose();
  }

  function handleEpisodesPress() {
    setShowSeasons(true);
  }

  return (
    <>
      <ThemedTrueSheet
        visible={visible}
        onDismiss={() => {
          setShowSeasons(false);
          onClose();
        }}
        cornerRadius={60}
        blurTint={themeMode}
        grabber={false}
      >
        <Box
          justify="center"
          align="center"
          gap={showSeasons ? 10 : 20}
          pb={showSeasons ? 10 : 60}
          pt={showSeasons ? 20 : 80}
        >
          <Box direction="row" block justify="center" align="center">
            {visible && !showSeasons && (
              <Box
                flex={1}
                align="flex-end"
                direction="row"
                alignSelf="flex-start"
                zIndex={4}
                position="absolute"
                top={30}
                left={20}
              >
                <ThemedText
                  size={"xl"}
                  fontWeight="bold"
                  transform={[{ translateY: "-35%" }]}
                  color={"white"}
                >
                  SN
                </ThemedText>
                <ThemedText
                  size={120}
                  fontWeight="bold"
                  textShadowColor={"rgba(0,0,0,0.6)"}
                  textShadowRadius={8}
                  textShadowOffset={{ width: 0, height: 8 }}
                  color={"white"}
                >
                  {show.last_episode_to_air.season_number}
                </ThemedText>
              </Box>
            )}
            <Image
              source={buildImageUrl(show.poster_path)}
              style={
                showSeasons
                  ? {
                      width: POSTER_WIDTH * 0.5,
                      height: POSTER_WIDTH * 0.5 * POSTER_RATIO,
                      borderRadius: 20,
                    }
                  : {
                      width: POSTER_WIDTH * 1.5,
                      height: POSTER_WIDTH * 1.5 * POSTER_RATIO,
                      borderRadius: 40,
                    }
              }
            />
            {visible && !showSeasons && (
              <Box
                align="flex-end"
                justify="flex-end"
                direction="row"
                position="absolute"
                bottom={40}
                right={
                  show.last_episode_to_air.episode_number.toString().length ===
                  1
                    ? 30
                    : 0
                }
              >
                <ThemedText
                  size={100}
                  fontWeight="bold"
                  textShadowColor={"rgba(0,0,0,0.6)"}
                  textShadowRadius={8}
                  textShadowOffset={{ width: 0, height: 8 }}
                  color={"white"}
                >
                  {show.last_episode_to_air.episode_number}
                </ThemedText>
                <ThemedText
                  size={"xl"}
                  fontWeight="bold"
                  transform={[{ translateY: "-25%" }]}
                  color={"white"}
                >
                  EP
                </ThemedText>
              </Box>
            )}
          </Box>
          <FilmPosterBackground url={buildImageUrl(show.poster_path)} />
          <ThemedText size={"xxxl"} fontWeight="bold" color={"white"}>
            {show.name}
          </ThemedText>
          {!showSeasons && (
            <Box gap={10} block px={20}>
              <ThemedButton
                type={"translucent"}
                color={"rgba(255,255,255,0.2)"}
                labelProps={{
                  color: "white",
                }}
                label={"Episodes"}
                icon={{
                  name: "playlist-play",
                  source: "MaterialCommunityIcons",
                  color: "white",
                }}
                direction="column"
                onPress={handleEpisodesPress}
              />
              <ThemedButton
                type={"translucent"}
                color={"rgba(255,255,255,0.2)"}
                labelProps={{
                  color: "white",
                }}
                label={"UnSub"}
                icon={{
                  name: "bell-cancel-outline",
                  source: "MaterialCommunityIcons",
                  color: "white",
                }}
                direction="column"
                onPress={unSubscribe}
              />
            </Box>
          )}
          <Box height={sHeight / 1.5} block>
            <ScrollView
              contentContainerStyle={{
                padding: 20,
                paddingBottom: 100,
              }}
            >
              {show.seasons
                .filter((season) => season.season_number >= 0)
                .sort((a, b) => a.season_number - b.season_number)
                .map((season) => (
                  <RenderSeason key={season.id} season={season} />
                ))}
            </ScrollView>
          </Box>
        </Box>
      </ThemedTrueSheet>
    </>
  );
}

function RenderSeason({
  season,
}: {
  season: TVShowDetailsResponse["seasons"][0];
}) {
  const hasPoster = season.poster_path;

  function handleSeasonPress(season: TVShowDetailsResponse["seasons"][0]) {
    // Handle season press here
    console.log("Pressed season:", season);
  }

  return (
    <ThemedButton
      type="surface"
      onPress={() => handleSeasonPress(season)}
      mb={12}
      radius={40}
      pa={0}
      overflow="hidden"
      color={"rgba(0,0,0,0.2)"}
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
        <Box flex={1} gap={4}>
          <ThemedText
            fontWeight="medium"
            size="md"
            color="white"
            textShadowColor="rgba(0,0,0,0.5)"
            textShadowRadius={4}
            textShadowOffset={{ width: 0, height: 2 }}
          >
            {season.name || `Season ${season.season_number}`}
          </ThemedText>
          {season.overview && (
            <ThemedText
              size="xs"
              opacity={0.7}
              color="white"
              textShadowColor="rgba(0,0,0,0.5)"
              textShadowRadius={2}
              textShadowOffset={{ width: 0, height: 1 }}
            >
              {season.overview.length > 60
                ? `${season.overview.substring(0, 60)}...`
                : season.overview}
            </ThemedText>
          )}
        </Box>
        <Box opacity={0.6}>
          <ThemedIcon name="chevron-right" size="sm" color="white" />
        </Box>
      </Box>
    </ThemedButton>
  );
}
