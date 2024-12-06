import React, { useState } from "react";
import Box from "./reusables/Box";
import { Image } from "expo-image";
import ThemedText from "./reusables/ThemedText";
import { cleanTitle, ShowInfo } from "@/lib/scrape";
import ThemedButton from "./reusables/ThemedButton";
import ThemedBottomSheet from "./reusables/ThemedBottomSheet";
import { sWidth } from "@/constants/dimensions.constant";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Platform } from "react-native";
import { removeSubscribedShow } from "@/valitio.store";

export default function SubscribedShow({ show }: { show: ShowInfo }) {
  function unSubscribe() {
    removeSubscribedShow(show);
  }

  const [showModal, setShowModal] = useState(false);

  const insets = useSafeAreaInsets();

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
            width: sWidth / 2 - 30,
            height: 250,
            borderRadius: sWidth / 2,
          }}
        />
      </ThemedButton>
      <ThemedBottomSheet
        visible={showModal}
        close={() => {
          setShowModal(false);
        }}
        containerProps={{
          paddingBottom:
            Platform.OS === "ios" ? insets.bottom : insets.bottom + 20,
        }}
      >
        <Box justify="center" align="center" gap={5}>
          <Image
            source={show.poster}
            style={{
              width: 150,
              height: 250,
              borderRadius: sWidth / 2,
            }}
          />
          <ThemedText size={"lg"}>{cleanTitle(show.title)}</ThemedText>
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
      </ThemedBottomSheet>
    </>
  );
}
