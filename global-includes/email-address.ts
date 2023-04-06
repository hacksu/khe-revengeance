import { BackendMethod, Entity, Fields, remult } from "remult";
import { UserRole } from "./common.ts";
import { User } from "./users.ts";
import { RemoteProcedures } from "./rpc-declarations.ts";

export enum EmailSource {
  // reserved for emails drawn directly from user accounts
  SiteUsers = "SiteUsers",
  Early2023 = "2023EarlySignup",
}

@Entity<Email>("emails", {
  allowApiCrud: UserRole.Admin,
  id: (e) => e.address,
})
export class Email {
  @Fields.createdAt()
  subscribedAt = new Date();

  @Fields.string({
    validate: (email: Email) => {
      if (email.address.trim().length < 3) {
        throw "Email too short";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.address)) {
        // regex from https://stackoverflow.com/a/9204568
        throw "Email not valid";
      }
    },
  })
  address = "";

  @Fields.string()
  source: EmailSource = EmailSource.Early2023;

  @BackendMethod({ allowed: true })
  static async addEmailAndSendWelcome(email: Partial<Email>) {
    RemoteProcedures.sendWelcome(await remult.repo(Email).insert(email));
  }

  @BackendMethod({ allowed: UserRole.Admin })
  static async getAllEmails(source?: string) {
    let fromList = await remult
      .repo(Email)
      .find(source ? { where: { source: source } } : {});
    if (source == "SiteUsers") {
      const fromUsers = await remult
        .repo(User)
        .find({ where: { receivingEmails: true } });
      fromList = fromList.concat(
        fromUsers.map((u) => ({
          address: u.email,
          subscribedAt: u.createdAt,
          source: EmailSource.SiteUsers,
        }))
      );
    }
    return fromList;
  }
}
