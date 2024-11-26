import type { UserAction } from '@/state/types/userTypes';
import type { IUserData } from '@/types/global.types';

export const userReducer = (state: IUserData | null, action: UserAction): IUserData | null => {
	const { type, payload } = action;

	switch (type) {
		case 'ADD_USER':
			return payload;
		case 'UPDATE_USER':
			if (!state) return state;
			return {
				...state,
				...payload,
			};
		case 'DELETE_USER':
			return payload;

		default:
			return state;
	}
};
