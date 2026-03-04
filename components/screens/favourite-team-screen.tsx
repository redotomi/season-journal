import { Heart } from "lucide-react-native";
import { ActivityIndicator, Text, View } from "react-native";

import { Colors, Fonts } from "@/constants/theme";
import { useFavoriteTeam } from "@/hooks/queries/useFavorites";

export default function FavouriteTeamScreen() {
	const mockFavoriteId = "red_bull";
	const { data: team, isLoading, isError } = useFavoriteTeam(mockFavoriteId);

	if (isLoading) {
		return (
			<View
				className="flex-1 justify-center items-center"
				style={{ backgroundColor: Colors.background }}
			>
				<ActivityIndicator size="large" color={Colors.wheat} />
			</View>
		);
	}

	if (isError || !team) {
		return (
			<View
				className="flex-1 justify-center items-center px-5"
				style={{ backgroundColor: Colors.background }}
			>
				<Text style={{ fontFamily: Fonts.body, color: Colors.textMuted }}>
					Could not load favorite team details.
				</Text>
			</View>
		);
	}

	return (
		<View
			className="flex-1 px-5 pt-8"
			style={{ backgroundColor: Colors.background }}
		>
			<View
				style={{
					backgroundColor: Colors.creamDark,
					borderRadius: 24,
					padding: 32,
					alignItems: "center",
					borderWidth: 1,
					borderColor: Colors.border,
					shadowColor: Colors.forest,
					shadowOffset: { width: 0, height: 4 },
					shadowOpacity: 0.08,
					shadowRadius: 16,
					elevation: 4,
				}}
			>
				<View
					style={{
						width: 72,
						height: 72,
						borderRadius: 20,
						backgroundColor: Colors.accentSoft,
						alignItems: "center",
						justifyContent: "center",
						marginBottom: 20,
					}}
				>
					<Heart
						color={Colors.olive}
						size={32}
						strokeWidth={1.25}
						fill={Colors.olive}
					/>
				</View>

				<Text
					style={{
						fontFamily: Fonts.display,
						fontSize: 24,
						color: Colors.forest,
						marginBottom: 8,
						letterSpacing: -0.5,
					}}
				>
					{team.name}
				</Text>

				<Text
					style={{
						fontFamily: Fonts.body,
						fontSize: 14,
						color: Colors.textMuted,
						textAlign: "center",
						lineHeight: 20,
					}}
				>
					Nationality: {team.nationality}
				</Text>
			</View>
		</View>
	);
}
