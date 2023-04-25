import React, { useState, useEffect, useRef } from "react";
import KHELayout from "../layouts/layout.jsx";
import { remult } from "remult";
import 'react-quill/dist/quill.snow.css';
import { Email, EmailListNotes, EmailSource, SentListMail, isEmailRegex } from "../../global-includes/email-address.ts";
import { Card, Menu, Layout, Button, Input, Upload, Popconfirm, Select, Modal } from "antd";
const { Sider, Footer, Content } = Layout;
const { confirm, error } = Modal;
import { PlusOutlined, UploadOutlined, DeleteOutlined, FileAddFilled, SaveOutlined } from "@ant-design/icons";
import layoutStyle from "../layouts/layout.module.css";
import style from "./emailLists.module.css";
import ComposeEmail from "../components/composeEmail.jsx";
import SentEmail from "../components/displayEmail.jsx";

function strToMenuOption(str) {
    return { key: str, label: str };
}

export default function EmailLists() {
    const [emails, setEmails] = useState([]);
    const [list, setList] = useState(EmailSource.Early2023);
    const [allLists, setAllLists] = useState(Object.values(EmailSource).sort().map(strToMenuOption));
    const [listNote, setListNote] = useState("");
    const noteInDB = useRef(false);
    const [noteSaved, setNoteSaved] = useState(true);
    const editNote = (value) => {
        setNoteSaved(false);
        setListNote(value);
    }
    const updateCurrentList = () => {
        Email.getEmailList(list).then(setEmails);
        remult.repo(EmailListNotes).findFirst({ listName: list })
            .then(n => {
                if (n) { setListNote(n.notes); noteInDB.current = true; }
                else { setListNote(""); noteInDB.current = false; }
            });
    };
    useEffect(updateCurrentList, [list]);
    useEffect(() => {
        Email.getEmailSources().then(sources => {
            setAllLists(sources.sort().map(strToMenuOption));
        });
    }, []);
    const saveNote = () => {
        if (!noteInDB.current) {
            remult.repo(EmailListNotes).insert({ listName: list, notes: listNote },)
                .then(() => { setNoteSaved(true); noteInDB.current = true });
        } else {
            remult.repo(EmailListNotes).save({ listName: list, notes: listNote },)
                .then(() => setNoteSaved(true));
        }
    };
    const [addingList, setAddingList] = useState(false);
    const newListInput = useRef();
    const [addingEmail, setAddingEmail] = useState(false);
    const newEmailInput = useRef();
    const addList = () => {
        const name = newListInput?.current?.input?.value;
        if (name?.trim()) {
            setAllLists(al => al.concat([strToMenuOption(name)]));
            newListInput.current.input.value = "";
            setAddingList(false);
            setList(name);
        }
    };
    const addEmail = () => {
        const address = newEmailInput?.current?.input?.value;
        if (address?.trim()) {
            remult.repo(Email).insert({
                address,
                source: list
            }).then(() => {
                updateCurrentList();
                newEmailInput.current.input.value = "";
                setAddingEmail(false);
            });  // TODO: catch errors, display Message. will fail silently for now
        }
    }
    const addArray = (file) => {
        console.log(file);
        const reader = new FileReader();
        reader.addEventListener(
            "load",
            async () => {
                try {
                    let emails = JSON.parse(reader.result);
                    if (!Array.isArray(emails)) {
                        throw "file was not an array";
                    }
                    if (emails.length == 0) {
                        throw "array was empty";
                    }
                    for (const address of emails) {
                        if (typeof address !== "string") {
                            throw JSON.stringify(address) + " is not a string";
                        }
                    }
                    emails = emails.map(e => e.trim());
                    const badEmails = emails.filter(e => !isEmailRegex.test(e));
                    emails = emails.filter(e => isEmailRegex.test(e));
                    let proceed = true;
                    if (badEmails.length > 0) {
                        proceed = await new Promise(resolve => confirm({
                            title: 'Adding items from JSON',
                            icon: <FileAddFilled />,
                            content: <><p>This will add {emails.length} items to "{list}".</p>
                                <p>The following emails failed validation and will be skipped:</p>
                                <pre>{badEmails.join("\n")}</pre>
                                <p>Proceed?</p>
                            </>,
                            onOk() {
                                resolve(true);
                            },
                            onCancel() {
                                resolve(false);
                            },
                        }));
                    }
                    if (proceed) {
                        Email.bulkAdd(list, emails).then((newListContents) => {
                            setEmails(newListContents);
                        });
                    }
                } catch (e) {
                    error({
                        title: "not good file :(",
                        content: <>
                            <p>Error message:</p>
                            <pre style={{ whiteSpace: "normal" }}>{e.toString()}</pre>
                        </>
                    });
                }
            },
            false
        );
        if (file) {
            reader.readAsText(file);
        }
        return false;
    };
    const deleteEmail = async (email, index) => {
        await remult.repo(Email).delete(email);
        setEmails(e => e.filter((_, i) => i != index));
    }
    const deleteCurrentList = async () => {
        await Email.bulkDelete(list);
        setList(allLists[0]?.key);
        setAllLists(lists => lists.filter(l => l.key != list));
        updateCurrentList();
    };
    const [emailForm, setEmailForm] = useState({
        from: {
            email: "",
            name: ""
        },
        subject: "",
        html: ""
    });
    const [recipients, setRecipients] = useState([]);
    const sendAMail = async () => {
        await SentListMail.sendToLists(
            recipients, emailForm.subject, emailForm.from, emailForm.html
        );
        setPage(menuKeys.sent);
    };
    const cardStyle = {
        width: 200,
        margin: 6
    }
    const cardBodyStyle = {
        padding: 15, textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        overflow: "hidden"
    }
    // hopefully no-one creates a new email list with the name "__add". the
    // other two are fine because they're used for higher-level menu items
    const menuKeys = {
        compose: "__compose",
        list: "__list",
        add: "__add",
        sent: "__sent"
    }
    const getMenu = () => {
        return [
            { key: menuKeys.compose, label: "Write a mail" },
            {
                key: menuKeys.list, label: "Email Lists", children: allLists.concat([{
                    key: menuKeys.add, label: addingList ? <Input
                        ref={newListInput} placeholder="Name of new list"
                        onPressEnter={addList}
                        suffix={<PlusOutlined onClick={addList} />}
                    /> :
                        <div style={{ width: "100%", textAlign: "left" }}>
                            <div onClick={() => setAddingList(true)}>
                                <PlusOutlined /> Add new...
                            </div>
                        </div>
                }])
            },
            { key: menuKeys.sent, label: "Mail what was sent" }
        ];
    }
    const [page, setPage] = useState(menuKeys.compose);
    const menuNavigation = (info) => {
        if (info.keyPath[1] == menuKeys.list && info.keyPath[0] != menuKeys.add) {
            setPage(menuKeys.list);
            setList(info.key);
        } else if (info.key == menuKeys.compose) {
            setPage(menuKeys.compose)
        } else if (info.key == menuKeys.sent) {
            setPage(menuKeys.sent);
        }
    };
    return <KHELayout>
        <Layout style={{ height: "100%" }}>
            <Sider width={200} theme="light">
                <Menu title="Email Lists" mode="inline" onClick={menuNavigation}
                    items={getMenu()} selectedKeys={[list, page]}
                    defaultOpenKeys={[menuKeys.list]} defaultSelectedKeys={[menuKeys.compose]}
                    className={layoutStyle.sidebarWidth} />
            </Sider>
            {page == menuKeys.compose ?
                <Layout style={{ padding: 20, maxWidth: 800 }}>
                    <ComposeEmail setEmailForm={setEmailForm} />
                    <div style={{ marginTop: 10, display: "flex" }}>
                        <Select
                            mode="multiple"
                            allowClear
                            style={{ width: '100%', marginRight: 5 }}
                            placeholder="Select Recipients"
                            onChange={setRecipients}
                            options={allLists.map(l => ({ label: l.label, value: l.key }))}
                        />
                        <Button onClick={sendAMail} type="primary">Send</Button>
                    </div>
                </Layout>
                :
                page == menuKeys.sent ?
                    <Layout>
                        <Content>
                            <SentEmail />
                        </Content>
                    </Layout>
                    :
                    <Layout>
                        <Content>
                            <div className={style.mainList}>
                                <Card style={{ ...cardStyle, textAlign: "center" }} bodyStyle={cardBodyStyle}>
                                    {addingEmail ?
                                        <Input
                                            ref={newEmailInput} placeholder="address@host.com"
                                            onPressEnter={addEmail}
                                            suffix={<PlusOutlined onClick={addEmail} />} /> :
                                        <Button size="small" type="text" icon={<PlusOutlined />}
                                            onClick={() => setAddingEmail(true)}>
                                            Add new...
                                        </Button>}
                                </Card>
                                {emails.map((e, i) =>
                                    <div className={style.cardContainer} key={i}>
                                        <Card style={cardStyle} bodyStyle={cardBodyStyle}>
                                            <span title={e.address}>{e.address}</span>
                                        </Card>
                                        {// emails that come from site user accounts cannot be deleted
                                            list != EmailSource.SiteUsers &&
                                            <DeleteOutlined onClick={() => deleteEmail(e, i)} />}
                                    </div>
                                )}
                            </div>
                        </Content>
                        <Footer className={style.footer}>
                            Notes: <Input value={listNote}
                                onChange={e => editNote(e.target.value)}
                                onPressEnter={saveNote} />
                            <Button disabled={noteSaved}
                                icon={<SaveOutlined />} onClick={saveNote}>
                                Save Notes
                            </Button>
                            <Upload showUploadList={false} beforeUpload={addArray}
                                accept="application/json">
                                <Button icon={<UploadOutlined />}>Upload JSON File</Button>
                            </Upload>
                            <Popconfirm
                                title={"Deleting \"" + list + "\""}
                                description="Are you 100% sure?"
                                onConfirm={deleteCurrentList}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button style={{ marginLeft: 10 }} danger>Delete List</Button>
                            </Popconfirm>
                        </Footer>
                    </Layout>
            }
        </Layout>
    </KHELayout >
}
