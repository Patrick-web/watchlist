import React, { useState } from "react";
import Box, { AnimatedBox } from "./reusables/Box";
import { Image } from "expo-image";
import ThemedText from "./reusables/ThemedText";
import ThemedButton from "./reusables/ThemedButton";
import { POSTER_RATIO, sWidth } from "@/constants/dimensions.constant";
import { unsubscribeShow } from "@/valitio.store";
import Haptics from "expo-haptics";
import { ShowInfo } from "@/types";
import ThemedTrueSheet from "./reusables/TrueSheet";
import { useThemeMode } from "@/hooks/useTheme.hook";
import { FadeInLeft, FadeInRight } from "react-native-reanimated";

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
        cornerRadius={60}
        blurTint={themeMode}
        grabber={false}
      >
        <Box justify="center" align="center" gap={20} pb={60} pt={80}>
          <Box direction="row" block justify="center" align="center">
            {showModal && (
              <AnimatedBox
                flex={1}
                align="flex-end"
                direction="row"
                alignSelf="flex-start"
                zIndex={4}
                position="absolute"
                top={30}
                left={20}
                viewProps={{
                  entering: FadeInLeft.duration(1000),
                }}
              >
                <ThemedText
                  size={"xl"}
                  fontWeight="bold"
                  transform={[{ translateY: "-35%" }]}
                >
                  SN
                </ThemedText>
                <ThemedText
                  size={120}
                  fontWeight="bold"
                  textShadowColor={"rgba(0,0,0,0.6)"}
                  textShadowRadius={8}
                  textShadowOffset={{ width: 0, height: 8 }}
                >
                  {show.season}
                </ThemedText>
              </AnimatedBox>
            )}
            <Image
              source={show.poster}
              style={{
                width: POSTER_WIDTH * 1.5,
                height: POSTER_WIDTH * 1.5 * POSTER_RATIO,
                borderRadius: 40,
              }}
            />
            {showModal && (
              <AnimatedBox
                align="flex-end"
                justify="flex-end"
                direction="row"
                position="absolute"
                bottom={40}
                right={show.episode.toString().length === 1 ? 30 : 0}
                viewProps={{
                  entering: FadeInRight.duration(1000),
                }}
              >
                <ThemedText
                  size={100}
                  fontWeight="bold"
                  textShadowColor={"rgba(0,0,0,0.6)"}
                  textShadowRadius={8}
                  textShadowOffset={{ width: 0, height: 8 }}
                >
                  {show.episode}
                </ThemedText>
                <ThemedText
                  size={"xl"}
                  fontWeight="bold"
                  transform={[{ translateY: "-25%" }]}
                >
                  EP
                </ThemedText>
              </AnimatedBox>
            )}
          </Box>
          <Image
            source={show.poster}
            style={{
              width: "100%",
              height: "140%",
              position: "absolute",
              top: 0,
              left: 0,
              opacity: 0.2,
              zIndex: -1,
              borderRadius: 60,
            }}
            blurRadius={90}
          />
          <ThemedText size={"xxxl"} fontWeight="bold">
            {show.title}
          </ThemedText>
          <ThemedButton
            type={"secondary"}
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
