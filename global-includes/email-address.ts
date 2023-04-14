import {
  BackendMethod,
  Entity,
  dbNamesOf,
  Fields,
  remult,
  IdEntity,
} from "remult";
import { UserRole } from "./common.ts";
import { User } from "./users.ts";
import { RemoteProcedures } from "./rpc-declarations.ts";
import { VFields } from "./adaptations.ts";
import { MailDataRequired } from "@sendgrid/mail";

export enum EmailSource {
  // reserved for emails drawn directly from user accounts
  SiteUsers = "SiteUsers",
  Early2023 = "2023EarlySignup",
}

export const isEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

@Entity<Email>("emails", {
  allowApiCrud: UserRole.Admin,
  id: (e) => [e.address, e.source],
})
export class Email {
  @Fields.createdAt()
  subscribedAt = new Date();

  @VFields.string({
    validate: (email: Email) => {
      if (email.address.trim().length < 3) {
        throw "Email too short";
      } else if (!isEmailRegex.test(email.address)) {
        // regex from https://stackoverflow.com/a/9204568
        throw "Email not valid";
      }
    },
  })
  address = "";

  @VFields.string()
  source: EmailSource | string = EmailSource.Early2023;

  @BackendMethod({ allowed: true })
  static async addEmailAndSendWelcome(email: Partial<Email>) {
    RemoteProcedures.sendWelcome(await remult.repo(Email).insert(email));
  }

  @BackendMethod({ allowed: [UserRole.Admin, UserRole.Staff] })
  static async getEmailSources() {
    const coll = (await dbNamesOf(Email)).$entityName;
    const sources = await RemoteProcedures.getDistinct(coll, "source");
    for (const hardCodedSource of Object.values(EmailSource)) {
      if (sources.indexOf(hardCodedSource) == -1) {
        sources.push(hardCodedSource);
      }
    }
    return sources;
  }

  @BackendMethod({ allowed: [UserRole.Admin, UserRole.Staff] })
  static async getEmailList(source?: string) {
    const order = { orderBy: { subscribedAt: "desc" as "desc" } };
    let fromList = await remult
      .repo(Email)
      .find(source ? { where: { source: source }, ...order } : order);
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

  @BackendMethod({ allowed: [UserRole.Admin, UserRole.Staff] })
  static async bulkAdd(source: string, addresses: string[]) {
    await remult.repo(Email).insert(
      addresses.map((a) => ({
        address: a,
        source: source,
      }))
    );
    return await Email.getEmailList(source);
  }

  @BackendMethod({ allowed: [UserRole.Admin, UserRole.Staff] })
  static async bulkDelete(source: string) {
    const coll = (await dbNamesOf(Email)).$entityName;
    try {
      await RemoteProcedures.bulkDelete(coll, { source });
    } catch (e) {
      console.error(e);
    }
  }
}

@Entity("emailListNotes", { allowApiCrud: [UserRole.Admin, UserRole.Staff] })
export class EmailListNotes {
  @VFields.string()
  listName = "";

  @VFields.string()
  notes = "";
}

@Entity("sentListMail", { allowApiCrud: [UserRole.Admin, UserRole.Staff] })
export class SentListMail extends IdEntity {
  @Fields.json()
  mailData!: MailDataRequired;

  @Fields.createdAt()
  sentAt = new Date();

  @BackendMethod({ allowed: [UserRole.Admin, UserRole.Staff] })
  static async sendToLists(
    lists: string[],
    subject: string,
    from: {
      email: string;
      name: string;
    },
    contentHTML: string
  ) {
    let addresses: string[] = [];
    for (const list of lists) {
      addresses = addresses.concat(
        (await Email.getEmailList(list)).map((e) => e.address)
      );
    }

    const sentData = await RemoteProcedures.sendTo(
      addresses,
      subject,
      from,
      contentHTML
    );
    await remult.repo(SentListMail).insert({ mailData: sentData });
  }
}
