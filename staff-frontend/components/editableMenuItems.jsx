import { useState, useRef } from "react";
import { Input, Menu, Button } from "antd";
import { EditOutlined, SaveOutlined, PlusOutlined } from "@ant-design/icons";
import style from "./editableMenuItems.module.css";


export default function EditableMenu({ labels, onEdit, onAdd, enclose, menuTitle, keyForAddButton, ...otherMenuProps }) {
    const [editing, setEditing] = useState(-1);
    const [addingItem, setAddingItem] = useState(false);
    const newItemInput = useRef();
    const editingItemInput = useRef();
    const addItem = () => {
        const name = newItemInput?.current?.input?.value;
        if (name?.trim()) {
            newItemInput.current.input.value = "";
            setAddingItem(false);
            onAdd(name);
        }
    };
    const updateEditedItem = () => {
        const name = editingItemInput?.current?.input?.value;
        if (name?.trim()) {
            editingItemInput.current.input.value = "";
            let index = editing;
            setEditing(-1);
            onEdit(index, name);
        }
    }
    const contents = labels.map((l, i) => ({
        key: l,
        label: <>
            {editing != i ?
                <span className={style.menuItem}>
                    <span className={style.menuText}>{l}</span>
                    <Button icon={<EditOutlined />} onClick={() => setEditing(i)}
                        style={{ flexShrink: 0 }} />
                </span>
                : <Input
                    onBlur={() => setEditing(-1)}
                    ref={(node) => { if (node) { node.focus(); editingItemInput.current = node } }}
                    placeholder="Item name"
                    defaultValue={labels[editing]}
                    onPressEnter={updateEditedItem}
                    suffix={<SaveOutlined onClick={updateEditedItem} />}
                />
            }
        </>
    })).concat({
        key: keyForAddButton || "__add", label: addingItem ? <Input
            ref={newItemInput} placeholder="Name of new thing"
            onPressEnter={addItem}
            suffix={<PlusOutlined onClick={addItem} />}
        /> :
            <div style={{ width: "100%", textAlign: "left" }}>
                <div onClick={() => setAddingItem(true)}>
                    <PlusOutlined /> Add new...
                </div>
            </div>
    });
    return <Menu items={enclose ? enclose(contents) : contents} {...otherMenuProps} />
}
