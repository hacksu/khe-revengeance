import { useState, useEffect } from "react";
import { User } from "../../global-includes/users.ts";

function HomePage() {
    const [user, setUser] = useState(null);
    useEffect(() => {
        User.getOwnUserInfo().then(u => {
            setUser(u);
        })
    }, []);
    return <>
        <div>Hello</div>
        <img src="/cat.jpg" />
        <p>{user?.externalRole}</p>
    </>;
}

export default HomePage;
