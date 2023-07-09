import { useState, useEffect, useMemo, useRef } from "react";
import { SupportTicket, SupportTicketController, TicketMessage, TicketStatus } from "../../global-includes/support-ticket";
import { remult } from "remult";
import { useQueryState } from "next-usequerystate";
import { Layout, Menu, Button, Popconfirm, Badge } from "antd";
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

    const openTicketData = useMemo(() => tickets.find(t => t.id == openTicket), [tickets, openTicket]);

    useEffect(() => {
        return remult.repo(SupportTicket)
            .liveQuery({ orderBy: { lastUpdated: "desc" } })
            .subscribe(info => setTickets(info.applyChanges));
    }, []);

    useEffect(() => {
        if (openTicket) {
            const unsubscribe = remult.repo(TicketMessage)
                .liveQuery({ where: { forTicketID: openTicket }, orderBy: { date: "asc" } })
                .subscribe(info => setMessages(info.applyChanges));
            return () => { console.log("unsubscribing from", openTicket); unsubscribe() }
        } else {
            // TODO: does useEffect need to be consistent about returning a callback?
            return () => { ; }
        }
    }, [openTicket]);

    const lastMessageNode = useRef(null);
    useEffect(() => {
        lastMessageNode.current?.scrollIntoView({ behavior: "smooth" });
        if (openTicket && openTicketData && openTicketData.id == openTicket) {
            remult.repo(SupportTicket).update(
                openTicket, { ...openTicketData, unreadCount: 0 }
            );
        }
    }, [messages.length]);

    const getMenuItems = () => {
        return Object.values(TicketStatus).map(s => ({
            key: s,
            label: s,
            children: tickets.filter(t => t.status == s).map(t => ({
                key: t.id,
                label: <>
                    <Badge count={t.unreadCount} />
                    <span style={{ display: "inline-block", marginLeft: 10 }}>
                        {t.originalSubject}
                    </span>
                </>
            }))
        }))
    };

    const menuNavigation = (info) => {
        if (info.keyPath.length > 1) {
            setOpenTicket(info.key, { history: "push" });
        }
    }

    const lastMessage = messages[messages.length - 1];

    const sendTicketReply = () => {
        // TODO: add loading spinner between the last email and the "send" form
        // until the sent email comes back from the database
        SupportTicketController.sendReplyForTicket(
            remult.repo(TicketMessage).create({
                subject: composition.subject,
                html: composition.html,
                forTicketID: openTicket,
                theirName: lastMessage.theirName,
                theirEmail: lastMessage.theirEmail,
                ourName: composition.from.name,
                ourEmail: composition.from.email
            })
        ).then(() => {
            setComposition({ ...composition, html: "" });
        });
    }

    return <KHELayout>
        <Layout style={{ height: "100%" }}>
            <Sider width={300} theme="light">
                <Menu title="Support Tickets" mode="inline" onClick={menuNavigation}
                    style={{ overflowY: "auto", height: "100%", width: "100%" }}
                    items={getMenuItems()}
                    defaultOpenKeys={[TicketStatus.open]}
                    defaultSelectedKeys={[openTicket]}
                    className={layoutStyle.sidebarWidth} />
            </Sider>
            <Layout style={{ padding: 20, height: "100%", overflowY: "auto" }}>
                <div style={{ maxWidth: 600 }}>
                    {(messages?.length && openTicket) ?
                        <>
                            {messages.map((m, i) => {
                                const them = { email: m.theirEmail, name: m.theirName };
                                const us = { email: m.ourEmail, name: m.ourName };
                                const from = m.incoming ? them : us;
                                const to = m.incoming ? us : them;
                                return <div
                                    key={m.id}
                                    style={{ paddingBottom: 20, marginBottom: 20, borderBottom: "1px solid black" }}
                                    ref={node => { if (i == messages.length - 1) lastMessageNode.current = node; }}
                                >
                                    <DisplayEmail sentAt={m.date} mailData={{ ...m, from, to }} />
                                </div>;
                            })}
                            {/* TODO: take the default "from" email/name from the most recent message also? */}
                            <ComposeEmail setEmailForm={setComposition} defaultFromEmail="support"
                                defaultFromName="KHE Support"
                                defaultSubject={
                                    (lastMessage.subject.toLowerCase().startsWith("re") ? "" : "RE: ") +
                                    lastMessage.subject
                                }
                                key={lastMessage.subject}
                            />
                            <div style={{ display: "flex", justifyContent: "space-between", width: "100%", margin: "10px auto" }}>
                                Sending to: {`"${lastMessage.theirName}" <${lastMessage.theirEmail}>`}
                                <Popconfirm
                                    title="Send email?"
                                    onConfirm={sendTicketReply}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <Button type="primary">Send</Button>
                                </Popconfirm>
                            </div>
                        </>
                        : null}

                </div>
            </Layout>
        </Layout>
    </KHELayout>;
}
