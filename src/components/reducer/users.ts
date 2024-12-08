import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Api } from "../../firebase";
import { loadState } from "./storage";
export interface User {
    uid: string;
    name: string;
    skills: string[];
    avatar: string;
}
 
interface UserState {
    users: User[];
    allUsers: User[]; 
}

const initialState: UserState = {
    users: [],
    allUsers: [],
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
        },
        filterUsers: (state, action) => {
            const searchTerm = action.payload.toLowerCase();
            const filteredUsers = state.allUsers.filter(user => 
                user.name.toLowerCase().includes(searchTerm) || 
                user.skills.some(skill => skill.toLowerCase().includes(searchTerm))
            );
            state.users = filteredUsers;
        }        
    },
    extraReducers: (builder) => {
        builder.addCase(fetchUsers.fulfilled, (state, action) => {
            state.users = action.payload; 
            state.allUsers = action.payload; 
        });        
    }
});

export const userSliceActions = userSlice.actions;
export default userSlice.reducer;

