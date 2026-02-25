import { useQuery } from "@tanstack/react-query";

import { jolpicaApi } from "@/services/jolpica/api";

export function useFavoriteDriver(driverId: string | null) {
	return useQuery({
		queryKey: ["favoriteDriver", driverId],
		queryFn: () => (driverId ? jolpicaApi.getDriver(driverId) : null),
		enabled: !!driverId,
	});
}

export function useFavoriteTeam(constructorId: string | null) {
	return useQuery({
		queryKey: ["favoriteTeam", constructorId],
		queryFn: () => (constructorId ? jolpicaApi.getConstructor(constructorId) : null),
		enabled: !!constructorId,
	});
}
