import { useEffect, useState } from "react"
import { SentListMail } from "../../global-includes/email-address"
import { remult } from "remult";

function addressAsString(stringOrObj) {
    if (stringOrObj.email || stringOrObj.name) {
        return `"${stringOrObj.name}" <${stringOrObj.email}>`;
    } else if (typeof stringOrObj == "string") {
        return stringOrObj;
    } else {
        return "<not sent as an email>";
    }
}

function DisplayAddresses({ addresses }) {
    const showByDefault = 5;
    const [showingAll, setShowingAll] = useState(
        !Array.isArray(addresses) || addresses.length < showByDefault
    );
    if (Array.isArray(addresses)) {
        return <>
            {(addresses.slice(0, showingAll ? addresses.length : showByDefault)
                .map((t, i) => <>
                    <span key={i}>{addressAsString(t)}</span>
                    {!showingAll || i != addresses.length - 1 ? ", " : ""}
                </>))}
            {!showingAll &&
                <span style={{ textDecoration: "underline", cursor: "pointer" }}
                    onClick={() => setShowingAll(true)}>
                    show all
                </span>}
        </>;
    } else if (!addresses) {
        return "<empty>";
    } else {
        return addressAsString(addresses);
    }
}

export function DisplayEmail({ mailData, sentAt }) {
    // this iframe security policy for untrusted emails is based on this:
    // https://making.close.com/posts/rendering-untrusted-html-email-safely
    const iframe = document.createElement('iframe');
    const isHtmlEmailSupported = 'sandbox' in iframe && 'srcdoc' in iframe;
    if (!isHtmlEmailSupported) {
        return <div>Sorry, your browser cannot securely display external emails :(</div>
    }
    return <div>
        <p><strong>Sent at:</strong> {sentAt?.toLocaleString()}</p>
        <p><strong>From: </strong><DisplayAddresses addresses={mailData.from} /></p>
        <p><strong>To: </strong><DisplayAddresses addresses={mailData.to} /></p>
        <p><strong>Subject:</strong> {mailData.subject}</p>
        <iframe style={{ width: "100%", height: 200 }}
            srcDoc={mailData.html}
            sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin"
            csp="script-src 'none'"
        />
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