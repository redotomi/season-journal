import { Check, Pencil } from "lucide-react-native";
import { memo, useCallback } from "react";
import { Image, Pressable, View } from "react-native";

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

function BingoCellComponent({
	cell,
	index,
	isEditing,
	onPress,
	onLongPress,
	onEditPress,
}: Props) {
	const handlePress = useCallback(() => {
		onPress(index);
	}, [onPress, index]);

	const handleLongPress = useCallback(() => {
		onLongPress(index);
	}, [onLongPress, index]);

	const handleEditPress = useCallback(() => {
		onEditPress(index);
	}, [onEditPress, index]);

	const backgroundColor = cell.checked ? Colors.accent : Colors.surfaceSolid;

	return (
		<Pressable
			onPress={handlePress}
			onLongPress={handleLongPress}
			delayLongPress={400}
			style={{
				flex: 1,
				aspectRatio: 1,
				margin: 4,
				borderRadius: 16,
				backgroundColor,
				borderWidth: 1,
				borderColor: cell.checked ? Colors.accent : Colors.border,
				alignItems: "center",
				justifyContent: "center",
				overflow: "hidden",
				shadowColor: "#000",
				shadowOffset: { width: 0, height: 2 },
				shadowOpacity: cell.checked ? 0.12 : 0.04,
				shadowRadius: 8,
				elevation: cell.checked ? 4 : 1,
			}}
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
						backgroundColor: "rgba(250,188,5,0.45)",
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
						width: 20,
						height: 20,
						borderRadius: 10,
						backgroundColor: "rgba(255,255,255,0.5)",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<Check color={Colors.white} size={13} strokeWidth={2.5} />
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
						color={Colors.accent}
						size={28}
						strokeWidth={1.75}
					/>
				</Pressable>
			) : null}
		</Pressable>
	);
}

export default memo(BingoCellComponent);
