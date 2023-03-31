import { remultExpress } from "remult/remult-express";
import { Email } from "./email-address.js";
import { SupportTicket, SupportTicketController } from "./support-ticket.js";

export const remultConfig = remultExpress({
  entities: [Email, SupportTicket],
  controllers: [SupportTicketController],
});
