import { Grid3X3 } from "lucide-react-native";
import { Text, View } from "react-native";

import { Colors, Fonts } from "@/constants/theme";

export default function BingoScreen() {
	return (
		<View
			className="flex-1 px-5 pt-16"
			style={{ backgroundColor: Colors.background }}
		>
			<Text
				style={{
					fontFamily: Fonts.display,
					fontSize: 28,
					color: Colors.textPrimary,
					marginBottom: 4,
				}}
			>
				Bingo Card
			</Text>
			<Text
				style={{
					fontFamily: Fonts.body,
					fontSize: 15,
					color: Colors.textSecondary,
					marginBottom: 24,
				}}
			>
				Make your race predictions
			</Text>

			<View
				style={{
					backgroundColor: Colors.surfaceSolid,
					borderRadius: 24,
					padding: 32,
					alignItems: "center",
					shadowColor: "#000",
					shadowOffset: { width: 0, height: 4 },
					shadowOpacity: 0.06,
					shadowRadius: 16,
					elevation: 4,
				}}
			>
				<View
					style={{
						width: 80,
						height: 80,
						borderRadius: 20,
						backgroundColor: Colors.accentSoft,
						alignItems: "center",
						justifyContent: "center",
						marginBottom: 20,
					}}
				>
					<Grid3X3
						color={Colors.accent}
						size={36}
						strokeWidth={1.25}
					/>
				</View>

				<Text
					style={{
						fontFamily: Fonts.displayMedium,
						fontSize: 20,
						color: Colors.textPrimary,
						marginBottom: 8,
					}}
				>
					Your Predictions
				</Text>

				<Text
					style={{
						fontFamily: Fonts.body,
						fontSize: 14,
						color: Colors.textSecondary,
						textAlign: "center",
						lineHeight: 20,
					}}
				>
					Cross them off as they come true!
				</Text>
			</View>
		</View>
	);
}
