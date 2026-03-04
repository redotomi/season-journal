import { memo, useMemo } from "react";
import { View } from "react-native";

type Props = {
	opacity?: number;
};

function GrainOverlay({ opacity = 0.04 }: Props) {
	const dots = useMemo(() => {
		const result: { x: number; y: number; size: number; o: number }[] = [];
		const seed = 42;
		for (let i = 0; i < 200; i++) {
			const hash = Math.sin(seed + i * 127.1) * 43758.5453;
			const hash2 = Math.sin(seed + i * 269.5) * 18264.9127;
			const hash3 = Math.sin(seed + i * 419.2) * 93762.1834;
			result.push({
				x: (hash - Math.floor(hash)) * 100,
				y: (hash2 - Math.floor(hash2)) * 100,
				size: 1 + (hash3 - Math.floor(hash3)) * 2.5,
				o: 0.15 + (hash - Math.floor(hash)) * 0.6,
			});
		}
		return result;
	}, []);

	return (
		<View
			pointerEvents="none"
			style={{
				position: "absolute",
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				opacity,
				overflow: "hidden",
			}}
		>
			{dots.map((dot, i) => (
				<View
					key={i}
					style={{
						position: "absolute",
						left: `${dot.x}%`,
						top: `${dot.y}%`,
						width: dot.size,
						height: dot.size,
						borderRadius: dot.size / 2,
						backgroundColor: `rgba(0,21,20,${dot.o})`,
					}}
				/>
			))}
		</View>
	);
}

export default memo(GrainOverlay);
