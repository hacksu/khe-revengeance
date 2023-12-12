import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import { Input, Space, Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(
    () => import('react-quill'),
    { ssr: false }
);

// https://stackoverflow.com/a/52311051/3962267
function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
        let encoded = reader.result.toString().replace(/^data:(.*,)?/, '');
        if ((encoded.length % 4) > 0) {
            encoded += '='.repeat(4 - (encoded.length % 4));
        }
        resolve(encoded);
        };
        reader.onerror = error => reject(error);
    });
}

const InputLabel = ({ text }) => (
    <span style={{ display: "inline-block", width: 100, textAlign: "right" }}>
        {text}
    </span>);

export default function ComposeEmail(
    { setEmailForm, defaultFromName, defaultFromEmail, defaultSubject, allowAttachments }
    ) {
    useEffect(() => {
        setEmailForm({
            from: { email: defaultFromEmail + "@khe.io", name: defaultFromName },
            subject: defaultSubject,
            html: "",
            attachments: []
        })
    }, []);

    const attachmentUploadConfig = {
        onRemove: (file) => {
            setEmailForm(form => ({
                ...form,
                // good enough?
                attachments: form.attachments.filter(a => a.filename != file.name)
            }))
        },
        beforeUpload: async (file) => {
            const content = await getBase64(file);
            setEmailForm(f => ({
                ...f, 
                attachments: f.attachments.concat({
                    filename: file.name,
                    content
                })
            }));
            return false;
        }
    }

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
            
            {allowAttachments ? 
                <Upload {...attachmentUploadConfig} style={{display: "flex"}}>
                    <Button icon={<UploadOutlined />}>Add attachment</Button>
                </Upload>
            : null }
        </Space>
    </div>
}