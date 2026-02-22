import { memo, useRef } from "react";
import { Animated, PanResponder, View } from "react-native";

import { Colors } from "@/constants/theme";
import type { CanvasImage } from "./canvas-types";

type Props = {
	item: CanvasImage;
	isHandActive: boolean;
	onUpdate: (
		id: string,
		updates: Partial<Pick<CanvasImage, "x" | "y" | "width" | "height">>
	) => void;
	onDragStart: () => void;
	onDragEnd: (id: string, type: "image", pageY: number) => void;
	onDragMove: (pageY: number) => void;
};

function DraggableImage({
	item,
	isHandActive,
	onUpdate,
	onDragStart,
	onDragEnd,
	onDragMove,
}: Props) {
	const pan = useRef(new Animated.ValueXY({ x: item.x, y: item.y })).current;
	const basePos = useRef({ x: item.x, y: item.y });
	const sizeAnim = useRef({
		width: new Animated.Value(item.width),
		height: new Animated.Value(item.height),
	}).current;
	const baseSize = useRef({ width: item.width, height: item.height });
	const aspectRatio = useRef(item.width / item.height);
	const isHandRef = useRef(isHandActive);
	const lastPageY = useRef(0);
	const onDragStartRef = useRef(onDragStart);
	const onDragEndRef = useRef(onDragEnd);
	const onDragMoveRef = useRef(onDragMove);
	const onUpdateRef = useRef(onUpdate);

	isHandRef.current = isHandActive;
	onDragStartRef.current = onDragStart;
	onDragEndRef.current = onDragEnd;
	onDragMoveRef.current = onDragMove;
	onUpdateRef.current = onUpdate;

	const movePanResponder = useRef(
		PanResponder.create({
			onStartShouldSetPanResponder: () => isHandRef.current,
			onMoveShouldSetPanResponder: (_, g) =>
				isHandRef.current &&
				(Math.abs(g.dx) > 2 || Math.abs(g.dy) > 2),
			onPanResponderGrant: () => {
				basePos.current = {
					x: (pan.x as unknown as { _value: number })._value,
					y: (pan.y as unknown as { _value: number })._value,
				};
				onDragStartRef.current();
			},
			onPanResponderMove: (evt, gesture) => {
				const nx = basePos.current.x + gesture.dx;
				const ny = basePos.current.y + gesture.dy;
				pan.setValue({ x: nx, y: ny });
				lastPageY.current = evt.nativeEvent.pageY;
				onDragMoveRef.current(evt.nativeEvent.pageY);
			},
			onPanResponderRelease: (_, gesture) => {
				const nx = basePos.current.x + gesture.dx;
				const ny = basePos.current.y + gesture.dy;
				basePos.current = { x: nx, y: ny };
				onUpdateRef.current(item.id, { x: nx, y: ny });
				onDragEndRef.current(item.id, "image", lastPageY.current);
			},
			onPanResponderTerminationRequest: () => false,
		})
	).current;

	const resizePanResponder = useRef(
		PanResponder.create({
			onStartShouldSetPanResponder: () => isHandRef.current,
			onMoveShouldSetPanResponder: () => isHandRef.current,
			onPanResponderGrant: () => {
				baseSize.current = {
					width: (sizeAnim.width as unknown as { _value: number })
						._value,
					height: (sizeAnim.height as unknown as { _value: number })
						._value,
				};
				aspectRatio.current =
					baseSize.current.width / baseSize.current.height;
			},
			onPanResponderMove: (_, gesture) => {
				const nw = Math.max(40, baseSize.current.width + gesture.dx);
				const nh = nw / aspectRatio.current;
				sizeAnim.width.setValue(nw);
				sizeAnim.height.setValue(nh);
			},
			onPanResponderRelease: () => {
				const cw = (sizeAnim.width as unknown as { _value: number })
					._value;
				const ch = (sizeAnim.height as unknown as { _value: number })
					._value;
				baseSize.current = { width: cw, height: ch };
				onUpdateRef.current(item.id, { width: cw, height: ch });
			},
			onPanResponderTerminationRequest: () => false,
		})
	).current;

	return (
		<Animated.View
			{...(isHandActive ? movePanResponder.panHandlers : {})}
			pointerEvents={isHandActive ? "auto" : "none"}
			style={{
				position: "absolute",
				left: 0,
				top: 0,
				transform: [
					{ translateX: pan.x },
					{ translateY: pan.y },
				],
			}}
		>
			<View>
				<Animated.Image
					source={{ uri: item.uri }}
					style={{
						width: sizeAnim.width,
						height: sizeAnim.height,
						borderRadius: 6,
					}}
					resizeMode="cover"
				/>

				{isHandActive ? (
					<View
						{...resizePanResponder.panHandlers}
						style={{
							position: "absolute",
							bottom: -6,
							right: -6,
							width: 18,
							height: 18,
							borderRadius: 9,
							backgroundColor: Colors.accent,
							borderWidth: 2,
							borderColor: Colors.white,
						}}
					/>
				) : null}
			</View>
		</Animated.View>
	);
}

export default memo(DraggableImage);
