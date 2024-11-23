import React from "react";
import Box from "./Box";
import ThemedButton from "./ThemedButton";
import ThemedIcon from "./ThemedIcon";
import ThemedText, { ThemedTextProps } from "./ThemedText";

export default function ThemedSectionButton({
	onPress,
	title,
	titleProps,
	description,
	descriptionProps,
	rightText,
	rightComponent,
}: ThemedSectionButtonProps) {
	return (
		<ThemedButton
			type="text"
			onPress={() => {
				onPress();
			}}
		>
			<Box block gap={5}>
				<Box
					block
					gap={10}
					direction="row"
					align="center"
					justify="space-between"
				>
					<ThemedText fontWeight="bold" {...titleProps}>
						{title}
					</ThemedText>
					{rightComponent ? (
						rightComponent
					) : (
						<>
							{rightText ? (
								<Box gap={10} direction="row" align="center">
									<ThemedText size={"sm"}>{rightText}</ThemedText>
									<ThemedIcon name="chevron-right" />
								</Box>
							) : (
								<ThemedIcon name="chevron-right" />
							)}
						</>
					)}
				</Box>
				{description && (
					<ThemedText size={"sm"} fontWeight="light" {...descriptionProps}>
						{description}
					</ThemedText>
				)}
			</Box>
		</ThemedButton>
	);
}

interface ThemedSectionButtonProps {
	onPress: () => void;
	title: string;
	titleProps?: ThemedTextProps;
	description?: string;
	descriptionProps?: ThemedTextProps;
	rightText?: string;
	rightComponent?: React.ReactNode;
}
