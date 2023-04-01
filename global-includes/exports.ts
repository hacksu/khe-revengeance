import { MongoClient } from "mongodb";
import { MongoDataProvider } from "remult/remult-mongo";
import { remultExpress } from "remult/remult-express";
import { Email } from "./email-address.js";
import { SupportTicket, SupportTicketController } from "./support-ticket.js";
import { User } from "./users.js";

export const remultConfig = remultExpress({
  dataProvider: async () => {
    console.log("connecting to mongodb...");
    const client = new MongoClient("mongodb://127.0.0.1:27017/khe2023");
    await client.connect();
    return new MongoDataProvider(client.db("khe2023"), client);
  },
  entities: [Email, SupportTicket, User],
  controllers: [SupportTicketController],
});
