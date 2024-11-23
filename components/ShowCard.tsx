import React from "react";
import Box from "./reusables/Box";
import { Image } from "expo-image";
import ThemedText from "./reusables/ThemedText";
import { ShowInfo } from "@/lib/scrape";
import ThemedButton from "./reusables/ThemedButton";
import { useAtom } from "jotai";
import { subscribedShowsAtom } from "@/stores/atoms/subs.atom";

export default function ShowCard({ show }: { show: ShowInfo }) {
  const [subscriptions, setSubscriptions] = useAtom(subscribedShowsAtom);

  function subscribe() {
    setSubscriptions([show, ...subscriptions]);
  }

  function isSubscribed() {
    return subscriptions.find((sub) => sub.url === show.url) ? true : false;
  }

  return (
    <Box
      direction="row"
      align="center"
      justify="space-between"
      gap={20}
      height={150}
    >
      <Image
        source={show.poster}
        style={{
          width: 100,
          height: "100%",
          borderRadius: 50,
        }}
      />
      <Box justify="center" align="flex-start" gap={5} height={"100%"} flex={1}>
        <ThemedText size={"lg"}>{show.title}</ThemedText>
        <Box direction="row" opacity={0.5} gap={10}>
          <ThemedText size={"sm"}>Season {show.season}</ThemedText>
          <ThemedText size={"sm"}>⋅</ThemedText>
          <ThemedText size={"sm"}>Episode {show.episode}</ThemedText>
        </Box>
        <ThemedButton
          type={isSubscribed() ? "primary" : "surface"}
          size="xs"
          label={isSubscribed() ? "Subscribed" : "Subscribe"}
          icon={{ name: isSubscribed() ? "check" : "plus" }}
          mt={10}
          disabled={isSubscribed()}
          onPress={subscribe}
        />
      </Box>
    </Box>
  );
}
