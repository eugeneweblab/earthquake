import type { IUserData } from '@/types/global.types';

export type UserAction =
	| { type: 'ADD_USER'; payload: IUserData }
	| { type: 'UPDATE_USER'; payload: any }
	| { type: 'DELETE_USER'; payload: any };
