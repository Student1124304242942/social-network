import { initializeApp } from "firebase/app";
import { Auth, getAuth } from "firebase/auth";
import { child, get, getDatabase, ref, set } from "firebase/database";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { Register } from "./components/interfaces/register";
import { Login } from "./components/interfaces/login";
import { Post } from "./components/interfaces/Post";
import { Chat } from "./components/interfaces/Chat";
import { Recipient } from "./components/reducer/chat";
import { userProfile } from "./components/interfaces/userProfile";
import { Homie } from "./pages/Messages/Messages";
import { signOut } from "firebase/auth";
import axios from "axios";
const firebaseConfig = {
  apiKey: "AIzaSyApfC5xQ2RPwa4KAVWszUpZi-8nk0XCySQ",
  authDomain: "social-network-ea6a9.firebaseapp.com",
  databaseURL: "https://social-network-ea6a9-default-rtdb.firebaseio.com",
  projectId: "social-network-ea6a9",
  storageBucket: "social-network-ea6a9.firebasestorage.app",
  messagingSenderId: "25045780704",
  appId: "1:25045780704:web:a7ab9aee67635639fd2885",
  measurementId: "G-SYYJDWZX67"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

async function uploadToVercelStorage(file: Blob): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post( 'https://2lubf67slxkxrsys.public.blob.vercel-storage.com', formData, {
        headers: {
            'Authorization': 'vercel_blob_rw_2LUBF67SlxKxrsys_HAwT3TCaRFFpcYeuoKdehuchLjQ8BF', // Replace with your actual token
            'Content-Type': 'multipart/form-data',
        }
    });

    if (response.data && response.data.fileUrl) {
        return response.data.fileUrl;  
    }

    throw new Error('Failed to upload file to Vercel Storage');
}


