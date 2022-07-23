import React, { Component, useRef, useState } from "react";
import { Card, Form } from "react-bootstrap";
import { Link, Navigate, useNavigate } from "react-router-dom";
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { useAuth } from "../contexts/authContext";
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
    signInLink: {
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

// const themeHOC = ((Component:any) => {
//     return (props)=>{
//         const {signUp} = useAuth();
//         return <Component {...props} signUp={signUp}/>
//     }
// })

// function injectAuth(Component) {
//     const injectedAuth = function (props) {
//         const abc = useAuth(props);
//         return <Component {...props} abc={abc} />;
//     };
//     return injectedAuth;
// };

// function authData ({children}) {
//     const theData = useAuth();
//     return children(theData)
// }

// const navigate = useNavigate();

class SignUp extends Component {
    constructor() {
        super();
        this.state = {
            email: null,
            password: null,
            passwordConfirm: null,
            displayName: null,
            error: "",
            navigate: "",
        };
    }

    handleSignUp = async (e) => {
        e.preventDefault();
        if (!this.formIsValid()) {
            this.setState({ error: "Password do not match!" });
            return;
        }
        try {
            await this.props.signUp(this.state.email, this.state.password);
            this.props.accountCreated();
            this.props.updateName(this.state.displayName);
            this.setState({ navigate: "/login" });
        } catch (e) {
            this.setState({ error: e.message });
        }
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
                        Sign Up
                    </Typography>
                    {this.state.navigate && (
                        <Navigate replace to={this.state.navigate} />
                    )}
                    {this.state.error && (
                        <Alert severity="error">{this.state.error}</Alert>
                    )}
                    <form
                        onSubmit={(e) => this.handleSignUp(e)}
                    >
                        <FormControl required fullWidth margin="normal">
                            <InputLabel htmlFor="signUp-displayName-input">
                                Enter Your Full Name
                            </InputLabel>
                            <Input
                                type="text"
                                onChange={(e) =>
                                    this.userTyping("displayName", e)
                                }
                                autoFocus
                                id="signUp-displayName-input"
                            ></Input>
                        </FormControl>
                        <FormControl required fullWidth margin="normal">
                            <InputLabel htmlFor="signUp-email-input">
                                Enter Your Email
                            </InputLabel>
                            <Input
                                autoComplete="email"
                                onChange={(e) => this.userTyping("email", e)}
                                autoFocus
                                id="signUp-email-input"
                            ></Input>
                        </FormControl>
                        <FormControl required fullWidth margin="normal">
                            <InputLabel htmlFor="signUp-password-input">
                                Create A Password
                            </InputLabel>
                            <Input
                                type="password"
                                onChange={(e) => this.userTyping("password", e)}
                                autoFocus
                                id="signUp-password-input"
                            ></Input>
                        </FormControl>
                        <FormControl required fullWidth margin="normal">
                            <InputLabel htmlFor="signUp-password-confirm-input">
                                Confirm Your Password
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
                            Submit
                        </Button>
                    </form>
                    <Typography
                        className={classes.hasAccountHeader}
                    >
                        Already have account?
                    </Typography>
                    <Link className={classes.signInLink} to="/login">
                        Log In!
                    </Link>
                </Paper>
            </main>
        );
    }
}

export default withStyles(styles)(SignUp);

// export default () => {
//     const emailRef = useRef();
//     const passwordRef = useRef();
//     const passwordConfirmRef = useRef();
//     const { signUp } = useAuth();
//     const [error, setError] = useState("");
//     const [loading, setLoading] = useState(false);
//     const navigate = useNavigate();

//     async function handleSubmit(e) {
//         e.preventDefault();
//         if (passwordRef.current.value !== passwordConfirmRef.current.value) {
//             return setError("Password do not match.");
//         }

//         try {
//             setError("");
//             setLoading(true);
//             // await signUp(emailRef.current.value, passwordRef.current.value);
//             await signUp(emailRef.current.value, passwordRef.current.value);
//             navigate("/dashboard");
//         } catch(e) {
//             // setError("Failed to create an account");
//             setError(e.message);
//         }
//         setLoading(false);
//     }

//     return (
//         <>
//             <Card>
//                 <Card.Body>
//                     <h2 className="text-center mb-4">Sign Up</h2>
//                     {/* {currentUser && currentUser.email} */}
//                     {error && <Alert variant="danger">{error}</Alert>}
//                 </Card.Body>
//                 <Form onSubmit={handleSubmit}>
//                     <Form.Group id="email">
//                         <Form.Label>Email</Form.Label>
//                         <Form.Control type="email" ref={emailRef} required />
//                     </Form.Group>
//                     <Form.Group id="password">
//                         <Form.Label>Password</Form.Label>
//                         <Form.Control
//                             type="password"
//                             ref={passwordRef}
//                             required
//                         />
//                     </Form.Group>
//                     <Form.Group id="password-confirm">
//                         <Form.Label>Password Confirmation</Form.Label>
//                         <Form.Control
//                             type="password"
//                             ref={passwordConfirmRef}
//                             required
//                         />
//                     </Form.Group>
//                     <Button disabled={loading} className="w-100" type="submit">
//                         Sign Up
//                     </Button>
//                 </Form>
//             </Card>
//             <div className="w-100 text-center mt-2">
//                 Already have an account? <Link to="/login">Log In</Link>
//             </div>
//         </>
//     );
// };
