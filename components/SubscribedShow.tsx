import React, { useState } from "react";
import Box from "./reusables/Box";
import { Image } from "expo-image";
import ThemedText from "./reusables/ThemedText";
import ThemedButton from "./reusables/ThemedButton";
import { POSTER_RATIO, sWidth } from "@/constants/dimensions.constant";
import { unsubscribeShow } from "@/valitio.store";
import Haptics from "expo-haptics";
import { ShowInfo } from "@/types";
import ThemedTrueSheet from "./reusables/TrueSheet";
import { useThemeMode } from "@/hooks/useTheme.hook";

const POSTER_WIDTH = sWidth / 2 - 40;

export default function SubscribedShow({ show }: { show: ShowInfo }) {
  function unSubscribe() {
    unsubscribeShow(show);
    Haptics?.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  }

  const [showModal, setShowModal] = useState(false);

  const themeMode = useThemeMode();

  return (
    <>
      <ThemedButton
        onPress={() => {
          setShowModal(true);
        }}
        type="text"
        alignSelf="center"
      >
        <Image
          source={show.poster}
          style={{
            width: POSTER_WIDTH,
            height: POSTER_WIDTH * POSTER_RATIO,
            maxWidth: 200,
            maxHeight: 200 * POSTER_RATIO,
            borderRadius: sWidth / 2,
          }}
        />
      </ThemedButton>
      <ThemedTrueSheet
        visible={showModal}
        onDismiss={() => {
          setShowModal(false);
        }}
        cornerRadius={0}
        blurTint={themeMode}
      >
        <Box justify="center" align="center" gap={5} py={20}>
          <Image
            source={show.poster}
            style={{
              width: POSTER_WIDTH,
              height: POSTER_WIDTH * POSTER_RATIO,
              borderRadius: sWidth / 2,
            }}
          />
          <ThemedText size={"xxl"} fontWeight="bold">
            {show.title}
          </ThemedText>
          <Box direction="row" opacity={0.8} gap={10}>
            <ThemedText size={"sm"}>Season {show.season}</ThemedText>
            <ThemedText size={"sm"}>⋅</ThemedText>
            <ThemedText size={"sm"}>Episode {show.episode}</ThemedText>
          </Box>
          <ThemedButton
            type={"surface"}
            size="xs"
            label={"Unsubscribe"}
            mt={10}
            onPress={unSubscribe}
          />
        </Box>
      </ThemedTrueSheet>
    </>
  );
}
