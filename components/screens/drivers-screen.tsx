import { useCallback } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";

import { Colors, Fonts } from "@/constants/theme";
import { DEFAULT_YEAR } from "@/constants/vaules";
import { useDriverStandings } from "@/hooks/queries/useStandings";
import { DriverStanding } from "@/services/jolpica/api";

export default function DriversScreen() {
	const { data: standings, isLoading, isError } = useDriverStandings(DEFAULT_YEAR);

	const renderItem = useCallback(({ item }: { item: DriverStanding }) => {
		return (
			<View
				style={{
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "space-between",
					backgroundColor: Colors.creamDark,
					padding: 16,
					marginBottom: 10,
					borderRadius: 18,
					borderWidth: 1,
					borderColor: Colors.border,
					shadowColor: Colors.forest,
					shadowOffset: { width: 0, height: 2 },
					shadowOpacity: 0.05,
					shadowRadius: 8,
					elevation: 2,
				}}
			>
				<View className="flex-row items-center flex-1">
					<View
						style={{
							width: 36,
							height: 36,
							borderRadius: 10,
							backgroundColor: Colors.accentSoft,
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<Text
							style={{
								fontFamily: Fonts.display,
								fontSize: 15,
								color: Colors.olive,
							}}
						>
							{item.position}
						</Text>
					</View>
					<View className="ml-3 flex-1">
						<Text
							style={{
								fontFamily: Fonts.bodySemiBold,
								fontSize: 16,
								color: Colors.forest,
							}}
							numberOfLines={1}
						>
							{item.Driver.givenName} {item.Driver.familyName}
						</Text>
						<Text
							style={{
								fontFamily: Fonts.body,
								fontSize: 12,
								color: Colors.textMuted,
							}}
							numberOfLines={1}
						>
							{item.Constructors[0]?.name}
						</Text>
					</View>
				</View>
				<View className="items-end pl-2">
					<Text
						style={{
							fontFamily: Fonts.display,
							fontSize: 16,
							color: Colors.sienna,
						}}
					>
						{item.points}
					</Text>
					<Text
						style={{
							fontFamily: Fonts.displayLight,
							fontSize: 10,
							color: Colors.textMuted,
							letterSpacing: 1,
						}}
					>
						PTS
					</Text>
				</View>
			</View>
		);
	}, []);

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

	if (isError) {
		return (
			<View
				className="flex-1 justify-center items-center px-5"
				style={{ backgroundColor: Colors.background }}
			>
				<Text style={{ fontFamily: Fonts.body, color: Colors.error }}>
					Error loading driver standings.
				</Text>
			</View>
		);
	}

	return (
		<View
			className="flex-1 px-5 pt-4"
			style={{ backgroundColor: Colors.background }}
		>
			<FlatList
				data={standings}
				keyExtractor={(item) => item.Driver.driverId}
				renderItem={renderItem}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ paddingBottom: 100 }}
			/>
		</View>
	);
}
