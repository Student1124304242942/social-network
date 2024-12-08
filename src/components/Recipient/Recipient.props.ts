import { DetailedHTMLProps } from "react";
import { HTMLAttributes } from "react";

export interface RecipientProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    id: string;
    userName: string;
    userAvatar: string;
    update: (id: string) => void; 
}
