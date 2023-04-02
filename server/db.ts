import { MongoClient } from "mongodb";
import { MongoDataProvider } from "remult/remult-mongo";
import { remultExpress } from "remult/remult-express";
import { Email } from "../global-includes/email-address.js";
import {
  SupportTicket,
  SupportTicketController,
} from "../global-includes/support-ticket.js";
import { User } from "../global-includes/users.js";
import { config } from "../server/config.js";

export const remultConfig = remultExpress({
  dataProvider: async () => {
    console.log("connecting to mongodb...");
    const client = new MongoClient(config.mongoURI);
    await client.connect();
    return new MongoDataProvider(
      client.db(config.mongoURI.split("/").slice(-1)[0]),
      client
    );
  },
  entities: [Email, SupportTicket, User],
  controllers: [SupportTicketController],
});
