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
				lora: ["Lora_400Regular"],
				"lora-italic": ["Lora_400Regular_Italic"],
				"lora-semibold": ["Lora_600SemiBold"],
				"lora-bold": ["Lora_700Bold"],
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
