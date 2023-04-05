import mailer, { MailDataRequired } from "@sendgrid/mail";

import { RemoteProcedures } from "../global-includes/rpc-declarations.ts";
import { config } from "./config.ts";

mailer.setApiKey(config.sendgridKey);

export function defineRemoteProcedures() {
  RemoteProcedures.sendAlert = async function (ticket, message) {
    const timeString =
      ticket.createdAt.toLocaleString("en-US", {
        timeZone: "America/New_York",
      }) + " US Eastern Time";

    const intro =
      `ticket id: ${ticket.id}\n` +
      `ticket created at: ${timeString}\n` +
      `sender name: ${ticket.theirName}\nsender email: ${ticket.theirEmail}\n` +
      `subject: ${ticket.subject}\n`;

    const msg: MailDataRequired = {
      to: config.supportEmailRecipient,
      from: {
        name: "KHE Support Ticket Alert",
        email: "khe-support-ticket@em3798.khe.io",
      },
      subject: "New Message: " + ticket.subject,
      text: intro + `body:\n\n${message.text}\n\n\n`,
      html: intro + message.html,
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
