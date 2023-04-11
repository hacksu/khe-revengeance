import React, { useState, useEffect, useRef } from "react";
import dynamic from 'next/dynamic';
import KHELayout from "../layouts/layout.jsx";
import { remult } from "remult";
import 'react-quill/dist/quill.snow.css';
import { Email, EmailSource, isEmailRegex } from "../../global-includes/email-address.ts";
import { Card, Menu, Layout, Button, Input, Upload, Popconfirm, Select } from "antd";
const { Sider, Footer, Content } = Layout;
import { PlusCircleOutlined, PlusOutlined, UploadOutlined, DeleteOutlined } from "@ant-design/icons";
import layoutStyle from "../layouts/layout.module.css";
import style from "./emailLists.module.css";

function strToMenuOption(str) {
    return { key: str, label: str };
}

const ReactQuill = dynamic(
    () => import('react-quill'),
    { ssr: false }
);

export default function EmailLists() {
    const [emails, setEmails] = useState([]);
    const [list, setList] = useState(EmailSource.Early2023);
    const [allLists, setAllLists] = useState(Object.values(EmailSource).sort().map(strToMenuOption));
    const updateCurrentList = () => {
        Email.getEmailList(list).then(rows => {
            setEmails(rows);
        });
    };
    useEffect(updateCurrentList, [list]);
    useEffect(() => {
        Email.getEmailSources().then(sources => {
            setAllLists(sources.sort().map(strToMenuOption));
        });
    }, []);
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
            });
        }
    }
    const addArray = (file) => {
        console.log(file);
        const reader = new FileReader();
        reader.addEventListener(
            "load",
            () => {
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
                        proceed = confirm("The following emails failed validation:\n" + badEmails.join("\n") + "\n\nProceed?");
                    }
                    if (proceed) {
                        Email.bulkAdd(list, emails).then((newListContents) => {
                            setEmails(newListContents);
                        });
                    }
                } catch (e) {
                    alert("not good file :( expected array of email address strings.\n" + e.toString());
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
    const [composing, setComposing] = useState(true);
    const [composition, setComposition] = useState("");
    const [recipients, setRecipients] = useState([])
    const cardStyle = {
        width: 200,
        margin: 6
    }
    const cardBodyStyle = {
        padding: 15, textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        overflow: "hidden"
    }
    const getMenu = () => {
        return [
            { key: "__compose", label: "Write a mail" },
            { key: "__list", label: "Email Lists", children: allLists }
        ];
    }
    const menuNavigation = (info) => {
        if (info.keyPath[1] == "__list") {
            setComposing(false);
            setList(info.key);
        } else if (info.key == "__compose") {
            setComposing(true);
        }
    };
    return <KHELayout>
        <Layout style={{ height: "100%" }}>
            <Sider width={200} theme="light">
                <Menu title="Email Lists" mode="inline" onClick={menuNavigation}
                    items={getMenu()} selectedKeys={composing ? "__compose" : [list]}
                    defaultOpenKeys={["__list"]} defaultSelectedKeys={["__compose"]}
                    className={layoutStyle.sidebarWidth} />
                {addingList ? <Input
                    ref={newListInput} placeholder="Name of new list"
                    onPressEnter={addList}
                    suffix={<PlusOutlined onClick={addList} />}
                /> :
                    <div style={{ width: "100%", textAlign: "center" }}>
                        <Button onClick={() => setAddingList(true)}><PlusCircleOutlined /></Button>
                    </div>
                }
            </Sider>
            {composing ?
                <Layout style={{ padding: 20, maxWidth: 800 }}>
                    <ReactQuill style={{ minHeight: 200 }} theme="snow" value={composition} onChange={setComposition} />
                    <div style={{ marginTop: 10, display: "flex" }}>
                        <Select
                            mode="multiple"
                            allowClear
                            style={{ width: '100%' }}
                            placeholder="Select Recipients"
                            onChange={setRecipients}
                            options={allLists.map(l => ({ label: l.label, value: l.key }))}
                        />
                        <Button type="primary">Send</Button>
                    </div>
                </Layout> :
                <Layout>
                    <Content>
                        <div className={style.mainList}>
                            <Card style={{ ...cardStyle, textAlign: "center" }} bodyStyle={cardBodyStyle}>
                                {addingEmail ?
                                    <Input
                                        ref={newEmailInput} placeholder="address@host.com"
                                        onPressEnter={addEmail}
                                        suffix={<PlusOutlined onClick={addEmail} />} /> :
                                    <PlusCircleOutlined onClick={() => setAddingEmail(true)} />}
                            </Card>
                            {emails.map((e, i) =>
                                <div className={style.cardContainer} key={i}>
                                    <Card style={cardStyle} bodyStyle={cardBodyStyle}>
                                        <span title={e.address}>{e.address}</span>
                                    </Card>
                                    <DeleteOutlined onClick={() => deleteEmail(e, i)} />
                                </div>
                            )}
                        </div>
                    </Content>
                    <Footer style={{ height: 70, display: "flex" }}>
                        <Upload showUploadList={false} beforeUpload={addArray} accept="application/json">
                            <Button icon={<UploadOutlined />}>Add from JSON File</Button>
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
    </KHELayout>
}
