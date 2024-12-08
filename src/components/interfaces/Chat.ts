export interface ChatEnvritment {
    text: [],
    lastMessage: string | null,
    createdAt: string
}
export interface Chat {
    id:string;
    name:string;
    avatarRef:string;
    chat:ChatEnvritment;  
}
