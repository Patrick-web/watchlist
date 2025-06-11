import { Image } from "expo-image";
import { Platform } from "react-native";
import Box, { BoxProps } from "./reusables/Box";
export default function FilmPosterBackground({
  url,
  wrapper,
}: {
  url: string;
  wrapper?: BoxProps;
}) {
  return (
    <Box
      color={"rgba(0,0,0,0.5)"}
      position="absolute"
      top={0}
      left={0}
      right={0}
      bottom={0}
      zIndex={-1}
      radius={Platform.OS === "ios" ? 60 : 25}
      width="100%"
      height="140%"
      overflow="hidden"
      {...wrapper}
    >
      <Image
        source={url}
        style={{
          width: "100%",
          height: "100%",
        }}
        blurRadius={200}
      />
    </Box>
  );
}
