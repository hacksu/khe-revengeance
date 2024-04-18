import { useEffect, useState } from "react";
import { remult } from "remult";
import KHELayout from "../layouts/layout";
import { User } from "../../global-includes/users";
import style from "./users.module.css";

import { Button, Card, Layout, Modal, Row, Col, Divider, Tooltip, Menu } from "antd";
import { Email, EmailTemplates } from "../../global-includes/email-address";
const { Content, Sider } = Layout;

export default function UsersManager() {

    const [users, setUsers] = useState([]);
    const [viewing, setViewing] = useState(null);
    const [loading, setLoading] = useState(false);
    const userRepo = remult.repo(User);

    const showReview = (user) => setViewing(user);
    const closeReview = () => setViewing(null);

    const cardStyle = {
        width: 400,
        margin: 6
    }

    const userStatuses = {
        accountCreated: {
            label: "Account Created",
            filter: {
                applicationApproved: false,
                submittedApplication: false,
                checkedIn: false,
                archived: false
            }
        },
        applicationReceived: {
            label: "Application Received",
            filter: {
                submittedApplication: true,
                applicationApproved: false,
                checkedIn: false,
                archived: false
            }
        },
        approved: {
            label: "Application Approved",
            filter: {
                submittedApplication: true,
                applicationApproved: true,
                checkedIn: false,
                archived: false
            }
        },
        checkedIn: {
            label: "Checked In",
            filter: {
                checkedIn: true,
                archived: false
            }
        },
        archived: {
            label: "Archived",
            filter: {
                archived: true
            }
        },
    };

    // this object is populated in loadUsers based on the counts of users that
    // meet the filters in userStatuses
    const [userStatusCounts, setUserStatusCounts] = useState({});

    const userStatusMenuItems = Object.keys(userStatuses).map(
        key => {
            const count = userStatusCounts[key] ? ` (${userStatusCounts[key]})` : "";
            const label = userStatuses[key].label + count;
            return { label, key };
        }
    );

    const [viewingStatus, setViewingStatus] = useState(
        "applicationReceived"
    );

    const navigateStatuses = (clickedItem) => {
        setViewingStatus(clickedItem.key);
    };

    const loadUsers = () => {
        userRepo
            .find({where: userStatuses[viewingStatus].filter})
            .then(setUsers);
        for (const status of Object.keys(userStatuses)){
            userRepo
                .count(userStatuses[status].filter)
                .then(count => setUserStatusCounts(c => ({...c, [status]: count})));
        }
    }

    useEffect(loadUsers, [viewingStatus]);

    const approveUser = async (user) => {
        setLoading(true);
        await userRepo.save({ id: user.id, applicationApproved: true });
        await Email.sendTemplateEmail(EmailTemplates.Approved, user.email || user.registration.email)
        closeReview();
        setLoading(false);
        loadUsers();
    }

    const checkInUser = async (user) => {
        setLoading(true);
        await userRepo.save({ id: user.id, checkedIn: true });
        closeReview();
        setLoading(false);
        loadUsers();
    }

    const setArchiveStatusForUser = async (user, value) => {
        setLoading(true);
        await userRepo.save({id: user.id, archived: value});
        closeReview();
        setLoading(false);
        loadUsers();
    }

    const getActions = (user) => {
        const checkedIn = user.checkedIn;
        const archived = user.archived;
        const actions = [
            <Button key="archive" type="primary" onClick={() => setArchiveStatusForUser(user, !archived)}>
                {archived ? "Unarchive" : "Archive"}
            </Button>
        ];
        if (user.submittedApplication) {
            actions.push(<Button key="view" onClick={() => showReview(user)}>View Application</Button>);
        }
        if (user.applicationApproved) {
            actions.push(
                <Button key="checkin" disabled={checkedIn} type="primary" onClick={() => checkInUser(user)}>
                    {checkedIn ? "Checked in" : "Check in"}
                </Button>
            );
        }
        // the antd Card component expects an array of "action" components to
        // display at the bottom of the card. however, the way that they space
        // out an array of e.g. three buttons sucks, so i'm adding a custom
        // container to wrap them
        return [<div style={{display: "flex", justifyContent: "space-evenly"}}>
            {actions}
        </div>];
    }

    return <KHELayout>
        <Layout>
            <Sider width={300} theme="light">
                <Menu title="User Statuses" mode="inline" onClick={navigateStatuses}
                    style={{ overflowY: "auto", height: "100%", width: "100%" }}
                    items={userStatusMenuItems}
                    selectedKeys={[viewingStatus]} />
            </Sider>
            <Layout>
                <Content>
                    <div className={style.mainList}>
                        {users.map((user, i) =>
                            <Card
                                key={i}
                                title={user.email}
                                extra={<small>{user.roles.join(", ")}</small>}
                                actions={getActions(user)}
                                style={cardStyle}>
                                {user.submittedApplication && !user.applicationApproved && <strong>This user is awaiting approval!</strong>}
                                <p>This account is registered with <strong>{user.method}</strong>. It was created on <strong>{user.createdAt.toLocaleDateString()}</strong>.</p>
                            </Card>
                        )}
                    </div>
                </Content>
            </Layout>
        </Layout>

        {/* TODO: really do not like this really long JSON access syntax (viewing.registration.someotherlongname),
            this should become its own component at some point 
        */}
        <Modal
            width="800px"
            title={<p>Application for <strong>{viewing?.registration.name}</strong></p>}
            open={viewing !== null}
            onCancel={closeReview}
            onOk={() => approveUser(viewing)}
            okButtonProps={viewing?.applicationApproved ? { disabled: true } : { loading }}
            okText="Approve"
        >
            {viewing &&
                <>
                    <Divider orientation="left" plain>Personal</Divider>
                    <Row gutter={16}>
                        <Col span={8}><strong>Age:</strong> {viewing.registration.age}</Col>
                        <Col span={8}><strong>School:</strong> {viewing.registration.school}</Col>
                        <Col span={8}><strong>Phone:</strong> {viewing.registration.phone}</Col>
                        <Col span={8}><strong>Class Standing:</strong> {viewing.registration.schoolStatus}</Col>
                        <Col span={8}><strong>Gender:</strong> {viewing.registration.gender}</Col>
                        <Col span={8}><strong>Major:</strong> {viewing.registration.major}</Col>
                        <Col span={8}>
                            <strong>Website:</strong>
                            <Tooltip title="Be careful!" color="red">
                                <a href={viewing.registration.link} target="_blank"> {viewing.registration.link}</a>
                            </Tooltip>
                        </Col>
                        <Col span={8}><strong>Attended KHE:</strong> {viewing.registration.attendedKhe ? "Yes" : "No"}</Col>
                        <Col span={8}><strong>Pronouns:</strong> {viewing.registration.pronouns}</Col>
                        <Col span={8}><strong>Ethnicity:</strong> {viewing.registration.ethnicity}</Col>
                        <Col span={8}><strong>Sexuality:</strong> {viewing.registration.sexuality}</Col>
                        <Col span={8}><strong>Shirt Size:</strong> {viewing.registration.shirtSize}</Col>
                        <Col span={8}><strong>State:</strong> {viewing.registration.state}</Col>
                        <Col span={8}><strong>Country:</strong> {viewing.registration.country}</Col>
                    </Row>
                    <Divider orientation="left" plain>Dietary Restrictions</Divider>
                    <Row gutter={16}>
                        <Col span={12}>{viewing.registration.dietaryRestrictions.join(", ") || "This user has no dietary restrictions."}</Col>
                    </Row>
                    <Divider orientation="left" plain>MLH</Divider>
                    <Row gutter={16}>
                        <Col span={12}>{viewing.registration.name} has <strong>{viewing.registration.mlhConduct ? "accepted" : "not accepted"}</strong> the MLH Code of Conduct.</Col>
                        <Col span={12}>{viewing.registration.name} has <strong>{viewing.registration.mlhShare ? "accepted" : "not accepted"}</strong> the MLH Share.</Col>
                    </Row>
                </>
            }
        </Modal>
    </KHELayout>
}