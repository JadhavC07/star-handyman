import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { BlurView } from "expo-blur";
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
} from "react";
import { Platform, StyleSheet, View } from "react-native";
import { theme } from "@/src/theme/theme";

export type BottomSheetRef = {
  present: () => void;
  dismiss: () => void;
};

type BottomSheetProps = {
  children: React.ReactNode;
  snapPoints?: (string | number)[];
  /** If true, the sheet grows to fit its content. Default true. */
  dynamicSize?: boolean;
  onDismiss?: () => void;
};

/**
 * Thin wrapper over @gorhom/bottom-sheet's BottomSheetModal with iOS-native defaults:
 * rounded-top corners, grab handle, translucent blur backdrop, dynamic sizing.
 */
export const BottomSheet = forwardRef<BottomSheetRef, BottomSheetProps>(
  function BottomSheet(
    { children, snapPoints, dynamicSize = true, onDismiss },
    ref,
  ) {
    const modalRef = useRef<BottomSheetModal>(null);

    useImperativeHandle(ref, () => ({
      present: () => modalRef.current?.present(),
      dismiss: () => modalRef.current?.dismiss(),
    }));

    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          opacity={Platform.OS === "ios" ? 0.3 : 0.5}
        >
          {Platform.OS === "ios" ? (
            <BlurView
              intensity={20}
              tint="dark"
              style={StyleSheet.absoluteFill}
            />
          ) : null}
        </BottomSheetBackdrop>
      ),
      [],
    );

    return (
      <BottomSheetModal
        ref={modalRef}
        snapPoints={snapPoints}
        enableDynamicSizing={dynamicSize}
        onDismiss={onDismiss}
        backdropComponent={renderBackdrop}
        backgroundStyle={styles.background}
        handleIndicatorStyle={styles.handle}
      >
        <BottomSheetView style={styles.content}>
          <View style={styles.inner}>{children}</View>
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);

const styles = StyleSheet.create({
  background: {
    backgroundColor: theme.colors.ios.secondarySystemGroupedBackground,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  handle: {
    backgroundColor: theme.colors.ios.tertiaryLabel,
    width: 36,
    height: 5,
  },
  content: { paddingBottom: 24 },
  inner:   { paddingHorizontal: 16, paddingTop: 8 },
});
