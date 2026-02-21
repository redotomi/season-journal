import { Text, View } from "react-native";

import { JournalColors, JournalFonts } from "@/constants/theme";

export default function BingoScreen() {
	return (
		<View
			className="flex-1 items-center justify-center px-8"
			style={{ backgroundColor: JournalColors.parchment }}
		>
			<Text
				style={{
					fontFamily: JournalFonts.display,
					fontSize: 42,
					color: JournalColors.ink,
					transform: [{ rotate: "-2deg" }],
				}}
			>
				Bingo Card
			</Text>

			<View
				style={{
					width: 60,
					height: 3,
					backgroundColor: JournalColors.sienna,
					borderRadius: 2,
					marginTop: 8,
					marginBottom: 24,
					transform: [{ rotate: "1deg" }],
					opacity: 0.6,
				}}
			/>

			<Text
				style={{
					fontFamily: JournalFonts.body,
					fontSize: 16,
					color: JournalColors.inkLight,
					textAlign: "center",
					lineHeight: 24,
				}}
			>
				Make your race predictions here.{"\n"}
				Cross them off as they come true!
			</Text>

			<View
				style={{
					marginTop: 40,
					width: 120,
					height: 120,
					borderWidth: 2,
					borderColor: JournalColors.line,
					borderRadius: 12,
					borderStyle: "dashed",
					alignItems: "center",
					justifyContent: "center",
					transform: [{ rotate: "1.5deg" }],
				}}
			>
				<Text
					style={{
						fontFamily: JournalFonts.displayMedium,
						fontSize: 48,
						color: JournalColors.rose,
					}}
				>
					?
				</Text>
			</View>
		</View>
	);
}
