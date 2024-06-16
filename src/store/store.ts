import { configureStore, combineReducers } from '@reduxjs/toolkit';
import UserReducer from './user/userSlice';

const rootReducer = combineReducers({
    user: UserReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

const store = configureStore({
    reducer: rootReducer
});

export default store;
