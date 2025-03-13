import { sHeight } from "@/constants/dimensions.constant";
import React, { ReactNode } from "react";
import { Modal, ModalBaseProps, Pressable, ScrollView } from "react-native";
import Animated, {
  SlideInDown,
  SlideInUp,
  ZoomInDown,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../hooks/useTheme.hook";
import Box, { BoxProps } from "./Box";
import ThemedButton from "./ThemedButton";
import ThemedIcon, { ThemedIconProps } from "./ThemedIcon";
import ThemedText, { ThemedTextProps } from "./ThemedText";

export default function ThemedModal({
  visible = false,
  containerProps,
  position = "center",
  scrollable,
  title,
  titleProps,
  icon,
  children,
  leftChild,
  hideCloseButton = false,
  backgroundColor,
  close,
  canClose = true,
  ...modalProps
}: ThemedModalProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const MAX_HEIGHT = sHeight - insets.top * 2;

  const CloseButton = () => (
    <Pressable
      style={{ width: "100%", flex: 1 }}
      onPress={() => {
        close();
      }}
    ></Pressable>
  );
  const scrollViewRef = React.useRef<ScrollView>(null);

  return (
    <>
      {visible && (
        <Modal
          transparent
          {...modalProps}
          visible={visible}
          onRequestClose={() => {
            canClose && close && close();
          }}
        >
          <Box
            height={"100%"}
            block
            color={"rgba(0,0,0,0.5)"}
            justify={
              position === "center"
                ? "center"
                : position === "top"
                  ? "flex-start"
                  : "flex-end"
            }
            align={"center"}
            pa={position === "center" ? 10 : 0}
            pt={position === "top" ? insets.top : 0}
          >
            {position === "center" && <CloseButton />}
            {position === "bottom" && <CloseButton />}
            <Animated.View
              entering={
                position === "center"
                  ? ZoomInDown
                  : position === "bottom"
                    ? SlideInDown
                    : SlideInUp
              }
              exiting={
                position === "center"
                  ? ZoomInDown
                  : position === "bottom"
                    ? SlideInDown
                    : SlideInUp
              }
              style={{
                width: "100%",
              }}
            >
              <Box
                color={backgroundColor || theme.background}
                pt={leftChild || title ? 15 : 0}
                radiusBottom={
                  position === "top" || position === "center" ? 30 : 0
                }
                radiusTop={
                  position === "bottom" || position === "center" ? 30 : 0
                }
                block
                position="relative"
              >
                {(leftChild || title || icon) && (
                  <Box
                    direction="row"
                    block
                    justify="space-between"
                    align="center"
                    pt={!title && icon ? 20 : 0}
                  >
                    <Box flex={0.5}>{leftChild && leftChild}</Box>
                    <Box flex={1} pb={10} align="center" gap={5}>
                      {icon && <ThemedIcon size={"xxl"} {...icon} />}
                      {title && (
                        <ThemedText
                          fontWeight="semibold"
                          align="center"
                          {...titleProps}
                        >
                          {title}
                        </ThemedText>
                      )}
                    </Box>
                    <Box flex={0.5} align="flex-end"></Box>
                  </Box>
                )}
                {hideCloseButton === false && canClose === true && (
                  <ThemedButton
                    type="text"
                    size="xs"
                    style={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      zIndex: 10,
                    }}
                    color={backgroundColor ?? theme.background}
                    radius={20}
                    pa={10}
                    onPress={() => {
                      close();
                    }}
                  >
                    <ThemedIcon name="x" />
                  </ThemedButton>
                )}
                {scrollable && (
                  <ScrollView
                    style={{ maxHeight: MAX_HEIGHT }}
                    contentContainerStyle={{ flexGrow: 1 }}
                    ref={scrollViewRef}
                  >
                    <Box
                      pa={15}
                      pb={position === "bottom" ? insets.bottom + 20 : 20}
                      {...containerProps}
                    >
                      {children}
                    </Box>
                  </ScrollView>
                )}
                {!scrollable && (
                  <>
                    <Box
                      style={{ maxHeight: MAX_HEIGHT }}
                      pa={15}
                      pb={position === "bottom" ? insets.bottom + 20 : 20}
                      overflow="hidden"
                      {...containerProps}
                    >
                      {children}
                    </Box>
                  </>
                )}
              </Box>
            </Animated.View>
            {position === "top" && <CloseButton />}
            {position === "center" && <CloseButton />}
          </Box>
        </Modal>
      )}
    </>
  );
}

export interface ThemedModalProps extends ModalBaseProps {
  containerProps?: Omit<BoxProps, "children">;
  children?: ReactNode;
  position?: "top" | "center" | "bottom";
  scrollable?: boolean;
  icon?: ThemedIconProps;
  title?: string;
  titleProps?: ThemedTextProps;
  leftChild?: ReactNode;
  hideCloseButton?: boolean;
  close: () => void;
  backgroundColor?: string;
  canClose?: boolean;
}
