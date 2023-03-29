import { Entity, Fields } from "remult";

@Entity("emails", { allowApiCrud: false, allowApiInsert: true })
export class Email {
  @Fields.uuid()
  id!: string;

  @Fields.createdAt()
  subscribedAt = new Date();

  @Fields.string()
  address = "";
}
