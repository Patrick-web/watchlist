import { SUCCESS_ALERT } from "@/constants/common.constants";
import { POSTER_RATIO, sWidth } from "@/constants/dimensions.constant";
import { useTheme } from "@/hooks/useTheme.hook";
import { ShowInfo } from "@/types";
import { onShowWatched } from "@/valitio.store";
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
import Show from "./Show";

const ACTION_WIDTH = sWidth - 40;

export default function ShowCard({ show }: { show: ShowInfo }) {
  const theme = useTheme();
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
        renderRightActions={(prog, drag, swipeable) =>
          RightAction({ drag, swipeable, show })
        }
        renderLeftActions={(prog, drag, swipeable) =>
          LeftAction({ drag, swipeable, show })
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
        containerProps={{ pb: 80, gap: 20 }}
      >
        <Box gap={20} px={20}>
          <Show show={show} />
          <Box color={"border"} block height={StyleSheet.hairlineWidth} />
        </Box>
        <ReminderForm show={show} close={() => setShowReminderForm(false)} />
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

function RightAction({
  drag,
  show,
  swipeable,
}: {
  drag: SharedValue<number>;
  show: ShowInfo;
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
        <ReminderForm show={show} close={() => setShowReminderForm(false)} />
      </ThemedBottomSheet>
    </Reanimated.View>
  );
}

function LeftAction({
  drag,
  show,
  swipeable,
}: {
  drag: SharedValue<number>;
  show: ShowInfo;
  swipeable: SwipeableMethods;
}) {
  const styleAnimation = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: drag.value - ACTION_WIDTH }],
    };
  });

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
