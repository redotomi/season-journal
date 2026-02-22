export type DrawPath = {
	id: string;
	path: string;
	color: string;
	strokeWidth: number;
};

export type CanvasText = {
	id: string;
	text: string;
	color: string;
	x: number;
	y: number;
	scale: number;
};

export type CanvasImage = {
	id: string;
	uri: string;
	x: number;
	y: number;
	width: number;
	height: number;
};

export type CanvasAction = {
	type: "draw" | "text" | "image";
	id: string;
};

export type ToolMode = "draw" | "text" | "image" | null;

export const CANVAS_COLORS = [
	"#1C1C2E",
	"#E53935",
	"#1E88E5",
	"#43A047",
	"#FABC05",
	"#FFFFFF",
] as const;
