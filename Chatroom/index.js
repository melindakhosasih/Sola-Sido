import React from "react";
import * as ReactDOMClient from "react-dom/client";
// import 'bootstrap/dist/css/bootstrap.min.css';
import Home from "./src/components/home";
import { AuthProvider } from "./src/contexts/authContext";
import { SnackbarProvider } from "notistack";

ReactDOMClient.createRoot(document.getElementById("root")).render(
    // <React.StrictMode>
        <AuthProvider>
            <SnackbarProvider>
                <Home />
            </SnackbarProvider>
        </AuthProvider>
    // </React.StrictMode>
);
