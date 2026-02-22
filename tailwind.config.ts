import type { Config } from "tailwindcss";

const config: Config = {
	content: [
		"./app/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
	],
	presets: [require("nativewind/preset")],
	theme: {
		extend: {
			colors: {
				glass: {
					bg: "#EEEDF2",
					surface: "rgba(255,255,255,0.85)",
					solid: "#FFFFFF",
					dark: "#1C1C2E",
					accent: "#E8A838",
					"accent-soft": "#FFF3DC",
					border: "rgba(0,0,0,0.06)",
					rose: "#D4A0A0",
					sage: "#B5C9A8",
					sky: "#B8D4E3",
				},
			},
			fontFamily: {
				inter: ["Inter_400Regular"],
				"inter-medium": ["Inter_500Medium"],
				"inter-semibold": ["Inter_600SemiBold"],
				"inter-bold": ["Inter_700Bold"],
				nunito: ["Nunito_400Regular"],
				"nunito-medium": ["Nunito_500Medium"],
				"nunito-semibold": ["Nunito_600SemiBold"],
				"nunito-bold": ["Nunito_700Bold"],
			},
			borderRadius: {
				"2xl": "20px",
				"3xl": "24px",
				"4xl": "28px",
			},
		},
	},
	plugins: [],
};

export default config;
