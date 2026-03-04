import { Check, Pencil } from "lucide-react-native";
import { memo, useCallback } from "react";
import { Image, Pressable, View } from "react-native";
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withSpring,
} from "react-native-reanimated";

import { Colors } from "@/constants/theme";
import type { BingoCell as BingoCellType } from "@/hooks/use-bingo-state";

type Props = {
	cell: BingoCellType;
	index: number;
	isEditing: boolean;
	onPress: (index: number) => void;
	onLongPress: (index: number) => void;
	onEditPress: (index: number) => void;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const SPRING_CONFIG = {
	damping: 14,
	stiffness: 180,
	mass: 0.5,
};

function BingoCellComponent({
	cell,
	index,
	isEditing,
	onPress,
	onLongPress,
	onEditPress,
}: Props) {
	const scale = useSharedValue(1);

	const handlePress = useCallback(() => {
		onPress(index);
	}, [onPress, index]);

	const handleLongPress = useCallback(() => {
		onLongPress(index);
	}, [onLongPress, index]);

	const handleEditPress = useCallback(() => {
		onEditPress(index);
	}, [onEditPress, index]);

	const handlePressIn = useCallback(() => {
		scale.value = withSpring(0.92, SPRING_CONFIG);
	}, [scale]);

	const handlePressOut = useCallback(() => {
		scale.value = withSpring(1, SPRING_CONFIG);
	}, [scale]);

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [{ scale: scale.value }],
	}));

	const backgroundColor = cell.checked ? Colors.sienna : Colors.creamDark;

	return (
		<AnimatedPressable
			onPress={handlePress}
			onLongPress={handleLongPress}
			onPressIn={handlePressIn}
			onPressOut={handlePressOut}
			delayLongPress={400}
			style={[
				{
					flex: 1,
					aspectRatio: 1,
					margin: 4,
					borderRadius: 16,
					backgroundColor,
					borderWidth: 1,
					borderColor: cell.checked
						? Colors.sienna
						: Colors.border,
					alignItems: "center",
					justifyContent: "center",
					overflow: "hidden",
					shadowColor: Colors.forest,
					shadowOffset: { width: 0, height: 3 },
					shadowOpacity: cell.checked ? 0.18 : 0.06,
					shadowRadius: 10,
					elevation: cell.checked ? 4 : 1,
				},
				animatedStyle,
			]}
		>
			{cell.imageUri ? (
				<Image
					source={{ uri: cell.imageUri }}
					style={{
						position: "absolute",
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						borderRadius: 15,
					}}
					resizeMode="cover"
				/>
			) : null}

			{cell.checked ? (
				<View
					style={{
						position: "absolute",
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						backgroundColor: "rgba(163,50,11,0.35)",
						borderRadius: 15,
					}}
				/>
			) : null}

			{cell.checked ? (
				<View
					style={{
						position: "absolute",
						top: 6,
						right: 6,
						width: 22,
						height: 22,
						borderRadius: 11,
						backgroundColor: Colors.wheat,
						alignItems: "center",
						justifyContent: "center",
						shadowColor: Colors.forest,
						shadowOffset: { width: 0, height: 1 },
						shadowOpacity: 0.15,
						shadowRadius: 3,
					}}
				>
					<Check color={Colors.forest} size={13} strokeWidth={2.5} />
				</View>
			) : null}

			{isEditing ? (
				<Pressable
					onPress={handleEditPress}
					style={{
						position: "absolute",
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						borderRadius: 16,
						backgroundColor: Colors.accentSoft,
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<Pencil
						color={Colors.olive}
						size={28}
						strokeWidth={1.75}
					/>
				</Pressable>
			) : null}
		</AnimatedPressable>
	);
}

export default memo(BingoCellComponent);
