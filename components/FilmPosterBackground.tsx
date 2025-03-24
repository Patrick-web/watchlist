import { Image } from "expo-image";
import { Platform } from "react-native";
export default function FilmPosterBackground({ url }: { url: string }) {
  return (
    <Image
      source={url}
      style={{
        width: "100%",
        height: "140%",
        position: "absolute",
        top: 0,
        left: 0,
        opacity: 0.2,
        zIndex: -1,
        borderRadius: Platform.OS === "ios" ? 60 : 25,
      }}
      blurRadius={90}
    />
  );
}
