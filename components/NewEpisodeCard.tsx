import React, { LegacyRef, useRef, useState } from "react";
import Box from "./reusables/Box";
import { Image } from "expo-image";
import ThemedText from "./reusables/ThemedText";
import { cleanTitle } from "@/lib/scrape";
import Reanimated, {
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import ReanimatedSwipeable, {
  SwipeableMethods,
} from "react-native-gesture-handler/ReanimatedSwipeable";
import ThemedButton from "./reusables/ThemedButton";
import { useTheme } from "@/hooks/useTheme.hook";
import { toast } from "sonner-native";
import ThemedIcon from "./reusables/ThemedIcon";
import { onEpisodeWatched, PERSISTED_APP_STATE } from "@/valitio.store";
import { useSnapshot } from "valtio";
import ThemedBottomSheet from "./reusables/ThemedBottomSheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ReminderForm from "./ReminderForm";
import { SUCCESS_ALERT } from "@/constants/common.constants";
import Haptics from "expo-haptics";
import { NewEpisode } from "@/types";
import { POSTER_RATIO, sWidth } from "@/constants/dimensions.constant";
import { StyleSheet } from "react-native";

const ACTION_WIDTH = sWidth - 40;
const POSTER_WIDTH = 100;
const POSTER_HEIGHT = POSTER_RATIO * POSTER_WIDTH;

export function Episode({ episode }: { episode: NewEpisode }) {
  const theme = useTheme();
  return (
    <Box
      direction="row"
      align="center"
      justify="space-between"
      width="100%"
      height={POSTER_HEIGHT}
      color={theme.background}
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
        <ThemedText size={"lg"}>{cleanTitle(episode.show.title)}</ThemedText>
        <ThemedText size={"sm"} opacity={0.5}>
          Season {episode.show.season}
        </ThemedText>
      </Box>
    </Box>
  );
}

export default function NewEpisodeCard({ episode }: { episode: NewEpisode }) {
  const theme = useTheme();
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
        renderRightActions={(prog, drag, swipeable) =>
          RightAction({ drag, swipeable, episode })
        }
        renderLeftActions={(prog, drag, swipeable) =>
          LeftAction({ drag, swipeable, episode })
        }
        onSwipeableWillOpen={(direction) => {
          console.log({ direction });
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
      <ThemedBottomSheet
        visible={showActions}
        close={() => setShowActions(false)}
        containerProps={{ px: 20, gap: 20, radius: 60 }}
      >
        <Episode episode={episode} />
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

      <ThemedBottomSheet
        title="Remind me to watch"
        visible={showReminderForm}
        close={() => {
          setShowReminderForm(false);
          swipeRef.current?.close();
        }}
        icon={{
          name: "alarm-bell",
          source: "MaterialCommunityIcons",
        }}
        containerProps={{ px: 0, pt: 20, gap: 20, radius: 60 }}
      >
        <Box gap={20} px={20}>
          <Episode episode={episode} />
          <Box color={"border"} block height={StyleSheet.hairlineWidth} />
        </Box>
        <ReminderForm
          episode={episode}
          close={() => setShowReminderForm(false)}
        />
      </ThemedBottomSheet>
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

function RightAction({
  drag,
  episode,
  swipeable,
}: {
  drag: SharedValue<number>;
  episode: NewEpisode;
  swipeable: SwipeableMethods;
}) {
  const styleAnimation = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: drag.value + ACTION_WIDTH }],
    };
  });

  const [showReminderForm, setShowReminderForm] = useState(false);
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  return (
    <Reanimated.View
      style={[
        styleAnimation,
        {
          width: ACTION_WIDTH,
          justifyContent: "center",
          backgroundColor: theme.text,
          alignItems: "center",
          gap: 5,
        },
      ]}
    >
      <ThemedIcon
        name="alarm-bell"
        color={"background"}
        source="MaterialCommunityIcons"
      />
      <ThemedText fontWeight="bold" textAlign="center" color={"background"}>
        Remind Me
      </ThemedText>
      <ThemedBottomSheet
        title="Remind Me"
        visible={showReminderForm}
        close={() => {
          setShowReminderForm(false);
          swipeable.close();
        }}
        icon={{
          name: "alarm-bell",
          source: "MaterialCommunityIcons",
        }}
        containerProps={{
          pt: 10,
        }}
      >
        <ReminderForm
          episode={episode}
          close={() => setShowReminderForm(false)}
        />
      </ThemedBottomSheet>
    </Reanimated.View>
  );
}

function LeftAction({
  drag,
  episode,
  swipeable,
}: {
  drag: SharedValue<number>;
  episode: NewEpisode;
  swipeable: SwipeableMethods;
}) {
  const APP_STATE = useSnapshot(PERSISTED_APP_STATE);
  const styleAnimation = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: drag.value - ACTION_WIDTH }],
    };
  });

  const theme = useTheme();

  function onWatched() {
    swipeable.close();

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
    <Reanimated.View
      style={[
        styleAnimation,
        {
          width: ACTION_WIDTH,
          justifyContent: "center",
          backgroundColor: theme.text,
          alignItems: "center",
          gap: 5,
        },
      ]}
    >
      <ThemedIcon
        name="movie-check"
        color={"background"}
        source="MaterialCommunityIcons"
      />
      <ThemedText fontWeight="bold" textAlign="center" color={"background"}>
        Watched
      </ThemedText>
    </Reanimated.View>
  );
}
