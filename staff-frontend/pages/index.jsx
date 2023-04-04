import React, { useState, useEffect } from "react";
import KHELayout from "../layouts/layout.jsx";
import { remult } from "remult";
import { Email } from "../../global-includes/email-address.ts";
import { Card, Statistic } from "antd";

function HomePage() {

    const [emailCount, setEmailCount] = useState(null);

    useEffect(() => {
        remult.repo(Email).count().then(count => setEmailCount(count));
    }, []);

    return <KHELayout>
        <div style={{ padding: "10px 0", height: "100%" }}>
            <Card style={{ width: 200 }}>
                <Statistic title="2023 Email Signups" value={emailCount || '...'} />
            </Card>
        </div>
    </KHELayout>;
};

export default HomePage;
