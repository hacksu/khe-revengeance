import { BackendMethod, Entity, Fields, remult } from "remult";
import { RemoteProcedures } from "./rpc-declarations.ts";
import { rawObj } from "./adaptations.ts";
import { UserRole } from "./common.ts";

export interface Message {
  date: Date;
  incoming: boolean;
  plusCode: number;
  subject: String;
  text: String;
  html: String;
  attachments: String[];
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
  subject = "";

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
    const emailRepo = remult.repo(SupportTicket);
    await RemoteProcedures.sendAlert(
      await emailRepo.save(ticket),
      ticket.messages[0]
    );
  }

  @BackendMethod({ allowed: false })
  static async addToConversation(message: Message) {
    const tickets = remult.repo(SupportTicket);
    const ticket = await tickets.findFirst({ plusCode: message.plusCode });
    if (ticket) {
      ticket.messages.push(message);
      await tickets.save(ticket);
      if (!message.incoming) {
        // rpc: actually send email to person
      } else {
        // rpc: send alert mail to receiving account
      }
    } else {
      console.error(
        "could not find ticket for incoming email w/ plus code",
        message.plusCode
      );
    }
  }
}
