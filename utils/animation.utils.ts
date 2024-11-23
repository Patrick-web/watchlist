import { LayoutAnimation, Platform, UIManager } from "react-native";

if (Platform.OS === "android") {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

export function animateLayout() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
}
