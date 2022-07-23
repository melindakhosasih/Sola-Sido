import React, { useRef, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
// import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuth } from "../contexts/authContext";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import Paper from "@material-ui/core/Paper";
import withStyles from "@material-ui/core/styles/withStyles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Alert from "@mui/material/Alert";
import { Snackbar } from "@material-ui/core";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

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
    noAccountHeader: {
        marginTop: theme.spacing(2),
        fontSize: 20,
        width: "100%",
        textAlign: "right",
    },
    signUpLink: {
        marginTop: theme.spacing(0.5),
        fontSize: 18,
        width: "100%",
        textDecoration: "none",
        color: "#303f9f",
        textAlign: "right",
    },
    forgotPassword: {
        marginTop: theme.spacing(0.5),
        fontSize: 18,
        width: "100%",
        textDecoration: "none",
        color: "#303f9f",
        textAlign: "right",
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
    google: {
        marginTop: theme.spacing(1.5),
        height: 40,
        backgroundColor: "white",
        backgroundImage:
            "url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNMTcuNiA5LjJsLS4xLTEuOEg5djMuNGg0LjhDMTMuNiAxMiAxMyAxMyAxMiAxMy42djIuMmgzYTguOCA4LjggMCAwIDAgMi42LTYuNnoiIGZpbGw9IiM0Mjg1RjQiIGZpbGwtcnVsZT0ibm9uemVybyIvPjxwYXRoIGQ9Ik05IDE4YzIuNCAwIDQuNS0uOCA2LTIuMmwtMy0yLjJhNS40IDUuNCAwIDAgMS04LTIuOUgxVjEzYTkgOSAwIDAgMCA4IDV6IiBmaWxsPSIjMzRBODUzIiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBkPSJNNCAxMC43YTUuNCA1LjQgMCAwIDEgMC0zLjRWNUgxYTkgOSAwIDAgMCAwIDhsMy0yLjN6IiBmaWxsPSIjRkJCQzA1IiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBkPSJNOSAzLjZjMS4zIDAgMi41LjQgMy40IDEuM0wxNSAyLjNBOSA5IDAgMCAwIDEgNWwzIDIuNGE1LjQgNS40IDAgMCAxIDUtMy43eiIgZmlsbD0iI0VBNDMzNSIgZmlsbC1ydWxlPSJub256ZXJvIi8+PHBhdGggZD0iTTAgMGgxOHYxOEgweiIvPjwvZz48L3N2Zz4=)",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "12px 11px",
    },
});

class Login extends React.Component {
    constructor() {
        super();
        this.state = {
            email: null,
            password: null,
            error: "",
            navigate: "",
        };
    }

    handleLoginGoogle = (e) => {
        e.preventDefault();
        const auth = getAuth();
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then((result) => {
                const user = result.user;
                this.props.accountCreated();
                this.setState({ navigate: "/dashboard" });
            })
            .catch((e) => {
                this.setState({
                    email: null,
                    password: null,
                    error: e.message,
                });
            });
    };

    handleLogin = async (e) => {
        e.preventDefault();
        try {
            await this.props.login(this.state.email, this.state.password);
            this.setState({ navigate: "/dashboard" });
        } catch (e) {
            this.setState({
                email: null,
                password: null,
                error: e.message,
            });
        }
    };

    userTyping = (type, e) => {
        switch (type) {
            case "email":
                this.setState({ email: e.target.value });
                break;
            case "password":
                this.setState({ password: e.target.value });
                break;
            default:
                break;
        }
    };

    render() {
        const { classes } = this.props;
        return (
            <>
                {this.state.navigate && (
                    <Navigate replace={true} to={this.state.navigate} />
                )}
                <main className={classes.main}>
                    <CssBaseline></CssBaseline>
                    <Paper className={classes.paper}>
                        <Typography className={classes.title}>
                            Sign In
                        </Typography>
                        {this.state.error && (
                            <Alert className={classes.error} severity="error">
                                {this.state.error}
                            </Alert>
                        )}
                        <form onSubmit={(e) => this.handleLogin(e)}>
                            <FormControl required fullWidth margin="normal">
                                <InputLabel htmlFor="emailRef">
                                    Enter Your Email
                                </InputLabel>
                                <Input
                                    autoComplete="email"
                                    onChange={(e) =>
                                        this.userTyping("email", e)
                                    }
                                    autoFocus
                                    id="emailRef"
                                ></Input>
                            </FormControl>
                            <FormControl required fullWidth margin="normal">
                                <InputLabel htmlFor="passwordRef">
                                    Enter Your Password
                                </InputLabel>
                                <Input
                                    type="password"
                                    onChange={(e) =>
                                        this.userTyping("password", e)
                                    }
                                    autoFocus
                                    id="passwordRef"
                                ></Input>
                            </FormControl>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                            >
                                Submit
                            </Button>
                        </form>
                        <Button
                            fullWidth
                            variant="contained"
                            className={classes.google}
                            onClick={this.handleLoginGoogle}
                        >
                            Sign in with Google
                        </Button>
                        <Typography className={classes.noAccountHeader}>
                            Don't have an account?{" "}
                            <Link className={classes.signUpLink} to="/signup">
                                Sign Up
                            </Link>
                        </Typography>
                        <Link
                            className={classes.forgotPassword}
                            to="/forgot-password"
                        >
                            Forgot Password?
                        </Link>
                    </Paper>
                </main>
            </>
        );
    }
}

export default withStyles(styles)(Login);
