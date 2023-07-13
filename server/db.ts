import { Db, MongoClient } from "mongodb";
import { MongoDataProvider } from "remult/remult-mongo";
import { remultExpress } from "remult/remult-express";
import {
  Email,
  EmailListNotes,
  SentListMail,
} from "../global-includes/email-address.ts";
import {
  RawEmail,
  SupportTicket,
  SupportTicketController,
  TicketMessage,
} from "../global-includes/support-ticket.ts";
import { User } from "../global-includes/users.ts";
import { config } from "../server/config.ts";
import { Redirect } from "../global-includes/redirect-link.ts";
import { GridImage } from "../global-includes/image-grid.ts";

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
    options.remult.context.incomingIP = request.ip;
  },
  dataProvider: async () => {
    return new MongoDataProvider(await getDB(), await getDBClient());
  },
  entities: [
    Email,
    SupportTicket,
    User,
    SentListMail,
    EmailListNotes,
    RawEmail,
    TicketMessage,
    Redirect,
    GridImage
  ],
  controllers: [SupportTicketController],
});
