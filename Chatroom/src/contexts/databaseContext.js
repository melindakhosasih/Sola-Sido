import React, { useContext } from "react";
import { getDatabase, ref, set } from "firebase/database";
import { useAuth } from "../contexts/authContext";

const dbContext = React.createContext();

export function useDatabase() {
    return useContext(dbContext);
}

export function DatabaseProvider({children}) {
    console.log("asdsa");
    const { currentUser } = useAuth();
    const database = getDatabase();
    const value = {
        writeUserData,
    };

    function writeUserData(email, message) {
        const reference = ref(database, "chatroom/" + email);
        set(reference, {
            email: email,
            message: message,
        });
    }
    return <dbContext.Provider value={value}>{children}</dbContext.Provider>;
}
