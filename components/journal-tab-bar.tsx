import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import * as Haptics from "expo-haptics";
import { useCallback, useMemo } from "react";
import { Pressable, View } from "react-native";
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withSpring,
} from "react-native-reanimated";

import { Colors } from "@/constants/theme";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const SPRING_CONFIG = {
	damping: 12,
	stiffness: 200,
	mass: 0.6,
};

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
				Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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
				backgroundColor: Colors.forest,
				borderRadius: 28,
				flexDirection: "row",
				alignItems: "center",
				justifyContent: "space-evenly",
				paddingVertical: 12,
				shadowColor: Colors.forest,
				shadowOffset: { width: 0, height: 8 },
				shadowOpacity: 0.3,
				shadowRadius: 24,
				elevation: 12,
				borderWidth: 1,
				borderColor: "rgba(0,21,20,0.2)",
			}}
		>
			{tabs.map((tab) => (
				<TabButton
					key={tab.key}
					tab={tab}
					onPress={handlePress}
					onLongPress={handleLongPress}
				/>
			))}
		</View>
	);
}

type TabButtonProps = {
	tab: {
		key: string;
		routeName: string;
		isFocused: boolean;
		icon: ((props: { focused: boolean; color: string; size: number }) => React.ReactNode) | undefined;
	};
	onPress: (key: string, name: string, focused: boolean) => void;
	onLongPress: (key: string) => void;
};

function TabButton({ tab, onPress, onLongPress }: TabButtonProps) {
	const scale = useSharedValue(1);

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [{ scale: scale.value }],
	}));

	const handlePressIn = useCallback(() => {
		scale.value = withSpring(0.85, SPRING_CONFIG);
	}, [scale]);

	const handlePressOut = useCallback(() => {
		scale.value = withSpring(1, SPRING_CONFIG);
	}, [scale]);

	return (
		<AnimatedPressable
			accessibilityRole="button"
			accessibilityState={tab.isFocused ? { selected: true } : {}}
			onPress={() => onPress(tab.key, tab.routeName, tab.isFocused)}
			onLongPress={() => onLongPress(tab.key)}
			onPressIn={handlePressIn}
			onPressOut={handlePressOut}
			style={[
				{
					width: 48,
					height: 48,
					borderRadius: 24,
					alignItems: "center",
					justifyContent: "center",
					backgroundColor: tab.isFocused
						? Colors.wheat
						: "transparent",
				},
				animatedStyle,
			]}
		>
			{tab.icon
				? tab.icon({
					focused: tab.isFocused,
					color: tab.isFocused
						? Colors.forest
						: "rgba(251,255,254,0.5)",
					size: 22,
				})
				: null}
		</AnimatedPressable>
	);
}
