import React, { LegacyRef, useRef, useState } from "react";
import Box from "./reusables/Box";
import { Image } from "expo-image";
import ThemedText from "./reusables/ThemedText";
import { cleanTitle, ShowInfo } from "@/lib/scrape";
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
import { markEpisodeWatched, PERSISTED_APP_STATE } from "@/valitio.store";
import { useSnapshot } from "valtio";
import ThemedBottomSheet from "./reusables/ThemedBottomSheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ReminderForm from "./ReminderForm";
import { SUCCESS_ALERT } from "@/constants/common.constants";
import { requestNotificationPermission } from "@/lib/refresh";

const ACTION_WIDTH = 200;

export default function NewEpisodeCard({ episode }: { episode: ShowInfo }) {
  const theme = useTheme();
  return (
    <ReanimatedSwipeable
      containerStyle={{
        width: "100%",
        height: 150,
      }}
      friction={2}
      enableTrackpadTwoFingerGesture
      rightThreshold={40}
      renderRightActions={(prog, drag, swipeable) =>
        RightAction({ drag, swipeable, show: episode })
      }
      renderLeftActions={(prog, drag, swipeable) =>
        LeftAction({ drag, swipeable, show: episode })
      }
    >
      <Box
        direction="row"
        align="center"
        justify="space-between"
        height="100%"
        width="100%"
        color={theme.background}
      >
        <Image
          source={episode.poster}
          style={{
            width: 100,
            height: "100%",
            borderRadius: 50,
          }}
        />
        <Box align="center" height={"100%"} width={"30%"} justify="center">
          <ThemedText size={"sm"} opacity={0.5}>
            Episode
          </ThemedText>
          <ThemedText size={80} fontWeight="bold">
            {episode.episode}
          </ThemedText>
        </Box>
        <Box justify="center" gap={5} height={"100%"} flex={1}>
          <ThemedText size={"lg"}>{cleanTitle(episode.title)}</ThemedText>
          <ThemedText size={"sm"} opacity={0.5}>
            Season {episode.season}
          </ThemedText>
        </Box>
      </Box>
    </ReanimatedSwipeable>
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

  return (
    <Reanimated.View
      style={[
        styleAnimation,
        {
          width: ACTION_WIDTH,
          justifyContent: "center",
        },
      ]}
    >
      <ThemedButton
        label="Remind Me"
        icon={{ name: "alarm-bell", source: "MaterialCommunityIcons" }}
        direction="column"
        justify="center"
        size="sm"
        height={"50%"}
        width={"90%"}
        type="surface"
        radius={60}
        onPress={() => {
          requestNotificationPermission();
          setShowReminderForm(true);
        }}
      />
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
  const APP_STATE = useSnapshot(PERSISTED_APP_STATE);
  const styleAnimation = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: drag.value - ACTION_WIDTH }],
    };
  });

  function onWatched() {
    swipeable.close();
    markEpisodeWatched(show);

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
        },
      ]}
    >
      <ThemedButton
        label="Watched"
        icon={{ name: "movie-check", source: "MaterialCommunityIcons" }}
        direction="column"
        justify="center"
        size="sm"
        height={"50%"}
        width={"90%"}
        type="surface"
        radius={40}
        onPress={onWatched}
      />
    </Reanimated.View>
  );
}
