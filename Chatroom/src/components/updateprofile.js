import React, { Component } from "react";
import { Card } from "react-bootstrap";
import { Link, Navigate } from "react-router-dom";
import { Avatar } from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import Paper from "@material-ui/core/Paper";
import withStyles from "@material-ui/core/styles/withStyles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Alert from "@mui/material/Alert";

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
        transform: "translateY(-50%)",
        padding: theme.spacing(4),
    },
    title: {
        fontSize: 30,
    },
    submit: {
        marginTop: theme.spacing(3),
        height: 40,
    },
    hasAccountHeader: {
        marginTop: theme.spacing(2),
        fontSize: 20,
        width: "100%",
        textAlign: "center",
    },
    cancel: {
        marginTop: theme.spacing(0.5),
        fontSize: 18,
        width: "100%",
        textDecoration: "none",
        color: "#303f9f",
        textAlign: "center",
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

class UpdateProfile extends Component {
    constructor() {
        super();
        this.state = {
            email: null,
            password: null,
            passwordConfirm: null,
            displayName: null,
            navigate: "",
            error: "",
        };
    }

    handleUpdateProfile = async (e) => {
        e.preventDefault();
        if (!this.formIsValid()) {
            this.setState({
                error: "Password do not match!",
                password: null,
                passwordConfirm: null,
            });
            return;
        }

        const promises = [];

        if (this.state.email !== this.props.currentUser.email) {
            promises.push(this.props.changeEmail(this.state.email));
        }

        if (this.state.password !== "") {
            promises.push(this.props.changePassword(this.state.password));
        }

        if (
            this.state.displayName !== "" &&
            this.state.displayName !== this.props.currentUser.displayName
        ) {
            promises.push(this.props.updateName(this.state.displayName));
        }

        // if(this.state.) {
        //     promises.push(this.props.updatePP());
        // }

        Promise.all(promises)
            .then(() => {
                this.setState({ navigate: "/" });
            })
            .catch((e) => {
                this.setState({ error: e.message });
            });
    };

    formIsValid = () => {
        return this.state.password === this.state.passwordConfirm;
    };

    userTyping = (type, e) => {
        switch (type) {
            case "email":
                this.setState({ email: e.target.value });
                break;
            case "displayName":
                this.setState({ displayName: e.target.value });
                break;
            case "password":
                this.setState({ password: e.target.value });
                break;
            case "passwordConfirm":
                this.setState({ passwordConfirm: e.target.value });
                break;
            default:
                break;
        }
    };

    render() {
        const { classes } = this.props;
        return (
            <main className={classes.main}>
                <CssBaseline></CssBaseline>

                    <Paper className={classes.paper}>
                        <Typography className={classes.title}>
                        Update Profile
                        </Typography>
                        {this.state.navigate && (
                            <Navigate replace to={this.state.navigate} />
                        )}
                        {this.state.error && (
                            <Alert severity="error">{this.state.error}</Alert>
                        )}
                        
                        <Avatar
                            style={{
                                margin: "auto",
                                width: "150px",
                                height: "150px",
                            }}
                        ></Avatar>
                        <form onSubmit={(e) => this.handleUpdateProfile(e)}>
                            <FormControl fullWidth margin="normal">
                                <InputLabel htmlFor="UpdateProfile-displayName-input">
                                    Enter Your Full Name
                                </InputLabel>
                                <Input
                                    type="text"
                                    onChange={(e) =>
                                        this.userTyping("displayName", e)
                                    }
                                    autoFocus
                                    id="UpdateProfile-displayName-input"
                                ></Input>
                            </FormControl>
                            <FormControl fullWidth margin="normal">
                                <InputLabel htmlFor="UpdateProfile-email-input">
                                    Enter Your Email
                                </InputLabel>
                                <Input
                                    autoComplete="email"
                                    onChange={(e) =>
                                        this.userTyping("email", e)
                                    }
                                    autoFocus
                                    id="UpdateProfile-email-input"
                                ></Input>
                            </FormControl>
                            <FormControl fullWidth margin="normal">
                                <InputLabel htmlFor="UpdateProfile-password-input">
                                    Leave blank to keep the same
                                </InputLabel>
                                <Input
                                    type="password"
                                    onChange={(e) =>
                                        this.userTyping("password", e)
                                    }
                                    autoFocus
                                    id="UpdateProfile-password-input"
                                ></Input>
                            </FormControl>
                            <FormControl fullWidth margin="normal">
                                <InputLabel htmlFor="UpdateProfile-password-confirm-input">
                                    Leave blank to keep the same
                                </InputLabel>
                                <Input
                                    type="password"
                                    onChange={(e) =>
                                        this.userTyping("passwordConfirm", e)
                                    }
                                    autoFocus
                                    id="signUp-password-confirm-input"
                                ></Input>
                            </FormControl>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                            >
                                Update
                            </Button>
                        </form>
                        <Link className={classes.cancel} to="/login">
                            Cancel!
                        </Link>
                    </Paper>
          
            </main>
        );
    }
}

export default withStyles(styles)(UpdateProfile);
