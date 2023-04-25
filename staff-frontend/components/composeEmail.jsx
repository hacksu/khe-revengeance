import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import { Input, Space } from 'antd';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(
    () => import('react-quill'),
    { ssr: false }
);

const InputLabel = ({ text }) => (
    <span style={{ display: "inline-block", width: 100, textAlign: "right" }}>
        {text}
    </span>);

export default function ComposeEmail({ setEmailForm, defaultFromName, defaultFromEmail, defaultSubject }) {
    useEffect(() => {
        setEmailForm({
            from: { email: defaultFromEmail + "@khe.io", name: defaultFromName },
            subject: defaultSubject,
            html: ""
        })
    }, []);
    return <div style={{ display: "flex", flexDirection: "column" }}>
        <Space direction="vertical">
            <Input defaultValue={defaultFromName}
                onChange={e => setEmailForm(f => ({
                    ...f,
                    from: { ...f.from, name: e.target.value }
                }))
                } addonBefore={<InputLabel text="From (name):" />} />
            <Input defaultValue={defaultFromEmail}
                onChange={e => setEmailForm(f => ({
                    ...f,
                    from: { ...f.from, email: e.target.value + "@khe.io" }
                }))
                } addonBefore={<InputLabel text="From (address):" />}
                addonAfter="@khe.io" />
            <Input defaultValue={defaultSubject}
                onChange={e => setEmailForm(f => ({
                    ...f,
                    subject: e.target.value
                }))
                } addonBefore={<InputLabel text="Subject:" />} />

            <ReactQuill theme="snow"
                onChange={html => setEmailForm(f => ({
                    ...f,
                    html
                }))} placeholder="Write email here." />
        </Space>
    </div>
}