import React, { useRef, useState } from "react";
import Box from "./reusables/Box";
import { Image } from "expo-image";
import ThemedText from "./reusables/ThemedText";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import ThemedButton from "./reusables/ThemedButton";
import { toast } from "sonner-native";
import ThemedIcon from "./reusables/ThemedIcon";
import { onEpisodeWatched } from "@/valitio.store";
import ThemedBottomSheet from "./reusables/ThemedBottomSheet";
import ReminderForm from "./ReminderForm";
import { SUCCESS_ALERT } from "@/constants/common.constants";
import Haptics from "expo-haptics";
import { NewEpisode } from "@/types";
import { POSTER_RATIO } from "@/constants/dimensions.constant";
import { Platform, StyleSheet } from "react-native";
import SwipeAction from "./SwipeAction";
import ThemedTrueSheet from "./reusables/TrueSheet";
import { useThemeMode } from "@/hooks/useTheme.hook";
import FilmPosterBackground from "./FilmPosterBackground";

const POSTER_WIDTH = 100;
const POSTER_HEIGHT = POSTER_RATIO * POSTER_WIDTH;

export function Episode({ episode }: { episode: NewEpisode }) {
  return (
    <Box
      direction="row"
      align="center"
      justify="space-between"
      width="100%"
      height={POSTER_HEIGHT}
    >
      <Image
        source={episode.show.poster}
        style={{
          width: POSTER_WIDTH,
          height: POSTER_HEIGHT,
          borderRadius: 50,
        }}
      />
      <Box align="center" height={"100%"} width={"30%"} justify="center">
        <ThemedText size={"sm"} opacity={0.5}>
          Episode
        </ThemedText>
        <ThemedText size={80} fontWeight="bold">
          {episode.show.episode}
        </ThemedText>
      </Box>
      <Box justify="center" gap={5} height={"100%"} flex={1}>
        <ThemedText size={"lg"}>{episode.show.title}</ThemedText>
        <ThemedText size={"sm"} opacity={0.5}>
          Season {episode.show.season}
        </ThemedText>
      </Box>
    </Box>
  );
}

export default function NewEpisodeCard({ episode }: { episode: NewEpisode }) {
  const themeMode = useThemeMode();

  const [showActions, setShowActions] = useState(false);
  const [showReminderForm, setShowReminderForm] = useState(false);
  const [showWatchedConfirmation, setShowWatchedConfirmation] = useState(false);
  const swipeRef = useRef<any>();

  function onWatched() {
    swipeRef.current?.close();
    setShowWatchedConfirmation(false);

    onEpisodeWatched(episode);
    Haptics?.notificationAsync(Haptics.NotificationFeedbackType.Success);

    toast.success("Roger that 👍", {
      icon: (
        <Box block align="center">
          <ThemedIcon name="check-circle" color="success" />
        </Box>
      ),
      ...SUCCESS_ALERT,
    });
  }

  return (
    <>
      <ReanimatedSwipeable
        containerStyle={{
          width: "100%",
          height: 150,
        }}
        ref={swipeRef}
        friction={1}
        rightThreshold={40}
        renderRightActions={(prog, drag, swipeable) => (
          <SwipeAction
            drag={drag}
            direction="right"
            label="Remind Me"
            icon={{
              name: "alarm-bell",
              source: "MaterialCommunityIcons",
            }}
          />
        )}
        renderLeftActions={(prog, drag, swipeable) => (
          <SwipeAction
            drag={drag}
            direction="left"
            label="Watched"
            icon={{
              name: "movie-check",
              source: "MaterialCommunityIcons",
            }}
          />
        )}
        onSwipeableWillOpen={(direction) => {
          if (direction === "right") {
            setShowReminderForm(true);
          }
          if (direction === "left") {
            setShowWatchedConfirmation(true);
          }
        }}
        overshootLeft
        overshootRight
      >
        <ThemedButton onPress={() => setShowActions(true)} type="text">
          <Episode episode={episode} />
        </ThemedButton>
      </ReanimatedSwipeable>
      <ThemedTrueSheet
        visible={showActions}
        onDismiss={() => setShowActions(false)}
        cornerRadius={Platform.OS === "ios" ? 60 : 80}
        blurTint={themeMode}
        grabber={false}
      >
        <FilmPosterBackground url={episode.show.poster} />
        <Box pt={20} px={20} pb={80} gap={20}>
          <Episode episode={episode} />
          <Box
            color={"rgba(255,255,255,0.5)"}
            block
            height={StyleSheet.hairlineWidth}
          />
          <Box gap={10}>
            <ThemedButton
              label={"Mark as Watched"}
              direction="column"
              radius={100}
              icon={{
                name: "movie-check",
                source: "MaterialCommunityIcons",
              }}
              type="translucent"
              py={10}
              onPress={() => {
                setShowActions(false);
                setShowWatchedConfirmation(true);
              }}
            />
            <ThemedButton
              label={"Create Reminder"}
              icon={{
                name: "alarm-bell",
                source: "MaterialCommunityIcons",
              }}
              type="translucent"
              direction="column"
              size="sm"
              py={10}
              onPress={() => {
                setShowActions(false);
                setShowReminderForm(true);
              }}
            />
          </Box>
        </Box>
      </ThemedTrueSheet>

      <ReminderForm
        episode={episode}
        visible={showReminderForm}
        close={() => {
          setShowReminderForm(false);
          swipeRef.current?.close();
        }}
      >
        <Box gap={20} px={20}>
          <Episode episode={episode} />
          <Box color={"border"} block height={StyleSheet.hairlineWidth} />
        </Box>
      </ReminderForm>
      <ThemedBottomSheet
        title="You already watched"
        visible={showWatchedConfirmation}
        close={() => {
          setShowWatchedConfirmation(false);
          swipeRef.current?.close();
        }}
        icon={{
          name: "movie-open-check",
          source: "MaterialCommunityIcons",
        }}
        containerProps={{
          pa: 20,
          pb: 80,
          radius: 60,
          gap: 20,
        }}
      >
        <Episode episode={episode} />
        <Box direction="row" gap={20}>
          <ThemedButton
            label={"Not Yet"}
            type="surface"
            onPress={() => {
              setShowWatchedConfirmation(false);
              swipeRef.current?.close();
            }}
            flex={1}
          />
          <ThemedButton label={"Yes"} flex={1} onPress={onWatched} />
        </Box>
      </ThemedBottomSheet>
    </>
  );
}
