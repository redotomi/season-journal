import { Image as ExpoImage, Pencil, Type } from "lucide-react-native";
import { memo, useCallback } from "react";
import { Pressable, View } from "react-native";

import { Colors } from "@/constants/theme";
import { CANVAS_COLORS, type ToolMode } from "./canvas-types";

type Props = {
	activeTool: ToolMode;
	selectedColor: string;
	onToolChange: (tool: ToolMode) => void;
	onColorChange: (color: string) => void;
	onImagePick: () => void;
};

const TOOLS: { mode: ToolMode; Icon: typeof Pencil }[] = [
	{ mode: "draw", Icon: Pencil },
	{ mode: "text", Icon: Type },
	{ mode: "image", Icon: ExpoImage },
];

function CanvasToolbar({
	activeTool,
	selectedColor,
	onToolChange,
	onColorChange,
	onImagePick,
}: Props) {
	const handleToolPress = useCallback(
		(mode: ToolMode) => {
			if (mode === "image") {
				onImagePick();
			} else {
				onToolChange(mode);
			}
		},
		[onToolChange, onImagePick]
	);

	const showColors = activeTool === "draw" || activeTool === "text";

	return (
		<View style={{ paddingVertical: 12, gap: 12 }}>
			{showColors ? (
				<View
					className="flex-row items-center justify-center"
					style={{ gap: 10 }}
				>
					{CANVAS_COLORS.map((color) => (
						<Pressable
							key={color}
							onPress={() => onColorChange(color)}
							style={{
								width: 28,
								height: 28,
								borderRadius: 14,
								backgroundColor: color,
								borderWidth: selectedColor === color ? 3 : 1,
								borderColor:
									selectedColor === color
										? Colors.accent
										: Colors.border,
							}}
						/>
					))}
				</View>
			) : null}

			<View
				className="flex-row items-center justify-center"
				style={{ gap: 16 }}
			>
				{TOOLS.map(({ mode, Icon }) => (
					<Pressable
						key={mode}
						onPress={() => handleToolPress(mode)}
						style={{
							width: 48,
							height: 48,
							borderRadius: 14,
							backgroundColor:
								activeTool === mode
									? Colors.dark
									: Colors.surfaceSolid,
							alignItems: "center",
							justifyContent: "center",
							borderWidth: 1,
							borderColor:
								activeTool === mode
									? Colors.dark
									: Colors.border,
						}}
					>
						<Icon
							color={
								activeTool === mode
									? Colors.white
									: Colors.textSecondary
							}
							size={20}
							strokeWidth={1.5}
						/>
					</Pressable>
				))}
			</View>
		</View>
	);
}

export default memo(CanvasToolbar);
