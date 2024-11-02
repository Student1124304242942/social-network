import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { userAPI } from "@/firebase";
import { loadState } from "./storage";
interface Message {
    text:string | undefined;
}
interface sendMessage {
    messages: Message[],
    loading:boolean,
    error: string | null
}

const initialState:sendMessage = {
    messages: [],
    loading:false,
    error:null
};

export const sendMessage = createAsyncThunk(
    'message/sendMessage',
    async(params:{ senderId:string, recipientId:string, messageContent:string}, {rejectWithValue}) => {
        try {
            const {senderId, recipientId, messageContent} = params
            await userAPI.sendMessage(senderId, recipientId, messageContent);
            return { senderId, recipientId, messageContent, timestamp: Date.now() };
        }catch(error){
            if(error  instanceof Error){
                return rejectWithValue(error.message)
            }
        }
    }
);

export const addChat = createAsyncThunk(
    'message/createChat',
    async(params:{ recipientId: string, name:string, avatarRef:string}, {rejectWithValue}) => {
        try {
            const { recipientId, name, avatarRef} = params;
            const userId:string | undefined = loadState('userID');
            if(userId){
                await userAPI.addChat(userId,recipientId,name,avatarRef);
            }
        }catch(error){
            if(error  instanceof Error){
                return rejectWithValue(error.message)
            }
        }
    }
)

const messagesSlice = createSlice({
    name: 'messages',
    initialState,
    reducers: {
        clearMessages: (state) => {
            state.messages = [];
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(sendMessage.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(sendMessage.fulfilled, (state, action) => {
            state.loading = false;
            state.messages.push({ text: action.payload?.messageContent });
        })
        .addCase(sendMessage.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
            alert(state.error);  
        });
    }
});

export const messagesActions = messagesSlice.actions;
export default messagesSlice.reducer;
