import React from "react";
import { Layout, Menu, ConfigProvider, theme } from "antd";
const { Header, Content, Footer } = Layout;
import style from "./layout.module.css";
import Link from "next/link";
import { useRouter } from "next/router";
import { useUser } from "../pages/_app.jsx";

export default function ({ children }) {
    const pages = [
        { key: "/", label: "KHE Staff" },
        { key: "/emailLists", label: "Email Lists" },
        { key: "/tickets", label: "Support Tickets" }
    ].map(page => ({ ...page, label: (<Link href={page.key}>{page.label}</Link>) }));

    return (
        <Layout>
            <Header style={{ padding: "0" }}>
                <Menu
                    theme="dark" mode="horizontal" items={pages} className={style.topMenu}
                    defaultSelectedKeys={[useRouter().pathname]} />
            </Header>
            <Layout>
                <Content
                    style={{
                        padding: 24,
                        margin: 0,
                        minHeight: 280,
                    }}
                >
                    {children}
                </Content>
            </Layout>
            <Layout>
                <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
                    <Footer style={{ padding: "24px" }}>
                        Authenticated as {useUser()[0]?.externalRole || "..."}
                    </Footer>
                </ConfigProvider>
            </Layout>
        </Layout>
    );
}
