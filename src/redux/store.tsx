import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import authInfo from "./slices/authInfo";
import currentStates from "./slices/currentStates";
import statuses from "./slices/statuses";
export const store = configureStore({
    reducer: {
        authInfo: authInfo,
        currentStates: currentStates,
        statuses: statuses
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware()
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispath = typeof store.dispatch