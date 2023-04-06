import type { Express } from "express";
import type { RemultServer } from "remult/server/expressBridge";
import multer from "multer";

import {
  Message,
  SupportTicket,
  TicketStatus,
} from "../global-includes/support-ticket.ts";
import { config } from "./config.ts";
import { getDB } from "./db.ts";
import { validateMessageFields } from "./rpc-definitions.ts";
import { remult } from "remult";
import { RemoteProcedures } from "../global-includes/rpc-declarations.ts";

const parseForm = multer({ dest: "./uploads/email-attachments/" });

export default function enableMail(app: Express, remultConfig: RemultServer) {
  app.post(
    "/obtainMail",
    remultConfig.withRemult,
    parseForm.any(),
    async (req, res) => {
      const rawID = (
        await (await getDB())
          .collection("raw_emails")
          .insertOne({ body: req.body, file: req.file, files: req.files })
      ).insertedId;
      try {
        const envelope = JSON.parse(req.body.envelope);
        const toUs = envelope.to.find((e: string) =>
          e.endsWith(config.supportEmailHost)
        );
        if (!toUs) {
          console.warn(
            "received email with envelope without our address:",
            envelope
          );
          console.warn("email database id:", rawID);
          return;
        }
        let plusCode: number;
        try {
          plusCode = parseInt(toUs.split("@")[0].split("+")[1]);
        } catch {
          console.warn(
            "received email without valid plus code addressed to",
            toUs
          );
          console.warn("email database id:", rawID);
          return;
        }
        const message: Message = validateMessageFields({
          subject: req.body.subject,
          html: req.body.html,
          text: req.body.text,
          date: new Date(),
          attachments: [],
          incoming: true,
        });

        const tickets = remult.repo(SupportTicket);
        let ticket = await tickets.findFirst({ plusCode });
        if (ticket) {
          ticket.messages.push(message);
          ticket.hasUnread = true;
          ticket.status = TicketStatus.open;
          ticket = await tickets.save(ticket);
          await RemoteProcedures.sendSupportAlert(ticket, message);
        } else {
          console.warn(
            "could not find ticket for incoming email w/ plus code",
            plusCode
          );
        }
      } catch (e) {
        console.warn("could not process email with db id", rawID);
        console.warn(e);
      }

      res.sendStatus(200);
    }
  );
}
