import React, { forwardRef, useEffect, useRef, useCallback } from "react";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetFooter,
  BottomSheetModal,
  BottomSheetProps,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import Box, { BottomSheetBox, BoxProps } from "./Box";
import ThemedIcon, { ThemedIconProps } from "./ThemedIcon";
import ThemedText, { ThemedTextProps } from "./ThemedText";
import useBack from "@/hooks/useBack.hook";
import { useTheme } from "@/hooks/useTheme.hook";
import { BottomSheetScrollViewProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetScrollable/types";

const renderBackdrop = (props: BottomSheetBackdropProps) => (
  <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} />
);

const ThemedSheet = forwardRef<BottomSheet, ThemedSheetProps>(
  (
    {
      scrollable,
      icon,
      title,
      titleProps,
      close,
      backgroundColor,
      canClose = true,
      visible = true,
      footer,
      noBackdrop,
      containerProps,
      scrollViewProps,
      children,
      ...sheetProps
    },
    ref,
  ) => {
    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const theme = useTheme();

    // Handle back navigation
    useBack(() => {
      if (visible) {
        close && close();
        return true;
      }
      return false;
    });

    // Effect to manage visibility and expose ref
    useEffect(() => {
      if (ref) {
        (ref as React.MutableRefObject<BottomSheet | null>).current =
          bottomSheetRef.current;
      }
    }, [ref]);

    const renderFooter = useCallback(
      (props: any) => (
        <BottomSheetFooter {...props} bottomInset={0}>
          <Box block color={theme.background}>
            {footer}
          </Box>
        </BottomSheetFooter>
      ),
      [footer, theme.background],
    );

    return (
      <>
        {visible && (
          <BottomSheet
            ref={bottomSheetRef}
            enablePanDownToClose={canClose}
            onClose={close}
            backdropComponent={noBackdrop ? undefined : renderBackdrop}
            style={{
              borderRadius: 60,
              overflow: "hidden",
            }}
            backgroundStyle={{
              backgroundColor: backgroundColor || theme.background,
            }}
            handleIndicatorStyle={{
              backgroundColor: theme.surface,
            }}
            footerComponent={(props) =>
              renderFooter({
                ...props,
                footer,
              })
            }
            enableDynamicSizing={true}
            containerStyle={{
              gap: 10,
            }}
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
              <BottomSheetScrollView
                contentContainerStyle={{ paddingBottom: 40 }}
                {...scrollViewProps}
              >
                {children}
              </BottomSheetScrollView>
            ) : (
              <BottomSheetBox gap={10} flexGrow={1} {...containerProps}>
                {children}
              </BottomSheetBox>
            )}
          </BottomSheet>
        )}
      </>
    );
  },
);

export default ThemedSheet;

export interface ThemedSheetProps extends Omit<BottomSheetProps, "children"> {
  visible?: boolean;
  children: React.ReactNode;
  scrollable?: boolean;
  icon?: ThemedIconProps;
  title?: string;
  titleProps?: ThemedTextProps;
  close?: () => void;
  backgroundColor?: string;
  canClose?: boolean;
  footer?: React.ReactNode;
  containerProps?: BoxProps;
  scrollViewProps?: Omit<BottomSheetScrollViewProps, "children">;
  noBackdrop?: boolean;
}
