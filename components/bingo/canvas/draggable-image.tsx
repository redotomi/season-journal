import { memo, useRef } from "react";
import { Animated, PanResponder } from "react-native";

import type { CanvasImage } from "./canvas-types";

type Props = {
	item: CanvasImage;
	onUpdate: (
		id: string,
		updates: Partial<Pick<CanvasImage, "x" | "y" | "width" | "height">>
	) => void;
};

function DraggableImage({ item, onUpdate }: Props) {
	const pan = useRef(new Animated.ValueXY({ x: item.x, y: item.y })).current;
	const basePos = useRef({ x: item.x, y: item.y });
	const sizeAnim = useRef({
		width: new Animated.Value(item.width),
		height: new Animated.Value(item.height),
	}).current;
	const baseSize = useRef({ width: item.width, height: item.height });
	const initialPinchDist = useRef<number | null>(null);

	const panResponder = useRef(
		PanResponder.create({
			onStartShouldSetPanResponder: () => true,
			onMoveShouldSetPanResponder: (_, g) =>
				Math.abs(g.dx) > 2 || Math.abs(g.dy) > 2,
			onPanResponderGrant: (evt) => {
				basePos.current = { x: item.x, y: item.y };
				if (evt.nativeEvent.touches?.length >= 2) {
					const [t1, t2] = evt.nativeEvent.touches;
					initialPinchDist.current = Math.sqrt(
						(t1.pageX - t2.pageX) ** 2 +
						(t1.pageY - t2.pageY) ** 2
					);
					baseSize.current = {
						width: item.width,
						height: item.height,
					};
				}
			},
			onPanResponderMove: (evt, gesture) => {
				if (evt.nativeEvent.touches?.length >= 2 && initialPinchDist.current) {
					const [t1, t2] = evt.nativeEvent.touches;
					const dist = Math.sqrt(
						(t1.pageX - t2.pageX) ** 2 +
						(t1.pageY - t2.pageY) ** 2
					);
					const ratio = dist / initialPinchDist.current;
					const nw = Math.max(30, baseSize.current.width * ratio);
					const nh = Math.max(30, baseSize.current.height * ratio);
					sizeAnim.width.setValue(nw);
					sizeAnim.height.setValue(nh);
				} else {
					const nx = basePos.current.x + gesture.dx;
					const ny = basePos.current.y + gesture.dy;
					pan.setValue({ x: nx, y: ny });
				}
			},
			onPanResponderRelease: (_, gesture) => {
				const nx = basePos.current.x + gesture.dx;
				const ny = basePos.current.y + gesture.dy;
				basePos.current = { x: nx, y: ny };

				const cw = (sizeAnim.width as unknown as { _value: number })._value;
				const ch = (sizeAnim.height as unknown as { _value: number })._value;
				baseSize.current = { width: cw, height: ch };

				initialPinchDist.current = null;

				onUpdate(item.id, {
					x: nx,
					y: ny,
					width: cw,
					height: ch,
				});
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
				],
			}}
		>
			<Animated.Image
				source={{ uri: item.uri }}
				style={{
					width: sizeAnim.width,
					height: sizeAnim.height,
					borderRadius: 6,
				}}
				resizeMode="cover"
			/>
		</Animated.View>
	);
}

export default memo(DraggableImage);
