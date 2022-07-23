import React, { Component, useRef, useState } from "react";
import { Container } from "react-bootstrap";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./signup";
import Login from "./login";
import Dashboard from "./dashboard";
import { useAuth, AuthProvider } from "../contexts/authContext";
import PrivateRoute from "./privateroute";
import ForgotPassword from "./forgotpassword";
import UpdateProfile from "./updateprofile";
import { useSnackbar } from 'notistack';

export default () => {
    const {
        login,
        signUp,
        logout,
        currentUser,
        chatroomLists,
        accountCreated,
        updateName,
        userDataLists,
        updateMessage,
        updatePP,
        createChatroom,
        resetPassword,
        updateHasRead,
        addMember,
        changeEmail,
        changePassword,
    } = useAuth();
    const { enqueueSnackbar } = useSnackbar();
    return (
        <Router>
            {/* <AuthProvider> */}
            <Routes>
                <Route element={<PrivateRoute />}>
                    <Route
                        path="/"
                        element={
                            <Dashboard
                                currentUser={currentUser}
                                chatroomLists={chatroomLists}
                                logout={logout}
                                userDataLists={userDataLists}
                                updateMessage={updateMessage}
                                createChatroom={createChatroom}
                                enqueueSnackbar={enqueueSnackbar}
                                updateHasRead={updateHasRead}
                                addMember={addMember}
                            />
                        }
                    />
                    <Route
                        path="/dashboard"
                        element={
                            <Dashboard
                                currentUser={currentUser}
                                chatroomLists={chatroomLists}
                                logout={logout}
                                userDataLists={userDataLists}
                                updateMessage={updateMessage}
                                createChatroom={createChatroom}
                                enqueueSnackbar={enqueueSnackbar}
                                updateHasRead={updateHasRead}
                                addMember={addMember}
                            />
                        }
                    />
                    <Route path="/update-profile" element={<UpdateProfile currentUser={currentUser} changeEmail={changeEmail} changePassword={changePassword} updateName={updateName} updatePP={updatePP}/>} />
                </Route>
                <Route path="*" element={<Login login={login} accountCreated={accountCreated}/>} />
                <Route path="/login" element={<Login login={login} accountCreated={accountCreated}/>} />
                <Route
                    path="/signup"
                    element={
                        <SignUp
                            signUp={signUp}
                            accountCreated={accountCreated}
                            updateName={updateName}
                        />
                    }
                />
                <Route path="/forgot-password" element={<ForgotPassword resetPassword={resetPassword}/>} />
            </Routes>
            {/* </AuthProvider> */}
        </Router>
    );
};
