import { useCallback, useState } from "react";

import type {
	CanvasAction,
	CanvasImage,
	CanvasText,
	DrawPath,
	ToolMode,
} from "@/components/bingo/canvas/canvas-types";
import { CANVAS_COLORS } from "@/components/bingo/canvas/canvas-types";

let nextId = 0;
const genId = () => `c_${++nextId}_${Date.now()}`;

export function useCanvasEditor() {
	const [paths, setPaths] = useState<DrawPath[]>([]);
	const [texts, setTexts] = useState<CanvasText[]>([]);
	const [images, setImages] = useState<CanvasImage[]>([]);
	const [undoStack, setUndoStack] = useState<CanvasAction[]>([]);
	const [activeTool, setActiveTool] = useState<ToolMode>("draw");
	const [selectedColor, setSelectedColor] = useState<string>(
		CANVAS_COLORS[0]
	);

	const addPath = useCallback((pathData: string, color: string) => {
		const id = genId();
		const newPath: DrawPath = {
			id,
			path: pathData,
			color,
			strokeWidth: 3,
		};
		setPaths((prev) => [...prev, newPath]);
		setUndoStack((prev) => [...prev, { type: "draw", id }]);
	}, []);

	const addText = useCallback((text: string, color: string, x: number, y: number) => {
		const id = genId();
		const newText: CanvasText = { id, text, color, x, y, scale: 1 };
		setTexts((prev) => [...prev, newText]);
		setUndoStack((prev) => [...prev, { type: "text", id }]);
	}, []);

	const addImage = useCallback((uri: string, x: number, y: number, width: number, height: number) => {
		const id = genId();
		const newImage: CanvasImage = { id, uri, x, y, width, height };
		setImages((prev) => [...prev, newImage]);
		setUndoStack((prev) => [...prev, { type: "image", id }]);
	}, []);

	const updateText = useCallback(
		(id: string, updates: Partial<Pick<CanvasText, "x" | "y" | "scale">>) => {
			setTexts((prev) =>
				prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
			);
		},
		[]
	);

	const updateImage = useCallback(
		(id: string, updates: Partial<Pick<CanvasImage, "x" | "y" | "width" | "height">>) => {
			setImages((prev) =>
				prev.map((img) => (img.id === id ? { ...img, ...updates } : img))
			);
		},
		[]
	);

	const undo = useCallback(() => {
		setUndoStack((prev) => {
			if (prev.length === 0) return prev;
			const last = prev[prev.length - 1];
			const newStack = prev.slice(0, -1);

			switch (last.type) {
				case "draw":
					setPaths((p) => p.filter((item) => item.id !== last.id));
					break;
				case "text":
					setTexts((t) => t.filter((item) => item.id !== last.id));
					break;
				case "image":
					setImages((i) => i.filter((item) => item.id !== last.id));
					break;
			}
			return newStack;
		});
	}, []);

	const clear = useCallback(() => {
		setPaths([]);
		setTexts([]);
		setImages([]);
		setUndoStack([]);
		setActiveTool("draw");
		setSelectedColor(CANVAS_COLORS[0]);
	}, []);

	return {
		paths,
		texts,
		images,
		undoStack,
		activeTool,
		selectedColor,
		setActiveTool,
		setSelectedColor,
		addPath,
		addText,
		addImage,
		updateText,
		updateImage,
		undo,
		clear,
	};
}
