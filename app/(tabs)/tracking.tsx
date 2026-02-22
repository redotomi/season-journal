import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import ConstructorsScreen from "@/components/screens/constructors-screen";
import DriversScreen from "@/components/screens/drivers-screen";
import { Colors, Fonts } from "@/constants/theme";

const TopTabs = createMaterialTopTabNavigator();

export default function TrackingScreen() {
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
					name="Drivers"
					component={DriversScreen}
					options={{ title: "Drivers" }}
				/>
				<TopTabs.Screen
					name="Constructors"
					component={ConstructorsScreen}
					options={{ title: "Constructors" }}
				/>
			</TopTabs.Navigator>
		</View>
	);
}
