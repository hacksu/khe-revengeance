import mailer, { MailDataRequired } from "@sendgrid/mail";
import secrets from "../secrets.json" assert { type: "json" };
import { SupportTicketController } from "../global-includes/support-ticket.js";

mailer.setApiKey(secrets.sendgridKey);

SupportTicketController.sendAlert = async function (ticket) {
  const msg: MailDataRequired = {
    to: secrets.supportEmailRecipient,
    from: "khe-support-ticket@em3798.khe.io",
    subject: "KHE SUPPORT TICKET: " + ticket.subject,
    text:
      `from: ${ticket.theirName} at ${ticket.theirEmail}\n` +
      `at: ${ticket.createdAt.toLocaleString()}\n` +
      `subject: ${ticket.subject}\n` +
      `body: ${ticket.body}`,
    asm: {
      groupId: 21989,
    },
  };
  const sendResult = await mailer.send(msg);
  console.log(sendResult);
};

export { SupportTicketController };
