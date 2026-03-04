import { memo } from "react";
import { Text, View } from "react-native";
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withSpring
} from "react-native-reanimated";

import { Colors, Fonts } from "@/constants/theme";

type Props = {
	checked: number;
	total: number;
};

function BingoProgressBar({ checked, total }: Props) {
	const pct = total > 0 ? (checked / total) * 100 : 0;
	const animatedWidth = useSharedValue(0);

	animatedWidth.value = withSpring(pct, {
		damping: 18,
		stiffness: 120,
		mass: 0.8,
	});

	const fillStyle = useAnimatedStyle(() => ({
		width: `${animatedWidth.value}%`,
	}));

	return (
		<View style={{ marginBottom: 20 }}>
			<View
				className="flex-row items-center justify-between"
				style={{ marginBottom: 8 }}
			>
				<Text
					style={{
						fontFamily: Fonts.displayMedium,
						fontSize: 15,
						color: Colors.forest,
						letterSpacing: -0.2,
					}}
				>
					Progress
				</Text>
				<Text
					style={{
						fontFamily: Fonts.bodySemiBold,
						fontSize: 14,
						color: Colors.textMuted,
					}}
				>
					{checked} / {total}
				</Text>
			</View>

			<View
				style={{
					height: 10,
					borderRadius: 5,
					backgroundColor: Colors.accentSoft,
					overflow: "hidden",
					borderWidth: 1,
					borderColor: Colors.border,
				}}
			>
				<Animated.View
					style={[
						{
							height: "100%",
							borderRadius: 5,
							backgroundColor: Colors.wheat,
						},
						fillStyle,
					]}
				/>
			</View>
		</View>
	);
}

export default memo(BingoProgressBar);
