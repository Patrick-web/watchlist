import { useFocusEffect } from "expo-router";
import React from "react";

export function useRefreshOnFocus(callback: () => void) {
	const firstTimeRef = React.useRef(true);

	useFocusEffect(
		React.useCallback(() => {
			if (firstTimeRef.current) {
				firstTimeRef.current = false;
				return;
			}
			callback(); // Call the refetch function when the screen is focused
		}, [callback])
	);
}
