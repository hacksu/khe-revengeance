import { promises as fs } from "fs";
import { existsSync } from "fs";
import mailer, {
  ClientResponse,
  MailDataRequired,
  ResponseError
} from "@sendgrid/mail";
import { AttachmentData } from "@sendgrid/helpers/classes/attachment";
import * as cheerio from "cheerio";
import { convert as convertToText } from "html-to-text";
import { MongoDataProvider } from "remult/remult-mongo";

import { RemoteProcedures } from "../global-includes/rpc-declarations.ts";
import { config } from "./config.ts";
import { TicketMessage } from "../global-includes/support-ticket.ts";
import { Email, EmailTemplates, ImportedEmail } from "../global-includes/email-address.ts";
import path from "path";

const basicSend = mailer.send;

mailer.send = async function safeSend(message: MailDataRequired) {
  // note: this will only filter messages with multiple recipients
  if (config.outgoingEmailWhitelist && Array.isArray(message.to)) {
    message = {
      ...message,
      to: message.to.filter((e) =>
        typeof e === "string"
          ? config.outgoingEmailWhitelist?.includes(e)
          : config.outgoingEmailWhitelist?.includes(e.email)
      ),
    };
  }

  // to halt all mail:
  // return [{statusCode: 0, body: {}, headers: {}}, {}];

  return new Promise((resolve) =>
    basicSend.call(
      mailer,
      message,
      undefined,
      (err: Error | ResponseError, result: [ClientResponse, {}]) => {
        if (err) {
          console.error("could not send email!");
          console.error("attempted to send:");
          console.error(message);
          console.error("got error:");
          console.log(err);
          console.error("result:");
          console.error(result);
          if ((err as any).response?.body) {
            console.error("body:");
            console.error(JSON.stringify((err as any).response.body, null, 4));
          }
        }
        resolve(result);
      }
    )
  );
};

function textToHTML(text: string) {
  return (
    `<p style="font-size: 1em; color: black; background-color: white; font-family: sans-serif">` +
    text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .split("\n")
      .join("<br />") +
    "</p>"
  );
}

// based on https://making.close.com/posts/rendering-untrusted-html-email-safely
function addSafeHead(document: cheerio.CheerioAPI) {
  // assuming cheerio is not in fragment mode, it will always add a <head> when
  // it loads a document
  document("head *").remove();
  document("head").prepend(
    `
    <meta http-equiv="Content-Security-Policy" content="script-src 'none'">
    <base target="_blank">
    <style> * { font-family: sans-serif; } </style>`
  );
  return document;
}

/**
 * Returns a message with both text and html fields and sanitized HTML. all
 * received messages should be sent here immediately
 */
export function validateMessageFields(message: TicketMessage) {
  let untrustedHTML = "";
  let textResult = "";
  if (message.html && message.html.trim().length > 0) {
    untrustedHTML = message.html;
  } else {
    untrustedHTML = textToHTML(message.text);
  }
  const htmlResult = addSafeHead(cheerio.load(untrustedHTML));
  if (message.text && message.text.trim().length > 0) {
    textResult = message.text;
  } else {
    textResult = convertToText(htmlResult.html()) || "";
  }
  return {
    ...message,
    html: htmlResult.html(),
    text: textResult,
  };
}

/**
 * Takes an HTML string "intro" and puts it at the beginning of the html and text
 * fields of the returned message. this assumes that both of those fields exist
 * in the first place; use `validateMessageFields` to guarantee this
 */
function addEmailIntro(introHTML: string, message: TicketMessage) {
  const html = cheerio.load(message.html);
  // cheerio's load should ensure a body element
  const body = html("body");
  body.prepend(introHTML);
  return {
    ...message,
    html: html.html(),
    text: convertToText(html.html()),
  };
}

mailer.setApiKey(config.sendgridKey);

