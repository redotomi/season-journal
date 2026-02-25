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
			<View className="flex-row items-center justify-between bg-surfaceSolid p-4 mb-3 rounded-2xl shadow-sm">
				<View className="flex-row items-center flex-1">
					<Text
						style={{
							fontFamily: Fonts.displayMedium,
							fontSize: 18,
							color: Colors.textPrimary,
							width: 32,
						}}
					>
						{item.position}
					</Text>
					<View className="ml-3 flex-1">
						<Text
							style={{
								fontFamily: Fonts.bodyBold,
								fontSize: 16,
								color: Colors.textPrimary,
							}}
							numberOfLines={1}
						>
							{item.Driver.givenName} {item.Driver.familyName}
						</Text>
						<Text
							style={{
								fontFamily: Fonts.body,
								fontSize: 12,
								color: Colors.textSecondary,
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
							fontFamily: Fonts.bodyBold,
							fontSize: 16,
							color: Colors.textPrimary,
						}}
					>
						{item.points} PTS
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
				<ActivityIndicator size="large" color={Colors.accent} />
			</View>
		);
	}

	if (isError) {
		return (
			<View
				className="flex-1 justify-center items-center px-5"
				style={{ backgroundColor: Colors.background }}
			>
				<Text style={{ fontFamily: Fonts.body, color: Colors.rose }}>
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
				contentContainerStyle={{ paddingBottom: 24 }}
			/>
		</View>
	);
}
