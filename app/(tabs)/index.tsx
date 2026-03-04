import { Text, View } from "react-native";

import BingoGrid from "@/components/bingo/bingo-grid";
import GrainOverlay from "@/components/ui/grain-overlay";
import { Colors, Fonts } from "@/constants/theme";

export default function BingoScreen() {
	return (
		<View
			className="flex-1 px-5 pt-16"
			style={{ backgroundColor: Colors.background }}
		>
			<GrainOverlay opacity={0.035} />
			<Text
				style={{
					fontFamily: Fonts.display,
					fontSize: 28,
					color: Colors.forest,
					marginBottom: 4,
					letterSpacing: -0.5,
				}}
			>
				Bingo Card
			</Text>
			<Text
				style={{
					fontFamily: Fonts.displayLight,
					fontSize: 15,
					color: Colors.textMuted,
					marginBottom: 24,
					letterSpacing: 0.2,
				}}
			>
				Make your race predictions
			</Text>

			<BingoGrid />
		</View>
	);
}
