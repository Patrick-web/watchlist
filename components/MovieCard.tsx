import { SUCCESS_ALERT } from "@/constants/common.constants";
import { POSTER_RATIO, sWidth } from "@/constants/dimensions.constant";
import { useTheme } from "@/hooks/useTheme.hook";
import { MovieInfo } from "@/types";
import { onMovieWatched } from "@/valitio.store";
import Haptics from "expo-haptics";
import React, { useRef, useState } from "react";
import { StyleSheet } from "react-native";
import ReanimatedSwipeable, {
  SwipeableMethods,
} from "react-native-gesture-handler/ReanimatedSwipeable";
import Reanimated, {
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { toast } from "sonner-native";
import ReminderForm from "./ReminderForm";
import Box from "./reusables/Box";
import ThemedBottomSheet from "./reusables/ThemedBottomSheet";
import ThemedButton from "./reusables/ThemedButton";
import ThemedIcon from "./reusables/ThemedIcon";
import ThemedText from "./reusables/ThemedText";
import Movie from "./Movie";
import SwipeAction from "./SwipeAction";

const ACTION_WIDTH = sWidth - 40;
const POSTER_WIDTH = 100;
const POSTER_HEIGHT = POSTER_RATIO * POSTER_WIDTH;

export default function MovieCard({ movie }: { movie: MovieInfo }) {
  const theme = useTheme();
  const [showActions, setShowActions] = useState(false);
  const [showReminderForm, setShowReminderForm] = useState(false);
  const [showWatchedConfirmation, setShowWatchedConfirmation] = useState(false);
  const swipeRef = useRef<any>();

  function onWatched() {
    swipeRef.current?.close();

    setShowWatchedConfirmation(false);

    setShowActions(false);

    onMovieWatched(movie);

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
          <Movie movie={movie} />
        </ThemedButton>
      </ReanimatedSwipeable>
      <ThemedBottomSheet
        visible={showActions}
        close={() => setShowActions(false)}
        containerProps={{ px: 20, gap: 20, radius: 60 }}
      >
        <Movie movie={movie} />
        <Box color={"border"} block height={StyleSheet.hairlineWidth} />
        <Box gap={10}>
          <ThemedButton
            label={"Mark as Watched"}
            icon={{
              name: "movie-check",
              source: "MaterialCommunityIcons",
            }}
            direction="column"
            type="surface"
            size="sm"
            py={10}
            onPress={() => {
              setShowActions(false);
              setShowWatchedConfirmation(true);
            }}
          />
          <ThemedButton
            label={"Create Reminder"}
            icon={{ name: "alarm-bell", source: "MaterialCommunityIcons" }}
            type="surface"
            direction="column"
            size="sm"
            py={10}
            onPress={() => {
              setShowActions(false);
              setShowReminderForm(true);
            }}
          />
        </Box>
      </ThemedBottomSheet>

      <ReminderForm
        movie={movie}
        close={() => setShowReminderForm(false)}
        visible={showReminderForm}
      >
        <Box gap={20} px={20}>
          <Movie movie={movie} />
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
          radius: 60,
          px: 20,
          pb: 80,
        }}
      >
        <Box gap={20}>
          <Movie movie={movie} />
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
        </Box>
      </ThemedBottomSheet>
    </>
  );
}
