import { useCallback, useMemo, useState } from "react";

import type { CanvasState } from "@/components/bingo/canvas/canvas-types";

export type BingoCell = {
	checked: boolean;
	imageUri: string | null;
	canvasState: CanvasState | null;
};

const GRID_SIZE = 16;

const createInitialCells = (): BingoCell[] =>
	Array.from({ length: GRID_SIZE }, () => ({
		checked: false,
		imageUri: null,
		canvasState: null,
	}));

export function useBingoState() {
	const [cells, setCells] = useState<BingoCell[]>(createInitialCells);

	const checkedCount = useMemo(
		() => cells.filter((c) => c.checked).length,
		[cells]
	);

	const toggleCheck = useCallback((index: number) => {
		setCells((prev) =>
			prev.map((cell, i) =>
				i === index ? { ...cell, checked: !cell.checked } : cell
			)
		);
	}, []);

	const editCell = useCallback(
		(index: number, uri: string, canvasState: CanvasState) => {
			setCells((prev) =>
				prev.map((cell, i) =>
					i === index
						? { ...cell, imageUri: uri, canvasState }
						: cell
				)
			);
		},
		[]
	);

	return { cells, checkedCount, total: GRID_SIZE, toggleCheck, editCell };
}
