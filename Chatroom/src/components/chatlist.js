import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import NotificationsActiveIcon from "@material-ui/icons/NotificationsActive";

const styles = (theme) => ({
    container: {
        flexDirection: "column",
        display: "inline",
        backgroundColor: "",
        height: "calc(100% - 51px)",
        position: "absolute",
        left: "0",
        minWidth: "300px",
        width: "350px",
        boxShadow: "0px 0px 2px black",
        borderRight: "1px",
        ["@media(max-width:550px)"]: {
            width: "100%",
        },
    },
    listItem: {
        cursor: "pointer",
    },
    newChatBtn: {
        borderRadius: "0px",
        height: "50px",
    },
    unreadMessage: {
        color: "green",
        position: "absolute",
    },
});

class ChatList extends Component {
    render() {
        const {
            classes,
            chatroomLists,
            userID,
            getUserData,
            getUserDisplayName,
            getUserProfilePicture,
            handleNotification,
            isCurrentUserReceiver,
        } = this.props;
        if (chatroomLists.length > 0) {
            return (
                <main className={classes.container}>
                    <Button
                        variant="contained"
                        fullWidth
                        color="primary"
                        className={classes.newChatBtn}
                        onClick={this.props.handleNewChatroom}
                    >
                        New Chatroom
                    </Button>
                    <List>
                        {chatroomLists.map((_chat, _index) => {
                            {
                                let flag = false;
                                for (
                                    var i = 0;
                                    i < _chat.userList.length;
                                    i++
                                ) {
                                    if (_chat.userList[i].userID === userID) {
                                        flag = true;
                                    }
                                }
                                if (flag === false) {
                                    return null;
                                }
                            }
                            return (
                                <div key={_index}>
                                    <ListItem
                                        onClick={() =>
                                            this.props.selectChat(_index)
                                        }
                                        className={classes.listItem}
                                        selected={
                                            this.props.selectedChatroomIndex ===
                                            _index
                                        }
                                        alignItems="flex-start"
                                    >
                                        <ListItemAvatar>
                                            <Avatar
                                                alt="Avatar"
                                                src={
                                                    _chat.userList.length === 2
                                                        ? _chat.userList[0].userID ===
                                                          userID
                                                            ? getUserProfilePicture(
                                                                  _chat
                                                                      .userList[1].userID
                                                              )
                                                            : getUserProfilePicture(
                                                                  _chat
                                                                      .userList[0].userID
                                                              )
                                                        : _chat.chatroomName
                                                }
                                            ></Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={
                                                _chat.userList.length === 2
                                                    ? _chat.userList[0].userID ===
                                                      userID
                                                        ? getUserDisplayName(
                                                              _chat.userList[1].userID
                                                          )
                                                        : getUserDisplayName(
                                                              _chat.userList[0].userID
                                                          )
                                                    : _chat.chatroomName
                                            }
                                            secondary={
                                                <React.Fragment>
                                                    <Typography
                                                        component="span"
                                                        color="textPrimary"
                                                        overflow="hidden"
                                                    >
                                                        {_chat.messages.length >
                                                        0
                                                            ? _chat.messages[
                                                                  _chat.messages
                                                                      .length -
                                                                      1
                                                              ].chatMessage.substring(
                                                                  0,
                                                                  30
                                                              )
                                                            : ""}
                                                    </Typography>
                                                </React.Fragment>
                                            }
                                        ></ListItemText>
                                        {_chat.messages.length > 0 &&
                                        _chat.messages[
                                            _chat.messages.length - 1
                                        ].read === false &&
                                        isCurrentUserReceiver(
                                            _chat.messages[
                                                _chat.messages.length - 1
                                            ].sender
                                        ) ? (
                                            <ListItemIcon>
                                                <NotificationsActiveIcon
                                                    className={
                                                        classes.unreadMessage
                                                    }
                                                ></NotificationsActiveIcon>
                                            </ListItemIcon>
                                        ) : null}
                                    </ListItem>
                                    <Divider></Divider>
                                </div>
                            );
                        })}
                    </List>
                </main>
            );
        } else {
            return (
                <main className={classes.container}>
                    <Button
                        variant="contained"
                        fullWidth
                        color="primary"
                        className={classes.newChatBtn}
                        onClick={this.props.handleNewChatroom}
                    >
                        NEW CHATROOM
                    </Button>
                </main>
            );
        }
    }
}

export default withStyles(styles)(ChatList);
