import { Calendar, Flag, Heart } from "lucide-react-native";
import { ActivityIndicator, Text, View } from "react-native";

import { useFavoriteDriver } from "@/hooks/queries/useFavorites";

const MOCK_FAVORITE_ID = "max_verstappen";

const LoadingState = (
	<View className="flex-1 justify-center items-center bg-glass-bg">
		<ActivityIndicator size="large" color="#FABC05" />
	</View>
);

const ErrorState = (
	<View className="flex-1 justify-center items-center px-5 bg-glass-bg">
		<Text className="font-nunito text-[#8E8E93]">
			Could not load favorite driver details.
		</Text>
	</View>
);

export default function FavouriteDriverScreen() {
	const { data: driver, isLoading, isError } = useFavoriteDriver(MOCK_FAVORITE_ID);

	if (isLoading) {
		return LoadingState;
	}

	if (isError || !driver) {
		return ErrorState;
	}

	return (
		<View className="flex-1 px-5 pt-8 bg-glass-bg">
			<View className="bg-glass-solid rounded-3xl p-8 items-center shadow-lg shadow-black/5">
				<View className="w-20 h-20 rounded-[24px] bg-[#F5ECEC] items-center justify-center mb-6">
					<Heart color="#D4A0A0" size={36} strokeWidth={1.5} />
				</View>

				<Text className="font-inter-bold text-3xl text-glass-dark mb-1 text-center">
					{driver.givenName} {driver.familyName}
				</Text>

				<View className="bg-[#FFF3DC] px-4 py-1.5 rounded-full mb-8">
					<Text className="font-nunito-bold text-lg text-[#FABC05]">
						{driver.permanentNumber}
					</Text>
				</View>

				<View className="w-full bg-[#F8F8FC] rounded-2xl p-4 mb-3 flex-row items-center justify-between">
					<View className="flex-row items-center">
						<Flag color="#8E8E93" size={20} strokeWidth={2} />
						<Text className="font-nunito text-[#8E8E93] ml-3 text-base">Nationality</Text>
					</View>
					<Text className="font-nunito-bold text-glass-dark text-base">
						{driver.nationality}
					</Text>
				</View>

				<View className="w-full bg-[#F8F8FC] rounded-2xl p-4 flex-row items-center justify-between">
					<View className="flex-row items-center">
						<Calendar color="#8E8E93" size={20} strokeWidth={2} />
						<Text className="font-nunito text-[#8E8E93] ml-3 text-base">Date of Birth</Text>
					</View>
					<Text className="font-nunito-bold text-glass-dark text-base">
						{driver.dateOfBirth}
					</Text>
				</View>
			</View>
		</View>
	);
}
