import mailer, { MailDataRequired } from "@sendgrid/mail";

import { RemoteProcedures } from "../global-includes/rpc-declarations.ts";
import { config } from "./config.ts";

mailer.setApiKey(config.sendgridKey);

export function defineRemoteProcedures() {
  RemoteProcedures.sendAlert = async function (ticket) {
    const timeString =
      ticket.createdAt.toLocaleString("en-US", {
        timeZone: "America/New_York",
      }) + " US Eastern Time";
    const msg: MailDataRequired = {
      to: config.supportEmailRecipient,
      from: {
        name: "KHE Support Ticket Alert",
        email: "khe-support-ticket@em3798.khe.io",
      },
      subject: "KHE SUPPORT TICKET: " + ticket.subject,
      text:
        `ticket id: ${ticket.id}\n` +
        `ticket created at: ${timeString}\n` +
        `sender name: ${ticket.theirName}\nsender email: ${ticket.theirEmail}\n` +
        `subject: ${ticket.subject}\n` +
        `body:\n\n${ticket.body}\n\n\n`,
      asm: {
        groupId: 21989, // ID for "KHE Support Ticket Alerts" on sendgrid
      },
    };
    const sendResult = await mailer.send(msg);
    console.log(
      `sent email through sendgrid at ${timeString} for support ticket ` +
        `${ticket.id}, received status code:`,
      sendResult[0].statusCode
    );
  };
}