export function defineRemoteProcedures() {
  // TODO: why is validateMessageFields a free function at all?
  RemoteProcedures.sanitizeMessage = function (message) {
    return validateMessageFields(message);
  };
  RemoteProcedures.sendSupportAlert = async function (
    ticket,
    message,
    newTicket
  ) {
    const intro =
      (newTicket
        ? "<p>A new support ticket was just created.</p>"
        : "<p>A new email was received regarding a support ticket.</p>") +
      `<p>
          <strong>
            <a href="${config.staffSite}/tickets?ticket=${ticket.id}">
              View thread and reply
            </a>
          </strong>
        </p>` +
      `<p><strong>From:</strong> "${message.theirName}" &lt;${message.theirEmail}&gt;</p>` +
      (newTicket
        ? ""
        : `<p><strong>Original ticket subject:</strong> ${ticket.originalSubject}</p>`) +
      `<p><strong>New message's subject:</strong> ${message.subject}</p>
      <p><strong>Message body:</strong><br />`;

    const alertMessage = addEmailIntro(intro, validateMessageFields(message));

    const msg: MailDataRequired = {
      to: config.supportEmailRecipient,
      from: {
        name: "KHE Support Ticket Alert",
        email: "noreply@khe.io",
      },
      subject:
        (newTicket ? "New Ticket: " : "New Message: ") + ticket.originalSubject,
      text: alertMessage.text,
      html: alertMessage.html,
      asm: {
        groupId: 21989, // ID for "KHE Support Ticket Alerts" on sendgrid
      },
    };
    const sendResult = await mailer.send(msg);
    console.log(
      `sent email to ${config.supportEmailRecipient} through sendgrid ` +
        `at ${new Date()} for support ticket ` +
        `${ticket.id}, received status code:`,
      sendResult[0].statusCode
    );
  };

  RemoteProcedures.sendSupportReply = async function (
    ticket,
    message,
    prevMessageID
  ) {
    const msg: MailDataRequired = {
      to: {
        name: message.theirName,
        email: message.theirEmail,
      },
      from: {
        name: message.ourName,
        email: message.ourEmail,
      },
      replyTo: {
        name: message.ourName,
        email: `ticket+${ticket.id}@${config.incomingEmailHost}`,
      },
      headers: prevMessageID
        ? {
            "In-Reply-To": `<${prevMessageID}>`,
            References: `<${prevMessageID}>`,
          }
        : {},
      subject: message.subject,
      text: message.text,
      html: message.html,
      trackingSettings: {
        subscriptionTracking: {
          enable: false,
        },
      },
    };
    const sendResult = await mailer.send(msg);
    if (sendResult?.length) {
      console.log(
        `sent email through sendgrid at ${new Date()} for support ticket ` +
          `${ticket.id}, received status code:`,
        sendResult[0].statusCode
      );
    }
  };

  RemoteProcedures.sendUpdate = async function (emailHtmlFile: string, address: string) {
    const emailBody = await fs.readFile(emailHtmlFile, {
      encoding: "utf-8",
    });
    const msg: MailDataRequired = {
      to: {
        email: address,
      },
      from: {
        name: "KHE Updates",
        email: `updates@khe.io`,
      },
      subject: "KHE Updates",
      html: emailBody,
      text: convertToText(emailBody),
      asm: {
        groupId: 22053, // KHE 2024 Updates
        groupsToDisplay: [22053],
      },
    };
    const sendResult = await mailer.send(msg);
    console.log(
      `sent email through sendgrid at ${new Date()} for signup ` +
        `${address}, received status code:`,
      sendResult[0].statusCode
    );
  };

  // TODO: better system for grabbing email content than raw relative file paths
  RemoteProcedures.sendTemplateEmail = async function (template: EmailTemplates, address: string) {
    await RemoteProcedures.sendUpdate(`./server/emails/${template}.html`, address);
  }

  RemoteProcedures.getDistinct = async function (collection, field) {
    const mongo = MongoDataProvider.getDb();
    const coll = mongo.db.collection(collection);
    const distincts = await coll.distinct(field);
    return distincts;
  };

  RemoteProcedures.bulkDelete = async function (collection, filter) {
    const mongo = MongoDataProvider.getDb();
    const coll = mongo.db.collection(collection);
    await coll.deleteMany(filter);
  };

  RemoteProcedures.sendTo = async function (
    addresses: Email[],
    subject: string,
    from: {
      email: string;
      name: string;
    },
    contentHTML: string,
    attachments?: AttachmentData | AttachmentData[]
  ) {
    // make unique
    addresses = Array.from(new Set(addresses));
    const MAX_PER_REQUEST = 1000;
    const message: MailDataRequired = {
      from,
      subject,
      // using cheerio to convert fragments into documents
      html: cheerio.load(contentHTML).html(),
      text: convertToText(contentHTML),
      asm: {
        groupId: 22053, // KHE 2023 Updates
        groupsToDisplay: [22053],
      },
    };
    for (let i = 0; i < Math.ceil(addresses.length / MAX_PER_REQUEST); ++i) {
      const recipientBatch = addresses.slice(
        i * MAX_PER_REQUEST,
        (i + 1) * MAX_PER_REQUEST
      );
      console.log("recipientBatch", recipientBatch);
      const sendResult = await mailer.send({
        ...message,
        personalizations: recipientBatch.map((e) => ({ 
          to: e.address,
          substitutions: {
            "name": e.name ?? "N/A",
            "organization": e.organization ?? "NONE",
          }
        })),
        isMultiple: true,
        attachments: attachments ? (Array.isArray(attachments) ? attachments : [attachments]) : []
      });
      console.log(
        `sent bulk email through sendgrid at ${new Date()} from staff site, ` +
          `received status code:`,
        sendResult[0].statusCode
      );
    }
    return { ...message, to: addresses.map(e => e.address) };
  };

  const resumePath = path.join(".", "server", "uploads", "resumes");
  const getUserResumePath = (userID: string) => path.join(resumePath, userID);

  RemoteProcedures.getUserResumeFilename = async (userID) => {
    const userResumePath = getUserResumePath(userID);
    if (!existsSync(userResumePath)){
        return "";
    }
    const files = await fs.readdir(userResumePath);
    if (!files.length) {
        return "";
    } else {
        return files[0];
    }
  };

  RemoteProcedures.setUserResume = async (userID, base64resume, resumeFilename) => {
    resumeFilename = path.parse(resumeFilename).base;  // make sure this isn't a path
    const userResumePath = getUserResumePath(userID);
    if (!existsSync(userResumePath)) {
        await fs.mkdir(userResumePath, {recursive: true});
    } else {
        const files = await fs.readdir(userResumePath);
        await Promise.all(
            files.map((f) => fs.unlink(path.resolve(userResumePath, f)))
        );
    }
    if (base64resume){
        const userResumeFilePath = path.join(userResumePath, resumeFilename || "untitled.pdf");
        const bufferData = Buffer.from(base64resume, 'base64');
        await fs.writeFile(userResumeFilePath, bufferData);
    }
  };
}
