import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Api } from "../../firebase";
import { loadState } from "./storage";

interface Post {
    id?: number; 
    title: string | undefined;
    text: string | undefined;
}


interface PostState {
    posts: Post[]; // Changed state to hold multiple posts
    selectedPost?: Post; // You can optionally keep track of selected post if needed
}

const initialState: PostState = {
    posts: [],  
    selectedPost: undefined,
};

export const post = createAsyncThunk(
    'user/post',
    async (params: { text: string, title: string }, thunkAPI) => {
        const { text, title } = params; 
        try {
            const userID: string | undefined = loadState('userID');  
            if (!userID) {
                return  
            }
            const data = await Api.addPost(userID, text, title);
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
export const deletePost = createAsyncThunk(
    'post/deletePost',
    async (params:{postId:number}, thunkAPI) => {
        const userId:string | undefined = loadState('userID');
        const {postId} = params
        if(userId){
            try {
                await Api.deletePost(userId, postId);
                return postId; 
            } catch (e) {
                if (e instanceof Error) {
                    return thunkAPI.rejectWithValue(e.message);
                } else {
                    return thunkAPI.rejectWithValue("Сервер вернул ошибку");
                }
            }
        }
    }
);

export const correctPost = createAsyncThunk(
    'user/correctPost',
    async(params:{postId:number, updateText:string, updateTitle:string}, thunkAPI) => {
        const userId:string | undefined = loadState('userID');
        const {postId, updateText, updateTitle} = params;
        try {
            if (userId === undefined || postId === undefined) {
                return;
            } 
            await Api.correctPost(userId, postId, updateText, updateTitle);
            return { postId, updatedText: updateText, updatedTitle: updateTitle }; // Return updated data for Redux
        } catch(e) {
            if (e instanceof Error) {
                return thunkAPI.rejectWithValue(e.message);
            } else {
                return thunkAPI.rejectWithValue("Сервер вернул ошибку");
            }
        }
    }
);

export const postSlice = createSlice({
    name: 'post',
    initialState,
    reducers: {
        setDatePost: (state, action) => {
            state.selectedPost = {
                ...state.selectedPost,
                title: action.payload.title,
                text: action.payload.text,
            };  
        },
        setPost: (state, action) => {
            state.selectedPost = action.payload;
        },
        setPosts: (state, action) => {
            state.posts = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(correctPost.fulfilled, (state, action) => {
            if (action.payload) {
                const { postId, updatedText, updatedTitle } = action.payload;
                state.posts = state.posts.map((post: Post) =>
                    post.id === postId ? { ...post, text: updatedText, title: updatedTitle } : post
                );
            }
        });        
        builder.addCase(post.fulfilled, (state, action) => {
                if (action.payload) {
                    console.log("Payload:", action.payload);
                    state.posts.push(action.payload);  
                    console.log("Payload is undefined or null.");
                }
            })
        builder.addCase(deletePost.fulfilled, (state, action) => {
                const postId = action.payload;
                if (postId) {
                    state.posts = state.posts.filter((post) => post.id !== postId);
                    console.log(`Post with ID ${postId} deleted.`);
                }
            })
        builder.addCase(deletePost.pending,(state, action) => {
                const postId = action.meta.arg.postId;
                state.posts = state.posts.filter((post:Post) => post.id !== postId)
            })
        builder.addCase(deletePost.rejected, () => {
                console.log("Delete post failed. Restoring previous state.");
            });
    }
});

export const postActions = postSlice.actions;
export default postSlice.reducer;
