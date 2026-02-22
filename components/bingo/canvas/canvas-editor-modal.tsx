import * as ImagePicker from "expo-image-picker";
import { Undo2, X } from "lucide-react-native";
import { useCallback, useRef, useState } from "react";
import {
	Alert,
	Dimensions,
	Modal,
	Pressable,
	Text,
	TextInput,
	View,
} from "react-native";
import ViewShot from "react-native-view-shot";

import { Colors, Fonts } from "@/constants/theme";
import { useCanvasEditor } from "@/hooks/use-canvas-editor";
import CanvasToolbar from "./canvas-toolbar";
import type { ToolMode } from "./canvas-types";
import DraggableImage from "./draggable-image";
import DraggableText from "./draggable-text";
import DrawingLayer from "./drawing-layer";

type Props = {
	visible: boolean;
	onSave: (uri: string) => void;
	onCancel: () => void;
};

const SCREEN_WIDTH = Dimensions.get("window").width;
const CANVAS_SIZE = SCREEN_WIDTH - 48;

export default function CanvasEditorModal({ visible, onSave, onCancel }: Props) {
	const editor = useCanvasEditor();
	const viewShotRef = useRef<ViewShot>(null);
	const [textInput, setTextInput] = useState("");
	const [showTextInput, setShowTextInput] = useState(false);

	const handleToolChange = useCallback(
		(tool: ToolMode) => {
			editor.setActiveTool(tool);
		},
		[editor]
	);

	const handleColorChange = useCallback(
		(color: string) => {
			editor.setSelectedColor(color);
		},
		[editor]
	);

	const handleImagePick = useCallback(async () => {
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ["images"],
			quality: 0.8,
			allowsEditing: false,
		});

		if (!result.canceled && result.assets[0]) {
			const asset = result.assets[0];
			const aspectRatio =
				asset.width && asset.height ? asset.width / asset.height : 1;
			const imgWidth = CANVAS_SIZE * 0.5;
			const imgHeight = imgWidth / aspectRatio;
			editor.addImage(
				asset.uri,
				CANVAS_SIZE * 0.1,
				CANVAS_SIZE * 0.1,
				imgWidth,
				imgHeight
			);
		}
	}, [editor]);

	const handleCanvasTap = useCallback(() => {
		if (editor.activeTool === "text") {
			setShowTextInput(true);
		}
	}, [editor.activeTool]);

	const handleTextSubmit = useCallback(() => {
		if (textInput.trim()) {
			editor.addText(
				textInput.trim(),
				editor.selectedColor,
				CANVAS_SIZE * 0.2,
				CANVAS_SIZE * 0.4
			);
		}
		setTextInput("");
		setShowTextInput(false);
	}, [textInput, editor]);

	const handleSave = useCallback(async () => {
		try {
			if (viewShotRef.current?.capture) {
				const uri = await viewShotRef.current.capture();
				onSave(uri);
				editor.clear();
			}
		} catch {
			Alert.alert("Error", "Failed to save the canvas");
		}
	}, [onSave, editor]);

	const handleCancel = useCallback(() => {
		editor.clear();
		onCancel();
	}, [editor, onCancel]);

	return (
		<Modal
			visible={visible}
			animationType="slide"
			presentationStyle="fullScreen"
			supportedOrientations={["portrait"]}
			onRequestClose={handleCancel}
		>
			<View
				className="flex-1"
				style={{ backgroundColor: Colors.background }}
			>
				{/* Header */}
				<View
					className="flex-row items-center justify-between px-5"
					style={{ paddingTop: 60, paddingBottom: 12 }}
				>
					<Pressable onPress={handleCancel} hitSlop={12}>
						<X
							color={Colors.textPrimary}
							size={24}
							strokeWidth={1.5}
						/>
					</Pressable>

					<Text
						style={{
							fontFamily: Fonts.displayMedium,
							fontSize: 17,
							color: Colors.textPrimary,
						}}
					>
						Edit Cell
					</Text>

					<View className="flex-row items-center" style={{ gap: 16 }}>
						<Pressable
							onPress={editor.undo}
							hitSlop={12}
							style={{
								opacity:
									editor.undoStack.length > 0 ? 1 : 0.3,
							}}
						>
							<Undo2
								color={Colors.textPrimary}
								size={22}
								strokeWidth={1.5}
							/>
						</Pressable>

						<Pressable
							onPress={handleSave}
							style={{
								backgroundColor: Colors.accent,
								paddingHorizontal: 18,
								paddingVertical: 8,
								borderRadius: 12,
							}}
						>
							<Text
								style={{
									fontFamily: Fonts.displayMedium,
									fontSize: 15,
									color: Colors.white,
								}}
							>
								Save
							</Text>
						</Pressable>
					</View>
				</View>

				{/* Canvas */}
				<View
					className="items-center justify-center flex-1"
					style={{ paddingHorizontal: 24 }}
				>
					<ViewShot
						ref={viewShotRef}
						options={{
							format: "png",
							quality: 1,
							result: "tmpfile",
						}}
					>
						<View
							onTouchEnd={() => {
								if (editor.activeTool === "text") {
									setShowTextInput(true);
								}
							}}
							style={{
								width: CANVAS_SIZE,
								height: CANVAS_SIZE,
								backgroundColor: Colors.white,
								borderRadius: 16,
								overflow: "hidden",
								borderWidth: 1,
								borderColor: Colors.border,
							}}
						>
							{/* Image layer */}
							{editor.images.map((img) => (
								<DraggableImage
									key={img.id}
									item={img}
									onUpdate={editor.updateImage}
								/>
							))}

							{/* Text layer */}
							{editor.texts.map((t) => (
								<DraggableText
									key={t.id}
									item={t}
									onUpdate={editor.updateText}
								/>
							))}

							{/* Drawing layer */}
							<DrawingLayer
								paths={editor.paths}
								color={editor.selectedColor}
								isActive={editor.activeTool === "draw"}
								onPathComplete={editor.addPath}
							/>
						</View>
					</ViewShot>
				</View>

				{/* Text input overlay */}
				{showTextInput ? (
					<View
						style={{
							position: "absolute",
							top: 0,
							left: 0,
							right: 0,
							bottom: 0,
							backgroundColor: "rgba(0,0,0,0.4)",
							alignItems: "center",
							justifyContent: "center",
							paddingHorizontal: 48,
						}}
					>
						<View
							style={{
								backgroundColor: Colors.white,
								borderRadius: 16,
								padding: 20,
								width: "100%",
								gap: 12,
							}}
						>
							<Text
								style={{
									fontFamily: Fonts.displayMedium,
									fontSize: 16,
									color: Colors.textPrimary,
								}}
							>
								Add Text
							</Text>
							<TextInput
								autoFocus
								value={textInput}
								onChangeText={setTextInput}
								placeholder="Type here..."
								placeholderTextColor={Colors.textSecondary}
								style={{
									fontFamily: Fonts.body,
									fontSize: 16,
									color: Colors.textPrimary,
									borderWidth: 1,
									borderColor: Colors.border,
									borderRadius: 10,
									padding: 12,
								}}
								onSubmitEditing={handleTextSubmit}
								returnKeyType="done"
							/>
							<View className="flex-row justify-end" style={{ gap: 8 }}>
								<Pressable
									onPress={() => {
										setTextInput("");
										setShowTextInput(false);
									}}
									style={{
										paddingHorizontal: 16,
										paddingVertical: 8,
									}}
								>
									<Text
										style={{
											fontFamily: Fonts.bodySemiBold,
											fontSize: 14,
											color: Colors.textSecondary,
										}}
									>
										Cancel
									</Text>
								</Pressable>
								<Pressable
									onPress={handleTextSubmit}
									style={{
										backgroundColor: Colors.accent,
										paddingHorizontal: 16,
										paddingVertical: 8,
										borderRadius: 10,
									}}
								>
									<Text
										style={{
											fontFamily: Fonts.displayMedium,
											fontSize: 14,
											color: Colors.white,
										}}
									>
										Add
									</Text>
								</Pressable>
							</View>
						</View>
					</View>
				) : null}

				{/* Toolbar */}
				<CanvasToolbar
					activeTool={editor.activeTool}
					selectedColor={editor.selectedColor}
					onToolChange={handleToolChange}
					onColorChange={handleColorChange}
					onImagePick={handleImagePick}
				/>
			</View>
		</Modal>
	);
}
