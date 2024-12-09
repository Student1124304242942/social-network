import { RootState } from "./network";
import { ReactNode } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export const RequireAuth = ({ children }: { children: ReactNode }) => {
    const logged = useSelector((s: RootState) => s.user.logged);
    if(!logged){
        return <Navigate to="/auth/login" replace />;
    }
    return children;
};
