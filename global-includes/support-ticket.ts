import { BackendMethod, Entity, Fields, Validators, remult } from "remult";
import { RemoteProcedures } from "./rpc-declarations.ts";
import { VFields } from "./adaptations.ts";
import { UserRole } from "./common.ts";
import { IdEntity } from "remult";

@Entity("ticketMessages", { allowApiCrud: [UserRole.Admin, UserRole.Staff] })
export class TicketMessage {
  @Fields.cuid()
  id!: string;

  @Fields.createdAt()
  date: Date = new Date();

  @VFields.boolean()
  incoming: boolean = true;

  @VFields.string({ validate: Validators.required })
  subject!: string;

  @VFields.string()
  text: string = "";

  @VFields.string()
  html: string = "";

  @Fields.json()
  attachments: string[] = [];

  @VFields.string()
  forTicketID!: string;

  @VFields.string()
  theirName = "";

  @VFields.string()
  theirEmail = "";

  @VFields.string()
  ourName = "";

  @VFields.string()
  ourEmail = "";
}

export enum TicketStatus {
  open = "Open",
  closed = "Closed",
}

/**
 * This class stores data on each support ticket. The idea is that it stores the
 * information that needs to be loaded and displayed for all tickets on the
 * support ticket page (which is why e.g. unreadCount exists; if we marked
 * individual messages as read or unread, we'd need extra queries to get unread
 * counts to display)
 */
@Entity<SupportTicket>("tickets", {
  allowApiCrud: [UserRole.Admin, UserRole.Staff],
})
export class SupportTicket {
  @Fields.cuid()
  id!: string;

  @Fields.createdAt()
  createdAt = new Date();

  @Fields.updatedAt()
  updatedAt = new Date();

  @VFields.string()
  originalSubject = "";

  @VFields.number()
  unreadCount = 1;

  @VFields.string()
  status: TicketStatus = TicketStatus.open;

  @VFields.string()
  note = "";

  // this could be like a user id but 🤷‍♂️ just put someone's name or maybe
  // their email so they can receive the updates. store user ids here when
  // profiles exist and accounts are more permanent
  @VFields.string()
  assignedTo = "";
}

export class SupportTicketController {
  /**
   * This is for when tickets are created by someone filling out the contact form on the website.
   */
  @BackendMethod({ allowed: true })
  static async createTicketAndSendAlert(message: TicketMessage) {
    // making sure these are normal by setting them here in the backend
    message.date = new Date();
    message.incoming = true;
    message.attachments = [];

    const ticket = {
      originalSubject: message.subject,
    };

    const emailRepo = remult.repo(SupportTicket);
    const ticketRepo = remult.repo(TicketMessage);
    const savedTicket = await emailRepo.insert(ticket);
    const savedMessage = await ticketRepo.insert(message);
    await RemoteProcedures.sendSupportAlert(savedTicket, savedMessage, true);
  }

  @BackendMethod({ allowed: [UserRole.Staff, UserRole.Admin] })
  static async addMessageAndSend(message: TicketMessage) {
    const messages = remult.repo(TicketMessage);
    await messages.insert(message);
    const tickets = remult.repo(SupportTicket);
    let ticket = await tickets.findFirst({ id: message.forTicketID });
    if (ticket) {
      await RemoteProcedures.sendSupportReply(ticket, message);
    } else {
      console.warn(
        "could not find ticket for outgoing email w/ plus code",
        message.forTicketID
      );
    }
  }
}

/**
 * This stores received emails in the most basic way possible so we can check on
 * emails that caused errors, e.g. they couldn't be matched with a specific
 * ticket. "processed" emails are those that almost definitely were matched with
 * a ticket and added to the TicketMessages table and probably don't need to be
 * worried about.
 */
@Entity("raw-emails", {
  allowApiCrud: false,
  allowApiRead: [UserRole.Admin, UserRole.Staff],
})
export class RawEmail extends IdEntity {
  @Fields.json()
  body: any = {};

  @Fields.json()
  files: any = [];

  @Fields.boolean()
  processed: boolean = true;
}
