import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Api } from "@/firebase";
import { loadState } from "./storage";
export interface User {
    uid: string;
    name: string;
    skills: string[];
    avatar: string;
}
 
interface UserState {
    users: User[];  
}
 
const initialState: UserState = {
    users: [],
};
 
export const fetchUsers = createAsyncThunk<User[], void>(
    'network/users',
    async () => {
        const currentUserId = loadState('userID');
        const users = await Api.getAllUsers() as User[];
        const filteredUsers = users.filter(user => user.uid !== currentUserId);
        return filteredUsers;  
    }
);
 
const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        setUsers: (state, action) => {
            state.users = action.payload; 
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchUsers.fulfilled, (state, action) => {
            state.users = action.payload; 
        });
        builder.addCase(fetchUsers.rejected, (state, action) => {
            console.error("Error fetching users:", action.error);
        });
    }
});

// Export actions and reducer
export const userSliceActions = userSlice.actions;
export default userSlice.reducer;

