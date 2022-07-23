import React, { Component } from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import { withStyles } from "@material-ui/core/styles";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    TextField,
    Tooltip,
    Typography,
} from "@material-ui/core";
import { Add } from "@material-ui/icons";

const styles = (theme) => ({
    container: {
        alignItems: "flex-end",
        float: "right",
        height: "calc(100vh - 100px)",
        padding: "25px",
        right: "0",
        boxSizing: "border-box",
        overflowY: "scroll",
        top: "50px",
        width: "calc(100% - 350px)",
        position: "absolute",
    },

    userSent: {
        alignItems: "flex-end",
        paddingRight: "20px",
        float: "right",
        clear: "both",
        padding: "20px",
        boxSizing: "border-box",
        wordWrap: "break-word",
        marginTop: "10px",
        backgroundColor: "#707BC4",
        color: "white",
        width: "auto",
        maxWidth: "300px",
        borderRadius: "10px",
        ["@media(max-width:700px)"]: {
            width: "auto",
            maxWidth: "calc(100% - 50px)",
        },
        ["@media(max-width:550px)"]: {
            display: "none",
        },
    },

    friendSent: {
        alignItems: "flex-end",
        paddingRight: "20px",
        float: "left",
        clear: "both",
        padding: "20px",
        boxSizing: "border-box",
        wordWrap: "break-word",
        marginTop: "10px",
        backgroundColor: "#707BC4",
        color: "white",
        width: "auto",
        maxWidth: "300px",
        borderRadius: "10px",
        ["@media(max-width:700px)"]: {
            width: "auto",
            maxWidth: "calc(100% - 50px)",
        },
        ["@media(max-width:550px)"]: {
            display: "none",
        },
    },

    inviteNotif: {
        height: "35px",
        alignItems: "flex-center",
        marginLeft: "auto",
        clear: "both",
        marginTop: "10px",
        marginRight: "auto",
        boxSizing: "border-box",
        paddingLeft: "10px",
        textAlign: "center",
        wordWrap: "break-word",
        backgroundColor: "grey",
        color: "white",
        width: "auto",
        maxWidth: "300px",
        borderRadius: "10px",
        ["@media(max-width:700px)"]: {
            width: "auto",
            maxWidth: "calc(100% - 50px)",
        },
        ["@media(max-width:550px)"]: {
            display: "none",
        },
    },

    chatHeader: {
        alignItems: "flex-end",
        right: "0",
        height: "50px",
        backgroundColor: "#344195",
        width: "calc(100% - 350px)",
        position: "absolute",
        marginLeft: "301px",
        fontSize: "18px",
        textAlign: "center",
        color: "white",
        paddingTop: "10px",
        boxSizing: "border-box",
        ["@media(max-width:550px)"]: {
            display: "none",
        },
    },
});

class Chatroom extends Component {
    constructor() {
        super();
        this.state = {
            email: null,
            open: false,
        };
    }
    componentDidMount = () => {
        const container = document.getElementById("chatroomContainer");
        if (container) {
            container.scrollTo(0, container.scrollHeight);
        }
    };
    componentDidUpdate = () => {
        const container = document.getElementById("chatroomContainer");
        if (container) {
            container.scrollTo(0, container.scrollHeight);
        }
    };

    isUserMember = (userID) => {
        for (var i = 0; i < this.props.chatroom.userList.length; i++) {
            console.log("index ", i);
            if (this.props.chatroom.userList[i].userID === userID) {
                console.log(
                    this.props.chatroom.userList[i].userID,
                    " ",
                    userID
                );
                return true;
            }
        }
        return false;
    };

    handleOnClick = () => {
        this.setState({
            open: true,
        });
    };

    handleOnClose = () => {
        this.setState({
            open: false,
        });
    };

    handleInvite = () => {
        this.handleOnClose();
        this.inviteMember(this.state.email);
        this.setState({
            open: false,
        });
    };

    handleTyping = (e, type) => {
        if (e.keyCode === 13) {
            this.handleInvite();
        } else {
            this.setState({
                email: e.target.value,
            });
        }
    };

    inviteMember = async (e) => {
        e.preventDefault;
        console.log("invite ", this.state.email);
        var friendData = await this.props.userExist(this.state.email);
        if (friendData !== "") {
            var flag = await this.isUserMember(friendData.userID);
            if (flag === false) {
                await this.props.addMember(
                    friendData.userID,
                    this.props.chatroomNumber,
                    this.props.chatroom.roomID
                );
                await this.props.updateMessage(
                    this.props.chatroom.roomID,
                    friendData.displayName + " has joined the Chatroom",
                    "invite"
                );
            } else {
                alert("User already in the Chatroom");
            }
        } else {
            alert("User doen't exist");
        }
    };

