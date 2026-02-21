import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import FavouriteDriverScreen from "@/components/screens/favourite-driver-screen";
import FavouriteTeamScreen from "@/components/screens/favourite-team-screen";
import { JournalColors, JournalFonts } from "@/constants/theme";

const TopTabs = createMaterialTopTabNavigator();

export default function FavouritesScreen() {
	const insets = useSafeAreaInsets();

	return (
		<TopTabs.Navigator
			screenOptions={{
				tabBarStyle: {
					backgroundColor: JournalColors.cream,
					elevation: 0,
					shadowOpacity: 0,
					borderBottomWidth: 1,
					borderBottomColor: JournalColors.line,
					paddingTop: insets.top,
				},
				tabBarIndicatorStyle: {
					backgroundColor: JournalColors.rose,
					height: 2.5,
					borderRadius: 2,
				},
				tabBarLabelStyle: {
					fontFamily: JournalFonts.displayMedium,
					fontSize: 16,
					textTransform: "none",
				},
				tabBarActiveTintColor: JournalColors.rose,
				tabBarInactiveTintColor: JournalColors.muted,
				tabBarPressColor: JournalColors.line,
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
	);
}
