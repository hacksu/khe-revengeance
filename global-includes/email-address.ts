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

export type ImportedEmail = {
  address: string;
  name?: string;
  organization?: string;
};

export enum EmailSource {
  // reserved for emails drawn directly from user accounts
  SiteUsers = "SiteUsers",
  Early2023 = "2023EarlySignup",
}

// TODO: maybe replace with zod's email validation, for consistency
export const isEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

@Entity<Email>("emails", {
  allowApiCrud: UserRole.Admin,
})
export class Email {
  @Fields.cuid()
  id = "";

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

  @Fields.string()  
  name = "";

  @Fields.string()
  organization = "";

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
        fromUsers.map((u, i) => ({
          id: "user" + i,
          address: u.email,
          name: u.registration.name,
          organization: u.registration.school,
          subscribedAt: u.createdAt,
          source: EmailSource.SiteUsers,
        }))
      );
    }
    return fromList;
  }

  @BackendMethod({allowed: [UserRole.Admin, UserRole.Staff]})
  static async getEmailListFields(lists: string[]){
    const fields = new Set();
    for (const list of lists){
      for (const email of await remult.repo(Email).find({where: {source: list}})){
        for (const key of (Object.keys(email) as Array<keyof Email>)){
          if (email[key] &&
              (typeof email[key] === "string" && (email[key] as string).trim())
          ){
            fields.add(key);
          }
        }
      }
    }
    return Array.from(fields);
  }

  @BackendMethod({ allowed: [UserRole.Admin, UserRole.Staff] })
  static async bulkAdd(source: string, addresses: ImportedEmail[]) {
    await remult.repo(Email).insert(
      addresses.map(({ address, name, organization }) => ({
        address,
        name,
        organization,
        source,
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

  @BackendMethod({ allowed: [UserRole.Admin, UserRole.Staff] })
  static async bulkRename(oldList: string, newList: string) {
    // could replace this with a more efficient mongodb updateMany RPC
    const repo = remult.repo(Email);
    for await (const email of repo.query({ where: { source: oldList } })) {
      await repo.update(repo.metadata.idMetadata.getId(email), {
        ...email,
        source: newList,
      });
    }
  }
}

@Entity<EmailListNotes>("emailListNotes", {
  allowApiCrud: [UserRole.Admin, UserRole.Staff],
  id: (e) => e.listName,
})
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
    let addresses: Email[] = [];
    for (const list of lists) {
      addresses = addresses.concat(
        (await Email.getEmailList(list))
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
