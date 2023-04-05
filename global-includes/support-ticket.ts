import { BackendMethod, Entity, Fields, remult } from "remult";
import { RemoteProcedures } from "./rpc-declarations.ts";
import { rawObj } from "./adaptations.ts";
import { UserRole } from "./common.ts";

export interface Message {
  date: Date;
  incoming: boolean;
  subject: string;
  text: string;
  html: string;
  attachments: string[];
}

@Entity("tickets", { allowApiCrud: UserRole.Admin })
export class SupportTicket {
  @Fields.uuid()
  id!: string;

  @Fields.autoIncrement()
  plusCode!: number;

  @Fields.createdAt()
  createdAt = new Date();

  @Fields.string()
  originalSubject = "";

  @Fields.string()
  theirEmail = "";

  @Fields.string()
  theirName = "";

  @rawObj()
  messages: Message[] = [];
}

export class SupportTicketController {
  @BackendMethod({ allowed: true })
  static async createTicketAndSendAlert(ticket: SupportTicket) {
    if (ticket.messages.length == 0) {
      console.warn("ticket without message sent to backend");
      return;
    } else if (ticket.messages.length > 1) {
      console.warn("ticket with too many messages sent to backend");
      return;
    }

    // making sure these are normal by setting them here in the backend
    ticket.messages[0].date = new Date();
    ticket.messages[0].incoming = true;
    ticket.messages[0].attachments = [];

    const emailRepo = remult.repo(SupportTicket);
    const savedTicket = await emailRepo.insert(ticket);
    await RemoteProcedures.sendSupportAlert(
      savedTicket,
      savedTicket.messages[0]
    );
  }

  @BackendMethod({ allowed: [UserRole.Staff, UserRole.Admin] })
  static async addMessageAndSend(message: Message, plusCode: number) {
    const tickets = remult.repo(SupportTicket);
    let ticket = await tickets.findFirst({ plusCode });
    if (ticket) {
      ticket.messages.push(message);
      ticket = await tickets.save(ticket);
      await RemoteProcedures.sendSupportReply(ticket, message);
    } else {
      console.warn(
        "could not find ticket for outgoing email w/ plus code",
        plusCode
      );
    }
  }
}
