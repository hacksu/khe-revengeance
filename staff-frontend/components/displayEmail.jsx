import { useEffect, useState } from "react"
import { SentListMail } from "../../global-includes/email-address"
import { remult } from "remult";

export function DisplayEmail({ mailData, sentAt }) {
    const showByDefault = 5;
    const [showingAll, setShowingAll] = useState(
        !Array.isArray(mailData.to) || mailData.to.length < showByDefault
    );
    return <div>
        <p><strong>Sent at:</strong> {sentAt?.toLocaleString()}</p>
        {mailData.from?.name && mailData.from?.email ?
            <><p><strong>From (name):</strong> {mailData.from.name}</p>
                <p><strong>From (email):</strong> {mailData.from.email}</p></>
            : <p><strong>From: </strong>{JSON.stringify(mailData.from)}</p>
        }
        <p><strong>To:</strong> {Array.isArray(mailData.to) ?
            <>{(mailData.to.slice(0, showingAll ? mailData.to.length : showByDefault)
                .map((t, i) => <>
                    <span key={i}>{JSON.stringify(t)}</span>
                    {!showingAll || i != mailData.to.length - 1 ? ", " : ""}
                </>))}
                {!showingAll &&
                    <span style={{ textDecoration: "underline", cursor: "pointer" }}
                        onClick={() => setShowingAll(true)}>
                        show all
                    </span>}
            </> :
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
        {sentMail.map(({ mailData, id, sentAt }) => <>
            <DisplayEmail sentAt={sentAt} mailData={mailData} key={id} />
            <hr />
        </>)}
    </div>;
}