    render() {
        const {
            classes,
            chatroom,
            userID,
            getUserData,
            getUserDisplayName,
            getUserProfilePicture,
        } = this.props;
        if (chatroom.messages.length > 0) {
            return (
                <div>
                    <ListItem
                        className={classes.chatHeader}
                        // className={classes.listItem}
                        alignItems="flex-start"
                    >
                        <ListItemAvatar className={classes.friendPhoto}>
                            <Avatar
                                alt="Avatar"
                                src={
                                    chatroom.userList.length === 2
                                        ? chatroom.userList[0].userID === userID
                                            ? getUserProfilePicture(
                                                  chatroom.userList[1].userID
                                              )
                                            : getUserProfilePicture(
                                                  chatroom.userList[0].userID
                                              )
                                        : ""
                                }
                            ></Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            className={classes.friendName}
                            primary={
                                chatroom.userList.length === 2
                                    ? chatroom.userList[0].userID === userID
                                        ? getUserDisplayName(
                                              chatroom.userList[1].userID
                                          )
                                        : getUserDisplayName(
                                              chatroom.userList[0].userID
                                          )
                                    : chatroom.chatroomName
                            }
                        ></ListItemText>
                        <Button onClick={this.handleOnClick}>
                            <Add />
                        </Button>
                        <Dialog
                            open={this.state.open}
                            onClose={this.handleOnClose}
                        >
                            <DialogTitle>Invite New Member</DialogTitle>
                            <DialogContent>
                                <form onSubmit={(e) => this.handleInvite()}>
                                    <TextField
                                        required={
                                            chatroom.chatroomName === ""
                                                ? true
                                                : false
                                        }
                                        autoFocus
                                        fullWidth
                                        type="text"
                                        onKeyUp={(e) =>
                                            this.handleTyping(e, "chatroomName")
                                        }
                                        id="ChatroomName"
                                        placeholder="Enter Chatroom Name..."
                                    />
                                    <TextField
                                        autoFocus
                                        fullWidth
                                        type="email"
                                        onKeyUp={(e) =>
                                            this.handleTyping(e, "email")
                                        }
                                        id="emailInputField"
                                        placeholder="Enter your friend email..."
                                    />
                                </form>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={this.handleOnClose}>
                                    Cancel
                                </Button>
                                <Button onClick={this.handleInvite}>
                                    Invite
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </ListItem>
                    <main className={classes.container} id="chatroomContainer">
                        {chatroom.messages.map((_msg, _index) => {
                            return (
                                <div
                                    key={_index}
                                    className={
                                        _msg.invite
                                            ? classes.inviteNotif
                                            : _msg.sender === userID
                                            ? classes.userSent
                                            : classes.friendSent
                                    }
                                >
                                    {_msg.chatMessage}
                                </div>
                            );
                        })}
                    </main>
                </div>
            );
        } else {
            return (
                <div>
                    {/* <div className={classes.chatHeader}>
                        {chatroom.userList.length === 2
                            ? chatroom.userList[0].useriD === userID
                                ? getUserDisplayName(chatroom.userList[1].userID)
                                : getUserDisplayName(chatroom.userList[0].userID)
                            : chatroom.chatroomName}
                    </div> */}
                    <ListItem
                        className={classes.chatHeader}
                        // className={classes.listItem}
                        alignItems="flex-start"
                    >
                        <ListItemAvatar className={classes.friendPhoto}>
                            <Avatar
                                alt="Avatar"
                                src={
                                    chatroom.userList.length === 2
                                        ? chatroom.userList[0].userID === userID
                                            ? getUserProfilePicture(
                                                  chatroom.userList[1].userID
                                              )
                                            : getUserProfilePicture(
                                                  chatroom.userList[0].userID
                                              )
                                        : ""
                                }
                            ></Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            className={classes.friendName}
                            primary={
                                chatroom.userList.length === 2
                                    ? chatroom.userList[0].userID === userID
                                        ? getUserDisplayName(
                                              chatroom.userList[1].userID
                                          )
                                        : getUserDisplayName(
                                              chatroom.userList[0].userID
                                          )
                                    : chatroom.chatroomName
                            }
                        ></ListItemText>
                        <Button onClick={this.handleOnClick}>
                            <Add />
                        </Button>
                        <Dialog
                            open={this.state.open}
                            onClose={this.handleOnClose}
                        >
                            <DialogTitle>Invite New Member</DialogTitle>
                            <DialogContent>
                                <form onSubmit={(e) => this.handleInvite(e)}>
                                    <TextField
                                        required={
                                            chatroom.chatroomName === ""
                                                ? true
                                                : false
                                        }
                                        autoFocus
                                        fullWidth
                                        type="text"
                                        onKeyUp={(e) =>
                                            this.handleTyping(e, "chatroomName")
                                        }
                                        id="ChatroomName"
                                        placeholder="Enter Chatroom Name..."
                                    />
                                    <TextField
                                        required
                                        autoFocus
                                        fullWidth
                                        type="email"
                                        onKeyUp={(e) =>
                                            this.handleTyping(e, "email")
                                        }
                                        id="emailInputField"
                                        placeholder="Enter your friend email..."
                                    />
                                </form>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={this.handleOnClose}>
                                    Cancel
                                </Button>
                                <Button onClick={(e) => this.handleInvite(e)}>
                                    Invite
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </ListItem>
                    <main
                        className={classes.container}
                        id="chatroomContainer"
                    ></main>
                </div>
            );
        }
    }
}

export default withStyles(styles)(Chatroom);
