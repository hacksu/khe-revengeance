import mailer, { MailDataRequired } from "@sendgrid/mail";
import secrets from "../secrets.json" assert { type: "json" };
import { SupportTicketController } from "../global-includes/support-ticket.js";

mailer.setApiKey(secrets.sendgridKey);

SupportTicketController.sendAlert = async function (ticket) {
  const msg: MailDataRequired = {
    to: secrets.supportEmailRecipient,
    from: {
      name: "KHE Support Ticket Alert",
      email: "khe-support-ticket@em3798.khe.io",
    },
    subject: "KHE SUPPORT TICKET: " + ticket.subject,
    text:
      `from: ${ticket.theirName}, ${ticket.theirEmail}\n` +
      `time: ${ticket.createdAt.toLocaleString()}\n` +
      `subject: ${ticket.subject}\n` +
      `body:\n ${ticket.body}\n\n\n`,
    asm: {
      groupId: 21989, // ID for "KHE Support Ticket Alerts" on sendgrid
    },
  };
  const sendResult = await mailer.send(msg);
  console.log(sendResult);
};

export { SupportTicketController };
