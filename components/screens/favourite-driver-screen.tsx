import { Heart } from "lucide-react-native";
import { Text, View } from "react-native";

import { JournalColors, JournalFonts } from "@/constants/theme";

export default function FavouriteDriverScreen() {
	return (
		<View
			className="flex-1 items-center justify-center px-8"
			style={{ backgroundColor: JournalColors.parchment }}
		>
			<View
				style={{
					alignItems: "center",
					transform: [{ rotate: "-1.5deg" }],
				}}
			>
				<Heart
					color={JournalColors.rose}
					size={48}
					strokeWidth={1.2}
				/>

				<Text
					style={{
						fontFamily: JournalFonts.display,
						fontSize: 36,
						color: JournalColors.ink,
						marginTop: 16,
					}}
				>
					Favourite Driver
				</Text>

				<View
					style={{
						width: 60,
						height: 3,
						backgroundColor: JournalColors.rose,
						borderRadius: 2,
						marginTop: 8,
						marginBottom: 20,
						transform: [{ rotate: "1.5deg" }],
						opacity: 0.5,
					}}
				/>

				<Text
					style={{
						fontFamily: JournalFonts.body,
						fontSize: 15,
						color: JournalColors.inkLight,
						textAlign: "center",
						lineHeight: 22,
					}}
				>
					Choose your champion{"\n"}and follow their season
				</Text>
			</View>
		</View>
	);
}
