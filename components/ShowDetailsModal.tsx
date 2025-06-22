import React, { useState } from "react";
import Box from "./reusables/Box";
import { Image } from "expo-image";
import ThemedText from "./reusables/ThemedText";
import ThemedButton from "./reusables/ThemedButton";
import { POSTER_RATIO, sWidth } from "@/constants/dimensions.constant";
import { unsubscribeShow } from "@/valitio.store";
import Haptics from "expo-haptics";
import ThemedTrueSheet from "./reusables/TrueSheet";
import { useThemeMode } from "@/hooks/useTheme.hook";
import { TVShowDetailsResponse } from "@/types/tmdb.types";
import { buildImageUrl } from "@/utils/api.utils";
import FilmPosterBackground from "./FilmPosterBackground";
import { Platform } from "react-native";
import ThemedModal from "./reusables/ThemedModal";
import ShowSeasonsModal from "./ShowSeasonsModal";
import ShowEpisodesModal from "./ShowEpisodesModal";

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
  const [seasonsModalVisible, setSeasonsModalVisible] = useState(false);

  const [selectedSeason, setSelectedSeason] = useState<
    TVShowDetailsResponse["seasons"][0] | null
  >(null);

  function unSubscribe() {
    setShowConfirmUnsubscribe(false);
    unsubscribeShow(show);
    Haptics?.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    onClose();
  }

  function handleShowSeasons() {
    setSeasonsModalVisible(true);
    onClose(); // Close the details modal since TrueSheet doesn't support stacking
  }

  function handleCloseSeasonsModal() {
    setSeasonsModalVisible(false);
  }

  return (
    <>
      <ThemedTrueSheet
        visible={visible}
        onDismiss={onClose}
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
              onPress={handleShowSeasons}
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
        </Box>
      </ThemedTrueSheet>

      <ShowSeasonsModal
        show={show}
        visible={seasonsModalVisible}
        onClose={handleCloseSeasonsModal}
        selectSeason={(season) => {
          setSeasonsModalVisible(false);
          setSelectedSeason(season);
        }}
      />
      <ShowEpisodesModal
        show={show}
        season={selectedSeason}
        visible={selectedSeason ? true : false}
        onClose={() => {
          setSelectedSeason(null);
        }}
      />
    </>
  );
}
