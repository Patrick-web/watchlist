import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Platform } from "react-native";
import Box from "./reusables/Box";
import ThemedButton from "./reusables/ThemedButton";
import ThemedText from "./reusables/ThemedText";
import { FilmResult } from "@/types";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ImageBackground, Image } from "expo-image";
import { useTheme, useThemeMode } from "@/hooks/useTheme.hook";
import { POSTER_RATIO } from "@/constants/dimensions.constant";

const POSTER_HEIGHT = 250;
const POSTER_WIDTH = POSTER_HEIGHT / POSTER_RATIO;

export default function FilmHeader({ film }: { film: FilmResult }) {
  const insets = useSafeAreaInsets();
  const themeMode = useThemeMode();
  const theme = useTheme();

  return (
    <ImageBackground
      source={film.poster}
      blurRadius={100}
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
        pt={Platform.OS === "ios" ? 20 : 60}
      >
        <Image
          source={film.poster}
          style={{
            width: POSTER_WIDTH,
            height: POSTER_HEIGHT,
            borderRadius: POSTER_WIDTH / 2,
          }}
        />
        <LinearGradient
          colors={[
            themeMode === "dark" ? "rgba(32,32,32,0)" : "rgba(255,255,255,0)",
            theme.background,
          ]}
          style={{ width: "100%" }}
        >
          <Box px={20} py={10}>
            <ThemedText
              size={"xxl"}
              align="center"
              fontWeight="bold"
              color={"white"}
            >
              {film.title}
            </ThemedText>
          </Box>
        </LinearGradient>
      </Box>
    </ImageBackground>
  );
}
