import React, { Component, useState } from "react";
import { Card, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import Chatroom from "./chatroom";
import ChatList from "./chatlist";
import ChattingField from "./chattingfield";
import NewChatroom from "./newchatroom";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import { Button, withStyles } from "@material-ui/core";
import { chatroomDatabase, auth, db, userDatabase } from "../../config";
import { ref, onValue, set } from "firebase/database";
import { setPersistence } from "firebase/auth";

const styles = (theme) => ({
    signOutBtn: {
        position: "absolute",
        bottom: "0px",
        left: "0px",
        width: "350px",
        minWidth: "300px",
        borderRadius: "0px",
        backgroundColor: "#227092",
        height: "50px",
        boxShadow: "0px 0px 2px black",
        color: "white",
        ["@media(max-width:550px)"]: {
            width: "100%",
        },
    },
});

class Dashboard extends Component {
    constructor() {
        super();
        this.state = {
            selectedChat: null,
            chatroomVisible: false,
            friend: null,
            chatroomLists: [],
            messageCount: 0,
        };
    }

    componentDidMount(prevProps) {
        if (!window.location.hash) {
            window.location = window.location + "#loaded";
            window.location.reload();
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.chatroomLists.length === 0) {
            return;
        }
        for (var i = 0; i < this.props.chatroomLists.length; i++) {
            if (this.props.chatroomLists[i].messages.length === 0) {
                return;
            }
            if (
                this.props.chatroomLists[i].messages.length !==
                    prevProps.chatroomLists[i].messages.length &&
                !this.props.chatroomLists[i].messages[
                    this.props.chatroomLists[i].messages.length - 1
                ].read
            ) {
                var flag = false;
                for (
                    var j = 0;
                    j < this.props.chatroomLists[i].userList.length;
                    j++
                ) {
                    if (
                        this.props.chatroomLists[i].userList[j].userID ===
                        this.props.currentUser.uid
                    ) {
                        flag = true;
                        break;
                    }
                }
                if (flag) {
                    if (
                        this.isCurrentUserReceiver(
                            this.props.chatroomLists[i].messages[
                                this.props.chatroomLists[i].messages.length - 1
                            ].sender
                        )
                    ) {
                        this.handleNotification();
                    }
                }
            }
        }
    }

    isCurrentUserReceiver = (sender) => {
        if (sender !== this.props.currentUser.uid) {
            return true;
        } else {
            return false;
        }
    };

    goChatroom = (roomIndex) => {
        if (roomIndex !== "newest") {
            this.setState({
                selectedChat: roomIndex,
                chatroomVisible: true,
            });
        } else {
            this.setState({
                selectedChat: this.props.chatroomLists.length - 1,
                chatroomVisible: true,
            });
        }
    };

    isRoomExist = (friendID) => {
        for (var i = 0; i < this.props.chatroomLists.length; i++) {
            if (this.props.chatroomLists[i].userList.length === 2) {
                if (
                    (this.props.chatroomLists[i].userList[0].userID ===
                        friendID &&
                        this.props.chatroomLists[i].userList[1].userID ===
                            this.props.currentUser.uid) ||
                    (this.props.chatroomLists[i].userList[1].userID ===
                        friendID &&
                        this.props.chatroomLists[i].userList[0].userID ===
                            this.props.currentUser.uid)
                ) {
                    return i;
                }
            }
        }
        return null;
    };

    getUserDisplayName = (userID) => {
        var data = this.getUserData("userID", userID);
        if (data === "") {
            return "unknown";
        } else {
            return data.displayName;
        }
    };

    userExist = (email) => {
        return this.getUserData("email", email);
    };

    getUserProfilePicture = (userID) => {
        var data = this.getUserData("userID", userID);
        if (data === "") {
            return "";
        } else {
            return data.profilePicture;
        }
    };

    selectChat = async (chatroomIndex) => {
        await this.setState({
            selectedChat: chatroomIndex,
            chatroomVisible: true,
        });
        this.whoReadMessage();
    };

    handleNewChatroom = () => {
        this.setState({
            chatroomVisible: true,
            selectedChat: null,
        });
    };

    getUserData = (type, data) => {
        var userData = "";
        switch (type) {
            case "userID":
                this.props.userDataLists.forEach((snapshot) => {
                    if (snapshot.userID === data) {
                        userData = snapshot;
                    }
                });
                break;
            case "email":
                this.props.userDataLists.forEach((snapshot) => {
                    if (snapshot.email === data) {
                        userData = snapshot;
                    }
                });
                break;
            default:
                break;
        }
        return userData;
    };

    chatroomTitle = (userID, index) => {
        if (this.props.chatroomLists[index].chatroomName === "") {
            var unknown = "unknown";
            var friendID =
                this.props.chatroomLists[index].userList[0].userID === userID
                    ? this.props.chatroomLists[index].userList[1].userID
                    : this.props.chatroomLists[index].userList[0].userID;
            const abc = this.getUserData(friendID);
            return unknown;
        } else {
            return this.props.chatroomLists[index].chatroomName;
        }
    };

    // handleNotification = () => {
    //     // if (
    //     //     this.props.chatroomLists[this.state.selectedChat].messages[
    //     //         this.props.chatroomLists[this.state.selectedChat].messages
    //     //             .length - 1
    //     //     ].sender !== this.props.currentUser.uid
    //     // ) {

    //         this.props.enqueueSnackbar("New Message");
    //         // this.props.enqueueSnackbar(
    //         //     this.props.chatroomLists[this.state.selectedChat].messages[
    //         //         this.props.chatroomLists[this.state.selectedChat].messages.length - 1
    //         //     ].chatMessage
    //         // );
    //         this.setState({
    //             messageCount: this.state.messageCount + 1,
    //         })

    //     // } else {
    //     //     console.log("you are sender! NO NOTIF");
    //     // }
    // };

    handleNotification = () => {
        if (Notification.permission === "granted") {
            const notif = new Notification("New message!");
        } else if (Notification.permission !== "denied") {
            Notification.requestPermission().then((permission) => {
                if (permission === "granted") {
                    const notif = new Notification("New message!");
                }
            });
        } else {
            console.log("notification permission denied");
        }
    };

    whoReadMessage = () => {
        if (this.props.chatroomLists.length === 0) {
            return;
        }
        if (
            this.props.chatroomLists[this.state.selectedChat].messages
                .length === 0
        ) {
            return;
        }
        if (
            this.props.chatroomLists[this.state.selectedChat].messages[
                this.props.chatroomLists[this.state.selectedChat].messages
                    .length - 1
            ].read === false &&
            this.props.chatroomLists[this.state.selectedChat].messages[
                this.props.chatroomLists[this.state.selectedChat].messages
                    .length - 1
            ].sender !== this.props.currentUser.uid
        ) {
            this.props.updateHasRead(
                this.state.selectedChat,
                // this.state.messageCount,
                1,
                this.props.chatroomLists[this.state.selectedChat].roomID
            );
            // console.log("MESSAGE COUNT ", this.state.messageCount);
            this.setState({
                messageCount: 0,
            });
        }
    };

    render() {
        const {
            classes,
            logout,
            currentUser,
            updateMessage,
            userDataLists,
            chatroomLists,
            createChatroom,
            enqueueSnackbar,
            addMember,
        } = this.props;
        if (this.state.loading === true) {
            return null;
        } else
            return (
                <main className={classes.bigContainer}>
                    <ChatList
                        handleNewChatroom={this.handleNewChatroom}
                        selectChat={this.selectChat}
                        email={currentUser.email}
                        userID={currentUser.uid}
                        chatroomLists={chatroomLists}
                        chatroomTitle={this.chatroomTitle}
                        selectedChatroomIndex={this.state.selectedChat}
                        getUserData={this.getUserData}
                        getUserDisplayName={this.getUserDisplayName}
                        getUserProfilePicture={this.getUserProfilePicture}
                        handleNotification={this.handleNotification}
                        isCurrentUserReceiver={this.isCurrentUserReceiver}
                    ></ChatList>
                    <Button className={classes.signOutBtn} onClick={logout}>
                        Log Out
                    </Button>
                    {this.state.chatroomVisible &&
                    this.state.selectedChat !== null ? (
                        <>
                            <Chatroom
                                userID={currentUser.uid}
                                chatroom={
                                    chatroomLists[this.state.selectedChat]
                                }
                                addMember={addMember}
                                updateMessage={updateMessage}
                                chatroomLists={chatroomLists}
                                chatroomTitle={this.chatroomTitle}
                                getUserData={this.getUserData}
                                getUserDisplayName={this.getUserDisplayName}
                                getUserProfilePicture={
                                    this.getUserProfilePicture
                                }
                                userExist={this.userExist}
                                chatroomNumber={this.state.selectedChat}
                            ></Chatroom>
                            <ChattingField
                                updateMessage={updateMessage}
                                roomID={
                                    chatroomLists[this.state.selectedChat]
                                        .roomID
                                }
                                chatroomLists={chatroomLists}
                                whoReadMessage={this.whoReadMessage}
                            ></ChattingField>
                        </>
                    ) : this.state.chatroomVisible &&
                      this.state.selectedChat === null ? (
                        <NewChatroom
                            userID={currentUser.uid}
                            getUserData={this.getUserData}
                            userExist={this.userExist}
                            createChatroom={createChatroom}
                            isRoomExist={this.isRoomExist}
                            goChatroom={this.goChatroom}
                        ></NewChatroom>
                    ) : null}
                </main>
            );
    }
}

export default withStyles(styles)(Dashboard);

// componentDidMount() {
//     if (!window.location.hash) {
//         window.location = window.location + "#loaded";
//         window.location.reload();
//     }
//     else {
//         this.setState({
//             loading: true,
//         })
//         setTimeout(() => {
//             this.setState({
//                 chatroomLists: this.props.chatroomLists,
//             });
//         }, 2000);
//         this.setState({
//             loading: false,
//         })
//     }
// }

// componentDidUpdate() {
//     console.log(
//         "component did update dashboard",
//         this.props.chatroomLists,
//         this.state.chatroomLists
//     );
// }

// static getDerivedStateFromProps = (props, state) => {
//     if (props.chatroomLists.length !== state.chatroomLists.length) {
//         return {
//             chatroomLists: props.chatroomLists,
//         };
//     } else {
//         for (var i = 0; i < props.chatroomLists.length; i++) {
//             if (
//                 props.chatroomLists[i].chatroomName !==
//                 state.chatroomLists[i].chatroomName
//             ) {
//                 return {
//                     chatroomLists: props.chatroomLists,
//                 };
//             }

//             if (
//                 props.chatroomLists[i].messages.length !==
//                 state.chatroomLists[i].messages.length
//             ) {
//                 return {
//                     chatroomLists: props.chatroomLists,
//                 };
//             }

//             if (
//                 props.chatroomLists[i].userList.length !==
//                 state.chatroomLists[i].userList.length
//             ) {
//                 return {
//                     chatroomLists: props.chatroomLists,
//                 };
//             }
//         }
//     }
//     return {
//         chatroomLists: props.chatroomLists,
//     };
// };
