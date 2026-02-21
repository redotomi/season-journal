import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import ConstructorsScreen from "@/components/screens/constructors-screen";
import DriversScreen from "@/components/screens/drivers-screen";
import { JournalColors, JournalFonts } from "@/constants/theme";

const TopTabs = createMaterialTopTabNavigator();

export default function TrackingScreen() {
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
					backgroundColor: JournalColors.sienna,
					height: 2.5,
					borderRadius: 2,
				},
				tabBarLabelStyle: {
					fontFamily: JournalFonts.displayMedium,
					fontSize: 16,
					textTransform: "none",
				},
				tabBarActiveTintColor: JournalColors.sienna,
				tabBarInactiveTintColor: JournalColors.muted,
				tabBarPressColor: JournalColors.line,
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
	);
}
