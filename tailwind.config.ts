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
				journal: {
					parchment: "#FFF8F0",
					cream: "#FEF3E2",
					ink: "#5C4033",
					"ink-light": "#8B7355",
					rose: "#D4A0A0",
					sage: "#B5C9A8",
					sky: "#B8D4E3",
					sienna: "#C67A5C",
					muted: "#A89786",
					line: "#E8DDD0",
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
		},
	},
	plugins: [],
};

export default config;
