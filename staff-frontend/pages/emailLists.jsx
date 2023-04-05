import React, { useState, useEffect } from "react";
import KHELayout from "../layouts/layout.jsx";
import { Email, EmailSource } from "../../global-includes/email-address.ts";
import { Card, Menu, Layout } from "antd";
const { Sider } = Layout;
import { Typography } from 'antd';
const { Title } = Typography;
import layoutStyle from "../layouts/layout.module.css";

export default function EmailLists() {
    const [emails, setEmails] = useState([]);
    const [list, setList] = useState(EmailSource.Early2023);
    useEffect(() => {
        Email.getAllEmails(list).then(rows => {
            setEmails(rows);
        });
    }, [list]);
    const cardStyle = {
        width: 200,
        margin: 6
    }
    const cardBodyStyle = {
        padding: 15, textOverflow: "ellipsis",
        overflow: "hidden"
    }
    const allLists = Object.values(EmailSource).sort().map(l => ({ key: l, label: l }));
    return <KHELayout>
        <Layout style={{ height: "100%" }}>
            <Sider width={200} theme="light">
                <Title style={{ paddingLeft: 20 }} level={5}>Email Lists</Title>
                <Menu title="Email Lists" mode="vertical" onClick={e => setList(e.key)}
                    items={allLists} selectedKeys={[list]}
                    className={layoutStyle.sidebarWidth} />
            </Sider>
            <div style={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap', maxHeight: "80vh", alignContent: 'start', padding: 10 }}>
                {emails.map((e, i) =>
                    <Card key={i} style={cardStyle} bodyStyle={cardBodyStyle}>
                        {e.address}
                    </Card>
                )}
            </div>
        </Layout>
    </KHELayout>
}
