import "../global.css";

import {
	Inter_400Regular,
	Inter_500Medium,
	Inter_600SemiBold,
	Inter_700Bold,
} from "@expo-google-fonts/inter";
import {
	Nunito_400Regular,
	Nunito_500Medium,
	Nunito_600SemiBold,
	Nunito_700Bold,
} from "@expo-google-fonts/nunito";
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
		Inter_400Regular,
		Inter_500Medium,
		Inter_600SemiBold,
		Inter_700Bold,
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
