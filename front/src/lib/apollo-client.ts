import type { FetchResult, NextLink, Operation } from '@apollo/client';
import { ApolloClient, ApolloLink, InMemoryCache } from '@apollo/client';
import { BatchHttpLink } from '@apollo/client/link/batch-http';
import { Observable } from '@apollo/client/utilities';
import { cookies } from 'next/headers';

const getAuthToken = async (): Promise<string | undefined> => {
	const cookieStore = await cookies();
	return cookieStore.get('earthquakeToken')?.value;
};

const authLink = new ApolloLink((operation: Operation, forward: NextLink) => {
	return new Observable<FetchResult>((observer) => {
		getAuthToken()
			.then((token) => {
				if (token) {
					operation.setContext({
						headers: {
							Authorization: `Bearer ${token}`,
						},
					});
				}

				forward(operation).subscribe({
					next: (data) => observer.next(data),
					error: (error) => observer.error(error),
					complete: () => observer.complete(),
				});
			})
			.catch((error) => {
				console.error('Error fetching token:', error);
				observer.error(error);
			});
	});
});

const client = new ApolloClient({
	ssrMode: true,
	link: ApolloLink.from([
		authLink,
		new BatchHttpLink({
			uri: process.env.NEXT_PUBLIC_API_GRAPHQL_URL,
			batchMax: 10,
			batchInterval: 10,
			credentials: 'include',
		}),
	]),
	cache: new InMemoryCache(),
	defaultOptions: {
		query: {
			fetchPolicy: 'network-only',
			errorPolicy: 'all',
		},
	},
});

export default client;
