import React, { useState, useEffect, useRef } from "react";
import KHELayout from "../layouts/layout.jsx";
import { remult } from "remult";

import { Email, EmailListNotes, EmailSource, SentListMail, isEmailRegex } from "../../global-includes/email-address.ts";
import { Card, Layout, Button, Input, Upload, Popconfirm, Select, Modal } from "antd";
const { Sider, Footer, Content } = Layout;
const { confirm, error } = Modal;
const { Meta } = Card;
import { PlusOutlined, UploadOutlined, DeleteOutlined, FileAddFilled, SaveOutlined } from "@ant-design/icons";
import layoutStyle from "../layouts/layout.module.css";
import style from "./emailLists.module.css";
import ComposeEmail from "../components/composeEmail.jsx";
import SentEmail from "../components/displayEmail.jsx";
import EditableMenu from "../components/editableMenuItems.jsx";

export default function EmailLists() {

    const [emails, setEmails] = useState([]); // TODO: an email is a complex list of fields, but can also be a string
    
    const [list, setList] = useState(EmailSource.Early2023);
    const [allLists, setAllLists] = useState(Object.values(EmailSource).sort());
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
            setAllLists(sources.sort());
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
                    
                    // we import the items as a indescript list
                    let imported = JSON.parse(reader.result);
                    if (!Array.isArray(imported)) throw "file was not an array";
                    if (imported.length == 0) throw "array was empty";

                    // we need to validate each item in the array, can be an object or string for backwards compatibility
                    let objects = [];
                    for (const object of imported) {
                        if (typeof object === "object") {
                            if (!object["address"]) throw `missing "address" field on ${JSON.stringify(object)}`;
                            if (!object["name"]) throw `missing "name" field on ${JSON.stringify(object)}`;
                            if (!object["organization"]) throw `missing "organization" field on ${JSON.stringify(object)}`;
                            objects.push(object);
                        } 
                        else if (typeof object === "string") objects.push({ address: object });
                        else throw `${JSON.stringify(object)} is not an object or string`;
                    }

                    const badEmails = objects.filter(e => !isEmailRegex.test(e.address));
                    objects = objects.filter(e => isEmailRegex.test(e.address));

                    let proceed = true;
                    if (badEmails.length > 0) {
                        proceed = await new Promise(resolve => confirm({
                            title: "Adding items from JSON",
                            icon: <FileAddFilled />,
                            content: <>
                                        <p>This will add {emails.length} items to "{list}".</p>
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
                        Email.bulkAdd(list, objects).then((newListContents) => {
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
    const [addingEmail, setAddingEmail] = useState(false);
    const newEmailInput = useRef();
    const deleteEmail = async (index) => {
        await remult.repo(Email).delete(emails[index]);
        setEmails(e => e.filter((_, i) => i != index));
    }
    const deleteCurrentList = async () => {
        await Email.bulkDelete(list);
        setList(allLists[0]);
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
    const [recipientFields, setRecipientFields] = useState([]);
    useEffect(() => {
        // i <3 race conditions
        Email.getEmailListFields(recipients).then(
            fields => setRecipientFields(fields.filter(f => f != "id"))
        );
    }, [recipients]);
    const sendAMail = async () => {
        await SentListMail.sendToLists(
            recipients, emailForm.subject, emailForm.from, emailForm.html
        );
        setPage(menuKeys.sent);
    };
    const cardStyle = {
        width: 250,
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
    // TODO: could memoize this?
    const menu = <EditableMenu
        selectedKeys={[page == menuKeys.list ? list : page]}
        defaultOpenKeys={[menuKeys.list]} defaultSelectedKeys={[menuKeys.compose]}
        className={layoutStyle.sidebarWidth}
        title="Email Lists" mode="inline" inlineIndent={10}
        labels={allLists}
        onClick={menuNavigation}
        onEdit={(index, newListName) => {
            Email.bulkRename(allLists[index], newListName);
            setAllLists(l => l.slice(0, index)
                .concat([newListName])
                .concat(l.slice(index + 1)));
        }}
        onAdd={(newListName) => {
            setAllLists(l => l.concat(newListName));
            setList(newListName);
        }}
        keyForAddButton={menuKeys.add}
        enclose={editableSection => [
            { key: menuKeys.compose, label: "Write a mail" },
            {
                key: menuKeys.list, label: "Email Lists",
                children: editableSection
            },
            { key: menuKeys.sent, label: "Mail what was sent" }
        ]}
    />
    return <KHELayout>
        <Layout style={{ height: "100%" }}>
            <Sider width={200} theme="light">{menu}</Sider>
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
                            options={allLists.map(l => ({ label: l, value: l }))}
                        />
                        <Button onClick={sendAMail} type="primary">Send</Button>
                    </div>
                    {recipientFields.length ? <>
                        <p>The selected recipients all have the following metadata: {
                            recipientFields.map(
                                (f, i) => <>{i ? ", " : ""}
                                <pre style={{display:"inline"}}>{f}</pre>
                            </>)
                        }</p>
                        <p>Use them in the email body like this:{" "}
                            {/* &#123; is left curly brace; &#125 is right curly brace */}
                            <pre style={{display: "inline"}}>
                                &#123;&#123;{recipientFields[0]}&#125;&#125;
                            </pre>
                        </p>
                    </> : null }
                </Layout>
                :
                page == menuKeys.sent ?
                    <Layout>
                        <h2 style={{ marginTop: 20, marginLeft: 10 }}>Mail what was sent</h2>
                        <Content style={{ maxHeight: "100%", overflowY: "auto" }}>
                            <div style={{ width: 800, maxWidth: "100%" }}>
                                <SentEmail />
                            </div>
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
                                        <Card 
                                            title={e.name} 
                                            extra={e.organization ? <small>{e.organization}</small> : undefined}
                                            style={cardStyle} 
                                            bodyStyle={cardBodyStyle}>
                                            <span title={e.address}>{e.address}</span>
                                        </Card>
                                        {// emails that come from site user accounts cannot be deleted
                                            list != EmailSource.SiteUsers &&
                                            <DeleteOutlined onClick={() => deleteEmail(i)} />}
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