export const Api = {
    async getProfileInfo(profileId: string | null) {
        const snapshot = await get(child(ref(db), `profiles/${profileId}`));
        const profileData = snapshot.val();
        if (profileData === null) return;
        return profileData;
    },
    async isUserLogged(): Promise<string[] | null> {
        const dbRef = ref(db);
        const snapshot = await get(child(dbRef, 'profiles'));
        const profiles = snapshot.val();
        if (profiles === null) return null;
        return Object.keys(profiles);  
    },
    async getUserInfo(profileId: string | null) {
        const snapshot = await get(child(ref(db), `users/${profileId}`));
        const userData = snapshot.val();
        if (userData === null) return;
        return userData;
    },
    async getProfiles(): Promise<userProfile[] | null> {
        const dbRef = ref(db);
        const snapshot = await get(child(dbRef, 'profiles'));
        const profiles = snapshot.val();
        if (profiles === null) return null;
        return Object.keys(profiles).map(key => ({
            id: key,
            ...profiles[key]  
        })) as userProfile[];  
    },
    async getUsers() {
        const dbRef = ref(db);
        const snapshot = await get(child(dbRef, 'users'));
        const users = snapshot.val();
        if (users === null) return;
        return users;
    },
    async anotherUserChat(recipientId: string, userId:string): Promise<Chat[]> {
        const dbRef = ref(db);
        console.log('Fetching messages for chat id:', userId);
        const snapshot = await get(child(dbRef,  `profiles/${recipientId}`));
        if (!snapshot.exists()) {
            return [];
        }
        const profile  = snapshot.val();
        const chat = profile.chats.filter((chat: Chat) => chat.id === userId);
        console.log(chat);
        return chat;
    },
    async getAnotherProfile(userID: string): Promise<userProfile[]> {
        const dbRef = ref(db);
        const snapshot = await get(child(dbRef, `profiles/${userID}`));
    
        if (!snapshot.exists()) {
            return [];  
        }  
        const profile = snapshot.val();
    
        const formattedProfile: userProfile = {
            id: userID,                       
            avatar: profile.avatar,
            profileImage: profile.profileImage,
            age: profile.age,
            skills: profile.skills,         
            country: profile.country,
            name: profile.name,
            posts: profile.posts || '',
            chats: []      
        };
    
        return [formattedProfile];  
    },
     
    async login({email, password}: Login) {
        const auth = getAuth();
        try {
            const user = await signInWithEmailAndPassword(auth, email, password);
            return user.user.uid;
        } catch (error) {
            console.log(error);
            return false;
        }
    },
    async getAllUsers() {
        const snapshot = await get(ref(db, 'users'));
        if(snapshot.exists()){
            const data = snapshot.val();
            return Object.values(data);  
        } else {
            return [];  
        }
    },
    async addPost(userId: string, text: string, title: string): Promise<void | Post> {
        try {
            const previousData = await Api.getProfileInfo(userId);
            if (previousData) {
                const currentPosts = previousData.posts || []
                const newPostId = currentPosts.length;
                const newPost: Post = {
                    id: newPostId,
                    title: title,
                    text: text,
                    time: Date.now(),
                };
                const updatedPosts = [...currentPosts, newPost];
                await set(ref(db, `profiles/${userId}`), {
                    ...previousData,
                    posts: updatedPosts,
                });
                return newPost;
            }
        } catch (error) {
            console.error("Error adding post:", error);
            throw error; 
        }
    },
    async addUser({ email, password, firstName, lastName, age, skills, country }: Register) {
        const auth = getAuth();
        try {
            const newUser = await createUserWithEmailAndPassword(auth, email, password);
            const uid = newUser.user.uid;
            const avatarUrl = 'https://cdn-bucket.hb.ru-msk.vkcs.cloud/purple-images/demo/food/food1.png';
            const profileImage = 'https://i.pinimg.com/originals/21/93/e3/2193e3c9b38de439c91b4e81a25c4249.png';
            if (uid) {
                const profileData = {
                    avatar: avatarUrl,   
                    profileImage: profileImage,
                    age: age,
                    skills: skills,
                    country: country,
                    name: `${firstName} ${lastName}`,
                    following: [],
                    posts: [],
                    chats: [],
                };
                const profile = {
                    uid: uid,
                    avatar: avatarUrl,
                    name: `${firstName} ${lastName}`,
                    skills: skills,
                }
                await set(ref(db, `profiles/${uid}`), profileData);
                await set(ref(db, `users/${uid}`), profile);
                return true;
            }
        } catch (error) {
            console.error("Error during user registration:", error);
            alert(`Registration failed: ${error}`);
        }
    },
    async getChats(userID: string): Promise<Homie[]> {
        const dbRef = ref(db);
        const snapshot = await get(child(dbRef, `profiles/${userID}/chats`));
        
        if (!snapshot.exists()) {
            return [];
        }
        const chats = snapshot.val();
        
        const sanitizedChats: Homie[] = Object.keys(chats).map(chatId => ({
            id: chats[chatId].id,
            name: chats[chatId].name,
            avatarRef: chats[chatId].avatarRef
        }));
        
        return sanitizedChats;  
   },
    async getAllChats(userId: string): Promise<Chat[] | null> {
        try {
            const profileData = await Api.getProfileInfo(userId);
    
            if (!profileData || !profileData.chats) {
                return null;  
            }
    
            return Object.keys(profileData.chats).map(key => ({
                id: key,
                ...profileData.chats[key]
            })) as Chat[];
        } catch (error) {
            console.error("Error adding chat:", error);
            throw error; 
        }
    },
    async addChat(userId: string, recipientId: string, name: string, avatarRef: string) {
        try {
            const previousData = await Api.getProfileInfo(userId);
            const recipientData = await Api.getProfileInfo(recipientId);
            
            if (previousData && recipientData) {
                const currentChats = previousData.chats || [];
                const chatExists = currentChats.some((i: { id: string }) => i.id === recipientId);
    
                if (chatExists) {
                    return currentChats;  
                }
                
                const newChat: Chat = {
                    id: recipientId,
                    name: name,
                    chat: {
                        text: [],
                        lastMessage: null,
                        createdAt: new Date().toISOString(),
                    },
                    avatarRef: avatarRef
                };
    
                const updatedChats: Chat[] = [...currentChats, newChat];
                await set(ref(db, `profiles/${userId}`), {
                    ...previousData,
                    chats: updatedChats,
                });
    
                const newRecipientChat: Chat = {
                    id: userId,
                    name: previousData.name,
                    chat: {
                        text: [],
                        lastMessage: null,
                        createdAt: new Date().toISOString(),
                    },
                    avatarRef: previousData.avatar 
                };
    
                const recipientChats = recipientData.chats ? [...recipientData.chats, newRecipientChat] : [newRecipientChat];
                await set(ref(db, `profiles/${recipientId}`), {
                    ...recipientData,
                    chats: recipientChats,
                });
                const newRecipient: Recipient = {
                    recipientId: recipientId,
                    name: name,
                    avatarRef: avatarRef,
                };
    
                return newRecipient;  
            }
        } catch (error) {
            console.error("Error adding chat:", error);
            throw error; 
        }
    },        
    async deleteChat(userId: string, recipientId: string) {
        try {
            const previousData = await Api.getProfileInfo(userId);
            const recipientData = await Api.getProfileInfo(recipientId);
            if (previousData && recipientData) {
                const CurrentUserUpdatedChats = previousData.chats.filter((chats: { id: string }) => chats.id !== recipientId);
                const recipientUpdatedChats = recipientData.chats.filter((chat: { id: string }) => chat.id !== userId);

                await set(ref(db, `profiles/${userId}`), {
                    ...previousData,
                    chats: CurrentUserUpdatedChats
                });
                
                await set(ref(db, `profiles/${recipientId}`), {
                    ...recipientData,
                    chats: recipientUpdatedChats
                });

                return CurrentUserUpdatedChats;
            }
        } catch (error) {
            console.error("Error deleting chat:", error);
            throw error;
        }
    },
    async getAnotherUserMessage(userId:string, recipientId:string):Promise<Chat[] | void>{
        try {
            const profileData = await Api.getProfileInfo(userId);
            if(profileData){
                const currentChats = profileData.chats || [];
                const chatIndex = currentChats.findIndex((chat:Chat) => chat.id === recipientId);
                if(chatIndex !== -1){
                    const currentChat = currentChats[chatIndex];
                    return currentChat
                }
                return 
            }   
        }catch (error) {
            console.error("Error adding message:", error);
            throw error; 
        }
    },
    async addMessageToChat(userId: string, recipientId: string, message: string) {
        try {
            const profileData = await Api.getProfileInfo(recipientId);
            if (profileData) {
                const currentChats = profileData.chats || [];
                const chatIndex = currentChats.findIndex((chat: Chat) => chat.id === userId);
                if (chatIndex !== -1) {
                    const currentChat = currentChats[chatIndex];
                    const newMessage = {
                        text: message,
                        sentAt: new Date().toISOString()
                    };
    
                    const chatTextArray = currentChat.chat?.text || [];  
    
                    const updatedChat = {
                        ...currentChat,
                        chat: {
                            ...currentChat.chat,
                            text: [...chatTextArray, newMessage.text],
                            lastMessage: newMessage.text,
                            createdAt: newMessage.sentAt
                        }
                    };
    
                    const updatedChats = [
                        ...currentChats.slice(0, chatIndex),
                        updatedChat,
                        ...currentChats.slice(chatIndex + 1)
                    ];
    
                    await set(ref(db, `profiles/${recipientId}`), {
                        ...profileData,
                        chats: updatedChats
                    });
                    return updatedChat;
                }
            }
        } catch (error) {
            console.error("Error adding message:", error);
            throw error; 
        }
    },    
    async deletePost(userId: string | undefined, postId: number) {
        try {
            if (userId) {
                const profileData = await Api.getProfileInfo(userId);
                if (profileData && profileData.posts) {
                    const updatedPosts = profileData.posts.filter((post: { id: number }) => post.id !== postId);
                    await set(ref(db, `profiles/${userId}`), {
                        ...profileData,
                        posts: updatedPosts
                    });
                    return updatedPosts;
                }
            }
        } catch (error) {
            console.error("Error deleting post:", error);
            throw error;
        }
    },
    async logOut(auth:Auth) {
        await signOut(auth);
    },
    async correctPost(userId: string | undefined, postId: number, updateText: string, updateTitle: string) {
        try {
            if (userId) {
                const profileData = await Api.getProfileInfo(userId);
                if (profileData && profileData.posts) {
                    const postIndex = profileData.posts.findIndex((post: Post) => post.id === postId);

                    if (postIndex !== -1) {
                        const updatePost = {
                            ...profileData.posts[postIndex],
                            text: updateText,
                            title: updateTitle,
                            time: Date.now()
                        };
                        const updatePosts = [...profileData.posts];
                        updatePosts[postIndex] = updatePost;

                        await set(ref(db, `profiles/${userId}`), {
                            ...profileData,
                            posts: updatePosts  
                        });
                        return updatePost;
                    }
                } else {
                    throw new Error("Post not found");
                }
            }
        } catch (error) {
            console.error("Error correcting post:", error);
            throw error;
        }
    },
    async editProfile(userID: string, name: string, age: number, skills: string[], country: string, avatar?: Blob, profileImage?: Blob) {
        try {
            if (userID) {
                const profileData = await Api.getProfileInfo(userID);
                const userData = await Api.getUserInfo(userID);
                const dbProfile = ref(db, 'profiles/' + userID);
                const dbUsers = ref(db, 'users/' + userID);
    
                if (profileData) {
                    await set(dbProfile, { ...profileData, name: name, country: country, skills: skills, age: age });
                    await set(dbUsers, { ...userData, name: name, skills: skills });
    
                    let profileImageUrl: string | null = null;
                    if (profileImage) {
                        profileImageUrl = await uploadToVercelStorage(profileImage);
                        await set(dbProfile, { ...profileData, profileImage: profileImageUrl });
                    }
    
                    let avatarUrl: string | null = null;
                    if (avatar) {
                        avatarUrl = await uploadToVercelStorage(avatar);
                        await set(dbProfile, { ...profileData, avatar: avatarUrl });
                        await set(dbUsers, { ...userData, avatar: avatarUrl });
                    }
    
                    return true;    
                }
            }
        } catch (error) {
            console.error("Error editing profile:", error);
            throw error;
        }
    }
    
}

export const userAPI = {
    addUser: Api.addUser,
    editProfile: Api.editProfile,
    login: Api.login,
    getProfileInfo: Api.getProfileInfo,
    deletePost: Api.deletePost,
    addChat: Api.addChat,
    deleteChat: Api.deleteChat,
    anotherUserChat: Api.anotherUserChat,
    logOut: Api.logOut
};

export default auth;
 

 