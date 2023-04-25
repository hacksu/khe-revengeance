import path from "path";

import type { Express } from "express";
import type { RemultServer } from "remult/server/expressBridge";
import multer from "multer";

import {
  Message,
  RawEmail,
  SupportTicket,
  TicketStatus,
} from "../global-includes/support-ticket.ts";
import { config, projectRoot } from "./config.ts";
import { validateMessageFields } from "./rpc-definitions.ts";
import { remult } from "remult";
import { RemoteProcedures } from "../global-includes/rpc-declarations.ts";

const parseForm = multer({
  dest: path.resolve(projectRoot, "server/uploads/email-attachments/"),
});

export default function enableMail(app: Express, remultConfig: RemultServer) {
  app.post(
    "/obtainMail",
    remultConfig.withRemult,
    parseForm.any(),
    async (req, res) => {
      const savedRaw = await remult
        .repo(RawEmail)
        .insert({ body: req.body, files: req.files });
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
          console.warn("email database id:", savedRaw.id);
          return;
        }
        let plusCode: string;
        try {
          plusCode = toUs.split("@")[0].split("+")[1];
          if (!plusCode?.trim()) {
            throw "plus code empty/missing";
          }
        } catch (e) {
          console.warn(
            "received email without valid plus code addressed to",
            toUs
          );
          console.warn("email database id:", savedRaw.id);
          console.warn(e);
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
        let ticket = await tickets.findFirst({ id: plusCode });
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
        console.warn("could not process email with db id", savedRaw.id);
        console.warn(e);
        await remult.repo(RawEmail).save({ ...savedRaw, processed: false });
      }
      res.sendStatus(200);
    }
  );
}
