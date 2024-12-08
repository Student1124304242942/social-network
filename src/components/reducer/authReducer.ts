import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Register } from "../interfaces/register";
import { userAPI } from "../../firebase";
import { getAuth } from "firebase/auth";
interface AuthState {
    userId: string | null;
    logged: boolean;
    loginErrorMessage?: string | undefined;
    registerErrorMessage?: string | undefined;
    profile: Register | undefined;
}

const initialState: AuthState = {
    userId: null,
    logged: false,
    profile: undefined
};

export const login = createAsyncThunk(
    'user/login',
    async (params: { email: string, password: string }, thunkAPI) => {
        const { email, password } = params;
        try {
            const data = await userAPI.login({email, password});
            return data
        } catch (e) {
            if (e instanceof Error) {
                return thunkAPI.rejectWithValue(e.message);
            } else {
                return thunkAPI.rejectWithValue("Сервер вернул ошибку");
            }
        }
    }
);

export const logOutUser = createAsyncThunk(
    'user/logOut',
    async ( ) => {
        try {
            const auth = getAuth();
            await userAPI.logOut(auth);
            return true; 
        } catch (e) {
            if (e instanceof Error) {
                return alert('ВЫ НЕ ВЫЙДЕТЕ ОТ СЮДА');
            }
        }
    }
);

export const register = createAsyncThunk(
    'user/register',
    async (params: {email: string, firstName: string, lastName: string, password: string, age:number, skills: string[] | undefined, country:string}, thunkAPI) => {
        const {email, firstName, lastName, password, age, skills, country} = params
        try {
            const data = await userAPI.addUser({email, firstName, lastName, password, age, skills, country});
            return data;
        } catch (e) {
            if (e instanceof Error) {
                return thunkAPI.rejectWithValue(e.message);
            } else {
                return thunkAPI.rejectWithValue("Сервер вернул ошибку");
            }
        }
    }
);

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        clearLoginError: (state) => {
            state.loginErrorMessage = undefined;
        },
        clearRegisterError: (state) => {
            state.registerErrorMessage = undefined;
        },
        setUser: (state, action) => {
            state.userId = action.payload;
            state.logged = action.payload;  
        },
        setProfile: (state, action) => {
            state.profile = action.payload; 
        },
    },
    extraReducers: (builder) => {
        builder.addCase(register.fulfilled, (state, action) => {
            if(action.payload) {
                state.logged = true
            }
        })
        builder.addCase(login.fulfilled, (state, action) => {
             if (action.payload) {
                    state.userId = action.payload;
                    state.logged = true;  
                    state.loginErrorMessage = undefined;
                }
            })
        builder.addCase(login.rejected, (state, action) => {
                state.loginErrorMessage =  action.error.message;
            })
        builder.addCase(register.rejected, (state, action) => {
                state.registerErrorMessage =  action.error.message;
        })
        builder.addCase(logOutUser.fulfilled, (state, action) => {
            if(action.payload){
                state.logged = false
                state.userId = null
            }
        })
    },
});

export const userActions = userSlice.actions;
export default userSlice.reducer;

