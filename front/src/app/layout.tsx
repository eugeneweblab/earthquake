import './globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import type { ReactNode } from 'react';

import Header from '@/components/Header';
import { decryptData } from '@/helpers';
import { ApolloWrapper } from '@/lib/apollo-wrapper';
import { RootProvider } from '@/state/rootProvider';

export const metadata: Metadata = {
	title: 'Create Next App',
	description: 'Generated by create next app',
};

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
	const cookieStore = await cookies();
	const encryptedUserData = cookieStore.get('earthquakeUserData')?.value;

	const encryptionKey = process.env.NEXT_PUBLIC_ENCRYPTED_KEY
		? Buffer.from(process.env.NEXT_PUBLIC_ENCRYPTED_KEY, 'base64')
		: null;

	const userData =
		encryptedUserData && encryptionKey ? decryptData(encryptedUserData, encryptionKey) : null;

	console.log('check');
	return (
		<html lang="en">
			<body>
				<RootProvider userInitialData={userData}>
					<ApolloWrapper>
						<Header />
						{children}
					</ApolloWrapper>
				</RootProvider>
			</body>
		</html>
	);
}
