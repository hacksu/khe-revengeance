import { useEffect, useState } from "react";
import { remult } from "remult";
import KHELayout from "../layouts/layout";
import { Redirect } from "../../global-includes/redirect-link";
import { Input, Button } from "antd";
import { DeleteOutlined, SaveOutlined } from "@ant-design/icons";

export default function RedirectCreator() {
    const [redirects, setRedirects] = useState([]);
    const [lastSaved, setLastSaved] = useState([]);

    const repo = remult.repo(Redirect);

    const update = () => {
        repo.find().then(r => {
            setRedirects(r.concat({ id: "new", href: "", destURL: "" }));
            setLastSaved(r);
        })
    };

    useEffect(update, []);

    const edit = (index, property, value) => {
        setRedirects(current => current.slice(0, index)
            .concat({ ...current[index], [property]: value.trim() })
            .concat(current.slice(index + 1)));
    };

    const save = async (index) => {
        if (index < lastSaved.length) {
            // .update doesn't like when you update an entity with a unique
            // field when the non-updated version has the same value as the new
            // version for that unique field??
            await repo.save(redirects[index]);
        } else if (index == lastSaved.length) {
            await repo.insert(redirects[index]);
        }
        update();
    }

    const del = async (index) => {
        repo.delete(redirects[index].id).then(update);
    };

    return <KHELayout>
        {redirects
            .map((r, i) => <div key={r.id} style={{ display: "flex", gap: 10, margin: 30, alignItems: "center" }}>
                <Input style={{ width: 200 }} addonBefore="khe.io/" value={r.href}
                    placeholder="github" onChange={e => edit(i, "href", e.target.value)} />
                <span>will redirect to:</span>
                <Input style={{ width: 200 }} value={r.destURL}
                    placeholder="https://github.com/hacksu" onChange={e => edit(i, "destURL", e.target.value)}
                    onPressEnter={() => save(i)} />
                <Button icon={<SaveOutlined />}
                    disabled={
                        !redirects[i].href.trim() || !redirects[i].href.trim() ||
                        (lastSaved[i]?.href == redirects[i].href &&
                            lastSaved[i]?.destURL == redirects[i].destURL)}
                    onClick={() => save(i)}
                />
                <Button icon={<DeleteOutlined />} disabled={i == redirects.length - 1} onClick={() => del(i)} />
            </div>)}
    </KHELayout>
}