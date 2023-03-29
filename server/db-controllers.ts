import mailer, { MailDataRequired } from "@sendgrid/mail";
import secrets from "../secrets.json" assert { type: "json" };
import { SupportTicketController } from "../global-includes/support-ticket.js";

mailer.setApiKey(secrets.sendgridKey);

SupportTicketController.sendAlert = async function (ticket) {
  const timeString =
    ticket.createdAt.toLocaleString("en-US", {
      timeZone: "America/New_York",
    }) + " US Eastern Time";
  const msg: MailDataRequired = {
    to: secrets.supportEmailRecipient,
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

export { SupportTicketController };
