import React, { useState, useEffect, useMemo } from "react";
import KHELayout from "../layouts/layout.jsx";
import { remult } from "remult";
import { Email, EmailSource } from "../../global-includes/email-address.ts";
import { Card, Col, Layout, Row, Skeleton, Statistic } from "antd";
import { User } from "../../global-includes/users.ts";
import Link from "next/link.js";
import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from "recharts";

const { Sider, Content } = Layout;

const DBCard = ({ children }) => <Card style={{ width: 200, margin: "10px 10px 10px 0" }}>{children}</Card>;

const UsersBarChart = () => {

    const [loading, setLoading] = useState(false);
    const [chart, setChart] = useState({});

    useEffect(() => {

        const repo = remult.repo(User);

        const loadChart = async () => {
            setChart([
                {
                    name: 'Registered',
                    amount: await repo.count({ submittedApplication: true }),
                },
                {
                    name: 'Approved',
                    amount: await repo.count({ applicationApproved: true }),
                },
                {
                    name: 'Checked in',
                    amount: await repo.count({ checkedIn: true }),
                }
            ]);
            setLoading(false);
        }

        setLoading(true);
        loadChart();
    }, []);

    return (
        <Skeleton loading={loading} active>
            <BarChart width={500} height={400} data={chart}>
                <CartesianGrid strokeDasharray="4 4" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" name="Users" barSize={30} fill="lightblue" />
            </BarChart>
        </Skeleton>
    )
}

function HomePage() {

    const [loading, setLoading] = useState(false);
    const [counts, setCounts] = useState(null);
    const [chart, setChart] = useState([]);

    useEffect(() => {

        const loadCounts = async () => {
            setCounts({
                emails: await remult.repo(Email).count(),
                early: await Email.getEmailList(EmailSource.Early2023).then(l => l.length),
                users: await remult.repo(User).count()
            });

            setLoading(false);
        }

        setLoading(true);
        loadCounts();

    }, []);

    // TODO: make better links

    return <KHELayout>
        <Layout>
            <Sider width={200} theme="light">
                <Layout>
                    <DBCard>
                        <Statistic loading={loading} title="2023 Email Signups" value={counts?.early} />
                    </DBCard>
                    <DBCard>
                        <Statistic loading={loading} title={<Link href="/emailLists">Total Email Addresses In DB</Link>} value={counts?.emails} />
                    </DBCard>
                    <DBCard>
                        <Statistic loading={loading} title={<Link href="/users">User Accounts</Link>} value={counts?.users} />
                    </DBCard>
                </Layout>
            </Sider>
            <Content>
                <Layout loading={loading} style={{ padding: "10px" }}>
                    <Row>
                        <Col xs={{ span: 5, offset: 1 }} lg={{ span: 6, offset: 2 }}>
                            <UsersBarChart />
                        </Col>
                    </Row>
                </Layout>
            </Content>
        </Layout>
    </KHELayout>;
};

export default HomePage;
