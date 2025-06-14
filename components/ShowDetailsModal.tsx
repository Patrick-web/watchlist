import React, { useState } from "react";
import Box, { AnimatedBox } from "./reusables/Box";
import { Image } from "expo-image";
import ThemedText from "./reusables/ThemedText";
import ThemedButton from "./reusables/ThemedButton";
import { POSTER_RATIO, sHeight, sWidth } from "@/constants/dimensions.constant";
import { unsubscribeShow } from "@/valitio.store";
import Haptics from "expo-haptics";
import ThemedTrueSheet from "./reusables/TrueSheet";
import { useThemeMode } from "@/hooks/useTheme.hook";
import { TVShowDetailsResponse } from "@/types/tmdb.types";
import { buildBackdropUrl, buildImageUrl } from "@/utils/api.utils";
import FilmPosterBackground from "./FilmPosterBackground";
import Animated, {
  Easing,
  FadeInDown,
  useAnimatedRef,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import useSeasonEpisodes from "@/hooks/useSeasonEpisodes.hook";
import ThemedErrorCard from "./reusables/ThemedErrorCard";
import ThemedCard from "./reusables/ThemedCard";
import ThemedActivityIndicator from "./reusables/ThemedActivityIndicator";
import { Platform } from "react-native";
import ThemedModal from "./reusables/ThemedModal";

const POSTER_WIDTH = sWidth / 1.5;
const POSTER_HEIGHT = POSTER_WIDTH * POSTER_RATIO;
const POSTER_RADIUS = POSTER_WIDTH / 5;

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

  const [showConfirmUnsubscribe, setShowConfirmUnsubscribe] = useState(false);

  function unSubscribe() {
    setShowConfirmUnsubscribe(false);
    unsubscribeShow(show);
    Haptics?.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    onClose();
  }

  const scrollAnimatedRef = useAnimatedRef<Animated.ScrollView>();

  const seasonsContainerOffset = useSharedValue(sHeight / 1.3);
  const scrollWrapperStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withTiming(seasonsContainerOffset.value, {
            easing: Easing.inOut(Easing.quad),
          }),
        },
      ],
      opacity: withTiming(seasonsContainerOffset.value === 0 ? 1 : 0, {
        duration: 200,
        easing: Easing.inOut(Easing.quad),
      }),
    };
  });

  const [seasonsVisible, setSeasonsVisible] = useState(false);

  function showSeasons() {
    setSeasonsVisible(true);
    seasonsContainerOffset.value = 0;
  }

  function hideSeasons() {
    setSeasonsVisible(false);
    seasonsContainerOffset.value = sHeight / 1.3;
  }

  return (
    <>
      <ThemedTrueSheet
        visible={visible}
        onDismiss={() => {
          hideSeasons();
          onClose();
        }}
        cornerRadius={Platform.OS === "ios" ? 60 : 0}
        blurTint={themeMode}
        grabber={false}
      >
        <Box
          justify="center"
          align="center"
          gap={20}
          pb={60}
          pt={80}
          position="relative"
        >
          <Box direction="row" block justify="center" align="center">
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
              <ThemedText size={"xl"} fontWeight="bold" color={"white"}>
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
            <Image
              source={buildImageUrl(show.poster_path)}
              style={{
                width: POSTER_WIDTH,
                height: POSTER_HEIGHT,
                borderRadius: POSTER_RADIUS,
              }}
            />
            <Box
              align="flex-end"
              justify="flex-end"
              direction="row"
              position="absolute"
              bottom={40}
              right={
                show.last_episode_to_air.episode_number.toString().length === 1
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
              <ThemedText size={"xl"} fontWeight="bold" color={"white"}>
                EP
              </ThemedText>
            </Box>
          </Box>
          <FilmPosterBackground url={buildImageUrl(show.poster_path)} />
          <ThemedText size={"xxxl"} fontWeight="bold" color={"white"}>
            {show.name}
          </ThemedText>
          <Box gap={10} block px={20} direction="row">
            <ThemedButton
              type={"translucent"}
              color={"rgba(255,255,255,0.2)"}
              labelProps={{
                color: "white",
              }}
              label={"Seasons"}
              icon={{
                name: "playlist-play",
                source: "MaterialCommunityIcons",
                color: "white",
              }}
              direction="column"
              onPress={() => {
                showSeasons();
              }}
              flex={1}
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
              onPress={() => {
                setShowConfirmUnsubscribe(true);
              }}
              px={20}
            />
            <ThemedModal
              visible={showConfirmUnsubscribe}
              title="Unsubscribe from Show?"
              close={() => setShowConfirmUnsubscribe(false)}
              icon={{
                name: "bell-cancel-outline",
                source: "MaterialCommunityIcons",
              }}
            >
              <ThemedText>
                This show will be removed from your subscriptions.
              </ThemedText>
              <Box block direction="row" gap={20} mt={10}>
                <ThemedButton
                  label={"Cancel"}
                  flex={1}
                  type="surface"
                  onPress={() => setShowConfirmUnsubscribe(false)}
                />
                <ThemedButton
                  label={"Unsubscribe"}
                  flex={1}
                  onPress={unSubscribe}
                  color={"red"}
                />
              </Box>
            </ThemedModal>
          </Box>
          <AnimatedBox
            block
            style={
              [
                {
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: 0,
                  backgroundColor: "rgba(255,255,255,0.5)",
                  height: sHeight / 1.3,
                },
                scrollWrapperStyles,
              ] as any
            }
          >
            <Image
              source={buildBackdropUrl(show.poster_path)}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: -1,
              }}
              blurRadius={400}
            />
            <Animated.ScrollView
              ref={scrollAnimatedRef}
              contentContainerStyle={{
                padding: 20,
              }}
            >
              <Box
                block
                justify="space-between"
                align="center"
                direction="row"
                px={10}
                pb={10}
              >
                <ThemedText color={"white"} size={"xl"} fontWeight="bold">
                  Seasons
                </ThemedText>
                <ThemedButton
                  icon={{ name: "chevron-down" }}
                  color="rgba(0,0,0,0.3)"
                  size="sm"
                  onPress={() => {
                    hideSeasons();
                  }}
                />
              </Box>

              {seasonsVisible &&
                show.seasons
                  .filter((season) => season.season_number >= 0)
                  .sort((a, b) => a.season_number - b.season_number)
                  .map((season, index) => (
                    <RenderSeason
                      key={season.id}
                      season={season}
                      showId={show.id}
                      index={index}
                    />
                  ))}
            </Animated.ScrollView>
          </AnimatedBox>
        </Box>
      </ThemedTrueSheet>
    </>
  );
}

