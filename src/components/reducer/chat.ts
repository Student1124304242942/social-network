import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loadState } from "./storage";
import { Api, userAPI } from "../../firebase";
import { Chat } from "../interfaces/Chat";

export interface Recipient {
    recipientId: string;
    name: string;
    avatarRef: string;
}

interface RecipientState {
    homies: Recipient[];
    loading: boolean; 
    messageReceived: boolean;
    newMessage:boolean;
    currentHomie: Chat[];
}

const initialState: RecipientState = {
    homies: [],
    loading: false,
    messageReceived: false,
    newMessage: false,
    currentHomie: [],  
};

 

export const chat = createAsyncThunk(
    'user/chat',
    async (params: { recipientId: string | undefined; name: string; avatarRef: string }) => {
        const userId: string | undefined = loadState('userID');
        const { recipientId, name, avatarRef } = params;
        if (userId && recipientId) {
            const homies = await userAPI.addChat(userId, recipientId, name, avatarRef);
            return homies; 
        }
        return;  
    }
);

export const deleteChat = createAsyncThunk(
    'user/deleteChat',
    async (params: {recipientId: string | undefined}) => {
        const userId: string | undefined = loadState('userID');
        const { recipientId } = params;

        if (userId && recipientId) {
            const noHomie = await userAPI.deleteChat(userId, recipientId);
            return noHomie; 
        }

        return null;  
    }
);

export const sendMessage = createAsyncThunk(
    'user/Message',
    async (params: { userId: string; recipientId: string; message: string }) => {
        const { userId, recipientId, message } = params;
        const chatMessage = await Api.addMessageToChat(userId, recipientId, message);
        if (chatMessage && chatMessage.chat.text) {
            return Array.isArray(chatMessage.chat.text) ? chatMessage.chat.text : [chatMessage.chat.text || ''];
        } else {
            console.error("chatMessage or chatMessage.chat is undefined:", chatMessage);
            return [];  
        }
    }
);

export const getMessage = createAsyncThunk(
    'homie/message',
    async (params: { userId: string; recipientId: string }) => {
        const { userId, recipientId } = params;
        const message = await Api.getAnotherUserMessage(userId, recipientId);
        if (message) {
            return Array.isArray(message)? message: [message];  
        }
        return null;  
    }
);

const chatSlice = createSlice({
    name: 'chats',
    initialState,
    reducers: {
        setChats: (state, action) => {
            state.homies = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(chat.fulfilled, (state, action) => {
            if(action.payload){
                state.homies = action.payload;
            }
        });
        builder.addCase(deleteChat.fulfilled, (state, action) => {
            if (action.payload) {
                state.homies = action.payload;
            } else {
                console.log("No payload returned from deleteChat action.");
            }
        });
        builder.addCase(sendMessage.fulfilled, (state, action) => {
            if(action.payload){
                state.homies = action.payload;
            }
        });
        builder.addCase(sendMessage.rejected, (state, action) => {
            if(action.payload){
                console.log(action.payload)
            }
        });
        builder.addCase(getMessage.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getMessage.fulfilled, (state, action) => {
            if (action.payload) {
                state.messageReceived = true;
                state.newMessage = true;
                state.currentHomie = action.payload; 
            }
        });
        builder.addCase(getMessage.rejected, (state) => {
            state.loading = false;
            console.error("Failed to get message.");
        });
    }
});

export const chatSliceActions  = chatSlice.actions;
export default chatSlice.reducer;
