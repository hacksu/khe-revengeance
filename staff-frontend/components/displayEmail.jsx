import { useEffect, useState } from "react"
import { SentListMail } from "../../global-includes/email-address"
import { remult } from "remult";

export function DisplayEmail({ mailData }) {
    return <div>
        {mailData.from?.name && mailData.from?.email ?
            <><p><strong>From (name):</strong> {mailData.from.name}</p>
                <p><strong>From (email):</strong> {mailData.from.email}</p></>
            : <p><strong>From: </strong>{JSON.stringify(mailData.from)}</p>
        }
        <p><strong>To:</strong> {Array.isArray(mailData.to) ?
            (mailData.to.map((t, i) => <>
                <span key={i}>{JSON.stringify(t)}</span>
                {i != mailData.to.length - 1 ? ", " : ""}
            </>)) :
            <span>{JSON.stringify(mailData.to)}</span>
        }</p>
        <p><strong>Subject:</strong> {mailData.subject}</p>
        <p><strong>Contents:</strong></p>
        <iframe style={{ width: "100%", height: 200 }} srcDoc={mailData.html} />
    </div>
}

export default function SentEmail() {
    const [sentMail, setSentMail] = useState([]);
    useEffect(() => {
        remult.repo(SentListMail).find({ orderBy: { sentAt: "desc" } }).then(setSentMail);
    }, []);
    return <div style={{ height: "100%", overflowY: "auto", padding: 10 }}>
        {sentMail.map(({ mailData, id }) => <>
            <DisplayEmail mailData={mailData} key={id} />
            <hr />
        </>)}
    </div>;
}