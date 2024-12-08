import { DetailedHTMLProps } from "react";
import { HTMLAttributes } from "react";
export interface UserCartProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    id?:string;
    userName:string;
    userSkills:string[];
    userAvatar:string;
}