import { SUCCESS_ALERT } from "@/constants/common.constants";
import { ShowInfo } from "@/types";
import { onShowWatched } from "@/valitio.store";
import Haptics from "expo-haptics";
import React, { useRef, useState } from "react";
import { StyleSheet } from "react-native";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { toast } from "sonner-native";
import ReminderForm from "./ReminderForm";
import Box from "./reusables/Box";
import ThemedBottomSheet from "./reusables/ThemedBottomSheet";
import ThemedButton from "./reusables/ThemedButton";
import ThemedIcon from "./reusables/ThemedIcon";
import Show from "./Show";
import SwipeAction from "./SwipeAction";

export default function ShowCard({ show }: { show: ShowInfo }) {
  const [showActions, setShowActions] = useState(false);
  const [showReminderForm, setShowReminderForm] = useState(false);
  const [showWatchedConfirmation, setShowWatchedConfirmation] = useState(false);
  const swipeRef = useRef<any>();

  function onWatched() {
    swipeRef.current?.close();

    setShowWatchedConfirmation(false);

    onShowWatched(show);

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
            icon={{ name: "alarm-bell", source: "MaterialCommunityIcons" }}
          />
        )}
        renderLeftActions={(prog, drag, swipeable) => (
          <SwipeAction
            drag={drag}
            direction="left"
            label="Watched"
            icon={{ name: "movie-check", source: "MaterialCommunityIcons" }}
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
          <Show show={show} />
        </ThemedButton>
      </ReanimatedSwipeable>
      <ThemedBottomSheet
        visible={showActions}
        close={() => setShowActions(false)}
        containerProps={{ px: 20, gap: 20, radius: 60 }}
      >
        <Show show={show} />
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
            onPress={() => setShowReminderForm(true)}
          />
        </Box>
      </ThemedBottomSheet>

      <ReminderForm
        show={show}
        visible={showReminderForm}
        close={() => {
          setShowReminderForm(false);
          swipeRef.current?.close();
        }}
      >
        <Box gap={20} px={20}>
          <Show show={show} />
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
        <Show show={show} />
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
