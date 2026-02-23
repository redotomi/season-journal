import { memo, useRef } from "react";
import { Animated, PanResponder, View } from "react-native";

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
	const isHandRef = useRef(isHandActive);
	const lastPageY = useRef(0);
	const isPinching = useRef(false);
	const initialPinchDist = useRef<number | null>(null);

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
			onPanResponderGrant: (evt) => {
				onDragStartRef.current();

				const touches = evt.nativeEvent.touches;
				if (touches.length >= 2) {
					isPinching.current = true;
					const dx = touches[0].pageX - touches[1].pageX;
					const dy = touches[0].pageY - touches[1].pageY;
					initialPinchDist.current = Math.sqrt(dx * dx + dy * dy);
					baseSize.current = {
						width: (sizeAnim.width as unknown as { _value: number })._value,
						height: (sizeAnim.height as unknown as { _value: number })._value,
					};
					basePos.current = {
						x: (pan.x as unknown as { _value: number })._value,
						y: (pan.y as unknown as { _value: number })._value,
					};
				} else {
					isPinching.current = false;
					initialPinchDist.current = null;
					basePos.current = {
						x: (pan.x as unknown as { _value: number })._value,
						y: (pan.y as unknown as { _value: number })._value,
					};
				}
			},
			onPanResponderMove: (evt, gesture) => {
				const touches = evt.nativeEvent.touches;

				// Handle Pinch (Zoom)
				if (touches.length >= 2) {
					const dx = touches[0].pageX - touches[1].pageX;
					const dy = touches[0].pageY - touches[1].pageY;
					const dist = Math.sqrt(dx * dx + dy * dy);

					if (!isPinching.current) {
						// Transitioned from 1 to 2 touches mid-gesture
						isPinching.current = true;
						initialPinchDist.current = dist;
						baseSize.current = {
							width: (sizeAnim.width as unknown as { _value: number })._value,
							height: (sizeAnim.height as unknown as { _value: number })._value,
						};
						basePos.current = {
							x: (pan.x as unknown as { _value: number })._value - gesture.dx,
							y: (pan.y as unknown as { _value: number })._value - gesture.dy,
						};
					} else if (initialPinchDist.current) {
						const ratio = dist / initialPinchDist.current;
						const nw = Math.max(30, baseSize.current.width * ratio);
						const nh = Math.max(30, baseSize.current.height * ratio);
						sizeAnim.width.setValue(nw);
						sizeAnim.height.setValue(nh);
					}
				} else if (touches.length === 1) {
					if (isPinching.current) {
						// Transitioned from 2 to 1 touch mid-gesture
						isPinching.current = false;
						initialPinchDist.current = null;
						baseSize.current = {
							width: (sizeAnim.width as unknown as { _value: number })._value,
							height: (sizeAnim.height as unknown as { _value: number })._value,
						};
						basePos.current = {
							x: (pan.x as unknown as { _value: number })._value - gesture.dx,
							y: (pan.y as unknown as { _value: number })._value - gesture.dy,
						};
					}
				}

				// Handle Pan (Move) - always happens
				const nx = basePos.current.x + gesture.dx;
				const ny = basePos.current.y + gesture.dy;
				pan.setValue({ x: nx, y: ny });

				lastPageY.current = evt.nativeEvent.pageY;
				onDragMoveRef.current(evt.nativeEvent.pageY);
			},
			onPanResponderRelease: (_, gesture) => {
				isPinching.current = false;
				initialPinchDist.current = null;

				const nx = basePos.current.x + gesture.dx;
				const ny = basePos.current.y + gesture.dy;
				basePos.current = { x: nx, y: ny };

				const cw = (sizeAnim.width as unknown as { _value: number })._value;
				const ch = (sizeAnim.height as unknown as { _value: number })._value;
				baseSize.current = { width: cw, height: ch };

				onUpdateRef.current(item.id, { x: nx, y: ny, width: cw, height: ch });
				onDragEndRef.current(item.id, "image", lastPageY.current);
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
			</View>
		</Animated.View>
	);
}

export default memo(DraggableImage);
