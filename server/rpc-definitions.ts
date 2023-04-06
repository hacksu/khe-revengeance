import { promises as fs } from "fs";

import mailer, { MailDataRequired } from "@sendgrid/mail";
import * as cheerio from "cheerio";
import xss from "xss";
import { convert as convertToText } from "html-to-text";

import { RemoteProcedures } from "../global-includes/rpc-declarations.ts";
import { config } from "./config.ts";
import { Message } from "../global-includes/support-ticket.ts";
import { Email } from "../global-includes/email-address.ts";

function textToHTML(text: string) {
  return (
    `<p style="font-size: 1em; color: black; background-color: white; font-family: sans-serif">` +
    text.split("\n").join("<br />") +
    "</p>"
  );
}

/**
 * Returns a message with both text and html fields and sanitized HTML. all
 * received messages should be sent here immediately
 */
export function validateMessageFields(message: Message) {
  let htmlResult = "";
  let textResult = "";
  if (message.html.trim().length > 0) {
    htmlResult = message.html;
  } else {
    htmlResult = textToHTML(message.text);
  }
  htmlResult = xss(htmlResult);
  if (message.text.trim().length > 0) {
    textResult = message.text;
  } else {
    textResult = cheerio.load(htmlResult).text();
  }
  return {
    ...message,
    html: htmlResult,
    text: textResult,
  };
}

/**
 * Takes a text string "intro" and puts it at the beginning of the html and text
 * fields of the returned message. this assumes that both of those fields exist
 * in the first place; use `validateMessageFields` to guarantee this
 */
function addEmailIntro(intro: string, message: Message) {
  let htmlResult = "";
  let textResult = "";
  const htmlIntro = textToHTML(intro);
  const html = cheerio.load(message.html);
  // cheerio's load should ensure a body element
  const body = html("body");
  body.prepend(htmlIntro);
  htmlResult = html.html();
  textResult = intro + "\n" + message.text;
  return {
    ...message,
    html: htmlResult,
    text: textResult,
  };
}

mailer.setApiKey(config.sendgridKey);

export function defineRemoteProcedures() {
  RemoteProcedures.sendSupportAlert = async function (ticket, message) {
    const timeString =
      ticket.createdAt.toLocaleString("en-US", {
        timeZone: "America/New_York",
      }) + " US Eastern Time";

    const intro =
      `ticket id: ${ticket.id}\n` +
      `ticket created at: ${timeString}\n` +
      `sender name: ${ticket.theirName}\nsender email: ${ticket.theirEmail}\n` +
      `original ticket subject: ${ticket.originalSubject}\n` +
      `this message's subject: ${message.subject}`;

    const alertMessage = addEmailIntro(intro, validateMessageFields(message));

    const msg: MailDataRequired = {
      to: config.supportEmailRecipient,
      from: {
        name: "KHE Support Ticket Alert",
        email: "noreply@khe.io",
      },
      subject:
        (ticket.messages.length == 1 ? "New Ticket: " : "New Message: ") +
        ticket.originalSubject,
      text: alertMessage.text,
      html: alertMessage.html,
      asm: {
        groupId: 21989, // ID for "KHE Support Ticket Alerts" on sendgrid
      },
    };
    const sendResult = await mailer.send(msg);
    console.log(
      `sent email through sendgrid at ${new Date()} for support ticket ` +
        `${ticket.id}, received status code:`,
      sendResult[0].statusCode
    );
  };

  RemoteProcedures.sendSupportReply = async function (ticket, message) {
    const msg: MailDataRequired = {
      to: {
        name: ticket.theirName,
        email: ticket.theirEmail,
      },
      from: {
        name: "KHE Support",
        email: `tickets@khe.io`,
      },
      replyTo: {
        email: `ticket+${ticket.plusCode}@${config.supportEmailHost}`,
      },
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
    console.log(
      `sent email through sendgrid at ${new Date()} for support ticket ` +
        `${ticket.id}, received status code:`,
      sendResult[0].statusCode
    );
  };

  RemoteProcedures.sendWelcome = async function (email: Email) {
    const emailBody = await fs.readFile("./server/emails/welcome.html", {
      encoding: "utf-8",
    });
    const msg: MailDataRequired = {
      to: {
        email: email.address,
      },
      from: {
        name: "KHE Updates",
        email: `updates@khe.io`,
      },
      subject: "KHE Updates",
      html: emailBody,
      text: convertToText(emailBody),
      asm: {
        groupId: 22053, // KHE 2023 Updates
        groupsToDisplay: [22053],
      },
    };
    const sendResult = await mailer.send(msg);
    console.log(
      `sent email through sendgrid at ${new Date()} for signup ` +
        `${email.address}, received status code:`,
      sendResult[0].statusCode
    );
  };
}
