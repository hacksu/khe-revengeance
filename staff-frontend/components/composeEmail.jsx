import dynamic from 'next/dynamic';
import { Input, Space } from 'antd';


const ReactQuill = dynamic(
    () => import('react-quill'),
    { ssr: false }
);

const InputLabel = ({ text }) => (
    <span style={{ display: "inline-block", width: 100, textAlign: "right" }}>
        {text}
    </span>);

export default function ComposeEmail({ onChange }) {
    return <div style={{ display: "flex", flexDirection: "column" }}>
        <Space direction="vertical">
            <Input addonBefore={<InputLabel text="From (name):" />} />
            <Input addonBefore={<InputLabel text="From (address):" />}
                addonAfter="@khe.io" />
            <Input addonBefore={<InputLabel text="Subject:" />} />

            <ReactQuill theme="snow"
                onChange={onChange} placeholder="Write email here." />
        </Space>
    </div>
}