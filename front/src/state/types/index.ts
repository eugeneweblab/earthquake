import type { Dispatch, ReactNode } from 'react';

import type { UserAction } from '@/state/types/userTypes';
import type { IUserData } from '@/types/global.types';

export interface RootProviderProps {
	children: ReactNode;
	userInitialData: IUserData | null;
}

export interface RootContextProps {
	user: IUserData | null;
	userDispatch: Dispatch<UserAction>;
}
