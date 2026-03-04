import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import FavouriteDriverScreen from "@/components/screens/favourite-driver-screen";
import FavouriteTeamScreen from "@/components/screens/favourite-team-screen";
import GrainOverlay from "@/components/ui/grain-overlay";
import { Colors, Fonts } from "@/constants/theme";

const TopTabs = createMaterialTopTabNavigator();

export default function FavouritesScreen() {
	const insets = useSafeAreaInsets();

	return (
		<View style={{ flex: 1, backgroundColor: Colors.background }}>
			<GrainOverlay opacity={0.035} />
			<View
				style={{
					paddingTop: insets.top + 16,
					paddingHorizontal: 20,
					paddingBottom: 12,
					backgroundColor: "transparent",
				}}
			/>
			<TopTabs.Navigator
				screenOptions={{
					tabBarStyle: {
						backgroundColor: Colors.creamDark,
						marginHorizontal: 20,
						borderRadius: 24,
						elevation: 0,
						shadowColor: Colors.forest,
						shadowOffset: { width: 0, height: 2 },
						shadowOpacity: 0.06,
						shadowRadius: 8,
						height: 48,
						overflow: "hidden",
						borderWidth: 1,
						borderColor: Colors.border,
					},
					tabBarIndicatorStyle: {
						backgroundColor: Colors.olive,
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
					tabBarActiveTintColor: Colors.cream,
					tabBarInactiveTintColor: Colors.textMuted,
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
