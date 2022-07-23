import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/authContext";

export default () => {
    const { currentUser } = useAuth();
    return currentUser ? <Outlet/> : <Navigate replace to="/login" />;
};
