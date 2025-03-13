import { Image, ImageContentFit, ImageSource } from "expo-image";
import React, { useEffect, useState } from "react";
import { useTheme } from "../../hooks/useTheme.hook";
import { changeCase } from "../../utils/text.utils";
import Box, { BoxProps } from "./Box";
import ThemedButton, { ThemedButtonProps } from "./ThemedButton";
import ThemedIcon from "./ThemedIcon";
import ThemedText, { ThemedTextProps } from "./ThemedText";

export default function ThemedAvatar({
  size,
  image,
  username,
  resizeMode = "cover",
  textProps,
  providedAbriv,
  showSideButton,
  badgeColor,
  showBadge,
  onPress,
  onEditButtonPress,
  buttonProps,
  radius,
  ...wrapperProps
}: AvatarProps) {
  const [imageUrl, setImageUrl] = useState<string | null>();
  const theme = useTheme();

  useEffect(() => {
    const checkImage = async () => {
      try {
        const response = await fetch(image as string);
        if (!response.ok) {
          // If image URL is not reachable, set imageUrl to null
          setImageUrl(null);
        }
      } catch {
        // Handle network errors or other issues here
        setImageUrl(null);
      }
    };

    if (image && typeof image === "string") {
      checkImage();
    }
  }, [image]);

  return (
    <Box
      width={size}
      height={size}
      radius={radius || size}
      align="center"
      justify="center"
      position="relative"
      color={theme.surface}
      {...wrapperProps}
    >
      {imageUrl || image ? (
        <ThemedButton
          type="text"
          width={"100%"}
          height={"100%"}
          radius={radius || size}
          align="center"
          justify="center"
          onPress={() => {
            if (onPress) onPress();
          }}
        >
          <Image
            source={typeof image === "string" ? { uri: image } : image}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: radius || size,
            }}
            contentFit={resizeMode}
          />
        </ThemedButton>
      ) : (
        <ThemedButton
          type="text"
          width={"100%"}
          height={"100%"}
          radius={size}
          align="center"
          justify="center"
          onPress={() => {
            if (onPress) onPress();
          }}
          {...buttonProps}
        >
          <ThemedText fontWeight="bold" size={size / 3} {...textProps}>
            {changeCase(username.split(" ")[0][0], "upper")}
          </ThemedText>
        </ThemedButton>
      )}
      {showSideButton && (
        <ThemedButton
          position="absolute"
          radius={size}
          style={{ right: 0, bottom: 0, zIndex: 2, elevation: 2 }}
          onPress={() => {
            if (onEditButtonPress) onEditButtonPress();
          }}
          pa={8}
          color={theme.surface}
        >
          <ThemedIcon name="edit-2" size={size / 7} />
        </ThemedButton>
      )}
      {showBadge && (
        <Box
          position="absolute"
          radius={size}
          style={{ right: 0, top: 0, zIndex: 2, elevation: 2 }}
        >
          <ThemedButton
            onPress={() => {
              if (onEditButtonPress) onEditButtonPress();
            }}
            color={badgeColor ?? theme.success}
            width={size / 3.5}
            height={size / 3.5}
            icon={{ name: "edit-2" }}
            radius={size}
            {...buttonProps}
          />
        </Box>
      )}
    </Box>
  );
}

interface AvatarProps extends BoxProps {
  size: number;
  username: string;
  textProps?: ThemedTextProps;
  resizeMode?: ImageContentFit;
  showSideButton?: boolean;
  showBadge?: boolean;
  badgeColor?: string;
  onPress?: () => any;
  onEditButtonPress?: () => any;
  buttonProps?: ThemedButtonProps;
  providedAbriv?: string;
  image: ImageSource | string;
}
