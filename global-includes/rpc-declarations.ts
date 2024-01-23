import { MailDataRequired } from "@sendgrid/mail";
import { AttachmentData } from "@sendgrid/helpers/classes/attachment";
import { Email } from "./email-address.ts";
import { SupportTicket, TicketMessage } from "./support-ticket.ts";

/**
 * This class declares functions that can be called in remult BackendMethods to
 * do stuff on the server. they are actually defined in server/api.ts, which is
 * only imported on the backend.
 */
export class RemoteProcedures {
  static sendSupportAlert: (
    ticket: SupportTicket,
    message: TicketMessage,
    newTicket: boolean
  ) => Promise<void>;
  static sendSupportReply: (
    ticket: SupportTicket,
    message: TicketMessage,
    prevMessageID: string | undefined
  ) => Promise<void>;
  static sendWelcome: (email: Email) => Promise<void>;
  static getDistinct: (collection: string, field: string) => Promise<string[]>;
  static bulkDelete: (collection: string, filter: any) => Promise<void>;
  static sendTo: (
    addresses: Email[],
    subject: string,
    from: {
      email: string;
      name: string;
    },
    contentHTML: string,
    attachments?: AttachmentData | AttachmentData[]
  ) => Promise<MailDataRequired>;
  static sanitizeMessage: (message: TicketMessage) => TicketMessage;
  static deleteGridImages: (paths: string[]) => Promise<void>;
  static getUserResumeFilename: (userID: string) => Promise<string>;
  /**
   * If `base64Resume` is empty, any existing resume will be deleted
   */
  static setUserResume: (userID: string, base64Resume: string | "", resumeFilename: string) => Promise<void>;
}
