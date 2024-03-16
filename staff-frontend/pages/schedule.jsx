import { useEffect, useMemo, useState } from "react";
import { remult } from "remult";
import KHELayout from "../layouts/layout";

import { Layout, Form, Table, Input, Typography, Popconfirm, Button } from "antd";
import { DownCircleOutlined, ScheduleFilled, UpCircleFilled, UpCircleOutlined } from "@ant-design/icons";
import EditableMenu from "../components/editableMenuItems";
import layoutStyle from "../layouts/layout.module.css";
import { Schedule } from "../../global-includes/schedule";
const { Sider } = Layout;

const EditableCell = ({ editing, dataIndex, title, inputType, record, index, children, ...restProps }) => {
    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{ margin: 0 }}
                    rules={[{ required: true, message: `Please Input ${title}!` }]}
                >
                    {inputType == "textarea" ? <Input.TextArea /> : <Input type={inputType} />}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};

export default function ScheduleManager() {

    const [form] = Form.useForm();
    const [editingKey, setEditingKey] = useState('');
    const isEditing = record => record?.key === editingKey;

    const [schedules, setSchedules] = useState([]);
    const [schedule, setSchedule] = useState();

    const repo = remult.repo(Schedule);

    // need the key to be index, goofy, IK
    const loadSchedules = async () => {
        const schedules = await repo.find();
        setSchedules(schedules.map(schedule => {
            schedule.items = schedule.items.map((item, index) => {
                item.key = index;
                return item;
            });
            return schedule;
        }));
    }

    const addSchedule = async (name) => {
        await repo.insert({ name, year: new Date().getFullYear() });
        await loadSchedules();
    }

    const editSchedule = async (id, name) => {
        await repo.update(id, { name });
        await loadSchedules();
    }

    const saveSchedule = async (key = undefined) => {
        const items = schedule.items;
        if (key != undefined) {
            const row = await form.validateFields();
            console.log(row);
            items.splice(key, 1, row);
        }
        
        // remap keys to new values
        items.map((item, index) => { 
            item.key = index; 
            return item; 
        });

        setSchedule(schedule => ({ ...schedule, items: [...items] })) // REACT MOMENT
        await repo.update(schedule.id, { items: schedule.items });
        setEditingKey('');
    }

    useEffect(() => { loadSchedules() }, []);

    const columns = [
        { title: 'Title', dataIndex: 'name', inputType: 'text', width: '25%', editable: true },
        { title: 'Description', dataIndex: 'description', inputType: 'textarea', width: '25%', editable: true },
        { title: 'Date and time', dataIndex: 'date', inputType: 'datetime-local', width: '15%', editable: true },
        {
            title: '',
            dataIndex: 'operation',
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <Typography.Link onClick={() => saveSchedule(record.key)} style={{ marginRight: 8 }}>
                            Save
                        </Typography.Link>
                        <Popconfirm title="Sure to cancel?" onConfirm={() => setEditingKey('')}>
                            <a>Cancel</a>
                        </Popconfirm>
                    </span>
                ) : (
                    <Typography.Link disabled={editingKey !== ''} onClick={() => {
                        form.setFieldsValue({ ["dataIndex" in columns]: "", ...record });
                        setEditingKey(record.key);
                    }}>
                        Edit
                    </Typography.Link>
                );
            },
        },
        {
            title: '',
            dataIndex: 'operation',
            render: (_, record) => {
                return <div style={{ display: "flex", justifyContent: "space-around" }}>
                    <Typography.Link disabled={record.key <= 0} onClick={() => {
                        const items = schedule.items;
                        items.splice(record.key, 1);
                        items.splice(record.key - 1, 0, record);
                        saveSchedule();
                    }}>
                        <UpCircleOutlined />
                    </Typography.Link>
                    <Typography.Link disabled={record.key >= schedule.items.length - 1} onClick={() => {
                        const items = schedule.items;
                        items.splice(record.key, 1);
                        items.splice(record.key + 1, 0, record);
                        saveSchedule();
                    }}>
                        <DownCircleOutlined />
                    </Typography.Link>
                </div>
            },
        },
    ];

    const mergedColumns = columns.map((col) => {
        if (!col.editable) return col;
        return {
            ...col,
            onCell: (record) => ({
                record,
                inputType: col.inputType,
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });

    const menuKeys = { list: "__list", add: "__add" }
    const [page, setPage] = useState(menuKeys.list);
    const menuNavigation = (info) => {
        if (info.keyPath[1] == menuKeys.list && info.keyPath[0] != menuKeys.add) {
            setPage(menuKeys.list);

            const schedule = schedules.find(s => s.name == info.key);
            setSchedule(schedule);
        }
    };

    const menu = useMemo(() =>
        <EditableMenu
            selectedKeys={[page == menuKeys.list ? schedule?.name : page]}
            defaultOpenKeys={[menuKeys.list]} defaultSelectedKeys={[menuKeys.home]}
            className={layoutStyle.sidebarWidth}
            title="Schedules" mode="inline" inlineIndent={10}
            labels={schedules.map(schedule => schedule.name)}
            onClick={menuNavigation}
            onEdit={(index, newScheduleName) => editSchedule(schedules[index].id, newScheduleName)}
            onAdd={newScheduleName => addSchedule(newScheduleName)}
            keyForAddButton={menuKeys.add}
            enclose={editableSection => [{ key: menuKeys.list, label: "Schedules", children: editableSection }]}
        />,
        [schedules, page, schedule]
    );

    return <KHELayout>
        <Layout style={{ height: "100%" }}>
            <Sider width={200} theme="light">{menu}</Sider>
            <Layout style={{ padding: "20px" }}>
                {schedule &&
                    <>
                        <Button onClick={() => setSchedule(({ ...schedule, items: [...schedule.items, { ["dataIndex" in columns]: "", key: schedule.items.length }] }))}
                            style={{ width: "15%", marginBottom: "10px" }}
                            type="primary">
                            <ScheduleFilled /> Add schedule item
                        </Button>
                        <Form form={form} component={false}>
                            <Table
                                components={{ body: { cell: EditableCell } }}
                                bordered
                                dataSource={schedule.items}
                                columns={mergedColumns}
                                rowClassName="editable-row"
                                pagination={false}
                            />
                        </Form>
                    </>
                }
            </Layout>
        </Layout>
    </KHELayout>
}