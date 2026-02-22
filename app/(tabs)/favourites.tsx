import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import FavouriteDriverScreen from "@/components/screens/favourite-driver-screen";
import FavouriteTeamScreen from "@/components/screens/favourite-team-screen";
import { Colors, Fonts } from "@/constants/theme";

const TopTabs = createMaterialTopTabNavigator();

export default function FavouritesScreen() {
	const insets = useSafeAreaInsets();

	return (
		<View style={{ flex: 1, backgroundColor: Colors.background }}>
			<View
				style={{
					paddingTop: insets.top + 16,
					paddingHorizontal: 20,
					paddingBottom: 12,
					backgroundColor: Colors.background,
				}}
			/>
			<TopTabs.Navigator
				screenOptions={{
					tabBarStyle: {
						backgroundColor: Colors.surfaceSolid,
						marginHorizontal: 20,
						borderRadius: 24,
						elevation: 0,
						shadowColor: "#000",
						shadowOffset: { width: 0, height: 2 },
						shadowOpacity: 0.04,
						shadowRadius: 8,
						height: 48,
						overflow: "hidden",
					},
					tabBarIndicatorStyle: {
						backgroundColor: Colors.accent,
						height: 40,
						borderRadius: 20,
						top: 4,
					},
					tabBarIndicatorContainerStyle: {
						paddingHorizontal: 6,
					},
					tabBarLabelStyle: {
						fontFamily: Fonts.bodyBold,
						fontSize: 14,
						textTransform: "none",
					},
					tabBarActiveTintColor: Colors.textPrimary,
					tabBarInactiveTintColor: Colors.textSecondary,
					tabBarPressColor: "transparent",
				}}
			>
				<TopTabs.Screen
					name="Driver"
					component={FavouriteDriverScreen}
					options={{ title: "Driver" }}
				/>
				<TopTabs.Screen
					name="Team"
					component={FavouriteTeamScreen}
					options={{ title: "Team" }}
				/>
			</TopTabs.Navigator>
		</View>
	);
}
