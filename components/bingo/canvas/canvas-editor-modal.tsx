import * as ImagePicker from "expo-image-picker";
import { Trash2, Undo2, X } from "lucide-react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import {
	Alert,
	Dimensions,
	Modal,
	Pressable,
	Text,
	TextInput,
	View,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import ViewShot from "react-native-view-shot";

import { Colors, Fonts } from "@/constants/theme";
import { useCanvasEditor } from "@/hooks/use-canvas-editor";
import CanvasToolbar from "./canvas-toolbar";
import type { CanvasState, ToolMode } from "./canvas-types";
import DraggableImage from "./draggable-image";
import DraggableText from "./draggable-text";
import DrawingLayer from "./drawing-layer";

type Props = {
	visible: boolean;
	initialState: CanvasState | null;
	onSave: (uri: string, canvasState: CanvasState) => void;
	onCancel: () => void;
};

const SCREEN_WIDTH = Dimensions.get("window").width;
const CANVAS_SIZE = SCREEN_WIDTH - 48;

export default function CanvasEditorModal({ visible, initialState, onSave, onCancel }: Props) {
	const editor = useCanvasEditor();
	const viewShotRef = useRef<ViewShot>(null);
	const [textInput, setTextInput] = useState("");
	const [showTextInput, setShowTextInput] = useState(false);
	const [isDragging, setIsDragging] = useState(false);
	const [isOverTrash, setIsOverTrash] = useState(false);
	const trashRef = useRef<View>(null);
	const trashLayoutRef = useRef({ y: 0, height: 0 });

	useEffect(() => {
		if (visible) {
			editor.loadState(initialState);
		}
	}, [visible]);

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
				const state = editor.getState();
				onSave(uri, state);
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

	const handleDragStart = useCallback((id: string) => {
		setIsDragging(true);
		setIsOverTrash(false);
		editor.bringToFront(id);
	}, [editor]);

	const handleDragMove = useCallback((pageY: number) => {
		const { y, height } = trashLayoutRef.current;
		if (y > 0) {
			setIsOverTrash(pageY >= y && pageY <= y + height);
		}
	}, []);

	const handleDragEnd = useCallback(
		(id: string, type: "text" | "image", pageY: number) => {
			setIsDragging(false);
			setIsOverTrash(false);
			const { y, height } = trashLayoutRef.current;
			if (y > 0 && pageY >= y && pageY <= y + height) {
				if (type === "text") {
					editor.removeText(id);
				} else {
					editor.removeImage(id);
				}
			}
		},
		[editor]
	);

	const handleTrashLayout = useCallback(() => {
		trashRef.current?.measureInWindow((_x, y, _w, h) => {
			trashLayoutRef.current = { y, height: h };
		});
	}, []);

	const isHandActive = editor.activeTool === "hand";

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
							{/* Rendering all historical elements in exact z-order */}
							{editor.zOrder.map((id) => {
								const pathItem = editor.paths.find((p) => p.id === id);
								if (pathItem) {
									return (
										<View
											key={id}
											style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
											pointerEvents="none"
										>
											<Svg style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}>
												<Path
													d={pathItem.path}
													stroke={pathItem.color}
													strokeWidth={pathItem.strokeWidth}
													fill="none"
													strokeLinecap="round"
													strokeLinejoin="round"
												/>
											</Svg>
										</View>
									);
								}

								const imgItem = editor.images.find((i) => i.id === id);
								if (imgItem) {
									return (
										<DraggableImage
											key={id}
											item={imgItem}
											isHandActive={isHandActive}
											onUpdate={editor.updateImage}
											onDragStart={() => handleDragStart(id)}
											onDragEnd={handleDragEnd}
											onDragMove={handleDragMove}
										/>
									);
								}

								const textItem = editor.texts.find((t) => t.id === id);
								if (textItem) {
									return (
										<DraggableText
											key={id}
											item={textItem}
											isHandActive={isHandActive}
											onUpdate={editor.updateText}
											onDragStart={() => handleDragStart(id)}
											onDragEnd={handleDragEnd}
											onDragMove={handleDragMove}
										/>
									);
								}

								return null;
							})}

							{/* Active Drawing layer (top-most for capturing touches, renders only current stroke) */}
							<DrawingLayer
								paths={[]}
								color={editor.selectedColor}
								isActive={editor.activeTool === "draw"}
								onPathComplete={editor.addPath}
							/>
						</View>
					</ViewShot>
				</View>

				{/* Trash zone — absolutely positioned, no layout shift */}
				{isDragging ? (
					<View
						ref={trashRef}
						onLayout={handleTrashLayout}
						style={{
							position: "absolute",
							bottom: 100,
							left: 24,
							right: 24,
							height: 56,
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<View
							className="flex-row items-center justify-center"
							style={{
								backgroundColor: isOverTrash
									? "#E53935"
									: "#FDEAEA",
								borderRadius: 14,
								paddingVertical: 10,
								paddingHorizontal: 20,
								gap: 8,
								width: "100%",
								transform: [
									{ scale: isOverTrash ? 1.05 : 1 },
								],
							}}
						>
							<Trash2
								color={isOverTrash ? "#FFFFFF" : "#E53935"}
								size={20}
								strokeWidth={1.5}
							/>
							<Text
								style={{
									fontFamily: Fonts.bodySemiBold,
									fontSize: 14,
									color: isOverTrash ? "#FFFFFF" : "#E53935",
								}}
							>
								Drop here to delete
							</Text>
						</View>
					</View>
				) : null}

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
