import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useCallback, useMemo } from "react";
import { Pressable, Text, View } from "react-native";

import { JournalColors, JournalFonts } from "@/constants/theme";

interface TabItemConfig {
	readonly rotation: string;
	readonly offsetY: number;
}

const TAB_QUIRKS: readonly TabItemConfig[] = [
	{ rotation: "-1.5deg", offsetY: -1 },
	{ rotation: "0.8deg", offsetY: 1 },
	{ rotation: "-0.5deg", offsetY: -2 },
] as const;

export default function JournalTabBar({
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
			routes.map((route, index) => {
				const { options } = descriptors[route.key];
				const label = options.title ?? route.name;
				const isFocused = state.index === index;
				const quirk = TAB_QUIRKS[index % TAB_QUIRKS.length];

				return {
					key: route.key,
					routeName: route.name,
					label,
					isFocused,
					quirk,
					icon: options.tabBarIcon,
				};
			}),
		[routes, descriptors, state.index]
	);

	return (
		<View
			style={{
				flexDirection: "row",
				backgroundColor: JournalColors.cream,
				borderTopWidth: 1.5,
				borderTopColor: JournalColors.line,
				paddingBottom: 28,
				paddingTop: 8,
				borderStyle: "dashed",
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
						flex: 1,
						alignItems: "center",
						paddingVertical: 6,
						transform: [
							{ rotate: tab.quirk.rotation },
							{ translateY: tab.quirk.offsetY },
						],
					}}
				>
					{tab.icon
						? tab.icon({
							focused: tab.isFocused,
							color: tab.isFocused
								? JournalColors.sienna
								: JournalColors.muted,
							size: 24,
						})
						: null}

					<Text
						style={{
							fontFamily: tab.isFocused
								? JournalFonts.displayMedium
								: JournalFonts.displayRegular,
							fontSize: 13,
							color: tab.isFocused
								? JournalColors.sienna
								: JournalColors.muted,
							marginTop: 2,
						}}
					>
						{tab.label}
					</Text>

					{tab.isFocused ? (
						<View
							style={{
								width: 20,
								height: 2.5,
								backgroundColor: JournalColors.sienna,
								borderRadius: 2,
								marginTop: 3,
								transform: [{ rotate: "-2deg" }],
								opacity: 0.7,
							}}
						/>
					) : null}
				</Pressable>
			))}
		</View>
	);
}
