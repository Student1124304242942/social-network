import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {child, get, getDatabase, ref , set} from "firebase/database";
import { uploadBytesResumable, getDownloadURL, getStorage, ref as iRef } from "firebase/storage";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { Register } from "./components/interfaces/register";
import { Login } from "./components/interfaces/login";
import { Post } from "./components/interfaces/Post";
import { Chat } from "./components/interfaces/Chat";
 

const firebaseConfig = {
    apiKey: "AIzaSyApfC5xQ2RPwa4KAVWszUpZi-8nk0XCySQ",
    authDomain: "social-network-ea6a9.firebaseapp.com",
    projectId: "social-network-ea6a9",
    storageBucket: "social-network-ea6a9.appspot.com",
    messagingSenderId: "25045780704",
    appId: "1:25045780704:web:85cfc89406fb0d0ffd2885",
    measurementId: "G-ELS34SYCWF" 
};


const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const storage = getStorage(app);

export const Api = {
    async getProfileInfo(profileId:string | null) {
        const snapshot = await get(child(ref(db), `profiles/${profileId}`));  
        const profileData = snapshot.val();
        if (profileData === null) return;
        return profileData;
    },

    async getUsers() {
        const dbRef = ref(db);
        const snapshot = await get(child(dbRef, 'users'));
        const users = snapshot.val();
        if(users === null) return;
        return users;
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
                    avatar:avatarUrl,
                    name: `${firstName} ${lastName}`,
                    skills: skills,
                }
                await set(ref(db, `profiles/${uid}`), profileData);
                await set(ref(db, `users/${uid}`), profile);
                return true
            }
        } catch (error) {
            console.error("Error during user registration:", error);
            alert(`Registration failed: ${error}`);
        }
    },  
    async login({email, password}:Login) {
        const auth = getAuth();
        try {
          const user = await signInWithEmailAndPassword(auth, email, password);
          return user.user.uid;
        } catch (error) {
          console.log(error);
          return false;
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
    async addChat(userId:string ,recipientId: string, name:string, avatarRef:string){
        try{
            const previousData = await Api.getProfileInfo(userId);
            if(previousData){
                const currentChats = previousData.chats || [];
                const newChatId = recipientId;
                const newChat:Chat = {
                    id:newChatId,
                    name:name,
                    chat:{
                        text: [],
                        lastMessage:null,
                        createdAt: new Date().toISOString(),
                    },
                    avatarRef:avatarRef
                };
                const updatedChats = [...currentChats, newChat];
                await set(ref(db, `profiles/${userId}`), {
                    ...previousData,
                    chats: updatedChats,
                })
                return newChat;
            }
        }catch (error) {
            console.error("Error adding post:", error);
            throw error; 
        }
    },
    async addMessageToChat(userId:string, recipientId: string, message: string){
        try{
            const profileData = await Api.getProfileInfo(userId);
            if(profileData){
                const currentChats = profileData.chats || [];
                const chatIndex = currentChats.findIndex((chat:Chat) => chat.id === recipientId);

                if(chatIndex !== -1){
                    const currentChat = currentChats[chatIndex];

                    const newMessage = {
                        text:message,
                        sentAt: new Date().toISOString()
                    };

                    const updatedChat = {
                        ...currentChat,
                        chat: {
                            ...currentChat.chat,
                            text: [...currentChat.chat.text, newMessage],
                            lastMessage: message,
                            createdAt: new Date().toISOString()
                        }
                    };

                    const updatedChats = [
                        ...currentChats.slice(0, chatIndex),
                        updatedChat,
                        ...currentChat.slice(chatIndex+1)
                    ];

                    await set(ref(db, `profiles/${userId}`), {
                        ...profileData,
                        chats: updatedChats
                    })

                    return updatedChat
                }
            }
        } catch(error){
            console.error("Error adding post:", error);
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
                    return updatedPosts
                }
            }
        } catch (error) {
            console.error("Error deleting post:", error);
            throw error;
        }
    },
    async correctPost(userId:string | undefined, postId:number, updateText:string, updateTitle:string) {
        try {
            if(userId){
                const profileData = await Api.getProfileInfo(userId);
                if(profileData && profileData.posts){
                    const postIndex = profileData.posts.findIndex((post:Post) => post.id == postId);

                    if (postIndex !== - 1){
                        const updatePost = {
                            ...profileData.posts[postIndex],
                            text:updateText,
                            title:updateTitle,
                            time:Date.now()
                        }
                        const updatePosts = [...profileData.posts];
                        updatePosts[postIndex] = updatePost; 
                        
                        await set(ref(db, `profiles/${userId}`), {
                            ...profileData,
                            posts: updatePosts  
                        });
                        return updatePost
                    }
                }else{
                    throw new Error("Post not found");
                }
            }
        }catch (error) {
            console.error("Error deleting post:", error);
            throw error;
        }
    },
    async editProfile(userID:string, name:string, age:number, skills:string[], country:string, avatar:Blob | Uint8Array | ArrayBuffer, profileImage:Blob | Uint8Array | ArrayBuffer){
        try{
            if(userID){
                const profileData = await Api.getProfileInfo(userID);
                const dbProfile = ref(db, 'profiles/' + userID);
                if(profileData){
                    await set(dbProfile, {
                        ...profileData,
                        name:name,
                        country:country,
                        skills: skills,
                        age:age,
                    });
                    if(profileImage){
                        const profileImageSnapshot = await uploadBytesResumable(iRef(storage, `users/${userID}/avatar`), profileImage);
                        const profileImageUrl = await getDownloadURL(profileImageSnapshot.ref);
                        await set(dbProfile, {...profileData, profileImage:profileImageUrl});
                    }

                    const users = await Api.getUsers();

                    const dbUsers = ref(db, 'users/' + userID);

                    await set(dbUsers, {
                        ...users[userID],
                        name: name,
                        skills: skills
                    });

                    if(avatar){
                        const avatarSnapshot = await uploadBytesResumable(iRef(storage, `users/${userID}/avatar`), avatar);
                        const avatarUrl = await getDownloadURL(avatarSnapshot.ref);
                        await set(dbProfile, {...profileData, avatar: avatarUrl});
                        await set(dbUsers, {
                          ...users[userID],
                          avatar: avatarUrl,
                        });
                    }

                    return true;
                }
            }
        }catch (error) {
            console.error("Error deleting post:", error);
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
};

/* async updateAvatar(userId: string, file: File): Promise<string | undefined> {
    try {
        const avatarRef = storageRef(storage, `avatars/${userId}/${file.name}`);
        await uploadBytes(avatarRef, file);
        const avatarUrl = await getDownloadURL(avatarRef);
        await set(ref(db, `profiles/${userId}/avatar`), avatarUrl); 
        return avatarUrl;  
    } catch (error) {
        console.error('Error updating avatar:', error); // Log the error for debugging
        throw error; // Throw the error after logging it
    }
},
 */

 