import { gql } from '@apollo/client';

export const LOGIN_MUTATION = gql`
	mutation Login($email: String!, $password: String!) {
		login(loginUserInput: { email: $email, password: $password }) {
			data {
				id
				name
				email
				role
			}
			token
		}
	}
`;
