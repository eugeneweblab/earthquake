'use client';

import type { FC } from 'react';
import React, { createContext, useContext, useMemo, useReducer } from 'react';

import { userReducer } from '@/state/reducers/userReducer';
import type { RootContextProps, RootProviderProps } from '@/state/types';

const RootContext = createContext<RootContextProps | undefined>(undefined);

export const RootProvider: FC<RootProviderProps> = ({ userInitialData, children }) => {
	const [user, userDispatch] = useReducer(userReducer, userInitialData);

	const contextValue = useMemo(
		() => ({
			user,

			userDispatch,
		}),
		[user],
	);

	return <RootContext.Provider value={contextValue}>{children}</RootContext.Provider>;
};

export const useStore = () => {
	const context = useContext(RootContext);
	if (!context) {
		throw new Error('useRoot must be used within a RootProvider');
	}
	return context;
};
