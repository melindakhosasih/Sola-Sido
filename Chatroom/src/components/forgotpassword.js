import React, { useRef, useState, Component } from "react";
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
        marginTop: theme.spacing(1.5),
        fontSize: 20,
        width: "100%",
        textAlign: "center",
    },
    signInLink: {
        marginTop: theme.spacing(2),
        fontSize: 20,
        width: "100%",
        textDecoration: "none",
        color: "#303f9f",
        textAlign: "center",
    },
    signUpLink: {
        marginTop: theme.spacing(2),
        fontSize: 20,
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

class ForgotPassword extends Component {
    constructor() {
        super();
        this.state = {
            email: null,
            error: "",
            message: "",
            navigate: "",
        };
    }

    handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await this.props.resetPassword(this.state.email);
            this.setState({
                message: "Check your inbox for further instructions."
            });
        } catch (e) {
            this.setState({
                email: null,
                error: e.message,
            });
        }
    };

    userTyping = (e) => {
        this.setState({
            email: e.target.value,
        });
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
                            Forget Password
                        </Typography>
                        {this.state.message && (
                            <Alert variant="success">{this.state.message}</Alert>
                        )}
                        <form onSubmit={(e) => this.handleSubmit(e)}>
                            <FormControl required fullWidth margin="normal">
                                <InputLabel htmlFor="emailRef">
                                    Enter Your Email
                                </InputLabel>
                                <Input
                                    autoComplete="email"
                                    onChange={(e) => this.userTyping(e)}
                                    autoFocus
                                    id="emailRef"
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
                        <Link className={classes.signInLink} to="/login">
                            Sign In
                        </Link>
                        <Typography className={classes.noAccountHeader}>
                            Don't have an account?{" "}
                            <Link className={classes.signUpLink} to="/signup">
                                Sign Up
                            </Link>
                        </Typography>
                    </Paper>
                </main>
                {this.state.error && (
                    <Alert className={classes.error} severity="error">
                        {this.state.error}
                    </Alert>
                )}
            </>
        );
    }
}
export default withStyles(styles)(ForgotPassword);
