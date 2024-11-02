import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./authReducer";
import postReducer from './post';
import users from './users';
import messages from './message';
export const network = configureStore({
    reducer: {
        user: userReducer,
        post:postReducer,
        users: users,
        messages:messages,
    }
});
export type RootState = ReturnType<typeof network.getState>;
export type AppDispatch = typeof network.dispatch