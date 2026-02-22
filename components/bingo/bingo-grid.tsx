import { useCallback, useMemo, useState } from "react";
import { Pressable, View } from "react-native";

import { useBingoState } from "@/hooks/use-bingo-state";
import BingoCell from "./bingo-cell";
import BingoProgressBar from "./bingo-progress-bar";

const COLS = 4;

export default function BingoGrid() {
	const { cells, checkedCount, total, toggleCheck, editCell } =
		useBingoState();

	const [editingIndex, setEditingIndex] = useState<number | null>(null);

	const handlePress = useCallback(
		(index: number) => {
			if (editingIndex !== null) {
				setEditingIndex(null);
				return;
			}
			toggleCheck(index);
		},
		[editingIndex, toggleCheck]
	);

	const handleLongPress = useCallback((index: number) => {
		setEditingIndex(index);
	}, []);

	const handleEditPress = useCallback(
		(index: number) => {
			editCell(index, `Item ${index + 1}`);
			setEditingIndex(null);
		},
		[editCell]
	);

	const handleBackdropPress = useCallback(() => {
		setEditingIndex(null);
	}, []);

	const rows = useMemo(() => {
		const result: (typeof cells)[] = [];
		for (let i = 0; i < cells.length; i += COLS) {
			result.push(cells.slice(i, i + COLS));
		}
		return result;
	}, [cells]);

	return (
		<Pressable onPress={handleBackdropPress}>
			<BingoProgressBar checked={checkedCount} total={total} />

			<View
				style={{
					backgroundColor: "rgba(255,255,255,0.5)",
					borderRadius: 20,
					padding: 8,
				}}
			>
				{rows.map((row, rowIdx) => (
					<View key={rowIdx} className="flex-row">
						{row.map((cell, colIdx) => {
							const index = rowIdx * COLS + colIdx;
							return (
								<BingoCell
									key={index}
									cell={cell}
									index={index}
									isEditing={editingIndex === index}
									onPress={handlePress}
									onLongPress={handleLongPress}
									onEditPress={handleEditPress}
								/>
							);
						})}
					</View>
				))}
			</View>
		</Pressable>
	);
}
