import React, { useState, useEffect } from "react";
import KHELayout from "../layouts/layout.jsx";
import { remult } from "remult";
import { Email, EmailSource } from "../../global-includes/email-address.ts";
import { Card, Statistic } from "antd";
import { User } from "../../global-includes/users.ts";
import Link from "next/link.js";

function DBCard({ children }) {
    return <Card style={{ width: 200, margin: "10px 10px 10px 0" }}>{children}</Card>
}

function HomePage() {

    const [emailCount, setEmailCount] = useState(null);
    const [count2023, setCount2023] = useState(null);
    const [userCount, setUserCount] = useState(null);

    useEffect(() => {
        remult.repo(Email).count().then(count => setEmailCount(count));
        Email.getEmailList(EmailSource.Early2023).then(l => setCount2023(l.length));
        remult.repo(User).count().then(count => setUserCount(count));
    }, []);

    // TODO: make better links

    return <KHELayout>
        <div style={{ padding: "10px 0", height: "100%" }}>
            <DBCard>
                <Statistic title="2023 Email Signups" value={count2023 ?? '...'} />
            </DBCard>
            <DBCard>
                <Statistic title={
                    <Link href="/emailLists">Total Email Addresses In DB</Link>
                } value={emailCount ?? '...'} />
            </DBCard>
            <DBCard>
                <Statistic title="User Accounts" value={userCount ?? '...'} />
            </DBCard>
        </div>
    </KHELayout>;
};

export default HomePage;
