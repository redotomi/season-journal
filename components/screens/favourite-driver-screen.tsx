import { Calendar, Flag, Heart } from "lucide-react-native";
import { ActivityIndicator, Text, View } from "react-native";

import { Colors, Fonts } from "@/constants/theme";
import { useFavoriteDriver } from "@/hooks/queries/useFavorites";

const MOCK_FAVORITE_ID = "max_verstappen";

const LoadingState = (
	<View
		className="flex-1 justify-center items-center"
		style={{ backgroundColor: Colors.background }}
	>
		<ActivityIndicator size="large" color={Colors.wheat} />
	</View>
);

const ErrorState = (
	<View
		className="flex-1 justify-center items-center px-5"
		style={{ backgroundColor: Colors.background }}
	>
		<Text
			style={{
				fontFamily: Fonts.body,
				color: Colors.textMuted,
			}}
		>
			Could not load favorite driver details.
		</Text>
	</View>
);

export default function FavouriteDriverScreen() {
	const { data: driver, isLoading, isError } = useFavoriteDriver(MOCK_FAVORITE_ID);

	if (isLoading) {
		return LoadingState;
	}

	if (isError || !driver) {
		return ErrorState;
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
						fontSize: 26,
						color: Colors.forest,
						marginBottom: 4,
						textAlign: "center",
						letterSpacing: -0.5,
					}}
				>
					{driver.givenName} {driver.familyName}
				</Text>

				<View
					style={{
						backgroundColor: Colors.wheat,
						paddingHorizontal: 16,
						paddingVertical: 6,
						borderRadius: 20,
						marginBottom: 28,
					}}
				>
					<Text
						style={{
							fontFamily: Fonts.display,
							fontSize: 18,
							color: Colors.forest,
						}}
					>
						{driver.permanentNumber}
					</Text>
				</View>

				<View
					style={{
						width: "100%",
						backgroundColor: Colors.cream,
						borderRadius: 16,
						padding: 16,
						marginBottom: 10,
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "space-between",
						borderWidth: 1,
						borderColor: Colors.border,
					}}
				>
					<View className="flex-row items-center">
						<Flag color={Colors.textMuted} size={20} strokeWidth={1.75} />
						<Text
							style={{
								fontFamily: Fonts.body,
								color: Colors.textMuted,
								marginLeft: 12,
								fontSize: 15,
							}}
						>
							Nationality
						</Text>
					</View>
					<Text
						style={{
							fontFamily: Fonts.bodySemiBold,
							color: Colors.forest,
							fontSize: 15,
						}}
					>
						{driver.nationality}
					</Text>
				</View>

				<View
					style={{
						width: "100%",
						backgroundColor: Colors.cream,
						borderRadius: 16,
						padding: 16,
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "space-between",
						borderWidth: 1,
						borderColor: Colors.border,
					}}
				>
					<View className="flex-row items-center">
						<Calendar color={Colors.textMuted} size={20} strokeWidth={1.75} />
						<Text
							style={{
								fontFamily: Fonts.body,
								color: Colors.textMuted,
								marginLeft: 12,
								fontSize: 15,
							}}
						>
							Date of Birth
						</Text>
					</View>
					<Text
						style={{
							fontFamily: Fonts.bodySemiBold,
							color: Colors.forest,
							fontSize: 15,
						}}
					>
						{driver.dateOfBirth}
					</Text>
				</View>
			</View>
		</View>
	);
}
