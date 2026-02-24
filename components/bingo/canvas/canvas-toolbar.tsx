import { Image as ExpoImage, Hand, Palette, Pencil, Pipette, Type } from "lucide-react-native";
import { memo, useCallback } from "react";
import { Pressable, View } from "react-native";

import { Colors } from "@/constants/theme";
import { type ToolMode } from "./canvas-types";

type Props = {
	activeTool: ToolMode;
	selectedColor: string;
	recentColors: string[];
	selectedStrokeWidth: number;
	onToolChange: (tool: ToolMode) => void;
	onColorChange: (color: string) => void;
	onStrokeWidthChange: (width: number) => void;
	onImagePick: () => void;
	onCustomColorPress: () => void;
};

const TOOLS: { mode: ToolMode; Icon: typeof Pencil }[] = [
	{ mode: "hand", Icon: Hand },
	{ mode: "draw", Icon: Pencil },
	{ mode: "text", Icon: Type },
	{ mode: "image", Icon: ExpoImage },
];

const STROKE_WIDTHS = [
	{ label: "Small", value: 3 },
	{ label: "Medium", value: 6 },
	{ label: "Large", value: 12 },
];

function CanvasToolbar({
	activeTool,
	selectedColor,
	recentColors,
	selectedStrokeWidth,
	onToolChange,
	onColorChange,
	onStrokeWidthChange,
	onImagePick,
	onCustomColorPress,
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

	const showColors = activeTool === "draw" || activeTool === "text" || activeTool === "pipette";

	return (
		<View style={{ paddingVertical: 12, gap: 12 }}>
			{showColors ? (
				<View
					className="flex-row items-center justify-center"
					style={{ gap: 10 }}
				>
					{recentColors.map((color, index) => (
						<Pressable
							key={`${color}-${index}`}
							onPress={() => onColorChange(color)}
							style={{
								width: 32,
								height: 32,
								borderRadius: 16,
								backgroundColor: color,
								borderWidth: selectedColor === color ? 3 : 1,
								borderColor:
									selectedColor === color
										? Colors.accent
										: Colors.border,
							}}
						/>
					))}
					<Pressable
						onPress={onCustomColorPress}
						style={{
							width: 32,
							height: 32,
							borderRadius: 16,
							backgroundColor: Colors.surfaceSolid,
							borderWidth: 1,
							borderColor:
								!recentColors.includes(selectedColor)
									? Colors.accent
									: Colors.border,
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<Palette
							color={
								!recentColors.includes(selectedColor)
									? Colors.accent
									: Colors.textSecondary
							}
							size={16}
						/>
					</Pressable>

					<View style={{ width: 1, height: 24, backgroundColor: Colors.border, marginHorizontal: 4 }} />

					<Pressable
						onPress={() => onToolChange("pipette")}
						style={{
							width: 32,
							height: 32,
							borderRadius: 16,
							backgroundColor: activeTool === "pipette" ? Colors.dark : Colors.surfaceSolid,
							borderWidth: 1,
							borderColor: activeTool === "pipette" ? Colors.dark : Colors.border,
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<Pipette
							color={activeTool === "pipette" ? Colors.white : Colors.textSecondary}
							size={16}
						/>
					</Pressable>
				</View>
			) : null}

			{activeTool === "draw" ? (
				<View
					className="flex-row items-center justify-center"
					style={{ gap: 20, marginBottom: 4 }}
				>
					{STROKE_WIDTHS.map(({ value }) => (
						<Pressable
							key={value}
							onPress={() => onStrokeWidthChange(value)}
							style={{
								width: 40,
								height: 40,
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<View
								style={{
									width: value + 4,
									height: value + 4,
									borderRadius: (value + 4) / 2,
									backgroundColor:
										selectedStrokeWidth === value
											? Colors.textPrimary
											: Colors.border,
								}}
							/>
						</Pressable>
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
