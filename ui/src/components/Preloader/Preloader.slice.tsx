import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface PreloaderState {
    isloading: boolean;
}

const initialState: PreloaderState = {
    isloading: false,
};

const slice = createSlice({
    name: 'preloader',
    initialState,
    reducers: {
        initializePasswordChange: () => initialState,
        startPreloader: (
            state

        ) => {
            state.isloading = true;
        },
        stopPreloader: (
            state
        ) => {
            state.isloading = false;
        }
    },
});

export const { initializePasswordChange, startPreloader, stopPreloader } = slice.actions;
export default slice.reducer;