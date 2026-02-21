import { Heart } from "lucide-react-native";
import { Text, View } from "react-native";

import { JournalColors, JournalFonts } from "@/constants/theme";

export default function FavouriteTeamScreen() {
	return (
		<View
			className="flex-1 items-center justify-center px-8"
			style={{ backgroundColor: JournalColors.parchment }}
		>
			<View
				style={{
					alignItems: "center",
					transform: [{ rotate: "1deg" }],
				}}
			>
				<Heart
					color={JournalColors.rose}
					size={48}
					strokeWidth={1.2}
					fill={JournalColors.rose}
				/>

				<Text
					style={{
						fontFamily: JournalFonts.display,
						fontSize: 36,
						color: JournalColors.ink,
						marginTop: 16,
					}}
				>
					Favourite Team
				</Text>

				<View
					style={{
						width: 60,
						height: 3,
						backgroundColor: JournalColors.rose,
						borderRadius: 2,
						marginTop: 8,
						marginBottom: 20,
						transform: [{ rotate: "-2deg" }],
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
					Pick your favorite constructor{"\n"}and track their progress
				</Text>
			</View>
		</View>
	);
}
