import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { loadState } from "./storage";

export const RequireAuth = ({ children }: { children: ReactNode }) => {
    const userId = loadState('userID');
    if(!userId){
        return <Navigate to="/auth/login" replace />;
    }
    return children;
};