function RenderSeason({
  season,
  showId,
  index,
}: {
  season: TVShowDetailsResponse["seasons"][0];
  showId: number;
  index: number;
}) {
  const hasPoster = season.poster_path;
  const [showEpisodes, setShowEpisodes] = useState(false);

  const {
    data: seasonDetails,
    isLoading,
    error,
  } = useSeasonEpisodes(showId, season.season_number, {
    enabled: showEpisodes,
  });

  function handleSeasonPress(season: TVShowDetailsResponse["seasons"][0]) {
    setShowEpisodes(!showEpisodes);
    console.log("Pressed season:", season);
  }

  return (
    <AnimatedBox
      mb={20}
      radius={70}
      position={showEpisodes ? "absolute" : "relative"}
      top={showEpisodes ? 0 : undefined}
      left={showEpisodes ? 0 : undefined}
      right={showEpisodes ? 0 : undefined}
      bottom={showEpisodes ? 0 : undefined}
      height={showEpisodes ? sHeight / 1.5 : undefined}
      zIndex={showEpisodes ? 1 : 0}
      viewProps={{
        entering: FadeInDown.delay(index * 100)
          .duration(300)
          .springify(),
      }}
    >
      {showEpisodes && (
        <FilmPosterBackground url={buildImageUrl(season.poster_path)} />
      )}
      <ThemedButton
        type="surface"
        onPress={() => handleSeasonPress(season)}
        radius={50}
        radiusBottom={showEpisodes ? 0 : 50}
        pa={0}
        overflow="hidden"
        color={"rgba(0,0,0,0.2)"}
      >
        <Box
          direction="row"
          gap={15}
          align={showEpisodes && season.overview ? "flex-start" : "center"}
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
              <ThemedText size="sm" opacity={0.7} color="white">
                {season.overview.length > 60 && !showEpisodes
                  ? `${season.overview.substring(0, 60)}...`
                  : season.overview}
              </ThemedText>
            )}
          </Box>
        </Box>
      </ThemedButton>

      {showEpisodes && (
        <Box>
          {isLoading && (
            <ThemedCard
              align="center"
              color={"rgba(255,255,255,0.3)"}
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
            <ThemedErrorCard
              title="Failed to load episodes"
              error={error.message}
            />
          )}
          {seasonDetails?.episodes && (
            <Box height={sHeight / 1.65}>
              <Animated.ScrollView
                contentContainerStyle={{ padding: 10, paddingBottom: 40 }}
              >
                <Box gap={1} overflow="hidden" radius={40}>
                  {seasonDetails.episodes.map((episode, index) => (
                    <AnimatedBox
                      key={episode.id}
                      color="rgba(0,0,0,0.3)"
                      pa={20}
                      radius={0}
                      gap={5}
                      viewProps={{
                        entering: FadeInDown.delay(index * 100)
                          .duration(300)
                          .springify(),
                      }}
                    >
                      <ThemedText
                        size="sm"
                        fontWeight="medium"
                        color="white"
                        mb={4}
                      >
                        {episode.episode_number}. {episode.name}
                      </ThemedText>
                      {episode.overview && (
                        <ThemedText size="xs" color="white">
                          {episode.overview}
                        </ThemedText>
                      )}
                      {episode.air_date && (
                        <ThemedText
                          size="xs"
                          color="white"
                          opacity={0.5}
                          mt={4}
                        >
                          {new Date(episode.air_date).toDateString()}
                        </ThemedText>
                      )}
                    </AnimatedBox>
                  ))}
                </Box>
              </Animated.ScrollView>
            </Box>
          )}
        </Box>
      )}
    </AnimatedBox>
  );
}
