import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";
import Send from "@material-ui/icons/Send";
import { withStyles } from "@material-ui/core/styles";

const styles = (theme) => ({
    sendBtn: {
        color: "blue",
        cursor: "pointer",
        "&:hover": {
            color: "gray",
        },
        ["@media(max-width:550px)"]: {
            display: "none",
        },
    },

    chatTextBoxContainer: {
        position: "absolute",
        bottom: "15px",
        right: "15px",
        boxSizing: "border-box",
        overflow: "auto",
        width: "calc(100% - 390px)",
        ["@media(max-width:550px)"]: {
            display: "none",
        },
    },

    chatTextBox: {
        width: "calc(100% - 25px)",
    },
});

class ChattingField extends Component {
    constructor() {
        super();
        this.state = {
            messageRef: "",
        };
    }

    handleTyping = (e) => {
        if (e.keyCode === 13) {
            this.handleSubmit();
        } else {
            this.setState({
                messageRef: e.target.value,
            });
        }
    };

    handleClick = () => {
        this.props.whoReadMessage();
    };

    handleSubmit = () => {
        if (this.isValid(this.state.messageRef)) {
            this.props.updateMessage(this.props.roomID, this.state.messageRef, "message");
            document.getElementById("textingField").value = "";
        }
    };

    isValid = (val) => {
        return val && val.replace(/\s/g, "").length;
    };

    render() {
        const { classes, updateMessage } = this.props;
        return (
            <div className={classes.chatTextBoxContainer} >
                <TextField
                    id="textingField"
                    placeholder="Message..."
                    onKeyUp={(e) => this.handleTyping(e)}
                    className={classes.chatTextBox}
                    onFocus={this.handleClick}
                ></TextField>
                <Send onClick={this.handleSubmit}></Send>
            </div>
        );
    }
}

export default withStyles(styles)(ChattingField);
