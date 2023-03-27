import { Entity, Fields } from "remult";

@Entity("emails", { allowApiCrud: true })
export class Email {
  @Fields.uuid()
  id!: string;

  @Fields.createdAt()
  subscribedAt = new Date();

  @Fields.string()
  address = "";
}
