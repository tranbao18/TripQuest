import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    token: null,
    favorites: [],
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser(state, action) {
            state.user = action.payload.user;
            state.token = action.payload.token;
        },
        logout(state) {
            state.user = null;
            state.token = null;
        },
        toggleFavorite(state, action) {
            const exists = state.favorites.some(f => f.id === action.payload.id);
            if (exists) {
                state.favorites = state.favorites.filter(f => f.id !== action.payload.id);
            } else {
                state.favorites.push(action.payload);
            }
        }
    },
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;