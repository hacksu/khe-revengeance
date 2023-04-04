import React, { useState, useEffect } from "react";
import KHELayout from "../layouts/layout.jsx";
import { remult } from "remult";
import { Email } from "../../global-includes/email-address.ts";
import { Card, Menu, Layout } from "antd";
const { Sider } = Layout;
import { Typography } from 'antd';
const { Title } = Typography;
import layoutStyle from "../layouts/layout.module.css";

export default function EmailLists() {
    const [emails, setEmails] = useState([]);
    const [allLists, setAllLists] = useState(["2023EarlySignup"]);
    const [list, setList] = useState("2023EarlySignup");
    useEffect(() => {
        remult.repo(Email).find({ source: list }).then(rows => {
            setAllLists(Array.from(rows.reduce((acc, val) => { if (val.source) acc.add(val.source); return acc }, new Set())));
            setEmails(rows);
        });
    }, [list]);
    console.log(allLists)
    return <KHELayout>
        <Layout style={{ height: "100%" }}>
            <Sider width={200} theme="light">
                <Title style={{ paddingLeft: 20 }} level={5}>Email Lists</Title>
                <Menu title="Email Lists" mode="vertical" onClick={e => setList(e.key)}
                    items={allLists.map(l => ({ label: l, key: l }))}
                    selectedKeys={["2023EarlySignup"]} className={layoutStyle.sidebarWidth} />
            </Sider>
            <div style={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap', maxHeight: "80vh", alignContent: 'start', padding: 10 }}>
                {emails.map(e => <Card style={{ width: 200, margin: 6 }} bodyStyle={{ padding: 15 }}>{e.address}</Card>)}
            </div>
        </Layout>
    </KHELayout>
}
