import { sWidth } from "@/constants/dimensions.constant";
import { useTheme } from "@/hooks/useTheme.hook";
import React from "react";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import Box, { BoxProps } from "./Box";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Page({
  children,
  scrollable,
  scrollProps,
  ...bodyProps
}: {
  children: React.ReactNode;
  scrollable?: boolean;
  scrollProps?: ScrollView["props"] & {
    iosKeyboardOffset?: number;
    androidKeyboardOffset?: number;
  };
} & BoxProps) {
  const theme = useTheme();

  const keyboardVerticalOffset =
    Platform.OS === "ios"
      ? scrollProps?.iosKeyboardOffset
        ? scrollProps.iosKeyboardOffset
        : 60
      : scrollProps?.androidKeyboardOffset
        ? scrollProps.androidKeyboardOffset
        : 60;

  if (scrollable) {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={keyboardVerticalOffset}
      >
        <ScrollView
          keyboardShouldPersistTaps="always"
          contentContainerStyle={{
            flexGrow: 1,
          }}
          style={{ flexGrow: 1 }}
          {...scrollProps}
        >
          <Box
            width={sWidth}
            maxWidth={600}
            mx="auto"
            flex={1}
            color={theme.background}
            height={"100%"}
            gap={10}
            py={10}
            px={15}
            {...bodyProps}
          >
            {children}
          </Box>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  return (
    <Box
      width={sWidth}
      color={theme.background}
      maxWidth={600}
      mx="auto"
      flex={1}
      gap={10}
      py={10}
      px={20}
      {...bodyProps}
    >
      {children}
    </Box>
  );
}
