import { remultExpress } from "remult/remult-express";
import { Email } from "./email-address.js";
import { SupportTicket, SupportTicketController } from "./support-ticket.js";
import { User } from "./users.js";

export const remultConfig = remultExpress({
  entities: [Email, SupportTicket, User],
  controllers: [SupportTicketController],
});
