import React, {
  forwardRef,
  useEffect,
  useRef,
  useCallback,
  useState,
} from "react";
import Box, { BottomSheetBox, BoxProps } from "./Box";
import ThemedIcon, { ThemedIconProps } from "./ThemedIcon";
import ThemedText, { ThemedTextProps } from "./ThemedText";
import useBack from "@/hooks/useBack.hook";
import { useTheme } from "@/hooks/useTheme.hook";
import { TrueSheet, TrueSheetProps } from "@lodev09/react-native-true-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Platform, ScrollView, ScrollViewProps } from "react-native";

const ThemedTrueSheet = forwardRef<TrueSheet, ThemedSheetProps>(
  (
    {
      scrollable,
      icon,
      title,
      titleProps,
      backgroundColor,
      visible = true,
      footer,
      noBackdrop = false,
      scrollViewProps,
      children,
      ...sheetProps
    },
    ref
  ) => {
    const trueSheetRef = useRef<TrueSheet>(null);
    const theme = useTheme();

    // Handle back navigation
    const [footerHeight, setFooterHeight] = useState(0);

    const scrollviewRef = useRef<ScrollView>(null);

    useEffect(() => {
      if (visible) {
        trueSheetRef.current?.present();
      } else {
        trueSheetRef.current?.dismiss();
      }
    }, [visible]);

    return (
      <>
        {/* {visible && ( */}
        <TrueSheet
          ref={ref || trueSheetRef}
          scrollRef={scrollviewRef}
          dimmed={noBackdrop ? false : true}
          FooterComponent={() => {
            return (
              <>
                {footer && (
                  <Box
                    viewProps={{
                      onLayout: (e) => {
                        const footerDimensions = e.nativeEvent.layout;
                        console.log(footerDimensions);
                        setFooterHeight(footerDimensions?.height ?? 0);
                      },
                    }}
                  >
                    {footer}
                  </Box>
                )}
              </>
            );
          }}
          sizes={["auto"]}
          initialIndex={visible ? 1 : undefined}
          initialIndexAnimated
          backgroundColor={backgroundColor || theme.background}
          {...sheetProps}
        >
          {(title || icon) && (
            <Box align="center" gap={5}>
              {icon && <ThemedIcon size={"xxl"} {...icon} />}
              <ThemedText fontWeight="bold" align="center" {...titleProps}>
                {title || ""}
              </ThemedText>
            </Box>
          )}
          {scrollable ? (
            <ScrollView
              ref={scrollviewRef}
              nestedScrollEnabled
              contentContainerStyle={{ flexGrow: 1 }}
              contentInset={{
                bottom: Platform.OS === "ios" ? footerHeight : undefined,
              }}
              {...scrollViewProps}
            >
              {children}
            </ScrollView>
          ) : (
            <>{children}</>
          )}
        </TrueSheet>
        {/* )} */}
      </>
    );
  }
);

export default ThemedTrueSheet;

export interface ThemedSheetProps extends Omit<TrueSheetProps, "children"> {
  visible?: boolean;
  children: React.ReactNode;
  scrollable?: boolean;
  icon?: ThemedIconProps;
  title?: string;
  titleProps?: ThemedTextProps;
  backgroundColor?: string;
  footer?: React.ReactNode;
  scrollViewProps?: Omit<ScrollViewProps, "children">;
  noBackdrop?: boolean;
}
