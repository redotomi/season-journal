import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useCallback, useMemo } from "react";
import { Pressable, View } from "react-native";

import { Colors } from "@/constants/theme";

export default function GlassyTabBar({
	state,
	descriptors,
	navigation,
}: BottomTabBarProps) {
	const routes = state.routes;

	const handlePress = useCallback(
		(routeKey: string, routeName: string, isFocused: boolean) => {
			const event = navigation.emit({
				type: "tabPress",
				target: routeKey,
				canPreventDefault: true,
			});

			if (!isFocused && !event.defaultPrevented) {
				navigation.navigate(routeName);
			}
		},
		[navigation]
	);

	const handleLongPress = useCallback(
		(routeKey: string) => {
			navigation.emit({
				type: "tabLongPress",
				target: routeKey,
			});
		},
		[navigation]
	);

	const tabs = useMemo(
		() =>
			routes.map((route) => {
				const { options } = descriptors[route.key];
				const isFocused = state.index === routes.indexOf(route);

				return {
					key: route.key,
					routeName: route.name,
					isFocused,
					icon: options.tabBarIcon,
				};
			}),
		[routes, descriptors, state.index]
	);

	return (
		<View
			style={{
				position: "absolute",
				bottom: 32,
				left: 40,
				right: 40,
				backgroundColor: Colors.dark,
				borderRadius: 28,
				flexDirection: "row",
				alignItems: "center",
				justifyContent: "space-evenly",
				paddingVertical: 12,
				shadowColor: "#000",
				shadowOffset: { width: 0, height: 8 },
				shadowOpacity: 0.15,
				shadowRadius: 24,
				elevation: 12,
			}}
		>
			{tabs.map((tab) => (
				<Pressable
					key={tab.key}
					accessibilityRole="button"
					accessibilityState={tab.isFocused ? { selected: true } : {}}
					onPress={() =>
						handlePress(tab.key, tab.routeName, tab.isFocused)
					}
					onLongPress={() => handleLongPress(tab.key)}
					style={{
						width: 48,
						height: 48,
						borderRadius: 24,
						alignItems: "center",
						justifyContent: "center",
						backgroundColor: tab.isFocused
							? Colors.white
							: "transparent",
					}}
				>
					{tab.icon
						? tab.icon({
							focused: tab.isFocused,
							color: tab.isFocused
								? Colors.dark
								: "rgba(255,255,255,0.5)",
							size: 22,
						})
						: null}
				</Pressable>
			))}
		</View>
	);
}
