import React, { useState, useEffect, createContext, useContext } from "react";
import { User } from "../../global-includes/users.ts";
import "./index.css";

const UserContext = createContext();

function UserProvider({ children }) {
    const [user, setUser] = useState(null);
    useEffect(() => {
        User.getOwnUserInfo().then(u => {
            if (!u) {
                location.assign(
                    location.protocol + "//" +
                    location.host.replace("staff.", "") + "/login"
                );
            } else {
                setUser(u);
            }
        })
    }, []);
    return <UserContext.Provider value={[user, setUser]}>{children}</UserContext.Provider>
}

export function useUser() {
    return useContext(UserContext)
}

export default function App({ Component, pageProps }) {
    return <UserProvider>
        <Component {...pageProps} />
    </UserProvider>;
}
