import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {persistReducer} from "redux-persist"
import User from "./userSlice";
import storage from "redux-persist/lib/storage";
import persistStore from "redux-persist/es/persistStore";
const rootReducer = combineReducers({
    user1: User
});
const persistConfig = {
    key: 'root',
    storage,
    version: 1
}
const persistedReducer = persistReducer(persistConfig, rootReducer)
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    }),
});
export const persistor = persistStore(store);