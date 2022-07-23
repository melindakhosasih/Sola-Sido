import React, { useContext, useEffect, useState } from "react";
import {
    createUserWithEmailAndPassword,
    getAuth,
    getRedirectResult,
    GoogleAuthProvider,
    onAuthStateChanged,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signInWithRedirect,
    signOut,
    updateCurrentUser,
    updateEmail,
    updatePassword,
    updateProfile,
} from "firebase/auth";
import {
    getDatabase,
    ref,
    onValue,
    push,
    set,
    child,
    DataSnapshot,
    onChildAdded,
    update,
    get,
} from "firebase/database";
import {
    auth,
    chatroomDatabase,
    userDatabase,
    db,
    chatroomKey,
} from "../../config";
import SignUp from "../components/signup";
import { doc } from "firebase/firestore";
import { useDatabase } from "./databaseContext";
import { Alarm, ContactlessOutlined } from "@material-ui/icons";

const authContext = React.createContext();

export function useAuth() {
    return useContext(authContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState();
    const [loading, setLoading] = useState(true);
    const [chatroomLists, setChatroomLists] = useState([]);
    const [userDataLists, setUserDataLists] = useState([]);
    const value = {
        currentUser,
        chatroomLists,
        userDataLists,
        signUp,
        login,
        logout,
        resetPassword,
        changeEmail,
        changePassword,
        updateName,
        updatePP,
        accountCreated,
        updateMessage,
        createChatroom,
        updateHasRead,
        addMember,
    };

    function updateMessage(roomID, msg, type) {
        setLoading(true);
        var flag = type === "invite" ? true : false;
        onValue(
            chatroomDatabase,
            (snapshot) => {
                snapshot.forEach((dataSnapshot) => {
                    if (dataSnapshot.key === roomID) {
                        var push_data = {
                            chatMessage: msg,
                            invite: flag,
                            sender: auth.currentUser.uid,
                            read: false,
                        };
                        update(
                            ref(
                                db,
                                "chatroom/" +
                                    roomID +
                                    "/messages/" +
                                    dataSnapshot.val().messages.length
                            ),
                            push_data
                        );
                        databaseUpdate();
                        setLoading(false);
                    }
                });
            },
            {
                onlyOnce: true,
            }
        );
        console.log("MessageUpdated");
    }

    function addMember(userID, index, roomID) {
        setLoading(true);
        var push_data = {
            userID: userID,
        };
        console.log("check index", value.chatroomLists[index].userList.length);
        update(
            ref(
                db,
                "chatroom/" +
                    roomID +
                    "/userList/" +
                    value.chatroomLists[index].userList.length
            ),
            push_data
        );
        databaseUpdate();
        setLoading(false);
    }

    function updateHasRead(index, len, roomID) {
        setLoading(true);
        var push_data = {
            read: true,
        };
        for (
            var i = value.chatroomLists[index].messages.length - len;
            i < value.chatroomLists[index].messages.length;
            i++
        ) {
            update(
                ref(db, "chatroom/" + roomID + "/messages/" + i + "/"),
                push_data
            );
            databaseUpdate();
        }
        setLoading(false);
    }

    function createChatroom(friendID) {
        var roomID = push(chatroomDatabase).key;
        setLoading(true);
        var room_data = {
            chatroomName: "",
            messages: "",
            roomID: roomID,
            userList: [{ userID: friendID }, { userID: auth.currentUser.uid }],
        };
        var updates = {};
        updates["/chatroom/" + roomID] = room_data;
        update(ref(db), updates);
        databaseUpdate();
        setLoading(false);
        console.log("chatroomCreated");
    }

    function accountCreated() {
        var photoURL = "";
        if (auth.currentUser.photoURL != null) {
            photoURL = auth.currentUser.photoURL;
        }
        const post_data = {
            displayName: auth.currentUser.displayName,
            email: auth.currentUser.email,
            profilePicture: photoURL,
            userID: auth.currentUser.uid,
        };
        const updates = {};
        updates["/userData/" + auth.currentUser.uid] = post_data;
        update(ref(db), updates);
        console.log("accountCreated");
    }

    function signUp(email, password) {
        return createUserWithEmailAndPassword(auth, email, password);
    }

    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password);
    }

    function logout() {
        return signOut(auth);
    }

    function resetPassword(email) {
        return sendPasswordResetEmail(auth, email);
    }

    function changeEmail(email) {
        onValue(userDatabase, (snapShot) => {
            snapShot.forEach((dataSnapshot) => {
                if (dataSnapshot.val().userID === auth.currentUser.uid) {
                    update(ref(db, "userData/" + dataSnapshot.key), {
                        displayName: displayName,
                        email: email,
                        profilePicture: (auth.currentUser.photoURL !== null) ? auth.currentUser.photoURL : "",
                        userID: auth.currentUser.uid,
                    });
                }
            });
        });
        return updateEmail(auth.currentUser, email);
    }

    function changePassword(password) {
        return updatePassword(auth.currentUser, password);
    }

    function updateName(displayName) {
            onValue(userDatabase, (snapShot) => {
                snapShot.forEach((dataSnapshot) => {
                    if (dataSnapshot.val().userID === auth.currentUser.uid) {
                        update(ref(db, "userData/" + dataSnapshot.key), {
                            displayName: displayName,
                            email: auth.currentUser.email,
                            profilePicture: (auth.currentUser.photoURL !== null) ? auth.currentUser.photoURL : "",
                            userID: auth.currentUser.uid,
                        });
                    }
                });
            });
        return updateProfile(auth.currentUser, { displayName: displayName });
    }

    function updatePP(photoURL) {
        onValue(userDatabase, (snapShot) => {
            snapShot.forEach((dataSnapshot) => {
                if (dataSnapshot.val().userID === auth.currentUser.uid) {
                    update(ref(db, "userData/" + dataSnapshot.key), {
                        displayName: displayName,
                        email: auth.currentUser.email,
                        profilePicture: photoURL,
                        userID: auth.currentUser.uid,
                    });
                }
            });
        });
        return updateProfile(auth.currentUser, { photoURL: photoURL });
    }

    function databaseUpdate() {
        setLoading(true);
        onValue(
            chatroomDatabase,
            (snapShot) => {
                const chatroom = [];
                snapShot.forEach((dataSnapshot) => {
                    chatroom.push(dataSnapshot.val());
                });
                setChatroomLists(chatroom);
                setLoading(false);
            },
            [chatroomDatabase]
        );
    }

    useEffect(() => {
        setLoading(true);
        onAuthStateChanged(auth, (user) => {
            const chatroom = [];
            const userList = [];
            onValue(userDatabase, (snapShot) => {
                snapShot.forEach((dataSnapshot) => {
                    userList.push(dataSnapshot.val());
                });
            });
            onValue(chatroomDatabase, (snapShot) => {
                snapShot.forEach((dataSnapshot) => {
                    chatroom.push(dataSnapshot.val());
                });
            });
            setChatroomLists(chatroom);
            setUserDataLists(userList);
            setCurrentUser(user);
            setLoading(false);
        });
    }, [auth]);

    useEffect(() => {
        setLoading(true);
        onValue(chatroomDatabase, (snapShot) => {
            const chatroom = [];
            snapShot.forEach((dataSnapshot) => {
                chatroom.push(dataSnapshot.val());
            });
            setChatroomLists(chatroom);
            setLoading(false);
        });
    }, [chatroomDatabase]);

    useEffect(() => {
        setLoading(true);
        onValue(userDatabase, (snapShot) => {
            const userList = [];
            snapShot.forEach((dataSnapshot) => {
                userList.push(dataSnapshot.val());
            });
            setUserDataLists(userList);
            setLoading(false);
        });
    }, [userDatabase]);

    return (
        <authContext.Provider value={value}>
            {!loading && children}
        </authContext.Provider>
    );
}
