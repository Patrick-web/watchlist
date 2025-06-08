import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Platform } from "react-native";
import Box from "./reusables/Box";
import ThemedButton from "./reusables/ThemedButton";
import ThemedText from "./reusables/ThemedText";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ImageBackground, Image } from "expo-image";
import { POSTER_RATIO } from "@/constants/dimensions.constant";
import { MovieResult, TVShowDetailsResponse } from "@/types/tmdb.types";
import { buildBackdropUrl } from "@/utils/api.utils";

const POSTER_HEIGHT = 250;
const POSTER_WIDTH = POSTER_HEIGHT / POSTER_RATIO;

export default function FilmHeader({
  preview,
}: {
  preview: MovieResult | TVShowDetailsResponse;
}) {
  const insets = useSafeAreaInsets();

  return (
    <ImageBackground
      source={buildBackdropUrl(preview.poster_path)}
      blurRadius={400}
      style={{
        width: "100%",
      }}
    >
      {Platform.OS !== "ios" && (
        <ThemedButton
          icon={{ name: "arrow-left", color: "white" }}
          type="surface"
          position="absolute"
          color={"rgba(0,0,0,0.2)"}
          top={insets.top}
          left={20}
          zIndex={40}
          onPress={router.back}
        />
      )}
      <Box
        block
        align="center"
        color={"rgba(0,0,0,0.3)"}
        py={Platform.OS === "ios" ? 20 : insets.top}
        gap={10}
      >
        <Image
          source={buildBackdropUrl(preview.poster_path)}
          style={{
            width: POSTER_WIDTH,
            height: POSTER_HEIGHT,
            borderRadius: POSTER_WIDTH / 2,
          }}
        />
        <ThemedText
          size={"xxl"}
          align="center"
          fontWeight="bold"
          color={"white"}
        >
          {(preview as MovieResult)?.title ||
            (preview as TVShowDetailsResponse)?.name ||
            "Unknown"}
        </ThemedText>
      </Box>
    </ImageBackground>
  );
}
