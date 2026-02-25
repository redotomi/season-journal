import { useQuery } from "@tanstack/react-query";

import { jolpicaApi } from "@/services/jolpica/api";

export function useDriverStandings(year: string = "current") {
	return useQuery({
		queryKey: ["driverStandings", year],
		queryFn: () => jolpicaApi.getDriverStandings(year),
	});
}

export function useConstructorStandings(year: string = "current") {
	return useQuery({
		queryKey: ["constructorStandings", year],
		queryFn: () => jolpicaApi.getConstructorStandings(year),
	});
}
