import { Text, View } from "react-native";

import BingoGrid from "@/components/bingo/bingo-grid";
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

			<BingoGrid />
		</View>
	);
}
