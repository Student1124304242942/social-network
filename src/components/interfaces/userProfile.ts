export interface Post {
    id:number;
    time:number;
    title:string;
    text:string;
}


interface UserChat {
    id: string;
    name: string;
    chat: {
        text: string[];
        lastMessage: string | null;
        createdAt: string;
    };
    avatarRef: string;
}

  

export interface userProfile {
    id: string;          
    age: number;
    avatar: string;
    country: string;
    name: string;
    posts: Post[];      
    profileImage: string;
    skills: string[];
    chats:UserChat[] | [];    
}

