import { DetailedHTMLProps } from "react";
import { HTMLAttributes } from "react";
type onDeleteType = (postId:number) => void;
export interface DivProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    children: string;
    postId:number,
    title:string,
    onDelete?:onDeleteType;
}