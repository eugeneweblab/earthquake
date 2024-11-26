import { gql } from '@apollo/client';

export const EARTHQUAKE_QUERY = gql`
	query Earthquakes($limit: Int!, $skip: Int!) {
		earthquakes(limit: $limit, skip: $skip) {
			earthquakes {
				id
				magnitude
				location
				date
			}
			totalCount
		}
	}
`;

export const DELETE_EARTHQUAKE_MUTATION = gql`
	mutation DeleteEarthquake($id: String!) {
		deleteEarthquake(id: $id)
	}
`;

export const UPDATE_EARTHQUAKE_MUTATION = gql`
	mutation UpdateEarthquake($id: String!, $updateEarthquakeInput: UpdateEarthquakeInput!) {
		updateEarthquake(id: $id, updateEarthquakeInput: $updateEarthquakeInput) {
			id
			magnitude
			location
			date
		}
	}
`;

export const CREATE_EARTHQUAKE_MUTATION = gql`
	mutation CreateEarthquake($createEarthquakeInput: CreateEarthquakeInput!) {
		createEarthquake(createEarthquakeInput: $createEarthquakeInput) {
			id
			magnitude
			location
			date
		}
	}
`;
