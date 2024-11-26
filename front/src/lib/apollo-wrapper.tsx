'use client';

import { ApolloClient, ApolloLink, ApolloProvider, InMemoryCache } from '@apollo/client';
import { BatchHttpLink } from '@apollo/client/link/batch-http';
import cookie from 'js-cookie';
import type { PropsWithChildren } from 'react';
import React from 'react';

const getAuthToken = () => {
	return cookie.get('earthquakeToken');
};

const authLink = new ApolloLink((operation, forward) => {
	const token = getAuthToken();

	if (token) {
		operation.setContext({
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
	}

	return forward(operation);
});

const client = new ApolloClient({
	ssrMode: false,
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

export function ApolloWrapper({ children }: PropsWithChildren) {
	return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
