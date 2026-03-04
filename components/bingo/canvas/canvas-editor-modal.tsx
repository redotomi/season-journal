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
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";
import ViewShot, { captureRef } from "react-native-view-shot";
import ColorPicker, { HueSlider, Panel1, Preview, Swatches } from "reanimated-color-picker";

import GrainOverlay from "@/components/ui/grain-overlay";
import { Colors, Fonts } from "@/constants/theme";
import { useCanvasEditor } from "@/hooks/use-canvas-editor";
import CanvasToolbar from "./canvas-toolbar";
import { CANVAS_COLORS, type CanvasState, type ToolMode } from "./canvas-types";
import DraggableImage from "./draggable-image";
import DraggableText from "./draggable-text";
import DrawingLayer from "./drawing-layer";
import EyedropperLayer from "./eyedropper-layer";

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
	const [showColorPicker, setShowColorPicker] = useState(false);
	const [eyedropperUri, setEyedropperUri] = useState<string | null>(null);
	const trashRef = useRef<View>(null);
	const trashLayoutRef = useRef({ y: 0, height: 0 });

	useEffect(() => {
		if (visible) {
			editor.loadState(initialState);
		}
	}, [visible]);

	const handleToolChange = useCallback(
		async (tool: ToolMode) => {
			if (tool === "pipette") {
				if (viewShotRef.current) {
					try {
						const uri = await captureRef(viewShotRef.current, {
							format: "png",
							quality: 1,
							result: "base64",
						});
						setEyedropperUri(uri);
					} catch (e) { }
				}
			} else {
				setEyedropperUri(null);
			}
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
			<GestureHandlerRootView style={{ flex: 1 }}>
				<View
					className="flex-1"
					style={{ backgroundColor: Colors.background }}
				>
					<GrainOverlay opacity={0.03} />
					<View
						className="flex-row items-center justify-between px-5"
						style={{ paddingTop: 60, paddingBottom: 12 }}
					>
						<Pressable onPress={handleCancel} hitSlop={12}>
							<X
								color={Colors.forest}
								size={24}
								strokeWidth={1.5}
							/>
						</Pressable>

						<Text
							style={{
								fontFamily: Fonts.displayMedium,
								fontSize: 17,
								color: Colors.forest,
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
									color={Colors.forest}
									size={22}
									strokeWidth={1.5}
								/>
							</Pressable>

							<Pressable
								onPress={handleSave}
								style={{
									backgroundColor: Colors.sienna,
									paddingHorizontal: 18,
									paddingVertical: 8,
									borderRadius: 12,
								}}
							>
								<Text
									style={{
										fontFamily: Fonts.displayMedium,
										fontSize: 15,
										color: Colors.cream,
									}}
								>
									Save
								</Text>
							</Pressable>
						</View>
					</View>

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
									backgroundColor: Colors.creamDark,
									borderRadius: 16,
									overflow: "hidden",
									borderWidth: 1,
									borderColor: Colors.borderStrong,
								}}
							>
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

								<DrawingLayer
									paths={[]}
									color={editor.selectedColor}
									strokeWidth={editor.selectedStrokeWidth}
									isActive={editor.activeTool === "draw"}
									onPathComplete={editor.addPath}
								/>

								{eyedropperUri && editor.activeTool === "pipette" ? (
									<EyedropperLayer
										base64Uri={`data:image/png;base64,${eyedropperUri}`}
										width={CANVAS_SIZE}
										height={CANVAS_SIZE}
										onColorPicked={(hex) => {
											editor.setSelectedColor(hex);
											editor.setActiveTool("draw");
											setEyedropperUri(null);
										}}
										onCancel={() => {
											editor.setActiveTool("draw");
											setEyedropperUri(null);
										}}
									/>
								) : null}
							</View>
						</ViewShot>
					</View>

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
										? Colors.error
										: Colors.errorSoft,
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
									color={isOverTrash ? Colors.cream : Colors.error}
									size={20}
									strokeWidth={1.5}
								/>
								<Text
									style={{
										fontFamily: Fonts.bodySemiBold,
										fontSize: 14,
										color: isOverTrash ? Colors.cream : Colors.error,
									}}
								>
									Drop here to delete
								</Text>
							</View>
						</View>
					) : null}

					{showTextInput ? (
						<View
							style={{
								position: "absolute",
								top: 0,
								left: 0,
								right: 0,
								bottom: 0,
								backgroundColor: "rgba(0,21,20,0.4)",
								alignItems: "center",
								justifyContent: "center",
								paddingHorizontal: 48,
							}}
						>
							<View
								style={{
									backgroundColor: Colors.cream,
									borderRadius: 20,
									padding: 24,
									width: "100%",
									gap: 14,
									borderWidth: 1,
									borderColor: Colors.border,
									shadowColor: Colors.forest,
									shadowOffset: { width: 0, height: 8 },
									shadowOpacity: 0.12,
									shadowRadius: 24,
								}}
							>
								<Text
									style={{
										fontFamily: Fonts.displayMedium,
										fontSize: 16,
										color: Colors.forest,
									}}
								>
									Add Text
								</Text>
								<TextInput
									autoFocus
									value={textInput}
									onChangeText={setTextInput}
									placeholder="Type here..."
									placeholderTextColor={Colors.textMuted}
									style={{
										fontFamily: Fonts.body,
										fontSize: 16,
										color: Colors.forest,
										borderWidth: 1,
										borderColor: Colors.borderStrong,
										borderRadius: 12,
										padding: 14,
										backgroundColor: Colors.creamDark,
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
											paddingVertical: 10,
										}}
									>
										<Text
											style={{
												fontFamily: Fonts.bodySemiBold,
												fontSize: 14,
												color: Colors.textMuted,
											}}
										>
											Cancel
										</Text>
									</Pressable>
									<Pressable
										onPress={handleTextSubmit}
										style={{
											backgroundColor: Colors.sienna,
											paddingHorizontal: 16,
											paddingVertical: 10,
											borderRadius: 12,
										}}
									>
										<Text
											style={{
												fontFamily: Fonts.displayMedium,
												fontSize: 14,
												color: Colors.cream,
											}}
										>
											Add
										</Text>
									</Pressable>
								</View>
							</View>
						</View>
					) : null}

					<CanvasToolbar
						activeTool={editor.activeTool}
						selectedColor={editor.selectedColor}
						recentColors={editor.recentColors}
						selectedStrokeWidth={editor.selectedStrokeWidth}
						onToolChange={handleToolChange}
						onColorChange={handleColorChange}
						onStrokeWidthChange={editor.setSelectedStrokeWidth}
						onImagePick={handleImagePick}
						onCustomColorPress={() => setShowColorPicker(true)}
					/>
				</View>

				{showColorPicker ? (
					<View
						style={{
							position: "absolute",
							top: 0,
							left: 0,
							right: 0,
							bottom: 0,
							backgroundColor: "rgba(0,21,20,0.5)",
							justifyContent: "center",
							alignItems: "center",
							padding: 24,
							zIndex: 9999,
							elevation: 10,
						}}
					>
						<View
							style={{
								backgroundColor: Colors.cream,
								borderRadius: 24,
								padding: 24,
								width: "100%",
								maxWidth: 400,
								borderWidth: 1,
								borderColor: Colors.border,
							}}
						>
							<ColorPicker
								value={editor.selectedColor}
								onComplete={(colors) => {
									"worklet";
									runOnJS(editor.setSelectedColor)(colors.hex);
								}}
							>
								<Preview
									style={{ height: 40, borderRadius: 12, marginBottom: 20 }}
								/>
								<Panel1 style={{ borderRadius: 16, marginBottom: 20 }} />
								<HueSlider
									style={{ borderRadius: 12, marginBottom: 20 }}
									thumbShape="circle"
								/>
								<Swatches
									colors={[
										...CANVAS_COLORS,
										"#9C27B0",
										"#E91E63",
										"#00BCD4",
										"#8BC34A",
										"#FF9800",
										"#795548",
									]}
									style={{ marginBottom: 20 }}
								/>
							</ColorPicker>

							<Pressable
								onPress={() => setShowColorPicker(false)}
								style={{
									backgroundColor: Colors.sienna,
									paddingVertical: 14,
									borderRadius: 14,
									alignItems: "center",
								}}
							>
								<Text
									style={{
										fontFamily: Fonts.displayMedium,
										fontSize: 16,
										color: Colors.cream,
									}}
								>
									Done
								</Text>
							</Pressable>
						</View>
					</View>
				) : null}
			</GestureHandlerRootView>
		</Modal>
	);
}
