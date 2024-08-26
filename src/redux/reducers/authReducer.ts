/** @format */

import { createSlice } from '@reduxjs/toolkit';

export interface AuthState {
	token: string;
	_id: string;
	name: string;
	rule: number;
}

const initialState = {
	token: '',
	_id: '',
	name: '',
	rule: 0,
};

const authSlice = createSlice({
	name: 'auth',
	initialState: {
		data: initialState,
	},
	reducers: {
		addAuth: (state, action) => {
			state.data = action.payload;
		},
	},
});

export const authReducer = authSlice.reducer;
export const { addAuth } = authSlice.actions;

export const authSeletor = (state: any) => state.authReducer.data;
