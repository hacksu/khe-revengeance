import React from "react";

import { Layout, Menu, ConfigProvider, theme } from "antd";
import { ContactsOutlined, LockOutlined, MessageOutlined, UnlockOutlined } from "@ant-design/icons";

import Link from "next/link";
import { useRouter } from "next/router";

import style from "./layout.module.css";
import { useUser } from "../pages/_app.jsx";

const { Header, Content, Footer } = Layout;


export default function KHEStaffLayout({ children }) {
    const pages = [
        { key: "/", label: "KHE 2023 Dashboard" },
        { icon: <ContactsOutlined />, key: "/emailLists", label: "Email Lists" },
        { icon: <MessageOutlined />, key: "/tickets", label: "Support Tickets" }
    ].map(page => ({ ...page, label: (<Link href={page.key}>{page.label}</Link>) }));

    const user = useUser()[0];

    return (
        <Layout style={{ height: "100vh", padding: 10 }}>
            <Header style={{ padding: 0 }}>
                <Menu
                    theme="dark" mode="horizontal" items={pages} className={style.topMenu}
                    defaultSelectedKeys={[useRouter().pathname]} />
            </Header>
            <Layout style={{ height: "100%" }}>
                <Content>
                    {children}
                </Content>
            </Layout>
            <Layout>
                <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
                    <Footer className={style.footer}>
                        {user ? <UnlockOutlined /> : <LockOutlined />}Authenticated as {user?.externalRole || "..."}
                    </Footer>
                </ConfigProvider>
            </Layout>
        </Layout>
    );
}
