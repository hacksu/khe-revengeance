import { BackendMethod, Entity, Fields, remult } from "remult";

@Entity("tickets", { allowApiCrud: false })
export class SupportTicket {
  @Fields.uuid()
  id!: string;

  @Fields.createdAt()
  createdAt = new Date();

  @Fields.string()
  subject = "";

  @Fields.string()
  body = "";

  @Fields.string()
  theirEmail = "";

  @Fields.string()
  theirName = "";
}

export class SupportTicketController {
  @BackendMethod({ allowed: true })
  static async addTicketAndSendAlert(ticket: SupportTicket) {
    const emailRepo = remult.repo(SupportTicket);
    await SupportTicketController.sendAlert(await emailRepo.save(ticket));
  }
  static async sendAlert(ticket: SupportTicket) {}
}
