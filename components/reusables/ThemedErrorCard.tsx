import React from "react";
import ThemedCard from "./ThemedCard";
import ThemedText from "./ThemedText";

export default function ThemedErrorCard({
	title,
	error,
}: ThemedErrorCardProps) {
	return (
		<ThemedCard
			title={title ?? "Error"}
			icon={{
				name: "alert-circle",
				color: "red",
			}}
			color={"rgba(255, 0, 0, 0.1)"}
		>
			<ThemedText align="center">{error}</ThemedText>
		</ThemedCard>
	);
}

interface ThemedErrorCardProps {
	title?: string;
	error: string;
}
