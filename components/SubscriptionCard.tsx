import React, { useState } from "react";
import Box from "./reusables/Box";
import { Image } from "expo-image";
import ThemedText from "./reusables/ThemedText";
import { ShowInfo } from "@/lib/scrape";
import ThemedButton from "./reusables/ThemedButton";
import { useAtom } from "jotai";
import { subscribedShowsAtom } from "@/stores/atoms/subs.atom";
import ThemedBottomSheet from "./reusables/ThemedBottomSheet";
import { sWidth } from "@/constants/dimensions.constant";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SubscriptionCard({ show }: { show: ShowInfo }) {
  const [subscriptions, setSubscriptions] = useAtom(subscribedShowsAtom);

  function unSubscribe() {
    setSubscriptions(subscriptions.filter((sub) => sub.url !== show.url));
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
          paddingBottom: insets.bottom,
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
          <ThemedText size={"lg"}>{show.title}</ThemedText>
          <Box direction="row" opacity={0.5} gap={10}>
            <ThemedText size={"sm"}>Season {show.season}</ThemedText>
            <ThemedText size={"sm"}>⋅</ThemedText>
            <ThemedText size={"sm"}>Episode {show.episode}</ThemedText>
          </Box>
          <ThemedButton
            type={"surface"}
            size="xs"
            label={"UnSubscribe"}
            mt={10}
            onPress={unSubscribe}
          />
        </Box>
      </ThemedBottomSheet>
    </>
  );
}
