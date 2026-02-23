import { memo, useRef, useState } from "react";
import { PanResponder, View } from "react-native";
import Svg, { Path } from "react-native-svg";

import type { DrawPath } from "./canvas-types";

type Props = {
	paths: DrawPath[];
	color: string;
	strokeWidth: number;
	isActive: boolean;
	onPathComplete: (pathData: string, color: string, strokeWidth: number) => void;
};

function DrawingLayer({ paths, color, strokeWidth, isActive, onPathComplete }: Props) {
	const [currentPath, setCurrentPath] = useState<string>("");
	const pathRef = useRef<string>("");
	const colorRef = useRef(color);
	const strokeWidthRef = useRef(strokeWidth);
	const isActiveRef = useRef(isActive);
	const onPathCompleteRef = useRef(onPathComplete);

	colorRef.current = color;
	strokeWidthRef.current = strokeWidth;
	isActiveRef.current = isActive;
	onPathCompleteRef.current = onPathComplete;

	const panResponder = useRef(
		PanResponder.create({
			onStartShouldSetPanResponder: () => isActiveRef.current,
			onMoveShouldSetPanResponder: () => isActiveRef.current,
			onStartShouldSetPanResponderCapture: () => isActiveRef.current,
			onMoveShouldSetPanResponderCapture: () => isActiveRef.current,
			onPanResponderGrant: (evt) => {
				const { locationX, locationY } = evt.nativeEvent;
				const d = `M${locationX.toFixed(1)},${locationY.toFixed(1)}`;
				pathRef.current = d;
				setCurrentPath(d);
			},
			onPanResponderMove: (evt) => {
				const { locationX, locationY } = evt.nativeEvent;
				pathRef.current += ` L${locationX.toFixed(1)},${locationY.toFixed(1)}`;
				setCurrentPath(pathRef.current);
			},
			onPanResponderRelease: () => {
				if (pathRef.current) {
					onPathCompleteRef.current(
						pathRef.current,
						colorRef.current,
						strokeWidthRef.current
					);
				}
				pathRef.current = "";
				setCurrentPath("");
			},
			onPanResponderTerminationRequest: () => false,
		})
	).current;

	return (
		<View
			style={{
				position: "absolute",
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
			}}
			{...(isActive ? panResponder.panHandlers : {})}
			pointerEvents={isActive ? "auto" : "none"}
		>
			<Svg
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
				}}
			>
				{paths.map((p) => (
					<Path
						key={p.id}
						d={p.path}
						stroke={p.color}
						strokeWidth={p.strokeWidth}
						fill="none"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				))}
				{currentPath ? (
					<Path
						d={currentPath}
						stroke={colorRef.current}
						strokeWidth={strokeWidthRef.current}
						fill="none"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				) : null}
			</Svg>
		</View>
	);
}

export default memo(DrawingLayer);
