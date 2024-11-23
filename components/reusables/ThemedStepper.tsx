import { useTheme } from "@/hooks/useTheme.hook";
import Box, { BoxProps } from "./Box";
import ThemedButton from "./ThemedButton";
import ThemedText from "./ThemedText";

interface StepperProps extends BoxProps {
	steps: {
		title: string;
		label: string;
		description: string;
	}[];
	currentStep: number;
	onStepChange: (step: number) => void;
}

export default function ThemedStepper({
	steps,
	currentStep,
	onStepChange,
	...boxProps
}: StepperProps) {
	const theme = useTheme();
	return (
		<Box gap={20} block align="center" justify="center" {...boxProps}>
			<Box
				direction="row"
				align="center"
				block
				gap={10}
				mx={"auto"}
				justify="center"
			>
				{steps.map((step, index) => (
					<ThemedButton
						type="text"
						key={index}
						onPress={() => onStepChange(index)}
					>
						<Box direction="row" align="center" gap={5}>
							<Box align="center" gap={5}>
								<Box
									pa={5}
									px={10}
									radius={20}
									color={currentStep === index ? theme.primary : theme.surface}
								>
									<ThemedText
										size="xs"
										color={currentStep === index ? "white" : theme.text}
									>
										{index + 1}
									</ThemedText>
								</Box>
								<ThemedText
									size="xs"
									fontWeight={currentStep === index ? "medium" : "regular"}
									color={currentStep === index ? theme.primary : theme.text}
								>
									{step.title}
								</ThemedText>
							</Box>

							{index < steps.length - 1 && (
								<Box
									minWidth={25}
									flexGrow={1}
									height={1}
									color={currentStep === index ? theme.primary : theme.text}
									opacity={currentStep === index ? 1 : 0.5}
								/>
							)}
						</Box>
					</ThemedButton>
				))}
			</Box>
		</Box>
	);
}
