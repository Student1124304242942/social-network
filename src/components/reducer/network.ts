import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./authReducer";
import postReducer from './post';
import usersReducer from './users';
import chatReducer from './chat';
import profileReducer from './anotherProfile';
export const network = configureStore({
    reducer: {
        user: userReducer,
        post:postReducer,
        users: usersReducer,
        chat:chatReducer,
        profile:profileReducer
    }
});

export type RootState = ReturnType<typeof network.getState>;
export type AppDispatch = typeof network.dispatch