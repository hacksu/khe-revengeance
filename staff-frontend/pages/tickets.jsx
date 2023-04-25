import { useState, useEffect } from "react";
import { SupportTicket, TicketMessage, TicketStatus } from "../../global-includes/support-ticket";
import { remult } from "remult";
import { useQueryState } from "next-usequerystate";
import { Layout, Menu } from "antd";
const { Sider } = Layout;

import KHELayout from "../layouts/layout";
import layoutStyle from "../layouts/layout.module.css";
import { DisplayEmail } from "../components/displayEmail";
import ComposeEmail from "../components/composeEmail";


export default function Tickets() {
    const [tickets, setTickets] = useState([]);
    const [openTicket, setOpenTicket] = useQueryState("ticket");
    const [messages, setMessages] = useState([]);
    const [composition, setComposition] = useState({});
    useEffect(() => {
        return remult.repo(SupportTicket)
            .liveQuery({ orderBy: { lastUpdated: "desc" } })
            .subscribe(info => setTickets(info.applyChanges));
    }, []);
    useEffect(() => {
        const unsubscribe = remult.repo(TicketMessage)
            .liveQuery({ where: { forTicketID: openTicket }, orderBy: { date: "asc" } })
            .subscribe(info => setMessages(info.applyChanges));
        return () => { console.log("unsubscribing from", openTicket); unsubscribe() }
    }, [openTicket])
    const getMenuItems = () => {
        return Object.values(TicketStatus).map(s => ({
            key: s,
            label: s,
            children: tickets.filter(t => t.status == s).map(t => ({
                key: t.id,
                label: t.originalSubject
            }))
        }))
    };
    const menuNavigation = (info) => {
        setOpenTicket(info.key);
    }
    return <KHELayout>
        <Layout style={{ height: "100%" }}>
            <Sider width={200} theme="light">
                <Menu title="Support Tickets" mode="inline" onClick={menuNavigation}
                    style={{ overflowY: "auto", height: "100%" }}
                    items={getMenuItems()}
                    defaultOpenKeys={[TicketStatus.open]}
                    defaultSelectedKeys={[openTicket]}
                    className={layoutStyle.sidebarWidth} />
            </Sider>
            <Layout style={{ padding: 20, height: "100%", overflowY: "auto" }}>
                <div style={{ maxWidth: 600 }}>
                    {(messages && openTicket) ?
                        messages.map(m => {
                            const them = { email: m.theirEmail, name: m.theirName };
                            const us = { email: m.ourEmail, name: m.ourName };
                            const from = m.incoming ? them : us;
                            const to = m.incoming ? us : them;
                            return <div style={{ paddingBottom: 20, marginBottom: 20, borderBottom: "1px solid black" }}>
                                <DisplayEmail sentAt={m.date} mailData={{ ...m, from, to }} />
                            </div>;
                        }) : null}
                    <ComposeEmail setEmailForm={setComposition} />
                </div>
            </Layout>
        </Layout>
    </KHELayout>;
}
