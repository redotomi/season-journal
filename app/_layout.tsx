import "../global.css";

import {
	Rubik_300Light,
	Rubik_400Regular,
	Rubik_500Medium,
	Rubik_600SemiBold,
	Rubik_700Bold,
} from "@expo-google-fonts/rubik";
import { QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

import { Colors } from "@/constants/theme";
import { queryClient } from "@/lib/api/query-client";

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
	anchor: "(tabs)",
};

export default function RootLayout() {
	const [fontsLoaded] = useFonts({
		Rubik_300Light,
		Rubik_400Regular,
		Rubik_500Medium,
		Rubik_600SemiBold,
		Rubik_700Bold,
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
		<QueryClientProvider client={queryClient}>
			<Stack
				screenOptions={{
					headerShown: false,
					contentStyle: { backgroundColor: Colors.background },
				}}
			>
				<Stack.Screen name="(tabs)" />
			</Stack>
			<StatusBar style="dark" />
		</QueryClientProvider>
	);
}
