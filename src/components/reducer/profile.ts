import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loadState } from "./storage";
import { userAPI } from "../../firebase";
import { ProfileCardProps1 } from "../interfaces/profileCard";

interface ProfileState {
    profile: ProfileCardProps1 | null;  // Changed to hold a single ProfileCardProps1 object
}

const initialState: ProfileState = {
    profile: null,
};

export const editProfile = createAsyncThunk(
    'profile/edited',
    async (params: { name: string, age: number, skills: string[], country: string, avatar: Blob  , profileImage: Blob   }, thunkAPI) => {
        const userId: string | undefined = loadState('userID');
        const { name, age, skills, country, avatar, profileImage } = params;
        try {
            if (userId) {
                await userAPI.editProfile(userId, name, age, skills, country, avatar, profileImage);
                return { name, age, skills, country, avatar, profileImage };   
            }
        } catch (e) {
            if (e instanceof Error) {
                return thunkAPI.rejectWithValue(e.message);
            } else {
                return thunkAPI.rejectWithValue("Сервер вернул ошибку");
            }
        }
    }
);

export const profileSlice = createSlice({
    name: 'Editedprofile',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder.addCase(editProfile.fulfilled, (state, action) => {
            if (action.payload) {
                const { name, age, skills, country, avatar, profileImage } = action.payload;
                state.profile = {
                    name,
                    age,
                    skills,
                    country,
                    avatar,
                    profileImage,   
                };
            }
        });
    }
});
