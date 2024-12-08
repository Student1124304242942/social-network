import { ReactNode } from "react"
import { Navigate } from "react-router-dom";
import { loadState } from "./storage";

export const RequireAuth = ({children}: {children: ReactNode}) => {
    const userid = loadState('userID');
    if(!userid){
        return <Navigate to ="/auth/login" replace/>;
    }
    return children;
}