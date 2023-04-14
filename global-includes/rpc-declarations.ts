import { MailDataRequired } from "@sendgrid/mail";
import { Email } from "./email-address.ts";
import { SupportTicket, Message } from "./support-ticket.ts";

/**
 * This class declares functions that can be called in remult BackendMethods to
 * do stuff on the server. they are actually defined in server/api.ts, which is
 * only imported on the backend.
 */
export class RemoteProcedures {
  static sendSupportAlert: (
    ticket: SupportTicket,
    message: Message
  ) => Promise<void>;
  static sendSupportReply: (
    ticket: SupportTicket,
    message: Message
  ) => Promise<void>;
  static sendWelcome: (email: Email) => Promise<void>;
  static getDistinct: (collection: string, field: string) => Promise<string[]>;
  static bulkDelete: (collection: string, filter: any) => Promise<void>;
  static sendTo: (
    addresses: string[],
    subject: string,
    from: {
      email: string;
      name: string;
    },
    contentHTML: string
  ) => Promise<MailDataRequired>;
}
