import { TrendingUp } from "lucide-react-native";
import { Text, View } from "react-native";

import { Colors, Fonts } from "@/constants/theme";

export default function ConstructorsScreen() {
	return (
		<View
			className="flex-1 px-5 pt-8"
			style={{ backgroundColor: Colors.background }}
		>
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
						width: 72,
						height: 72,
						borderRadius: 18,
						backgroundColor: "#E8F0F8",
						alignItems: "center",
						justifyContent: "center",
						marginBottom: 20,
					}}
				>
					<TrendingUp
						color={Colors.sky}
						size={32}
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
					Constructors Championship
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
					Follow each team{"'"}s battle for the championship
				</Text>
			</View>
		</View>
	);
}
