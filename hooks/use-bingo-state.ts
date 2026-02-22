import { useCallback, useMemo, useState } from "react";

export type BingoCell = {
	checked: boolean;
	text: string;
};

const GRID_SIZE = 16;

const createInitialCells = (): BingoCell[] =>
	Array.from({ length: GRID_SIZE }, () => ({ checked: false, text: "" }));

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

	const editCell = useCallback((index: number, text: string) => {
		setCells((prev) =>
			prev.map((cell, i) => (i === index ? { ...cell, text } : cell))
		);
	}, []);

	return { cells, checkedCount, total: GRID_SIZE, toggleCheck, editCell };
}
