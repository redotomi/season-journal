import { memo } from "react";
import { Text, View } from "react-native";

import { Colors, Fonts } from "@/constants/theme";

type Props = {
	checked: number;
	total: number;
};

function BingoProgressBar({ checked, total }: Props) {
	const pct = total > 0 ? (checked / total) * 100 : 0;

	return (
		<View style={{ marginBottom: 20 }}>
			<View
				className="flex-row items-center justify-between"
				style={{ marginBottom: 8 }}
			>
				<Text
					style={{
						fontFamily: Fonts.displayMedium,
						fontSize: 15,
						color: Colors.textPrimary,
					}}
				>
					Progress
				</Text>
				<Text
					style={{
						fontFamily: Fonts.bodySemiBold,
						fontSize: 14,
						color: Colors.textSecondary,
					}}
				>
					{checked} / {total}
				</Text>
			</View>

			<View
				style={{
					height: 10,
					borderRadius: 5,
					backgroundColor: Colors.accentSoft,
					overflow: "hidden",
				}}
			>
				<View
					style={{
						height: "100%",
						width: `${pct}%`,
						borderRadius: 5,
						backgroundColor: Colors.accent,
					}}
				/>
			</View>
		</View>
	);
}

export default memo(BingoProgressBar);
