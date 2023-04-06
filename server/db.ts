import { Db, MongoClient } from "mongodb";
import { MongoDataProvider } from "remult/remult-mongo";
import { remultExpress } from "remult/remult-express";
import { Email } from "../global-includes/email-address.ts";
import {
  SupportTicket,
  SupportTicketController,
} from "../global-includes/support-ticket.ts";
import { User } from "../global-includes/users.ts";
import { config } from "../server/config.ts";

let client: MongoClient | undefined;
let db: Db | undefined;

export async function getDBClient() {
  if (!client) {
    console.log("connecting to mongodb...");
    client = new MongoClient(config.mongoURI);
    await client.connect();
  }
  return client;
}

export async function getDB() {
  if (!db) {
    const client = await getDBClient();
    db = client.db(config.mongoURI.split("/").slice(-1)[0]);
  }
  return db;
}

export const remultConfig = remultExpress({
  async initRequest(request, options) {
    options.remult.context.incomingIP =
      request.header("X-Real-IP") || request.ip;
  },
  dataProvider: async () => {
    return new MongoDataProvider(await getDB(), await getDBClient());
  },
  entities: [Email, SupportTicket, User],
  controllers: [SupportTicketController],
});
