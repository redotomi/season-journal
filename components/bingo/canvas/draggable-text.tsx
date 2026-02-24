import { memo, useRef } from "react";
import { Animated, PanResponder, Text, View } from "react-native";

import { Fonts } from "@/constants/theme";
import type { CanvasText } from "./canvas-types";

type Props = {
	item: CanvasText;
	isHandActive: boolean;
	onUpdate: (
		id: string,
		updates: Partial<Pick<CanvasText, "x" | "y" | "scale">>
	) => void;
	onDragStart: () => void;
	onDragEnd: (id: string, type: "text", pageY: number) => void;
	onDragMove: (pageY: number) => void;
};

function DraggableText({
	item,
	isHandActive,
	onUpdate,
	onDragStart,
	onDragEnd,
	onDragMove,
}: Props) {
	const pan = useRef(new Animated.ValueXY({ x: item.x, y: item.y })).current;
	const basePos = useRef({ x: item.x, y: item.y });
	const scaleAnim = useRef(new Animated.Value(item.scale)).current;
	const baseScale = useRef(item.scale);
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
					baseScale.current = (scaleAnim as unknown as { _value: number })._value;
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

				if (touches.length >= 2) {
					const dx = touches[0].pageX - touches[1].pageX;
					const dy = touches[0].pageY - touches[1].pageY;
					const dist = Math.sqrt(dx * dx + dy * dy);

					if (!isPinching.current) {
						isPinching.current = true;
						initialPinchDist.current = dist;
						baseScale.current = (scaleAnim as unknown as { _value: number })._value;
						basePos.current = {
							x: (pan.x as unknown as { _value: number })._value - gesture.dx,
							y: (pan.y as unknown as { _value: number })._value - gesture.dy,
						};
					} else if (initialPinchDist.current) {
						const ratio = dist / initialPinchDist.current;
						const newScale = Math.max(0.5, Math.min(4, baseScale.current * ratio));
						scaleAnim.setValue(newScale);
					}
				} else if (touches.length === 1) {
					if (isPinching.current) {
						isPinching.current = false;
						initialPinchDist.current = null;
						baseScale.current = (scaleAnim as unknown as { _value: number })._value;
						basePos.current = {
							x: (pan.x as unknown as { _value: number })._value - gesture.dx,
							y: (pan.y as unknown as { _value: number })._value - gesture.dy,
						};
					}
				}

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
				const finalScale = (scaleAnim as unknown as { _value: number })._value;
				baseScale.current = finalScale;

				onUpdateRef.current(item.id, { x: nx, y: ny, scale: finalScale });
				onDragEndRef.current(item.id, "text", lastPageY.current);
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
					{ scale: scaleAnim },
				],
			}}
		>
			<View>
				<Text
					style={{
						fontFamily: Fonts.displayMedium,
						fontSize: 16,
						color: item.color,
						padding: 4,
					}}
				>
					{item.text}
				</Text>
			</View>
		</Animated.View>
	);
}

export default memo(DraggableText);
