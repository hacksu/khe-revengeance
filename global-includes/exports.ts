import { Email } from "./email-address.js";
import { SupportTicket, SupportTicketController } from "./support-ticket.js";

export const dbConfig = {
  entities: [Email, SupportTicket],
  controllers: [SupportTicketController],
};
