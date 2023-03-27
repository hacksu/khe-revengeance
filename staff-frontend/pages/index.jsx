import { Email } from '../../global-includes/email-address';
import { remult } from "remult";
import { useState, useEffect } from "react";

function HomePage() {
    const emailDB = remult.repo(Email);
    const [emails, setEmails] = useState([]);
    useEffect(async () => {
        setEmails(await emailDB.find());
    }, []);
    return <>
        <div>Hello staff</div>
        <img src="/cat.jpg" />
        <ul>
            {emails.map(e => <li>{e.address}</li>)}
        </ul>
    </>;
}

export default HomePage;
