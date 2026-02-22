import { Tabs } from "expo-router";
import { Grid3X3, Heart, TrendingUp } from "lucide-react-native";
import { useCallback } from "react";

import GlassyTabBar from "@/components/journal-tab-bar";

export default function TabLayout() {
	const renderTabBar = useCallback(
		(props: React.ComponentProps<typeof GlassyTabBar>) => (
			<GlassyTabBar {...props} />
		),
		[]
	);

	return (
		<Tabs
			tabBar={renderTabBar}
			screenOptions={{
				headerShown: false,
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: "Bingo",
					tabBarIcon: ({ color, size }) => (
						<Grid3X3 color={color} size={size} strokeWidth={1.25} />
					),
				}}
			/>
			<Tabs.Screen
				name="tracking"
				options={{
					title: "Tracking",
					tabBarIcon: ({ color, size }) => (
						<TrendingUp color={color} size={size} strokeWidth={1.25} />
					),
				}}
			/>
			<Tabs.Screen
				name="favourites"
				options={{
					title: "Favourites",
					tabBarIcon: ({ color, size }) => (
						<Heart color={color} size={size} strokeWidth={1.25} />
					),
				}}
			/>
		</Tabs>
	);
}
