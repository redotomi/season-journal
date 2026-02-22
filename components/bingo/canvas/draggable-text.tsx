import { memo, useRef } from "react";
import { Animated, PanResponder, Text } from "react-native";

import { Fonts } from "@/constants/theme";
import type { CanvasText } from "./canvas-types";

type Props = {
	item: CanvasText;
	onUpdate: (
		id: string,
		updates: Partial<Pick<CanvasText, "x" | "y" | "scale">>
	) => void;
};

function DraggableText({ item, onUpdate }: Props) {
	const pan = useRef(new Animated.ValueXY({ x: item.x, y: item.y })).current;
	const basePos = useRef({ x: item.x, y: item.y });
	const scaleAnim = useRef(new Animated.Value(item.scale)).current;
	const baseScale = useRef(item.scale);

	const panResponder = useRef(
		PanResponder.create({
			onStartShouldSetPanResponder: () => true,
			onMoveShouldSetPanResponder: (_, g) =>
				Math.abs(g.dx) > 2 || Math.abs(g.dy) > 2,
			onPanResponderGrant: () => {
				basePos.current = { x: item.x, y: item.y };
			},
			onPanResponderMove: (_, gesture) => {
				const nx = basePos.current.x + gesture.dx;
				const ny = basePos.current.y + gesture.dy;
				pan.setValue({ x: nx, y: ny });
			},
			onPanResponderRelease: (_, gesture) => {
				const nx = basePos.current.x + gesture.dx;
				const ny = basePos.current.y + gesture.dy;
				basePos.current = { x: nx, y: ny };
				onUpdate(item.id, { x: nx, y: ny });
			},
		})
	).current;

	const pinchResponder = useRef(
		PanResponder.create({
			onStartShouldSetPanResponder: () => false,
			onMoveShouldSetPanResponder: (evt) =>
				evt.nativeEvent.touches?.length >= 2,
			onPanResponderMove: (evt) => {
				if (evt.nativeEvent.touches?.length >= 2) {
					const [t1, t2] = evt.nativeEvent.touches;
					const dist = Math.sqrt(
						(t1.pageX - t2.pageX) ** 2 +
						(t1.pageY - t2.pageY) ** 2
					);
					const newScale = Math.max(
						0.5,
						Math.min(3, dist / 100)
					);
					scaleAnim.setValue(newScale);
				}
			},
			onPanResponderRelease: () => {
				const currentScale = (scaleAnim as unknown as { _value: number })._value;
				baseScale.current = currentScale;
				onUpdate(item.id, { scale: currentScale });
			},
		})
	).current;

	return (
		<Animated.View
			{...panResponder.panHandlers}
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
		</Animated.View>
	);
}

export default memo(DraggableText);
