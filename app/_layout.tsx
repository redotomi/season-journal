import "../global.css";

import {
	Lora_400Regular,
	Lora_400Regular_Italic,
	Lora_600SemiBold,
	Lora_700Bold,
} from "@expo-google-fonts/lora";
import {
	Nunito_400Regular,
	Nunito_500Medium,
	Nunito_600SemiBold,
	Nunito_700Bold,
} from "@expo-google-fonts/nunito";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

import { JournalColors } from "@/constants/theme";

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
	anchor: "(tabs)",
};

export default function RootLayout() {
	const [fontsLoaded] = useFonts({
		Lora_400Regular,
		Lora_400Regular_Italic,
		Lora_600SemiBold,
		Lora_700Bold,
		Nunito_400Regular,
		Nunito_500Medium,
		Nunito_600SemiBold,
		Nunito_700Bold,
	});

	useEffect(() => {
		if (fontsLoaded) {
			SplashScreen.hideAsync();
		}
	}, [fontsLoaded]);

	if (!fontsLoaded) {
		return null;
	}

	return (
		<>
			<Stack
				screenOptions={{
					headerShown: false,
					contentStyle: { backgroundColor: JournalColors.parchment },
				}}
			>
				<Stack.Screen name="(tabs)" />
			</Stack>
			<StatusBar style="dark" />
		</>
	);
}
