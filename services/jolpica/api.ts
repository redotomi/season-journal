import { API_CONFIG } from "@/lib/api/config";

export interface Driver {
	driverId: string;
	permanentNumber: string;
	code: string;
	url: string;
	givenName: string;
	familyName: string;
	dateOfBirth: string;
	nationality: string;
}

export interface Constructor {
	constructorId: string;
	url: string;
	name: string;
	nationality: string;
}

export interface DriverStanding {
	position: string;
	positionText: string;
	points: string;
	wins: string;
	Driver: Driver;
	Constructors: Constructor[];
}

export interface ConstructorStanding {
	position: string;
	positionText: string;
	points: string;
	wins: string;
	Constructor: Constructor;
}

export interface StandingsResponse<T> {
	MRData: {
		StandingsTable: {
			StandingsLists: {
				season: string;
				round: string;
				DriverStandings?: T[];
				ConstructorStandings?: T[];
			}[];
		};
	};
}

export const jolpicaApi = {
	async getDriverStandings(year: string = "current"): Promise<DriverStanding[]> {
		const response = await fetch(`${API_CONFIG.JOLPICA_BASE_URL}/${year}/driverStandings.json`);
		if (!response.ok) {
			throw new Error("Failed to fetch driver standings");
		}
		const data: StandingsResponse<DriverStanding> = await response.json();
		return data.MRData.StandingsTable.StandingsLists[0]?.DriverStandings || [];
	},

	async getConstructorStandings(year: string = "current"): Promise<ConstructorStanding[]> {
		const response = await fetch(`${API_CONFIG.JOLPICA_BASE_URL}/${year}/constructorStandings.json`);
		if (!response.ok) {
			throw new Error("Failed to fetch constructor standings");
		}
		const data: StandingsResponse<ConstructorStanding> = await response.json();
		return data.MRData.StandingsTable.StandingsLists[0]?.ConstructorStandings || [];
	},

	async getDriver(driverId: string): Promise<Driver | null> {
		const response = await fetch(`${API_CONFIG.JOLPICA_BASE_URL}/drivers/${driverId}.json`);
		if (!response.ok) {
			throw new Error("Failed to fetch driver");
		}
		const data = await response.json();
		return data.MRData.DriverTable?.Drivers?.[0] || null;
	},

	async getConstructor(constructorId: string): Promise<Constructor | null> {
		const response = await fetch(`${API_CONFIG.JOLPICA_BASE_URL}/constructors/${constructorId}.json`);
		if (!response.ok) {
			throw new Error("Failed to fetch constructor");
		}
		const data = await response.json();
		return data.MRData.ConstructorTable?.Constructors?.[0] || null;
	},
};
