import { Entity, Fields } from "remult";
import { UserRole } from "./users.ts";

@Entity<Email>("emails", {
  allowApiCrud: UserRole.Admin,
  allowApiInsert: true,
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
  source = "2023EarlySignup";
}
