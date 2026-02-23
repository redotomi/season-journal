import { useCallback, useState } from "react";

import type {
	CanvasAction,
	CanvasImage,
	CanvasState,
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
	const [zOrder, setZOrder] = useState<string[]>([]);
	const [undoStack, setUndoStack] = useState<CanvasAction[]>([]);
	const [activeTool, setActiveTool] = useState<ToolMode>("draw");
	const [selectedColor, setSelectedColor] = useState<string>(
		CANVAS_COLORS[0]
	);
	const [selectedStrokeWidth, setSelectedStrokeWidth] = useState<number>(3);

	const addPath = useCallback((pathData: string, color: string, strokeWidth: number) => {
		const id = genId();
		const newPath: DrawPath = {
			id,
			path: pathData,
			color,
			strokeWidth,
		};
		setPaths((prev) => [...prev, newPath]);
		setZOrder((prev) => [...prev, id]);
		setUndoStack((prev) => [...prev, { type: "draw", id }]);
	}, []);

	const addText = useCallback((text: string, color: string, x: number, y: number) => {
		const id = genId();
		const newText: CanvasText = { id, text, color, x, y, scale: 1.5 };
		setTexts((prev) => [...prev, newText]);
		setZOrder((prev) => [...prev, id]);
		setUndoStack((prev) => [...prev, { type: "text", id }]);
	}, []);

	const addImage = useCallback((uri: string, x: number, y: number, width: number, height: number) => {
		const id = genId();
		const newImage: CanvasImage = { id, uri, x, y, width, height };
		setImages((prev) => [...prev, newImage]);
		setZOrder((prev) => [...prev, id]);
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

	const bringToFront = useCallback((id: string) => {
		setZOrder((prev) => {
			const arr = prev.filter((item) => item !== id);
			arr.push(id);
			return arr;
		});
	}, []);

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
			setZOrder((z) => z.filter((id) => id !== last.id));
			return newStack;
		});
	}, []);

	const removeText = useCallback((id: string) => {
		setTexts((prev) => prev.filter((t) => t.id !== id));
		setZOrder((prev) => prev.filter((item) => item !== id));
		setUndoStack((prev) => prev.filter((a) => a.id !== id));
	}, []);

	const removeImage = useCallback((id: string) => {
		setImages((prev) => prev.filter((i) => i.id !== id));
		setZOrder((prev) => prev.filter((item) => item !== id));
		setUndoStack((prev) => prev.filter((a) => a.id !== id));
	}, []);

	const clear = useCallback(() => {
		setPaths([]);
		setTexts([]);
		setImages([]);
		setZOrder([]);
		setUndoStack([]);
		setActiveTool("draw");
		setSelectedColor(CANVAS_COLORS[0]);
		setSelectedStrokeWidth(3);
	}, []);

	const loadState = useCallback((state: CanvasState | null) => {
		if (state) {
			setPaths(state.paths);
			setTexts(state.texts);
			setImages(state.images);
			setZOrder(state.zOrder || []);

			// Rebuild a flat undo stack for simplicity based on zOrder (approximate)
			// But for true undo, we'd need to store the CanvasAction[] in state too.
			// Since we only store raw shapes, we map the zOrder to undo stack:
			const actions: CanvasAction[] = (state.zOrder || []).map((id) => {
				if (state.paths.some(p => p.id === id)) return { type: "draw", id };
				if (state.texts.some(t => t.id === id)) return { type: "text", id };
				return { type: "image", id };
			});
			setUndoStack(actions);
		} else {
			setPaths([]);
			setTexts([]);
			setImages([]);
			setZOrder([]);
			setUndoStack([]);
		}
		setActiveTool("draw");
		setSelectedColor(CANVAS_COLORS[0]);
		setSelectedStrokeWidth(state?.selectedStrokeWidth ?? 3);
	}, []);

	const getState = useCallback((): CanvasState => {
		return { paths, texts, images, zOrder, selectedStrokeWidth };
	}, [paths, texts, images, zOrder, selectedStrokeWidth]);

	return {
		paths,
		texts,
		images,
		zOrder,
		undoStack,
		activeTool,
		selectedColor,
		selectedStrokeWidth,
		setActiveTool,
		setSelectedColor,
		setSelectedStrokeWidth,
		addPath,
		addText,
		addImage,
		updateText,
		updateImage,
		removeText,
		removeImage,
		bringToFront,
		undo,
		clear,
		loadState,
		getState,
	};
}
