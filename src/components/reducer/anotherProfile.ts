import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Api } from "../../firebase";
import { userProfile } from "../interfaces/userProfile";

interface profileState{
    profile:userProfile[] | null;
    loading: boolean;
    error:string | undefined;
}

const initialState: profileState = {
    profile: null,
    loading: false,
    error:undefined,
}


export const getAnotherProfile = createAsyncThunk(
    'users/profile',
    async(params:{id:string | undefined}, thunkAPI) => {
        try{
            const {id} = params
            if(!id){
                return
            }
            const profileData = await Api.getAnotherProfile(id);
            return profileData;
        }catch (e) {
            if (e instanceof Error) {
                return thunkAPI.rejectWithValue(e.message);
            } else {
                return thunkAPI.rejectWithValue("Сервер вернул ошибку");
            }
        }
    }
)

const anotherProfile = createSlice({
    name:'userProfile',
    initialState,
    reducers: {
        setProfile:(state, action) => {
            state.profile = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAnotherProfile.pending, (state) => {
                state.loading = true;
                state.error = undefined;
            })
            .addCase(getAnotherProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.error = undefined;
                if(action.payload){
                    state.profile = action.payload;
                }
            })
            .addCase(getAnotherProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;  
            });
    }
})

export const anotherProfileActions = anotherProfile.actions;
export default anotherProfile.reducer;