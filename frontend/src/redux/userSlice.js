import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    currentUser: null,
    host: null,
    error: null,
    loading: false,
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        signInStart: (state) => {
            state.loading = true;
        },
        signInSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        signInFaliure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        checkHost: (state, action) => {
            state.host = action.payload;
        }
    }
});

export const {
    signInStart,
    signInFaliure,
    signInSuccess,
    checkHost

} = userSlice.actions;
export default userSlice.reducer