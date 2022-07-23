import React, { Component, isValidElement } from "react";
import {
    FormControl,
    InputLabel,
    Input,
    Button,
    Paper,
    withStyles,
    CssBaseline,
    Typography,
} from "@material-ui/core";

const styles = (theme) => ({
    main: {
        display: "block", // Fix IE 11 issue.
        width: 400,
        margin: "auto",
    },
    paper: {
        width: 400,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        verticalAlign: "middle",
        position: "absolute",
        top: "50%",
        left: "45%",
        transform: "translateY(-50%)",
        padding: theme.spacing(4),
    },
    title: {
        fontSize: 30,
    },
    submit: {
        marginTop: theme.spacing(3),
    },
    error: {
        width: "100%",
        display: "block",
        height: "auto",
        margin: "auto",
        color: "red",
        textAlign: "center",
        overflow: "hidden",
        vertical: "top",
        horizontal: "center",
    },
});

class NewChatroom extends Component {
    constructor() {
        super();
        this.state = {
            email: null,
            message: null
        }
    }

    handleTyping = (e) => {
        this.setState({
            email: e.target.value
        })
    };

    handleSubmit = async (e) => {
        e.preventDefault();
        var friendData = await this.props.userExist(this.state.email);
        if(friendData.userID === this.props.userID) {
            alert("Can't Add Yourself");
            document.getElementById("newChatroomUser").value = "";
            this.setState({
                email: ""
            })
            return;
        }
        if(friendData !== "") {
            var flag = await this.props.isRoomExist(friendData.userID);
            if(!flag) {
                await this.props.createChatroom(friendData.userID);
                this.props.goChatroom("newest");
            } else {
                this.props.goChatroom(flag);
            }
        } else {
            alert("User doesn't exist");
            document.getElementById("newChatroomUser").value = "";
            this.setState({
                email: ""
            })
        }
    }

    render() {
        const { classes } = this.props;
        return (
            <main className={classes.main}>
                <CssBaseline></CssBaseline>
                <Paper className={classes.paper}>
                    <Typography className={classes.title}>
                        Add New Friend
                    </Typography>
                    <form
                        className={classes.form}
                        onSubmit={(e) => this.handleSubmit(e)}
                    >
                        <FormControl required fullWidth>
                            <InputLabel htmlFor="newChatroomUser">
                                Enter Your Friend's Email
                            </InputLabel>
                            <Input
                                className={classes.input}
                                autoComplete="email"
                                autoFocus
                                onChange={(e) => this.handleTyping(e)}
                                id="newChatroomUser"
                            ></Input>
                        </FormControl>
                        <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                            >
                                Add
                            </Button>
                    </form>
                </Paper>
            </main>
        );
    }
}

export default withStyles(styles)(NewChatroom);
