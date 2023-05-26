import path from "path";

import type { Express } from "express";
import type { RemultServer } from "remult/server/expressBridge";
import multer from "multer";
import parseAddress, { ParsedMailbox } from "email-addresses";

import {
  TicketMessage,
  RawEmail,
  SupportTicket,
  TicketStatus,
} from "../global-includes/support-ticket.js";
import { config, projectRoot } from "./config.js";
import { validateMessageFields } from "./rpc-definitions.js";
import { remult } from "remult";
import { RemoteProcedures } from "../global-includes/rpc-declarations.js";

const parseForm = multer({
  dest: path.resolve(projectRoot, "server/uploads/email-attachments/"),
});

export default function enableMail(app: Express, remultConfig: RemultServer) {
  app.post(
    "/obtainMail",
    remultConfig.withRemult,
    parseForm.any(),
    /**
     * Receives emails from the SendGrid inbound parse webhook. Email parsing is hell.
     */
    async (req, res) => {
      const savedRaw = await remult
        .repo(RawEmail)
        .insert({ body: req.body, files: req.files });
      try {
        const parsedFrom = parseAddress(req.body.from)!
          .addresses[0] as ParsedMailbox;
        const parsedTo = parseAddress(req.body.to)!
          .addresses as ParsedMailbox[];

        const toUs = parsedTo.find((e) =>
          e.address.endsWith(config.supportEmailHost)
        );
        if (!toUs) {
          console.warn(
            "received email with envelope without our address:",
            parsedTo
          );
          console.warn("email database id:", savedRaw.id);
          return;
        }
        let plusCode: string;
        try {
          plusCode = toUs.address.split("@")[0].split("+")[1];
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

        const tickets = remult.repo(SupportTicket);
        const messages = remult.repo(TicketMessage);

        let message = validateMessageFields({
          ...new TicketMessage(),
          subject: req.body.subject,
          html: req.body.html,
          text: req.body.text,
          date: new Date(),
          attachments: [],
          incoming: true,
          forTicketID: plusCode,
          theirEmail: parsedFrom.address,
          theirName: parsedFrom.name || "",
          ourEmail: toUs.address,
          ourName: toUs.name || "",
        });
        let ticket = await tickets.findFirst({ id: plusCode });
        if (ticket) {
          ticket.unreadCount += 1;
          ticket.status = TicketStatus.open;
          ticket = await tickets.save(ticket);
          message = await messages.save(message);
          await RemoteProcedures.sendSupportAlert(ticket, message, false);
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
