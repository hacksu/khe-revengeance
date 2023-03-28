import { BackendMethod, Entity, Fields, remult } from "remult";

@Entity("tickets", { allowApiInsert: true })
export class SupportTicket {
  @Fields.uuid()
  id!: string;

  @Fields.createdAt()
  openedAt = new Date();

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
  static async sendEmail(ticket: SupportTicket) {
    const emailRepo = remult.repo(SupportTicket);
    await emailRepo.save(ticket);

    const mailer = (await import("@sendgrid/mail")).default;
    mailer.setApiKey("");

    const msg = {
      to: "test@example.com", // Change to your recipient
      from: "test@example.com", // Change to your verified sender
      subject: "Sending with SendGrid is Fun",
      text: "and easy to do anywhere, even with Node.js",
      html: "<strong>and easy to do anywhere, even with Node.js</strong>",
    };
  }
}
