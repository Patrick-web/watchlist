import { useThemeMode } from "./useTheme.hook";

export default function usePastelColor(hue: number) {
	const themeMode = useThemeMode();
	return themeMode === "dark" ? `hsl(${hue},30%,20%)` : `hsl(${hue},70%,90%)`;
}
