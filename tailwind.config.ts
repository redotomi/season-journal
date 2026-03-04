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
				earth: {
					dark: "#001514",
					light: "#FBFFFE",
					maroon: "#6B0504",
					rust: "#A3320B",
					golden: "#E6AF2E",
					surface: "#F4F1EA",
					"surface-solid": "#EDE9E0",
					border: "rgba(0,21,20,0.08)",
					"border-strong": "rgba(0,21,20,0.16)",
					muted: "rgba(0,21,20,0.45)",
					error: "#6B0504",
					"error-soft": "rgba(107,5,4,0.08)",
				},
			},
			fontFamily: {
				rubik: ["Rubik_400Regular"],
				"rubik-light": ["Rubik_300Light"],
				"rubik-medium": ["Rubik_500Medium"],
				"rubik-semibold": ["Rubik_600SemiBold"],
				"rubik-bold": ["Rubik_700Bold"],
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
