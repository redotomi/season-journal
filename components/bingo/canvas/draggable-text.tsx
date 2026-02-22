import { memo, useRef } from "react";
import { Animated, PanResponder, Text, View } from "react-native";

import { Colors, Fonts } from "@/constants/theme";
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
				onDragEndRef.current(item.id, "text", lastPageY.current);
			},
			onPanResponderTerminationRequest: () => false,
		})
	).current;

	const resizePanResponder = useRef(
		PanResponder.create({
			onStartShouldSetPanResponder: () => isHandRef.current,
			onMoveShouldSetPanResponder: () => isHandRef.current,
			onPanResponderGrant: () => {
				baseScale.current = (
					scaleAnim as unknown as { _value: number }
				)._value;
			},
			onPanResponderMove: (_, gesture) => {
				const delta = gesture.dy * -0.01;
				const newScale = Math.max(
					0.5,
					Math.min(4, baseScale.current + delta)
				);
				scaleAnim.setValue(newScale);
			},
			onPanResponderRelease: () => {
				const finalScale = (
					scaleAnim as unknown as { _value: number }
				)._value;
				baseScale.current = finalScale;
				onUpdateRef.current(item.id, { scale: finalScale });
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

export default memo(DraggableText);
