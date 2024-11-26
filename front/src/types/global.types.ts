export interface IEarthquakesData {
	earthquakes: IEarthquakes[];
	totalCount: number;
}

export interface IEarthquakes {
	date: string;
	id: string;
	location: string;
	magnitude: number;
}

export interface IUserData {
	id: string;
	email: string;
	name: string;
	role: string;
}
