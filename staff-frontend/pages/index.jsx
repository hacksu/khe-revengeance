import React, { useState, useEffect } from "react";
import KHELayout from "../layouts/layout.jsx";
import { remult } from "remult";
import { Email } from "../../global-includes/email-address.ts";
import { Card, Layout, Row, Skeleton, Statistic } from "antd";
import { User } from "../../global-includes/users.ts";
import Link from "next/link.js";
import { Bar, BarChart, CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";

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
        <Skeleton loading={loading} active style={{width: 500, height: 400}}>
            <BarChart width={500} height={400} data={chart}>
                <CartesianGrid strokeDasharray="4 4" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" name="Users" barSize={30} fill="lightblue" />
            </BarChart>
        </Skeleton>
    )
};

const UsersLineGraph = () => {

    const [loading, setLoading] = useState(false);
    const [chart, setChart] = useState({});

    useEffect(() => {

        const repo = remult.repo(User);

        const loadChart = async () => {

            const dataPoints = 20;

            const earliest = (await repo.findFirst()).createdAt;
            const latest = new Date("2024-05-01");
            const range = latest.getTime() - earliest.getTime();
            const rangeBetweenPoints = range / (dataPoints - 1);

            // TODO: move counting to backend method; this is slow
            const points = [{name: earliest.toLocaleDateString(), amount: 0}];
            for (let i = 1; i < dataPoints; ++i) {
                const before = new Date(earliest.getTime() + i * rangeBetweenPoints);
                const count = await repo.count({ createdAt: { $lt: before } });
                points.push({
                    name: before.toLocaleDateString(),
                    amount: count
                });
            }
            
            setChart(points);
            setLoading(false);
        }

        setLoading(true);
        loadChart();
    }, []);

    return (
        <Skeleton loading={loading} active style={{width: 500, height: 400}}>
            <LineChart width={500} height={400} data={chart}>
                <CartesianGrid strokeDasharray="4 4" />
                <XAxis dataKey="name" interval="preserveStartEnd" />
                <YAxis label={{value: "User Accounts Created", angle: -90}} />
                <Tooltip />
                <Line dataKey="amount" name="Users" />
            </LineChart>
        </Skeleton>
    )
};

function HomePage() {

    const [loadingCounts, setLoadingCounts] = useState(false);
    const [counts, setCounts] = useState(null);

    useEffect(() => {

        const loadCounts = async () => {
            setCounts({
                emails: await remult.repo(Email).count(),
                users: await remult.repo(User).count(),
                accepted: await remult.repo(User).count({applicationApproved: true})
            });

            setLoadingCounts(false);
        }

        setLoadingCounts(true);
        loadCounts();

    }, []);

    // TODO: make better links

    return <KHELayout>
        <Layout>
            <Sider width={200} theme="light">
                <Layout>
                    <DBCard>
                        <Statistic
                            loading={loadingCounts}
                            title={<Link href="/users">User Accounts</Link>}
                            value={counts?.users}
                        />
                    </DBCard>
                    <DBCard>
                        <Statistic
                            loading={loadingCounts}
                            title={<Link href="/users">Accepted Applications</Link>}
                            value={counts?.accepted}
                        />
                    </DBCard>
                </Layout>
            </Sider>
            <Content>
                <Layout loading={loadingCounts} style={{ padding: "10px" }}>
                    <Row style={{flexWrap: "nowrap", minWidth: 800}}>
                        <UsersLineGraph />
                        <UsersBarChart />
                    </Row>
                </Layout>
            </Content>
        </Layout>
    </KHELayout>;
};

export default HomePage;
