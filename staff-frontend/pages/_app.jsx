import React, { useState, useEffect, createContext, useContext } from "react";
import { User } from "../../global-includes/users.ts";
import "./index.css";
import "../components/quill.css";
import { remult } from "remult";
import { SupportTicket } from "../../global-includes/support-ticket.ts";


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
                // needed for live queries for some baffling reason.
                // TODO: could there be a race condition where this might not
                // get set before a live query is created? that might be a problem
                remult.user = u;
            }
        })
    }, []);
    return <UserContext.Provider value={[user, setUser]}>
        {children}
    </UserContext.Provider>;
}

export function useUser() {
    return useContext(UserContext)
}

const UnreadMailContext = createContext();

function UnreadMailProvider({ children }) {
    const [user, _] = useUser();
    const [unread, setUnread] = useState([]);
    useEffect(() => {
        return remult.repo(SupportTicket)
            .liveQuery({ where: { unreadCount: { $gt: 0 } } })
            .subscribe(info => setUnread(info.applyChanges));
    }, [user]);
    // TODO: also query the raw email collection for unprocessed emails
    return <UnreadMailContext.Provider
        value={user ? unread.reduce((acc, val) => acc + val.unreadCount, 0) : 0}
    >
        {children}
    </UnreadMailContext.Provider>
}

export function useUnreadMailCount() {
    return useContext(UnreadMailContext);
}

export default function App({ Component, pageProps }) {
    return <UserProvider>
        <UnreadMailProvider>
            <Component {...pageProps} />
        </UnreadMailProvider>
    </UserProvider>;
}
